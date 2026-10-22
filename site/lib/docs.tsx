import { parse } from 'yaml';
import { createDocsRoutes } from '@kuraykaraaslan/docs/next';
import type { FenceHandler } from '@kuraykaraaslan/docs';
import config from '@/docs.config';

// A fence plugin, end to end: ```cards fences hold YAML; the handler parses it
// at build time (yaml never reaches the browser) and the renderer below draws it.
type CardsWidget = { type: 'cards'; cards: { title: string; href: string; text?: string }[] };
type Widget = CardsWidget;

const cards: FenceHandler<Widget> = {
  name: 'cards',
  lang: 'cards',
  parse: ({ source }) => ({ type: 'cards', cards: parse(source) }),
};

export const docs = createDocsRoutes<Widget>({
  config,
  collection: 'docs',
  fences: [cards],
  components: {
    widgets: {
      cards: ({ widget }) => (
        <div className="mb-4 grid gap-3 sm:grid-cols-2">
          {widget.cards.map((c) => (
            <a key={c.href} href={c.href} className="rounded-lg border border-border bg-surface-raised p-4 transition-colors hover:border-primary">
              <span className="block font-semibold text-text-primary">{c.title}</span>
              {c.text && <span className="mt-1 block text-sm text-text-secondary">{c.text}</span>}
            </a>
          ))}
        </div>
      ),
    },
  },
});
