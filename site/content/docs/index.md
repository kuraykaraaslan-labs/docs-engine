---
title: Introduction
description: Markdown documentation for the Next.js App Router, configured from one file.
---

`@kuraykaraaslan/docs` turns a folder of Markdown files into a documentation site
inside your own Next.js app. You write `.md` files, describe the navbar, sidebars
and footer in a typed `docs.config.ts`, and mount the engine on a route. The chrome
is built from [kui-react](https://github.com/kuraykaraaslan-labs/kui-react)
components, so it matches every other KUI app.

```cards
- title: Installation
  href: /docs/getting-started/installation
  text: Add the package and mount your first collection.
- title: Writing pages
  href: /docs/authoring/pages
  text: Frontmatter, titles, slugs and drafts.
- title: Sidebars
  href: /docs/authoring/sidebars
  text: Generated from folders, or listed by hand.
- title: Fence plugins
  href: /docs/authoring/fence-plugins
  text: Turn a code fence into an interactive widget.
```

## How it differs from Docusaurus

- **It is a library, not a framework.** Your app keeps its own routes, layouts and
  pages; the engine provides a loader, a markdown pipeline and React components.
- **Plain Markdown, no MDX.** Interactive content comes from
  [fence plugins](/docs/authoring/fence-plugins): a fenced block whose data is
  parsed at build time and rendered by a component you register.
- **Everything is static.** Pages are generated with `generateStaticParams`; there is
  no runtime markdown parser and no client JavaScript for prose.
