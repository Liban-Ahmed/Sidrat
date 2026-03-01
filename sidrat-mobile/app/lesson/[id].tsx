/**
 * Lesson Player Screen -- 4-phase flow: Hook -> Teach -> Practice -> Reward.
 * Threads category accent color through all phases for visual identity.
 */

import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import React, { useCallback, useMemo, useState } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  HookPhase,
  TeachPhase,
  PracticePhase,
  RewardPhase,
  PhaseTransition,
  ThinkingCountdown,
} from '../../src/components/lesson';
import { getCurriculumLesson } from '../../src/data/curriculum';
import { useLessonPlayer } from '../../src/hooks/useLessonPlayer';
import { resolveLessonForChild } from '../../src/services/ageAdaptiveService';
import { useAppStore, useChildStore } from '../../src/stores';
import { useTheme } from '../../src/theme';
import { categoryMeta } from '../../src/types';
import type { ResolvedLesson } from '../../src/services/ageAdaptiveService';

export default function LessonScreen() {
  const { brand, colors, typography } = useTheme();
  const router = useRouter();
  const { id, review } = useLocalSearchParams<{ id: string; review?: string }>();
  const activeChildId = useAppStore((s) => s.activeChildId);
  const getChild = useChildStore((s) => s.getChild);
  const isReview = review === '1';

  const lesson = id ? getCurriculumLesson(id) : undefined;
  const child = activeChildId ? getChild(activeChildId) : undefined;

  // Resolve age-adaptive content based on the active child's birth year.
  // Falls back to default lesson content if no child or no variant exists.
  const resolvedLesson = useMemo(() => {
    if (!lesson) return undefined;
    if (!child) return undefined;
    return resolveLessonForChild(lesson, child.birthYear);
  }, [lesson, child]);

  if (!resolvedLesson || !activeChildId) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle-outline" size={48} color={colors.textTertiary} />
          <Text style={[typography.title3, { color: colors.text, marginTop: 16 }]}>
            Lesson not found
          </Text>
          <Pressable onPress={() => router.back()} style={styles.backLink}>
            <Text style={[typography.callout, { color: brand.primary }]}>Go Back</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <LessonPlayerContent lesson={resolvedLesson} childId={activeChildId} isReview={isReview} />
  );
}

