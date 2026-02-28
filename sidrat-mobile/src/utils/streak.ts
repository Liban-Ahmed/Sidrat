/**
 * Streak Calculation Utilities
 *
 * Pure functions for streak logic — testable, no side effects.
 */

export interface StreakResult {
  current: number;
  best: number;
  isActive: boolean;
  completedToday: boolean;
}

/**
 * Calculate the current streak state.
 *
 * @param lastActiveDate - ISO date string of last lesson completion
 * @param currentStreak - Current streak count
 * @param bestStreak - Best streak ever
 * @param now - Current date (injectable for testing)
 */
export function calculateStreak(
  lastActiveDate: string | null,
  currentStreak: number,
  bestStreak: number,
  now: Date = new Date(),
): StreakResult {
  if (!lastActiveDate) {
    return { current: 0, best: bestStreak, isActive: false, completedToday: false };
  }

  const last = startOfDay(new Date(lastActiveDate));
  const today = startOfDay(now);
  const diffMs = today.getTime() - last.getTime();
  const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) {
    // Completed today — streak is active
    return { current: currentStreak, best: bestStreak, isActive: true, completedToday: true };
  }

  if (diffDays === 1) {
    // Yesterday — streak continues but not yet completed today
    return { current: currentStreak, best: bestStreak, isActive: true, completedToday: false };
  }

  // 2+ days gap — streak broken
  return { current: 0, best: bestStreak, isActive: false, completedToday: false };
}

/**
 * Update streak values after completing a lesson today.
 */
export function updateStreakOnCompletion(
  currentStreak: number,
  bestStreak: number,
): { newCurrent: number; newBest: number } {
  const newCurrent = currentStreak + 1;
  const newBest = Math.max(newCurrent, bestStreak);
  return { newCurrent, newBest };
}

/**
 * Get the start of the day (midnight, local time).
 */
function startOfDay(date: Date): Date {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

/**
 * Get an array of booleans for the week view.
 * true = completed that day, false = not.
 */
export function getWeekCompletionMap(
  streak: number,
  dayOfWeek: number = new Date().getDay(), // 0=Sun, 6=Sat
): boolean[] {
  const week: boolean[] = [false, false, false, false, false, false, false];
  // Fill backwards from current day of week
  for (let i = 0; i < Math.min(streak, 7); i++) {
    const idx = (dayOfWeek - i + 7) % 7;
    week[idx] = true;
  }
  return week;
}
