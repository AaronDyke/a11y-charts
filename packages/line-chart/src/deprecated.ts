/**
 * Names used before every exported type carried the package prefix. Each one
 * is an alias of its replacement and will be removed in 1.0.
 */
import type { A11yLineChartCsvOptions } from './csv.js';
import type { A11yLineChartBaselineValidationResult, A11yLineChartDataValidationResult } from './validation.js';

/** @deprecated Use {@link A11yLineChartCsvOptions}. */
export type BuildLineCsvOptions = A11yLineChartCsvOptions;

/** @deprecated Use {@link A11yLineChartBaselineValidationResult}. */
export type BaselineValidationResult = A11yLineChartBaselineValidationResult;

/** @deprecated Use {@link A11yLineChartDataValidationResult}. */
export type DataValidationResult = A11yLineChartDataValidationResult;