function LessonPlayerContent({
  lesson,
  childId,
  isReview,
}: {
  lesson: ResolvedLesson;
  childId: string;
  isReview: boolean;
}) {
  const { brand, colors, typography, radius, categoryColors } = useTheme();
  const router = useRouter();

  const player = useLessonPlayer({ lesson, childId, isReview });

  // Thinking countdown state: shows a 3-second "Get Ready" before practice.
  // In review mode, the player starts directly at practice — show countdown on mount.
  // In normal mode, countdown triggers when transitioning from teach → practice.
  const [showCountdown, setShowCountdown] = useState(isReview);
  const [practiceReady, setPracticeReady] = useState(false);

  const handleClose = useCallback(() => {
    player.stopNarration();
    router.back();
  }, [player, router]);

  const handleDone = useCallback(() => {
    player.stopNarration();
    router.back();
  }, [player, router]);

  const categoryInfo = categoryMeta[lesson.category];
  const accentColor = isReview
    ? brand.accent
    : (categoryColors[lesson.category]?.solid ?? brand.primary);
  const categoryIcon = (categoryInfo?.icon as keyof typeof Ionicons.glyphMap) ?? 'book-outline';

  const phaseLabels: Record<string, string> = isReview
    ? { practice: 'Review', reward: 'Done!' }
    : { hook: 'Start', teach: 'Learn', practice: 'Practice', reward: 'Done!' };

  const visiblePhases = isReview
    ? (['practice', 'reward'] as const)
    : (['hook', 'teach', 'practice', 'reward'] as const);

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
      edges={['top', 'left', 'right']}
    >
      {/* Top bar */}
      <Animated.View entering={FadeIn.duration(400)} style={styles.topBar}>
        <Pressable
          onPress={handleClose}
          hitSlop={12}
          style={styles.closeButton}
          accessibilityRole="button"
          accessibilityLabel="Close lesson"
        >
          <Ionicons name="close" size={24} color={colors.textSecondary} />
        </Pressable>

        <View style={styles.titleArea}>
          <Text style={[typography.captionBold, { color: accentColor }]} numberOfLines={1}>
            {isReview ? 'Review' : (categoryInfo?.label ?? lesson.category)}
          </Text>
          <Text style={[typography.footnote, { color: colors.textTertiary }]} numberOfLines={1}>
            {lesson.title}
          </Text>
        </View>

        <View
          style={[
            styles.phaseBadge,
            { backgroundColor: accentColor + '12', borderRadius: radius.full },
          ]}
        >
          <Text style={[typography.captionBold, { color: accentColor }]}>
            {phaseLabels[player.phase] ?? player.phase}
          </Text>
        </View>
      </Animated.View>

      {/* Phase progress dots */}
      <View style={styles.phaseProgress}>
        {visiblePhases.map((phase) => {
          const phasesArr: string[] = [...visiblePhases];
          const currentIdx = phasesArr.indexOf(player.phase);
          const thisIdx = phasesArr.indexOf(phase);
          const isDone = thisIdx < currentIdx;
          const isCurrent = phase === player.phase;
          return (
            <View
              key={phase}
              style={[
                styles.phaseDot,
                {
                  backgroundColor: isDone
                    ? accentColor
                    : isCurrent
                      ? accentColor + '60'
                      : colors.surfaceTertiary,
                  flex: 1,
                },
              ]}
            />
          );
        })}
      </View>

      {/* Phase content with animated cross-fade transitions (Design Spec §3.4) */}
      <PhaseTransition phaseKey={showCountdown ? 'countdown' : player.phase}>
        {/* Thinking countdown — shown when transitioning to practice (PRD §2.7) */}
        {showCountdown && (
          <ThinkingCountdown
            accentColor={accentColor}
            onComplete={() => {
              setShowCountdown(false);
              setPracticeReady(true);
            }}
          />
        )}

        {/* Hook phase */}
        {!showCountdown && player.phase === 'hook' && (
          <HookPhase
            hook={lesson.hook}
            isNarrating={player.state.isNarrating}
            onNarrate={player.narrate}
            onContinue={() => {
              player.startTeaching();
            }}
            onSkip={() => {
              player.startTeaching();
            }}
            accentColor={accentColor}
            categoryIcon={categoryIcon}
          />
        )}

        {!showCountdown && player.phase === 'teach' && player.currentTeachBlock && (
          <TeachPhase
            block={player.currentTeachBlock}
            index={player.state.teachIndex}
            total={player.totalTeachBlocks}
            isNarrating={player.state.isNarrating}
            onNarrate={player.narrate}
            onStopNarration={player.stopNarration}
            onNext={() => {
              // If this is the last teach block, show countdown before practice
              if (player.isLastTeachBlock && !practiceReady) {
                setShowCountdown(true);
                player.nextTeachBlock(); // advance state to practice
              } else {
                player.nextTeachBlock();
              }
            }}
            isLast={player.isLastTeachBlock}
            accentColor={accentColor}
          />
        )}

        {!showCountdown && player.phase === 'practice' && player.currentPracticeBlock && (
          <PracticePhase
            key={player.currentPracticeBlock.id}
            block={player.currentPracticeBlock}
            index={player.state.practiceIndex}
            total={player.totalPracticeBlocks}
            score={player.state.score}
            maxScore={player.state.maxScore}
            onAnswer={player.submitAnswer}
            accentColor={accentColor}
          />
        )}

        {!showCountdown && player.phase === 'reward' && (
          <RewardPhase
            reward={lesson.reward}
            score={player.state.score}
            maxScore={player.state.maxScore}
            correctCount={player.state.correctCount}
            totalQuestions={player.totalPracticeBlocks}
            xpEarned={lesson.xpReward}
            onComplete={player.completeLesson}
            onDone={handleDone}
            accentColor={accentColor}
          />
        )}
      </PhaseTransition>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backLink: { marginTop: 16 },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    gap: 12,
  },
  closeButton: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleArea: { flex: 1, gap: 1 },
  phaseBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  phaseProgress: {
    flexDirection: 'row',
    gap: 4,
    paddingHorizontal: 16,
    marginBottom: 4,
  },
  phaseDot: {
    height: 4,
    borderRadius: 2,
  },
  content: { flex: 1 },
});
