/**
 * Age-Adaptive Content Service tests.
 *
 * Validates the resolution logic that selects age-appropriate
 * content variants for each lesson.
 */

import { aqeedahLessons } from '../src/data/curriculum/aqeedah';
import {
  findBestVariant,
  resolveLesson,
  resolveLessonForChild,
} from '../src/services/ageAdaptiveService';
import type {
  AgeGroup,
  AgeVariant,
  CurriculumLesson,
  HookBlock,
  PracticeBlock,
  TeachBlock,
  RewardConfig,
} from '../src/types/curriculum';

// ── Fixtures ───────────────────────────────────────────────────

const baseHook: HookBlock = {
  type: 'hook',
  prompt: 'Default hook prompt',
  narration: 'Default hook narration',
};

const toddlerHook: HookBlock = {
  type: 'hook',
  prompt: 'Simple toddler hook',
  narration: 'Simple toddler narration',
};

const preteenHook: HookBlock = {
  type: 'hook',
  prompt: 'Advanced preteen hook',
  narration: 'Advanced preteen narration',
};

const baseTeach: TeachBlock[] = [
  {
    type: 'teach',
    title: 'Default Teach',
    body: 'Default teach body',
    narration: 'Default teach narration',
  },
  {
    type: 'teach',
    title: 'Default Teach 2',
    body: 'Default teach body 2',
    narration: 'Default teach narration 2',
  },
];

const toddlerTeach: TeachBlock[] = [
  {
    type: 'teach',
    title: 'Simple Teach',
    body: 'Very simple body',
    narration: 'Very simple narration',
  },
];

const basePractice: PracticeBlock[] = [
  {
    id: 'p1',
    type: 'quiz',
    question: 'Default question?',
    options: ['A', 'B', 'C'],
    correctIndex: 0,
    points: 10,
  },
  {
    id: 'p2',
    type: 'true-false',
    statement: 'Default statement',
    correctAnswer: true,
    points: 10,
  },
  {
    id: 'p3',
    type: 'true-false',
    statement: 'Default statement 2',
    correctAnswer: false,
    points: 10,
  },
];

const toddlerPractice: PracticeBlock[] = [
  {
    id: 'p1-t',
    type: 'quiz',
    question: 'Simple question?',
    options: ['Yes', 'No'],
    correctIndex: 0,
    points: 10,
  },
];

const preteenPractice: PracticeBlock[] = [
  {
    id: 'p1-pt',
    type: 'quiz',
    question: 'Advanced question?',
    options: ['A', 'B', 'C', 'D'],
    correctIndex: 2,
    points: 10,
  },
  {
    id: 'p2-pt',
    type: 'fill-blank',
    sentence: 'Advanced ___ blank',
    acceptedAnswers: ['answer'],
    points: 15,
  },
  {
    id: 'p3-pt',
    type: 'true-false',
    statement: 'Advanced statement',
    correctAnswer: true,
    points: 10,
  },
  {
    id: 'p4-pt',
    type: 'matching',
    instruction: 'Match these advanced pairs',
    pairs: [
      { left: 'A', right: '1' },
      { left: 'B', right: '2' },
    ],
    points: 15,
  },
  {
    id: 'p5-pt',
    type: 'ordering',
    instruction: 'Order these items',
    correctOrder: ['First', 'Second', 'Third'],
    points: 15,
  },
];

const baseReward: RewardConfig = {
  message: 'Default reward!',
  funFact: 'Default fun fact',
};

function createTestLesson(ageVariants?: Partial<Record<AgeGroup, AgeVariant>>): CurriculumLesson {
  return {
    id: 'test-01',
    title: 'Test Lesson',
    description: 'A test lesson',
    category: 'aqeedah',
    difficulty: 'beginner',
    durationMinutes: 5,
    xpReward: 25,
    order: 1,
    unitId: 'test-unit',
    minAgeGroup: 'toddler',
    tags: ['test'],
    hook: baseHook,
    teach: baseTeach,
    practice: basePractice,
    reward: baseReward,
    ageVariants,
  };
}

// ── findBestVariant ────────────────────────────────────────────

