import '@mzebley-aem/bar-chart/define';
import '@mzebley-aem/bar-chart/styles.css';
import './adapt-report-theme.css';
import './theme-comparison.css';
import type { A11yBarChartElement } from '@mzebley-aem/bar-chart';
import type { A11yBarChartGroupElement } from '@mzebley-aem/bar-chart';
import type { A11yBarChartViewSection } from '@mzebley-aem/bar-chart';

const text = <K extends keyof HTMLElementTagNameMap>(tag: K, value: string, className = ''): HTMLElementTagNameMap[K] => {
  const element = document.createElement(tag);
  element.textContent = value;
  element.className = className;
  return element;
};

const sexData = [
  { id: 'male', label: 'Male', value: 14, definition: 'Children reported as male during the reporting period.' },
  { id: 'female', label: 'Female', value: 13, definition: 'Children reported as female during the reporting period.' }
];
const ageData = [
  { id: 'under-3', label: 'Under age 3', value: 175 },
  { id: 'age-3', label: 'Age 3', value: 140 },
  { id: 'age-4', label: 'Age 4', value: 125 },
  { id: 'age-5', label: 'Age 5', value: 70 }
];

function ageSection(): A11yBarChartViewSection {
  const allAges = {
    id: 'all-ages', label: 'All Ages', chartTitle: 'Children by age',
    context: 'Illustrative values shown to compare chart themes.',
    dataNote: 'This grouped theme fixture totals 510.', data: ageData,
    total: 510, suppressed: false, filtered: false
  };
  const youngerChildren = {
    id: 'birth-through-two', label: 'Birth through age 2', chartTitle: 'Children birth through age 2',
    context: 'Illustrative values shown to exercise grouped selection and theme inheritance.',
    dataNote: 'This view totals 210.',
    data: [
      { id: 'infants', label: 'Birth through age 1', value: 110 },
      { id: 'age-2', label: 'Age 2', value: 100 }
    ],
    total: 210, suppressed: false, filtered: false
  };
  return { id: 'age', label: 'Age', allViewId: allAges.id, views: [allAges, youngerChildren] };
}

function standalone(title: string, reportPresentation = false): A11yBarChartElement {
  const chart = document.createElement('a11y-bar-chart');
  if (reportPresentation) chart.classList.add('a11y-bar-chart--endpoint-values');
  chart.chartTitle = title;
  chart.context = 'There are 27 children, male or female, who received early intervention services from 1/1/2024 to 12/31/2024.';
  chart.dataNote = 'Reported values: Male 14; Female 13; total 27.';
  chart.data = structuredClone(sexData);
  chart.total = 27;
  chart.config = {
    // The full-width chart sits directly under a `##` heading; card charts sit under a `###` card heading.
    headingLevel: reportPresentation ? 3 : 4, showActions: true, showSummary: false, showContext: true,
    showExplanation: true, explanationExpanded: false, showGlossary: true,
    showDetails: false, dataView: 'dialog', showTotal: true
  };
  chart.messages = {
    explain: 'Explain', hideExplanation: 'Explain',
    glossary: 'Glossary', hideGlossary: 'Glossary', showData: 'Data'
  };
  chart.explanation = 'During this reporting period, 14 children were male and 13 children were female. Together, the categories account for all 27 children.';
  return chart;
}

function grouped(title: string): A11yBarChartGroupElement {
  const chart = document.createElement('a11y-bar-chart-group');
  chart.config = { headingLevel: 4, showActions: true, showSummary: false, showContext: false, dataView: 'dialog' };
  chart.groupMessages = { selectorLabel: `${title}: age selection` };
  chart.sections = [ageSection()];
  return chart;
}

function card(theme: 'default' | 'adapt-theme-fixture theme-adapt' | 'theme-contrast', kind: 'standalone' | 'grouped'): HTMLElement {
  const adapted = theme.includes('theme-adapt');
  const cls = ['theme-demo-card', adapted ? 'adapt-theme-fixture' : '', ...theme.split(' ')].filter(Boolean).join(' ');
  const article = text('article', '', cls);
  article.append(text('h3', theme === 'default' ? 'Component defaults' : adapted ? 'Adapt token adapter' : 'Alternate theme'));
  article.append(text('p', theme === 'default'
    ? 'Component-provided visual defaults.'
    : adapted
      ? 'Scoped --usa-data-rep-* fixture values bridge into --a11y-charts-* properties.'
      : 'A separate local palette, typeface, spacing, and geometry set.', 'theme-demo-caption'));
  const themeLabel = theme === 'default' ? 'Component defaults' : adapted ? 'Adapt token adapter' : 'Alternate theme';
  article.append(kind === 'standalone' ? standalone('Child Count by Sex') : grouped(`Children by age — ${themeLabel}`));
  return article;
}

/**
 * Fills the theme comparison page. The page's markup holds the headings and the
 * slots: #adapt-report-preview, #theme-standalone, and #theme-grouped.
 */
function mountThemeComparison(): void {
  const report = document.querySelector<HTMLElement>('#adapt-report-preview');
  report?.append(standalone('By Sex (Suppressed)', true));
  document.querySelector('#theme-standalone')?.append(
    card('default', 'standalone'), card('adapt-theme-fixture theme-adapt', 'standalone'), card('theme-contrast', 'standalone')
  );
  document.querySelector('#theme-grouped')?.append(
    card('default', 'grouped'), card('adapt-theme-fixture theme-adapt', 'grouped'), card('theme-contrast', 'grouped')
  );
}

mountThemeComparison();
