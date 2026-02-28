/**
 * Curriculum data integrity tests.
 *
 * Validates structural correctness of all bundled curriculum content.
 */

import {
  allUnits,
  allCurriculumLessons,
  getCurriculumLesson,
  getLessonsForUnit,
  curriculumIndex,
} from '../src/data/curriculum';
import { LESSON_CATEGORIES } from '../src/types/models';
import type { PracticeBlock } from '../src/types/curriculum';

// ── Unit Integrity ─────────────────────────────────────────────

describe('Curriculum Units', () => {
  it('should have at least 2 units', () => {
    expect(allUnits.length).toBeGreaterThanOrEqual(2);
  });

  it('every unit should have a valid id and title', () => {
    for (const unit of allUnits) {
      expect(unit.id).toBeTruthy();
      expect(unit.title).toBeTruthy();
      expect(unit.description).toBeTruthy();
    }
  });

  it('every unit should have a valid category', () => {
    for (const unit of allUnits) {
      expect(LESSON_CATEGORIES).toContain(unit.category);
    }
  });

  it('unit ids should be unique', () => {
    const ids = allUnits.map((u) => u.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('every unit should list lesson IDs that actually exist', () => {
    for (const unit of allUnits) {
      expect(unit.lessonIds.length).toBeGreaterThan(0);
      for (const lid of unit.lessonIds) {
        const lesson = getCurriculumLesson(lid);
        expect(lesson).toBeDefined();
        expect(lesson!.unitId).toBe(unit.id);
      }
    }
  });
});

// ── Lesson Integrity ───────────────────────────────────────────

describe('Curriculum Lessons', () => {
  it('should have at least 5 lessons total', () => {
    expect(allCurriculumLessons.length).toBeGreaterThanOrEqual(5);
  });

  it('lesson ids should be globally unique', () => {
    const ids = allCurriculumLessons.map((l) => l.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('every lesson should belong to an existing unit', () => {
    const unitIds = new Set(allUnits.map((u) => u.id));
    for (const lesson of allCurriculumLessons) {
      expect(unitIds.has(lesson.unitId)).toBe(true);
    }
  });

  it('every lesson should have positive XP and duration', () => {
    for (const lesson of allCurriculumLessons) {
      expect(lesson.xpReward).toBeGreaterThan(0);
      expect(lesson.durationMinutes).toBeGreaterThan(0);
    }
  });

  it('every lesson should have a valid category', () => {
    for (const lesson of allCurriculumLessons) {
      expect(LESSON_CATEGORIES).toContain(lesson.category);
    }
  });

  it('lesson order should be sequential within each unit', () => {
    for (const unit of allUnits) {
      const lessons = getLessonsForUnit(unit.id);
      const orders = lessons.map((l) => l.order).sort((a, b) => a - b);
      for (let i = 0; i < orders.length; i++) {
        expect(orders[i]).toBe(i + 1);
      }
    }
  });
});

// ── 4-Phase Structure ──────────────────────────────────────────

describe('Lesson 4-Phase Structure', () => {
  it('every lesson should have a hook with narration text', () => {
    for (const lesson of allCurriculumLessons) {
      expect(lesson.hook).toBeDefined();
      expect(lesson.hook.narration).toBeTruthy();
      expect(lesson.hook.narration.length).toBeGreaterThan(10);
    }
  });

  it('every lesson should have at least 1 teach block', () => {
    for (const lesson of allCurriculumLessons) {
      expect(lesson.teach.length).toBeGreaterThan(0);
      for (const block of lesson.teach) {
        expect(block.narration).toBeTruthy();
      }
    }
  });

  it('every lesson should have at least 1 practice block', () => {
    for (const lesson of allCurriculumLessons) {
      expect(lesson.practice.length).toBeGreaterThan(0);
    }
  });

  it('every lesson should have reward config', () => {
    for (const lesson of allCurriculumLessons) {
      expect(lesson.reward).toBeDefined();
      expect(lesson.reward.message).toBeTruthy();
    }
  });
});

// ── Practice Block Validation ──────────────────────────────────

const VALID_PRACTICE_TYPES = [
  'quiz',
  'matching',
  'ordering',
  'fill-blank',
  'true-false',
  'tap-word',
] as const;

describe('Practice Blocks', () => {
  const allPracticeBlocks: PracticeBlock[] = allCurriculumLessons.flatMap((l) => l.practice);

  it('every practice block should have a valid type', () => {
    for (const block of allPracticeBlocks) {
      expect(VALID_PRACTICE_TYPES).toContain(block.type);
    }
  });

  it('quiz blocks should have at least 2 options and a valid correctIndex', () => {
    const quizBlocks = allPracticeBlocks.filter((b) => b.type === 'quiz');
    for (const block of quizBlocks) {
      if (block.type !== 'quiz') continue;
      expect(block.options.length).toBeGreaterThanOrEqual(2);
      expect(block.correctIndex).toBeGreaterThanOrEqual(0);
      expect(block.correctIndex).toBeLessThan(block.options.length);
    }
  });

  it('ordering blocks should have at least 2 items', () => {
    const orderingBlocks = allPracticeBlocks.filter((b) => b.type === 'ordering');
    for (const block of orderingBlocks) {
      if (block.type !== 'ordering') continue;
      expect(block.correctOrder.length).toBeGreaterThanOrEqual(2);
    }
  });

  it('matching blocks should have matching pairs', () => {
    const matchingBlocks = allPracticeBlocks.filter((b) => b.type === 'matching');
    for (const block of matchingBlocks) {
      if (block.type !== 'matching') continue;
      expect(block.pairs.length).toBeGreaterThanOrEqual(2);
      for (const pair of block.pairs) {
        expect(pair.left).toBeTruthy();
        expect(pair.right).toBeTruthy();
      }
    }
  });

  it('true-false blocks should have a boolean answer', () => {
    const tfBlocks = allPracticeBlocks.filter((b) => b.type === 'true-false');
    for (const block of tfBlocks) {
      if (block.type !== 'true-false') continue;
      expect(typeof block.correctAnswer).toBe('boolean');
    }
  });

  it('fill-blank blocks should have accepted answers', () => {
    const fbBlocks = allPracticeBlocks.filter((b) => b.type === 'fill-blank');
    for (const block of fbBlocks) {
      if (block.type !== 'fill-blank') continue;
      expect(block.acceptedAnswers.length).toBeGreaterThan(0);
      expect(block.sentence).toContain('___');
    }
  });

  it('every practice block should have positive points', () => {
    for (const block of allPracticeBlocks) {
      expect(block.points).toBeGreaterThan(0);
    }
  });
});

// ── Lookup Functions ───────────────────────────────────────────

describe('Curriculum Lookup Functions', () => {
  it('getCurriculumLesson should return correct lesson', () => {
    const firstLesson = allCurriculumLessons[0];
    if (!firstLesson) return;
    const found = getCurriculumLesson(firstLesson.id);
    expect(found).toBeDefined();
    expect(found!.id).toBe(firstLesson.id);
    expect(found!.title).toBe(firstLesson.title);
  });

  it('getCurriculumLesson should return undefined for non-existent ID', () => {
    expect(getCurriculumLesson('non-existent-id')).toBeUndefined();
  });

  it('getLessonsForUnit should return lessons in correct order', () => {
    for (const unit of allUnits) {
      const lessons = getLessonsForUnit(unit.id);
      expect(lessons.length).toBe(unit.lessonIds.length);
      for (let i = 1; i < lessons.length; i++) {
        expect(lessons[i]!.order).toBeGreaterThanOrEqual(lessons[i - 1]!.order);
      }
    }
  });

  it('curriculumIndex should have correct version and units', () => {
    expect(curriculumIndex.version).toBeGreaterThanOrEqual(1);
    expect(curriculumIndex.units.length).toBe(allUnits.length);
    expect(curriculumIndex.lastUpdated).toBeTruthy();
  });
});
