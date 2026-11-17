// Every public entry point resolves and exposes its documented exports.
import { buildSegmentedBarModel, buildSegmentedBarCsv, type A11ySegmentedBarChartDatum } from '@mzebley-aem/segmented-bar-chart/core';
import { A11ySegmentedBarChartElement } from '@mzebley-aem/segmented-bar-chart';
import { defineA11ySegmentedBarChart } from '@mzebley-aem/segmented-bar-chart/define';
import { loadA11ySegmentedBarChart } from '@mzebley-aem/segmented-bar-chart/loader';

const loaded: Promise<boolean> = loadA11ySegmentedBarChart();
void loaded;
const rows: A11ySegmentedBarChartDatum[] = [{ id: 'x', label: 'X', value: 2 }];
buildSegmentedBarCsv(buildSegmentedBarModel(rows));

const element: HTMLElement = new A11ySegmentedBarChartElement();
void element;
void defineA11ySegmentedBarChart;
