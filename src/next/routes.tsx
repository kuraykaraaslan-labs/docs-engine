import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import type { DocsConfig } from '../config/schema';
import { loadCollection, getDocBySlug, getDocNeighbors, collectionStaticParams, type LoadOptions } from '../content/loader';
import type { DocRecord, DocsCollection } from '../content/types';
import { createMarkdownProcessor, type MarkdownProcessor } from '../markdown/processor';
import { extractHeadings, type Heading } from '../markdown/headings';
import { splitBlocks, type DocBlock, type FenceHandler } from '../markdown/blocks';
import type { FenceMeta } from '../markdown/fence-meta';
import { DocsShell, type DocsShellProps } from '../ui/DocsShell';
import { DocPage } from '../ui/DocPage';
import type { BlockComponents } from '../ui/BlockRenderer';

export type DocsRoutesOptions<W extends { type: string }> = {
  config: DocsConfig;
  /** Collection id from docs.config.ts. */
  collection: string;
  /** Default: createMarkdownProcessor() with callouts, admonitions and heading ids. */
  markdown?: MarkdownProcessor;
  /** Fence plugins: turn matching code fences into widget blocks. */
  fences?: readonly FenceHandler<W>[];
  /** Renderers for those widgets, and optional code-block overrides. */
  components?: BlockComponents<W>;
  load?: LoadOptions;
  /** Passed through to DocsShell by `Layout`: logo, navbarSlots, ... */
  shell?: Omit<DocsShellProps, 'config' | 'sidebar' | 'children'>;
};

export type RenderedDoc<W> = {
  doc: DocRecord;
  blocks: DocBlock<W>[];
  headings: Heading[];
};

type SlugParams = { params: Promise<{ slug?: string[] }> };

/**
 * Everything a host needs for one collection mounted at
 * `app/<routeBasePath>/[[...slug]]/`:
 *
 *   // layout.tsx
 *   export default docs.Layout;
 *   // page.tsx
 *   export default docs.Page;
 *   export const generateStaticParams = docs.generateStaticParams;
 *   export const generateMetadata = docs.generateMetadata;
 *   export const dynamicParams = false;
 */
export function createDocsRoutes<W extends { type: string } = never>(options: DocsRoutesOptions<W>) {
  const { config, fences = [], components } = options;
  const markdown = options.markdown ?? createMarkdownProcessor();
  const rendered = new Map<string, RenderedDoc<W>>();

  const collection = (): DocsCollection => loadCollection(config, options.collection, options.load);

  function render(doc: DocRecord): RenderedDoc<W> {
    const key = `${doc.absPath}\0${doc.body.length}`;
    const hit = process.env.NODE_ENV === 'development' ? undefined : rendered.get(key);
    if (hit) return hit;
    const hast = markdown.toHast(doc.body);
    const result = {
      doc,
      headings: extractHeadings(hast),
      blocks: splitBlocks<W, FenceMeta>(hast, { idPrefix: 'block', fences, liftCallouts: true }),
    };
    rendered.set(key, result);
    return result;
  }

  async function resolve(params: SlugParams['params']): Promise<DocRecord> {
    const { slug } = await params;
    const doc = getDocBySlug(collection(), slug);
    if (!doc) notFound();
    return doc;
  }

  async function Page({ params }: SlugParams) {
    const doc = await resolve(params);
    const col = collection();
    const { blocks, headings } = render(doc);
    const { prev, next } = getDocNeighbors(col, doc);
    const fm = doc.frontmatter;
    const editBase = col.config.editUrl;
    return (
      <DocPage<W>
        title={doc.title}
        description={doc.description}
        hideTitle={fm.hide_title}
        blocks={blocks}
        components={components}
        toc={fm.hide_table_of_contents ? [] : headings}
        tocMinDepth={fm.toc_min_heading_level ?? config.toc.minDepth}
        tocMaxDepth={fm.toc_max_heading_level ?? config.toc.maxDepth}
        prev={prev}
        next={next}
        editUrl={editBase ? `${editBase.replace(/\/$/, '')}/${doc.filePath}` : undefined}
      />
    );
  }

  function Layout({ children }: { children: React.ReactNode }) {
    return (
      <DocsShell config={config} sidebar={collection().sidebar} {...options.shell}>
        {children}
      </DocsShell>
    );
  }

  return {
    Page,
    Layout,
    generateStaticParams: async () => collectionStaticParams(collection()),
    generateMetadata: async ({ params }: SlugParams): Promise<Metadata> => {
      const doc = await resolve(params);
      const keywords = doc.frontmatter.keywords;
      return {
        title: doc.title,
        description: doc.description,
        keywords,
        alternates: { canonical: doc.href },
        openGraph: { title: doc.title, description: doc.description, url: doc.href },
      };
    },
    collection,
    render,
  };
}
