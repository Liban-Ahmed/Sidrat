/**
 * Auth Store
 *
 * Manages authentication state.
 * Persisted via Zustand middleware + MMKV.
 */

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { mmkvStorage } from './persist';

interface AuthStoreState {
    /** Whether the user is authenticated (Apple or anonymous) */
    isAuthenticated: boolean;

    /** Whether the current session is anonymous */
    isAnonymous: boolean;

    /** Supabase user ID (if authenticated) */
    userId: string | null;

    // Actions
    setAuthenticated: (userId: string, isAnonymous: boolean) => void;
    clearAuth: () => void;
}

export const useAuthStore = create<AuthStoreState>()(
    persist(
        (set) => ({
            isAuthenticated: false,
            isAnonymous: false,
            userId: null,

            setAuthenticated: (userId, isAnonymous) =>
                set({ isAuthenticated: true, userId, isAnonymous }),

            clearAuth: () =>
                set({ isAuthenticated: false, isAnonymous: false, userId: null }),
        }),
        {
            name: 'sidrat-auth',
            storage: createJSONStorage(() => mmkvStorage),
        },
    ),
);
