// The elements, their events and attribute-backed properties are typed for consumers.
import type {
  A11yBarChartDataChangeDetail,
  A11yBarChartDataView,
  A11yBarChartElement,
  A11yBarChartGroupElement,
  A11yBarChartGroupSelectionChangeDetail,
  A11yBarChartHeadingLevel,
  A11yBarChartPercentScale,
  A11yBarChartReadyDetail
} from '@mzebley-aem/bar-chart';
import '@mzebley-aem/bar-chart/define';

type Equal<A, B> = (<T>() => T extends A ? 1 : 2) extends (<T>() => T extends B ? 1 : 2) ? true : false;
const assertType = <T extends true>(): T => true as T;

// Tag names resolve to the element classes without casts.
const chart = document.createElement('a11y-bar-chart');
assertType<Equal<typeof chart, A11yBarChartElement>>();
const group = document.querySelector('a11y-bar-chart-group');
assertType<Equal<typeof group, A11yBarChartGroupElement | null>>();

// Listeners on the element, its ancestors, document and window get typed details.
chart.addEventListener('a11y-bar-chart-data-change', (event) => {
  assertType<Equal<typeof event.detail, A11yBarChartDataChangeDetail>>();
});
document.addEventListener('a11y-bar-chart-ready', (event) => {
  assertType<Equal<typeof event.detail, A11yBarChartReadyDetail>>();
});
window.addEventListener('a11y-bar-chart-group-selection-change', (event) => {
  assertType<Equal<typeof event.detail, A11yBarChartGroupSelectionChangeDetail>>();
});

// Attribute-backed properties read the effective value and accept null to clear the attribute.
assertType<Equal<typeof chart.headingLevel, A11yBarChartHeadingLevel>>();
assertType<Equal<typeof chart.dataView, A11yBarChartDataView>>();
assertType<Equal<typeof chart.percentScale, A11yBarChartPercentScale>>();
chart.headingLevel = 3;
chart.headingLevel = null;
chart.dataView = 'inline';
chart.percentScale = 'fraction';
