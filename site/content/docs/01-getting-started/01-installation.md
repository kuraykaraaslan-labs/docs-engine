# Installation

## Add the package

The package ships TypeScript source and is compiled by your app, so pin a commit
and let Next.js transpile it:

```bash
npm install github:kuraykaraaslan-labs/docs-engine#<commit>
```

The repository is `kuraykaraaslan-labs/docs-engine`; the package it installs, and the
name you import from, is `@kuraykaraaslan/docs`.

```ts title="next.config.ts"
const nextConfig = {
  transpilePackages: ['@kuraykaraaslan/docs'],
};
export default nextConfig;
```

Peer dependencies: `next` 16, `react` 19 and `tailwindcss` 4.

## Add the styles

```css title="app/globals.css"
@import "tailwindcss";
@import "@kuraykaraaslan/docs/theme.css"; /* skip if you have your own design tokens */
@import "@kuraykaraaslan/docs/styles.css";
```

> [!IMPORTANT]
> `styles.css` contains the `@source` line that makes Tailwind generate the classes
> the engine's components use. Without it every page renders unstyled.

## Write the config

```ts title="docs.config.ts"
import { defineDocsConfig } from '@kuraykaraaslan/docs';

export default defineDocsConfig({
  site: { title: 'My Docs', url: 'https://docs.example.com' },
  navbar: { items: [{ label: 'Docs', href: '/docs' }] },
  collections: [{ id: 'docs', dir: 'content/docs', routeBasePath: 'docs' }],
});
```

## Mount the routes

```tsx title="lib/docs.ts"
import { createDocsRoutes } from '@kuraykaraaslan/docs/next';
import config from '@/docs.config';

export const docs = createDocsRoutes({ config, collection: 'docs' });
```

```tsx title="app/docs/layout.tsx"
import { docs } from '@/lib/docs';
export default docs.Layout;
```

```tsx title="app/docs/[[...slug]]/page.tsx"
import { docs } from '@/lib/docs';
export default docs.Page;
export const generateStaticParams = docs.generateStaticParams;
export const generateMetadata = docs.generateMetadata;
export const dynamicParams = false;
```

Finally wrap the root layout in `DocsThemeProvider` (next-themes, class strategy) and
use `siteMetadata(config)` for its metadata. Create `content/docs/index.md` and
open `/docs`.
