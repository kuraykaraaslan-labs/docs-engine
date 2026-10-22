// Config and shared types: safe to import anywhere, including docs.config.ts.
export {
  defineDocsConfig,
  getCollection,
  isExternalHref,
  docsConfigSchema,
  type DocsConfig,
  type DocsConfigInput,
  type NavLink,
  type NavbarItem,
  type CollectionConfig,
  type SidebarItemInput,
} from './config/schema';
export type { DocRecord, DocsCollection, SidebarNode, DocLink } from './content/types';
export type { DocBlock, FenceHandler, FenceContext } from './markdown/blocks';
export type { FenceMeta } from './markdown/fence-meta';
export type { Heading } from './markdown/headings';
