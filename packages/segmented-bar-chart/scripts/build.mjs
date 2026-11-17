import { mkdir, rm, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { resolve } from 'node:path';
import { build } from 'vite';
import { bundleTypes } from '../../../scripts/bundle-types.mjs';
import { createLibraryConfig, createStylesConfig } from '../vite.library.config.mjs';

const root = resolve(fileURLToPath(new URL('..', import.meta.url)));
const dist = resolve(root, 'dist');
await rm(dist, { recursive: true, force: true });
await mkdir(dist, { recursive: true });
await bundleTypes({ root });

for (const [entry, fileName] of [
  ['src/index.ts', 'index.js'],
  ['src/core.ts', 'core.js'],
  ['src/define.ts', 'chart.js']
]) {
  await build(createLibraryConfig({ root, entry, fileName, format: fileName === 'chart.js' ? 'iife' : 'es' }));
}
// ESM registration must share the constructors exported by the package root.
await writeFile(resolve(dist, 'define.js'), `export { A11Y_SEGMENTED_BAR_CHART_TAG_NAME, defineA11ySegmentedBarChart } from './index.js';
import { defineA11ySegmentedBarChart } from './index.js';
defineA11ySegmentedBarChart();
`);
// SSR-safe loader: no static imports, so Node can import it without a DOM.
await writeFile(resolve(dist, 'loader.js'), `let pending;
export function loadA11ySegmentedBarChart() {
  if (typeof customElements === 'undefined' || typeof HTMLElement === 'undefined') return Promise.resolve(false);
  pending ??= import('./define.js').then(() => true, (error) => { pending = undefined; throw error; });
  return pending;
}
`);
await build(createStylesConfig({ root }));
console.log('Built shared-identity segmented-bar ESM entries, standalone browser bundle, declarations, and stylesheet.');
