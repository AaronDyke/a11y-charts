import { afterEach, beforeAll, describe, expect, it } from 'vitest';
import { A11yLineChartElement, defineA11yLineChart } from '../src/index.js';

beforeAll(() => defineA11yLineChart());
afterEach(() => document.body.replaceChildren());

const render = async (): Promise<void> => { await Promise.resolve(); await Promise.resolve(); };

function makeChart(): A11yLineChartElement {
  const chart = document.createElement('a11y-line-chart');
  chart.data = [{ x: 'Q1', actual: 40, target: 50 }, { x: 'Q2', actual: 55, target: 50 }];
  document.body.append(chart);
  return chart;
}

describe('attribute-backed properties', () => {
  it('returns the defaults when neither the attribute nor config is set', () => {
    const chart = makeChart();
    expect(chart.headingLevel).toBe(2);
    expect(chart.dataView).toBe('dialog');
    expect(chart.percentScale).toBe('whole');
    expect(chart.valuePreset).toBe('percent');
  });

  it('falls back to config, and a valid attribute wins over config', () => {
    const chart = makeChart();
    chart.config = { headingLevel: 4, dataView: 'none', percentScale: 'fraction', valuePreset: 'number' };
    expect([chart.headingLevel, chart.dataView, chart.percentScale, chart.valuePreset]).toEqual([4, 'none', 'fraction', 'number']);
    chart.setAttribute('heading-level', '3');
    chart.setAttribute('data-view', 'inline');
    chart.setAttribute('percent-scale', 'whole');
    chart.setAttribute('value-preset', 'percent');
    expect([chart.headingLevel, chart.dataView, chart.percentScale, chart.valuePreset]).toEqual([3, 'inline', 'whole', 'percent']);
  });

  it('ignores invalid attribute values the same way rendering does', () => {
    const chart = makeChart();
    chart.config = { headingLevel: 5, dataView: 'inline' };
    chart.setAttribute('heading-level', '9');
    chart.setAttribute('data-view', 'table');
    chart.setAttribute('percent-scale', 'tenths');
    chart.setAttribute('value-preset', 'currency');
    expect([chart.headingLevel, chart.dataView, chart.percentScale, chart.valuePreset]).toEqual([5, 'inline', 'whole', 'percent']);
  });

  it('writes the attribute on set and removes it on null', () => {
    const chart = makeChart();
    chart.headingLevel = 3;
    chart.dataView = 'inline';
    chart.percentScale = 'fraction';
    chart.valuePreset = 'number';
    expect(chart.getAttribute('heading-level')).toBe('3');
    expect(chart.getAttribute('data-view')).toBe('inline');
    expect(chart.getAttribute('percent-scale')).toBe('fraction');
    expect(chart.getAttribute('value-preset')).toBe('number');
    chart.headingLevel = null;
    chart.dataView = null;
    chart.percentScale = null;
    chart.valuePreset = null;
    for (const name of ['heading-level', 'data-view', 'percent-scale', 'value-preset']) expect(chart.hasAttribute(name)).toBe(false);
  });

  it('re-renders through the attribute when a property is set', async () => {
    const chart = makeChart();
    await render();
    chart.headingLevel = 4;
    await render();
    expect(chart.querySelector('.a11y-line-chart__title')?.tagName).toBe('H4');
  });
});
