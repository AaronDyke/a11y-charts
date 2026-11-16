import { cp, rm, stat } from 'node:fs/promises';

// The deployed site: the docs at the root, and the existing gallery, report
// demos, and standalone demos under /gallery/ until they move into the docs.
// Run after `site:build` (dist/gallery) and the docs build (docs/dist).
const root = new URL('../', import.meta.url);
const output = new URL('dist/site/', root);
const docs = new URL('docs/dist/', root);
const gallery = new URL('dist/gallery/', root);

for (const [name, dir] of [['docs', docs], ['gallery', gallery]]) {
	try {
		await stat(dir);
	} catch {
		throw new Error(`Missing ${name} build at ${dir.pathname}. Run \`npm run deploy:build\`.`);
	}
}

await rm(output, { recursive: true, force: true });
await cp(docs, output, { recursive: true });
await cp(gallery, new URL('gallery/', output), { recursive: true });
