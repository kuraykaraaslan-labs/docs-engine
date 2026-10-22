import { TableOfContents, type TocItem } from './kui/ui/TableOfContents';
import { DocPager } from './kui/ui/DocPager';
import { BlockRenderer, type BlockComponents } from './BlockRenderer';
import type { DocBlock } from '../markdown/blocks';
import type { DocLink } from '../content/types';

export type DocPageProps<W extends { type: string }> = {
  title: string;
  description?: string;
  hideTitle?: boolean;
  blocks: DocBlock<W>[];
  components?: BlockComponents<W>;
  /** Headings for "On this page". Empty or omitted = no table of contents. */
  toc?: TocItem[];
  tocMinDepth?: number;
  tocMaxDepth?: number;
  prev?: DocLink | null;
  next?: DocLink | null;
  editUrl?: string;
  /** Above the title: breadcrumbs, badges, ... */
  header?: React.ReactNode;
  /** Between the content and the pager. */
  footer?: React.ReactNode;
};

/** One document: title, content blocks, an "On this page" rail from xl up, edit link and prev/next pager. */
export function DocPage<W extends { type: string } = never>({
  title,
  description,
  hideTitle,
  blocks,
  components,
  toc = [],
  tocMinDepth = 2,
  tocMaxDepth = 3,
  prev,
  next,
  editUrl,
  header,
  footer,
}: DocPageProps<W>) {
  const hasToc = toc.some((h) => h.depth >= tocMinDepth && h.depth <= tocMaxDepth);

  return (
    <div className="mx-auto flex w-full max-w-6xl gap-10">
      <article className="min-w-0 flex-1 pb-8">
        {header}
        {!hideTitle && (
          <header className="mb-6">
            <h1 className="text-3xl font-bold tracking-tight text-text-primary">{title}</h1>
            {description && <p className="mt-2 text-base text-text-secondary">{description}</p>}
          </header>
        )}
        <BlockRenderer blocks={blocks} components={components} />
        {footer}
        {editUrl && (
          <p className="mt-10 text-sm">
            <a href={editUrl} target="_blank" rel="noopener noreferrer" className="text-text-secondary underline-offset-2 hover:text-primary hover:underline">
              Edit this page
            </a>
          </p>
        )}
        <DocPager prev={prev} next={next} className="mt-10" />
      </article>
      {hasToc && (
        <aside className="hidden w-56 shrink-0 xl:block">
          <TableOfContents items={toc} minDepth={tocMinDepth} maxDepth={tocMaxDepth} className="sticky top-4" />
        </aside>
      )}
    </div>
  );
}
