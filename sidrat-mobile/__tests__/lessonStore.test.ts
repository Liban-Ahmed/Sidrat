/**
 * Lesson Store integration tests.
 *
 * Validates the core lesson player flow:
 * phase completion, lesson completion, review scheduling,
 * and progress queries.
 */

jest.mock('../src/services/localDatabase', () => ({
    queueSync: jest.fn().mockResolvedValue(undefined),
    getDatabase: jest.fn(),
    closeDatabase: jest.fn(),
    getPendingSyncOps: jest.fn().mockResolvedValue([]),
    removeSyncOp: jest.fn(),
    incrementSyncRetry: jest.fn(),
    purgeDeadLetterOps: jest.fn().mockResolvedValue(0),
    getSyncMeta: jest.fn().mockResolvedValue(null),
    setSyncMeta: jest.fn(),
    mergeRemoteProgress: jest.fn().mockResolvedValue(false),
    getLocalChildIds: jest.fn().mockResolvedValue([]),
}));

import { useLessonStore } from '../src/stores/lessonStore';
import { allCurriculumLessons } from '../src/data/curriculum';

// Reset store before each test
beforeEach(() => {
    useLessonStore.setState({ progress: {} });
});

const CHILD_ID = 'test-child-1';
const LESSON = allCurriculumLessons[0]!;

describe('LessonStore — Phase Completion', () => {
    it('should create progress entry on first phase complete', () => {
        const { markPhaseComplete, getProgress } = useLessonStore.getState();

        markPhaseComplete(CHILD_ID, LESSON.id, 'hook');

        const progress = getProgress(CHILD_ID, LESSON.id);
        expect(progress).toBeDefined();
        expect(progress!.lessonId).toBe(LESSON.id);
        expect(progress!.childId).toBe(CHILD_ID);
        expect(progress!.lastCompletedPhase).toBe('hook');
        expect(progress!.isCompleted).toBe(false);
        expect(progress!.attempts).toBe(1);
    });

    it('should track phase progress timestamps', () => {
        const { markPhaseComplete, getProgress } = useLessonStore.getState();

        markPhaseComplete(CHILD_ID, LESSON.id, 'hook');
        markPhaseComplete(CHILD_ID, LESSON.id, 'teach');
        markPhaseComplete(CHILD_ID, LESSON.id, 'practice');

        const progress = getProgress(CHILD_ID, LESSON.id);
        expect(progress!.phaseProgress).toBeDefined();
        expect(progress!.phaseProgress!.hook).toBeTruthy();
        expect(progress!.phaseProgress!.teach).toBeTruthy();
        expect(progress!.phaseProgress!.practice).toBeTruthy();
        expect(progress!.lastCompletedPhase).toBe('practice');
    });

    it('should only increment attempts on hook phase', () => {
        const { markPhaseComplete, getProgress } = useLessonStore.getState();

        markPhaseComplete(CHILD_ID, LESSON.id, 'hook');
        markPhaseComplete(CHILD_ID, LESSON.id, 'teach');
        markPhaseComplete(CHILD_ID, LESSON.id, 'practice');

        const progress = getProgress(CHILD_ID, LESSON.id);
        expect(progress!.attempts).toBe(1);
    });
});

describe('LessonStore — Lesson Completion', () => {
    it('should mark lesson as completed with score and XP', () => {
        const { markPhaseComplete, completeLesson, getProgress } = useLessonStore.getState();

        markPhaseComplete(CHILD_ID, LESSON.id, 'hook');
        completeLesson(CHILD_ID, LESSON.id, 95, 20);

        const progress = getProgress(CHILD_ID, LESSON.id);
        expect(progress!.isCompleted).toBe(true);
        expect(progress!.score).toBe(95);
        expect(progress!.xpEarned).toBe(20);
        expect(progress!.completedAt).toBeTruthy();
        expect(progress!.lastCompletedPhase).toBe('reward');
    });

    it('should schedule first review on completion', () => {
        const { completeLesson, getProgress } = useLessonStore.getState();

        completeLesson(CHILD_ID, LESSON.id, 90, 20);

        const progress = getProgress(CHILD_ID, LESSON.id);
        expect(progress!.nextReviewDate).toBeTruthy();
        expect(progress!.intervalIndex).toBeDefined();
    });

    it('should increment completed count', () => {
        const { completeLesson, getCompletedCount } = useLessonStore.getState();

        expect(getCompletedCount(CHILD_ID)).toBe(0);
        completeLesson(CHILD_ID, LESSON.id, 90, 20);
        expect(useLessonStore.getState().getCompletedCount(CHILD_ID)).toBe(1);
    });
});

describe('LessonStore — Review', () => {
    it('should update review schedule on completeReview', () => {
        const { completeLesson } = useLessonStore.getState();

        completeLesson(CHILD_ID, LESSON.id, 90, 20);
        const afterComplete = useLessonStore.getState().getProgress(CHILD_ID, LESSON.id);
        const firstReviewDate = afterComplete!.nextReviewDate;

        useLessonStore.getState().completeReview(CHILD_ID, LESSON.id, 85);

        const afterReview = useLessonStore.getState().getProgress(CHILD_ID, LESSON.id);
        expect(afterReview!.reviewCount).toBe(1);
        expect(afterReview!.lastReviewedAt).toBeTruthy();
        expect(afterReview!.nextReviewDate).not.toBe(firstReviewDate);
    });

    it('should not review a lesson that has no prior progress', () => {
        const store = useLessonStore.getState();

        store.completeReview(CHILD_ID, 'nonexistent', 90);

        const progress = store.getProgress(CHILD_ID, 'nonexistent');
        expect(progress).toBeUndefined();
    });

    it('should keep the higher score on review', () => {
        const { completeLesson } = useLessonStore.getState();

        completeLesson(CHILD_ID, LESSON.id, 95, 20);
        useLessonStore.getState().completeReview(CHILD_ID, LESSON.id, 80);

        const progress = useLessonStore.getState().getProgress(CHILD_ID, LESSON.id);
        expect(progress!.score).toBe(95);
    });
});

describe('LessonStore — Queries', () => {
    it('getTodayLesson should return first incomplete curriculum lesson', () => {
        const lesson = useLessonStore.getState().getTodayLesson(CHILD_ID);
        expect(lesson).toBeDefined();
        expect(lesson!.id).toBe(allCurriculumLessons[0]!.id);
    });

    it('getTodayLesson should skip completed lessons', () => {
        useLessonStore.getState().completeLesson(CHILD_ID, allCurriculumLessons[0]!.id, 90, 20);

        const lesson = useLessonStore.getState().getTodayLesson(CHILD_ID);
        expect(lesson).toBeDefined();
        expect(lesson!.id).toBe(allCurriculumLessons[1]!.id);
    });

    it('getCompletedByCategory should count correctly', () => {
        const aqeedahLessons = allCurriculumLessons.filter((l) => l.category === 'aqeedah');
        for (const l of aqeedahLessons) {
            useLessonStore.getState().completeLesson(CHILD_ID, l.id, 90, 20);
        }

        const counts = useLessonStore.getState().getCompletedByCategory(CHILD_ID);
        expect(counts.aqeedah).toBe(aqeedahLessons.length);
        expect(counts.salah).toBe(0);
    });

    it('should isolate progress between children', () => {
        useLessonStore.getState().completeLesson('child-a', LESSON.id, 90, 20);

        expect(useLessonStore.getState().getCompletedCount('child-a')).toBe(1);
        expect(useLessonStore.getState().getCompletedCount('child-b')).toBe(0);
    });
});
