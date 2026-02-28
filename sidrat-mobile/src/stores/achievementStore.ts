/**
 * Achievement Store
 *
 * Defines, tracks, and evaluates achievement unlocks.
 * Achievement checks run after lesson completion, streak updates, etc.
 * Persisted to MMKV per-child.
 */

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { mmkvStorage } from './persist';
import type { AchievementCategory, AchievementRarity, LessonCategory, Child } from '../types';
import { LESSON_CATEGORIES } from '../types';

// ── Achievement Definition ─────────────────────────────────────

export interface AchievementDef {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: AchievementCategory;
  rarity: AchievementRarity;
  /** Function that evaluates if the achievement is unlocked */
  check: (ctx: AchievementContext) => boolean;
}

export interface AchievementContext {
  child: Child;
  completedLessonIds: string[];
  /** Set of categories the child has completed at least one lesson in */
  completedCategories: Set<LessonCategory>;
  /** Number of reviews completed */
  reviewCount: number;
}

export interface UnlockedAchievement {
  id: string;
  unlockedAt: string;
  isNew: boolean;
}

// ── Achievement Definitions ────────────────────────────────────

export const ACHIEVEMENTS: AchievementDef[] = [
  // ── Learning ──
  {
    id: 'first_lesson',
    title: 'First Step',
    description: 'Complete your first lesson',
    icon: '🌱',
    category: 'progress',
    rarity: 'bronze',
    check: (ctx) => ctx.child.totalLessonsCompleted >= 1,
  },
  {
    id: 'five_lessons',
    title: 'Knowledge Seeker',
    description: 'Complete 5 lessons',
    icon: '📖',
    category: 'progress',
    rarity: 'bronze',
    check: (ctx) => ctx.child.totalLessonsCompleted >= 5,
  },
  {
    id: 'ten_lessons',
    title: 'Rising Scholar',
    description: 'Complete 10 lessons',
    icon: '🌟',
    category: 'progress',
    rarity: 'silver',
    check: (ctx) => ctx.child.totalLessonsCompleted >= 10,
  },
  {
    id: 'twenty_lessons',
    title: 'Dedicated Learner',
    description: 'Complete 20 lessons',
    icon: '🏆',
    category: 'progress',
    rarity: 'gold',
    check: (ctx) => ctx.child.totalLessonsCompleted >= 20,
  },
  {
    id: 'all_categories',
    title: 'Explorer',
    description: 'Try all 8 categories',
    icon: '🧭',
    category: 'progress',
    rarity: 'gold',
    check: (ctx) => LESSON_CATEGORIES.every((cat) => ctx.completedCategories.has(cat)),
  },

  // ── Streaks ──
  {
    id: 'streak_3',
    title: 'Consistent',
    description: '3-day learning streak',
    icon: '🔥',
    category: 'progress',
    rarity: 'bronze',
    check: (ctx) => ctx.child.longestStreak >= 3,
  },
  {
    id: 'streak_7',
    title: 'Dedicated',
    description: '7-day learning streak',
    icon: '💪',
    category: 'progress',
    rarity: 'silver',
    check: (ctx) => ctx.child.longestStreak >= 7,
  },
  {
    id: 'streak_14',
    title: 'Committed',
    description: '14-day learning streak',
    icon: '⚡',
    category: 'progress',
    rarity: 'gold',
    check: (ctx) => ctx.child.longestStreak >= 14,
  },
  {
    id: 'streak_30',
    title: 'Unstoppable',
    description: '30-day learning streak!',
    icon: '👑',
    category: 'progress',
    rarity: 'platinum',
    check: (ctx) => ctx.child.longestStreak >= 30,
  },

  // ── Mastery ──
  {
    id: 'first_review',
    title: 'Reviewer',
    description: 'Complete your first review',
    icon: '🔄',
    category: 'mastery',
    rarity: 'bronze',
    check: (ctx) => ctx.reviewCount >= 1,
  },
  {
    id: 'wudu_master',
    title: 'Wudu Master',
    description: 'Complete all wudu lessons',
    icon: '💧',
    category: 'mastery',
    rarity: 'gold',
    check: (ctx) => {
      const wuduIds = ctx.completedLessonIds.filter((id) => id.startsWith('wudu-'));
      return wuduIds.length >= 5;
    },
  },
  {
    id: 'aqeedah_scholar',
    title: 'Aqeedah Scholar',
    description: 'Complete all aqeedah lessons',
    icon: '⭐',
    category: 'mastery',
    rarity: 'gold',
    check: (ctx) => {
      const ids = ctx.completedLessonIds.filter((id) => id.startsWith('aqeedah-'));
      return ids.length >= 3;
    },
  },
  {
    id: 'salah_hero',
    title: 'Salah Hero',
    description: 'Complete all salah lessons',
    icon: '🕌',
    category: 'mastery',
    rarity: 'gold',
    check: (ctx) => {
      const ids = ctx.completedLessonIds.filter((id) => id.startsWith('salah-'));
      return ids.length >= 4;
    },
  },
  {
    id: 'xp_100',
    title: 'Century',
    description: 'Earn 100 XP',
    icon: '💯',
    category: 'progress',
    rarity: 'bronze',
    check: (ctx) => ctx.child.totalXP >= 100,
  },
  {
    id: 'xp_500',
    title: 'Rising Star',
    description: 'Earn 500 XP',
    icon: '🌙',
    category: 'progress',
    rarity: 'silver',
    check: (ctx) => ctx.child.totalXP >= 500,
  },
  {
    id: 'xp_1000',
    title: 'Shining Star',
    description: 'Earn 1000 XP',
    icon: '✨',
    category: 'progress',
    rarity: 'gold',
    check: (ctx) => ctx.child.totalXP >= 1000,
  },
];

