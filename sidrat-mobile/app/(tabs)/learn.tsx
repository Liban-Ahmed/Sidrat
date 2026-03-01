/**
 * Learn Screen — Curriculum Dashboard
 *
 * 2×N category card grid · collapsible lesson lists · staggered spring
 * enter animations · Oasis palette · spec §8.2.
 */

import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useMemo, useCallback, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  RefreshControl,
  LayoutAnimation,
  Platform,
  UIManager,
} from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { JuicyPressable } from '../../src/components/common/JuicyPressable';
import { ProgressBar } from '../../src/components/ProgressBar';
import { ProgressRing, LearnSkeletonLoader, EmptyState } from '../../src/components/ui';
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
import type { CurriculumUnit, CurriculumLesson } from '../../src/types/curriculum';
import type { LessonCategory, Difficulty } from '../../src/types/models';

// ── Android LayoutAnimation ────────────────────────────────────
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

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

// ── Shared stagger entering factory ────────────────────────────
function staggerEnter(index: number) {
  return FadeInDown.delay(Math.min(index * 60, 360))
    .springify()
    .damping(SPRINGS.gentle.damping)
    .stiffness(SPRINGS.gentle.stiffness)
    .mass(SPRINGS.gentle.mass);
}

// ════════════════════════════════════════════════════════════════
// Component
// ════════════════════════════════════════════════════════════════

