/**
 * useLessonPlayer — Core lesson engine hook.
 *
 * Manages the 4-phase flow: Hook → Teach → Practice → Reward.
 * Handles scoring, phase transitions, narration triggers,
 * and progress persistence.
 */

import { useState, useCallback, useMemo, useRef } from 'react';
import { audioService } from '../services/audioService';
import { useLessonStore, useChildStore } from '../stores';
import haptic from '../utils/haptics';
import type { ResolvedLesson } from '../services/ageAdaptiveService';
import type {
  CurriculumLesson,
  LessonPlayerPhase,
  LessonPlayerState,
  PracticeBlock,
} from '../types/curriculum';

/** The hook accepts either a raw CurriculumLesson or a resolved (age-adapted) one */
type LessonInput = CurriculumLesson | ResolvedLesson;

interface UseLessonPlayerOptions {
  lesson: LessonInput;
  childId: string;
  /** If true, skips Hook phase and starts directly at Practice */
  isReview?: boolean;
}

interface UseLessonPlayerReturn {
  state: LessonPlayerState;
  /** Current phase */
  phase: LessonPlayerPhase;
  /** Current teach block (if in teach phase) */
  currentTeachBlock: CurriculumLesson['teach'][number] | null;
  /** Current practice block (if in practice phase) */
  currentPracticeBlock: PracticeBlock | null;
  /** Total teach blocks */
  totalTeachBlocks: number;
  /** Total practice blocks */
  totalPracticeBlocks: number;
  /** Progress through current phase (0-1) */
  phaseProgress: number;
  /** Overall progress through the lesson (0-1) */
  overallProgress: number;
  /** Whether this is the last teach block */
  isLastTeachBlock: boolean;
  /** Whether this is the last practice block */
  isLastPracticeBlock: boolean;
  /** Score as percentage (0-100) */
  scorePercent: number;

  // Actions
  /** Start or restart the lesson */
  start: () => void;
  /** Move from hook to teach */
  startTeaching: () => void;
  /** Advance to next teach block or to practice phase */
  nextTeachBlock: () => void;
  /** Submit an answer for the current practice block */
  submitAnswer: (isCorrect: boolean, pointsEarned: number) => void;
  /** Skip to reward (e.g., after all practice done) */
  finishPractice: () => void;
  /** Complete the lesson and persist progress */
  completeLesson: () => void;
  /** Narrate text using TTS */
  narrate: (text: string) => Promise<void>;
  /** Stop narration */
  stopNarration: () => void;
}

function createInitialState(
  lessonId: string,
  childId: string,
  lesson: LessonInput,
  isReview: boolean,
): LessonPlayerState {
  const maxScore = lesson.practice.reduce((sum, p) => sum + p.points, 0);
  return {
    lessonId,
    childId,
    // Review mode → skip hook and teach, start at practice
    currentPhase: isReview ? 'practice' : 'hook',
    teachIndex: 0,
    practiceIndex: 0,
    score: 0,
    maxScore,
    correctCount: 0,
    answeredCount: 0,
    startedAt: new Date().toISOString(),
    isNarrating: false,
    isReview,
  };
}

