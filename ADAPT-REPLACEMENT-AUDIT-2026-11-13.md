# ADAPT data-rep replacement readiness audit

Date: November 13, 2026. Source compared: `a11y-charts` at `9270c47` (main) and
`~/Documents/GitHub/adapt` at `498d66f3`. Read-only review; nothing in ADAPT was changed.

## Verdict

**The bar components can do almost everything ADAPT's data reps need. The
integration hasn't been started.** For the two components ADAPT actually uses,
`<a11y-bar-chart>` and `<a11y-bar-chart-group>` cover most user-facing behavior.
But there's no ADAPT adapter, no way to install the packages, and no SSR-safe
loading. Excel export was also removed today (`9270c47`), which reopens a parity
gap. On top of that, a few behavior differences need a product decision.

| Area | Readiness |
| --- | --- |
| Feature parity: single bar (`barChart`, `countBreakdown`) | High: about 85%, with the differences listed below |
| Feature parity: grouped (`barChartGrouped`) | High: the selector companion and view-prep helper exist |
| Feature parity: comparison (`data-rep-comparison`) | None, but **not in live use** (only in a commented-out block on `home.component.html`) |
| ADAPT payload → chart adapter | **Not started** (no ADAPT field names appear anywhere in this repo) |
| Distribution / installability | **Blocked**: every package is `"private": true`, `0.0.0` |
| Angular SSR compatibility | **Risk**: element classes are evaluated and `customElements.define` runs on import |
| Unit tests / typecheck | 383 tests pass (bar 150, line 154, segmented 79); typecheck is clean |
| Real payloads, real consumer, assistive technology (AT) | Not verified |

## What ADAPT uses today

- `lib-adapt-data-rep`: section types `barChart` and `countBreakdown`, in
  `apps/adapt-viewer/.../report.component.html`, `apps/adapt-admin/.../report.component.html`,
  and nested inside `lib-adapt-grid-view`.
- `lib-adapt-data-rep-grouped`: section type `barChartGrouped`, in the same three places.
- Inputs: `raw` (section content), `content` (CMS strings), `lang`, `filtered`,
  `suppressed`, `noData`, `filterClass`, `headingLvl`. Output: `dataModalStateChange`
  (the host only tracks `dataModalOpen`).
- The shared lib module already declares `CUSTOM_ELEMENTS_SCHEMA`. ADAPT runs Angular 21.1
  on Node 24.13, which fits the packages' `node >=24` engines.
- **The production viewer is SSR**: the Dockerfile runs `dist/apps/adapt-viewer/server/main.js`.

## Capability map

| ADAPT behavior | a11y-charts | Status |
| --- | --- | --- |
| Title + `(Suppressed, Filtered)` indicator, configurable heading level | `chartTitle`, `filtered`, `suppressed`, `heading-level` | ✅ |
| Insight paragraph (rendered via `innerHTML`) | `subtitle` is plain text; rich text goes through `context` | ⚠️ Rich insight needs `context`, or must be stripped to text |
| Explain toggle with an authored `explainTemplate` (`chartExplainTemplateParse`) | `explanation` (sanitized rich text) replaces the generated text | ✅ The adapter must run ADAPT's template parser |
| Glossary toggle with per-category definitions (async `GlossaryPipe` + fileSpec) | `definition` on each datum | ✅ The adapter must resolve the glossary before assigning data |
| Data dialog: table, description, redaction note | Native modal or inline table, `context`, `suppressionNote` | ✅ |
| `dataModalStateChange` | `a11y-bar-chart-data-view-change` `{ open, dataView }` | ✅ Rename in the host |
| Download CSV | CSV with BOM, formula protection, metadata | ✅ |
| **Download Excel** | **Removed in `9270c47`**; README says “no workbook export” | ❌ Gap: decide whether to drop it or restore it |
| Suppression: when `suppressed`, values ≤ 0 read “Suppressed” | Chart-level flag: when `suppressed`, `0` reads “Suppressed” and is redacted from events and getters | ✅ Same rule for nonnegative values. `validateBarData` rejects negatives even under suppression, so the adapter must turn any legacy negative suppression marker into `0` |
| Total, formatted with the locale | `total`, `locale`, `formatValue` | ✅ The total policy differs (see below) |
| Descending sort | Chart keeps the supplied order; `prepareBarViewSection` can sort descending | ✅ Adapter |
| No-data “This Section is Unavailable.” + `noDataDescription` | Localized `empty` message; `emptyMessage` per group view | ✅ |
| CMS strings (`content.actions.*`) and `lang` | `messages` dictionary (about 90 keys, plurals) | ✅ The adapter maps CMS keys |
| Grouped: `groupBy`/`filterBy` sidebar, All view, multiple sections | `<a11y-bar-chart-group>` + `prepareBarViewSection` | ✅ Native radios replace nested listboxes, intentionally |
| Grouped: `descriptionTemplate` / `handleDynamicVariables`, `prefix`, `allMap` | `describe` callback / per-view `context` | ✅ Adapter |
| Explain/Glossary preference persisted globally (`localStorage`) | Per instance; `explanationExpanded`/`glossaryExpanded` + `disclosure-change` event | ⚠️ The host must restore it if persistence is still wanted |

## Blockers

1. **No distribution path.** The packages can't be installed from a registry. Options:
   publish to GitHub Packages, `npm pack` tarballs committed to ADAPT, or vendor
   `dist/chart.js` + `styles.css`. Pick one before anything else.
