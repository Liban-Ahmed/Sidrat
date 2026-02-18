/**
 * useReviewQueue — Hook for spaced repetition reviews
 *
 * Bridges the spaced repetition utility into a reactive hook
 * that returns lessons due for review for the active child.
 */

import { useMemo } from 'react';
import { useAppStore, useLessonStore } from '../stores';
import { getLessonsNeedingReview } from '../utils/spacedRepetition';

export interface ReviewItem {
    lessonId: string;
    lastScore: number;
    daysSinceReview: number;
}

export function useReviewQueue() {
    const activeChildId = useAppStore((s) => s.activeChildId);
    const progress = useLessonStore((s) => s.progress);

    const reviewQueue = useMemo(() => {
        if (!activeChildId) return [];

        // Build the review history from lesson progress
        const reviewHistory = Object.values(progress)
            .filter((p) => p.childId === activeChildId && p.isCompleted && p.completedAt)
            .map((p) => ({
                lessonId: p.lessonId,
                completedAt: p.completedAt ?? null,
                // Calculate next review date from interval/score
                nextReviewDate: p.completedAt
                    ? new Date(
                        new Date(p.completedAt).getTime() +
                        (p.score >= 80 ? 3 : 1) * 24 * 60 * 60 * 1000,
                    ).toISOString()
                    : null,
            }));

        return getLessonsNeedingReview(reviewHistory);
    }, [activeChildId, progress]);

    return {
        /** Lessons that are due or overdue for review */
        reviewQueue,
        /** Number of lessons needing review */
        reviewCount: reviewQueue.length,
        /** Whether there are any reviews pending */
        hasReviews: reviewQueue.length > 0,
    };
}
