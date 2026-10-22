'use client';
import { useTheme } from 'next-themes';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSun, faMoon } from '@fortawesome/free-solid-svg-icons';
import { cn } from './kui/libs/utils/cn';
import { useMounted } from './useMounted';

// Two-state light/dark button on next-themes (the rules mandate next-themes over
// kui-react's hand-rolled ThemeSwitcher, which also needs Button + DropdownMenu).
export function ThemeToggle({ className }: { className?: string }) {
  const { resolvedTheme, setTheme } = useTheme();
  // next-themes only knows the theme in the browser: the first render matches the server's guess.
  const mounted = useMounted();
  const isDark = mounted && resolvedTheme === 'dark';

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      className={cn(
        'inline-flex items-center justify-center w-9 h-9 rounded-md text-text-secondary',
        'hover:text-text-primary hover:bg-surface-overlay transition-colors',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus',
        className
      )}
    >
      <span suppressHydrationWarning>
        <FontAwesomeIcon icon={isDark ? faSun : faMoon} className="w-4 h-4" aria-hidden="true" />
      </span>
    </button>
  );
}
