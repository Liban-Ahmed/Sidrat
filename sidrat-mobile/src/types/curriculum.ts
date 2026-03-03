/**
 * Curriculum Type System
 *
 * Enhanced lesson schema supporting the 4-phase lesson structure:
 *   Hook → Teach → Practice → Reward
 *
 * Each phase has age-adaptive content variants for the 4 age groups:
 *   toddler (2-4) | early (5-7) | middle (8-10) | preteen (11-14)
 */

import type { LessonCategory, Difficulty } from './models';

// ── Age Groups ─────────────────────────────────────────────────

export type AgeGroup = 'toddler' | 'early' | 'middle' | 'preteen';

export const AGE_GROUP_RANGES: Record<AgeGroup, { min: number; max: number; label: string }> = {
  toddler: { min: 2, max: 4, label: 'Ages 2-4' },
  early: { min: 5, max: 7, label: 'Ages 5-7' },
  middle: { min: 8, max: 10, label: 'Ages 8-10' },
  preteen: { min: 11, max: 14, label: 'Ages 11-14' },
};

export function ageToGroup(age: number): AgeGroup {
  if (age <= 4) return 'toddler';
  if (age <= 7) return 'early';
  if (age <= 10) return 'middle';
  return 'preteen';
}

// ── Phase Content Blocks ───────────────────────────────────────

/** Hook phase: grabs attention with a story, question, or fun fact */
export interface HookBlock {
  type: 'hook';
  /** Engaging question or scenario */
  prompt: string;
  /** Short narration text (read aloud via TTS) */
  narration: string;
  /** Optional illustration key (maps to bundled asset) */
  illustration?: string;
}

/** Teach phase: core knowledge delivery */
export interface TeachBlock {
  type: 'teach';
  /** Section title */
  title: string;
  /** Main teaching content (supports simple markdown) */
  body: string;
  /** Narration version (simpler, for TTS) */
  narration: string;
  /** Key term definitions */
  keyTerms?: { term: string; definition: string }[];
  /** Arabic text with transliteration */
  arabic?: {
    text: string;
    transliteration: string;
    translation: string;
    /** Quran reference for audio playback — if present, a recitation button is shown */
    quranRef?: {
      /** Surah number (1-114) */
      surah: number;
      /** Starting ayah number within the surah */
      ayah: number;
      /** Ending ayah number for multi-ayah ranges */
      endAyah?: number;
      /** Pre-computed global ayah numbers — avoids API call for resolution */
      globalAyahNumbers?: number[];
    };
  };
  /** Optional illustration key */
  illustration?: string;
}

/** Practice phase: interactive exercises */
export type PracticeBlock =
  | PracticeQuiz
  | PracticeMatching
  | PracticeOrdering
  | PracticeFillBlank
  | PracticeTrueFalse
  | PracticeTapWord;

interface PracticeBase {
  id: string;
  /** Points awarded for correct answer */
  points: number;
  /** Hint shown after first wrong attempt */
  hint?: string;
  /** Explanation shown after answering */
  explanation?: string;
}

export interface PracticeQuiz extends PracticeBase {
  type: 'quiz';
  question: string;
  options: string[];
  /** Index of correct answer */
  correctIndex: number;
}

export interface PracticeMatching extends PracticeBase {
  type: 'matching';
  instruction: string;
  pairs: { left: string; right: string }[];
}

export interface PracticeOrdering extends PracticeBase {
  type: 'ordering';
  instruction: string;
  /** Items in correct order */
  correctOrder: string[];
}

export interface PracticeFillBlank extends PracticeBase {
  type: 'fill-blank';
  /** Text with ___ for the blank */
  sentence: string;
  /** Acceptable answers (case-insensitive) */
  acceptedAnswers: string[];
}

export interface PracticeTrueFalse extends PracticeBase {
  type: 'true-false';
  statement: string;
  correctAnswer: boolean;
}

export interface PracticeTapWord extends PracticeBase {
  type: 'tap-word';
  instruction: string;
  /** Words shown in jumbled order */
  words: string[];
  /** Correct sentence (words in order) */
  correctSentence: string[];
}

/** Reward phase: celebration + review */
export interface RewardConfig {
  /** Celebratory message */
  message: string;
  /** Fun fact related to the lesson */
  funFact?: string;
  /** Du'a or dhikr to learn */
  bonusDua?: {
    arabic: string;
    transliteration: string;
    translation: string;
  };
}

