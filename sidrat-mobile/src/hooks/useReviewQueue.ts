/**
 * useReviewQueue — Hook for spaced repetition reviews
 *
 * Uses persisted review schedule data from lessonStore
 * (nextReviewDate, intervalIndex) to build a prioritized
 * queue of lessons due for review for the active child.
 *
 * Returns enriched review items with lesson metadata,
 * urgency indicators, and a completeReview callback.
 */

import { useMemo, useCallback } from 'react';
import { getCurriculumLesson } from '../data/curriculum';
import { useAppStore, useLessonStore } from '../stores';
import type { CurriculumLesson } from '../types/curriculum';
import type { LessonCategory } from '../types/models';

export interface ReviewItem {
  /** The curriculum lesson ID */
  lessonId: string;
  /** Curriculum lesson data (title, category, etc.) */
  lesson: CurriculumLesson;
  /** Score from the last attempt or review (0-100) */
  lastScore: number;
  /** Days overdue (0 = due today, positive = overdue) */
  daysOverdue: number;
  /** Current interval index in SM-2 array (0-4) */
  intervalIndex: number;
  /** How many times this lesson has been reviewed */
  reviewCount: number;
  /** ISO date of the scheduled review */
  scheduledDate: string;
  /** Urgency tier for UI styling */
  urgency: 'due-today' | 'overdue' | 'critical';
}

export interface ReviewQueueResult {
  /** Prioritized list of lessons due for review (most urgent first) */
  reviewQueue: ReviewItem[];
  /** Number of lessons needing review */
  reviewCount: number;
  /** Whether there are any reviews pending */
  hasReviews: boolean;
  /** Lessons grouped by category for the review screen */
  reviewsByCategory: Partial<Record<LessonCategory, ReviewItem[]>>;
  /** Complete a review and schedule the next one */
  completeReview: (lessonId: string, score: number) => void;
  /** Get the next lesson to review (highest priority) */
  nextReview: ReviewItem | null;
}

export function useReviewQueue(): ReviewQueueResult {
  const activeChildId = useAppStore((s) => s.activeChildId);
  const progress = useLessonStore((s) => s.progress);
  const completeReviewInStore = useLessonStore((s) => s.completeReview);

  const reviewQueue = useMemo(() => {
    if (!activeChildId) return [];

    const now = new Date();
    const items: ReviewItem[] = [];

    for (const p of Object.values(progress)) {
      // Only include completed lessons for the active child
      if (p.childId !== activeChildId || !p.isCompleted || !p.completedAt) continue;

      // Must have a review date scheduled
      if (!p.nextReviewDate) continue;

      const reviewDate = new Date(p.nextReviewDate);
      if (reviewDate > now) continue; // Not yet due

      // Find the curriculum lesson
      const lesson = getCurriculumLesson(p.lessonId);
      if (!lesson) continue;

      // Calculate days overdue
      const msPerDay = 24 * 60 * 60 * 1000;
      const daysOverdue = Math.max(
        0,
        Math.floor((now.getTime() - reviewDate.getTime()) / msPerDay),
      );

      // Determine urgency
      let urgency: ReviewItem['urgency'] = 'due-today';
      if (daysOverdue >= 7) urgency = 'critical';
      else if (daysOverdue >= 1) urgency = 'overdue';

      items.push({
        lessonId: p.lessonId,
        lesson,
        lastScore: p.lastReviewScore ?? p.score,
        daysOverdue,
        intervalIndex: p.intervalIndex ?? 0,
        reviewCount: p.reviewCount ?? 0,
        scheduledDate: p.nextReviewDate,
        urgency,
      });
    }

    // Sort by urgency: critical first, then overdue, then due-today
    // Within each tier, sort by most overdue first
    const urgencyOrder: Record<ReviewItem['urgency'], number> = {
      critical: 0,
      overdue: 1,
      'due-today': 2,
    };
    items.sort((a, b) => {
      const tierDiff = urgencyOrder[a.urgency] - urgencyOrder[b.urgency];
      if (tierDiff !== 0) return tierDiff;
      return b.daysOverdue - a.daysOverdue;
    });

    return items;
  }, [activeChildId, progress]);

  const reviewsByCategory = useMemo(() => {
    const grouped: Partial<Record<LessonCategory, ReviewItem[]>> = {};
    for (const item of reviewQueue) {
      const cat = item.lesson.category;
      if (!grouped[cat]) grouped[cat] = [];
      grouped[cat]!.push(item);
    }
    return grouped;
  }, [reviewQueue]);

  const completeReview = useCallback(
    (lessonId: string, score: number) => {
      if (!activeChildId) return;
      completeReviewInStore(activeChildId, lessonId, score);
    },
    [activeChildId, completeReviewInStore],
  );

  return {
    reviewQueue,
    reviewCount: reviewQueue.length,
    hasReviews: reviewQueue.length > 0,
    reviewsByCategory,
    completeReview,
    nextReview: reviewQueue[0] ?? null,
  };
}
