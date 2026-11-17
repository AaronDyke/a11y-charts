# Changelog

## 0.2.0

### Added

- `document.createElement('a11y-line-chart')` and `querySelector('a11y-line-chart')` return `A11yLineChartElement` without a cast once the package or its `/define` entry is imported.
- Typed event listeners: `event.detail` is typed for every `a11y-line-chart-*` event on the chart, its ancestors, `document`, and `window`. New exports: `A11yLineChartEventMap`, and `A11yLineChartReadyDetail`.
- `headingLevel`, `dataView`, `percentScale`, and `valuePreset` properties. Each reads the value the chart is using (a valid attribute, then `config`, then the default) and writes the matching attribute; `null` removes it.
- Exported value types for those properties: `A11yLineChartHeadingLevel` (new), with the existing `A11yLineChartDataView`, `A11yLineChartPercentScale`, and `A11yLineChartValuePreset`.

### Changed

- Exported types now all carry the package prefix. The old names still work as `@deprecated` aliases and will be removed in 1.0:

  - `BuildLineCsvOptions` → `A11yLineChartCsvOptions`
  - `BaselineValidationResult` → `A11yLineChartBaselineValidationResult`
  - `DataValidationResult` → `A11yLineChartDataValidationResult`
- Type declarations are now one bundled file per entry point at `dist/types/{index,core,define,loader}.d.ts`. Import paths are unchanged; only deep imports of `dist/types/...` files are affected.
- TypeScript 5.5 or newer is required, and each release is type-checked against TypeScript 5.5 and 7.
