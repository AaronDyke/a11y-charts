# Changelog

## 0.2.0

### Added

- `document.createElement('a11y-segmented-bar-chart')` and `querySelector('a11y-segmented-bar-chart')` return `A11ySegmentedBarChartElement` without a cast once the package or its `/define` entry is imported.
- Typed event listeners: `event.detail` is typed for every `a11y-segmented-bar-chart-*` event on the chart, its ancestors, `document`, and `window`. New exports: `A11ySegmentedBarChartEventMap`, and a detail type for every event (`A11ySegmentedBarChartReadyDetail`, `…ErrorDetail`, `…DataChangeDetail`, `…DataViewChangeDetail`, `…DisclosureChangeDetail`).
- `headingLevel`, `dataView`, and `percentScale` properties. Each reads the value the chart is using (a valid attribute, then `config`, then the default) and writes the matching attribute; `null` removes it.
- Exported value types for those properties: `A11ySegmentedBarChartHeadingLevel`, `A11ySegmentedBarChartDataView`, and `A11ySegmentedBarChartPercentScale`.

### Changed

- Exported types now all carry the package prefix. The old names still work as `@deprecated` aliases and will be removed in 1.0:

  - `MessageDictionary` → `A11ySegmentedBarChartMessageDictionary`
  - `MessageKey` → `A11ySegmentedBarChartMessageKey`
  - `SegmentedModel` → `A11ySegmentedBarChartSemanticModel`
  - `SegmentedOptions` → `A11ySegmentedBarChartModelOptions`
  - `SegmentedExportOptions` → `A11ySegmentedBarChartCsvOptions`
  - `SegmentedRow` → `A11ySegmentedBarChartRow`
  - `SegmentedDisplaySegment` → `A11ySegmentedBarChartDisplaySegment`
  - `SegmentedPattern` → `A11ySegmentedBarChartPattern`
  - `SegmentedThemeEntry` → `A11ySegmentedBarChartThemeEntry`
  - `SegmentedValidationFailure` → `A11ySegmentedBarChartValidationFailure`
  - `SegmentedValidationResult` → `A11ySegmentedBarChartValidationResult`
- Type declarations are now one bundled file per entry point at `dist/types/{index,core,define,loader}.d.ts`. Import paths are unchanged; only deep imports of `dist/types/...` files are affected.
- TypeScript 5.5 or newer is required, and each release is type-checked against TypeScript 5.5 and 7.
