/**
 * Names used before every exported type carried the package prefix. Each one
 * is an alias of its replacement and will be removed in 1.0.
 */
import type { A11yBarChartCsvOptions } from './csv.js';
import type { A11yBarChartModelOptions, A11yBarChartValidationResult, A11yBarChartValidationFailure, A11yBarChartValidationSuccess } from './model.js';
import type { A11yBarChartMessageDictionary, A11yBarChartMessageKey } from './messages.js';
import type { A11yBarChartPopulationOption, A11yBarChartPopulationRecord, A11yBarChartPreparedViewContext, A11yBarChartPrepareViewsOptions } from './prepare-views.js';
import type { A11yBarChartPreparedView, A11yBarChartViewSection } from './grouped-model.js';

/** @deprecated Use {@link A11yBarChartCsvOptions}. */
export type BarCsvOptions = A11yBarChartCsvOptions;

/** @deprecated Use {@link A11yBarChartModelOptions}. */
export type BarModelOptions = A11yBarChartModelOptions;

/** @deprecated Use {@link A11yBarChartValidationResult}. */
export type BarValidationResult = A11yBarChartValidationResult;

/** @deprecated Use {@link A11yBarChartValidationFailure}. */
export type ValidationFailure = A11yBarChartValidationFailure;

/** @deprecated Use {@link A11yBarChartValidationSuccess}. */
export type ValidationSuccess<T> = A11yBarChartValidationSuccess<T>;

/** @deprecated Use {@link A11yBarChartMessageDictionary}. */
export type MessageDictionary = A11yBarChartMessageDictionary;

/** @deprecated Use {@link A11yBarChartMessageKey}. */
export type MessageKey = A11yBarChartMessageKey;

/** @deprecated Use {@link A11yBarChartPopulationOption}. */
export type BarPopulationOption = A11yBarChartPopulationOption;

/** @deprecated Use {@link A11yBarChartPopulationRecord}. */
export type BarPopulationRecord = A11yBarChartPopulationRecord;

/** @deprecated Use {@link A11yBarChartPreparedViewContext}. */
export type BarPreparedViewContext = A11yBarChartPreparedViewContext;

/** @deprecated Use {@link A11yBarChartPrepareViewsOptions}. */
export type PrepareBarViewsOptions = A11yBarChartPrepareViewsOptions;

/** @deprecated Use {@link A11yBarChartPreparedView}. */
export type PreparedBarView = A11yBarChartPreparedView;

/** @deprecated Use {@link A11yBarChartViewSection}. */
export type BarViewSection = A11yBarChartViewSection;
