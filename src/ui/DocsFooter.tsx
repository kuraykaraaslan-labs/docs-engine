import { AppFooter } from './kui/app/AppFooter';
import { NavbarLink } from './NavbarLink';
import { isExternalHref, type DocsConfig } from '../config/schema';

/** `footer` from docs.config.ts through kui's AppFooter. Renders nothing when the config has no footer. */
export function DocsFooter({ config, logo, className }: { config: DocsConfig; logo?: React.ReactNode; className?: string }) {
  const footer = config.footer;
  if (!footer) return null;
  return (
    <AppFooter
      logo={logo}
      version={footer.version}
      copyright={footer.copyright}
      className={className}
      nav={
        footer.links.length
          ? footer.links.map((l) => <NavbarLink key={l.href} href={l.href} label={l.label} external={isExternalHref(l)} />)
          : undefined
      }
    />
  );
}
