'use client';
import { useSyncExternalStore } from 'react';

const subscribe = () => () => {};

/** false during SSR and the hydrating render, true after — without a setState-in-effect. */
export function useMounted(): boolean {
  return useSyncExternalStore(subscribe, () => true, () => false);
}
