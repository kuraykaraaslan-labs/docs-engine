# Provenance

Copied from kui-react (`$KUIREACT_ROOT`) at `fa87237` by `scripts/vendor-kui.mjs`.
kui-react is the design source of truth: change a component there, then run `npm run vendor:kui`.
Imports of `@/libs/*` and `@/modules/*` are rewritten to relative paths; nothing else is changed.

| File | kui-react source |
|---|---|
| `app/AppFooter.tsx` | `modules/app/AppFooter.tsx` |
| `app/AppShell.tsx` | `modules/app/AppShell.tsx` |
| `app/AppSidebar.tsx` | `modules/app/AppSidebar.tsx` |
| `app/AppTopBar.tsx` | `modules/app/AppTopBar.tsx` |
| `libs/hooks/useScrollSpy.ts` | `libs/hooks/useScrollSpy.ts` |
| `libs/utils/cn.ts` | `libs/utils/cn.ts` |
| `libs/utils/isBrowser.ts` | `libs/utils/isBrowser.ts` |
| `libs/utils/orderItems.ts` | `libs/utils/orderItems.ts` |
| `libs/utils/polymorphic.ts` | `libs/utils/polymorphic.ts` |
| `styles/theme-inline.css` | `app/globals.css (@theme inline)` |
| `styles/tokens.css` | `styles/index.css` |
| `ui/Badge.tsx` | `modules/ui/Badge.tsx` |
| `ui/Callout.tsx` | `modules/ui/Callout.tsx` |
| `ui/DocPager.tsx` | `modules/ui/DocPager.tsx` |
| `ui/Drawer.tsx` | `modules/ui/Drawer.tsx` |
| `ui/Overlays/Drawer/index.tsx` | `modules/ui/Overlays/Drawer/index.tsx` |
| `ui/Overlays/shared/useFocusTrap.ts` | `modules/ui/Overlays/shared/useFocusTrap.ts` |
| `ui/Overlays/shared/usePortal.ts` | `modules/ui/Overlays/shared/usePortal.ts` |
| `ui/Overlays/shared/usePresence.ts` | `modules/ui/Overlays/shared/usePresence.ts` |
| `ui/Overlays/shared/useRouteClose.ts` | `modules/ui/Overlays/shared/useRouteClose.ts` |
| `ui/Overlays/shared/useScrollLock.ts` | `modules/ui/Overlays/shared/useScrollLock.ts` |
| `ui/TableOfContents.tsx` | `modules/ui/TableOfContents.tsx` |
