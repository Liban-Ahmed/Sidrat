/**
 * App Constants
 *
 * Central configuration for environment-specific values,
 * feature flags, and app-wide constants.
 */

// ── Environment ──────────────────────────────────────────────────

export const ENV = (process.env.EXPO_PUBLIC_ENV ?? 'development') as
  | 'development'
  | 'preview'
  | 'production';

export const IS_DEV = ENV === 'development';
export const IS_PROD = ENV === 'production';

// ── Supabase ─────────────────────────────────────────────────────
// Set these in your .env file:
//   EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
//   EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

export const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL ?? '';
export const SUPABASE_ANON_KEY = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ?? '';

// ── App Config ───────────────────────────────────────────────────

export const APP_CONFIG = {
  /** App name shown in UI */
  name: 'Sidrat',

  /** Bundle identifier */
  bundleId: 'com.sidrat.app',

  /** Supported age range */
  minAge: 2,
  maxAge: 14,

  /** Maximum children per parent account */
  maxChildren: 4,

  /** Lesson duration target (minutes) */
  targetLessonMinutes: 5,

  /** XP per lesson base amount */
  baseXpPerLesson: 10,

  /** Default daily reminder hour (24h) */
  defaultReminderHour: 17,

  /** Free tier lesson limit (freemium) */
  freeTierLessonLimit: 10,

  /** Days before streak resets */
  streakGracePeriodDays: 1,
} as const;

// ── Age Groups (for curriculum difficulty) ───────────────────────

export type AgeGroup = 'toddler' | 'early' | 'middle' | 'preteen';

export function getAgeGroup(age: number): AgeGroup {
  if (age <= 4) return 'toddler';
  if (age <= 7) return 'early';
  if (age <= 10) return 'middle';
  return 'preteen';
}

export const AGE_GROUP_META: Record<AgeGroup, { label: string; description: string }> = {
  toddler: { label: 'Little Learner', description: 'Ages 2–4' },
  early: { label: 'Explorer', description: 'Ages 5–7' },
  middle: { label: 'Adventurer', description: 'Ages 8–10' },
  preteen: { label: 'Scholar', description: 'Ages 11–14' },
};

// ── Sentry ───────────────────────────────────────────────────────

export const SENTRY_DSN = process.env.EXPO_PUBLIC_SENTRY_DSN ?? '';

// ── Analytics Event Names ────────────────────────────────────────

export const ANALYTICS_EVENTS = {
  LESSON_STARTED: 'lesson_started',
  LESSON_COMPLETED: 'lesson_completed',
  STREAK_UPDATED: 'streak_updated',
  ACHIEVEMENT_EARNED: 'achievement_earned',
  CHILD_CREATED: 'child_created',
  ONBOARDING_COMPLETED: 'onboarding_completed',
  FAMILY_ACTIVITY_COMPLETED: 'family_activity_completed',
  SUBSCRIPTION_STARTED: 'subscription_started',
  APP_OPENED: 'app_opened',
} as const;
