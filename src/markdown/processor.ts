import { unified, type PluggableList } from 'unified';
import remarkParse from 'remark-parse';
import remarkGfm from 'remark-gfm';
import remarkRehype from 'remark-rehype';
import rehypeHighlight, { type Options as HighlightOptions } from 'rehype-highlight';
import { toHtml } from 'hast-util-to-html';
import { VFile, type DataMap } from 'vfile';
import type { Root as HastRoot } from 'hast';
import { remarkCallouts, type RemarkCalloutsOptions } from './remark-callouts';
import { admonitionsToCallouts } from './admonitions';
import { rehypeHeadingIds } from './headings';
import { rehypeStashCode } from './rehype-stash-code';

export type MarkdownOptions = {
  /** Remark plugins run after gfm and callouts, before the hast conversion. */
  remarkPlugins?: PluggableList;
  /** Rehype plugins run after heading ids, before code stashing and highlighting. */
  rehypePlugins?: PluggableList;
  /** GFM `> [!KIND]` callouts, with same-line titles on by default. `false` turns them off. */
  callouts?: false | RemarkCalloutsOptions;
  /** Docusaurus `:::kind` admonitions (rewritten to callouts). Default true; ignored when callouts are off. */
  admonitions?: boolean;
  /** Slug ids on h1-h6 (needed for a table of contents). Default true. */
  headingIds?: boolean;
  /** highlight.js classes on fenced code. `false` turns it off. */
  highlight?: false | HighlightOptions;
};

export type MarkdownProcessor = {
  /** Markdown -> hast. `data` lands on the vfile, for plugins that need per-document state. */
  toHast(markdown: string, data?: Partial<DataMap>): HastRoot;
  toHtml(markdown: string, data?: Partial<DataMap>): string;
};

/**
 * Builds one synchronous markdown pipeline:
 *
 *   parse → gfm → callouts → [remarkPlugins] → rehype → heading ids
 *         → [rehypePlugins] → stash code source → highlight
 *
 * Build it once at module level and reuse it: per-document state goes through
 * `data`, not through plugin options, which are fixed when the pipeline is built.
 * Everything in the default chain is sync, so it is safe to call from a Server
 * Component or generateStaticParams.
 */
export function createMarkdownProcessor(options: MarkdownOptions = {}): MarkdownProcessor {
  const { admonitions = true, headingIds = true, highlight = {} } = options;
  const callouts = options.callouts === false ? false : { titles: true, ...options.callouts };

  const processor = unified().use(remarkParse).use(remarkGfm);
  if (callouts !== false) processor.use(remarkCallouts, callouts);
  if (options.remarkPlugins) processor.use(options.remarkPlugins);
  processor.use(remarkRehype);
  if (headingIds) processor.use(rehypeHeadingIds);
  if (options.rehypePlugins) processor.use(options.rehypePlugins);
  processor.use(rehypeStashCode);
  if (highlight !== false) processor.use(rehypeHighlight, highlight);

  const rewrite = callouts !== false && admonitions ? (md: string) => admonitionsToCallouts(md, callouts.kinds) : (md: string) => md;

  function toHast(markdown: string, data?: Partial<DataMap>): HastRoot {
    const file = new VFile(rewrite(markdown));
    if (data) Object.assign(file.data, data);
    return processor.runSync(processor.parse(file), file) as HastRoot;
  }

  return {
    toHast,
    toHtml: (markdown, data) => toHtml(toHast(markdown, data)),
  };
}
