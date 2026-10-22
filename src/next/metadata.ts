import type { Metadata } from 'next';
import type { DocsConfig } from '../config/schema';

/**
 * Root-layout metadata from `site`: metadataBase, a "%s | Site" title template,
 * description and Open Graph / Twitter defaults. Spread and override as needed:
 *
 *   export const metadata = { ...siteMetadata(config), applicationName: 'x' };
 */
export function siteMetadata(config: DocsConfig): Metadata {
  const { title, tagline, description, url } = config.site;
  const fullTitle = tagline ? `${title} — ${tagline}` : title;
  const desc = description ?? tagline;
  return {
    metadataBase: new URL(url),
    title: { default: fullTitle, template: `%s | ${title}` },
    description: desc,
    applicationName: title,
    openGraph: { type: 'website', url, siteName: title, title: fullTitle, description: desc },
    twitter: { card: 'summary_large_image', title: fullTitle, description: desc },
  };
}
