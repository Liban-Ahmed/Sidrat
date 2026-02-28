/**
 * Learn Screen -- Curriculum Dashboard
 *
 * Enhanced with: collapsible units, category filters, search,
 * completion badges, mastery rings, difficulty indicators,
 * premium-locked state, and redesigned stats strip.
 */

import { Ionicons } from '@expo/vector-icons';
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
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ProgressRing, ScalePress, ProgressBar } from '../../src/components';
import { allUnits, allCurriculumLessons } from '../../src/data/curriculum';
import { useAppStore, useLessonStore } from '../../src/stores';
import { useTheme } from '../../src/theme';
import { categoryColors } from '../../src/theme/colors';
import haptic from '../../src/utils/haptics';
import type { CurriculumUnit, CurriculumLesson } from '../../src/types/curriculum';
import type { LessonCategory, Difficulty } from '../../src/types/models';

// Enable LayoutAnimation on Android
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const CATEGORY_SUBTITLES: Record<LessonCategory, string> = {
  aqeedah: 'Foundations of belief',
  wudu: 'Purification before prayer',
  salah: 'The five daily prayers',
  quran: 'Recitation and understanding',
  seerah: 'Life of the Prophet',
  adab: 'Islamic manners',
  duaa: 'Supplications and remembrance',
  stories: 'Prophets and companions',
};

/** Difficulty indicator dots — number of filled dots out of 3 */
const DIFFICULTY_DOTS: Record<Difficulty, number> = {
  beginner: 1,
  intermediate: 2,
  advanced: 3,
};

/** Placeholder set of premium lesson IDs (future-proof gating) */
const PREMIUM_LESSON_IDS = new Set<string>();
function isLessonPremium(_lessonId: string): boolean {
  return PREMIUM_LESSON_IDS.has(_lessonId);
}

