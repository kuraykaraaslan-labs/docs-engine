import Link from 'next/link';
import { DocsShell, DocsFooter } from '@kuraykaraaslan/docs/ui';
import config from '@/docs.config';

export default function Home() {
  return (
    <DocsShell config={config}>
      <section className="mx-auto max-w-3xl py-16 text-center">
        <h1 className="text-4xl font-bold tracking-tight text-text-primary">{config.site.tagline}</h1>
        <p className="mt-4 text-lg text-text-secondary">{config.site.description}</p>
        <Link
          href="/docs/getting-started/installation"
          className="mt-8 inline-flex rounded-md bg-primary px-5 py-2.5 font-medium text-primary-fg hover:bg-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus"
        >
          Get started
        </Link>
      </section>
      <DocsFooter config={config} className="mx-auto max-w-5xl" />
    </DocsShell>
  );
}
