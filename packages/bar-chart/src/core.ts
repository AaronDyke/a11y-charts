/** DOM-free helpers for server rendering, data preparation, and export. */
export { resolveConfig } from './config.js';
export { ENGLISH_MESSAGES, ENGLISH_BAR_CHART_MESSAGES, formatMessage, message, resolveMessages } from './messages.js';
export type { A11yBarChartMessageDictionary, A11yBarChartMessageKey } from './messages.js';
export { validateBarData, validateBarTotal } from './validation.js';
export { buildBarModel } from './semantic-model.js';
export { buildBarCsv, buildBarExportRows } from './csv.js';
export type { A11yBarChartCsvOptions } from './csv.js';
export { themeToCssVariables } from './theme.js';
export type { A11yBarChartThemeVariable } from './theme.js';
export type {
  A11yBarChartConfig,
  A11yBarChartDataView,
  A11yBarChartDatum,
  A11yBarChartHeadingLevel,
  A11yBarChartPercentScale,
  A11yBarChartTarget,
  A11yBarChartTargetRange,
  A11yBarChartTargetRelation,
  A11yBarChartTargetOutcome,
  A11yBarChartTargetStyle,
  A11yBarChartRow,
  A11yBarChartSemanticModel,
  A11yBarChartValueStatus,
  A11yBarChartTheme,
  A11yBarChartPattern,
  A11yBarChartValueFormatContext,
  A11yBarChartValueFormatter,
  A11yBarChartModelOptions,
  A11yBarChartValidationResult,
  ResolvedA11yBarChartConfig,
  A11yBarChartValidationFailure,
  A11yBarChartValidationSuccess
} from './model.js';
export type { A11yBarChartPreparedView, A11yBarChartViewSection, A11yBarChartGroupMessages, A11yBarChartGroupSelectionChangeDetail } from './grouped-model.js';
export { prepareBarViewSection } from './prepare-views.js';
export type { A11yBarChartPopulationRecord, A11yBarChartPopulationOption, A11yBarChartPreparedViewContext, A11yBarChartPrepareViewsOptions } from './prepare-views.js';
export type { BarCsvOptions, BarModelOptions, BarValidationResult, ValidationFailure, ValidationSuccess, MessageDictionary, MessageKey, BarPopulationOption, BarPopulationRecord, BarPreparedViewContext, PrepareBarViewsOptions, PreparedBarView, BarViewSection } from './deprecated.js';
