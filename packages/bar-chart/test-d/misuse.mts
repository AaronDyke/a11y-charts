// Inputs the public types must reject.
import type { A11yBarChartDatum } from '@mzebley-aem/bar-chart';

// @ts-expect-error label is required
const missingLabel: A11yBarChartDatum = { id: 'a', value: 1 };
void missingLabel;

// @ts-expect-error value is number or null
const textValue: A11yBarChartDatum = { id: 'a', label: 'A', value: '1' };
void textValue;

const chart = document.createElement('a11y-bar-chart');

// @ts-expect-error heading levels stop at 6
chart.headingLevel = 0;

// @ts-expect-error percent scales are a closed set
chart.percentScale = 'tenths';

document.addEventListener('a11y-bar-chart-group-selection-change', (event) => {
  // @ts-expect-error selection origins are a closed set
  const origin: 'keyboard' = event.detail.origin;
  void origin;
});
