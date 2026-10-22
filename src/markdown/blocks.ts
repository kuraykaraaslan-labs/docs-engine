import { toHtml } from 'hast-util-to-html';
import type { Root as HastRoot, RootContent, Element } from 'hast';
import { parseFenceMeta, type FenceMeta } from './fence-meta';
import './rehype-stash-code';

/** What a fence plugin sees: one top-level code fence of the document. */
export type FenceContext<M = FenceMeta> = {
  lang: string;
  meta: M;
  /** The fence body exactly as authored. */
  source: string;
};

/**
 * One entry of a fence registry. Handlers are tried in order; the first whose
 * `lang` and `test` both pass and whose `parse` returns non-null turns the fence
 * into a widget block. Everything else stays a plain code block.
 *
 * `parse` runs at build time on the server, so it may use heavy parsers (yaml,
 * zod) freely — the widget it returns is plain data handed to a client
 * component, and the parser never reaches a browser bundle as long as the
 * client side imports its types with `import type` only.
 */
export type FenceHandler<W, M = FenceMeta> = {
  name: string;
  lang?: string | readonly string[];
  test?: (ctx: FenceContext<M>) => boolean;
  parse: (ctx: FenceContext<M>) => W | null;
};

export type DocBlock<W = never, M = FenceMeta> =
  | { kind: 'html'; id: string; html: string }
  | { kind: 'code'; id: string; lang: string; meta: M; source: string; html: string }
  | { kind: 'widget'; id: string; widget: W; html: string }
  | { kind: 'callout'; id: string; variant: string; title?: string; html: string };

export type SplitBlocksOptions<W, M> = {
  /** Block ids are `${idPrefix}-${ordinal}`. Default "block". */
  idPrefix?: string;
  fences?: readonly FenceHandler<W, M>[];
  /** Parses a fence's info-string meta. Default parseFenceMeta. */
  parseMeta?: (raw: string) => M;
  /** Turn top-level `<aside data-callout>` into 'callout' blocks (rendered with kui's Callout). Default false. */
  liftCallouts?: boolean;
  /**
   * Keep a run that is only whitespace (the "\n" text nodes between top-level
   * elements) as its own html block. Default false. A host whose block ids are
   * already persisted somewhere (progress keys, say) keeps true, because dropping
   * these runs renumbers every later block.
   */
  keepWhitespaceRuns?: boolean;
};

function isElement(node: RootContent, tag: string): node is Element {
  return node.type === 'element' && node.tagName === tag;
}

function findCode(pre: Element): Element | undefined {
  return pre.children.find((c): c is Element => c.type === 'element' && c.tagName === 'code');
}

function extractLang(code: Element | undefined): string {
  const classes = code?.properties?.className;
  const list = Array.isArray(classes) ? classes : [];
  const languageClass = list.find((c) => typeof c === 'string' && c.startsWith('language-'));
  return typeof languageClass === 'string' ? languageClass.slice('language-'.length) : '';
}

function calloutOf(node: Element): { variant: string; title?: string } | null {
  const p = node.properties ?? {};
  const variant = p.dataCallout ?? p['data-callout'];
  if (typeof variant !== 'string') return null;
  const title = p.dataCalloutTitle ?? p['data-callout-title'];
  return { variant, title: typeof title === 'string' ? title : undefined };
}

function matches<W, M>(handler: FenceHandler<W, M>, ctx: FenceContext<M>): boolean {
  if (handler.lang !== undefined) {
    const langs = typeof handler.lang === 'string' ? [handler.lang] : handler.lang;
    if (!langs.includes(ctx.lang)) return false;
  }
  return handler.test ? handler.test(ctx) : true;
}

/**
 * Splits a document's hast tree into render blocks at top-level `<pre>` (and,
 * optionally, callout) boundaries. Runs of anything else become one 'html'
 * block each; every fence becomes a 'code' block or, if a registered fence
 * handler claims it, a 'widget' block. Fences nested inside lists or
 * blockquotes stay inside their html run.
 */
export function splitBlocks<W = never, M = FenceMeta>(
  root: HastRoot,
  options: SplitBlocksOptions<W, M> = {}
): DocBlock<W, M>[] {
  const { idPrefix = 'block', fences = [], liftCallouts = false, keepWhitespaceRuns = false } = options;
  const parseMeta = options.parseMeta ?? (parseFenceMeta as unknown as (raw: string) => M);

  const blocks: DocBlock<W, M>[] = [];
  let ordinal = 0;
  let run: RootContent[] = [];

  const nextId = () => `${idPrefix}-${ordinal++}`;
  function flushHtml() {
    if (run.length === 0) return;
    if (!keepWhitespaceRuns && run.every((n) => n.type === 'text' && n.value.trim() === '')) {
      run = [];
      return;
    }
    blocks.push({ kind: 'html', id: nextId(), html: toHtml({ type: 'root', children: run }) });
    run = [];
  }

  for (const node of root.children) {
    if (liftCallouts && isElement(node, 'aside')) {
      const callout = calloutOf(node);
      if (callout) {
        flushHtml();
        blocks.push({ kind: 'callout', id: nextId(), ...callout, html: toHtml({ type: 'root', children: node.children }) });
        continue;
      }
    }

    if (!isElement(node, 'pre')) {
      run.push(node);
      continue;
    }
    flushHtml();

    const code = findCode(node);
    const ctx: FenceContext<M> = {
      lang: extractLang(code),
      meta: parseMeta(code?.data?.meta ?? ''),
      source: code?.data?.source ?? '',
    };
    const html = toHtml(node);
    const id = nextId();

    let widget: W | null = null;
    for (const handler of fences) {
      if (!matches(handler, ctx)) continue;
      widget = handler.parse(ctx);
      if (widget !== null) break;
    }

    blocks.push(widget !== null ? { kind: 'widget', id, widget, html } : { kind: 'code', id, ...ctx, html });
  }
  flushHtml();

  return blocks;
}
