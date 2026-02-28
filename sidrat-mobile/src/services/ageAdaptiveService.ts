/**
 * Age-Adaptive Content Service
 *
 * Resolves a CurriculumLesson into age-appropriate content based
 * on the active child's age group. Merges variant overrides on top
 * of the lesson's default phases.
 *
 * Resolution order:
 *  1. Exact match for the child's age group
 *  2. Closest younger age group with a variant defined
 *  3. Fall through to the lesson's default content
 */

import { ageToGroup, AGE_GROUP_ORDER } from '../types/curriculum';
import { getAge } from '../types/models';
import type {
  AgeGroup,
  AgeVariant,
  CurriculumLesson,
  HookBlock,
  PracticeBlock,
  RewardConfig,
  TeachBlock,
} from '../types/curriculum';

// ── Public Types ───────────────────────────────────────────────

/**
 * A fully-resolved lesson whose phases have been adapted for a
 * specific age group. Has the same shape as CurriculumLesson so
 * the lesson player can consume it without changes.
 */
export interface ResolvedLesson {
  /** The original lesson ID (unchanged) */
  id: string;
  title: string;
  description: string;
  category: CurriculumLesson['category'];
  difficulty: CurriculumLesson['difficulty'];
  durationMinutes: number;
  xpReward: number;
  order: number;
  unitId: string;
  minAgeGroup: AgeGroup;
  tags?: string[];

  // Resolved phases
  hook: HookBlock;
  teach: TeachBlock[];
  practice: PracticeBlock[];
  reward: RewardConfig;

  /** Which age group was used during resolution */
  resolvedAgeGroup: AgeGroup;
  /** Whether a variant was applied (vs. plain fallback) */
  isVariantApplied: boolean;
}

// ── Resolution Logic ───────────────────────────────────────────

/**
 * Find the best-matching age variant for a given age group.
 *
 * Tries an exact match first, then walks backwards through the
 * age group order (younger groups) to find the closest variant.
 * Returns `undefined` if no variant exists.
 */
export function findBestVariant(
  ageVariants: Partial<Record<AgeGroup, AgeVariant>> | undefined,
  targetGroup: AgeGroup,
): { variant: AgeVariant; matchedGroup: AgeGroup } | undefined {
  if (!ageVariants) return undefined;

  // 1. Exact match
  const exact = ageVariants[targetGroup];
  if (exact) return { variant: exact, matchedGroup: targetGroup };

  // 2. Walk backwards through younger groups
  const targetIdx = AGE_GROUP_ORDER.indexOf(targetGroup);
  for (let i = targetIdx - 1; i >= 0; i--) {
    const group = AGE_GROUP_ORDER[i]!;
    const fallback = ageVariants[group];
    if (fallback) return { variant: fallback, matchedGroup: group };
  }

  // 3. Walk forwards through older groups (last resort)
  for (let i = targetIdx + 1; i < AGE_GROUP_ORDER.length; i++) {
    const group = AGE_GROUP_ORDER[i]!;
    const fallback = ageVariants[group];
    if (fallback) return { variant: fallback, matchedGroup: group };
  }

  return undefined;
}

/**
 * Resolve a CurriculumLesson into age-appropriate content.
 *
 * @param lesson   The base curriculum lesson (with optional ageVariants)
 * @param ageGroup The child's age group
 * @returns        A ResolvedLesson with the appropriate phase content
 */
export function resolveLesson(lesson: CurriculumLesson, ageGroup: AgeGroup): ResolvedLesson {
  const match = findBestVariant(lesson.ageVariants, ageGroup);

  if (!match) {
    // No variants defined — use default content as-is
    return {
      id: lesson.id,
      title: lesson.title,
      description: lesson.description,
      category: lesson.category,
      difficulty: lesson.difficulty,
      durationMinutes: lesson.durationMinutes,
      xpReward: lesson.xpReward,
      order: lesson.order,
      unitId: lesson.unitId,
      minAgeGroup: lesson.minAgeGroup,
      tags: lesson.tags,
      hook: lesson.hook,
      teach: lesson.teach,
      practice: lesson.practice,
      reward: lesson.reward,
      resolvedAgeGroup: ageGroup,
      isVariantApplied: false,
    };
  }

  const { variant, matchedGroup } = match;

  return {
    id: lesson.id,
    title: lesson.title,
    description: lesson.description,
    category: lesson.category,
    difficulty: lesson.difficulty,
    durationMinutes: variant.durationMinutes ?? lesson.durationMinutes,
    xpReward: lesson.xpReward,
    order: lesson.order,
    unitId: lesson.unitId,
    minAgeGroup: lesson.minAgeGroup,
    tags: lesson.tags,
    // Phase overrides — variant fields replace base when present
    hook: variant.hook ?? lesson.hook,
    teach: variant.teach ?? lesson.teach,
    practice: variant.practice ?? lesson.practice,
    reward: variant.reward ?? lesson.reward,
    resolvedAgeGroup: matchedGroup,
    isVariantApplied: true,
  };
}

/**
 * Convenience: resolve a lesson using a child's birth year.
 *
 * @param lesson    The base curriculum lesson
 * @param birthYear The child's birth year (used to compute age → age group)
 * @returns         A ResolvedLesson adapted for the child's age
 */
export function resolveLessonForChild(lesson: CurriculumLesson, birthYear: number): ResolvedLesson {
  const age = getAge(birthYear);
  const ageGroup = ageToGroup(age);
  return resolveLesson(lesson, ageGroup);
}
