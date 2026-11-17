---
title: TypeScript
description: Typed elements, events, and properties, the supported TypeScript versions, and the types renamed in 0.2.
---

Every package ships its own type declarations. You don't need a separate `@types` package or a cast to work with the charts.

**Supported versions:** TypeScript 5.5 or newer, with `moduleResolution` set to `NodeNext`, `Node16`, or `Bundler`.

## Elements

Importing a package, or its `/define` entry, registers its tags with TypeScript's DOM types. `createElement` and `querySelector` then return the element class:

```ts
import '@mzebley-aem/line-chart/define';

const chart = document.createElement('a11y-line-chart'); // A11yLineChartElement
const existing = document.querySelector('a11y-line-chart'); // A11yLineChartElement | null
```

| Tag | Element type | Package |
| --- | --- | --- |
| `a11y-line-chart` | `A11yLineChartElement` | `@mzebley-aem/line-chart` |
| `a11y-bar-chart` | `A11yBarChartElement` | `@mzebley-aem/bar-chart` |
| `a11y-bar-chart-group` | `A11yBarChartGroupElement` | `@mzebley-aem/bar-chart` |
| `a11y-segmented-bar-chart` | `A11ySegmentedBarChartElement` | `@mzebley-aem/segmented-bar-chart` |

A type-only import such as `import type { A11yLineChartElement } from '@mzebley-aem/line-chart'` registers the tags too.

## Events

Event listeners get a typed `event.detail` on the chart, on any ancestor, on `document`, and on `window`:

```ts
document.addEventListener('a11y-line-chart-point-change', (event) => {
	console.log(event.detail.outcomeLabel); // A11yLineChartPointChangeDetail
});
```

Each package exports an event map that lists every event its elements dispatch. Use it to write your own typed helpers:

| Package | Event maps |
| --- | --- |
| `@mzebley-aem/line-chart` | `A11yLineChartEventMap` |
| `@mzebley-aem/bar-chart` | `A11yBarChartEventMap`, `A11yBarChartGroupEventMap` |
| `@mzebley-aem/segmented-bar-chart` | `A11ySegmentedBarChartEventMap` |

Each detail payload also has its own exported type, such as `A11yBarChartReadyDetail` or `A11ySegmentedBarChartDataChangeDetail`. [Events](/reference/events/) describes every payload.

## Properties that match attributes

These properties read and write the attribute of the same name. Reading one returns the value the chart is using: the attribute if it's valid, otherwise `config`, otherwise the default. Setting one writes the attribute, and setting `null` removes it.

| Property | Attribute | Type | Default | Charts |
| --- | --- | --- | --- | --- |
| `headingLevel` | `heading-level` | `1` to `6` | `2` | All |
| `dataView` | `data-view` | `'dialog'`, `'inline'`, or `'none'` | `'dialog'` | All |
| `percentScale` | `percent-scale` | `'whole'` or `'fraction'` | `'whole'` | All |
| `valuePreset` | `value-preset` | `'number'` or `'percent'` | `'percent'` | Line |

```ts
chart.headingLevel = 3; // sets heading-level="3"
chart.dataView = null; // removes data-view, so config.dataView applies
```

On the segmented bar chart, an invalid `heading-level` reads as `2` instead of falling back to `config.headingLevel`.

The value types are exported for your own code: `A11yLineChartHeadingLevel`, `A11yBarChartDataView`, `A11ySegmentedBarChartPercentScale`, and so on.

## Server code

The `/core` entry contains no DOM types, so it type-checks in projects compiled without the `DOM` library. See [Server rendering](/guides/server-rendering/).

## Types renamed in 0.2

From 0.2, every exported type starts with its package prefix. The old names still work as deprecated aliases and will be removed in 1.0.

| Package | Old name | New name |
| --- | --- | --- |
| line | `BuildLineCsvOptions` | `A11yLineChartCsvOptions` |
| line | `BaselineValidationResult` | `A11yLineChartBaselineValidationResult` |
| line | `DataValidationResult` | `A11yLineChartDataValidationResult` |
| bar | `BarCsvOptions` | `A11yBarChartCsvOptions` |
| bar | `BarModelOptions` | `A11yBarChartModelOptions` |
| bar | `BarValidationResult` | `A11yBarChartValidationResult` |
| bar | `ValidationFailure` | `A11yBarChartValidationFailure` |
| bar | `ValidationSuccess` | `A11yBarChartValidationSuccess` |
| bar | `MessageDictionary` | `A11yBarChartMessageDictionary` |
| bar | `MessageKey` | `A11yBarChartMessageKey` |
| bar | `BarPopulationOption` | `A11yBarChartPopulationOption` |
| bar | `BarPopulationRecord` | `A11yBarChartPopulationRecord` |
| bar | `BarPreparedViewContext` | `A11yBarChartPreparedViewContext` |
| bar | `PrepareBarViewsOptions` | `A11yBarChartPrepareViewsOptions` |
| bar | `PreparedBarView` | `A11yBarChartPreparedView` |
| bar | `BarViewSection` | `A11yBarChartViewSection` |
| segmented | `MessageDictionary` | `A11ySegmentedBarChartMessageDictionary` |
| segmented | `MessageKey` | `A11ySegmentedBarChartMessageKey` |
| segmented | `SegmentedModel` | `A11ySegmentedBarChartSemanticModel` |
| segmented | `SegmentedOptions` | `A11ySegmentedBarChartModelOptions` |
| segmented | `SegmentedExportOptions` | `A11ySegmentedBarChartCsvOptions` |
| segmented | `SegmentedRow` | `A11ySegmentedBarChartRow` |
| segmented | `SegmentedDisplaySegment` | `A11ySegmentedBarChartDisplaySegment` |
| segmented | `SegmentedPattern` | `A11ySegmentedBarChartPattern` |
| segmented | `SegmentedThemeEntry` | `A11ySegmentedBarChartThemeEntry` |
| segmented | `SegmentedValidationFailure` | `A11ySegmentedBarChartValidationFailure` |
| segmented | `SegmentedValidationResult` | `A11ySegmentedBarChartValidationResult` |
