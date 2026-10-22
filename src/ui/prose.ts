import { cn } from './kui/libs/utils/cn';

// Styles for markdown-pipeline HTML, as Tailwind arbitrary descendant variants
// (no @tailwindcss/typography). Applied to each html run's own wrapper, never to
// a container that also holds widgets: a descendant variant would out-specify a
// widget's own classes. Callouts left nested inside lists or quotes (not lifted
// into kui Callout blocks) get the same token colors via data-callout.
export const DOC_PROSE = cn(
  'docs-prose text-[0.9375rem] leading-7 text-text-primary',
  '[&>:first-child]:mt-0 [&>:last-child]:mb-0',
  '[&_h1]:text-3xl [&_h1]:font-bold [&_h1]:mt-10 [&_h1]:mb-4',
  '[&_h2]:text-2xl [&_h2]:font-semibold [&_h2]:mt-10 [&_h2]:mb-3 [&_h2]:pb-1 [&_h2]:border-b [&_h2]:border-border',
  '[&_h3]:text-xl [&_h3]:font-semibold [&_h3]:mt-8 [&_h3]:mb-2',
  '[&_h4]:text-base [&_h4]:font-semibold [&_h4]:mt-6 [&_h4]:mb-2',
  '[&_p]:mb-4',
  '[&_ul]:list-disc [&_ul]:pl-6 [&_ul]:mb-4 [&_ul]:space-y-1',
  '[&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:mb-4 [&_ol]:space-y-1',
  '[&_li>ul]:mb-0 [&_li>ol]:mb-0 [&_li>ul]:mt-1 [&_li>ol]:mt-1',
  '[&_strong]:font-semibold',
  '[&_a]:text-primary [&_a]:underline [&_a]:underline-offset-2 hover:[&_a]:text-primary-hover',
  '[&_code]:bg-surface-sunken [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:rounded-md [&_code]:text-[0.85em] [&_code]:font-mono',
  '[&_pre]:bg-surface-sunken [&_pre]:p-4 [&_pre]:rounded-md [&_pre]:overflow-x-auto [&_pre]:mb-4 [&_pre]:text-sm [&_pre]:leading-6',
  '[&_pre_code]:bg-transparent [&_pre_code]:p-0 [&_pre_code]:text-[inherit]',
  '[&_table]:w-full [&_table]:text-sm [&_table]:mb-4 [&_table]:border-collapse [&_table]:block [&_table]:overflow-x-auto',
  '[&_th]:border [&_th]:border-border [&_th]:px-3 [&_th]:py-1.5 [&_th]:bg-surface-overlay [&_th]:text-left',
  '[&_td]:border [&_td]:border-border [&_td]:px-3 [&_td]:py-1.5',
  '[&_blockquote]:border-l-4 [&_blockquote]:border-border-strong [&_blockquote]:pl-4 [&_blockquote]:text-text-secondary [&_blockquote]:mb-4',
  '[&_hr]:my-8 [&_hr]:border-border',
  '[&_img]:max-w-full [&_img]:rounded-md',
  '[&_aside]:rounded-lg [&_aside]:border [&_aside]:border-l-4 [&_aside]:px-4 [&_aside]:py-3 [&_aside]:mb-4 [&_aside>:last-child]:mb-0',
  '[&_aside[data-callout="note"]]:bg-surface-sunken [&_aside[data-callout="note"]]:border-border-strong',
  '[&_aside[data-callout="tip"]]:bg-success-subtle [&_aside[data-callout="tip"]]:border-success [&_aside[data-callout="tip"]]:text-success-fg',
  '[&_aside[data-callout="info"]]:bg-info-subtle [&_aside[data-callout="info"]]:border-info [&_aside[data-callout="info"]]:text-info-fg',
  '[&_aside[data-callout="important"]]:bg-info-subtle [&_aside[data-callout="important"]]:border-info [&_aside[data-callout="important"]]:text-info-fg',
  '[&_aside[data-callout="warning"]]:bg-warning-subtle [&_aside[data-callout="warning"]]:border-warning [&_aside[data-callout="warning"]]:text-warning-fg',
  '[&_aside[data-callout="caution"]]:bg-warning-subtle [&_aside[data-callout="caution"]]:border-warning [&_aside[data-callout="caution"]]:text-warning-fg',
  '[&_aside[data-callout="danger"]]:bg-error-subtle [&_aside[data-callout="danger"]]:border-error [&_aside[data-callout="danger"]]:text-error-fg'
);
