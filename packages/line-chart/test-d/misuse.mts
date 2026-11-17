// Inputs the public types must reject.
import type { A11yLineChartDatum, A11yLineChartErrorDetail } from '@mzebley-aem/line-chart';

// @ts-expect-error x is required
const missingX: A11yLineChartDatum = { actual: 1 };
void missingX;

// @ts-expect-error actual is numeric
const textActual: A11yLineChartDatum = { x: 2024, actual: '1' };
void textActual;

// @ts-expect-error error codes are a closed set
const unknownCode: A11yLineChartErrorDetail = { code: 'boom', message: '' };
void unknownCode;
