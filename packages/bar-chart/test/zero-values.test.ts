import { beforeEach, describe, expect, it } from 'vitest';
import { A11yBarChartElement, buildBarCsv, buildBarModel, defineA11yBarChart, defineA11yBarChartGroup } from '../src/index.js';
import type { A11yBarChartConfig, A11yBarChartDatum, A11yBarChartGroupElement } from '../src/index.js';

const flush = async () => { await Promise.resolve(); await Promise.resolve(); };
const data: A11yBarChartDatum[] = [
  { id: 'a', label: 'Alpha', value: 10 },
  { id: 'b', label: 'Beta', value: 0 },
  { id: 'c', label: 'Gamma', value: 5 },
  { id: 'd', label: 'Delta', value: 0 },
  { id: 'e', label: 'Epsilon', value: null }
];

async function makeChart(config: A11yBarChartConfig, rows = data, suppressed = false): Promise<A11yBarChartElement> {
  defineA11yBarChart();
  const chart = document.createElement('a11y-bar-chart') as A11yBarChartElement;
  chart.chartTitle = 'Visits';
  chart.config = { dataView: 'inline', ...config };
  chart.suppressed = suppressed;
  chart.data = rows;
  document.body.append(chart);
  await flush();
  return chart;
}

const barLabels = (chart: Element) => [...chart.querySelectorAll('.a11y-bar-chart__rows .a11y-bar-chart__label')].map((node) => node.textContent);
const tableLabels = (chart: Element) => [...chart.querySelector('.a11y-bar-chart__table')!.querySelectorAll('tbody th')].map((node) => node.textContent);
const zeroNote = (chart: Element) => chart.querySelector('.a11y-bar-chart__zero-note')?.textContent ?? null;

beforeEach(() => document.body.replaceChildren());

describe('showZeroValues', () => {
  it('keeps zero bars by default', async () => {
    const chart = await makeChart({});
    expect(barLabels(chart)).toEqual(['Alpha', 'Beta', 'Gamma', 'Delta', 'Epsilon']);
    expect(zeroNote(chart)).toBeNull();
  });

  it('hides reported zero bars, names them after the total, and keeps every row in the table, CSV, and explanation', async () => {
    const chart = await makeChart({ showZeroValues: false });
    expect(barLabels(chart)).toEqual(['Alpha', 'Gamma', 'Epsilon']);
    expect(zeroNote(chart)).toBe('Categories with values of zero: Beta and Delta.');
    const total = chart.querySelector('.a11y-bar-chart__total')!;
    expect(total.nextElementSibling?.classList.contains('a11y-bar-chart__zero-note')).toBe(true);
    expect(tableLabels(chart)).toEqual(['Alpha', 'Beta', 'Gamma', 'Delta', 'Epsilon']);

    const model = buildBarModel(data, { config: { showZeroValues: false } });
    expect(model.rows).toHaveLength(5);
    expect(model.hiddenRowIds).toEqual(['b', 'd']);
    expect(model.explanation.join(' ')).toContain('Beta');
    expect(buildBarCsv(model)).toContain('Delta');
  });

  it('uses the singular message for one hidden category', () => {
    const model = buildBarModel([{ id: 'a', label: 'Alpha', value: 3 }, { id: 'b', label: 'Beta', value: 0 }], { config: { showZeroValues: false } });
    expect(model.zeroValuesNote).toBe('Category with a value of zero: Beta.');
  });

  it('never hides suppressed zeros', async () => {
    const chart = await makeChart({ showZeroValues: false }, data, true);
    expect(barLabels(chart)).toEqual(['Alpha', 'Beta', 'Gamma', 'Delta', 'Epsilon']);
    expect(zeroNote(chart)).toBeNull();
  });

  it('renders no empty bar list when every category is zero', async () => {
    const chart = await makeChart({ showZeroValues: false }, [{ id: 'a', label: 'Alpha', value: 0 }, { id: 'b', label: 'Beta', value: 0 }]);
    expect(chart.querySelector('.a11y-bar-chart__rows')).toBeNull();
    expect(zeroNote(chart)).toBe('Categories with values of zero: Alpha and Beta.');
    expect(chart.querySelector('.a11y-bar-chart__summary')?.textContent).toContain('All 2 reported categories have a value of zero.');
  });

  it('keeps details ids aligned with the data and points the help text at the first shown bar', async () => {
    const chart = await makeChart({ showZeroValues: false, showDetails: true }, [{ id: 'z', label: 'Zero', value: 0 }, { id: 'a', label: 'Alpha', value: 4 }]);
    const triggers = [...chart.querySelectorAll<HTMLButtonElement>('.a11y-bar-chart__details-trigger')];
    expect(triggers).toHaveLength(1);
    expect(triggers[0]!.id).toMatch(/-details-trigger-1$/);
    expect(triggers[0]!.getAttribute('aria-describedby')).toMatch(/-details-help$/);
  });

  it('accepts localized plural overrides', () => {
    const model = buildBarModel(data, {
      config: { showZeroValues: false },
      messages: { 'zeroValuesNote.other': 'Zero: {labels} ({count}).' }
    });
    expect(model.zeroValuesNote).toBe('Zero: Beta and Delta (2).');
  });

  it('passes through the group to its chart', async () => {
    defineA11yBarChartGroup();
    const group = document.createElement('a11y-bar-chart-group') as A11yBarChartGroupElement;
    group.config = { showZeroValues: false };
    group.sections = [{ id: 'age', label: 'Age group', allViewId: 'everyone', views: [
      { id: 'everyone', label: 'Everyone', chartTitle: 'All results', data, total: null, filtered: false, suppressed: false },
      { id: 'adults', label: 'Adults', chartTitle: 'Adult results', data, total: null, filtered: false, suppressed: false }
    ] }];
    document.body.append(group);
    await flush(); await flush();
    const chart = group.querySelector('a11y-bar-chart')!;
    expect(barLabels(chart)).toEqual(['Alpha', 'Gamma', 'Epsilon']);
    expect(zeroNote(chart)).toBe('Categories with values of zero: Beta and Delta.');
  });
});
