/**
 * Spaced repetition utility tests
 */

import { calculateNextReview, getLessonsNeedingReview } from '../src/utils/spacedRepetition';

describe('calculateNextReview', () => {
  const now = new Date('2026-02-18T10:00:00.000Z');

  it('schedules 1 day out for first review on pass', () => {
    const result = calculateNextReview(90, 0, now);
    expect(result.intervalIndex).toBe(1);
    expect(result.nextReviewDate.getDate()).toBe(21); // Feb 18 + 3 days
  });

  it('resets to interval 0 on fail', () => {
    const result = calculateNextReview(60, 3, now);
    expect(result.intervalIndex).toBe(0);
    expect(result.nextReviewDate.getDate()).toBe(19); // Feb 18 + 1 day
  });

  it('caps at maximum interval', () => {
    const result = calculateNextReview(100, 4, now);
    expect(result.intervalIndex).toBe(4); // stays at max
    expect(result.nextReviewDate.getDate()).toBe(20); // Feb 18 + 30 days wraps to March 20
  });

  it('treats exactly 80% as passing', () => {
    const result = calculateNextReview(80, 0, now);
    expect(result.intervalIndex).toBe(1);
  });

  it('treats 79% as failing', () => {
    const result = calculateNextReview(79, 2, now);
    expect(result.intervalIndex).toBe(0);
  });
});

describe('getLessonsNeedingReview', () => {
  const now = new Date('2026-02-18T10:00:00.000Z');

  it('returns empty for no progress records', () => {
    expect(getLessonsNeedingReview([], now)).toEqual([]);
  });

  it('returns lessons whose review date has passed', () => {
    const records = [
      {
        lessonId: 'L1',
        nextReviewDate: '2026-02-17T00:00:00.000Z',
        completedAt: '2026-02-10T00:00:00.000Z',
      },
      {
        lessonId: 'L2',
        nextReviewDate: '2026-02-20T00:00:00.000Z',
        completedAt: '2026-02-10T00:00:00.000Z',
      },
      { lessonId: 'L3', nextReviewDate: null, completedAt: '2026-02-10T00:00:00.000Z' },
    ];

    const result = getLessonsNeedingReview(records, now);
    expect(result).toEqual(['L1']);
  });

  it('excludes lessons without completedAt', () => {
    const records = [
      { lessonId: 'L1', nextReviewDate: '2026-02-17T00:00:00.000Z', completedAt: null },
    ];

    expect(getLessonsNeedingReview(records, now)).toEqual([]);
  });
});
