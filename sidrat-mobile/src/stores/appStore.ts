/**
 * App-level state store
 *
 * Replaces iOS AppState (which was embedded in SidratApp.swift).
 * Improvement: single source of truth, persisted to MMKV,
 * with clear action methods.
 */

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { mmkvStorage } from './persist';

interface AppState {
    /** Whether onboarding is complete */
    hasCompletedOnboarding: boolean;

    /** ID of the currently active child profile */
    activeChildId: string | null;

    /** Whether parental gate was recently unlocked (NOT persisted) */
    parentalGateUnlocked: boolean;

    /** Whether the app has been initialized */
    isReady: boolean;

    // Actions
    completeOnboarding: () => void;
    setActiveChild: (id: string) => void;
    unlockParentalGate: () => void;
    lockParentalGate: () => void;
    setReady: () => void;
    reset: () => void;
}

export const useAppStore = create<AppState>()(
    persist(
        (set) => ({
            hasCompletedOnboarding: false,
            activeChildId: null,
            parentalGateUnlocked: false,
            isReady: false,

            completeOnboarding: () => set({ hasCompletedOnboarding: true }),

            setActiveChild: (id) => set({ activeChildId: id }),

            unlockParentalGate: () => set({ parentalGateUnlocked: true }),

            lockParentalGate: () => set({ parentalGateUnlocked: false }),

            setReady: () => set({ isReady: true }),

            reset: () =>
                set({
                    hasCompletedOnboarding: false,
                    activeChildId: null,
                    parentalGateUnlocked: false,
                }),
        }),
        {
            name: 'sidrat-app',
            storage: createJSONStorage(() => mmkvStorage),
            // Don't persist volatile state
            partialize: (state) => ({
                hasCompletedOnboarding: state.hasCompletedOnboarding,
                activeChildId: state.activeChildId,
            }),
        },
    ),
);
