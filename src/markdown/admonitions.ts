/**
 * Docusaurus admonitions:
 *
 *   :::tip Faster builds
 *   Body, which may hold lists and code fences.
 *   :::
 *
 * rewritten into the GFM alert form remark-callouts.ts understands:
 *
 *   > [!TIP] Faster builds
 *   > Body, which may hold lists and code fences.
 *
 * Done on the source text, before parsing, so one plugin handles both spellings
 * and the rest of the pipeline never sees `:::`. Nesting works with more colons
 * on the outer fence (`::::note` around `:::tip`). A `:::` inside a code fence
 * is content, not a marker.
 */
const OPEN = /^(\s*)(:{3,})([A-Za-z]+)(?:[ \t]+(.*))?\s*$/;
const CLOSE = /^(\s*)(:{3,})\s*$/;
const FENCE = /^\s*(`{3,}|~{3,})/;

export function admonitionsToCallouts(markdown: string, kinds?: readonly string[]): string {
  if (!markdown.includes(':::')) return markdown;
  const accepted = kinds ? new Set(kinds.map((k) => k.toLowerCase())) : null;

  const lines = markdown.split('\n');
  const out: string[] = [];
  const stack: number[] = []; // colon count of each open admonition
  let codeFence: string | null = null;

  for (const line of lines) {
    const prefix = '> '.repeat(stack.length);

    if (codeFence) {
      out.push(prefix + line);
      const m = FENCE.exec(line);
      if (m && m[1][0] === codeFence[0] && m[1].length >= codeFence.length && line.trim() === m[1]) codeFence = null;
      continue;
    }

    const fence = FENCE.exec(line);
    if (fence) {
      codeFence = fence[1];
      out.push(prefix + line);
      continue;
    }

    const close = CLOSE.exec(line);
    if (close && stack.length > 0 && close[2].length >= stack[stack.length - 1]) {
      stack.pop();
      continue;
    }

    const open = OPEN.exec(line);
    if (open && (!accepted || accepted.has(open[3].toLowerCase()))) {
      const title = open[4]?.trim();
      out.push(`${prefix}> [!${open[3].toUpperCase()}]${title ? ` ${title}` : ''}`);
      stack.push(open[2].length);
      continue;
    }

    out.push(line === '' && stack.length ? prefix.trimEnd() : prefix + line);
  }

  return out.join('\n');
}
