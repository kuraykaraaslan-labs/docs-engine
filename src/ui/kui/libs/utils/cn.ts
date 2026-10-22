// COPIED FROM: kui-react libs/utils/cn.ts @ fa87237 (scripts/vendor-kui.mjs, do not edit here)
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
