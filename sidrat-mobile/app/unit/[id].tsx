/**
 * Unit Detail Screen
 *
 * Displays all lessons within a curriculum unit. Navigated to from the
 * Learn screen category grid. Follows Oasis palette (Design Spec §6)
 * with staggered spring enter animations, JuicyPressable lesson cards,
 * and full dark-mode support.
 */

import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useMemo, useCallback } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { JuicyPressable } from '../../src/components/common/JuicyPressable';
import { ProgressBar } from '../../src/components/ProgressBar';
import { ProgressRing, EmptyState } from '../../src/components/ui';
import { allUnits, allCurriculumLessons } from '../../src/data/curriculum';
import { useAppStore, useLessonStore } from '../../src/stores';
import { useTheme } from '../../src/theme';
import {
  tokens,
  semanticColors,
  darkSemanticColors,
  SPRINGS,
  SPACING,
  RADIUS,
  SHADOW,
} from '../../src/theme/tokens';
import haptic from '../../src/utils/haptics';
import type { LessonCategory, Difficulty } from '../../src/types/models';

// ── Category metadata ──────────────────────────────────────────

const CATEGORY_SUBTITLES: Record<LessonCategory, string> = {
  aqeedah: 'Foundations of belief',
  wudu: 'Purification before prayer',
  salah: 'The five daily prayers',
  quran: 'Recitation and understanding',
  seerah: 'Life of the Prophet ﷺ',
  adab: 'Islamic manners',
  duaa: 'Supplications and remembrance',
  stories: 'Prophets and companions',
};

/** Oasis category colors — Design Spec §6.5 */
const OASIS_CAT: Record<LessonCategory, { primary: string; tint: string }> = {
  aqeedah: { primary: tokens.color.sky400, tint: tokens.color.sky50 },
  quran: { primary: tokens.color.gold500, tint: tokens.color.gold50 },
  salah: { primary: tokens.color.olive400, tint: tokens.color.olive50 },
  wudu: { primary: tokens.color.sky500, tint: tokens.color.sky100 },
  duaa: { primary: tokens.color.gold400, tint: tokens.color.gold50 },
  seerah: { primary: tokens.color.sand400, tint: tokens.color.sand50 },
  adab: { primary: tokens.color.rose400, tint: tokens.color.rose50 },
  stories: { primary: tokens.color.olive300, tint: tokens.color.olive50 },
};

const DIFFICULTY_DOTS: Record<Difficulty, number> = {
  beginner: 1,
  intermediate: 2,
  advanced: 3,
};

const PREMIUM_LESSON_IDS = new Set<string>();
function isLessonPremium(id: string): boolean {
  return PREMIUM_LESSON_IDS.has(id);
}

// ── Background gradient stops ──────────────────────────────────
const LIGHT_BG = [tokens.color.sand50, tokens.color.cream, tokens.color.olive50] as const;
const DARK_BG = [tokens.color.earth900, '#1F1D1A', '#222018'] as const;

// ── Stagger entering factory ───────────────────────────────────
function staggerEnter(index: number) {
  return FadeInDown.delay(Math.min(index * 60, 480))
    .springify()
    .damping(SPRINGS.gentle.damping)
    .stiffness(SPRINGS.gentle.stiffness)
    .mass(SPRINGS.gentle.mass);
}

// ════════════════════════════════════════════════════════════════
// Component
// ════════════════════════════════════════════════════════════════