describe('findBestVariant', () => {
  it('should return undefined when ageVariants is undefined', () => {
    expect(findBestVariant(undefined, 'early')).toBeUndefined();
  });

  it('should return undefined when ageVariants is empty', () => {
    expect(findBestVariant({}, 'early')).toBeUndefined();
  });

  it('should return exact match when available', () => {
    const variants: Partial<Record<AgeGroup, AgeVariant>> = {
      toddler: { hook: toddlerHook },
      preteen: { hook: preteenHook },
    };
    const result = findBestVariant(variants, 'toddler');
    expect(result).toBeDefined();
    expect(result!.matchedGroup).toBe('toddler');
    expect(result!.variant.hook).toBe(toddlerHook);
  });

  it('should fall back to closest younger group', () => {
    const variants: Partial<Record<AgeGroup, AgeVariant>> = {
      toddler: { hook: toddlerHook },
      preteen: { hook: preteenHook },
    };
    // early (5-7) should fall back to toddler (2-4)
    const result = findBestVariant(variants, 'early');
    expect(result).toBeDefined();
    expect(result!.matchedGroup).toBe('toddler');
  });

  it('should fall back to closest younger group (middle → toddler when no early)', () => {
    const variants: Partial<Record<AgeGroup, AgeVariant>> = {
      toddler: { hook: toddlerHook },
    };
    const result = findBestVariant(variants, 'middle');
    expect(result).toBeDefined();
    expect(result!.matchedGroup).toBe('toddler');
  });

  it('should fall forward to older group when no younger variants exist', () => {
    const variants: Partial<Record<AgeGroup, AgeVariant>> = {
      middle: { hook: preteenHook },
    };
    // toddler has no younger group to fall back to, should walk forward
    const result = findBestVariant(variants, 'toddler');
    expect(result).toBeDefined();
    expect(result!.matchedGroup).toBe('middle');
  });

  it('should prefer exact match over any fallback', () => {
    const earlyVariant: AgeVariant = { durationMinutes: 4 };
    const variants: Partial<Record<AgeGroup, AgeVariant>> = {
      toddler: { hook: toddlerHook },
      early: earlyVariant,
      preteen: { hook: preteenHook },
    };
    const result = findBestVariant(variants, 'early');
    expect(result).toBeDefined();
    expect(result!.matchedGroup).toBe('early');
    expect(result!.variant).toBe(earlyVariant);
  });
});

// ── resolveLesson ──────────────────────────────────────────────

describe('resolveLesson', () => {
  it('should return default content when no ageVariants defined', () => {
    const lesson = createTestLesson();
    const resolved = resolveLesson(lesson, 'early');

    expect(resolved.isVariantApplied).toBe(false);
    expect(resolved.resolvedAgeGroup).toBe('early');
    expect(resolved.hook).toBe(baseHook);
    expect(resolved.teach).toBe(baseTeach);
    expect(resolved.practice).toBe(basePractice);
    expect(resolved.reward).toBe(baseReward);
    expect(resolved.durationMinutes).toBe(5);
  });

  it('should return default content when ageVariants is empty', () => {
    const lesson = createTestLesson({});
    const resolved = resolveLesson(lesson, 'middle');

    expect(resolved.isVariantApplied).toBe(false);
    expect(resolved.hook).toBe(baseHook);
  });

  it('should apply toddler variant for toddler age group', () => {
    const lesson = createTestLesson({
      toddler: {
        hook: toddlerHook,
        teach: toddlerTeach,
        practice: toddlerPractice,
        durationMinutes: 3,
      },
    });
    const resolved = resolveLesson(lesson, 'toddler');

    expect(resolved.isVariantApplied).toBe(true);
    expect(resolved.resolvedAgeGroup).toBe('toddler');
    expect(resolved.hook).toBe(toddlerHook);
    expect(resolved.teach).toBe(toddlerTeach);
    expect(resolved.practice).toBe(toddlerPractice);
    expect(resolved.durationMinutes).toBe(3);
    // Reward was not overridden — should use base
    expect(resolved.reward).toBe(baseReward);
  });

  it('should only override specified fields in the variant', () => {
    const lesson = createTestLesson({
      middle: {
        hook: preteenHook, // only override hook
      },
    });
    const resolved = resolveLesson(lesson, 'middle');

    expect(resolved.isVariantApplied).toBe(true);
    expect(resolved.hook).toBe(preteenHook); // overridden
    expect(resolved.teach).toBe(baseTeach); // default
    expect(resolved.practice).toBe(basePractice); // default
    expect(resolved.reward).toBe(baseReward); // default
    expect(resolved.durationMinutes).toBe(5); // default
  });

  it('should preserve lesson metadata regardless of variant', () => {
    const lesson = createTestLesson({
      toddler: { hook: toddlerHook },
    });
    const resolved = resolveLesson(lesson, 'toddler');

    expect(resolved.id).toBe('test-01');
    expect(resolved.title).toBe('Test Lesson');
    expect(resolved.category).toBe('aqeedah');
    expect(resolved.xpReward).toBe(25);
    expect(resolved.unitId).toBe('test-unit');
    expect(resolved.tags).toEqual(['test']);
  });

  it('should fall back to younger variant when exact age group not found', () => {
    const lesson = createTestLesson({
      toddler: {
        hook: toddlerHook,
        practice: toddlerPractice,
      },
      preteen: {
        hook: preteenHook,
        practice: preteenPractice,
      },
    });
    // early (5-7) should get the toddler variant since it is the closest younger
    const resolved = resolveLesson(lesson, 'early');
    expect(resolved.isVariantApplied).toBe(true);
    expect(resolved.resolvedAgeGroup).toBe('toddler');
    expect(resolved.hook).toBe(toddlerHook);
    expect(resolved.practice).toBe(toddlerPractice);
  });

  it('toddler variant should have fewer practice items', () => {
    const lesson = createTestLesson({
      toddler: { practice: toddlerPractice },
      preteen: { practice: preteenPractice },
    });

    const toddlerResolved = resolveLesson(lesson, 'toddler');
    const preteenResolved = resolveLesson(lesson, 'preteen');

    expect(toddlerResolved.practice.length).toBeLessThanOrEqual(2);
    expect(preteenResolved.practice.length).toBeGreaterThanOrEqual(4);
  });
});

