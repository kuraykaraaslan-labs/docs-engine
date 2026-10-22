'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from './kui/libs/utils/cn';

/** A top-bar link that marks itself current for its own path and everything under it. */
export function NavbarLink({ href, label, external, className: extra }: { href: string; label: string; external?: boolean; className?: string }) {
  const pathname = usePathname();
  const active = !external && (pathname === href || (href !== '/' && pathname.startsWith(`${href}/`)));
  const className = cn(
    'rounded-md px-2 py-1 text-sm transition-colors',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus',
    active ? 'font-medium text-primary' : 'text-text-secondary hover:text-text-primary',
    extra
  );

  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={className}>
        {label}
      </a>
    );
  }
  return (
    <Link href={href} aria-current={active ? 'page' : undefined} className={className}>
      {label}
    </Link>
  );
}
