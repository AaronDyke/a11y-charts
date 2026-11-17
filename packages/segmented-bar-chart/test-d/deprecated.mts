// Pre-0.2 names keep compiling as aliases of their prefixed replacements.
import type {
  MessageDictionary,
  A11ySegmentedBarChartMessageDictionary,
  MessageKey,
  A11ySegmentedBarChartMessageKey,
  SegmentedDisplaySegment,
  A11ySegmentedBarChartDisplaySegment,
  SegmentedExportOptions,
  A11ySegmentedBarChartCsvOptions,
  SegmentedModel,
  A11ySegmentedBarChartSemanticModel,
  SegmentedOptions,
  A11ySegmentedBarChartModelOptions,
  SegmentedPattern,
  A11ySegmentedBarChartPattern,
  SegmentedRow,
  A11ySegmentedBarChartRow,
  SegmentedThemeEntry,
  A11ySegmentedBarChartThemeEntry,
  SegmentedValidationFailure,
  A11ySegmentedBarChartValidationFailure,
  SegmentedValidationResult,
  A11ySegmentedBarChartValidationResult,
} from '@mzebley-aem/segmented-bar-chart/core';

type Equal<A, B> = (<T>() => T extends A ? 1 : 2) extends (<T>() => T extends B ? 1 : 2) ? true : false;
const assertType = <T extends true>(): T => true as T;

assertType<Equal<MessageDictionary, A11ySegmentedBarChartMessageDictionary>>();
assertType<Equal<MessageKey, A11ySegmentedBarChartMessageKey>>();
assertType<Equal<SegmentedDisplaySegment, A11ySegmentedBarChartDisplaySegment>>();
assertType<Equal<SegmentedExportOptions, A11ySegmentedBarChartCsvOptions>>();
assertType<Equal<SegmentedModel, A11ySegmentedBarChartSemanticModel>>();
assertType<Equal<SegmentedOptions, A11ySegmentedBarChartModelOptions>>();
assertType<Equal<SegmentedPattern, A11ySegmentedBarChartPattern>>();
assertType<Equal<SegmentedRow, A11ySegmentedBarChartRow>>();
assertType<Equal<SegmentedThemeEntry, A11ySegmentedBarChartThemeEntry>>();
assertType<Equal<SegmentedValidationFailure, A11ySegmentedBarChartValidationFailure>>();
assertType<Equal<SegmentedValidationResult, A11ySegmentedBarChartValidationResult>>();
