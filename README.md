# @kuraykaraaslan/docs

A Docusaurus-like documentation engine for the Next.js App Router. Write `.md`
files, describe the navbar, sidebars and footer in a typed `docs.config.ts`, and
mount the engine on a route of your own app. The chrome is built from
[kui-react](https://github.com/kuraykaraaslan-labs/kui-react) components.

- **Library, not framework**: your app keeps its own routes and pages.
- **Plain Markdown**: GFM, callouts (`> [!TIP]` and `:::tip`), highlighted code,
  Mermaid, heading anchors, frontmatter.
- **Sidebars** generated from folders (`_category_.json`, number prefixes) or
  listed by hand; prev/next follows the sidebar.
- **Fence plugins**: a fenced block parsed at build time and drawn by a component
  you register, for interactive content without MDX.
- **Static**: every page is prerendered; no runtime markdown parser, no client JS
  for prose.

## Quick start

```bash
npm install github:kuraykaraaslan/docs#<commit>
```

```ts
// next.config.ts
export default { transpilePackages: ['@kuraykaraaslan/docs'] };
```

```css
/* app/globals.css */
@import "tailwindcss";
@import "@kuraykaraaslan/docs/theme.css"; /* skip if you have your own design tokens */
@import "@kuraykaraaslan/docs/styles.css";
```

```ts
// docs.config.ts
import { defineDocsConfig } from '@kuraykaraaslan/docs';

export default defineDocsConfig({
  site: { title: 'My Docs', url: 'https://docs.example.com' },
  navbar: { items: [{ label: 'Docs', href: '/docs' }] },
  collections: [{ id: 'docs', dir: 'content/docs', routeBasePath: 'docs' }],
});
```

```tsx
// lib/docs.ts
import { createDocsRoutes } from '@kuraykaraaslan/docs/next';
import config from '@/docs.config';
export const docs = createDocsRoutes({ config, collection: 'docs' });

// app/docs/layout.tsx
export default docs.Layout;

// app/docs/[[...slug]]/page.tsx
export default docs.Page;
export const generateStaticParams = docs.generateStaticParams;
export const generateMetadata = docs.generateMetadata;
export const dynamicParams = false;
```

The full documentation is in [`site/content/docs`](site/content/docs), built with
the engine itself:

```bash
npm install
npm run site:dev     # http://localhost:3000
```

## Development

| Command | |
|---|---|
| `npm test` | Unit tests (config, loader, sidebar, markdown pipeline, fence registry) |
| `npm run typecheck` | `tsc --noEmit` over `src/` |
| `npm run site:build` | Production build of the documentation site: the end-to-end check |
| `npm run vendor:kui` | Copy the kui-react components again (see below) |
| `npm run check:kui-vendor` | Fail if `src/ui/kui` drifted from kui-react |

`src/ui/kui/` holds copies of kui-react components made by
`scripts/vendor-kui.mjs` (see `src/ui/kui/PROVENANCE.md`). Change them in
kui-react, then re-run `npm run vendor:kui`; never edit the copies.

## License

0BSD
