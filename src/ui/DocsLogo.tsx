import Link from 'next/link';
import type { DocsConfig } from '../config/schema';

/** The wordmark from `site.logo` (image and/or text), linking home. Hosts with a designed mark pass their own `logo` node instead. */
export function DocsLogo({ config }: { config: DocsConfig }) {
  const logo = config.site.logo;
  const text = logo?.text ?? config.site.title;
  return (
    <Link
      href={logo?.href ?? '/'}
      className="flex items-center gap-2 rounded-md font-semibold text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus"
    >
      {logo?.src && (
        // eslint-disable-next-line @next/next/no-img-element -- an SVG/PNG wordmark from /public, not a content image
        <img src={logo.src} alt={logo.alt ?? ''} className="h-7 w-auto" />
      )}
      {text && <span className="truncate">{text}</span>}
    </Link>
  );
}
