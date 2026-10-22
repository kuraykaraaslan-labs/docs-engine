# API

## `createDocsRoutes(options)`

Returns `{ Page, Layout, generateStaticParams, generateMetadata, collection, render }`
for one collection. Options: `config`, `collection` (id), `markdown` (a processor),
`fences`, `components`, `load` (`{ rootDir, includeDrafts }`) and `shell` (props
passed to `DocsShell`).

## Building blocks

When the route helpers do not fit (a different URL scheme, extra page chrome), use
the pieces directly:

```tsx
import { loadCollection, getDocBySlug, getDocNeighbors } from '@kuraykaraaslan/docs/content';
import { createMarkdownProcessor, extractHeadings, splitBlocks } from '@kuraykaraaslan/docs/markdown';
import { DocsShell, DocPage } from '@kuraykaraaslan/docs/ui';

const markdown = createMarkdownProcessor({ remarkPlugins: [myPlugin] });
const col = loadCollection(config, 'docs');
const doc = getDocBySlug(col, ['guides', 'writing'])!;
const tree = markdown.toHast(doc.body);

<DocsShell config={config} sidebar={col.sidebar}>
  <DocPage title={doc.title} blocks={splitBlocks(tree, { liftCallouts: true })} toc={extractHeadings(tree)} {...getDocNeighbors(col, doc)} />
</DocsShell>;
```

## `createMarkdownProcessor(options)`

The pipeline is `parse → gfm → callouts → remarkPlugins → rehype → heading ids →
rehypePlugins → stash code → highlight`. Options: `remarkPlugins`, `rehypePlugins`,
`callouts` (`false` or `{ kinds, titles }`), `admonitions`, `headingIds`,
`highlight` (`false` or rehype-highlight options). `toHast(md, data)` puts `data` on
the vfile for plugins that need per-document state.

## `splitBlocks(tree, options)`

Cuts a document into `html`, `code`, `widget` and `callout` blocks. Options:
`idPrefix`, `fences`, `parseMeta`, `liftCallouts`, `keepWhitespaceRuns`.
