import type { CollectionConfig } from '../config/schema';
import type { Frontmatter } from './frontmatter';

export type DocRecord = {
  /** Path inside the collection without extension or number prefixes: "guides/install". */
  id: string;
  collection: string;
  /** File path relative to the collection dir, as authored: "guides/02-install.md". */
  filePath: string;
  absPath: string;
  /** URL path inside the collection: "guides/install"; "" for the collection's root index. */
  slug: string;
  /** Full URL path: "/docs/guides/install". */
  href: string;
  title: string;
  description?: string;
  sidebarLabel: string;
  sidebarPosition?: number;
  /** Folder part of `id`: "guides"; "" at the root. */
  dir: string;
  /** An index.md / README.md — the landing page of its folder. */
  isIndex: boolean;
  draft: boolean;
  frontmatter: Frontmatter;
  /** Markdown without frontmatter, and without the leading `# Title` when that is where the title came from. */
  body: string;
};

export type CategoryMeta = {
  label?: string;
  position?: number;
  collapsed?: boolean;
  collapsible?: boolean;
  /** Doc id the category label links to. */
  link?: string;
};

export type SidebarNode =
  | { type: 'doc'; id: string; label: string; href: string }
  | { type: 'link'; label: string; href: string; external: boolean }
  | { type: 'category'; key: string; label: string; items: SidebarNode[]; collapsed: boolean; collapsible: boolean; href?: string; docId?: string };

export type DocLink = { title: string; href: string };

export type DocsCollection = {
  config: CollectionConfig;
  docs: DocRecord[];
  byId: Map<string, DocRecord>;
  bySlug: Map<string, DocRecord>;
  categories: Map<string, CategoryMeta>;
  sidebar: SidebarNode[];
  /** Doc ids in sidebar reading order — what prev/next walk. */
  order: string[];
};
