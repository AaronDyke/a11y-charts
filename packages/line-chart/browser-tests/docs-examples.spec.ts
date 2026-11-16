import { existsSync, readdirSync, statSync } from 'node:fs';
import { join, relative, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { expect, test } from '@playwright/test';

// Every live example in the docs must render a usable chart. A page passes when
// each chart element has rendered content, no chart raised its `-error` event,
// no chart shows an alert, and the page threw no errors.

const docsDist = fileURLToPath(new URL('../../../docs/dist/', import.meta.url));
const CHART_SELECTOR = 'a11y-line-chart, a11y-bar-chart, a11y-bar-chart-group, a11y-segmented-bar-chart';

/** Every built page, as a site path such as `/charts/line-chart/`. */
function builtPages(dir = docsDist): string[] {
  const pages: string[] = [];
  for (const name of readdirSync(dir)) {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) {
      // Static assets and the search index have no pages.
      if (!['_astro', 'pagefind'].includes(name)) pages.push(...builtPages(path));
    } else if (name === 'index.html') {
      const route = relative(docsDist, dir).split(sep).filter(Boolean).join('/');
      pages.push(route ? `/${route}/` : '/');
    }
  }
  return pages.sort();
}

if (!existsSync(docsDist)) throw new Error(`No docs build at ${docsDist}. Run \`npm run docs:build\` first.`);
const pages = builtPages();

test('the docs build contains pages with live examples', () => {
  expect(pages.length).toBeGreaterThan(1);
});

for (const path of pages) {
  test(`docs page ${path} renders its chart examples without errors`, async ({ page }) => {
    const pageErrors: string[] = [];
    page.on('pageerror', (error) => pageErrors.push(error.message));

    // Chart error events bubble to the document. Record them from the start,
    // before any chart is defined.
    await page.addInitScript(() => {
      const events: string[] = [];
      (window as unknown as { __chartErrors: string[] }).__chartErrors = events;
      for (const type of ['a11y-line-chart-error', 'a11y-bar-chart-error', 'a11y-segmented-bar-chart-error']) {
        document.addEventListener(type, (event) => {
          const detail = (event as CustomEvent<{ code?: string; message?: string }>).detail ?? {};
          events.push(`${type}: ${detail.code ?? ''} ${detail.message ?? ''}`.trim());
        });
      }
    });

    await page.goto(path);
    const charts = page.locator(CHART_SELECTOR);
    const count = await charts.count();

    if (count > 0) {
      // Wait until every chart has rendered something.
      await expect
        .poll(() => charts.evaluateAll((elements) => elements.filter((element) => element.childElementCount === 0).length))
        .toBe(0);
    }

    const alerts = await charts.evaluateAll((elements) =>
      elements.flatMap((element) =>
        [...element.querySelectorAll('[role="alert"]')]
          .map((alert) => alert.textContent?.trim() ?? '')
          .filter(Boolean)
          .map((text) => `${element.tagName.toLowerCase()}: ${text}`),
      ),
    );
    const chartErrors = await page.evaluate(() => (window as unknown as { __chartErrors: string[] }).__chartErrors);

    expect({ pageErrors, chartErrors, alerts }).toEqual({ pageErrors: [], chartErrors: [], alerts: [] });
  });
}