export default function UnitScreen() {
  const { typography, isDark } = useTheme();
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const activeChildId = useAppStore((s) => s.activeChildId);
  const progress = useLessonStore((s) => s.progress);

  const oc = isDark ? darkSemanticColors : semanticColors;

  // ── Resolve unit ─────────────────────────────────────────────
  const unit = useMemo(() => allUnits.find((u) => u.id === id), [id]);

  const unitLessons = useMemo(
    () =>
      unit
        ? allCurriculumLessons.filter((l) => l.unitId === unit.id).sort((a, b) => a.order - b.order)
        : [],
    [unit],
  );

  const getIsCompleted = useCallback(
    (lessonId: string) => {
      if (!activeChildId) return false;
      return progress[`${activeChildId}:${lessonId}`]?.isCompleted ?? false;
    },
    [activeChildId, progress],
  );

  const unitStats = useMemo(() => {
    const completed = unitLessons.filter((l) => getIsCompleted(l.id)).length;
    const total = unitLessons.length;
    let xp = 0;
    for (const l of unitLessons) {
      if (getIsCompleted(l.id)) xp += l.xpReward;
    }
    const totalXp = unitLessons.reduce((sum, l) => sum + l.xpReward, 0);
    return { completed, total, xp, totalXp, pct: total > 0 ? completed / total : 0 };
  }, [unitLessons, getIsCompleted]);

  const nextLessonIndex = useMemo(() => {
    for (let i = 0; i < unitLessons.length; i++) {
      if (!getIsCompleted(unitLessons[i]!.id)) return i;
    }
    return -1; // all complete
  }, [unitLessons, getIsCompleted]);

  const cat = unit
    ? (OASIS_CAT[unit.category] ?? { primary: oc.primary, tint: oc.primaryLight })
    : { primary: oc.primary, tint: oc.primaryLight };

  const handleBack = useCallback(() => {
    haptic.light();
    router.back();
  }, [router]);

  const handleLessonPress = useCallback(
    (lessonId: string) => {
      if (isLessonPremium(lessonId)) {
        haptic.warning();
        return;
      }
      haptic.light();
      router.push(`/lesson/${lessonId}`);
    },
    [router],
  );

  // ── Unit not found ───────────────────────────────────────────
  if (!unit) {
    return (
      <LinearGradient colors={isDark ? [...DARK_BG] : [...LIGHT_BG]} style={styles.flex1}>
        <SafeAreaView style={styles.flex1}>
          <EmptyState
            icon="alert-circle-outline"
            title="Unit not found"
            subtitle="This unit may have been removed. Go back and try again."
            color={oc.primary}
          />
        </SafeAreaView>
      </LinearGradient>
    );
  }

  // ── Main render ──────────────────────────────────────────────
  return (
    <LinearGradient colors={isDark ? [...DARK_BG] : [...LIGHT_BG]} style={styles.flex1}>
      <SafeAreaView style={styles.flex1} edges={['top', 'left', 'right']}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 120 }}
        >
          {/* ════ Navigation Bar ════ */}
          <Animated.View entering={staggerEnter(0)} style={styles.navBar}>
            <JuicyPressable
              onPress={handleBack}
              accessibilityLabel="Go back"
              accessibilityRole="button"
              style={styles.backButton}
            >
              <View
                style={[
                  styles.backCircle,
                  {
                    backgroundColor: oc.surface,
                    borderColor: oc.surfaceBorder,
                    ...SHADOW.rnSm,
                  },
                ]}
              >
                <Ionicons name="chevron-back" size={20} color={oc.textPrimary} />
              </View>
            </JuicyPressable>
          </Animated.View>

          {/* ════ Hero Header ════ */}
          <Animated.View entering={staggerEnter(1)} style={styles.heroSection}>
            {/* Category icon */}
            <View
              style={[
                styles.heroIconCircle,
                {
                  backgroundColor: isDark ? cat.primary + '20' : cat.tint,
                  borderColor: isDark ? cat.primary + '40' : cat.primary + '20',
                },
              ]}
            >
              <Ionicons
                name={unit.icon as keyof typeof Ionicons.glyphMap}
                size={36}
                color={cat.primary}
              />
            </View>

            {/* Title & subtitle */}
            <Text style={[typography.largeTitle, { color: oc.textPrimary, marginTop: SPACING.md }]}>
              {unit.title}
            </Text>
            <Text style={[styles.subtitle, { color: oc.textMuted }]}>
              {CATEGORY_SUBTITLES[unit.category] ?? unit.description}
            </Text>
          </Animated.View>

          {/* ════ Progress Summary Card ════ */}
          <Animated.View entering={staggerEnter(2)} style={styles.progressWrap}>
            <View
              style={[
                styles.progressCard,
                {
                  backgroundColor: oc.surface,
                  borderColor: oc.surfaceBorder,
                  ...SHADOW.rnMd,
                },
              ]}
            >
              <View style={styles.progressTop}>
                {/* Progress ring */}
                <ProgressRing
                  progress={unitStats.pct}
                  size={56}
                  strokeWidth={5}
                  color={cat.primary}
                  trackColor={tokens.color.sand100}
                >
                  <Text
                    style={[
                      styles.ringLabel,
                      { color: unitStats.pct === 1 ? cat.primary : oc.textMuted },
                    ]}
                  >
                    {Math.round(unitStats.pct * 100)}%
                  </Text>
                </ProgressRing>

                {/* Stats */}
                <View style={styles.statsColumn}>
                  <View style={styles.statRow}>
                    <Ionicons name="book-outline" size={14} color={oc.textMuted} />
                    <Text style={[styles.statText, { color: oc.textSecondary }]}>
                      {unitStats.completed} of {unitStats.total} lessons
                    </Text>
                  </View>
                  <View style={styles.statRow}>
                    <Ionicons name="sparkles-outline" size={14} color={oc.rewardText} />
                    <Text style={[styles.statText, { color: oc.rewardText }]}>
                      {unitStats.xp} / {unitStats.totalXp} Hasanat
                    </Text>
                  </View>
                </View>
              </View>

              {/* Full-width progress bar */}
              <View style={{ marginTop: SPACING.md }}>
                <ProgressBar
                  progress={unitStats.pct}
                  color={cat.primary}
                  trackColor={tokens.color.sand100}
                  height={6}
                />
              </View>
            </View>
          </Animated.View>

          {/* ════ Lessons Header ════ */}
          <Animated.View entering={staggerEnter(3)} style={styles.lessonsHeader}>
            <Text style={[styles.sectionLabel, { color: oc.textMuted }]}>LESSONS</Text>
            <Text style={[styles.lessonCountLabel, { color: oc.textMuted }]}>
              {unitStats.total} lesson{unitStats.total !== 1 ? 's' : ''}
            </Text>
          </Animated.View>

          {/* ════ Lesson Cards ════ */}
          {unitLessons.length === 0 ? (
            <View style={styles.emptyLessons}>
              <EmptyState
                icon="book-outline"
                title="No lessons yet"
                subtitle="New lessons are on the way, insha'Allah!"
                color={cat.primary}
              />
            </View>
          ) : (
            <View style={styles.lessonList}>
              {unitLessons.map((lesson, index) => {
                const isCompleted = getIsCompleted(lesson.id);
                const prevCompleted =
                  index === 0 || getIsCompleted(unitLessons[index - 1]?.id ?? '');
                const isPremium = isLessonPremium(lesson.id);
                const isLocked = isPremium || (index > 0 && !prevCompleted);
                const isPremiumLocked = isPremium && !isCompleted;
                const isNext = index === nextLessonIndex;
                const filled = DIFFICULTY_DOTS[lesson.difficulty] ?? 1;

                return (
                  <Animated.View key={lesson.id} entering={staggerEnter(index + 4)}>
                    <JuicyPressable
                      onPress={() => handleLessonPress(lesson.id)}
                      disabled={isLocked && !isPremiumLocked}
                      accessibilityLabel={`Lesson ${index + 1}: ${lesson.title}, ${
                        isCompleted
                          ? 'completed'
                          : isPremiumLocked
                            ? 'premium locked'
                            : isLocked
                              ? 'locked'
                              : isNext
                                ? 'up next'
                                : 'available'
                      }`}
                      accessibilityRole="button"
                    >
                      <View
                        style={[
                          styles.lessonCard,
                          {
                            backgroundColor: isCompleted
                              ? oc.correctBg
                              : isNext
                                ? isDark
                                  ? oc.primaryLight
                                  : cat.tint
                                : oc.surface,
                            borderColor: isCompleted
                              ? oc.correct
                              : isNext
                                ? cat.primary
                                : oc.surfaceBorder,
                            opacity: isLocked && !isPremiumLocked ? 0.5 : 1,
                            ...SHADOW.rnSm,
                          },
                        ]}
                      >
                        {/* Left: lesson number circle */}
                        <View
                          style={[
                            styles.lessonNumCircle,
                            {
                              backgroundColor: isCompleted
                                ? oc.correct
                                : isNext
                                  ? cat.primary
                                  : isDark
                                    ? oc.surfaceAlt
                                    : tokens.color.sand100,
                              borderColor: isCompleted
                                ? oc.correct
                                : isNext
                                  ? cat.primary
                                  : tokens.color.sand200,
                            },
                          ]}
                        >
                          {isCompleted ? (
                            <Ionicons name="checkmark" size={16} color={tokens.color.white} />
                          ) : isLocked ? (
                            <Ionicons name="lock-closed" size={14} color={tokens.color.sand300} />
                          ) : (
                            <Text
                              style={[
                                styles.lessonNumText,
                                {
                                  color: isNext ? tokens.color.white : oc.textMuted,
                                },
                              ]}
                            >
                              {index + 1}
                            </Text>
                          )}
                        </View>

                        {/* Middle: lesson details */}
                        <View style={styles.lessonContent}>
                          <Text
                            style={[
                              styles.lessonTitle,
                              {
                                color: isLocked ? oc.textMuted : oc.textPrimary,
                              },
                            ]}
                            numberOfLines={1}
                          >
                            {lesson.title}
                          </Text>

                          {/* Meta row */}
                          <View style={styles.lessonMeta}>
                            {/* Difficulty dots */}
                            <View style={styles.diffDots}>
                              {[1, 2, 3].map((dot) => (
                                <View
                                  key={dot}
                                  style={[
                                    styles.diffDot,
                                    {
                                      backgroundColor:
                                        dot <= filled
                                          ? tokens.color.olive300
                                          : tokens.color.sand200,
                                    },
                                  ]}
                                />
                              ))}
                            </View>

                            <Ionicons
                              name="time-outline"
                              size={11}
                              color={oc.textMuted}
                              style={{ marginLeft: SPACING.sm }}
                            />
                            <Text style={[styles.metaText, { color: oc.textMuted }]}>
                              {lesson.durationMinutes}m
                            </Text>

                            <Ionicons
                              name="sparkles-outline"
                              size={11}
                              color={oc.rewardText}
                              style={{ marginLeft: SPACING.sm }}
                            />
                            <Text style={[styles.metaText, { color: oc.rewardText }]}>
                              +{lesson.xpReward}
                            </Text>
                          </View>
                        </View>

                        {/* Right: status indicator */}
                        <View style={styles.lessonTrailing}>
                          {isCompleted ? (
                            <Ionicons name="checkmark-circle" size={22} color={oc.correct} />
                          ) : isNext ? (
                            <View
                              style={[
                                styles.nextBadge,
                                { backgroundColor: cat.primary, borderRadius: RADIUS.sm },
                              ]}
                            >
                              <Ionicons name="play" size={12} color={tokens.color.white} />
                            </View>
                          ) : isPremiumLocked || isLocked ? (
                            <Ionicons name="lock-closed" size={18} color={tokens.color.sand300} />
                          ) : (
                            <Ionicons name="chevron-forward" size={18} color={oc.textMuted} />
                          )}
                        </View>
                      </View>
                    </JuicyPressable>
                  </Animated.View>
                );
              })}
            </View>
          )}
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}

