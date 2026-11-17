// Inputs the public types must reject.
import type { A11ySegmentedBarChartDatum } from '@mzebley-aem/segmented-bar-chart/core';

// @ts-expect-error label is required
const missingLabel: A11ySegmentedBarChartDatum = { id: 'a', value: 1 };
void missingLabel;

// @ts-expect-error value is numeric
const textValue: A11ySegmentedBarChartDatum = { id: 'a', label: 'A', value: '1' };
void textValue;