// ── resolveLessonForChild ──────────────────────────────────────

describe('resolveLessonForChild', () => {
  const currentYear = new Date().getFullYear();

  it('should resolve to toddler for a 3-year-old', () => {
    const lesson = createTestLesson({
      toddler: { hook: toddlerHook },
      preteen: { hook: preteenHook },
    });
    const resolved = resolveLessonForChild(lesson, currentYear - 3);
    expect(resolved.resolvedAgeGroup).toBe('toddler');
    expect(resolved.hook).toBe(toddlerHook);
  });

  it('should resolve to early for a 6-year-old (fallback to toddler if no early variant)', () => {
    const lesson = createTestLesson({
      toddler: { hook: toddlerHook },
    });
    const resolved = resolveLessonForChild(lesson, currentYear - 6);
    // Falls back to toddler since there is no early variant
    expect(resolved.resolvedAgeGroup).toBe('toddler');
    expect(resolved.hook).toBe(toddlerHook);
  });

  it('should resolve to preteen for a 12-year-old', () => {
    const lesson = createTestLesson({
      toddler: { hook: toddlerHook },
      preteen: { hook: preteenHook },
    });
    const resolved = resolveLessonForChild(lesson, currentYear - 12);
    expect(resolved.resolvedAgeGroup).toBe('preteen');
    expect(resolved.hook).toBe(preteenHook);
  });

  it('should handle no variants gracefully', () => {
    const lesson = createTestLesson();
    const resolved = resolveLessonForChild(lesson, currentYear - 8);
    expect(resolved.isVariantApplied).toBe(false);
    expect(resolved.hook).toBe(baseHook);
  });
});

// ── Integration with real curriculum data ──────────────────────

describe('Age-adaptive integration with aqeedah lessons', () => {
  it('first aqeedah lesson should have ageVariants defined', () => {
    const lesson = aqeedahLessons[0]!;
    expect(lesson.ageVariants).toBeDefined();
    expect(lesson.ageVariants!.toddler).toBeDefined();
    expect(lesson.ageVariants!.preteen).toBeDefined();
  });

  it('toddler variant should have simpler content', () => {
    const lesson = aqeedahLessons[0]!;
    const resolved = resolveLesson(lesson, 'toddler');

    expect(resolved.isVariantApplied).toBe(true);
    // Toddler should have fewer teach blocks
    expect(resolved.teach.length).toBeLessThanOrEqual(lesson.teach.length);
    // Toddler should have 1-2 practice items
    expect(resolved.practice.length).toBeLessThanOrEqual(2);
    // Shorter duration
    expect(resolved.durationMinutes).toBeLessThanOrEqual(lesson.durationMinutes);
  });

  it('preteen variant should have more advanced content', () => {
    const lesson = aqeedahLessons[0]!;
    const resolved = resolveLesson(lesson, 'preteen');

    expect(resolved.isVariantApplied).toBe(true);
    // Preteen should have 4-5 practice items
    expect(resolved.practice.length).toBeGreaterThanOrEqual(4);
    // Longer duration
    expect(resolved.durationMinutes).toBeGreaterThanOrEqual(lesson.durationMinutes);
  });

  it('early group should fall back gracefully (to default content when no variant)', () => {
    const lesson = aqeedahLessons[0]!;
    const resolved = resolveLesson(lesson, 'early');

    // early falls back to toddler variant
    expect(resolved.isVariantApplied).toBe(true);
    expect(resolved.resolvedAgeGroup).toBe('toddler');
  });

  it('middle group should use the middle variant', () => {
    const lesson = aqeedahLessons[0]!;
    const resolved = resolveLesson(lesson, 'middle');

    expect(resolved.isVariantApplied).toBe(true);
    expect(resolved.resolvedAgeGroup).toBe('middle');
    // Middle should have 3-4 practice items
    expect(resolved.practice.length).toBeGreaterThanOrEqual(3);
  });

  it('lessons without ageVariants should resolve to default content', () => {
    // Check a lesson that does not have ageVariants (e.g., second aqeedah lesson)
    const lesson = aqeedahLessons[1]!;
    if (!lesson.ageVariants) {
      const resolved = resolveLesson(lesson, 'preteen');
      expect(resolved.isVariantApplied).toBe(false);
      expect(resolved.hook).toBe(lesson.hook);
      expect(resolved.teach).toBe(lesson.teach);
      expect(resolved.practice).toBe(lesson.practice);
    }
  });
});
