#!/usr/bin/env node
// Copies the kui-react components this package renders with into src/ui/kui/,
// following their imports transitively, and rewrites kui-react's `@/` aliases to
// relative paths: this package ships raw TS through the host's
// `transpilePackages`, where the host's own `@/` alias would win.
//
//   node scripts/vendor-kui.mjs          copy and write src/ui/kui/PROVENANCE.md
//   node scripts/vendor-kui.mjs --check  exit 1 if the copies drifted from kui-react
//
// kui-react is found through $KUIREACT_ROOT, else internal-ai-rules/LOCAL_PATHS.json,
// else ../kui-react. kui-react is the design source of truth: fix a component
// there and re-run this, never edit a copy in place.
import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync, readdirSync } from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(import.meta.dirname, '..');
const DEST = path.join(ROOT, 'src', 'ui', 'kui');

const ENTRIES = [
  'modules/app/AppShell.tsx',
  'modules/app/AppSidebar.tsx',
  'modules/app/AppTopBar.tsx',
  'modules/app/AppFooter.tsx',
  'modules/ui/Callout.tsx',
  'modules/ui/TableOfContents.tsx',
  'modules/ui/DocPager.tsx',
  'libs/utils/cn.ts',
];

function kuiRoot() {
  if (process.env.KUIREACT_ROOT) return process.env.KUIREACT_ROOT;
  const localPaths = path.resolve(ROOT, '..', 'internal-ai-rules', 'LOCAL_PATHS.json');
  if (existsSync(localPaths)) {
    const root = JSON.parse(readFileSync(localPaths, 'utf8')).paths?.KUIREACT_ROOT;
    if (root) return root;
  }
  return path.resolve(ROOT, '..', 'kui-react');
}

/** kui-react path -> path under src/ui/kui ("modules/ui/X.tsx" -> "ui/X.tsx"). */
function destRel(kuiRel) {
  return kuiRel.replace(/^modules\//, '');
}

function resolveFile(base, spec) {
  const target = path.resolve(base, spec);
  for (const candidate of [target, `${target}.tsx`, `${target}.ts`, path.join(target, 'index.tsx'), path.join(target, 'index.ts')]) {
    if (existsSync(candidate) && !candidate.endsWith(path.sep) && readdirSafe(candidate) === null) return candidate;
  }
  throw new Error(`cannot resolve ${spec} from ${base}`);
}

function readdirSafe(p) {
  try {
    readdirSync(p);
    return true;
  } catch {
    return null;
  }
}

const IMPORT = /(from\s+|import\s*\(\s*|import\s+)(['"])([^'"]+)\2/g;

function build(kui) {
  const sha = execFileSync('git', ['-C', kui, 'rev-parse', '--short', 'HEAD'], { encoding: 'utf8' }).trim();
  const dirty = execFileSync('git', ['-C', kui, 'status', '--porcelain', '--', 'modules', 'libs'], { encoding: 'utf8' }).trim() !== '';
  const stamp = dirty ? `${sha}+dirty` : sha;

  const out = new Map(); // destRel -> content
  const queue = [...ENTRIES];
  const seen = new Set();

  while (queue.length) {
    const rel = queue.shift();
    if (seen.has(rel)) continue;
    seen.add(rel);

    const abs = path.join(kui, rel);
    const fromDir = path.dirname(abs);
    let source = readFileSync(abs, 'utf8');

    source = source.replace(IMPORT, (whole, lead, quote, spec) => {
      let targetAbs;
      if (spec.startsWith('@/')) targetAbs = resolveFile(kui, spec.slice(2));
      else if (spec.startsWith('.')) targetAbs = resolveFile(fromDir, spec);
      else return whole; // a package import (react, @fortawesome/...)

      const targetRel = path.relative(kui, targetAbs).split(path.sep).join('/');
      queue.push(targetRel);
      let next = path.relative(path.dirname(destRel(rel)), destRel(targetRel)).split(path.sep).join('/');
      next = next.replace(/\.(tsx|ts)$/, '').replace(/\/index$/, '');
      if (!next.startsWith('.')) next = `./${next}`;
      return `${lead}${quote}${next}${quote}`;
    });

    out.set(destRel(rel), `// COPIED FROM: kui-react ${rel} @ ${stamp} (scripts/vendor-kui.mjs, do not edit here)\n${source}`);
  }

  // Design tokens for hosts that bring none (src/theme.css imports these): the
  // token variables, and the `@theme inline` block mapping them to Tailwind
  // colors, which kui-react keeps in its showcase stylesheet.
  out.set('styles/tokens.css', `/* COPIED FROM: kui-react styles/index.css @ ${stamp} (scripts/vendor-kui.mjs, do not edit here) */\n${readFileSync(path.join(kui, 'styles/index.css'), 'utf8')}`);
  const globals = readFileSync(path.join(kui, 'app/globals.css'), 'utf8');
  const start = globals.indexOf('@theme inline {');
  if (start === -1) throw new Error('kui-react app/globals.css has no `@theme inline` block');
  let depth = 0;
  let end = start;
  for (; end < globals.length; end++) {
    if (globals[end] === '{') depth++;
    else if (globals[end] === '}' && --depth === 0) break;
  }
  out.set('styles/theme-inline.css', `/* COPIED FROM: kui-react app/globals.css (@theme inline block) @ ${stamp} (scripts/vendor-kui.mjs, do not edit here) */\n${globals.slice(start, end + 1)}\n`);

  const files = [...out.keys()].sort();
  const provenance = [
    '# Provenance',
    '',
    `Copied from kui-react (\`$KUIREACT_ROOT\`) at \`${stamp}\` by \`scripts/vendor-kui.mjs\`.`,
    'kui-react is the design source of truth: change a component there, then run `npm run vendor:kui`.',
    'Imports of `@/libs/*` and `@/modules/*` are rewritten to relative paths; nothing else is changed.',
    '',
    '| File | kui-react source |',
    '|---|---|',
    ...files.map((f) => `| \`${f}\` | \`${f === 'styles/tokens.css' ? 'styles/index.css' : f === 'styles/theme-inline.css' ? 'app/globals.css (@theme inline)' : f.startsWith('libs/') ? f : `modules/${f}`}\` |`),
    '',
  ].join('\n');
  out.set('PROVENANCE.md', provenance);
  return out;
}

function stripStamp(text) {
  return text.replace(/ @ [0-9a-f]+(\+dirty)?/g, '').replace(/at `[0-9a-f]+(\+dirty)?`/g, '');
}

const kui = kuiRoot();
const files = build(kui);

if (process.argv.includes('--check')) {
  let drift = 0;
  for (const [rel, content] of files) {
    const target = path.join(DEST, rel);
    if (!existsSync(target) || stripStamp(readFileSync(target, 'utf8')) !== stripStamp(content)) {
      console.error(`drift: src/ui/kui/${rel}`);
      drift++;
    }
  }
  if (drift) {
    console.error(`${drift} file(s) differ from kui-react. Run \`npm run vendor:kui\`.`);
    process.exit(1);
  }
  console.log(`kui copies match kui-react (${files.size - 1} files).`);
} else {
  rmSync(DEST, { recursive: true, force: true });
  for (const [rel, content] of files) {
    const target = path.join(DEST, rel);
    mkdirSync(path.dirname(target), { recursive: true });
    writeFileSync(target, content);
  }
  console.log(`vendored ${files.size - 1} files from ${kui} into src/ui/kui/`);
}
