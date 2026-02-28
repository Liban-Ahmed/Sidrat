/**
 * Streak utility tests
 */

import {
  calculateStreak,
  updateStreakOnCompletion,
  getWeekCompletionMap,
} from '../src/utils/streak';

describe('calculateStreak', () => {
  const now = new Date('2026-02-18T10:00:00.000Z');

  it('returns 0 streak when no last active date', () => {
    const result = calculateStreak(null, 0, 5, now);
    expect(result.current).toBe(0);
    expect(result.best).toBe(5);
    expect(result.isActive).toBe(false);
    expect(result.completedToday).toBe(false);
  });

  it('detects completed today', () => {
    const today = '2026-02-18T08:00:00.000Z';
    const result = calculateStreak(today, 3, 5, now);
    expect(result.current).toBe(3);
    expect(result.isActive).toBe(true);
    expect(result.completedToday).toBe(true);
  });

  it('continues streak from yesterday', () => {
    const yesterday = '2026-02-17T15:00:00.000Z';
    const result = calculateStreak(yesterday, 3, 5, now);
    expect(result.current).toBe(3);
    expect(result.isActive).toBe(true);
    expect(result.completedToday).toBe(false);
  });

  it('breaks streak after 2+ day gap', () => {
    const twoDaysAgo = '2026-02-16T10:00:00.000Z';
    const result = calculateStreak(twoDaysAgo, 7, 10, now);
    expect(result.current).toBe(0);
    expect(result.best).toBe(10);
    expect(result.isActive).toBe(false);
  });
});

describe('updateStreakOnCompletion', () => {
  it('increments streak by 1', () => {
    const { newCurrent, newBest } = updateStreakOnCompletion(3, 5);
    expect(newCurrent).toBe(4);
    expect(newBest).toBe(5);
  });

  it('updates best when current exceeds it', () => {
    const { newCurrent, newBest } = updateStreakOnCompletion(5, 5);
    expect(newCurrent).toBe(6);
    expect(newBest).toBe(6);
  });
});

describe('getWeekCompletionMap', () => {
  it('returns all false for 0 streak', () => {
    const map = getWeekCompletionMap(0, 3); // Wednesday
    expect(map.every((v) => v === false)).toBe(true);
  });

  it('marks correct days for streak of 3 on Wednesday', () => {
    const map = getWeekCompletionMap(3, 3);
    // Wed(3)=true, Tue(2)=true, Mon(1)=true, rest false
    expect(map[3]).toBe(true);
    expect(map[2]).toBe(true);
    expect(map[1]).toBe(true);
    expect(map[0]).toBe(false);
    expect(map[4]).toBe(false);
  });

  it('caps at 7 days', () => {
    const map = getWeekCompletionMap(10, 5);
    expect(map.filter(Boolean).length).toBe(7);
  });
});
