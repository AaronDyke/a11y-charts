# A11y Charts docs

The documentation site, built with [Astro Starlight](https://starlight.astro.build).

Pages live in `src/content/docs/` as Markdown or MDX. The sidebar is set in
`astro.config.mjs`.

## Live examples

`src/components/ChartExample.astro` renders a real chart from the installed
package build and shows the code that produces it. The snippet is generated
from the same `properties` object, so the example and its code stay in sync:

```mdx
import ChartExample from '../../../components/ChartExample.astro';

<ChartExample type="bar" properties={{ chartTitle: 'By sex', data: [...], total: 27 }} />
```

The chart packages are installed with `file:` links, so the examples run each
package's built `dist`, the same artifact consumers install. Build the
packages before running the docs.

## Commands

From the repository root:

| Command | Action |
| --- | --- |
| `npm run build` | Build the chart packages (needed once, and after package changes). |
| `npm run docs:dev` | Start the docs dev server at `localhost:4321`. |
| `npm run docs:build` | Build the packages, then the docs, to `docs/dist/`. |
