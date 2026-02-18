/**
 * Supabase Client
 *
 * Configured for COPPA compliance:
 * - Auth tokens stored in expo-secure-store (encrypted keychain)
 * - No cookies, no local storage
 * - Session auto-refresh for silent re-auth
 */

import { createClient } from '@supabase/supabase-js';
import * as SecureStore from 'expo-secure-store';
import { SUPABASE_URL, SUPABASE_ANON_KEY } from '../constants/config';

// ── Secure storage adapter for Supabase Auth ─────────────────────

const secureStoreAdapter = {
    getItem: async (key: string): Promise<string | null> => {
        try {
            return await SecureStore.getItemAsync(key);
        } catch {
            // SecureStore fails on web or when unavailable
            return null;
        }
    },
    setItem: async (key: string, value: string): Promise<void> => {
        try {
            await SecureStore.setItemAsync(key, value);
        } catch {
            // Fail silently — auth still works in-memory
        }
    },
    removeItem: async (key: string): Promise<void> => {
        try {
            await SecureStore.deleteItemAsync(key);
        } catch {
            // Fail silently
        }
    },
};

// ── Client Creation ──────────────────────────────────────────────

function createSupabaseClient() {
    if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
        // Return a stub client in dev when env vars aren't set
        // This allows the app to run locally without Supabase.
        // Use a non-existent localhost URL to prevent real network requests.
        console.warn(
            '[Supabase] Missing EXPO_PUBLIC_SUPABASE_URL or EXPO_PUBLIC_SUPABASE_ANON_KEY. Running in offline-only mode.',
        );
    }

    return createClient(
        SUPABASE_URL || 'http://localhost:0/offline-stub',
        SUPABASE_ANON_KEY || 'offline-stub-key',
        {
            auth: {
                storage: secureStoreAdapter,
                autoRefreshToken: !!SUPABASE_URL, // Don't try to refresh with stub
                persistSession: true,
                detectSessionInUrl: false, // No browser redirects in RN
            },
        },
    );
}

export const supabase = createSupabaseClient();
