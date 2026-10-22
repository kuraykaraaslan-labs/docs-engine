// COPIED FROM: kui-react modules/app/AppFooter.tsx @ 6d1138d (scripts/vendor-kui.mjs, do not edit here)
'use client';
import { cn } from '../libs/utils/cn';
import { Badge } from '../ui/Badge';

const STATUS_CONFIG = {
  operational: { variant: 'success' as const, label: 'Operational', dot: true },
  degraded:    { variant: 'warning' as const, label: 'Degraded',    dot: true },
  outage:      { variant: 'error'   as const, label: 'Outage',      dot: true },
};

type AppFooterProps = {
  logo?: React.ReactNode;
  nav?: React.ReactNode;
  social?: React.ReactNode;
  version?: string;
  status?: 'operational' | 'degraded' | 'outage';
  copyright?: string;
  className?: string;
};

export function AppFooter({
  logo,
  nav,
  social,
  version,
  status,
  copyright,
  className,
}: AppFooterProps) {
  const statusCfg = status ? STATUS_CONFIG[status] : null;

  return (
    <footer className={cn('w-full border border-border rounded-xl bg-surface-raised overflow-hidden', className)}>
      <div className="flex flex-wrap items-center justify-between gap-4 px-5 py-4 border-b border-border">
        <div className="flex items-center gap-2">
          {logo}
          {version && <Badge variant="neutral" size="md">v{version}</Badge>}
        </div>

        {nav && (
          <nav aria-label="Footer navigation" className="flex items-center gap-1">
            {nav}
          </nav>
        )}

        {(statusCfg) && (
          <div className="flex items-center gap-3">
            <Badge variant={statusCfg.variant} size="md" dot={statusCfg.dot}>
              {statusCfg.label}
            </Badge>
          </div>
        )}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4 px-5 py-3 bg-surface-base">
        {copyright && (
          <p className="text-xs text-text-secondary">{copyright}</p>
        )}
        {social && (
          <div className="flex items-center gap-1">
            {social}
          </div>
        )}
      </div>
    </footer>
  );
}
