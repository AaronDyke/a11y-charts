// Type-checks a package's test-d/*.mts files against its installed tarball.
//
// Called by each package's packed-smoke script after the tarball is installed
// into a throwaway consumer. The files are compiled with every supported
// TypeScript version and module-resolution mode, with skipLibCheck off so the
// shipped declarations themselves are checked, not just the test files.
// The /core entry is also compiled without the DOM lib, because it is
// documented as safe for server code.
import { execFileSync } from 'node:child_process';
import { cp, readFile, readdir, writeFile } from 'node:fs/promises';
import { join, resolve } from 'node:path';

// Oldest supported consumer TypeScript is 5.5 (documented in each README).
const COMPILERS = [
  { label: 'TypeScript 7', bin: 'node_modules/typescript/bin/tsc' },
  { label: 'TypeScript 5.5', bin: 'node_modules/typescript-5.5/bin/tsc' }
];

const RESOLUTIONS = [
  { label: 'NodeNext', flags: ['--module', 'NodeNext', '--moduleResolution', 'NodeNext'] },
  { label: 'Bundler', flags: ['--module', 'ESNext', '--moduleResolution', 'Bundler'] }
];

/**
 * @param {{ root: string, consumer: string }} options
 *   root: absolute path to the package that was packed.
 *   consumer: absolute path to the folder the tarball was installed into.
 */
export async function checkPackedTypes({ root, consumer }) {
  const source = resolve(root, 'test-d');
  const files = (await readdir(source)).filter((name) => name.endsWith('.mts'));
  if (files.length === 0) throw new Error(`${source} has no .mts type tests.`);
  await cp(source, join(consumer, 'test-d'), { recursive: true });
  const inputs = files.map((name) => join('test-d', name));
  const { name } = JSON.parse(await readFile(resolve(root, 'package.json'), 'utf8'));
  await writeFile(join(consumer, 'core-without-dom.mts'), `export type * as core from '${name}/core';\n`);

  for (const compiler of COMPILERS) {
    for (const resolution of RESOLUTIONS) {
      compile(root, consumer, compiler, resolution, ['--lib', 'ES2022,DOM,DOM.Iterable', ...inputs], 'type tests');
      compile(root, consumer, compiler, resolution, ['--lib', 'ES2022', 'core-without-dom.mts'], '/core without the DOM lib');
    }
  }
}

function compile(root, consumer, compiler, resolution, args, label) {
  try {
    execFileSync(
      process.execPath,
      [resolve(root, compiler.bin), '--strict', '--noEmit', '--target', 'ES2022', '--skipLibCheck', 'false', ...resolution.flags, ...args],
      { cwd: consumer, stdio: 'inherit' }
    );
  } catch {
    throw new Error(`Packed ${label} failed under ${compiler.label} with ${resolution.label} resolution.`);
  }
}
