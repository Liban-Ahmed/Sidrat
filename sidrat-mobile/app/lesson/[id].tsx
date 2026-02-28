/**
 * Lesson Player Screen -- 4-phase flow: Hook -> Teach -> Practice -> Reward.
 * Threads category accent color through all phases for visual identity.
 */

import React, { useCallback } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../src/theme';
import { useAppStore } from '../../src/stores';
import { useLessonPlayer } from '../../src/hooks/useLessonPlayer';
import { getCurriculumLesson } from '../../src/data/curriculum';
import { HookPhase, TeachPhase, PracticePhase, RewardPhase } from '../../src/components/lesson';
import { categoryMeta } from '../../src/types';

export default function LessonScreen() {
  const { brand, colors, typography } = useTheme();
  const router = useRouter();
  const { id, review } = useLocalSearchParams<{ id: string; review?: string }>();
  const activeChildId = useAppStore((s) => s.activeChildId);
  const isReview = review === '1';

  const lesson = id ? getCurriculumLesson(id) : undefined;

  if (!lesson || !activeChildId) {
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

  return <LessonPlayerContent lesson={lesson} childId={activeChildId} isReview={isReview} />;
}

function LessonPlayerContent({
  lesson,
  childId,
  isReview,
}: {
  lesson: NonNullable<ReturnType<typeof getCurriculumLesson>>;
  childId: string;
  isReview: boolean;
}) {
  const { brand, colors, typography, radius, categoryColors } = useTheme();
  const router = useRouter();

  const player = useLessonPlayer({ lesson, childId, isReview });

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
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
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

      {/* Phase content with fade transition */}
      <Animated.View
        key={player.phase}
        entering={FadeInDown.duration(350).springify().damping(20)}
        style={styles.content}
      >
        {player.phase === 'hook' && (
          <HookPhase
            hook={lesson.hook}
            isNarrating={player.state.isNarrating}
            onNarrate={player.narrate}
            onContinue={player.startTeaching}
            accentColor={accentColor}
            categoryIcon={categoryIcon}
          />
        )}

        {player.phase === 'teach' && player.currentTeachBlock && (
          <TeachPhase
            block={player.currentTeachBlock}
            index={player.state.teachIndex}
            total={player.totalTeachBlocks}
            isNarrating={player.state.isNarrating}
            onNarrate={player.narrate}
            onStopNarration={player.stopNarration}
            onNext={player.nextTeachBlock}
            isLast={player.isLastTeachBlock}
            accentColor={accentColor}
          />
        )}

        {player.phase === 'practice' && player.currentPracticeBlock && (
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

        {player.phase === 'reward' && (
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
      </Animated.View>
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
