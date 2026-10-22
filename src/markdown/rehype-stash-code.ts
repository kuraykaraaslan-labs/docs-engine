import { visit } from 'unist-util-visit';
import type { Root } from 'hast';

declare module 'hast' {
  interface Data {
    /** Raw pre>code text, stashed by rehypeStashCode before syntax highlighting
     *  replaces the text child with spans. */
    source?: string;
    /** mdast-util-to-hast's convention: the fence info string after the language token. */
    meta?: string;
  }
}

/**
 * Copies each `pre > code`'s raw text into `node.data.source` before
 * rehype-highlight shreds it into spans, so blocks.ts can hand a fence's real
 * source to copy buttons and fence plugins. hast-util-to-html ignores `data`,
 * so this never changes rendered HTML.
 */
export function rehypeStashCode() {
  return (tree: Root) => {
    visit(tree, 'element', (node, _index, parent) => {
      if (node.tagName !== 'code') return;
      if (!parent || parent.type !== 'element' || parent.tagName !== 'pre') return;
      const first = node.children[0];
      if (first?.type === 'text') {
        // mdast-util-to-hast appends one "\n" to a code node's value; strip it so
        // `source` equals what the author wrote between the fences.
        (node.data ??= {}).source = first.value.replace(/\n$/, '');
      }
    });
  };
}
