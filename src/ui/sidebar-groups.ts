import type { AppSidebarNavGroup, AppSidebarNavItem } from './kui/app/AppSidebar';
import type { SidebarNode } from '../content/types';

/**
 * Sidebar tree -> kui AppSidebar groups. AppSidebar has one level of grouping,
 * so a top-level category becomes a (collapsible) group and anything deeper is
 * flattened into it in reading order, a nested category contributing its own
 * page (if it has one) followed by its children. Runs of top-level docs and
 * links share one unlabelled group. Item ids are hrefs, so `activeId` is the
 * current URL path.
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
      groups.push({
        label: node.label,
        items: flattenItems(node.href ? [{ type: 'doc', id: node.docId ?? node.href, label: 'Overview', href: node.href }, ...node.items] : node.items),
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

function toItem(node: Exclude<SidebarNode, { type: 'category' }>): AppSidebarNavItem {
  return { id: node.href, label: node.label, href: node.href };
}

function flattenItems(nodes: SidebarNode[]): AppSidebarNavItem[] {
  const items: AppSidebarNavItem[] = [];
  for (const node of nodes) {
    if (node.type === 'category') {
      if (node.href) items.push({ id: node.href, label: node.label, href: node.href });
      items.push(...flattenItems(node.items));
    } else {
      items.push(toItem(node));
    }
  }
  return items;
}
