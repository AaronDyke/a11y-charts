// The element, its events and its attribute-backed properties are typed for consumers.
import type {
  A11ySegmentedBarChartDataChangeDetail,
  A11ySegmentedBarChartDataView,
  A11ySegmentedBarChartElement,
  A11ySegmentedBarChartHeadingLevel,
  A11ySegmentedBarChartPercentScale,
  A11ySegmentedBarChartReadyDetail
} from '@mzebley-aem/segmented-bar-chart';
import '@mzebley-aem/segmented-bar-chart/define';

type Equal<A, B> = (<T>() => T extends A ? 1 : 2) extends (<T>() => T extends B ? 1 : 2) ? true : false;
const assertType = <T extends true>(): T => true as T;

// Tag names resolve to the element class without casts.
const chart = document.createElement('a11y-segmented-bar-chart');
assertType<Equal<typeof chart, A11ySegmentedBarChartElement>>();
const queried = document.querySelector('a11y-segmented-bar-chart');
assertType<Equal<typeof queried, A11ySegmentedBarChartElement | null>>();

// Listeners on the element, its ancestors, document and window get typed details.
chart.addEventListener('a11y-segmented-bar-chart-data-change', (event) => {
  assertType<Equal<typeof event.detail, A11ySegmentedBarChartDataChangeDetail>>();
});
document.addEventListener('a11y-segmented-bar-chart-ready', (event) => {
  assertType<Equal<typeof event.detail, A11ySegmentedBarChartReadyDetail>>();
});
window.addEventListener('a11y-segmented-bar-chart-disclosure-change', (event) => {
  const disclosure: 'explanation' | 'glossary' = event.detail.disclosure;
  void disclosure;
});

// Attribute-backed properties read the effective value and accept null to clear the attribute.
assertType<Equal<typeof chart.headingLevel, A11ySegmentedBarChartHeadingLevel>>();
assertType<Equal<typeof chart.dataView, A11ySegmentedBarChartDataView>>();
assertType<Equal<typeof chart.percentScale, A11ySegmentedBarChartPercentScale>>();
chart.headingLevel = 3;
chart.headingLevel = null;
chart.dataView = 'none';
chart.percentScale = 'fraction';
