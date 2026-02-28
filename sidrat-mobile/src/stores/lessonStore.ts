/**
 * Lesson store
 *
 * Manages lesson data and per-child progress.
 * Improvement over iOS: progress is tracked in a normalized map
 * keyed by `childId:lessonId` for O(1) lookups instead of
 * SwiftData relationship traversal.
 */

import { create } from 'zustand';
import { persist, createJSONStorage, subscribeWithSelector } from 'zustand/middleware';
import { mmkvStorage } from './persist';
import { allCurriculumLessons } from '../data/curriculum';
import { queueSync } from '../services/localDatabase';
import { calculateNextReview } from '../utils/spacedRepetition';
import { uuid } from '../utils/uuid';
import type { LessonProgress, LessonPhase, LessonCategory } from '../types';
import type { CurriculumLesson } from '../types/curriculum';

function progressKey(childId: string, lessonId: string) {
  return `${childId}:${lessonId}`;
}

interface LessonStore {
  /** Normalized progress: key = "childId:lessonId" */
  progress: Record<string, LessonProgress>;

  // Queries
  getProgress: (childId: string, lessonId: string) => LessonProgress | undefined;
  getCompletedCount: (childId: string) => number;
  /** Get count of completed lessons grouped by category */
  getCompletedByCategory: (childId: string) => Record<LessonCategory, number>;
  getTodayLesson: (childId: string) => CurriculumLesson | undefined;

  // Mutations
  markPhaseComplete: (childId: string, lessonId: string, phase: LessonPhase) => void;
  completeLesson: (childId: string, lessonId: string, score: number, xp: number) => void;

  /** Record a review session result and schedule the next review */
  completeReview: (childId: string, lessonId: string, score: number) => void;
}

export const useLessonStore = create<LessonStore>()(
  subscribeWithSelector(
    persist(
      (set, get) => ({
        progress: {},

        getProgress: (childId, lessonId) => get().progress[progressKey(childId, lessonId)],

        getCompletedCount: (childId) =>
          Object.values(get().progress).filter((p) => p.childId === childId && p.isCompleted)
            .length,

        getCompletedByCategory: (childId) => {
          const { progress } = get();

          const categoryMap = new Map<string, LessonCategory>();
          for (const l of allCurriculumLessons) categoryMap.set(l.id, l.category);

          const counts: Record<LessonCategory, number> = {
            aqeedah: 0,
            salah: 0,
            wudu: 0,
            quran: 0,
            seerah: 0,
            adab: 0,
            duaa: 0,
            stories: 0,
          };

          for (const p of Object.values(progress)) {
            if (p.childId !== childId || !p.isCompleted) continue;
            const cat = categoryMap.get(p.lessonId);
            if (cat) counts[cat]++;
          }

          return counts;
        },

        getTodayLesson: (childId) => {
          const { progress } = get();
          return allCurriculumLessons.find((l) => {
            const p = progress[progressKey(childId, l.id)];
            return !p?.isCompleted;
          });
        },

        markPhaseComplete: (childId, lessonId, phase) =>
          set((s) => {
            const key = progressKey(childId, lessonId);
            const existing = s.progress[key];
            const now = new Date().toISOString();

            const updated: LessonProgress = existing
              ? {
                  ...existing,
                  lastCompletedPhase: phase,
                  phaseProgress: { ...existing.phaseProgress, [phase]: now },
                  lastAccessedAt: now,
                  attempts: existing.attempts + (phase === 'hook' ? 1 : 0),
                }
              : {
                  id: uuid(),
                  lessonId,
                  childId,
                  isCompleted: false,
                  score: 0,
                  xpEarned: 0,
                  attempts: 1,
                  lastCompletedPhase: phase,
                  phaseProgress: { [phase]: now },
                  lastAccessedAt: now,
                };

            return { progress: { ...s.progress, [key]: updated } };
          }),

        completeLesson: (childId, lessonId, score, xp) =>
          set((s) => {
            const key = progressKey(childId, lessonId);
            const existing = s.progress[key];
            const now = new Date().toISOString();

            // Calculate first review schedule from lesson score
            const review = calculateNextReview(score, 0);

            const updated: LessonProgress = {
              id: existing?.id ?? uuid(),
              lessonId,
              childId,
              isCompleted: true,
              completedAt: now,
              score,
              xpEarned: xp,
              attempts: (existing?.attempts ?? 0) + 1,
              lastCompletedPhase: 'reward',
              phaseProgress: {
                ...existing?.phaseProgress,
                reward: now,
              },
              lastAccessedAt: now,
              // Spaced repetition fields
              nextReviewDate: review.nextReviewDate.toISOString(),
              intervalIndex: review.intervalIndex,
              reviewCount: existing?.reviewCount ?? 0,
              lastReviewScore: score,
            };

            return { progress: { ...s.progress, [key]: updated } };
          }),

        completeReview: (childId, lessonId, score) =>
          set((s) => {
            const key = progressKey(childId, lessonId);
            const existing = s.progress[key];
            if (!existing) return s; // guard: can't review lesson without prior progress

            const now = new Date().toISOString();
            const currentInterval = existing.intervalIndex ?? 0;
            const review = calculateNextReview(score, currentInterval);

            const updated: LessonProgress = {
              ...existing,
              lastAccessedAt: now,
              lastReviewedAt: now,
              lastReviewScore: score,
              nextReviewDate: review.nextReviewDate.toISOString(),
              intervalIndex: review.intervalIndex,
              reviewCount: (existing.reviewCount ?? 0) + 1,
              // Update score if the review score is higher
              score: Math.max(existing.score, score),
            };

            return { progress: { ...s.progress, [key]: updated } };
          }),
      }),
      {
        name: 'sidrat-lessons',
        storage: createJSONStorage(() => mmkvStorage),
        partialize: (state) => ({
          progress: state.progress,
        }),
      },
    ),
  ),
);

/**
 * Sync bridge: when a lesson is completed or reviewed, queue the
 * progress record to SQLite for eventual Supabase sync.
 * Only syncs completed or reviewed entries (not partial phase progress).
 */
useLessonStore.subscribe(
  (state) => state.progress,
  (progress, prevProgress) => {
    for (const [key, entry] of Object.entries(progress)) {
      const prev = prevProgress[key];
      if (!entry) continue;

      const isNewCompletion = entry.isCompleted && !prev?.isCompleted;
      const isNewReview = (entry.reviewCount ?? 0) > (prev?.reviewCount ?? 0);

      if (isNewCompletion || isNewReview) {
        queueSync('lesson_progress', entry.id, 'upsert', {
          id: entry.id,
          child_id: entry.childId,
          lesson_id: entry.lessonId,
          is_completed: entry.isCompleted,
          completed_at: entry.completedAt ?? null,
          score: entry.score,
          xp_earned: entry.xpEarned,
          attempts: entry.attempts,
          last_completed_phase: entry.lastCompletedPhase ?? null,
          phase_progress: entry.phaseProgress ?? {},
          last_accessed_at: entry.lastAccessedAt ?? null,
        }).catch(console.error);
      }
    }
  },
);
