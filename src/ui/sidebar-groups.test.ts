import { describe, expect, it } from 'vitest';
import { toNavGroups } from './sidebar-groups';
import type { SidebarNode } from '../content/types';

describe('toNavGroups', () => {
  it('groups loose items, makes top-level categories groups and deeper categories nested items', () => {
    const nodes: SidebarNode[] = [
      { type: 'doc', id: 'a', label: 'A', href: '/a' },
      { type: 'link', label: 'Ext', href: 'https://x', external: true },
      {
        type: 'category', key: 'g', label: 'Guides', href: '/g', docId: 'g/index', collapsed: true, collapsible: true,
        items: [
          { type: 'doc', id: 'g/b', label: 'B', href: '/g/b' },
          { type: 'category', key: 'g/c', label: 'Deep', href: '/g/c', collapsed: false, collapsible: true, items: [{ type: 'doc', id: 'g/c/d', label: 'D', href: '/g/c/d' }] },
          { type: 'category', key: 'g/e', label: 'No page', collapsed: true, collapsible: true, items: [{ type: 'doc', id: 'g/e/f', label: 'F', href: '/g/e/f' }] },
        ],
      },
    ];
    expect(toNavGroups(nodes)).toEqual([
      { items: [{ id: '/a', label: 'A', href: '/a' }, { id: 'https://x', label: 'Ext', href: 'https://x' }] },
      {
        label: 'Guides',
        collapsible: true,
        defaultExpanded: false,
        items: [
          { id: '/g', label: 'Overview', href: '/g' },
          { id: '/g/b', label: 'B', href: '/g/b' },
          { id: '/g/c', label: 'Deep', href: '/g/c', defaultExpanded: true, children: [{ id: '/g/c/d', label: 'D', href: '/g/c/d' }] },
          { id: 'category:g/e', label: 'No page', href: undefined, defaultExpanded: false, children: [{ id: '/g/e/f', label: 'F', href: '/g/e/f' }] },
        ],
      },
    ]);
  });
});
