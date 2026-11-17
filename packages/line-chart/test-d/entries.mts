// Every public entry point resolves and exposes its documented exports.
import { buildSemanticModel, normalizeLineData, resolveConfig, validateData, type A11yLineChartDatum } from '@mzebley-aem/line-chart/core';
import { A11yLineChartElement, buildChartOptions, type A11yLineChartConfig } from '@mzebley-aem/line-chart';
import { defineA11yLineChart } from '@mzebley-aem/line-chart/define';
import { loadA11yLineChart } from '@mzebley-aem/line-chart/loader';

const loaded: Promise<boolean> = loadA11yLineChart();
void loaded;
const rows: A11yLineChartDatum[] = [{ x: 'typed', actual: 2 }];
const config: A11yLineChartConfig = resolveConfig(undefined);
void config;
normalizeLineData(rows);
validateData(rows);
type ChartOptionType = ReturnType<typeof buildChartOptions>;
void (null as unknown as ChartOptionType);
void buildSemanticModel;

const element: HTMLElement = new A11yLineChartElement();
void element;
void defineA11yLineChart;
