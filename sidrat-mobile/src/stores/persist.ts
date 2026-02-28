/**
 * MMKV-backed Zustand Persistence
 *
 * react-native-mmkv v3 uses JSI for the fastest
 * key-value store on mobile (10x faster than AsyncStorage).
 *
 * This adapter is used by all Zustand stores for persistence.
 */

import { MMKV } from 'react-native-mmkv';
import type { StateStorage } from 'zustand/middleware';

const mmkv = new MMKV({ id: 'sidrat-store' });

/**
 * Zustand-compatible storage adapter backed by MMKV.
 */
export const mmkvStorage: StateStorage = {
  getItem: (name: string): string | null => {
    return mmkv.getString(name) ?? null;
  },
  setItem: (name: string, value: string): void => {
    mmkv.set(name, value);
  },
  removeItem: (name: string): void => {
    mmkv.delete(name);
  },
};
