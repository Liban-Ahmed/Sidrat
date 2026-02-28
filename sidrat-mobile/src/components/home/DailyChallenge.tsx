/**
 * DailyChallenge — "Daily Challenge" card for the home screen.
 *
 * Surfaces a random practice question from the curriculum as a
 * quick, bite-sized learning moment. A new question is picked each day
 * (seeded by date). Tapping navigates to the parent lesson.
 *
 * Design: uses the gold/reward palette to feel special & inviting.
 * Follows Sidrat Interaction Design Spec v2 — spring press states,
 * haptic feedback, warm shadows, Oasis palette only.
 */

import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useMemo, useCallback } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { allCurriculumLessons } from '../../data/curriculum';
import { useAppStore } from '../../stores';
import { useTheme } from '../../theme';
import { ScalePress } from '../ScalePress';
import type { PracticeBlock, CurriculumLesson } from '../../types/curriculum';

interface DailyChallengeQuestion {
  lesson: CurriculumLesson;
  practice: PracticeBlock;
  questionText: string;
  category: string;
}

/**
 * Simple seeded pseudo-random using the date as seed
 * so the same challenge shows for the whole day.
 */
function getDayHash(date: Date = new Date()): number {
  const str = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0; // Convert to 32-bit int
  }
  return Math.abs(hash);
}

/**
 * Extract a human-readable question text from a practice block.
 */
function getQuestionText(practice: PracticeBlock): string {
  switch (practice.type) {
    case 'quiz':
      return practice.question;
    case 'true-false':
      return practice.statement;
    case 'fill-blank':
      return practice.sentence;
    case 'matching':
      return practice.instruction;
    case 'ordering':
      return practice.instruction;
    case 'tap-word':
      return practice.instruction;
    default:
      return 'Test your knowledge!';
  }
}

/**
 * Pick the daily challenge question from the whole curriculum.
 * Deterministic per day — same question all day.
 */
function getDailyChallenge(): DailyChallengeQuestion | null {
  // Collect all practice blocks across all lessons
  const allPractices: { lesson: CurriculumLesson; practice: PracticeBlock }[] = [];

  for (const lesson of allCurriculumLessons) {
    for (const p of lesson.practice) {
      allPractices.push({ lesson, practice: p });
    }
  }

  if (allPractices.length === 0) return null;

  const dayIndex = getDayHash() % allPractices.length;
  const selected = allPractices[dayIndex];
  if (!selected) return null;

  return {
    lesson: selected.lesson,
    practice: selected.practice,
    questionText: getQuestionText(selected.practice),
    category: selected.lesson.category,
  };
}

interface DailyChallengeProps {
  /** Animation stagger delay in ms */
  delay?: number;
}

function getTodayDateString(): string {
  const today = new Date();
  return `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`;
}

