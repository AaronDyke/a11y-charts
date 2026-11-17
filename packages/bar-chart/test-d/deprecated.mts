// Pre-0.2 names keep compiling as aliases of their prefixed replacements.
import type {
  BarCsvOptions,
  A11yBarChartCsvOptions,
  BarModelOptions,
  A11yBarChartModelOptions,
  BarValidationResult,
  A11yBarChartValidationResult,
  ValidationFailure,
  A11yBarChartValidationFailure,
  ValidationSuccess,
  A11yBarChartValidationSuccess,
  MessageDictionary,
  A11yBarChartMessageDictionary,
  MessageKey,
  A11yBarChartMessageKey,
  BarPopulationOption,
  A11yBarChartPopulationOption,
  BarPopulationRecord,
  A11yBarChartPopulationRecord,
  BarPreparedViewContext,
  A11yBarChartPreparedViewContext,
  PrepareBarViewsOptions,
  A11yBarChartPrepareViewsOptions,
  PreparedBarView,
  A11yBarChartPreparedView,
  BarViewSection,
  A11yBarChartViewSection,
} from '@mzebley-aem/bar-chart/core';

type Equal<A, B> = (<T>() => T extends A ? 1 : 2) extends (<T>() => T extends B ? 1 : 2) ? true : false;
const assertType = <T extends true>(): T => true as T;

assertType<Equal<BarCsvOptions, A11yBarChartCsvOptions>>();
assertType<Equal<BarModelOptions, A11yBarChartModelOptions>>();
assertType<Equal<BarValidationResult, A11yBarChartValidationResult>>();
assertType<Equal<ValidationFailure, A11yBarChartValidationFailure>>();
assertType<Equal<ValidationSuccess<string>, A11yBarChartValidationSuccess<string>>>();
assertType<Equal<MessageDictionary, A11yBarChartMessageDictionary>>();
assertType<Equal<MessageKey, A11yBarChartMessageKey>>();
assertType<Equal<BarPopulationOption, A11yBarChartPopulationOption>>();
assertType<Equal<BarPopulationRecord, A11yBarChartPopulationRecord>>();
assertType<Equal<BarPreparedViewContext, A11yBarChartPreparedViewContext>>();
assertType<Equal<PrepareBarViewsOptions, A11yBarChartPrepareViewsOptions>>();
assertType<Equal<PreparedBarView, A11yBarChartPreparedView>>();
assertType<Equal<BarViewSection, A11yBarChartViewSection>>();
