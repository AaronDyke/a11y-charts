import { afterEach, beforeAll, describe, expect, it } from 'vitest';
import { A11ySegmentedBarChartElement, defineA11ySegmentedBarChart } from '../src/index.js';

beforeAll(() => defineA11ySegmentedBarChart());
afterEach(() => document.body.replaceChildren());

const render = async (): Promise<void> => { await Promise.resolve(); await Promise.resolve(); };

function makeChart(): A11ySegmentedBarChartElement {
  const chart = document.createElement('a11y-segmented-bar-chart');
  chart.chartTitle = 'Outcomes';
  chart.data = [{ id: 'a', label: 'First', value: 3 }, { id: 'b', label: 'Second', value: 7 }];
  document.body.append(chart);
  return chart;
}

describe('attribute-backed properties', () => {
  it('returns the defaults when neither the attribute nor config is set', () => {
    const chart = makeChart();
    expect([chart.headingLevel, chart.dataView, chart.percentScale]).toEqual([2, 'dialog', 'whole']);
  });

  it('falls back to config, and a valid attribute wins over config', () => {
    const chart = makeChart();
    chart.config = { headingLevel: 4, dataView: 'none', percentScale: 'fraction' };
    expect([chart.headingLevel, chart.dataView, chart.percentScale]).toEqual([4, 'none', 'fraction']);
    chart.setAttribute('heading-level', '3');
    chart.setAttribute('data-view', 'inline');
    chart.setAttribute('percent-scale', 'whole');
    expect([chart.headingLevel, chart.dataView, chart.percentScale]).toEqual([3, 'inline', 'whole']);
  });

  it('reports the same fallbacks rendering uses for invalid attribute values', () => {
    const chart = makeChart();
    chart.config = { headingLevel: 5, dataView: 'inline' };
    chart.setAttribute('heading-level', '9');
    chart.setAttribute('data-view', 'table');
    chart.setAttribute('percent-scale', 'tenths');
    // An invalid heading-level resets to 2 rather than falling through to config; data-view and percent-scale fall through.
    expect([chart.headingLevel, chart.dataView, chart.percentScale]).toEqual([2, 'inline', 'whole']);
  });

  it('writes the attribute on set and removes it on null', () => {
    const chart = makeChart();
    chart.headingLevel = 3;
    chart.dataView = 'inline';
    chart.percentScale = 'fraction';
    expect(chart.getAttribute('heading-level')).toBe('3');
    expect(chart.getAttribute('data-view')).toBe('inline');
    expect(chart.getAttribute('percent-scale')).toBe('fraction');
    chart.headingLevel = null;
    chart.dataView = null;
    chart.percentScale = null;
    for (const name of ['heading-level', 'data-view', 'percent-scale']) expect(chart.hasAttribute(name)).toBe(false);
  });

  it('re-renders through the attribute when a property is set', async () => {
    const chart = makeChart();
    await render();
    chart.headingLevel = 4;
    await render();
    expect(chart.querySelector('h4')?.textContent).toContain('Outcomes');
  });
});
