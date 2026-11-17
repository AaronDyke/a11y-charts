// Inputs the public types must reject.
import type { A11ySegmentedBarChartDatum } from '@mzebley-aem/segmented-bar-chart/core';

// @ts-expect-error label is required
const missingLabel: A11ySegmentedBarChartDatum = { id: 'a', value: 1 };
void missingLabel;

// @ts-expect-error value is numeric
const textValue: A11ySegmentedBarChartDatum = { id: 'a', label: 'A', value: '1' };
void textValue;

const chart = document.createElement('a11y-segmented-bar-chart');

// @ts-expect-error data views are a closed set
chart.dataView = 'table';

chart.addEventListener('a11y-segmented-bar-chart-data-view-change', (event) => {
  // @ts-expect-error the data view event never reports 'none'
  const view: 'none' = event.detail.dataView;
  void view;
});
