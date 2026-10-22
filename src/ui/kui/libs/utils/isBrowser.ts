// COPIED FROM: kui-react libs/utils/isBrowser.ts @ fa87237 (scripts/vendor-kui.mjs, do not edit here)
// True only in browser environments. Use to guard bare window/localStorage access
// so components remain safe in Next.js App Router server rendering.
export const isBrowser = typeof window !== 'undefined';
