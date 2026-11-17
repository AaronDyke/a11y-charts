// Pre-0.2 names keep compiling as aliases of their prefixed replacements.
import type {
  BuildLineCsvOptions,
  A11yLineChartCsvOptions,
  BaselineValidationResult,
  A11yLineChartBaselineValidationResult,
  DataValidationResult,
  A11yLineChartDataValidationResult,
} from '@mzebley-aem/line-chart/core';

type Equal<A, B> = (<T>() => T extends A ? 1 : 2) extends (<T>() => T extends B ? 1 : 2) ? true : false;
const assertType = <T extends true>(): T => true as T;

assertType<Equal<BuildLineCsvOptions, A11yLineChartCsvOptions>>();
assertType<Equal<BaselineValidationResult, A11yLineChartBaselineValidationResult>>();
assertType<Equal<DataValidationResult, A11yLineChartDataValidationResult>>();
