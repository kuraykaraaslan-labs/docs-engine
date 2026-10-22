import { describe, expect, it } from 'vitest';
import { createMarkdownProcessor } from './processor';
import { admonitionsToCallouts } from './admonitions';
import { extractHeadings } from './headings';
import { splitBlocks, type FenceHandler } from './blocks';
import { createSlugger } from './slug';

const md = createMarkdownProcessor();

describe('markdown pipeline', () => {
  it('turns GFM alerts into callouts', () => {
    expect(md.toHtml('> [!WARNING]\n> Careful.')).toBe('<aside data-callout="warning">\n<p>Careful.</p>\n</aside>');
  });

  it('reads a same-line title only when a body follows', () => {
    const titled = createMarkdownProcessor({ callouts: { titles: true } });
    expect(titled.toHtml('> [!TIP] Faster\n> Body.')).toContain('data-callout-title="Faster"');
    expect(titled.toHtml('> [!TIP] Just this.')).not.toContain('data-callout-title');
  });

  it('rewrites :::admonitions, leaving ::: inside code fences alone', () => {
    const src = ':::tip Faster builds\nBody\n\n```txt\n:::not-a-marker\n```\n:::';
    expect(admonitionsToCallouts(src)).toBe('> [!TIP] Faster builds\n> Body\n>\n> ```txt\n> :::not-a-marker\n> ```');
    const html = createMarkdownProcessor({ callouts: { titles: true } }).toHtml(src);
    expect(html).toContain('data-callout="tip"');
    expect(html).toContain(':::not-a-marker');
  });

  it('nests admonitions by colon count', () => {
    expect(admonitionsToCallouts('::::note\n:::danger\nX\n:::\n::::')).toBe('> [!NOTE]\n> > [!DANGER]\n> > X');
  });

  it('gives headings unique ids and honours {#custom-id}', () => {
    const tree = md.toHast('## Setup\n\n## Setup\n\n### Use it {#use}\n\n## Çalışma');
    expect(extractHeadings(tree)).toEqual([
      { id: 'setup', text: 'Setup', depth: 2 },
      { id: 'setup-1', text: 'Setup', depth: 2 },
      { id: 'use', text: 'Use it', depth: 3 },
      { id: 'çalışma', text: 'Çalışma', depth: 2 },
    ]);
  });

  it('can be configured to emit exactly the bare pipeline', () => {
    const bare = createMarkdownProcessor({ headingIds: false, callouts: false, highlight: false });
    expect(bare.toHtml('## A\n\n> [!NOTE]\n> x')).toBe('<h2>A</h2>\n<blockquote>\n<p>[!NOTE]\nx</p>\n</blockquote>');
  });
});

describe('splitBlocks', () => {
  type Widget = { type: 'quiz'; questions: string[] } | { type: 'shout'; text: string };
  const fences: FenceHandler<Widget>[] = [
    { name: 'quiz', lang: 'quiz', parse: ({ source }) => ({ type: 'quiz', questions: source.split('\n') }) },
    { name: 'shout', test: ({ source }) => source.startsWith('!'), parse: ({ source }) => ({ type: 'shout', text: source.slice(1) }) },
  ];

  it('splits at fences, keeps source and meta, and dispatches through the registry in order', () => {
    const tree = md.toHast('Intro\n\n```quiz\na\nb\n```\n\n```ts title="x.ts" run\nconst a = 1;\n```\n\n```txt\n!hey\n```\n\nOutro');
    const blocks = splitBlocks(tree, { fences, idPrefix: 'doc' });
    expect(blocks.map((b) => [b.kind, b.id])).toEqual([
      ['html', 'doc-0'],
      ['widget', 'doc-1'],
      ['code', 'doc-2'],
      ['widget', 'doc-3'],
      ['html', 'doc-4'],
    ]);
    expect(blocks[1]).toMatchObject({ widget: { type: 'quiz', questions: ['a', 'b'] } });
    expect(blocks[2]).toMatchObject({ lang: 'ts', source: 'const a = 1;', meta: { flags: ['run'], attrs: { title: 'x.ts' } } });
    expect(blocks[3]).toMatchObject({ widget: { type: 'shout', text: 'hey' } });
  });

  it('lifts top-level callouts only when asked', () => {
    const tree = md.toHast('> [!DANGER]\n> Hot.');
    expect(splitBlocks(tree).map((b) => b.kind)).toEqual(['html']);
    expect(splitBlocks(tree, { liftCallouts: true })).toEqual([{ kind: 'callout', id: 'block-0', variant: 'danger', title: undefined, html: '\n<p>Hot.</p>\n' }]);
  });
});

describe('createSlugger', () => {
  it('never hands out the same slug twice, even against a literal "-1" heading', () => {
    const slug = createSlugger();
    expect([slug('A'), slug('A-1'), slug('A'), slug('A')]).toEqual(['a', 'a-1', 'a-2', 'a-3']);
  });
});
