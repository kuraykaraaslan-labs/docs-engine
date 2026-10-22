import { visit, SKIP } from 'unist-util-visit';
import type { Root, Element, ElementContent, Text } from 'hast';
import { createSlugger } from './slug';

export type Heading = { id: string; text: string; depth: number };

const HEADING = /^h([1-6])$/;
const CUSTOM_ID = /\s*\{#([A-Za-z0-9_-]+)\}\s*$/;

export function textOf(node: ElementContent | Element): string {
  if (node.type === 'text') return node.value;
  if (node.type === 'element') return node.children.map(textOf).join('');
  return '';
}

/**
 * Gives every h1-h6 an `id` (GitHub-style slug, unique per document) unless it
 * already has one. A trailing `{#custom-id}` in the heading text sets the id
 * explicitly and is removed from the text, as in Docusaurus.
 */
export function rehypeHeadingIds() {
  return (tree: Root) => {
    const slug = createSlugger();
    visit(tree, 'element', (node) => {
      if (!HEADING.test(node.tagName)) return;
      const last = node.children[node.children.length - 1];
      if (last?.type === 'text') {
        const m = CUSTOM_ID.exec(last.value);
        if (m) {
          (last as Text).value = last.value.slice(0, m.index);
          node.properties = { ...node.properties, id: m[1] };
        }
      }
      if (node.properties?.id == null) node.properties = { ...node.properties, id: slug(textOf(node)) };
      return SKIP;
    });
  };
}

/** Headings that carry an id, in document order — the input to a table of contents. */
export function extractHeadings(tree: Root): Heading[] {
  const headings: Heading[] = [];
  visit(tree, 'element', (node) => {
    const m = HEADING.exec(node.tagName);
    if (!m) return;
    const id = node.properties?.id;
    if (typeof id === 'string' && id) headings.push({ id, text: textOf(node).trim(), depth: Number(m[1]) });
    return SKIP;
  });
  return headings;
}
