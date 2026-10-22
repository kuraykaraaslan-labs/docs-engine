import { describe, expect, it } from 'vitest';
import { defineDocsConfig } from './schema';

const base = { site: { title: 'T', url: 'https://example.com' }, collections: [{ id: 'docs', dir: 'docs' }] };

describe('defineDocsConfig', () => {
  it('fills defaults', () => {
    const c = defineDocsConfig(base);
    expect(c.collections[0].routeBasePath).toBe('docs');
    expect(c.navbar).toEqual({ items: [], themeToggle: true });
    expect(c.toc).toEqual({ minDepth: 2, maxDepth: 3 });
    expect(c.site.locale).toBe('en');
  });

  it('defaults navbar links left and slots right', () => {
    const c = defineDocsConfig({
      ...base,
      navbar: { items: [{ label: 'Docs', href: '/docs' }, { type: 'slot', name: 'search' }] },
    });
    expect(c.navbar.items.map((i) => i.position)).toEqual(['left', 'right']);
  });

  it('lists every problem at once', () => {
    expect(() =>
      defineDocsConfig({
        site: { title: '', url: 'not-a-url' },
        collections: [{ id: 'docs', dir: 'docs', sidebar: 'missing' }],
      })
    ).toThrow(/site\.title[\s\S]*site\.url[\s\S]*sidebar "missing" is not defined/);
  });

  it('rejects unknown keys, so a typo does not silently do nothing', () => {
    expect(() => defineDocsConfig({ ...base, navbar: { itmes: [] } } as never)).toThrow(/Unrecognized key/);
  });
});
