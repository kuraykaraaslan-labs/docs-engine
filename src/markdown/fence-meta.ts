/**
 * A fence's meta string — everything in the info string after the language:
 * ```ts title="app.ts" showLineNumbers {1,3}
 * becomes { flags: ['showLineNumbers', '{1,3}'], attrs: { title: 'app.ts' } }.
 * Hosts with richer semantics pass their own parser to splitBlocks.
 */
export type FenceMeta = {
  raw: string;
  flags: string[];
  attrs: Record<string, string>;
};

// key=value (value "quoted, with spaces" or one bare word), or a standalone token.
const TOKEN = /([A-Za-z_][\w-]*)=(?:"([^"]*)"|(\S+))|(\S+)/g;

export function parseFenceMeta(raw: string): FenceMeta {
  const meta: FenceMeta = { raw, flags: [], attrs: {} };
  TOKEN.lastIndex = 0;
  for (let m = TOKEN.exec(raw); m; m = TOKEN.exec(raw)) {
    const [, key, quoted, bare, flag] = m;
    if (flag !== undefined) meta.flags.push(flag);
    else meta.attrs[key] = quoted ?? bare;
  }
  return meta;
}