// ── Age-Adaptive Variants ──────────────────────────────────────

/** Ordered age groups from youngest to oldest (used for fallback resolution) */
export const AGE_GROUP_ORDER: readonly AgeGroup[] = [
  'toddler',
  'early',
  'middle',
  'preteen',
] as const;

/**
 * Age-specific content variant.
 *
 * Each field is optional — only specify overrides for the fields
 * that differ from the lesson's default content. Un-specified fields
 * fall through to the base lesson.
 *
 * Guidelines per age group:
 *  - **toddler (3–4):** Shorter text, more images/audio, simpler vocabulary, 1-2 practice items
 *  - **early (5–7):** Guided reading, basic Arabic letters, 2-3 practice items
 *  - **middle (8–10):** Full text, Arabic with transliteration, 3-4 practice items
 *  - **preteen (11–14):** Advanced concepts, Quran tafsir basics, 4-5 practice items
 */
export interface AgeVariant {
  /** Override the hook for this age group */
  hook?: HookBlock;
  /** Override the teach blocks for this age group */
  teach?: TeachBlock[];
  /** Override the practice blocks for this age group */
  practice?: PracticeBlock[];
  /** Override the reward config for this age group */
  reward?: RewardConfig;
  /** Override estimated duration for this age group */
  durationMinutes?: number;
}

// ── Curriculum Lesson ──────────────────────────────────────────

/**
 * A single curriculum lesson with the 4-phase structure.
 * Extends the simpler Lesson model with structured phases.
 *
 * The base `hook`, `teach`, `practice`, and `reward` fields serve as the
 * default content. If `ageVariants` is provided, the age-adaptive resolver
 * will select the variant that matches the active child's age group and
 * merge overrides on top of the defaults.
 */
export interface CurriculumLesson {
  id: string;
  title: string;
  description: string;
  category: LessonCategory;
  difficulty: Difficulty;
  /** Estimated duration in minutes */
  durationMinutes: number;
  /** XP awarded on completion */
  xpReward: number;
  /** Sequential order within the unit */
  order: number;
  /** Parent unit ID */
  unitId: string;
  /** Minimum age group this lesson is suitable for */
  minAgeGroup: AgeGroup;
  /** Tags for search/filtering */
  tags?: string[];

  // ── The 4 Phases (default content) ──
  hook: HookBlock;
  teach: TeachBlock[];
  practice: PracticeBlock[];
  reward: RewardConfig;

  // ── Age-Adaptive Overrides ──
  /**
   * Per-age-group content variants. Each variant can override any
   * combination of the 4 phases. If a variant for the child's age
   * group is not found, the resolver falls back to the closest
   * younger age group, then to the base content.
   */
  ageVariants?: Partial<Record<AgeGroup, AgeVariant>>;
}

/** A unit groups related lessons within a category */
export interface CurriculumUnit {
  id: string;
  title: string;
  description: string;
  category: LessonCategory;
  /** Order within the category */
  order: number;
  /** Icon name (Ionicons) */
  icon: string;
  /** Lessons in this unit */
  lessonIds: string[];
}

/** Top-level curriculum index */
export interface CurriculumIndex {
  version: number;
  lastUpdated: string;
  units: CurriculumUnit[];
}

// ── Lesson Player State ────────────────────────────────────────

export type LessonPlayerPhase = 'hook' | 'teach' | 'practice' | 'reward';

export interface LessonPlayerState {
  lessonId: string;
  childId: string;
  currentPhase: LessonPlayerPhase;
  /** Index within teach blocks array */
  teachIndex: number;
  /** Index within practice blocks array */
  practiceIndex: number;
  /** Running score for this attempt */
  score: number;
  /** Max possible score */
  maxScore: number;
  /** Number of correct answers */
  correctCount: number;
  /** Total practice questions answered */
  answeredCount: number;
  /** Current consecutive correct-answer streak (Barakah Multiplier) */
  comboCount: number;
  /** Highest combo achieved during this lesson attempt */
  maxCombo: number;
  /** Time started (ISO) */
  startedAt: string;
  /** Whether narration is playing */
  isNarrating: boolean;
  /** Whether this is a review session (skips Hook, goes straight to Practice) */
  isReview: boolean;
}