2. **SSR crash risk.** `define.ts` calls `customElements.define` at import time.
   `registration.ts` also statically imports the element classes, which extend `HTMLElement`
   and are evaluated as soon as the module loads. Importing `/define` (or the package root)
   from an Angular component would most likely fail in Node SSR. A guard inside
   `registration.ts` alone can't fix this, because the class modules are evaluated first. Load it
   browser-only, for example with
   `isPlatformBrowser` + `afterNextRender(() => import('@mzebley-aem/bar-chart/define'))`,
   or add an SSR-safe entry point that defers loading the element modules until
   `customElements` exists. Pure helpers from `/core` are already SSR-safe.
3. **No ADAPT adapter.** Someone has to translate `raw.chart.data` (including the
   `data[0].value` nesting), `xAxisValue`/`yAxisValue`/`groupBy`/`filterBy`, glossary
   lookup by fileSpec, `explainTemplate`, `descriptionTemplate`, `noDataDescription`, and
   CMS `content.actions` into `data`/`total`/`messages`/`explanation`/views. The cleanest
   approach: one thin Angular wrapper per section type that keeps the existing inputs, so
   `report.component.html` and `grid-view.component.html` swap selectors behind a flag.
4. **Excel export decision.** ADAPT shows “Download Excel” today. Either accept dropping
   it, add an export hook so the host can add a workbook button (ADAPT already depends on
   `xlsx`), or restore XLSX in the chart.

## Behavior differences that need sign-off

- **Zero rows:** ADAPT hides unsuppressed zero categories from the bar list and prints
  “Categories with values of zero: …”. The new chart keeps zero rows visible.
- **Total policy:** ADAPT's single data-rep computes total = sum of values (`processChartData`).
  The new chart prefers an authoritative `total`. With `suppressed` on, no total, and at
  least one suppressed (`0`) row, the total reads “Suppressed” instead of showing an
  understated sum. If there are no zero rows, it still infers the sum (`inferTotal` defaults
  to `true`). Percentages can therefore differ from production for the same payload.
- **Explain denominator:** ADAPT's generated text uses the sum of the values. With an
  authoritative total, the new numbers will differ.
- **Global preference persistence** (see the table above).
- **Narrow layouts in `gridView`:** the single chart's compact layout uses a viewport
  `@media (max-width: 36rem)` query, so charts in narrow grid columns on a wide screen won't
  switch to it. The group already uses `@container`; the single chart should too.
- **Visuals:** USWDS look-and-feel parity was explicitly deferred. Map the theme tokens to
  ADAPT colors and fonts.

## Documentation drift

`BAR-CHART-REPLACEMENT-PARITY.md` (implementation status) and
`GROUPED-PARITY-VERIFICATION.md` still claim per-row `valueSuppressed` and XLSX downloads.
Both were removed in `9270c47`. Update them so nobody plans a migration on stale claims.

## Recommended path

1. Decide on Excel, distribution, and the four behavior differences above.
2. Add an SSR-safe entry point that defers loading the element modules (or document a
   browser-only dynamic loader; a guard in `registration.ts` alone isn't enough) and a container-query compact
   layout to the single bar chart.
3. Build the ADAPT adapter + wrappers in ADAPT (`adapt-shared-component-lib`), keeping
   the current inputs. Gate them behind a feature flag per section type.
4. Fixture-compare real payloads (for example from `adapt-cdk/seed`) old vs new: counts,
   percentages, suppression, explain text, glossary, CSV.
5. Run the existing browser suites against the integrated viewer, admin preview, and
   grid view. Then do screen-reader testing in the real app.

## Not verified in this audit

Browser/Playwright suites weren't rerun (only unit tests and typecheck). Nothing was
rendered inside ADAPT. No production payloads or template outputs were compared. No AT testing.

## Pilot decisions (November 16, 2026)

These settle the open questions from **Blockers** and **Behavior differences that need
sign-off** above.

| Question | Decision | Work it creates |
| --- | --- | --- |
| Distribution | **GitHub Packages** | Remove `"private": true`, set real versions and `publishConfig.registry`, and add a publish workflow. GitHub Packages requires the npm scope to match the owning account, so the packages were renamed from `@a11y-charts/*` to `@mzebley-aem/*` (decided November 16, 2026). ADAPT's CI and Docker build need a `read:packages` token and an `.npmrc` entry for the scope. |
| Excel export | **Host export hook** | Add a documented extension point so the host can add its own download action (ADAPT builds the workbook with its existing `xlsx` dependency). The chart package stays free of `xlsx`. The hook needs the same rows, metadata and suppression redaction that CSV export uses. |
| Total policy (and percentages, explain denominator) | **New policy** | No library change. Use an authoritative `total` when supplied; with suppressed rows and no total, the total reads "Suppressed". Percentages and explain text can differ from production for the same payload; the fixture comparison must flag these differences as expected, not as regressions. |
| Zero-value rows | **New library option, off by default** | Add an opt-in option that removes unsuppressed zero-value categories from the bars and adds a sentence naming them (ADAPT's "Categories with values of zero: …"). The data table and CSV keep every row. Suppressed rows are never hidden. The ADAPT adapter turns the option on. |
| Explain/Glossary preference persistence | **New library option** | Add an opt-in storage key so a consumer can persist the Explain and Glossary open state across charts and page loads. Storage access is wrapped so a blocked or empty `localStorage` falls back to the default. No storage is used unless the key is set. |

Still open: visual (USWDS) token mapping, and the container-query compact layout for the
single bar chart (agreed as needed; no product decision required).