// ── Store ──────────────────────────────────────────────────────

interface AchievementStore {
  /** Map of childId -> set of unlocked achievement IDs */
  unlocked: Record<string, UnlockedAchievement[]>;

  /** Achievement IDs that haven't been shown to the user yet */
  pendingToasts: string[];

  /** Get all unlocked achievements for a child */
  getUnlocked: (childId: string) => UnlockedAchievement[];

  /** Check all achievements and return any newly unlocked ones */
  checkAchievements: (ctx: AchievementContext) => string[];

  /** Mark an achievement toast as shown */
  dismissToast: (achievementId: string) => void;

  /** Get the count of unlocked achievements for a child */
  getCount: (childId: string) => number;
}

export const useAchievementStore = create<AchievementStore>()(
  persist(
    (set, get) => ({
      unlocked: {},
      pendingToasts: [],

      getUnlocked: (childId) => get().unlocked[childId] ?? [],

      checkAchievements: (ctx) => {
        const childId = ctx.child.id;
        const currentUnlocked = get().unlocked[childId] ?? [];
        const unlockedIds = new Set(currentUnlocked.map((u) => u.id));
        const newlyUnlocked: string[] = [];

        for (const achievement of ACHIEVEMENTS) {
          if (unlockedIds.has(achievement.id)) continue;

          try {
            if (achievement.check(ctx)) {
              newlyUnlocked.push(achievement.id);
            }
          } catch {
            // Skip broken achievement checks silently
          }
        }

        if (newlyUnlocked.length > 0) {
          const now = new Date().toISOString();
          const newEntries: UnlockedAchievement[] = newlyUnlocked.map((id) => ({
            id,
            unlockedAt: now,
            isNew: true,
          }));

          set((s) => ({
            unlocked: {
              ...s.unlocked,
              [childId]: [...(s.unlocked[childId] ?? []), ...newEntries],
            },
            pendingToasts: [...s.pendingToasts, ...newlyUnlocked],
          }));
        }

        return newlyUnlocked;
      },

      dismissToast: (achievementId) =>
        set((s) => ({
          pendingToasts: s.pendingToasts.filter((id) => id !== achievementId),
        })),

      getCount: (childId) => (get().unlocked[childId] ?? []).length,
    }),
    {
      name: 'sidrat-achievements',
      storage: createJSONStorage(() => mmkvStorage),
      partialize: (state) => ({
        unlocked: state.unlocked,
      }),
    },
  ),
);

/** Helper to look up a definition by ID */
export function getAchievementDef(id: string): AchievementDef | undefined {
  return ACHIEVEMENTS.find((a) => a.id === id);
}
