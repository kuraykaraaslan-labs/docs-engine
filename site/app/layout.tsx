import type { Metadata } from 'next';
import { siteMetadata } from '@kuraykaraaslan/docs/next';
import { DocsThemeProvider } from '@kuraykaraaslan/docs/ui';
import config from '@/docs.config';
import './globals.css';

export const metadata: Metadata = siteMetadata(config);

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang={config.site.locale} suppressHydrationWarning>
      <body className="antialiased">
        <DocsThemeProvider defaultTheme={config.theme.defaultMode}>{children}</DocsThemeProvider>
      </body>
    </html>
  );
}
