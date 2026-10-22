import { defineDocsConfig } from '@kuraykaraaslan/docs';

export default defineDocsConfig({
  site: {
    title: '@kuraykaraaslan/docs',
    tagline: 'Markdown documentation for Next.js',
    description: 'A Docusaurus-like documentation engine for the Next.js App Router, built on kui-react.',
    url: 'https://docs.kuray.dev',
    logo: { text: 'kuray/docs' },
  },
  navbar: {
    items: [
      { label: 'Docs', href: '/docs' },
      { label: 'Configuration', href: '/docs/reference/configuration' },
      { label: 'GitHub', href: 'https://github.com/kuraykaraaslan-labs/docs-engine', position: 'right' },
    ],
  },
  footer: {
    links: [
      { label: 'Getting started', href: '/docs/getting-started/installation' },
      { label: 'kui-react', href: 'https://github.com/kuraykaraaslan-labs/kui-react' },
    ],
    copyright: `© ${new Date().getFullYear()} Kuray Karaaslan. 0BSD.`,
  },
  collections: [
    {
      id: 'docs',
      dir: 'content/docs',
      routeBasePath: 'docs',
      editUrl: 'https://github.com/kuraykaraaslan-labs/docs-engine/edit/main/site/content/docs',
    },
  ],
});
