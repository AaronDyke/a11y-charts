import { afterEach, beforeAll, describe, expect, it } from 'vitest';
import { A11yBarChartElement, defineA11yBarChart } from '../src/index.js';

beforeAll(() => defineA11yBarChart());
afterEach(() => document.body.replaceChildren());

const render = async (): Promise<void> => { await Promise.resolve(); await Promise.resolve(); };

function makeChart(): A11yBarChartElement {
  const chart = document.createElement('a11y-bar-chart');
  chart.data = [{ id: 'a', label: 'Alpha', value: 3 }, { id: 'b', label: 'Beta', value: 1 }];
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

  it('ignores invalid attribute values the same way rendering does', () => {
    const chart = makeChart();
    chart.config = { headingLevel: 5, dataView: 'inline' };
    chart.setAttribute('heading-level', '9');
    chart.setAttribute('data-view', 'table');
    chart.setAttribute('percent-scale', 'tenths');
    expect([chart.headingLevel, chart.dataView, chart.percentScale]).toEqual([5, 'inline', 'whole']);
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
    expect(chart.querySelector('.a11y-bar-chart__title')?.tagName).toBe('H4');
  });
});
