// Type-checks a package's test-d/*.mts files against its installed tarball.
//
// Called by each package's packed-smoke script after the tarball is installed
// into a throwaway consumer. The files are compiled with every supported
// TypeScript version and module-resolution mode, with skipLibCheck off so the
// shipped declarations themselves are checked, not just the test files.
import { execFileSync } from 'node:child_process';
import { cp, readdir } from 'node:fs/promises';
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

  for (const compiler of COMPILERS) {
    for (const resolution of RESOLUTIONS) {
      try {
        execFileSync(
          process.execPath,
          [
            resolve(root, compiler.bin),
            '--strict', '--noEmit', '--target', 'ES2022', '--lib', 'ES2022,DOM,DOM.Iterable',
            '--skipLibCheck', 'false',
            ...resolution.flags,
            ...inputs
          ],
          { cwd: consumer, stdio: 'inherit' }
        );
      } catch {
        throw new Error(`Packed type tests failed under ${compiler.label} with ${resolution.label} resolution.`);
      }
    }
  }
}
