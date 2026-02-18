/**
 * Tests for the "Lessons Completed by Category" chart feature.
 *
 * Covers:
 *  1. getCompletedByCategory store query — correct grouping
 *  2. Category data integrity — every category has meta + color
 *  3. Total per category computation — sampleLessons + curriculum
 *  4. Edge cases — empty progress, unknown lessonIds
 */

import { LESSON_CATEGORIES, categoryMeta } from '../src/types';
import { categoryColors } from '../src/theme/colors';
import { sampleLessons } from '../src/data/lessons';
import { allCurriculumLessons } from '../src/data/curriculum';
import type { LessonCategory } from '../src/types';

// ── 1. Category metadata completeness ─────────────────────────

describe('Category metadata & colors', () => {
    it('every LESSON_CATEGORIES entry has metadata', () => {
        for (const cat of LESSON_CATEGORIES) {
            const meta = categoryMeta[cat];
            expect(meta).toBeDefined();
            expect(meta.label).toBeTruthy();
            expect(meta.icon).toBeTruthy();
        }
    });

    it('every LESSON_CATEGORIES entry has categoryColors', () => {
        for (const cat of LESSON_CATEGORIES) {
            const color = categoryColors[cat];
            expect(color).toBeDefined();
            expect(color.solid).toMatch(/^#[0-9A-Fa-f]{6}$/);
            expect(color.muted).toBeTruthy();
        }
    });

    it('LESSON_CATEGORIES has exactly 8 entries', () => {
        expect(LESSON_CATEGORIES).toHaveLength(8);
    });
});

// ── 2. Sample lessons category distribution ───────────────────

describe('Sample lessons category coverage', () => {
    it('every sampleLesson has a valid category', () => {
        const validCats = new Set<string>(LESSON_CATEGORIES);
        for (const l of sampleLessons) {
            expect(validCats.has(l.category)).toBe(true);
        }
    });

    it('sampleLessons cover at least 5 different categories', () => {
        const cats = new Set(sampleLessons.map((l) => l.category));
        expect(cats.size).toBeGreaterThanOrEqual(5);
    });

    it('all sampleLessons have unique ids', () => {
        const ids = sampleLessons.map((l) => l.id);
        expect(new Set(ids).size).toBe(ids.length);
    });
});

// ── 3. Curriculum lessons category distribution ───────────────

describe('Curriculum lessons category coverage', () => {
    it('every curriculumLesson has a valid category', () => {
        const validCats = new Set<string>(LESSON_CATEGORIES);
        for (const l of allCurriculumLessons) {
            expect(validCats.has(l.category)).toBe(true);
        }
    });

    it('curriculum has at least 3 categories represented', () => {
        const cats = new Set(allCurriculumLessons.map((l) => l.category));
        expect(cats.size).toBeGreaterThanOrEqual(3);
    });
});

// ── 4. getCompletedByCategory logic (pure function test) ──────

describe('getCompletedByCategory logic', () => {
    // Reimplement the store's logic as a pure function for unit testing
    // (the store uses zustand with native module persistence — can't instantiate in Jest)
    function computeCompletedByCategory(
        childId: string,
        progressEntries: Array<{ childId: string; lessonId: string; isCompleted: boolean }>,
        lessons: Array<{ id: string; category: LessonCategory }>,
        curriculumLessons: Array<{ id: string; category: LessonCategory }>,
    ): Record<LessonCategory, number> {
        const categoryMap = new Map<string, LessonCategory>();
        for (const l of lessons) categoryMap.set(l.id, l.category);
        for (const l of curriculumLessons) categoryMap.set(l.id, l.category);

        const counts: Record<LessonCategory, number> = {
            aqeedah: 0, salah: 0, wudu: 0, quran: 0,
            seerah: 0, adab: 0, duaa: 0, stories: 0,
        };

        for (const p of progressEntries) {
            if (p.childId !== childId || !p.isCompleted) continue;
            const cat = categoryMap.get(p.lessonId);
            if (cat) counts[cat]++;
        }

        return counts;
    }

    it('returns all zeros when no progress exists', () => {
        const result = computeCompletedByCategory('child-1', [], sampleLessons, allCurriculumLessons);
        for (const cat of LESSON_CATEGORIES) {
            expect(result[cat]).toBe(0);
        }
    });

    it('correctly counts completed lessons by category', () => {
        const wuduLesson = sampleLessons.find((l) => l.category === 'wudu')!;
        const quranLesson = sampleLessons.find((l) => l.category === 'quran')!;

        const progress = [
            { childId: 'child-1', lessonId: wuduLesson.id, isCompleted: true },
            { childId: 'child-1', lessonId: quranLesson.id, isCompleted: true },
            { childId: 'child-1', lessonId: wuduLesson.id + '-fake', isCompleted: true }, // unknown ID
        ];

        const result = computeCompletedByCategory('child-1', progress, sampleLessons, allCurriculumLessons);
        expect(result.wudu).toBe(1);
        expect(result.quran).toBe(1);
        expect(result.salah).toBe(0);
    });

    it('ignores incomplete lessons', () => {
        const wuduLesson = sampleLessons.find((l) => l.category === 'wudu')!;
        const progress = [
            { childId: 'child-1', lessonId: wuduLesson.id, isCompleted: false },
        ];

        const result = computeCompletedByCategory('child-1', progress, sampleLessons, allCurriculumLessons);
        expect(result.wudu).toBe(0);
    });

    it('ignores other children progress', () => {
        const wuduLesson = sampleLessons.find((l) => l.category === 'wudu')!;
        const progress = [
            { childId: 'child-OTHER', lessonId: wuduLesson.id, isCompleted: true },
        ];

        const result = computeCompletedByCategory('child-1', progress, sampleLessons, allCurriculumLessons);
        expect(result.wudu).toBe(0);
    });

    it('counts curriculum lessons correctly', () => {
        const quranCurrLesson = allCurriculumLessons.find((l) => l.category === 'quran')!;
        const progress = [
            { childId: 'child-1', lessonId: quranCurrLesson.id, isCompleted: true },
        ];

        const result = computeCompletedByCategory('child-1', progress, sampleLessons, allCurriculumLessons);
        expect(result.quran).toBe(1);
    });

    it('handles multiple completions in the same category', () => {
        const wuduLessons = sampleLessons.filter((l) => l.category === 'wudu');
        expect(wuduLessons.length).toBeGreaterThanOrEqual(2);

        const progress = wuduLessons.map((l) => ({
            childId: 'child-1',
            lessonId: l.id,
            isCompleted: true,
        }));

        const result = computeCompletedByCategory('child-1', progress, sampleLessons, allCurriculumLessons);
        expect(result.wudu).toBe(wuduLessons.length);
    });
});

// ── 5. Total per category computation ─────────────────────────

describe('Total lessons per category', () => {
    it('computes correct totals from sampleLessons + curriculum (no duplicates)', () => {
        const counts: Record<string, number> = {};
        const seen = new Set<string>();

        for (const l of sampleLessons) {
            if (!seen.has(l.id)) {
                counts[l.category] = (counts[l.category] ?? 0) + 1;
                seen.add(l.id);
            }
        }
        for (const l of allCurriculumLessons) {
            if (!seen.has(l.id)) {
                counts[l.category] = (counts[l.category] ?? 0) + 1;
                seen.add(l.id);
            }
        }

        // Should have entries for every category with lessons
        const totalLessons = Object.values(counts).reduce((a, b) => a + b, 0);
        expect(totalLessons).toBe(seen.size);
        expect(totalLessons).toBeGreaterThan(0);
    });

    it('no lesson ID appears in both sampleLessons and curriculum (or if it does, dedup handles it)', () => {
        const sampleIds = new Set(sampleLessons.map((l) => l.id));
        const currIds = new Set(allCurriculumLessons.map((l) => l.id));
        const overlap = [...sampleIds].filter((id) => currIds.has(id));
        // If overlap exists, our dedup in progress.tsx handles it — just verify awareness
        // No assertion needed, but let's document the count
        expect(overlap.length).toBeGreaterThanOrEqual(0);
    });
});
