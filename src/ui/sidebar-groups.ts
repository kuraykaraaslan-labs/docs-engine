import type { AppSidebarNavGroup, AppSidebarNavItem } from './kui/app/AppSidebar';
import type { SidebarNode } from '../content/types';

/**
 * Sidebar tree -> kui AppSidebar groups. A top-level category becomes a
 * (collapsible) group; anything deeper becomes nested items, a category being
 * an item whose children are its entries and whose href is its own page, if it
 * has one. Runs of top-level docs and links share one unlabelled group. Item
 * ids are hrefs (or the category key, for a category with no page), so the
 * active item is the current URL path.
 */
export function toNavGroups(nodes: SidebarNode[]): AppSidebarNavGroup[] {
  const groups: AppSidebarNavGroup[] = [];
  let loose: AppSidebarNavItem[] = [];

  const flushLoose = () => {
    if (loose.length) groups.push({ items: loose });
    loose = [];
  };

  for (const node of nodes) {
    if (node.type === 'category') {
      flushLoose();
      const items = node.items.map(toItem);
      groups.push({
        label: node.label,
        // A top-level category's own page leads its group, since a group header is not a link.
        items: node.href ? [{ id: node.href, label: 'Overview', href: node.href }, ...items] : items,
        collapsible: node.collapsible,
        defaultExpanded: !node.collapsed,
      });
    } else {
      loose.push(toItem(node));
    }
  }
  flushLoose();
  return groups;
}

function toItem(node: SidebarNode): AppSidebarNavItem {
  if (node.type !== 'category') return { id: node.href, label: node.label, href: node.href };
  return {
    id: node.href ?? `category:${node.key}`,
    label: node.label,
    href: node.href,
    children: node.items.map(toItem),
    defaultExpanded: !node.collapsed,
  };
}
