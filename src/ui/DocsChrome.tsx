'use client';
import { useState, useSyncExternalStore } from 'react';
import { usePathname } from 'next/navigation';
import { AppShell } from './kui/app/AppShell';
import { AppSidebar, type AppSidebarNavGroup } from './kui/app/AppSidebar';

// The one bit of state kui's AppShell and AppSidebar must share: whether the
// sidebar is collapsed. DocsShell stays a Server Component and hands everything
// else down already built.
const PHONE = '(max-width: 767px)';
const subscribePhone = (onChange: () => void) => {
  const mq = window.matchMedia(PHONE);
  mq.addEventListener('change', onChange);
  return () => mq.removeEventListener('change', onChange);
};

/** Below `md`. False on the server and during hydration, so both renders agree. */
function usePhoneWidth(): boolean {
  return useSyncExternalStore(subscribePhone, () => window.matchMedia(PHONE).matches, () => false);
}

export function DocsChrome({
  logo,
  compactLogo,
  navGroups,
  activeId,
  mobileSidebarTitle,
  topbar,
  sidebarHeader,
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
  mainClassName?: string;
  children: React.ReactNode;
}) {
  const [collapsed, setCollapsed] = useState(false);
  // Sidebar item ids are hrefs, so the current path is the active item — this is
  // what lets a layout above the page's dynamic segment highlight it.
  const pathname = usePathname();
  // AppSidebar draws a bordered strip for any header, even a CSS-hidden one, so the
  // phone-only header is passed only at phone width (it lives in the closed drawer there).
  const phone = usePhoneWidth();
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
            header={phone ? sidebarHeader : undefined}
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
