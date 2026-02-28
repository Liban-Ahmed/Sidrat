/**
 * Curriculum Index
 *
 * Central registry of all curriculum units and their lessons.
 * Import all unit files here. The app loads curriculum from this barrel.
 */

import { adabUnit, adabLessons } from './adab';
import { aqeedahUnit, aqeedahLessons } from './aqeedah';
import { duaaUnit, duaaLessons } from './duaa';
import { quranUnit, quranLessons } from './quran';
import { salahUnit, salahLessons } from './salah';
import { seerahUnit, seerahLessons } from './seerah';
import { storiesUnit, storiesLessons } from './stories';
import { wuduUnit, wuduLessons } from './wudu';
import type { CurriculumLesson, CurriculumUnit, CurriculumIndex } from '../../types/curriculum';

// ── Aggregate all units ────────────────────────────────────────

export const allUnits: CurriculumUnit[] = [
  aqeedahUnit,
  wuduUnit,
  salahUnit,
  quranUnit,
  seerahUnit,
  adabUnit,
  duaaUnit,
  storiesUnit,
];

export const allCurriculumLessons: CurriculumLesson[] = [
  ...aqeedahLessons,
  ...wuduLessons,
  ...salahLessons,
  ...quranLessons,
  ...seerahLessons,
  ...adabLessons,
  ...duaaLessons,
  ...storiesLessons,
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
  seerahUnit,
  seerahLessons,
  adabUnit,
  adabLessons,
  duaaUnit,
  duaaLessons,
  storiesUnit,
  storiesLessons,
};
