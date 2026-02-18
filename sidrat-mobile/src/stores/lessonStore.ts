/**
 * Lesson store
 *
 * Manages lesson data and per-child progress.
 * Improvement over iOS: progress is tracked in a normalized map
 * keyed by `childId:lessonId` for O(1) lookups instead of
 * SwiftData relationship traversal.
 */

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { mmkvStorage } from './persist';
import type { Lesson, LessonProgress, LessonPhase } from '../types';
import { sampleLessons } from '../data/lessons';

function uuid(): string {
    return (
        Math.random().toString(36).substring(2, 15) +
        Math.random().toString(36).substring(2, 15)
    );
}

function progressKey(childId: string, lessonId: string) {
    return `${childId}:${lessonId}`;
}

interface LessonStore {
    lessons: Lesson[];

    /** Normalized progress: key = "childId:lessonId" */
    progress: Record<string, LessonProgress>;

    // Queries
    getLessonsForWeek: (week: number) => Lesson[];
    getProgress: (childId: string, lessonId: string) => LessonProgress | undefined;
    getCompletedCount: (childId: string) => number;
    getTodayLesson: (childId: string) => Lesson | undefined;

    // Mutations
    markPhaseComplete: (
        childId: string,
        lessonId: string,
        phase: LessonPhase,
    ) => void;
    completeLesson: (childId: string, lessonId: string, score: number, xp: number) => void;
}

export const useLessonStore = create<LessonStore>()(
    persist(
        (set, get) => ({
            lessons: sampleLessons,
            progress: {},

            getLessonsForWeek: (week) => get().lessons.filter((l) => l.weekNumber === week),

            getProgress: (childId, lessonId) =>
                get().progress[progressKey(childId, lessonId)],

            getCompletedCount: (childId) =>
                Object.values(get().progress).filter(
                    (p) => p.childId === childId && p.isCompleted,
                ).length,

            getTodayLesson: (childId) => {
                const { lessons, progress } = get();
                // Find the first incomplete lesson in order
                return lessons.find((l) => {
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
                    };

                    return { progress: { ...s.progress, [key]: updated } };
                }),
        }),
        {
            name: 'sidrat-lessons',
            storage: createJSONStorage(() => mmkvStorage),
            // Only persist progress, not lesson data (that's bundled)
            partialize: (state) => ({
                progress: state.progress,
            }),
        },
    ),
);
