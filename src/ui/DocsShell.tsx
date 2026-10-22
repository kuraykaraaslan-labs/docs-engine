import { Fragment } from 'react';
import { AppTopBar, type AppTopBarItem } from './kui/app/AppTopBar';
import { DocsChrome } from './DocsChrome';
import { DocsLogo } from './DocsLogo';
import { NavbarLink } from './NavbarLink';
import { ThemeToggle } from './ThemeToggle';
import { toNavGroups } from './sidebar-groups';
import { isExternalHref, type DocsConfig } from '../config/schema';
import type { SidebarNode } from '../content/types';
import type { AppSidebarNavGroup } from './kui/app/AppSidebar';

export type DocsShellProps = {
  config: DocsConfig;
  /** A resolved collection sidebar. Omit (with `navGroups`) for a page with no sidebar. */
  sidebar?: SidebarNode[];
  /** Prebuilt kui sidebar groups, for a host whose navigation is not a docs collection. Wins over `sidebar`. */
  navGroups?: AppSidebarNavGroup[];
  /** Active sidebar item id. Default: the current URL path (sidebar item ids are hrefs). */
  activeHref?: string;
  /** Replaces the config wordmark, e.g. a designed SVG mark. */
  logo?: React.ReactNode;
  /** Logo for the collapsed (icon-only) sidebar. */
  compactLogo?: React.ReactNode;
  /** Nodes for the navbar's `{ type: 'slot', name }` items: search, account menus, ... */
  navbarSlots?: Record<string, React.ReactNode>;
  mobileSidebarTitle?: string;
  /** Sidebar links through next/link. Default true; false keeps full page loads. */
  clientNavigation?: boolean;
  mainClassName?: string;
  children: React.ReactNode;
};

/**
 * The site chrome: kui AppShell with a config-driven top bar (navbar items on
 * the left and right, then the theme toggle) and, when given, the collection
 * sidebar. A Server Component, so a layout can build the sidebar on the server
 * and render this directly.
 */
export function DocsShell({
  config,
  sidebar,
  navGroups,
  activeHref,
  logo,
  compactLogo,
  navbarSlots = {},
  mobileSidebarTitle = 'Navigation',
  clientNavigation,
  mainClassName,
  children,
}: DocsShellProps) {
  const groups = navGroups ?? (sidebar ? toNavGroups(sidebar) : undefined);
  const hasSidebar = Boolean(groups && groups.length);
  const brand = logo ?? <DocsLogo config={config} />;

  // With a sidebar, phone-width screens get the navbar links in the sidebar drawer
  // (as Docusaurus does) instead of a top bar too narrow for them.
  const linkClass = hasSidebar ? 'hidden md:inline-flex' : undefined;
  const links = config.navbar.items.filter((i) => i.type !== 'slot');

  const items: Record<'left' | 'right', AppTopBarItem[]> = { left: [], right: [] };
  config.navbar.items.forEach((item, i) => {
    const node =
      item.type === 'slot' ? (
        <Fragment>{navbarSlots[item.name] ?? null}</Fragment>
      ) : (
        <NavbarLink href={item.href} label={item.label} external={isExternalHref(item)} className={linkClass} />
      );
    items[item.position].push({ id: `${i}`, node, order: item.order, hidden: item.type === 'slot' && !navbarSlots[item.name] });
  });
  if (config.navbar.themeToggle) items.right.push({ id: 'theme-toggle', node: <ThemeToggle />, order: Number.MAX_SAFE_INTEGER });

  return (
    <DocsChrome
      logo={brand}
      compactLogo={compactLogo}
      navGroups={groups}
      activeId={activeHref}
      mobileSidebarTitle={mobileSidebarTitle}
      mainClassName={mainClassName}
      clientNavigation={clientNavigation}
      // The strip lives in the drawer on phones; from md up the links are in the top bar.
      sidebarHeaderClassName="md:hidden"
      sidebarHeader={
        hasSidebar && links.length ? (
          <nav aria-label="Site" className="flex flex-col">
            {links.map((l) => (
              <NavbarLink key={l.href} href={l.href} label={l.label} external={isExternalHref(l)} className="py-1.5" />
            ))}
          </nav>
        ) : undefined
      }
      topbar={
        // With a sidebar the brand sits in the sidebar header on desktop, so the
        // top bar carries it only below `lg`, where the sidebar is a drawer.
        <AppTopBar
          logo={hasSidebar ? <span className="lg:hidden">{brand}</span> : brand}
          start={items.left}
          end={items.right}
          className="min-w-0 overflow-x-auto"
        />
      }
    >
      {children}
    </DocsChrome>
  );
}
