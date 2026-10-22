'use client';
import { ThemeProvider as NextThemesProvider } from 'next-themes';

/** next-themes on the `class` strategy, which the design tokens' `.dark` block keys off. */
export function DocsThemeProvider({
  defaultTheme = 'system',
  children,
}: {
  defaultTheme?: 'system' | 'light' | 'dark';
  children: React.ReactNode;
}) {
  return (
    <NextThemesProvider attribute="class" defaultTheme={defaultTheme} enableSystem disableTransitionOnChange>
      {children}
    </NextThemesProvider>
  );
}
