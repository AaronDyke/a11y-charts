// Emits one self-contained declaration file per package entry point.
//
// Each chart package calls this from its build script. tsc first emits raw
// declarations (which reference chart-core through relative paths outside the
// package) into a scratch folder, then rollup-plugin-dts inlines everything an
// entry needs into dist/types/<entry>.d.ts. Consumers therefore see the same
// layout in every package and never resolve an internal path.
import { execFileSync } from 'node:child_process';
import { mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
import { basename, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

export const DEFAULT_TYPE_ENTRIES = ['index', 'core', 'define', 'loader'];
// Mirrors dist/define.js, which re-exports from ./index.js so both entries share
// one element constructor. Bundling define separately would declare a second,
// incompatible copy of each element class and of its global tag-name entry.
export const DEFAULT_REEXPORT_FROM_INDEX = ['define'];

/**
 * @param {{ root: string, entries?: string[], reexportFromIndex?: string[] }} options
 *   root: absolute path to the package being built.
 *   entries: source entry names under src/ to bundle (without extension).
 *   reexportFromIndex: entries whose declarations become a re-export of ./index.js.
 */
export async function bundleTypes({ root, entries = DEFAULT_TYPE_ENTRIES, reexportFromIndex = DEFAULT_REEXPORT_FROM_INDEX }) {
  // rollup and rollup-plugin-dts are dev dependencies of each package, not of
  // the repo root, so resolve them from the package being built.
  const requireFromPackage = createRequire(resolve(root, 'package.json'));
  const importFromPackage = (specifier) => import(pathToFileURL(requireFromPackage.resolve(specifier)).href);
  const { rollup } = await importFromPackage('rollup');
  // require.resolve picks the CommonJS build, whose default export is nested once more.
  const dtsModule = await importFromPackage('rollup-plugin-dts');
  const dts = typeof dtsModule.default === 'function' ? dtsModule.default : dtsModule.default.default;

  const typesDir = resolve(root, 'dist/types');
  const scratch = resolve(root, 'dist/.types-raw');
  await rm(typesDir, { recursive: true, force: true });
  await rm(scratch, { recursive: true, force: true });
  await mkdir(typesDir, { recursive: true });

  execFileSync(
    process.execPath,
    [resolve(root, 'node_modules/typescript/bin/tsc'), '-p', 'tsconfig.build.json', '--outDir', scratch],
    { cwd: root, stdio: 'inherit' }
  );

  // tsconfig.build.json uses rootDir "..", so declarations land under the package folder name.
  const emittedSrc = resolve(scratch, basename(root), 'src');
  try {
    for (const entry of entries) {
      const output = resolve(typesDir, `${entry}.d.ts`);
      const bundle = await rollup({
        input: resolve(emittedSrc, `${entry}.d.ts`),
        plugins: [dts({ respectExternal: true })]
      });
      await bundle.write({ file: output, format: 'es' });
      await bundle.close();
      if (reexportFromIndex.includes(entry)) await rewriteAsIndexReexport(output);
    }
    for (const entry of entries) await assertSelfContained(resolve(typesDir, `${entry}.d.ts`), entries);
  } finally {
    await rm(scratch, { recursive: true, force: true });
  }
}

async function rewriteAsIndexReexport(file) {
  const source = await readFile(file, 'utf8');
  const exportLists = [...source.matchAll(/^export \{([^}]*)\};?$/gm)];
  if (exportLists.length !== 1 || /^export (?!\{)/m.test(source)) {
    throw new Error(`${file} must end in a single export list to be rewritten as a re-export of ./index.js.`);
  }
  const names = exportLists[0][1].split(',').map((name) => name.trim()).filter(Boolean);
  if (names.some((name) => name.includes(' as '))) throw new Error(`${file} renames an export; re-export it by hand.`);
  await writeFile(file, `export { ${names.join(', ')} } from './index.js';\n`);
}

async function assertSelfContained(file, entries) {
  const source = await readFile(file, 'utf8');
  const specifiers = [...source.matchAll(/(?:from|import)\s*\(?\s*['"]([^'"]+)['"]/g)].map((match) => match[1]);
  // Sibling entry bundles (./index.js) ship in the same folder; anything else is an internal path.
  const siblings = new Set(entries.map((entry) => `./${entry}.js`));
  const relative = specifiers.filter((specifier) => specifier.startsWith('.') && !siblings.has(specifier));
  if (relative.length > 0) {
    throw new Error(`${file} still references internal paths: ${[...new Set(relative)].join(', ')}`);
  }
}
