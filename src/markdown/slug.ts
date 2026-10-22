/**
 * GitHub-style heading slug: lowercased, punctuation dropped, whitespace to
 * dashes. "What's new in v2?" -> "whats-new-in-v2". Unicode letters survive,
 * so non-English headings keep a readable anchor.
 */
export function slugify(text: string): string {
  return text
    .trim()
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s_-]/gu, '')
    .replace(/\s/g, '-');
}

/** One per document: repeats get -1, -2, ... so every anchor on a page is unique. */
export function createSlugger() {
  const seen = new Map<string, number>();
  return (text: string): string => {
    const base = slugify(text) || 'section';
    let slug = base;
    let n = seen.get(base) ?? 0;
    while (seen.has(slug)) slug = `${base}-${++n}`;
    seen.set(base, n);
    seen.set(slug, 0);
    return slug;
  };
}
