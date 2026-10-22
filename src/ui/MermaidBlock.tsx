'use client';
import { useEffect, useRef, useState } from 'react';
import { useTheme } from 'next-themes';
import { useMounted } from './useMounted';
import { DOC_PROSE } from './prose';

// 'mermaid' is imported only inside the effect, once the block scrolls near the
// viewport: a page without a diagram ships none of the library, and a page with
// one pays for it only when the reader gets there.

type RenderState = { status: 'pending' } | { status: 'rendered'; svg: string } | { status: 'error'; message: string };

let mermaidIdCounter = 0;

export function MermaidBlock({ source, html }: { source: string; html: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [intersected, setIntersected] = useState(false);
  const [state, setState] = useState<RenderState>({ status: 'pending' });
  const { resolvedTheme } = useTheme();
  const mounted = useMounted();
  const visible = intersected || (mounted && typeof IntersectionObserver === 'undefined');

  useEffect(() => {
    const el = containerRef.current;
    if (!el || typeof IntersectionObserver === 'undefined') return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setIntersected(true);
          observer.disconnect();
        }
      },
      { rootMargin: '200px' }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!visible) return;
    let cancelled = false;
    (async () => {
      try {
        const mermaid = (await import('mermaid')).default;
        mermaid.initialize({ startOnLoad: false, theme: resolvedTheme === 'dark' ? 'dark' : 'default' });
        const { svg } = await mermaid.render(`docs-mermaid-${mermaidIdCounter++}`, source);
        if (!cancelled) setState({ status: 'rendered', svg });
      } catch (error) {
        if (!cancelled) setState({ status: 'error', message: error instanceof Error ? error.message : 'Diagram failed to render.' });
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [visible, resolvedTheme, source]);

  return (
    <figure ref={containerRef} className="mb-4 rounded-lg border border-border bg-surface-raised p-4">
      {state.status === 'error' && <p className="mb-2 text-sm text-error">Diagram failed to render: {state.message}</p>}
      {state.status === 'rendered' ? (
        // eslint-disable-next-line react/no-danger -- svg from our own mermaid.render() call
        <div className="overflow-x-auto [&_svg]:mx-auto" dangerouslySetInnerHTML={{ __html: state.svg }} />
      ) : (
        // The diagram source stays readable until (or unless) mermaid renders it.
        // eslint-disable-next-line react/no-danger -- build-time markdown pipeline output
        <div className={DOC_PROSE} dangerouslySetInnerHTML={{ __html: html }} />
      )}
    </figure>
  );
}