export default function LearnScreen() {
  const { typography, isDark } = useTheme();
  const router = useRouter();
  const activeChildId = useAppStore((s) => s.activeChildId);
  const expandedUnitIds = useAppStore((s) => s.expandedUnitIds);
  const toggleUnitExpanded = useAppStore((s) => s.toggleUnitExpanded);
  const progress = useLessonStore((s) => s.progress);

  // Oasis semantic palette (light / dark)
  const oc = isDark ? darkSemanticColors : semanticColors;

  const toggleUnit = useCallback(
    (unitId: string) => {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      haptic.light();
      toggleUnitExpanded(unitId);
    },
    [toggleUnitExpanded],
  );

  // ── Data selectors (unchanged logic) ──────────────────────────
  const lessonMap = useMemo(() => new Map(allCurriculumLessons.map((l) => [l.id, l])), []);

  const unitLessonsMap = useMemo(() => {
    const map = new Map<string, CurriculumLesson[]>();
    for (const lesson of allCurriculumLessons) {
      const bucket = map.get(lesson.unitId) ?? [];
      bucket.push(lesson);
      map.set(lesson.unitId, bucket);
    }
    return map;
  }, []);

  const getIsCompleted = useCallback(
    (lessonId: string) => {
      if (!activeChildId) return false;
      return progress[`${activeChildId}:${lessonId}`]?.isCompleted ?? false;
    },
    [activeChildId, progress],
  );

  const getUnitProgress = useCallback(
    (unit: CurriculumUnit) => {
      const completed = unit.lessonIds.filter((id) => getIsCompleted(id)).length;
      return { completed, total: unit.lessonIds.length };
    },
    [getIsCompleted],
  );

  const overallStats = useMemo(() => {
    let completed = 0;
    let total = 0;
    let xp = 0;
    for (const unit of allUnits) {
      for (const lid of unit.lessonIds) {
        total++;
        if (getIsCompleted(lid)) {
          completed++;
          const lesson = lessonMap.get(lid);
          if (lesson) xp += lesson.xpReward;
        }
      }
    }
    return { completed, total, xp, pct: total > 0 ? completed / total : 0 };
  }, [lessonMap, getIsCompleted]);

  const nextLesson = useMemo<{ lesson: CurriculumLesson; unit: CurriculumUnit } | null>(() => {
    for (const unit of allUnits) {
      const unitLessons = unitLessonsMap.get(unit.id) ?? [];
      for (let i = 0; i < unitLessons.length; i++) {
        const lesson = unitLessons[i]!;
        if (!lesson) continue;
        if (getIsCompleted(lesson.id)) continue;
        const prevDone = i === 0 || getIsCompleted(unitLessons[i - 1]?.id ?? '');
        if (prevDone) return { lesson, unit };
      }
    }
    return null;
  }, [getIsCompleted, unitLessonsMap]);

  const handleLessonPress = (lessonId: string) => {
    if (isLessonPremium(lessonId)) {
      haptic.warning();
      return;
    }
    haptic.light();
    router.push(`/lesson/${lessonId}`);
  };

  const [refreshing, setRefreshing] = useState(false);
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 600);
  }, []);

  /** Group units into rows of 2 for the category grid */
  const unitRows = useMemo(() => {
    const rows: CurriculumUnit[][] = [];
    for (let i = 0; i < allUnits.length; i += 2) {
      rows.push(allUnits.slice(i, i + 2));
    }
    return rows;
  }, []);

  // ── Empty state ──────────────────────────────────────────────
  if (allUnits.length === 0) {
    return (
      <LinearGradient colors={isDark ? [...DARK_BG] : [...LIGHT_BG]} style={styles.flex1}>
        <SafeAreaView style={styles.flex1} edges={['left', 'right']}>
          <EmptyState
            icon="book-outline"
            title="No lessons yet"
            subtitle="New lessons are on the way, insha'Allah. Check back soon!"
            color={oc.primary}
          />
        </SafeAreaView>
      </LinearGradient>
    );
  }

  // ── Loading skeleton during refresh ──────────────────────────
  if (refreshing) {
    return (
      <LinearGradient colors={isDark ? [...DARK_BG] : [...LIGHT_BG]} style={styles.flex1}>
        <LearnSkeletonLoader />
      </LinearGradient>
    );
  }

  // ── Main render ──────────────────────────────────────────────
  return (
    <LinearGradient colors={isDark ? [...DARK_BG] : [...LIGHT_BG]} style={styles.flex1}>
      <SafeAreaView style={styles.flex1} edges={['left', 'right']}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 100 }}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={oc.primary} />
          }
        >
          {/* ════ Header ════ */}
          <Animated.View entering={staggerEnter(0)} style={styles.header}>
            <View style={styles.headerLeft}>
              <Text style={[typography.largeTitle, { color: oc.textPrimary }]}>Learn</Text>
              <Text style={[styles.headerSub, { color: oc.textMuted }]}>
                {overallStats.completed} of {overallStats.total} lessons
              </Text>
            </View>

            <ProgressRing
              progress={overallStats.pct}
              size={44}
              strokeWidth={4}
              color={oc.primary}
              trackColor={tokens.color.sand100}
            >
              <Text style={[styles.ringLabel, { color: oc.primary }]}>
                {overallStats.total > 0 ? Math.round(overallStats.pct * 100) : 0}%
              </Text>
            </ProgressRing>
          </Animated.View>

          {/* ════ Continue Learning — Hero Card ════ */}
          {nextLesson && (
            <Animated.View entering={staggerEnter(1)} style={styles.heroWrap}>
              <JuicyPressable
                onPress={() => handleLessonPress(nextLesson.lesson.id)}
                accessibilityLabel={`Continue learning: ${nextLesson.lesson.title} in ${nextLesson.unit.title}`}
                accessibilityRole="button"
              >
                <HeroCard
                  lesson={nextLesson.lesson}
                  unit={nextLesson.unit}
                  oc={oc}
                  typography={typography}
                  isDark={isDark}
                  getUnitProgress={getUnitProgress}
                />
              </JuicyPressable>
            </Animated.View>
          )}

          {/* ════ Category Cards — 2×N Grid ════ */}
          <View style={styles.unitGrid}>
            {unitRows.map((row, rowIndex) => (
              <React.Fragment key={rowIndex}>
                {/* ── Row of 2 cards ── */}
                <View style={styles.unitRow}>
                  {row.map((unit, colIndex) => {
                    const flatIndex = rowIndex * 2 + colIndex;
                    const unitProg = getUnitProgress(unit);
                    const cat = OASIS_CAT[unit.category] ?? {
                      primary: oc.primary,
                      tint: oc.primaryLight,
                    };
                    const pct = unitProg.total > 0 ? unitProg.completed / unitProg.total : 0;
                    const isExpanded = expandedUnitIds.includes(unit.id);

                    return (
                      <Animated.View
                        key={unit.id}
                        entering={staggerEnter(flatIndex + 2)}
                        style={styles.unitGridItem}
                      >
                        <JuicyPressable
                          onPress={() => toggleUnit(unit.id)}
                          accessibilityLabel={`${unit.title}, ${unitProg.completed} of ${unitProg.total} lessons complete. ${isExpanded ? 'Collapse' : 'Expand'}`}
                          accessibilityRole="button"
                        >
                          <View
                            style={[
                              styles.categoryCard,
                              {
                                backgroundColor: isExpanded
                                  ? isDark
                                    ? oc.primaryLight
                                    : cat.tint
                                  : oc.surface,
                                borderColor: isExpanded ? cat.primary : oc.surfaceBorder,
                                ...SHADOW.rnMd,
                              },
                            ]}
                          >
                            {/* Icon circle */}
                            <View
                              style={[
                                styles.catIconCircle,
                                {
                                  backgroundColor: isDark ? cat.primary + '20' : cat.tint,
                                },
                              ]}
                            >
                              <Ionicons
                                name={unit.icon as keyof typeof Ionicons.glyphMap}
                                size={22}
                                color={cat.primary}
                              />
                            </View>

                            {/* Name */}
                            <Text
                              style={[styles.catName, { color: oc.textPrimary }]}
                              numberOfLines={1}
                            >
                              {unit.title}
                            </Text>

                            {/* Lesson count */}
                            <Text style={[styles.catCount, { color: oc.textMuted }]}>
                              {unitProg.total} lesson{unitProg.total !== 1 ? 's' : ''}
                            </Text>

                            {/* Completion ring */}
                            <View style={styles.catRingWrap}>
                              <ProgressRing
                                progress={pct}
                                size={36}
                                strokeWidth={3}
                                color={oc.primary}
                                trackColor={tokens.color.sand100}
                              >
                                <Text
                                  style={{
                                    fontSize: 9,
                                    fontWeight: '700',
                                    color: pct === 1 ? oc.primary : oc.textMuted,
                                  }}
                                >
                                  {Math.round(pct * 100)}%
                                </Text>
                              </ProgressRing>
                            </View>
                          </View>
                        </JuicyPressable>
                      </Animated.View>
                    );
                  })}

                  {/* Spacer for odd last row */}
                  {row.length === 1 && <View style={styles.unitGridItem} />}
                </View>

                {/* ── Expanded lesson list for any unit in this row ── */}
                {row
                  .filter((u) => expandedUnitIds.includes(u.id))
                  .map((unit) => {
                    const unitLessons = allCurriculumLessons
                      .filter((l) => l.unitId === unit.id)
                      .sort((a, b) => a.order - b.order);

                    return (
                      <Animated.View
                        key={`lessons-${unit.id}`}
                        entering={staggerEnter(0)}
                        style={styles.lessonSection}
                      >
                        {/* Section label */}
                        <Text style={[styles.lessonSectionLabel, { color: oc.textMuted }]}>
                          {CATEGORY_SUBTITLES[unit.category] ?? unit.description}
                        </Text>

                        {/* Progress bar */}
                        <ProgressBar
                          progress={
                            unitLessons.length > 0
                              ? unitLessons.filter((l) => getIsCompleted(l.id)).length /
                                unitLessons.length
                              : 0
                          }
                          color={oc.primary}
                          trackColor={tokens.color.sand100}
                          height={4}
                        />

                        {/* Lesson cards */}
                        {unitLessons.map((lesson, li) => {
                          const isCompleted = getIsCompleted(lesson.id);
                          const prevCompleted =
                            li === 0 || getIsCompleted(unitLessons[li - 1]?.id ?? '');
                          const isPremium = isLessonPremium(lesson.id);
                          const isLocked = isPremium || (li > 0 && !prevCompleted);
                          const isPremiumLocked = isPremium && !isCompleted;
                          const filled = DIFFICULTY_DOTS[lesson.difficulty] ?? 1;

                          return (
                            <JuicyPressable
                              key={lesson.id}
                              onPress={() => handleLessonPress(lesson.id)}
                              disabled={isLocked && !isPremiumLocked}
                              accessibilityLabel={`${lesson.title}, ${
                                isCompleted
                                  ? 'completed'
                                  : isPremiumLocked
                                    ? 'premium locked'
                                    : isLocked
                                      ? 'locked'
                                      : 'available'
                              }`}
                              accessibilityRole="button"
                            >
                              <View
                                style={[
                                  styles.lessonCard,
                                  {
                                    backgroundColor: isCompleted ? oc.correctBg : oc.surface,
                                    borderColor: isCompleted ? oc.correct : oc.surfaceBorder,
                                    opacity: isLocked && !isPremiumLocked ? 0.5 : 1,
                                    ...SHADOW.rnSm,
                                  },
                                ]}
                              >
                                {/* Title row */}
                                <View style={styles.lessonTopRow}>
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

                                  {/* Right indicator */}
                                  {isCompleted ? (
                                    <Ionicons
                                      name="checkmark-circle"
                                      size={22}
                                      color={oc.correct}
                                    />
                                  ) : isPremiumLocked || isLocked ? (
                                    <Ionicons
                                      name="lock-closed"
                                      size={18}
                                      color={tokens.color.sand300}
                                    />
                                  ) : (
                                    <Ionicons
                                      name="chevron-forward"
                                      size={18}
                                      color={oc.textMuted}
                                    />
                                  )}
                                </View>

                                {/* Meta row — visible for unlocked, incomplete lessons */}
                                {!isCompleted && !isLocked && (
                                  <View style={styles.lessonMeta}>
                                    {/* Difficulty dots (8pt per spec) */}
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
                                )}
                              </View>
                            </JuicyPressable>
                          );
                        })}
                      </Animated.View>
                    );
                  })}
              </React.Fragment>
            ))}
          </View>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}

