import { cn } from './kui/libs/utils/cn';
import { CopyButton } from './CopyButton';
import { DOC_PROSE } from './prose';

/**
 * A highlighted fence with a header strip: the `title="..."` meta attribute (or
 * the language) on the left, a copy button on the right. The copy button sits in
 * the strip, not on hover, so touch and keyboard users can reach it.
 */
export function CodeBlock({
  lang,
  title,
  source,
  html,
  className,
}: {
  lang: string;
  title?: string;
  source: string;
  html: string;
  className?: string;
}) {
  const label = title ?? lang;
  return (
    <figure className={cn('mb-4 overflow-hidden rounded-lg border border-border bg-surface-sunken', className)}>
      <figcaption className="flex items-center justify-between gap-2 border-b border-border bg-surface-raised px-3 py-1.5">
        <span className="truncate font-mono text-xs text-text-secondary">{label}</span>
        <CopyButton source={source} />
      </figcaption>
      <div
        className={cn(DOC_PROSE, '[&_pre]:mb-0 [&_pre]:rounded-none [&_pre]:bg-transparent')}
        // eslint-disable-next-line react/no-danger -- build-time markdown pipeline output, not user input
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </figure>
  );
}
