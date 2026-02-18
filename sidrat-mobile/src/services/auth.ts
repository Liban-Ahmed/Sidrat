/**
 * Authentication Service
 *
 * Wraps Supabase Auth for COPPA-compliant authentication:
 * - Sign in with Apple (no email collected)
 * - Anonymous auth (offline-first, upgrade later)
 * - No social logins (minimizes data collection)
 */

import { supabase } from './supabase';
import type { Session, User } from '@supabase/supabase-js';

export interface AuthState {
    user: User | null;
    session: Session | null;
    isAuthenticated: boolean;
    isAnonymous: boolean;
}

export const authService = {
    /**
     * Get current session (cached, no network call).
     */
    async getSession(): Promise<Session | null> {
        const { data } = await supabase.auth.getSession();
        return data.session;
    },

    /**
     * Get current user.
     */
    async getUser(): Promise<User | null> {
        const { data } = await supabase.auth.getUser();
        return data.user;
    },

    /**
     * Sign in with Apple ID token.
     * The ID token comes from expo-apple-authentication.
     */
    async signInWithApple(idToken: string): Promise<AuthState> {
        const { data, error } = await supabase.auth.signInWithIdToken({
            provider: 'apple',
            token: idToken,
        });

        if (error) throw error;

        return {
            user: data.user,
            session: data.session,
            isAuthenticated: true,
            isAnonymous: false,
        };
    },

    /**
     * Create an anonymous session for offline-first usage.
     * Can be upgraded to Apple later without losing data.
     */
    async signInAnonymously(): Promise<AuthState> {
        const { data, error } = await supabase.auth.signInAnonymously();

        if (error) throw error;

        return {
            user: data.user,
            session: data.session,
            isAuthenticated: true,
            isAnonymous: true,
        };
    },

    /**
     * Link an Apple account to an existing anonymous session.
     * Preserves all existing data.
     */
    async linkAppleAccount(idToken: string): Promise<void> {
        const { error } = await supabase.auth.linkIdentity({
            provider: 'apple',
            options: {
                // @ts-expect-error - Supabase types don't include idToken yet
                idToken,
            },
        });

        if (error) throw error;
    },

    /**
     * Sign out and clear session.
     */
    async signOut(): Promise<void> {
        const { error } = await supabase.auth.signOut();
        if (error) throw error;
    },

    /**
     * Listen for auth state changes.
     */
    onAuthStateChange(callback: (state: AuthState) => void) {
        return supabase.auth.onAuthStateChange((_event, session) => {
            callback({
                user: session?.user ?? null,
                session,
                isAuthenticated: !!session,
                isAnonymous: session?.user?.is_anonymous ?? false,
            });
        });
    },
};
