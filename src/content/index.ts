// Server-only: reads the filesystem. Never import this from a 'use client' module.
export { loadCollection, getDocBySlug, getDocNeighbors, collectionStaticParams, type LoadOptions } from './loader';
export { parseFrontmatter, frontmatterSchema, type Frontmatter } from './frontmatter';
export { autogenerate, resolveSidebar, flattenSidebar, containsHref, stripNumberPrefix, prettify } from './sidebar';
export type { DocRecord, DocsCollection, SidebarNode, CategoryMeta, DocLink } from './types';
