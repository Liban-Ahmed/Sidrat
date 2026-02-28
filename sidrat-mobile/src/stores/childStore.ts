/**
 * Child profiles store
 *
 * Manages multi-child profiles with streak logic.
 * Improvement over iOS: all streak / XP logic is colocated
 * instead of split across Child model + StreakService.
 */

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { mmkvStorage } from './persist';
import { uuid } from '../utils/uuid';
import type { Child, CreateChild, AvatarId } from '../types';

interface ChildStore {
  children: Child[];

  // Queries
  getChild: (id: string) => Child | undefined;

  // Mutations
  addChild: (data: CreateChild) => Child;
  removeChild: (id: string) => void;
  updateAvatar: (id: string, avatarId: AvatarId) => void;

  // Progress
  recordLessonCompletion: (childId: string, xpEarned: number) => void;
  checkStreaks: () => void;
}

export const useChildStore = create<ChildStore>()(
  persist(
    (set, get) => ({
      children: [],

      getChild: (id) => get().children.find((c) => c.id === id),

      addChild: (data) => {
        const now = new Date().toISOString();
        const child: Child = {
          id: uuid(),
          name: data.name,
          birthYear: data.birthYear,
          avatarId: data.avatarId,
          createdAt: now,
          lastAccessedAt: now,
          currentStreak: 0,
          longestStreak: 0,
          totalLessonsCompleted: 0,
          totalXP: 0,
          currentWeekNumber: 1,
        };
        set((s) => ({ children: [...s.children, child] }));
        return child;
      },

      removeChild: (id) => set((s) => ({ children: s.children.filter((c) => c.id !== id) })),

      updateAvatar: (id, avatarId) =>
        set((s) => ({
          children: s.children.map((c) => (c.id === id ? { ...c, avatarId } : c)),
        })),

      recordLessonCompletion: (childId, xpEarned) =>
        set((s) => ({
          children: s.children.map((c) => {
            if (c.id !== childId) return c;

            const today = new Date().toDateString();
            const lastDay = c.lastLessonCompletedDate
              ? new Date(c.lastLessonCompletedDate).toDateString()
              : null;

            // Already completed one today — just add XP
            if (lastDay === today) {
              return {
                ...c,
                totalXP: c.totalXP + xpEarned,
                totalLessonsCompleted: c.totalLessonsCompleted + 1,
                lastLessonCompletedDate: new Date().toISOString(),
              };
            }

            // Calculate streak
            let newStreak = c.currentStreak;
            if (lastDay) {
              const yesterday = new Date();
              yesterday.setDate(yesterday.getDate() - 1);
              if (lastDay === yesterday.toDateString()) {
                newStreak += 1; // continues streak
              } else {
                newStreak = 1; // streak broken → restart
              }
            } else {
              newStreak = 1; // first ever lesson
            }

            return {
              ...c,
              totalXP: c.totalXP + xpEarned,
              totalLessonsCompleted: c.totalLessonsCompleted + 1,
              currentStreak: newStreak,
              longestStreak: Math.max(c.longestStreak, newStreak),
              lastLessonCompletedDate: new Date().toISOString(),
            };
          }),
        })),

      checkStreaks: () => {
        const { children } = get();
        // Only call set() if at least one child's streak actually needs resetting
        let hasChanges = false;
        const updated = children.map((c) => {
          if (!c.lastLessonCompletedDate) return c;
          const lastDay = new Date(c.lastLessonCompletedDate).toDateString();
          const today = new Date().toDateString();
          const yesterday = new Date();
          yesterday.setDate(yesterday.getDate() - 1);

          if (lastDay !== today && lastDay !== yesterday.toDateString()) {
            hasChanges = true;
            return { ...c, currentStreak: 0 };
          }
          return c;
        });
        if (hasChanges) {
          set({ children: updated });
        }
      },
    }),
    {
      name: 'sidrat-children',
      storage: createJSONStorage(() => mmkvStorage),
    },
  ),
);
