/**
 * Curriculum Index
 *
 * Central registry of all curriculum units and their lessons.
 * Import all unit files here. The app loads curriculum from this barrel.
 */

import type { CurriculumLesson, CurriculumUnit, CurriculumIndex } from '../../types/curriculum';
import { wuduUnit, wuduLessons } from './wudu';
import { aqeedahUnit, aqeedahLessons } from './aqeedah';
import { salahUnit, salahLessons } from './salah';
import { quranUnit, quranLessons } from './quran';

// ── Aggregate all units ────────────────────────────────────────

export const allUnits: CurriculumUnit[] = [aqeedahUnit, wuduUnit, salahUnit, quranUnit];

export const allCurriculumLessons: CurriculumLesson[] = [
  ...aqeedahLessons,
  ...wuduLessons,
  ...salahLessons,
  ...quranLessons,
];

/** Lookup a lesson by ID in O(1) */
const lessonMap = new Map<string, CurriculumLesson>();
for (const lesson of allCurriculumLessons) {
  lessonMap.set(lesson.id, lesson);
}

export function getCurriculumLesson(id: string): CurriculumLesson | undefined {
  return lessonMap.get(id);
}

/** Get all lessons for a given unit */
export function getLessonsForUnit(unitId: string): CurriculumLesson[] {
  return allCurriculumLessons.filter((l) => l.unitId === unitId);
}

/** Curriculum version index */
export const curriculumIndex: CurriculumIndex = {
  version: 1,
  lastUpdated: '2025-01-01',
  units: allUnits,
};

// Re-export unit data
export {
  wuduUnit,
  wuduLessons,
  aqeedahUnit,
  aqeedahLessons,
  salahUnit,
  salahLessons,
  quranUnit,
  quranLessons,
};
