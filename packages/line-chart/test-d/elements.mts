// The element, its events and its attribute-backed properties are typed for consumers.
import type {
  A11yLineChartDataView,
  A11yLineChartElement,
  A11yLineChartHeadingLevel,
  A11yLineChartPercentScale,
  A11yLineChartPointChangeDetail,
  A11yLineChartReadyDetail,
  A11yLineChartValuePreset
} from '@mzebley-aem/line-chart';
import '@mzebley-aem/line-chart/define';

type Equal<A, B> = (<T>() => T extends A ? 1 : 2) extends (<T>() => T extends B ? 1 : 2) ? true : false;
const assertType = <T extends true>(): T => true as T;

// Tag names resolve to the element class without casts.
const created = document.createElement('a11y-line-chart');
assertType<Equal<typeof created, A11yLineChartElement>>();
const queried = document.querySelector('a11y-line-chart');
assertType<Equal<typeof queried, A11yLineChartElement | null>>();

// Listeners on the element, its ancestors, document and window get typed details.
created.addEventListener('a11y-line-chart-point-change', (event) => {
  assertType<Equal<typeof event.detail, A11yLineChartPointChangeDetail>>();
});
document.addEventListener('a11y-line-chart-ready', (event) => {
  assertType<Equal<typeof event.detail, A11yLineChartReadyDetail>>();
});
window.addEventListener('a11y-line-chart-error', (event) => {
  const code: 'invalid-baseline' | 'invalid-data' | 'invalid-messages' = event.detail.code;
  void code;
});
document.body.addEventListener('a11y-line-chart-data-view-change', (event) => {
  const open: boolean = event.detail.open;
  void open;
});

// Attribute-backed properties read the effective value and accept null to clear the attribute.
assertType<Equal<typeof created.headingLevel, A11yLineChartHeadingLevel>>();
assertType<Equal<typeof created.dataView, A11yLineChartDataView>>();
assertType<Equal<typeof created.percentScale, A11yLineChartPercentScale>>();
assertType<Equal<typeof created.valuePreset, A11yLineChartValuePreset>>();
created.headingLevel = 3;
created.headingLevel = null;
created.dataView = 'inline';
created.percentScale = 'fraction';
created.valuePreset = 'number';
