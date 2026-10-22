# Project structure

A typical site:

```txt
docs.config.ts              ← site, navbar, footer, collections, sidebars
content/docs/
  index.md                  ← /docs
  01-getting-started/
    _category_.json         ← label, position, collapsed
    01-installation.md      ← /docs/getting-started/installation
lib/docs.ts                 ← createDocsRoutes(...)
app/docs/layout.tsx         ← docs.Layout
app/docs/[[...slug]]/page.tsx
```

## Package entry points

| Import | Use it from | Contents |
|---|---|---|
| `@kuraykaraaslan/docs` | anywhere | `defineDocsConfig`, shared types |
| `@kuraykaraaslan/docs/content` | server only | collection loader, frontmatter, sidebar resolution |
| `@kuraykaraaslan/docs/markdown` | server only | markdown pipeline, fence registry, heading extraction |
| `@kuraykaraaslan/docs/ui` | server components | shell, doc page, block renderer, kui components |
| `@kuraykaraaslan/docs/next` | route files | `createDocsRoutes`, `siteMetadata` |

> [!WARNING]
> `content` and `markdown` read the filesystem and bundle `yaml` and `zod`. Import
> them from a `'use client'` module with `import type` only, or the parser ends up
> in the browser bundle.
