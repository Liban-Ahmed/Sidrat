/**
 * Authentication Service
 *
 * Wraps Supabase Auth for COPPA-compliant authentication:
 * - Sign in with Apple (no email collected)
 * - Anonymous auth (offline-first, upgrade later)
 * - No social logins (minimizes data collection)
 * - Session rehydration on app launch
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
     * Get current user (makes a network call to validate the session).
     */
    async getUser(): Promise<User | null> {
        const { data } = await supabase.auth.getUser();
        return data.user;
    },

    /**
     * Rehydrate auth state on app launch.
     * Checks if there's a valid cached session and returns the auth state.
     * If the session has expired, Supabase SDK auto-refreshes it.
     */
    async rehydrate(): Promise<AuthState> {
        try {
            const { data: { session } } = await supabase.auth.getSession();
            if (session?.user) {
                return {
                    user: session.user,
                    session,
                    isAuthenticated: true,
                    isAnonymous: session.user.is_anonymous ?? false,
                };
            }
        } catch {
            // Session expired and refresh failed — user needs to re-auth
        }
        return {
            user: null,
            session: null,
            isAuthenticated: false,
            isAnonymous: false,
        };
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
     * Uses signInWithIdToken which merges with the current anonymous user
     * when called while already authenticated.
     */
    async linkAppleAccount(idToken: string): Promise<AuthState> {
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
     * Sign out and clear session.
     */
    async signOut(): Promise<void> {
        const { error } = await supabase.auth.signOut();
        if (error) throw error;
    },

    /**
     * Delete the user's account and all associated data.
     * Calls the Supabase delete_user_account() RPC which cascades.
     */
    async deleteAccount(): Promise<void> {
        const { error } = await supabase.rpc('delete_user_account');
        if (error) throw error;
        await supabase.auth.signOut();
    },

    /**
     * Listen for auth state changes (token refresh, sign-in, sign-out).
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
