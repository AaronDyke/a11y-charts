# Changelog

## 0.2.0

### Added

- `document.createElement('a11y-bar-chart')` and `querySelector('a11y-bar-chart')` return `A11yBarChartElement` (and `a11y-bar-chart-group` returns `A11yBarChartGroupElement`) without a cast once the package or its `/define` entry is imported.
- Typed event listeners: `event.detail` is typed for every `a11y-bar-chart-*` event on the chart, its ancestors, `document`, and `window`. New exports: `A11yBarChartEventMap`, `A11yBarChartGroupEventMap`, and `A11yBarChartReadyDetail`.
- `headingLevel`, `dataView`, and `percentScale` properties. Each reads the value the chart is using (a valid attribute, then `config`, then the default) and writes the matching attribute; `null` removes it.
- Exported value types for those properties: `A11yBarChartHeadingLevel`, `A11yBarChartDataView`, and `A11yBarChartPercentScale`.

### Changed

- Exported types now all carry the package prefix. The old names still work as `@deprecated` aliases and will be removed in 1.0:

  - `BarCsvOptions` → `A11yBarChartCsvOptions`
  - `BarModelOptions` → `A11yBarChartModelOptions`
  - `BarValidationResult` → `A11yBarChartValidationResult`
  - `ValidationFailure` → `A11yBarChartValidationFailure`
  - `ValidationSuccess` → `A11yBarChartValidationSuccess`
  - `MessageDictionary` → `A11yBarChartMessageDictionary`
  - `MessageKey` → `A11yBarChartMessageKey`
  - `BarPopulationOption` → `A11yBarChartPopulationOption`
  - `BarPopulationRecord` → `A11yBarChartPopulationRecord`
  - `BarPreparedViewContext` → `A11yBarChartPreparedViewContext`
  - `PrepareBarViewsOptions` → `A11yBarChartPrepareViewsOptions`
  - `PreparedBarView` → `A11yBarChartPreparedView`
  - `BarViewSection` → `A11yBarChartViewSection`
- Type declarations are now one bundled file per entry point at `dist/types/{index,core,define,loader}.d.ts`. Import paths are unchanged; only deep imports of `dist/types/...` files are affected.
- TypeScript 5.5 or newer is required, and each release is type-checked against TypeScript 5.5 and 7.