export function DailyChallenge({ delay = 0 }: DailyChallengeProps) {
  const { brand, colors, typography, spacing, radius, isDark, shadows } = useTheme();
  const router = useRouter();
  const activeChildId = useAppStore((s) => s.activeChildId);
  const dailyChallengeCompletions = useAppStore((s) => s.dailyChallengeCompletions);
  const completeDailyChallenge = useAppStore((s) => s.completeDailyChallenge);

  const challenge = useMemo(() => getDailyChallenge(), []);

  // Check if today's challenge is complete for the active child
  const isComplete =
    !!challenge &&
    !!activeChildId &&
    dailyChallengeCompletions.some(
      (c) =>
        c.date === getTodayDateString() &&
        c.lessonId === challenge.lesson.id &&
        c.practiceId === challenge.practice.id &&
        c.childId === activeChildId,
    );

  const handlePress = useCallback(() => {
    if (!challenge || !activeChildId) return;

    // Mark as complete when tapped (user accepts the challenge)
    completeDailyChallenge(challenge.lesson.id, challenge.practice.id, activeChildId);

    // Navigate to the lesson
    router.push(`/lesson/${challenge.lesson.id}` as any);
  }, [challenge, activeChildId, completeDailyChallenge, router]);

  if (!challenge) return null;

  const practiceTypeLabels: Record<string, string> = {
    quiz: 'Quick Quiz',
    'true-false': 'True or False',
    'fill-blank': 'Fill the Blank',
    matching: 'Match It',
    ordering: 'Put in Order',
    'tap-word': 'Build the Sentence',
  };

  const typeLabel = practiceTypeLabels[challenge.practice.type] ?? 'Challenge';

  return (
    <Animated.View entering={FadeInDown.delay(delay).duration(600).springify().damping(16)}>
      <View style={styles.titleRow}>
        <Text style={[typography.title3, { color: colors.text, flex: 1 }]}>Daily Challenge</Text>
        {isComplete && (
          <View style={styles.completeBadge}>
            <Ionicons name="checkmark-circle" size={20} color={brand.secondary} />
            <Text style={[typography.captionBold, { color: brand.secondary, marginLeft: 4 }]}>
              Done!
            </Text>
          </View>
        )}
      </View>

      <ScalePress
        onPress={handlePress}
        accessibilityLabel={`Daily Challenge: ${challenge.questionText}. ${isComplete ? 'Completed today!' : 'Tap to start.'}`}
        style={{ marginTop: spacing.xs }}
      >
        <View
          style={[
            styles.card,
            {
              backgroundColor: isComplete
                ? isDark
                  ? colors.surfaceTertiary
                  : '#F4F7EE'
                : isDark
                  ? colors.surfaceSecondary
                  : '#FFFBEB',
              borderRadius: radius.lg,
              borderWidth: 1,
              borderColor: isComplete
                ? isDark
                  ? brand.secondary + '30'
                  : '#A8C276'
                : isDark
                  ? brand.accent + '30'
                  : '#FDE68A',
              padding: spacing.md,
              ...shadows.card,
              opacity: isComplete ? 0.75 : 1,
            },
          ]}
        >
          {/* Header row */}
          <View style={styles.headerRow}>
            <View
              style={[
                styles.iconContainer,
                {
                  backgroundColor: isComplete
                    ? isDark
                      ? brand.secondary + '20'
                      : '#E4EDD5'
                    : isDark
                      ? brand.accent + '20'
                      : '#FEF3C7',
                  borderRadius: radius.md,
                },
              ]}
            >
              <Ionicons
                name={isComplete ? 'checkmark-circle' : 'flash'}
                size={22}
                color={isComplete ? brand.secondary : brand.accent}
              />
            </View>

            <View style={{ flex: 1, marginLeft: spacing.sm }}>
              <Text
                style={[
                  typography.captionBold,
                  { color: isComplete ? brand.secondary : brand.accent },
                ]}
              >
                {isComplete ? 'Completed' : typeLabel}
              </Text>
              <Text
                style={[typography.label, { color: colors.text, marginTop: 2 }]}
                numberOfLines={2}
              >
                {challenge.questionText}
              </Text>
            </View>

            {!isComplete && (
              <View
                style={[
                  styles.goBadge,
                  {
                    backgroundColor: brand.accent,
                    borderRadius: radius.full,
                  },
                ]}
              >
                <Ionicons name="arrow-forward" size={16} color="#FFFFFF" />
              </View>
            )}
          </View>

          {/* Footer meta */}
          <View style={[styles.footer, { marginTop: spacing.sm }]}>
            <Text style={[typography.caption, { color: isDark ? colors.textTertiary : '#D4A017' }]}>
              {challenge.lesson.title}
            </Text>
            <View style={styles.pointsBadge}>
              <Ionicons name="sparkles" size={11} color={isDark ? brand.accentLight : '#D4A017'} />
              <Text
                style={[
                  typography.caption,
                  {
                    color: isDark ? brand.accentLight : '#D4A017',
                    marginLeft: 3,
                    fontWeight: '600',
                  },
                ]}
              >
                +{challenge.practice.points} Hasanat
              </Text>
            </View>
          </View>
        </View>
      </ScalePress>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    overflow: 'hidden',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  completeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  goBadge: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  pointsBadge: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
