# Fence plugins

A fence plugin turns a code fence into a widget. It has two halves:

1. a **handler**, run at build time, that parses the fence into plain data, and
2. a **renderer**, a React component that draws that data.

The handler may use heavy parsers (YAML, zod) freely: they run on the server and
never reach the browser, because only the parsed data is passed to the renderer.

## Example

````md
```cards
- title: Installation
  href: /docs/getting-started/installation
```
````

```tsx title="lib/docs.tsx"
import { parse } from 'yaml';
import { createDocsRoutes } from '@kuraykaraaslan/docs/next';
import type { FenceHandler } from '@kuraykaraaslan/docs';

type CardsWidget = { type: 'cards'; cards: { title: string; href: string }[] };

const cards: FenceHandler<CardsWidget> = {
  name: 'cards',
  lang: 'cards',
  parse: ({ source }) => ({ type: 'cards', cards: parse(source) }),
};

export const docs = createDocsRoutes<CardsWidget>({
  config,
  collection: 'docs',
  fences: [cards],
  components: {
    widgets: { cards: ({ widget }) => <CardGrid cards={widget.cards} /> },
  },
});
```

## Matching

Handlers are tried in order. A handler matches when its `lang` (a string or a
list) includes the fence language and its optional `test(ctx)` returns true; the
first one whose `parse` returns non-null wins. `ctx` carries `lang`, `source` (the
fence body as written) and `meta` (the info string after the language, parsed into
`flags` and `attrs`).

A widget with no registered renderer falls back to its fence's highlighted code.
To take over plain code blocks instead (a "Run" button, say), pass
`components.code`, which returns a node or `undefined` to keep the default.

> [!CAUTION]
> If a renderer is a `'use client'` component, import the handler module's types
> with `import type` only. A value import pulls the parser into the client bundle.
