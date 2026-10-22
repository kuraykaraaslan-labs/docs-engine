import { Callout, type CalloutVariant } from './kui/ui/Callout';
import { CodeBlock } from './CodeBlock';
import { MermaidBlock } from './MermaidBlock';
import { DOC_PROSE } from './prose';
import type { DocBlock } from '../markdown/blocks';
import type { FenceMeta } from '../markdown/fence-meta';

/** Renders one widget block. Receives the parsed widget (plain data) and the block. */
export type WidgetRenderer<W> = (props: { widget: W; block: Extract<DocBlock<W>, { kind: 'widget' }> }) => React.ReactNode;

export type BlockComponents<W extends { type: string }> = {
  /** Widget renderers keyed by the widget's `type`. A widget with no renderer falls back to its fence's code. */
  widgets?: { [K in W['type']]?: WidgetRenderer<Extract<W, { type: K }>> };
  /** Claim a plain code block before the default rendering: return a node, or undefined to pass. */
  code?: (block: Extract<DocBlock<W>, { kind: 'code' }>) => React.ReactNode | undefined;
};

const CALLOUT_VARIANT: Record<string, CalloutVariant> = {
  note: 'note',
  tip: 'tip',
  info: 'info',
  important: 'info',
  warning: 'warning',
  caution: 'warning',
  danger: 'danger',
};

function DefaultCode({ block }: { block: Extract<DocBlock<unknown, FenceMeta>, { kind: 'code' }> }) {
  if (block.lang === 'mermaid') return <MermaidBlock source={block.source} html={block.html} />;
  const title = (block.meta as Partial<FenceMeta>)?.attrs?.title;
  return <CodeBlock lang={block.lang || 'text'} title={title} source={block.source} html={block.html} />;
}

export function BlockView<W extends { type: string } = never>({ block, components }: { block: DocBlock<W>; components?: BlockComponents<W> }) {
  switch (block.kind) {
    case 'html':
      // eslint-disable-next-line react/no-danger -- build-time markdown pipeline output, not user input
      return <div className={DOC_PROSE} dangerouslySetInnerHTML={{ __html: block.html }} />;
    case 'callout': {
      const variant = CALLOUT_VARIANT[block.variant] ?? 'note';
      // Untitled callouts are labelled by their own kind ("Important", "Caution"),
      // not by the kui variant they are drawn with.
      const title = block.title ?? block.variant.charAt(0).toUpperCase() + block.variant.slice(1);
      return (
        <Callout variant={variant} title={title}>
          {/* eslint-disable-next-line react/no-danger -- build-time markdown pipeline output */}
          <div className={DOC_PROSE} dangerouslySetInnerHTML={{ __html: block.html }} />
        </Callout>
      );
    }
    case 'code': {
      const claimed = components?.code?.(block);
      if (claimed !== undefined) return <>{claimed}</>;
      return <DefaultCode block={block as Extract<DocBlock<unknown, FenceMeta>, { kind: 'code' }>} />;
    }
    case 'widget': {
      const render = components?.widgets?.[block.widget.type as W['type']] as WidgetRenderer<W> | undefined;
      // eslint-disable-next-line react/no-danger -- the fence's own highlighted code, when no renderer is registered
      return render ? <>{render({ widget: block.widget, block })}</> : <div className={DOC_PROSE} dangerouslySetInnerHTML={{ __html: block.html }} />;
    }
  }
}

/** A document's blocks in order. A Server Component: client widgets hydrate as their own islands. */
export function BlockRenderer<W extends { type: string } = never>({ blocks, components }: { blocks: DocBlock<W>[]; components?: BlockComponents<W> }) {
  return (
    <>
      {blocks.map((block) => (
        <BlockView key={block.id} block={block} components={components} />
      ))}
    </>
  );
}
