'use client';
import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { AppShell } from './kui/app/AppShell';
import { AppSidebar, type AppSidebarNavGroup, type AppSidebarLinkProps } from './kui/app/AppSidebar';

// The one bit of state kui's AppShell and AppSidebar must share: whether the
// sidebar is collapsed. DocsShell stays a Server Component and hands everything
// else down already built.
export function DocsChrome({
  logo,
  compactLogo,
  navGroups,
  activeId,
  mobileSidebarTitle,
  topbar,
  sidebarHeader,
  sidebarHeaderClassName,
  clientNavigation = true,
  mainClassName,
  children,
}: {
  logo?: React.ReactNode;
  compactLogo?: React.ReactNode;
  navGroups?: AppSidebarNavGroup[];
  activeId?: string;
  mobileSidebarTitle?: string;
  topbar: React.ReactNode;
  /** Above the sidebar's nav groups. */
  sidebarHeader?: React.ReactNode;
  /** Classes on the header's bordered wrapper, e.g. `md:hidden`. */
  sidebarHeaderClassName?: string;
  /** Sidebar links through next/link (client-side navigation). Off = plain anchors, full page loads. */
  clientNavigation?: boolean;
  mainClassName?: string;
  children: React.ReactNode;
}) {
  const [collapsed, setCollapsed] = useState(false);
  // Sidebar item ids are hrefs, so the current path is the active item — this is
  // what lets a layout above the page's dynamic segment highlight it.
  const pathname = usePathname();
  const hasSidebar = Boolean(navGroups && navGroups.length);

  return (
    <AppShell
      logo={hasSidebar ? logo : undefined}
      compactLogo={hasSidebar ? compactLogo : undefined}
      sidebarCollapsed={collapsed}
      mobileSidebarTitle={mobileSidebarTitle}
      sidebar={
        hasSidebar ? (
          <AppSidebar
            navGroups={navGroups}
            activeId={activeId ?? pathname}
            collapsed={collapsed}
            onCollapsedChange={setCollapsed}
            header={sidebarHeader}
            headerClassName={sidebarHeaderClassName}
            renderLink={clientNavigation ? renderNextLink : undefined}
          />
        ) : undefined
      }
      topbar={topbar}
      mainClassName={mainClassName}
    >
      {children}
    </AppShell>
  );
}

function renderNextLink(_item: unknown, props: AppSidebarLinkProps) {
  return <Link {...props} />;
}