// ════════════════════════════════════════════════════════════════
// Styles
// ════════════════════════════════════════════════════════════════

const styles = StyleSheet.create({
  flex1: { flex: 1 },

  // ── Navigation Bar ──
  navBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingTop: SPACING.sm,
    paddingBottom: SPACING.sm,
  },
  backButton: {
    // ensures 48pt touch target
    minWidth: 48,
    minHeight: 48,
    justifyContent: 'center',
  },
  backCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // ── Hero Header ──
  heroSection: {
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.md,
    paddingBottom: SPACING.lg,
  },
  heroIconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  subtitle: {
    fontSize: 14,
    fontWeight: '500',
    marginTop: SPACING.xs,
    textAlign: 'center',
  },

  // ── Progress Card ──
  progressWrap: {
    paddingHorizontal: SPACING.md,
  },
  progressCard: {
    borderWidth: 1.5,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
  },
  progressTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
  },
  statsColumn: {
    flex: 1,
    gap: SPACING.xs,
  },
  statRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs + 2,
  },
  statText: {
    fontSize: 14,
    fontWeight: '600',
  },
  ringLabel: {
    fontSize: 13,
    fontWeight: '700',
    textAlign: 'center',
  },

  // ── Lessons Header ──
  lessonsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.md,
    marginTop: SPACING.lg,
    marginBottom: SPACING.sm,
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1.2,
  },
  lessonCountLabel: {
    fontSize: 12,
    fontWeight: '500',
  },

  // ── Lesson List ──
  lessonList: {
    paddingHorizontal: SPACING.md,
    gap: SPACING.sm,
  },
  emptyLessons: {
    paddingTop: SPACING.xl,
  },

  // ── Lesson Card ──
  lessonCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    minHeight: 72,
    gap: SPACING.md,
  },
  lessonNumCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  lessonNumText: {
    fontSize: 14,
    fontWeight: '700',
  },
  lessonContent: {
    flex: 1,
    minWidth: 0,
  },
  lessonTitle: {
    fontWeight: '700',
    fontSize: 16,
  },
  lessonMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: SPACING.xs,
  },
  metaText: {
    fontSize: 11,
    fontWeight: '500',
    marginLeft: 3,
  },
  lessonTrailing: {
    width: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  nextBadge: {
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // ── Difficulty Dots ──
  diffDots: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  diffDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
});