// ════════════════════════════════════════════════════════════════
// Hero Card Sub-Component
// ════════════════════════════════════════════════════════════════

interface HeroProps {
  lesson: CurriculumLesson;
  unit: CurriculumUnit;
  oc: typeof semanticColors;
  typography: ReturnType<typeof useTheme>['typography'];
  isDark: boolean;
  getUnitProgress: (u: CurriculumUnit) => { completed: number; total: number };
}

function HeroCard({ lesson, unit, oc, typography, getUnitProgress }: HeroProps) {
  const cat = OASIS_CAT[unit.category] ?? { primary: oc.primary, tint: oc.primaryLight };
  const unitProg = getUnitProgress(unit);

  return (
    <View
      style={[
        styles.heroCard,
        {
          backgroundColor: oc.surface,
          borderRadius: RADIUS.lg,
          borderWidth: 1.5,
          borderColor: oc.surfaceBorder,
          ...SHADOW.rnMd,
        },
      ]}
    >
      {/* Left accent stripe */}
      <View
        style={[
          styles.heroAccent,
          {
            backgroundColor: cat.primary,
            borderTopLeftRadius: RADIUS.lg,
            borderBottomLeftRadius: RADIUS.lg,
          },
        ]}
      />

      <View style={{ padding: SPACING.md, paddingLeft: SPACING.md + 4 }}>
        {/* Context badge */}
        <View style={styles.heroContext}>
          <View style={[styles.heroBadge, { backgroundColor: cat.tint, borderRadius: RADIUS.sm }]}>
            <Ionicons
              name={unit.icon as keyof typeof Ionicons.glyphMap}
              size={12}
              color={cat.primary}
            />
            <Text style={[styles.heroBadgeText, { color: cat.primary }]}>{unit.title}</Text>
          </View>
          <Text style={[styles.heroLessonNum, { color: oc.textMuted }]}>
            Lesson {lesson.order} of {unitProg.total}
          </Text>
        </View>

        {/* Title */}
        <Text style={[typography.title2, { color: oc.textPrimary, marginTop: SPACING.sm }]}>
          {lesson.title}
        </Text>

        {/* Hook prompt */}
        <Text style={[styles.heroHook, { color: oc.textSecondary }]} numberOfLines={3}>
          {lesson.hook.prompt}
        </Text>

        {/* Bottom row */}
        <View style={[styles.heroBottom, { marginTop: SPACING.md }]}>
          <View style={styles.heroMeta}>
            <Ionicons name="time-outline" size={13} color={oc.textMuted} />
            <Text style={[styles.heroMetaText, { color: oc.textMuted }]}>
              {lesson.durationMinutes} min
            </Text>
            <View style={{ width: SPACING.sm }} />
            <Ionicons name="sparkles-outline" size={13} color={oc.rewardText} />
            <Text style={[styles.heroMetaText, { color: oc.rewardText }]}>
              +{lesson.xpReward} XP
            </Text>
          </View>

          <View style={[styles.heroCta, { backgroundColor: cat.primary, borderRadius: RADIUS.md }]}>
            <Ionicons name="play" size={16} color={tokens.color.white} />
            <Text style={styles.heroCtaText}>Continue</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

// ════════════════════════════════════════════════════════════════
// Styles
// ════════════════════════════════════════════════════════════════

const styles = StyleSheet.create({
  flex1: { flex: 1 },

  // ── Header ──
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.md,
    paddingTop: SPACING.xl + 54,
    paddingBottom: SPACING.md,
    gap: SPACING.md,
  },
  headerLeft: { flex: 1, minWidth: 0 },
  headerSub: { fontSize: 13, fontWeight: '500', marginTop: 2 },
  ringLabel: { fontSize: 11, fontWeight: '600', textAlign: 'center' },

  // ── Hero Card ──
  heroWrap: { paddingHorizontal: SPACING.md },
  heroCard: { position: 'relative', overflow: 'hidden' },
  heroAccent: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 4,
  },
  heroContext: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  heroBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  heroBadgeText: { fontSize: 11, fontWeight: '700', marginLeft: 4 },
  heroLessonNum: { fontSize: 12 },
  heroHook: { fontSize: 14, lineHeight: 22, marginTop: 4 },
  heroBottom: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  heroMeta: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  heroMetaText: { fontSize: 13, fontWeight: '500', marginLeft: 4 },
  heroCta: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  heroCtaText: { color: '#FFFFFF', fontSize: 14, fontWeight: '700', marginLeft: 6 },

  // ── Unit Grid ──
  unitGrid: { marginTop: SPACING.lg, paddingHorizontal: SPACING.md },
  unitRow: { flexDirection: 'row', gap: SPACING.md, marginBottom: SPACING.md },
  unitGridItem: { flex: 1 },

  // ── Category Card ──
  categoryCard: {
    borderWidth: 1.5,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    minHeight: 100,
    alignItems: 'center',
  },
  catIconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  catName: { fontWeight: '700', fontSize: 16, marginTop: SPACING.sm, textAlign: 'center' },
  catCount: { fontSize: 13, marginTop: 2, textAlign: 'center' },
  catRingWrap: { marginTop: SPACING.sm },

  // ── Lesson Section (expanded) ──
  lessonSection: { marginBottom: SPACING.md, gap: SPACING.sm },
  lessonSectionLabel: {
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1.2,
    marginBottom: 2,
  },

  // ── Lesson Card ──
  lessonCard: {
    borderWidth: 1.5,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    minHeight: 72,
    justifyContent: 'center',
  },
  lessonTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  lessonTitle: { fontWeight: '700', fontSize: 16, flex: 1, marginRight: SPACING.sm },
  lessonMeta: { flexDirection: 'row', alignItems: 'center', marginTop: SPACING.xs },
  metaText: { fontSize: 11, fontWeight: '500', marginLeft: 3 },

  // ── Difficulty Dots ──
  diffDots: { flexDirection: 'row', alignItems: 'center', gap: 3 },
  diffDot: { width: 8, height: 8, borderRadius: 4 },
});
