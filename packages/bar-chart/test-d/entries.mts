// Every public entry point resolves and exposes its documented exports.
import { buildBarModel, resolveConfig, validateBarData, type A11yBarChartDatum } from '@mzebley-aem/bar-chart/core';
import { A11yBarChartElement, A11yBarChartGroupElement, buildBarCsv, type BarViewSection } from '@mzebley-aem/bar-chart';
import { defineA11yBarChart, defineA11yBarChartGroup } from '@mzebley-aem/bar-chart/define';
import { loadA11yBarChart } from '@mzebley-aem/bar-chart/loader';

const loaded: Promise<boolean> = loadA11yBarChart();
void loaded;
const rows: A11yBarChartDatum[] = [{ id: 'typed', label: 'Typed', value: 2 }];
const config = resolveConfig(undefined);
void config;
buildBarModel(rows);
validateBarData(rows);
buildBarCsv(buildBarModel(rows));
const sections: BarViewSection[] = [];
void sections;

const chart: HTMLElement = new A11yBarChartElement();
const group: HTMLElement = new A11yBarChartGroupElement();
void chart;
void group;
void defineA11yBarChart;
void defineA11yBarChartGroup;
