import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { A11yBarChartElement, defineA11yBarChart } from '../src/index.js';
import type { A11yBarChartConfig } from '../src/index.js';

const KEY = 'test-disclosures';
const flush = async () => { await Promise.resolve(); await Promise.resolve(); };

async function makeChart(config: A11yBarChartConfig = {}): Promise<A11yBarChartElement> {
  defineA11yBarChart();
  const chart = document.createElement('a11y-bar-chart') as A11yBarChartElement;
  chart.chartTitle = 'Visits';
  chart.config = config;
  chart.data = [{ id: 'a', label: 'Alpha', value: 3, definition: 'First group.' }, { id: 'b', label: 'Beta', value: 5 }];
  document.body.append(chart);
  await flush();
  return chart;
}

const button = (chart: Element, key: 'explain' | 'glossary') => chart.querySelector<HTMLButtonElement>(`[data-focus-key="${key}"]`)!;
const expanded = (chart: Element, key: 'explain' | 'glossary') => button(chart, key).getAttribute('aria-expanded') === 'true';
// Node 25 defines a method-less global localStorage that shadows happy-dom's, so tests use their own.
function memoryStorage(): Storage {
  const items = new Map<string, string>();
  return {
    get length() { return items.size; },
    clear: () => items.clear(),
    getItem: (key: string) => items.get(key) ?? null,
    key: (index: number) => [...items.keys()][index] ?? null,
    removeItem: (key: string) => { items.delete(key); },
    setItem: (key: string, value: string) => { items.set(key, String(value)); }
  };
}
const stored = () => JSON.parse(localStorage.getItem(KEY) ?? 'null') as unknown;

beforeEach(() => { document.body.replaceChildren(); vi.stubGlobal('localStorage', memoryStorage()); });
afterEach(() => { vi.unstubAllGlobals(); vi.restoreAllMocks(); });

describe('disclosureStorageKey', () => {
  it('stores nothing without a key', async () => {
    const chart = await makeChart();
    button(chart, 'explain').click();
    await flush();
    expect(expanded(chart, 'explain')).toBe(true);
    expect(localStorage.length).toBe(0);
  });

  it('saves a user toggle and restores it in a chart created later', async () => {
    const first = await makeChart({ disclosureStorageKey: KEY });
    button(first, 'explain').click();
    await flush();
    expect(stored()).toEqual({ explanationExpanded: true });

    const second = await makeChart({ disclosureStorageKey: KEY });
    expect(expanded(second, 'explain')).toBe(true);
    expect(second.querySelector<HTMLElement>(`#${second.instanceId}-explanation`)!.hidden).toBe(false);
    expect(expanded(second, 'glossary')).toBe(false);
  });

  it('lets the saved choice win over the author default at load, and later config changes still apply', async () => {
    localStorage.setItem(KEY, JSON.stringify({ glossaryExpanded: true }));
    const chart = await makeChart({ disclosureStorageKey: KEY, glossaryExpanded: false });
    expect(expanded(chart, 'glossary')).toBe(true);
    chart.config = { disclosureStorageKey: KEY, glossaryExpanded: true };
    chart.config = { disclosureStorageKey: KEY, glossaryExpanded: false };
    await flush();
    expect(expanded(chart, 'glossary')).toBe(false);
  });

  it('saves only the toggled disclosure and keeps other fields in the record', async () => {
    localStorage.setItem(KEY, JSON.stringify({ explanationExpanded: true, hostField: 'kept' }));
    const chart = await makeChart({ disclosureStorageKey: KEY });
    button(chart, 'glossary').click();
    await flush();
    expect(stored()).toEqual({ explanationExpanded: true, glossaryExpanded: true, hostField: 'kept' });
  });

  it('ignores malformed records and non-boolean values', async () => {
    localStorage.setItem(KEY, '{not json');
    const chart = await makeChart({ disclosureStorageKey: KEY });
    expect(expanded(chart, 'explain')).toBe(false);
    button(chart, 'explain').click();
    await flush();
    expect(stored()).toEqual({ explanationExpanded: true });

    localStorage.setItem(KEY, JSON.stringify({ explanationExpanded: 'yes' }));
    const next = await makeChart({ disclosureStorageKey: KEY });
    expect(expanded(next, 'explain')).toBe(false);
  });

  it('keeps working when storage throws', async () => {
    vi.spyOn(localStorage, 'getItem').mockImplementation(() => { throw new Error('blocked'); });
    vi.spyOn(localStorage, 'setItem').mockImplementation(() => { throw new Error('blocked'); });
    const chart = await makeChart({ disclosureStorageKey: KEY });
    button(chart, 'explain').click();
    await flush();
    expect(expanded(chart, 'explain')).toBe(true);
  });

  it('treats a storage placeholder without methods as unavailable', async () => {
    vi.stubGlobal('localStorage', {});
    const chart = await makeChart({ disclosureStorageKey: KEY });
    button(chart, 'explain').click();
    await flush();
    expect(expanded(chart, 'explain')).toBe(true);
  });

  it('keeps separate keys separate', async () => {
    const chart = await makeChart({ disclosureStorageKey: 'one' });
    button(chart, 'explain').click();
    await flush();
    const other = await makeChart({ disclosureStorageKey: 'two' });
    expect(expanded(other, 'explain')).toBe(false);
  });

  it('still fires the disclosure-change event', async () => {
    const chart = await makeChart({ disclosureStorageKey: KEY });
    const events: unknown[] = [];
    chart.addEventListener('a11y-bar-chart-disclosure-change', (event) => events.push((event as CustomEvent).detail));
    button(chart, 'glossary').click();
    expect(events).toEqual([{ disclosure: 'glossary', expanded: true }]);
  });
});
