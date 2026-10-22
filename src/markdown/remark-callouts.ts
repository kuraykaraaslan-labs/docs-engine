import { visit } from 'unist-util-visit';
import type { Root, Blockquote, Paragraph, Text } from 'mdast';

export const DEFAULT_CALLOUT_KINDS = ['note', 'tip', 'info', 'important', 'warning', 'caution', 'danger'] as const;

export type RemarkCalloutsOptions = {
  /** Accepted markers, case-insensitive. Default: GFM's five plus Docusaurus' info and danger. */
  kinds?: readonly string[];
  /**
   * Treat text after the marker on the same line as the callout's title
   * (`> [!TIP] Faster builds`), emitted as `data-callout-title`. Off keeps that
   * text in the body, which is what GFM itself does.
   */
  titles?: boolean;
};

/**
 * GFM alert syntax (`> [!NOTE]`): a blockquote whose first paragraph starts with
 * `[!KIND]` becomes `<aside data-callout="kind">`, marker dropped. Works through
 * mdast-util-to-hast's `data.hName`/`data.hProperties`, so no hast handler.
 * Docusaurus' `:::kind` fences are rewritten into this form before parsing
 * (see admonitions.ts), so both spellings take one path.
 */
export function remarkCallouts(options: RemarkCalloutsOptions = {}) {
  const kinds = (options.kinds ?? DEFAULT_CALLOUT_KINDS).map((k) => k.toUpperCase());
  const escaped = kinds.map((k) => k.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
  const marker = new RegExp(`^\\[!(${escaped.join('|')})\\]`, 'i');

  return (tree: Root) => {
    visit(tree, 'blockquote', (node: Blockquote) => {
      const first = node.children[0];
      if (!first || first.type !== 'paragraph') return;

      const firstChild = (first as Paragraph).children[0];
      if (!firstChild || firstChild.type !== 'text') return;

      const text = (firstChild as Text).value;
      const match = marker.exec(text);
      if (!match) return;

      const kind = match[1].toLowerCase();
      let rest = text.slice(match[0].length);
      let title: string | undefined;

      const lineEnd = rest.indexOf('\n');
      const sameLine = (lineEnd === -1 ? rest : rest.slice(0, lineEnd)).trim();
      // A title only when something follows it — `> [!TIP] Faster builds` then a
      // body line. A one-line callout keeps its text as the body.
      const hasMore = lineEnd !== -1 || (first as Paragraph).children.length > 1 || node.children.length > 1;
      if (options.titles && sameLine && hasMore) {
        title = sameLine;
        rest = lineEnd === -1 ? '' : rest.slice(lineEnd + 1);
      } else {
        rest = rest.replace(/^\s*\n?/, '');
      }

      if (rest === '') (first as Paragraph).children.shift();
      else (firstChild as Text).value = rest;
      if ((first as Paragraph).children.length === 0) node.children.shift();

      const hProperties: Record<string, string> = { 'data-callout': kind };
      if (title) hProperties['data-callout-title'] = title;
      node.data = { ...node.data, hName: 'aside', hProperties };
    });
  };
}