export default function LearnScreen() {
  const { brand, colors, typography, spacing, radius, shadows, isDark } = useTheme();
  const router = useRouter();
  const activeChildId = useAppStore((s) => s.activeChildId);
  const expandedUnitIds = useAppStore((s) => s.expandedUnitIds);
  const toggleUnitExpanded = useAppStore((s) => s.toggleUnitExpanded);
  const progress = useLessonStore((s) => s.progress);

  const toggleUnit = useCallback(
    (unitId: string) => {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      haptic.selection();
      toggleUnitExpanded(unitId);
    },
    [toggleUnitExpanded],
  );

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

  // No search/filter — show all units

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
      // Future: navigate to paywall
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

  /** Renders 3 difficulty dots */
  const DifficultyDots = ({ difficulty, color }: { difficulty: Difficulty; color: string }) => {
    const filled = DIFFICULTY_DOTS[difficulty] ?? 1;
    return (
      <View style={styles.diffDots}>
        {[1, 2, 3].map((dot) => (
          <View
            key={dot}
            style={[
              styles.diffDot,
              {
                backgroundColor: dot <= filled ? color : colors.surfaceTertiary,
              },
            ]}
          />
        ))}
      </View>
    );
  };

  return (
    <SafeAreaView
      style={[styles.safe, { backgroundColor: colors.background }]}
      edges={['left', 'right']}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={brand.primary} />
        }
      >
        {/* ── Header: "Learn" title left, ProgressRing right ── */}
        <Animated.View
          entering={FadeIn.duration(400)}
          style={[styles.header, { paddingHorizontal: spacing.lg, paddingTop: spacing.xl + 54 }]}
        >
          <View style={styles.headerLeft}>
            <Text style={[typography.largeTitle, { color: colors.text }]}>Learn</Text>
            <Text
              style={[
                typography.bodySmall,
                { color: colors.textTertiary, marginTop: spacing.xxxs },
              ]}
            >
              {overallStats.completed} of {overallStats.total} lessons
            </Text>
          </View>
          <View style={styles.headerRight}>
            <ProgressRing
              progress={overallStats.pct}
              size={40}
              strokeWidth={4}
              color={brand.secondary}
            >
              <Text
                style={{
                  color: brand.secondary,
                  fontSize: 10,
                  fontWeight: '500',
                  textAlign: 'center',
                }}
              >
                {overallStats.total > 0 ? Math.round(overallStats.pct * 100) : 0}%
              </Text>
            </ProgressRing>
          </View>
        </Animated.View>

        {/* ── Continue Learning hero card ── */}
        {nextLesson && (
          <Animated.View entering={FadeInDown.delay(100).duration(400)}>
            <ScalePress
              onPress={() => handleLessonPress(nextLesson.lesson.id)}
              haptic
              style={[
                styles.heroCard,
                {
                  marginHorizontal: spacing.lg,
                  marginTop: spacing.lg,
                  backgroundColor: isDark ? colors.surfaceSecondary : colors.surface,
                  borderRadius: radius.xl,
                  overflow: 'hidden',
                  ...shadows.cardPremium,
                },
              ]}
            >
              {(() => {
                const heroColor = categoryColors[nextLesson.unit.category]?.solid ?? brand.primary;
                const unitProg = getUnitProgress(nextLesson.unit);
                return (
                  <>
                    {/* Left-edge accent bar */}
                    <View
                      style={[
                        styles.leftAccent,
                        {
                          backgroundColor: heroColor,
                          borderTopLeftRadius: radius.xl,
                          borderBottomLeftRadius: radius.xl,
                        },
                      ]}
                    />

                    <View style={{ padding: spacing.lg, paddingLeft: spacing.lg + 4 }}>
                      <View style={styles.heroContext}>
                        <View
                          style={[
                            styles.heroBadge,
                            { backgroundColor: heroColor + '18', borderRadius: radius.xs },
                          ]}
                        >
                          <Ionicons
                            name={nextLesson.unit.icon as keyof typeof Ionicons.glyphMap}
                            size={11}
                            color={heroColor}
                          />
                          <Text style={[styles.heroBadgeText, { color: heroColor }]}>
                            {nextLesson.unit.title}
                          </Text>
                        </View>
                        <Text style={[typography.caption, { color: colors.textTertiary }]}>
                          Lesson {nextLesson.lesson.order} of {unitProg.total}
                        </Text>
                      </View>

                      <Text
                        style={[typography.title2, { color: colors.text, marginTop: spacing.sm }]}
                      >
                        {nextLesson.lesson.title}
                      </Text>

                      <Text
                        style={[
                          typography.body,
                          { color: colors.textSecondary, marginTop: spacing.xxs, lineHeight: 22 },
                        ]}
                        numberOfLines={3}
                      >
                        {nextLesson.lesson.hook.prompt}
                      </Text>

                      <View style={[styles.heroBottom, { marginTop: spacing.md }]}>
                        <View style={styles.heroMeta}>
                          <View style={styles.heroMetaItem}>
                            <Ionicons name="time-outline" size={13} color={colors.textTertiary} />
                            <Text style={[styles.heroMetaText, { color: colors.textTertiary }]}>
                              {nextLesson.lesson.durationMinutes} min
                            </Text>
                          </View>
                          <View style={[styles.heroMetaItem, { marginLeft: spacing.sm }]}>
                            <Ionicons name="sparkles-outline" size={13} color={brand.accent} />
                            <Text style={[styles.heroMetaText, { color: brand.accent }]}>
                              +{nextLesson.lesson.xpReward} XP
                            </Text>
                          </View>
                        </View>
                        <View
                          style={[
                            styles.heroCta,
                            { backgroundColor: heroColor, borderRadius: radius.lg },
                          ]}
                        >
                          <Ionicons name="play" size={16} color="#FFF" />
                          <Text style={styles.heroCtaText}>Continue</Text>
                        </View>
                      </View>
                    </View>
                  </>
                );
              })()}
            </ScalePress>
          </Animated.View>
        )}

        {/* ── Unit Cards ── */}
        <View style={{ marginTop: spacing.lg }}>
          {allUnits.map((unit, ui) => {
            const unitProgress = getUnitProgress(unit);
            const unitLessons = allCurriculumLessons
              .filter((l) => l.unitId === unit.id)
              .sort((a, b) => a.order - b.order);
            const cat = categoryColors[unit.category];
            const catColor = cat?.solid ?? brand.primary;
            const catMuted = cat?.muted ?? brand.primaryMuted;
            const unitComplete = unitProgress.completed === unitProgress.total;
            const pct = unitProgress.total > 0 ? unitProgress.completed / unitProgress.total : 0;
            const delay = Math.min(300 + ui * 80, 500);
            const isCollapsed = !expandedUnitIds.includes(unit.id);

            return (
              <Animated.View
                key={unit.id}
                entering={FadeInDown.delay(delay).duration(400)}
                style={{ paddingHorizontal: spacing.lg, marginTop: ui === 0 ? 0 : spacing.md }}
              >
                <View
                  style={[
                    styles.unitCard,
                    {
                      backgroundColor: isDark ? colors.surfaceSecondary : colors.surface,
                      borderRadius: radius.xl,
                      ...shadows.card,
                    },
                  ]}
                >
                  {/* Left-edge accent */}
                  <View
                    style={[
                      styles.leftAccent,
                      {
                        backgroundColor: unitComplete ? colors.success : catColor,
                        borderTopLeftRadius: radius.xl,
                        borderBottomLeftRadius: radius.xl,
                      },
                    ]}
                  />

                  {/* Unit header (tappable — toggles collapse) */}
                  <ScalePress
                    onPress={() => toggleUnit(unit.id)}
                    pressScale={0.99}
                    accessibilityLabel={`${unit.title}, ${unitProgress.completed} of ${unitProgress.total} complete. ${isCollapsed ? 'Expand' : 'Collapse'}`}
                    style={[
                      styles.unitHeader,
                      { padding: spacing.md, paddingLeft: spacing.md + 4 },
                    ]}
                  >
                    <View style={styles.unitHeaderLeft}>
                      <View
                        style={[
                          styles.unitIconWrap,
                          {
                            backgroundColor: unitComplete
                              ? colors.successMuted
                              : isDark
                                ? catColor + '20'
                                : catMuted,
                            borderRadius: radius.sm,
                          },
                        ]}
                      >
                        {unitComplete ? (
                          <Ionicons name="checkmark-circle" size={18} color={colors.success} />
                        ) : (
                          <Ionicons
                            name={unit.icon as keyof typeof Ionicons.glyphMap}
                            size={16}
                            color={catColor}
                          />
                        )}
                      </View>
                      <View style={{ marginLeft: spacing.sm, flex: 1 }}>
                        <Text style={[typography.label, { color: colors.text }]} numberOfLines={1}>
                          {unit.title}
                        </Text>
                        <Text
                          style={[typography.caption, { color: colors.textTertiary, marginTop: 1 }]}
                          numberOfLines={1}
                        >
                          {CATEGORY_SUBTITLES[unit.category] ?? unit.description}
                        </Text>
                      </View>
                    </View>

                    <View style={styles.unitHeaderRight}>
                      {/* Unit completion progress ring */}
                      <ProgressRing
                        progress={pct}
                        size={32}
                        strokeWidth={3}
                        color={unitComplete ? colors.success : catColor}
                      >
                        <Text
                          style={{
                            fontSize: 9,
                            fontWeight: '700',
                            color: unitComplete ? colors.success : catColor,
                          }}
                        >
                          {Math.round(pct * 100)}
                        </Text>
                      </ProgressRing>
                      {/* Chevron for collapse/expand */}
                      <Ionicons
                        name={isCollapsed ? 'chevron-forward' : 'chevron-down'}
                        size={16}
                        color={colors.textTertiary}
                        style={{ marginLeft: spacing.xs }}
                      />
                    </View>
                  </ScalePress>

                  {/* ProgressBar */}
                  <View style={{ paddingHorizontal: spacing.md + 4, paddingBottom: spacing.xs }}>
                    <ProgressBar
                      progress={pct}
                      color={unitComplete ? colors.success : catColor}
                      height={4}
                    />
                    <View style={styles.progressLabelRow}>
                      <Text style={[styles.progressLabel, { color: colors.textTertiary }]}>
                        {unitProgress.completed}/{unitProgress.total} lessons
                      </Text>
                    </View>
                  </View>

                  {/* Lesson timeline (collapsible) */}
                  {!isCollapsed && (
                    <View style={{ paddingTop: spacing.xxs, paddingBottom: spacing.sm }}>
                      {unitLessons.map((lesson, li) => {
                        const isCompleted = getIsCompleted(lesson.id);
                        const prevCompleted =
                          li === 0 || getIsCompleted(unitLessons[li - 1]?.id ?? '');
                        const isPremium = isLessonPremium(lesson.id);
                        const isLocked = isPremium || (li > 0 && !prevCompleted);
                        const isPremiumLocked = isPremium && !isCompleted;
                        const isNext = !isCompleted && !isLocked;
                        const isLast = li === unitLessons.length - 1;

                        return (
                          <ScalePress
                            key={lesson.id}
                            onPress={() => handleLessonPress(lesson.id)}
                            disabled={isLocked && !isPremiumLocked}
                            haptic
                            pressScale={0.98}
                            accessibilityLabel={`${lesson.title}${isCompleted ? ', completed' : isPremiumLocked ? ', premium locked' : isLocked ? ', locked' : ''}`}
                            style={[
                              styles.lessonRow,
                              {
                                paddingRight: spacing.md,
                                paddingVertical: spacing.xs,
                                backgroundColor: isNext
                                  ? isDark
                                    ? catColor + '06'
                                    : catColor + '04'
                                  : 'transparent',
                                opacity: isLocked && !isPremiumLocked ? 0.4 : 1,
                              },
                            ]}
                          >
                            {/* Timeline track */}
                            <View style={styles.timelineTrack}>
                              {li > 0 && (
                                <View
                                  style={[
                                    styles.timelineLineTop,
                                    {
                                      backgroundColor: getIsCompleted(unitLessons[li - 1]?.id ?? '')
                                        ? colors.success + '50'
                                        : colors.surfaceTertiary,
                                    },
                                  ]}
                                />
                              )}

                              <View
                                style={[
                                  styles.stepCircle,
                                  {
                                    backgroundColor: isCompleted
                                      ? colors.success
                                      : isPremiumLocked
                                        ? brand.accent
                                        : isNext
                                          ? catColor
                                          : isDark
                                            ? colors.surfaceTertiary
                                            : colors.surfaceTertiary,
                                    borderWidth: isNext ? 2.5 : 0,
                                    borderColor: isNext ? catColor + '35' : 'transparent',
                                  },
                                ]}
                              >
                                {isCompleted ? (
                                  <Ionicons name="checkmark" size={14} color="#FFF" />
                                ) : isPremiumLocked ? (
                                  <Ionicons name="diamond" size={11} color="#FFF" />
                                ) : isLocked ? (
                                  <Ionicons
                                    name="lock-closed"
                                    size={11}
                                    color={colors.textTertiary}
                                  />
                                ) : (
                                  <Text
                                    style={[
                                      styles.stepNum,
                                      { color: isNext ? '#FFF' : colors.textTertiary },
                                    ]}
                                  >
                                    {lesson.order}
                                  </Text>
                                )}
                              </View>

                              {!isLast && (
                                <View
                                  style={[
                                    styles.timelineLineBottom,
                                    {
                                      backgroundColor: isCompleted
                                        ? colors.success + '50'
                                        : colors.surfaceTertiary,
                                    },
                                  ]}
                                />
                              )}
                            </View>

                            {/* Content */}
                            <View style={[styles.lessonContent, { paddingVertical: spacing.xs }]}>
                              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <Text
                                  style={[
                                    typography.label,
                                    {
                                      color: isLocked
                                        ? colors.textTertiary
                                        : isCompleted
                                          ? colors.textSecondary
                                          : colors.text,
                                      flex: 1,
                                    },
                                  ]}
                                  numberOfLines={1}
                                >
                                  {lesson.title}
                                </Text>

                                {isCompleted ? (
                                  <View
                                    style={[
                                      styles.statusPill,
                                      {
                                        backgroundColor: colors.successMuted,
                                        borderRadius: radius.full,
                                      },
                                    ]}
                                  >
                                    <Ionicons name="checkmark" size={10} color={colors.success} />
                                    <Text style={[styles.statusText, { color: colors.success }]}>
                                      Done
                                    </Text>
                                  </View>
                                ) : isPremiumLocked ? (
                                  <View
                                    style={[
                                      styles.statusPill,
                                      {
                                        backgroundColor: brand.accent + '18',
                                        borderRadius: radius.full,
                                      },
                                    ]}
                                  >
                                    <Ionicons name="diamond" size={10} color={brand.accent} />
                                    <Text style={[styles.statusText, { color: brand.accent }]}>
                                      Premium
                                    </Text>
                                  </View>
                                ) : isNext ? (
                                  <View
                                    style={[
                                      styles.playBtn,
                                      {
                                        backgroundColor: catColor,
                                        borderRadius: radius.full,
                                      },
                                    ]}
                                  >
                                    <Ionicons name="play" size={12} color="#FFF" />
                                  </View>
                                ) : !isLocked ? (
                                  <Ionicons
                                    name="chevron-forward"
                                    size={16}
                                    color={colors.textTertiary}
                                  />
                                ) : null}
                              </View>

                              {!isCompleted && (
                                <Text
                                  style={[
                                    typography.caption,
                                    {
                                      color: colors.textTertiary,
                                      marginTop: 2,
                                      lineHeight: 16,
                                    },
                                  ]}
                                  numberOfLines={isNext ? 2 : 1}
                                >
                                  {isPremiumLocked
                                    ? 'Unlock with Sidrat Premium'
                                    : isNext
                                      ? lesson.hook.prompt
                                      : lesson.description}
                                </Text>
                              )}

                              {!isLocked && !isCompleted && (
                                <View style={[styles.metaRow, { marginTop: spacing.xxs }]}>
                                  <Ionicons
                                    name="time-outline"
                                    size={10}
                                    color={colors.textTertiary}
                                  />
                                  <Text
                                    style={[
                                      styles.chipText,
                                      { color: colors.textTertiary, marginLeft: 3 },
                                    ]}
                                  >
                                    {lesson.durationMinutes}m
                                  </Text>
                                  <View style={{ width: 8 }} />
                                  <Ionicons
                                    name="sparkles-outline"
                                    size={10}
                                    color={brand.accent}
                                  />
                                  <Text
                                    style={[
                                      styles.chipText,
                                      { color: brand.accent, marginLeft: 3 },
                                    ]}
                                  >
                                    {lesson.xpReward} XP
                                  </Text>
                                  {/* Difficulty indicator */}
                                  <View style={{ width: 8 }} />
                                  <DifficultyDots difficulty={lesson.difficulty} color={catColor} />
                                </View>
                              )}
                            </View>
                          </ScalePress>
                        );
                      })}
                    </View>
                  )}
                </View>
              </Animated.View>
            );
          })}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 12,
    gap: 16,
  },
  headerLeft: { flex: 1, minWidth: 0 },
  headerRight: { marginTop: -32 },

  // Hero card
  heroCard: { position: 'relative' },
  leftAccent: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 4,
  },
  heroContext: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  heroBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  heroBadgeText: { fontSize: 11, fontWeight: '700', marginLeft: 4 },
  heroBottom: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  heroMeta: { flexDirection: 'row', alignItems: 'center' },
  heroMetaItem: { flexDirection: 'row', alignItems: 'center' },
  heroMetaText: { fontSize: 13, fontWeight: '500', marginLeft: 4 },
  heroCta: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  heroCtaText: { color: '#FFF', fontSize: 14, fontWeight: '700', marginLeft: 6 },

  // Unit card
  unitCard: { overflow: 'hidden', position: 'relative' },
  unitHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  unitHeaderLeft: { flexDirection: 'row', alignItems: 'center', flex: 1, marginRight: 12 },
  unitHeaderRight: { flexDirection: 'row', alignItems: 'center' },
  unitIconWrap: { width: 32, height: 32, alignItems: 'center', justifyContent: 'center' },

  // Progress label row under ProgressBar
  progressLabelRow: { flexDirection: 'row', justifyContent: 'flex-end', marginTop: 4 },
  progressLabel: { fontSize: 10, fontWeight: '500' },

  // Timeline layout
  lessonRow: { flexDirection: 'row', alignItems: 'stretch' },
  timelineTrack: { width: 52, alignItems: 'center', position: 'relative' },
  timelineLineTop: { width: 2, flex: 1, borderRadius: 1 },
  timelineLineBottom: { width: 2, flex: 1, borderRadius: 1 },
  stepCircle: {
    width: 28,
    height: 28,
    borderRadius: 9999,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  stepNum: { fontSize: 12, fontWeight: '700' },
  lessonContent: { flex: 1 },

  // Meta
  metaRow: { flexDirection: 'row', alignItems: 'center' },
  chipText: { fontSize: 10, fontWeight: '600' },

  // Difficulty dots
  diffDots: { flexDirection: 'row', alignItems: 'center', gap: 3 },
  diffDot: { width: 5, height: 5, borderRadius: 2.5 },

  // Status
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 3,
    gap: 3,
  },
  statusText: { fontSize: 10, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5 },
  playBtn: { width: 28, height: 28, alignItems: 'center', justifyContent: 'center' },
});
