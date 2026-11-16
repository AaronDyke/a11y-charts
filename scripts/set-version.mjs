// Sets one version on every published package (and its lockfile) so releases stay in lockstep.
// Usage: npm run release:version -- 0.2.0
import { readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { resolve } from 'node:path';

const PACKAGES = ['line-chart', 'bar-chart', 'segmented-bar-chart'];
const version = process.argv[2];
if (!/^\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?$/.test(version ?? '')) {
  console.error('Usage: npm run release:version -- <major.minor.patch[-prerelease]>');
  process.exit(1);
}
const root = resolve(fileURLToPath(new URL('..', import.meta.url)));
for (const name of PACKAGES) {
  for (const file of ['package.json', 'package-lock.json']) {
    const path = resolve(root, 'packages', name, file);
    const json = JSON.parse(await readFile(path, 'utf8'));
    json.version = version;
    if (file === 'package-lock.json' && json.packages?.['']) json.packages[''].version = version;
    await writeFile(path, `${JSON.stringify(json, null, 2)}\n`);
  }
}
console.log(`Set ${PACKAGES.join(', ')} to ${version}. Commit, then tag v${version} to publish.`);