export function useLessonPlayer({
  lesson,
  childId,
  isReview = false,
}: UseLessonPlayerOptions): UseLessonPlayerReturn {
  const [state, setState] = useState<LessonPlayerState>(() =>
    createInitialState(lesson.id, childId, lesson, isReview),
  );

  const markPhaseComplete = useLessonStore((s) => s.markPhaseComplete);
  const completeLessonInStore = useLessonStore((s) => s.completeLesson);
  const completeReviewInStore = useLessonStore((s) => s.completeReview);
  const recordLessonCompletion = useChildStore((s) => s.recordLessonCompletion);

  const narrationRef = useRef(false);

  // ── Derived values ──

  const currentTeachBlock = useMemo(() => {
    if (state.currentPhase !== 'teach') return null;
    return lesson.teach[state.teachIndex] ?? null;
  }, [state.currentPhase, state.teachIndex, lesson.teach]);

  const currentPracticeBlock = useMemo(() => {
    if (state.currentPhase !== 'practice') return null;
    return lesson.practice[state.practiceIndex] ?? null;
  }, [state.currentPhase, state.practiceIndex, lesson.practice]);

  const totalTeachBlocks = lesson.teach.length;
  const totalPracticeBlocks = lesson.practice.length;

  const isLastTeachBlock = state.teachIndex >= totalTeachBlocks - 1;
  const isLastPracticeBlock = state.practiceIndex >= totalPracticeBlocks - 1;

  const phaseProgress = useMemo(() => {
    switch (state.currentPhase) {
      case 'hook':
        return 0;
      case 'teach':
        return totalTeachBlocks > 0 ? state.teachIndex / totalTeachBlocks : 0;
      case 'practice':
        return totalPracticeBlocks > 0 ? state.practiceIndex / totalPracticeBlocks : 0;
      case 'reward':
        return 1;
      default:
        return 0;
    }
  }, [
    state.currentPhase,
    state.teachIndex,
    state.practiceIndex,
    totalTeachBlocks,
    totalPracticeBlocks,
  ]);

  const overallProgress = useMemo(() => {
    const phases: LessonPlayerPhase[] = ['hook', 'teach', 'practice', 'reward'];
    const currentIdx = phases.indexOf(state.currentPhase);
    const base = currentIdx / phases.length;
    const phaseContribution = phaseProgress / phases.length;
    return base + phaseContribution;
  }, [state.currentPhase, phaseProgress]);

  const scorePercent = state.maxScore > 0 ? Math.round((state.score / state.maxScore) * 100) : 0;

  // ── Actions ──

  const start = useCallback(() => {
    setState(createInitialState(lesson.id, childId, lesson, isReview));
    markPhaseComplete(childId, lesson.id, isReview ? 'practice' : 'hook');
  }, [lesson, childId, isReview, markPhaseComplete]);

  const startTeaching = useCallback(() => {
    audioService.stop();
    setState((s) => ({ ...s, currentPhase: 'teach', teachIndex: 0 }));
    markPhaseComplete(childId, lesson.id, 'teach');
    haptic.light();
  }, [childId, lesson.id, markPhaseComplete]);

  const nextTeachBlock = useCallback(() => {
    audioService.stop();
    const movingToPractice = state.teachIndex >= totalTeachBlocks - 1;
    if (movingToPractice) {
      setState((s) => ({ ...s, currentPhase: 'practice' as const, practiceIndex: 0 }));
      // Defer store update to avoid setState-during-render
      setTimeout(() => markPhaseComplete(childId, lesson.id, 'practice'), 0);
    } else {
      setState((s) => ({ ...s, teachIndex: s.teachIndex + 1 }));
    }
    haptic.light();
  }, [totalTeachBlocks, state.teachIndex, childId, lesson.id, markPhaseComplete]);

  const submitAnswer = useCallback(
    (isCorrect: boolean, pointsEarned: number) => {
      const isLast = state.practiceIndex >= totalPracticeBlocks - 1;

      setState((s) => {
        const newState = {
          ...s,
          score: s.score + pointsEarned,
          correctCount: s.correctCount + (isCorrect ? 1 : 0),
          answeredCount: s.answeredCount + 1,
        };

        if (isLast) {
          return { ...newState, currentPhase: 'reward' as const };
        }
        return { ...newState, practiceIndex: s.practiceIndex + 1 };
      });

      // Defer store update to avoid setState-during-render
      if (isLast) {
        setTimeout(() => markPhaseComplete(childId, lesson.id, 'reward'), 0);
      }

      if (isCorrect) {
        haptic.success();
      } else {
        haptic.error();
      }
    },
    [totalPracticeBlocks, state.practiceIndex, childId, lesson.id, markPhaseComplete],
  );

  const finishPractice = useCallback(() => {
    audioService.stop();
    setState((s) => ({ ...s, currentPhase: 'reward' }));
    markPhaseComplete(childId, lesson.id, 'reward');
    haptic.success();
  }, [childId, lesson.id, markPhaseComplete]);

  const completeLesson = useCallback(() => {
    if (isReview) {
      // Review mode: update review schedule, don't re-award XP
      completeReviewInStore(childId, lesson.id, scorePercent);
    } else {
      // Normal mode: full completion with XP
      completeLessonInStore(childId, lesson.id, scorePercent, lesson.xpReward);
      recordLessonCompletion(childId, lesson.xpReward);
    }
    haptic.success();
  }, [
    childId,
    lesson.id,
    scorePercent,
    lesson.xpReward,
    isReview,
    completeLessonInStore,
    completeReviewInStore,
    recordLessonCompletion,
  ]);

  const narrate = useCallback(async (text: string) => {
    if (narrationRef.current) {
      audioService.stop();
    }
    narrationRef.current = true;
    setState((s) => ({ ...s, isNarrating: true }));
    try {
      await audioService.speak(text);
    } finally {
      narrationRef.current = false;
      setState((s) => ({ ...s, isNarrating: false }));
    }
  }, []);

  const stopNarration = useCallback(() => {
    audioService.stop();
    narrationRef.current = false;
    setState((s) => ({ ...s, isNarrating: false }));
  }, []);

  return {
    state,
    phase: state.currentPhase,
    currentTeachBlock,
    currentPracticeBlock,
    totalTeachBlocks,
    totalPracticeBlocks,
    phaseProgress,
    overallProgress,
    isLastTeachBlock,
    isLastPracticeBlock,
    scorePercent,
    start,
    startTeaching,
    nextTeachBlock,
    submitAnswer,
    finishPractice,
    completeLesson,
    narrate,
    stopNarration,
  };
}
