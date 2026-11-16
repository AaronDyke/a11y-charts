import { beforeEach, describe, expect, it, vi } from 'vitest';
import { A11yBarChartElement, A11yBarChartGroupElement, buildBarCsv, buildBarExportRows, buildBarModel, defineA11yBarChart, defineA11yBarChartGroup } from '../src/index.js';
import type { A11yBarChartExportAction, A11yBarChartExportContext } from '../src/index.js';

const flush = async () => { await Promise.resolve(); await Promise.resolve(); };
const data = [{ id: 'a', label: 'Alpha', value: 3 }, { id: 'b', label: 'Beta', value: 0 }];

async function makeChart(actions: unknown, extra: Partial<A11yBarChartElement> = {}): Promise<A11yBarChartElement> {
  defineA11yBarChart();
  const chart = document.createElement('a11y-bar-chart') as A11yBarChartElement;
  chart.chartTitle = 'Visits: by group';
  chart.config = { dataView: 'inline' };
  chart.exportActions = actions as A11yBarChartExportAction[];
  Object.assign(chart, extra);
  chart.data = data;
  document.body.append(chart);
  await flush();
  return chart;
}

const exportLabels = (root: Element) => [...root.querySelectorAll<HTMLButtonElement>('[data-focus-key^="export"]')].map((button) => button.textContent);
const button = (root: Element, id: string) => root.querySelector<HTMLButtonElement>(`[data-focus-key="export:${id}"]`)!;

beforeEach(() => document.body.replaceChildren());

describe('exportActions', () => {
  it('adds host buttons after Download CSV', async () => {
    const chart = await makeChart([{ id: 'xlsx', label: 'Download Excel', run: () => {} }]);
    expect(exportLabels(chart)).toEqual(['Download CSV', 'Download Excel']);
  });

  it('passes the same rows and CSV as the built-in download', async () => {
    let received: A11yBarChartExportContext | undefined;
    const chart = await makeChart([{ id: 'xlsx', label: 'Download Excel', run: (context: A11yBarChartExportContext) => { received = context; } }]);
    button(chart, 'xlsx').click();
    await flush();
    const model = buildBarModel(data);
    const options = { chartTitle: 'Visits: by group', locale: 'en-US', contextText: '', explanationText: '', dataNoteText: '', suppressed: false };
    expect(received!.chartTitle).toBe('Visits: by group');
    expect(received!.fileName).toBe('Visits--by-group');
    expect(received!.rows).toEqual(buildBarExportRows(model, options));
    expect(received!.csv).toBe(buildBarCsv(model, options));
    expect(received!.rows).toContainEqual(['Alpha', '3', '100.00%']);
    expect(received!.model.rows).toHaveLength(2);
  });

  it('carries suppression redaction into the rows and model', async () => {
    let received: A11yBarChartExportContext | undefined;
    const chart = await makeChart([{ id: 'xlsx', label: 'Download Excel', run: (context: A11yBarChartExportContext) => { received = context; } }], { suppressed: true });
    button(chart, 'xlsx').click();
    await flush();
    expect(received!.rows.find((row) => row[0] === 'Beta')).toEqual(['Beta', 'Suppressed', 'Suppressed']);
    expect(received!.model.rows.find((row) => row.id === 'b')!.value).toBeNull();
    expect(received!.csv).not.toMatch(/Beta,0/);
  });

  it('gives each action its own model copy', async () => {
    const contexts: A11yBarChartExportContext[] = [];
    const chart = await makeChart([{ id: 'xlsx', label: 'Download Excel', run: (context: A11yBarChartExportContext) => { contexts.push(context); if (contexts.length === 1) { context.model.rows[0]!.label = 'changed'; context.rows[0]![0] = 'changed'; } } }]);
    button(chart, 'xlsx').click();
    button(chart, 'xlsx').click();
    await flush();
    expect(contexts[1]!.model.rows[0]!.label).toBe('Alpha');
    expect(contexts[1]!.rows[0]![0]).not.toBe('changed');
  });

  it('drops invalid and duplicate actions', async () => {
    const run = () => {};
    const chart = await makeChart([
      { id: 'xlsx', label: 'Download Excel', run },
      { id: 'xlsx', label: 'Duplicate', run },
      { id: '', label: 'No id', run },
      { id: 'nolabel', label: ' ', run },
      { id: 'norun', label: 'No run' },
      null,
      'text'
    ]);
    expect(exportLabels(chart)).toEqual(['Download CSV', 'Download Excel']);
    expect(chart.exportActions.map((action) => action.id)).toEqual(['xlsx']);
  });

  it('hides host buttons with the built-in export when showExport is false', async () => {
    const chart = await makeChart([{ id: 'xlsx', label: 'Download Excel', run: () => {} }], { config: { dataView: 'inline', showExport: false } });
    expect(exportLabels(chart)).toEqual([]);
  });

  it.each([
    ['throws', () => { throw new Error('boom'); }],
    ['rejects', () => Promise.reject(new Error('boom'))]
  ])('reports an action that %s as an exportFailed error', async (_name, run) => {
    const chart = await makeChart([{ id: 'xlsx', label: 'Excel', run }]);
    const errors: unknown[] = [];
    chart.addEventListener('a11y-bar-chart-error', (event) => errors.push((event as CustomEvent).detail));
    button(chart, 'xlsx').click();
    await flush(); await flush();
    expect(errors).toEqual([expect.objectContaining({ code: 'exportFailed', message: 'The Excel download could not be completed.' })]);
  });

  it('passes through the group to its chart', async () => {
    defineA11yBarChartGroup();
    const run = vi.fn();
    const group = document.createElement('a11y-bar-chart-group') as A11yBarChartGroupElement;
    group.exportActions = [{ id: 'xlsx', label: 'Download Excel', run }];
    group.sections = [{ id: 'age', label: 'Age group', allViewId: 'everyone', views: [
      { id: 'everyone', label: 'Everyone', chartTitle: 'All results', data, total: null, filtered: false, suppressed: false },
      { id: 'adults', label: 'Adults', chartTitle: 'Adult results', data, total: null, filtered: false, suppressed: false }
    ] }];
    document.body.append(group);
    await flush(); await flush();
    const chart = group.querySelector('a11y-bar-chart') as A11yBarChartElement;
    expect(chart.exportActions.map((action) => action.id)).toEqual(['xlsx']);
  });
});
