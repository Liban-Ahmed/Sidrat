/**
 * Spaced Repetition — Simplified SM-2
 *
 * Tailored for children: fewer intervals, gentler review schedule.
 * Intervals: 1 day → 3 days → 7 days → 14 days → 30 days
 */

const INTERVALS = [1, 3, 7, 14, 30] as const;

export interface ReviewSchedule {
    nextReviewDate: Date;
    intervalIndex: number;
}

/**
 * Calculate the next review date based on score.
 *
 * @param score 0-100 percentage from practice phase
 * @param currentIntervalIndex Current position in INTERVALS array
 * @param now Injectable date for testing
 */
export function calculateNextReview(
    score: number,
    currentIntervalIndex: number,
    now: Date = new Date(),
): ReviewSchedule {
    // Score >= 80%: advance to next interval
    // Score < 80%: reset to first interval
    const passed = score >= 80;
    const nextIndex = passed
        ? Math.min(currentIntervalIndex + 1, INTERVALS.length - 1)
        : 0;

    const daysUntilReview = INTERVALS[nextIndex]!;
    const nextReviewDate = new Date(now);
    nextReviewDate.setDate(nextReviewDate.getDate() + daysUntilReview);

    return {
        nextReviewDate,
        intervalIndex: nextIndex,
    };
}

/**
 * Check which lessons need review today.
 */
export function getLessonsNeedingReview(
    progressRecords: Array<{
        lessonId: string;
        nextReviewDate: string | null;
        completedAt: string | null;
    }>,
    now: Date = new Date(),
): string[] {
    return progressRecords
        .filter((p) => {
            if (!p.nextReviewDate || !p.completedAt) return false;
            return new Date(p.nextReviewDate) <= now;
        })
        .map((p) => p.lessonId);
}
