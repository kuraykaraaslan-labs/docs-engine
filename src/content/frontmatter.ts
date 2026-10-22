import { parse as parseYaml } from 'yaml';
import { z } from 'zod';

/**
 * Frontmatter keys the engine understands, Docusaurus names. Unknown keys pass
 * through untouched, so a host can carry its own fields and validate them itself.
 */
export const frontmatterSchema = z
  .object({
    id: z.string().optional(),
    title: z.string().optional(),
    description: z.string().optional(),
    slug: z.string().optional(),
    sidebar_label: z.string().optional(),
    sidebar_position: z.number().optional(),
    draft: z.boolean().optional(),
    hide_title: z.boolean().optional(),
    hide_table_of_contents: z.boolean().optional(),
    toc_min_heading_level: z.number().int().min(1).max(6).optional(),
    toc_max_heading_level: z.number().int().min(1).max(6).optional(),
    /** Doc id of the previous / next page, or null for none. Overrides sidebar order. */
    pagination_prev: z.string().nullable().optional(),
    pagination_next: z.string().nullable().optional(),
    tags: z.array(z.string()).optional(),
    keywords: z.array(z.string()).optional(),
  })
  .passthrough();

export type Frontmatter = z.infer<typeof frontmatterSchema>;

const BLOCK = /^---[ \t]*\r?\n([\s\S]*?)\r?\n---[ \t]*(?:\r?\n|$)/;

/** Splits `---` YAML frontmatter off a markdown file. No frontmatter = `{}`. */
export function parseFrontmatter(raw: string, file = '(markdown)'): { data: Frontmatter; body: string } {
  const m = BLOCK.exec(raw);
  if (!m) return { data: {}, body: raw };

  let parsed: unknown;
  try {
    parsed = parseYaml(m[1]) ?? {};
  } catch (error) {
    throw new Error(`${file}: invalid frontmatter YAML: ${error instanceof Error ? error.message : String(error)}`);
  }
  const result = frontmatterSchema.safeParse(parsed);
  if (!result.success) {
    const issues = result.error.issues.map((i) => `${i.path.join('.')}: ${i.message}`).join('; ');
    throw new Error(`${file}: invalid frontmatter: ${issues}`);
  }
  return { data: result.data, body: raw.slice(m[0].length) };
}
