// Inputs the public types must reject.
import type { A11yBarChartDatum } from '@mzebley-aem/bar-chart';

// @ts-expect-error label is required
const missingLabel: A11yBarChartDatum = { id: 'a', value: 1 };
void missingLabel;

// @ts-expect-error value is number or null
const textValue: A11yBarChartDatum = { id: 'a', label: 'A', value: '1' };
void textValue;
