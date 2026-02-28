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

interface DailyChallengeCompletion {
  /** Date string in format YYYY-MM-DD */
  date: string;
  /** Lesson ID that was completed */
  lessonId: string;
  /** Practice block ID that was completed */
  practiceId: string;
  /** Child ID who completed it */
  childId: string;
}

interface AppState {
  /** Whether onboarding is complete */
  hasCompletedOnboarding: boolean;

  /** ID of the currently active child profile */
  activeChildId: string | null;

  /** Whether parental gate was recently unlocked (NOT persisted) */
  parentalGateUnlocked: boolean;

  /** Whether the app has been initialized */
  isReady: boolean;

  /** History of daily challenge completions (per child, per day) */
  dailyChallengeCompletions: DailyChallengeCompletion[];

  /** Unit IDs that are currently expanded in the Learn screen (all others collapsed by default) */
  expandedUnitIds: string[];

  // Actions
  completeOnboarding: () => void;
  setActiveChild: (id: string) => void;
  unlockParentalGate: () => void;
  lockParentalGate: () => void;
  setReady: () => void;
  reset: () => void;
  /** Mark today's daily challenge as complete */
  completeDailyChallenge: (lessonId: string, practiceId: string, childId: string) => void;
  /** Check if today's daily challenge is complete for a specific child */
  isDailyChallengeComplete: (lessonId: string, practiceId: string, childId: string) => boolean;
  /** Toggle a unit's expanded/collapsed state */
  toggleUnitExpanded: (unitId: string) => void;
}

function getTodayDateString(): string {
  const today = new Date();
  return `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      hasCompletedOnboarding: false,
      activeChildId: null,
      parentalGateUnlocked: false,
      isReady: false,
      dailyChallengeCompletions: [],
      expandedUnitIds: [],

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
          dailyChallengeCompletions: [],
        }),

      completeDailyChallenge: (lessonId, practiceId, childId) => {
        const today = getTodayDateString();
        const newCompletion: DailyChallengeCompletion = {
          date: today,
          lessonId,
          practiceId,
          childId,
        };

        set((state) => {
          // Remove any existing completion for this child on this day (shouldn't happen, but be safe)
          const filtered = state.dailyChallengeCompletions.filter(
            (c) => !(c.date === today && c.lessonId === lessonId && c.childId === childId),
          );
          return {
            dailyChallengeCompletions: [...filtered, newCompletion],
          };
        });
      },

      isDailyChallengeComplete: (lessonId, practiceId, childId) => {
        const { dailyChallengeCompletions } = get();
        const today = getTodayDateString();

        return dailyChallengeCompletions.some(
          (c) =>
            c.date === today &&
            c.lessonId === lessonId &&
            c.practiceId === practiceId &&
            c.childId === childId,
        );
      },

      toggleUnitExpanded: (unitId) => {
        set((state) => {
          const isExpanded = state.expandedUnitIds.includes(unitId);
          const expandedUnitIds = isExpanded
            ? state.expandedUnitIds.filter((id) => id !== unitId)
            : [...state.expandedUnitIds, unitId];
          return { expandedUnitIds };
        });
      },
    }),
    {
      name: 'sidrat-app',
      storage: createJSONStorage(() => mmkvStorage),
      // Persist daily challenge completions per child
      partialize: (state) => ({
        hasCompletedOnboarding: state.hasCompletedOnboarding,
        activeChildId: state.activeChildId,
        dailyChallengeCompletions: state.dailyChallengeCompletions,
        expandedUnitIds: state.expandedUnitIds,
      }),
    },
  ),
);
