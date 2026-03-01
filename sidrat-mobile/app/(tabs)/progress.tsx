/**
 * Progress Screen — Oasis Design Spec §8.4
 *
 * Feel: Proud, reflective, motivating to continue.
 * Sand50 → cream → olive50 gradient background.
 * Stats cards → Istiqamah calendar → Weekly goal → Overall progress
 * → Category mastery → Achievements grid.
 */

import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useMemo, useState, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  RefreshControl,
  Dimensions,
  type TextStyle,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  useAnimatedReaction,
  withSpring,
  withTiming,
  withDelay,
  withRepeat,
  runOnJS,
  FadeIn,
  FadeInDown,
  Easing,
} from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ProgressRing, EmptyState, ProgressSkeletonLoader } from '../../src/components';
import { JuicyPressable } from '../../src/components/common/JuicyPressable';
import { CategoryBreakdownChart } from '../../src/components/progress';
import { allCurriculumLessons } from '../../src/data/curriculum';
import {
  useAppStore,
  useChildStore,
  useLessonStore,
  useAchievementStore,
  ACHIEVEMENTS,
} from '../../src/stores';
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
import type { AchievementDef, AchievementContext } from '../../src/stores/achievementStore';
import type { LessonCategory } from '../../src/types';

// ── Constants ────────────────────────────────────────────────────

const SCREEN_WIDTH = Dimensions.get('window').width;

const ACHIEVEMENT_ICONS: Record<string, keyof typeof Ionicons.glyphMap> = {
  first_lesson: 'leaf-outline',
  five_lessons: 'book-outline',
  ten_lessons: 'star-outline',
  twenty_lessons: 'trophy-outline',
  all_categories: 'compass-outline',
  streak_3: 'flame-outline',
  streak_7: 'fitness-outline',
  streak_14: 'flash-outline',
  streak_30: 'medal-outline',
  first_review: 'refresh-outline',
  wudu_master: 'water-outline',
  aqeedah_scholar: 'star',
  salah_hero: 'heart-outline',
  xp_100: 'ribbon-outline',
  xp_500: 'moon-outline',
  xp_1000: 'sparkles-outline',
};

/** Rarity label text colors — Oasis palette */
const RARITY_LABEL_COLORS: Record<AchievementDef['rarity'], string> = {
  bronze: tokens.color.sand400,
  silver: tokens.color.sky500,
  gold: tokens.color.olive400,
  platinum: tokens.color.gold500,
};

/** Rarity icon background — light tint per rarity */
const RARITY_ICON_BG: Record<AchievementDef['rarity'], string> = {
  bronze: tokens.color.sand100,
  silver: tokens.color.sky50,
  gold: tokens.color.olive50,
  platinum: tokens.color.gold50,
};

/** Rarity icon color — solid per rarity */
const RARITY_ICON_COLOR: Record<AchievementDef['rarity'], string> = {
  bronze: tokens.color.sand400,
  silver: tokens.color.sky500,
  gold: tokens.color.olive400,
  platinum: tokens.color.gold500,
};

const RARITY_LABELS: Record<AchievementDef['rarity'], string> = {
  bronze: 'Bronze',
  silver: 'Silver',
  gold: 'Gold',
  platinum: 'Platinum',
};

// ── AnimatedCounter – smooth number rolling (§ stats cards) ─────

function AnimatedCounter({ value, style }: { value: number; style: TextStyle }) {
  const [display, setDisplay] = useState(0);
  const anim = useSharedValue(0);

  useAnimatedReaction(
    () => Math.round(anim.value),
    (current, previous) => {
      if (current !== previous) {
        runOnJS(setDisplay)(current);
      }
    },
  );

  useEffect(() => {
    anim.value = withTiming(value, {
      duration: 800,
      easing: Easing.out(Easing.cubic),
    });
  }, [value, anim]);

  return <Text style={style}>{display}</Text>;
}

// ── TodayPulse – olive300 glow for today's incomplete circle ────

function TodayPulse({ size }: { size: number }) {
  const opacity = useSharedValue(0.4);

  useEffect(() => {
    opacity.value = withRepeat(withTiming(1, { duration: 750 }), -1, true);
  }, [opacity]);

  const pulseStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return (
    <Animated.View
      style={[
        {
          position: 'absolute',
          width: size + 8,
          height: size + 8,
          borderRadius: (size + 8) / 2,
          backgroundColor: tokens.color.olive300,
        },
        pulseStyle,
      ]}
    />
  );
}

// CrescentDay replaced by MiniCrescent (see src/components/home/MiniCrescent.tsx)

// ── AchievementBadge ────────────────────────────────────────────

function AchievementBadge({
  ach,
  isUnlocked,
  index,
  itemWidth,
}: {
  ach: AchievementDef;
  isUnlocked: boolean;
  index: number;
  itemWidth: number;
}) {
  const { isDark } = useTheme();
  const sem = isDark ? darkSemanticColors : semanticColors;

  const scale = useSharedValue(0.5);

  useEffect(() => {
    scale.value = withDelay(index * 60, withSpring(1, SPRINGS.bouncy));
  }, [index, scale]);

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: scale.value,
  }));

  const iconBg = isDark ? RARITY_ICON_COLOR[ach.rarity] + '25' : RARITY_ICON_BG[ach.rarity];
  const iconColor = RARITY_ICON_COLOR[ach.rarity];

  const content = isUnlocked ? (
    <>
      <LinearGradient
        colors={
          isDark
            ? [tokens.color.gold500 + '25', tokens.color.gold500 + '15']
            : [tokens.color.gold50, tokens.color.gold100]
        }
        style={[StyleSheet.absoluteFill, { borderRadius: RADIUS.lg }]}
      />
      <View style={[styles.achIconCircle, { backgroundColor: iconBg }]}>
        <Ionicons
          name={ACHIEVEMENT_ICONS[ach.id] ?? 'ribbon-outline'}
          size={20}
          color={iconColor}
        />
      </View>
      <Text
        style={[styles.achName, { color: sem.textPrimary }]}
        numberOfLines={2}
        ellipsizeMode="tail"
      >
        {ach.title}
      </Text>
      <Text style={[styles.achRarity, { color: RARITY_LABEL_COLORS[ach.rarity] }]}>
        {RARITY_LABELS[ach.rarity]}
      </Text>
    </>
  ) : (
    <>
      <Ionicons name="lock-closed-outline" size={24} color={tokens.color.sand300} />
      <Text
        style={[styles.achName, { color: tokens.color.sand300 }]}
        numberOfLines={2}
        ellipsizeMode="tail"
      >
        {ach.title}
      </Text>
    </>
  );

  return (
    <Animated.View style={[{ width: itemWidth }, animStyle]}>
      {isUnlocked ? (
        <JuicyPressable
          accessibilityLabel={`${ach.title}, ${RARITY_LABELS[ach.rarity]}, unlocked`}
          accessibilityRole="button"
          style={[
            styles.achCard,
            {
              borderColor: tokens.color.gold200,
              borderWidth: 2,
              borderRadius: RADIUS.lg,
              overflow: 'hidden',
            },
          ]}
        >
          {content}
        </JuicyPressable>
      ) : (
        <View
          accessible
          accessibilityRole="text"
          accessibilityLabel={`${ach.title}, locked`}
          style={[
            styles.achCard,
            {
              backgroundColor: isDark ? tokens.color.earth800 : tokens.color.sand50,
              borderColor: isDark ? tokens.color.earth700 : tokens.color.sand200,
              borderWidth: 1.5,
              borderRadius: RADIUS.lg,
            },
          ]}
        >
          {content}
        </View>
      )}
    </Animated.View>
  );
}

// ── Main Screen ─────────────────────────────────────────────────

export default function ProgressScreen() {
  const { isDark, typography, brand, colors } = useTheme();
  const sem = isDark ? darkSemanticColors : semanticColors;

  const [isReady, setIsReady] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const onRefresh = useCallback(() => {
    haptic.light();
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 600);
  }, []);

  const activeChildId = useAppStore((s) => s.activeChildId);
  const child = useChildStore((s) => s.children.find((c) => c.id === activeChildId));

  const progress = useLessonStore((s) => s.progress);
  const completedByCategory = useMemo(() => {
    if (!activeChildId) return null;
    const categoryMap = new Map<string, LessonCategory>();
    for (const l of allCurriculumLessons) categoryMap.set(l.id, l.category);
    const counts: Record<LessonCategory, number> = {
      aqeedah: 0,
      salah: 0,
      wudu: 0,
      quran: 0,
      seerah: 0,
      adab: 0,
      duaa: 0,
      stories: 0,
    };
    for (const p of Object.values(progress)) {
      if (p.childId !== activeChildId || !p.isCompleted) continue;
      const cat = categoryMap.get(p.lessonId);
      if (cat) counts[cat]++;
    }
    return counts;
  }, [activeChildId, progress]);

  const totalPerCategory = useMemo(() => {
    const counts: Record<LessonCategory, number> = {
      aqeedah: 0,
      salah: 0,
      wudu: 0,
      quran: 0,
      seerah: 0,
      adab: 0,
      duaa: 0,
      stories: 0,
    };
    for (const l of allCurriculumLessons) counts[l.category]++;
    return counts;
  }, []);

  const checkAchievements = useAchievementStore((s) => s.checkAchievements);
  const achievementCtx = useMemo<AchievementContext | null>(() => {
    if (!child || !activeChildId) return null;
    const completedLessonIds: string[] = [];
    const completedCategoriesSet = new Set<LessonCategory>();
    const categoryMap = new Map<string, LessonCategory>();
    for (const l of allCurriculumLessons) categoryMap.set(l.id, l.category);
    for (const p of Object.values(progress)) {
      if (p.childId !== activeChildId || !p.isCompleted) continue;
      completedLessonIds.push(p.lessonId);
      const cat = categoryMap.get(p.lessonId);
      if (cat) completedCategoriesSet.add(cat);
    }
    return {
      child,
      completedLessonIds,
      completedCategories: completedCategoriesSet,
      reviewCount: 0,
    };
  }, [child, activeChildId, progress]);

  const unlockedSet = useMemo(() => {
    if (!achievementCtx) return new Set<string>();
    const set = new Set<string>();
    for (const ach of ACHIEVEMENTS) {
      try {
        if (ach.check(achievementCtx)) set.add(ach.id);
      } catch {
        /* ignore */
      }
    }
    return set;
  }, [achievementCtx]);

  const unlockedCount = unlockedSet.size;

  useEffect(() => {
    if (achievementCtx) checkAchievements(achievementCtx);
  }, [achievementCtx, checkAchievements]);

  const streakDays = useMemo(() => {
    const today = new Date();
    const dayLabels3 = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const fullLabels = [
      'Sunday',
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
    ];
    const streak = child?.currentStreak ?? 0;
    const days: { label: string; fullLabel: string; active: boolean; isToday: boolean }[] = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      days.push({
        label: dayLabels3[d.getDay()]!,
        fullLabel: fullLabels[d.getDay()]!,
        active: i < streak,
        isToday: i === 0,
      });
    }
    return days;
  }, [child?.currentStreak]);

  // Show skeleton on initial mount
  useEffect(() => {
    const timer = setTimeout(() => setIsReady(true), 300);
    return () => clearTimeout(timer);
  }, []);

  if (!isReady) {
    return (
      <SafeAreaView style={styles.safe}>
        <ProgressSkeletonLoader />
      </SafeAreaView>
    );
  }

  // ── No child selected ──
  if (!child) {
    return (
      <SafeAreaView style={[styles.safe, { backgroundColor: sem.background }]}>
        <EmptyState
          icon="analytics-outline"
          title="No profile selected"
          subtitle={'Create a child profile to start\ntracking their learning journey.'}
        />
      </SafeAreaView>
    );
  }

  const xpInLevel = child.totalXP % 100;
  const level = Math.floor(child.totalXP / 100) + 1;
  const totalLessons = Object.values(totalPerCategory).reduce((a, b) => a + b, 0);
  const overallProgress = totalLessons > 0 ? child.totalLessonsCompleted / totalLessons : 0;

  const rarityOrder: AchievementDef['rarity'][] = ['platinum', 'gold', 'silver', 'bronze'];
  const sortedAchievements = [...ACHIEVEMENTS].sort((a, b) => {
    const aUnlocked = unlockedSet.has(a.id) ? 0 : 1;
    const bUnlocked = unlockedSet.has(b.id) ? 0 : 1;
    if (aUnlocked !== bUnlocked) return aUnlocked - bUnlocked;
    return rarityOrder.indexOf(a.rarity) - rarityOrder.indexOf(b.rarity);
  });

  // ── Gradients ──
  const bgColors = isDark
    ? ([tokens.color.earth900, tokens.color.darkGradientMid, tokens.color.darkGradientEnd] as const)
    : ([tokens.color.sand50, tokens.color.cream, tokens.color.olive50] as const);

  const headerColors = isDark
    ? ([tokens.color.earth900, '#1F1D1A'] as const)
    : ([tokens.color.olive50, tokens.color.cream] as const);

  return (
    <SafeAreaView style={styles.safe} edges={['left', 'right']}>
      <LinearGradient colors={bgColors} style={styles.safe}>
        <ScrollView
          contentContainerStyle={{ paddingBottom: 100 }}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={tokens.color.olive400}
            />
          }
        >
          {/* ── Page Header (matches Family / Learn style) ── */}
          <Animated.View entering={FadeIn.duration(400)}>
            <LinearGradient
              colors={headerColors}
              start={{ x: 0, y: 0 }}
              end={{ x: 0, y: 1 }}
              style={[
                styles.profileHeader,
                {
                  paddingHorizontal: SPACING.md,
                  paddingTop: SPACING.xxl + 54,
                  paddingBottom: SPACING.lg,
                },
              ]}
            >
              {/* Title row */}
              <View style={styles.profileRow}>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.headerPageTitle, { color: sem.textPrimary }]}>Progress</Text>
                  <Text style={[styles.headerPageSubtitle, { color: sem.textMuted }]}>
                    {child.name}&apos;s learning journey
                  </Text>
                </View>
                <View
                  style={[
                    styles.levelBadge,
                    {
                      backgroundColor: isDark ? tokens.color.earth700 : tokens.color.sand100,
                      borderRadius: RADIUS.full,
                      borderColor: isDark ? tokens.color.earth700 : tokens.color.sand200,
                      borderWidth: 1,
                    },
                  ]}
                >
                  <Ionicons name="star" size={12} color={tokens.color.gold500} />
                  <Text
                    style={{
                      fontWeight: '700',
                      fontSize: 12,
                      color: tokens.color.gold600,
                      marginLeft: 4,
                    }}
                  >
                    Level {level}
                  </Text>
                </View>
              </View>

              {/* Hasanat XP bar — Oasis gold palette */}
              <View style={{ marginTop: SPACING.md }}>
                <View
                  style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 }}
                >
                  <Text style={{ fontWeight: '600', fontSize: 12, color: sem.textMuted }}>
                    Hasanat
                  </Text>
                  <Text style={{ fontWeight: '700', fontSize: 12, color: tokens.color.gold600 }}>
                    {xpInLevel}/100
                  </Text>
                </View>
                <View
                  style={[
                    styles.xpBar,
                    {
                      backgroundColor: isDark ? tokens.color.earth700 : tokens.color.sand100,
                      borderRadius: RADIUS.full,
                    },
                  ]}
                >
                  <View
                    style={[
                      styles.xpFill,
                      {
                        backgroundColor: tokens.color.gold400,
                        borderRadius: RADIUS.full,
                        width: `${Math.min(xpInLevel / 100, 1) * 100}%` as `${number}%`,
                      },
                    ]}
                  />
                </View>
              </View>
            </LinearGradient>
            {/* Curved overlap */}
            <View
              style={{
                height: 24,
                marginTop: -24,
                backgroundColor: isDark ? tokens.color.earth900 : tokens.color.sand50,
                borderTopLeftRadius: RADIUS.xl,
                borderTopRightRadius: RADIUS.xl,
              }}
            />
          </Animated.View>

          {/* ── Stats Cards (3 equal-width) ── */}
          <Animated.View
            entering={FadeInDown.delay(100).duration(400)}
            style={[styles.statsRow, { paddingHorizontal: SPACING.lg, marginTop: SPACING.lg }]}
          >
            {/* Istiqamah (Streak) */}
            <View
              style={[
                styles.statCard,
                {
                  borderColor: sem.surfaceBorder,
                  backgroundColor: sem.surface,
                  ...SHADOW.rnSm,
                },
              ]}
              accessible
              accessibilityLabel={`${child.currentStreak} day streak`}
            >
              <Ionicons name="flame" size={22} color={tokens.color.gold600} />
              <AnimatedCounter
                value={child.currentStreak}
                style={{
                  fontWeight: '700',
                  fontSize: 28,
                  color: tokens.color.gold600,
                  marginTop: 4,
                }}
              />
              <Text style={[styles.statLabel, { color: sem.textMuted }]}>day streak</Text>
            </View>

            {/* Hasanat (XP) */}
            <View
              style={[
                styles.statCard,
                {
                  borderColor: sem.surfaceBorder,
                  backgroundColor: sem.surface,
                  ...SHADOW.rnSm,
                },
              ]}
              accessible
              accessibilityLabel={`${child.totalXP} hasanat`}
            >
              <Ionicons name="star" size={22} color={tokens.color.gold500} />
              <AnimatedCounter
                value={child.totalXP}
                style={{
                  fontWeight: '700',
                  fontSize: 28,
                  color: tokens.color.gold500,
                  marginTop: 4,
                }}
              />
              <Text style={[styles.statLabel, { color: sem.textMuted }]}>hasanat</Text>
            </View>

            {/* Lessons */}
            <View
              style={[
                styles.statCard,
                {
                  borderColor: sem.surfaceBorder,
                  backgroundColor: sem.surface,
                  ...SHADOW.rnSm,
                },
              ]}
              accessible
              accessibilityLabel={`${child.totalLessonsCompleted} lessons`}
            >
              <Ionicons name="book" size={22} color={tokens.color.olive400} />
              <AnimatedCounter
                value={child.totalLessonsCompleted}
                style={{
                  fontWeight: '700',
                  fontSize: 28,
                  color: tokens.color.gold500,
                  marginTop: 4,
                }}
              />
              <Text style={[styles.statLabel, { color: sem.textMuted }]}>lessons</Text>
            </View>
          </Animated.View>

          {/* ── Istiqamah Calendar ── */}
          <Animated.View
            entering={FadeInDown.delay(180).duration(400)}
            style={{ paddingHorizontal: SPACING.lg, marginTop: SPACING.xl }}
          >
            <Text style={[styles.sectionLabel, { color: sem.textMuted }]}>Istiqamah</Text>
            <View
              style={[
                styles.calendarCard,
                {
                  backgroundColor: sem.surface,
                  borderColor: sem.surfaceBorder,
                  ...SHADOW.rnSm,
                },
              ]}
            >
              {child.currentStreak === 0 && (
                <View
                  style={[
                    styles.emptyInline,
                    {
                      backgroundColor: isDark ? tokens.color.earth800 : tokens.color.sand50,
                      borderColor: sem.surfaceBorder,
                      marginBottom: SPACING.md,
                    },
                  ]}
                >
                  <Ionicons name="moon" size={24} color={sem.textSecondary} />
                  <Text style={[styles.emptyText, { color: sem.textSecondary, marginTop: 4 }]}>
                    Start your first lesson to begin your streak!
                  </Text>
                </View>
              )}
              <View style={styles.calendarRow}>
                {streakDays.map((day, i) => (
                  <View
                    key={i}
                    style={styles.dayCol}
                    accessible
                    accessibilityRole="image"
                    accessibilityLabel={`${day.fullLabel}${day.isToday ? ', today' : ''}${day.active ? ', completed' : ''}`}
                  >
                    {day.active ? (
                      <Ionicons name="moon" size={24} color={brand.secondary} />
                    ) : day.isToday ? (
                      <Ionicons
                        name="moon-outline"
                        size={24}
                        color={brand.secondaryLight ?? brand.secondary}
                      />
                    ) : (
                      <Ionicons
                        name="moon-outline"
                        size={24}
                        color={isDark ? 'rgba(255,255,255,0.18)' : colors.textTertiary + '35'}
                      />
                    )}
                    <Text
                      style={[
                        styles.dayLabel,
                        {
                          color: day.active || day.isToday ? sem.textSecondary : sem.textMuted,
                          fontWeight: day.isToday ? '600' : '400',
                        },
                      ]}
                    >
                      {day.label}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          </Animated.View>

          {/* ── Overall Progress ── */}
          <Animated.View
            entering={FadeInDown.delay(340).duration(400)}
            style={{ paddingHorizontal: SPACING.lg, marginTop: SPACING.xl }}
          >
            <Text style={[styles.sectionLabel, { color: sem.textMuted }]}>Overall Progress</Text>
            {child.totalLessonsCompleted === 0 ? (
              <View
                style={[
                  styles.emptyCard,
                  {
                    backgroundColor: isDark
                      ? darkSemanticColors.primaryLight
                      : tokens.color.olive50,
                    borderColor: sem.surfaceBorder,
                  },
                ]}
              >
                <Ionicons name="book" size={28} color={sem.textSecondary} />
                <Text style={[styles.emptyText, { color: sem.textSecondary }]}>
                  Complete your first lesson to see your progress here!
                </Text>
              </View>
            ) : (
              <View
                style={[
                  styles.sectionCard,
                  {
                    backgroundColor: sem.surface,
                    borderColor: sem.surfaceBorder,
                    ...SHADOW.rnSm,
                  },
                ]}
              >
                <View style={styles.overallRow}>
                  <ProgressRing
                    progress={overallProgress}
                    size={64}
                    strokeWidth={5}
                    color={tokens.color.olive400}
                    trackColor={isDark ? tokens.color.earth700 : tokens.color.sand100}
                  >
                    <Text
                      style={{
                        fontWeight: '600',
                        fontSize: 15,
                        color: tokens.color.olive400,
                      }}
                    >
                      {Math.round(overallProgress * 100)}%
                    </Text>
                  </ProgressRing>
                  <View style={{ marginLeft: SPACING.md, flex: 1 }}>
                    <Text style={[typography.label, { color: sem.textPrimary }]}>
                      {child.totalLessonsCompleted} of {totalLessons} lessons
                    </Text>
                    <Text
                      style={[typography.bodySmall, { color: sem.textSecondary, marginTop: 4 }]}
                    >
                      {overallProgress >= 1
                        ? 'All done!'
                        : overallProgress >= 0.5
                          ? 'More than halfway!'
                          : 'Keep learning — every lesson counts.'}
                    </Text>
                    <View style={[styles.milestoneRow, { marginTop: SPACING.sm }]}>
                      {[0.25, 0.5, 0.75, 1].map((m) => (
                        <View key={m} style={styles.milestoneItem}>
                          <View
                            style={[
                              styles.milestoneDot,
                              {
                                backgroundColor:
                                  overallProgress >= m
                                    ? tokens.color.olive400
                                    : isDark
                                      ? tokens.color.earth700
                                      : tokens.color.sand100,
                                borderRadius: RADIUS.full,
                              },
                            ]}
                          >
                            {overallProgress >= m && (
                              <Ionicons name="checkmark" size={8} color={tokens.color.white} />
                            )}
                          </View>
                          <Text
                            style={[
                              typography.caption,
                              { color: sem.textMuted, marginTop: 2, fontSize: 10 },
                            ]}
                          >
                            {Math.round(m * 100)}%
                          </Text>
                        </View>
                      ))}
                    </View>
                  </View>
                </View>
              </View>
            )}
          </Animated.View>

          {/* ── Category Mastery ── */}
          <Animated.View
            entering={FadeInDown.delay(420).duration(400)}
            style={{ paddingHorizontal: SPACING.lg, marginTop: SPACING.xl }}
          >
            <Text style={[styles.sectionLabel, { color: sem.textMuted }]}>Category Mastery</Text>
            <View style={{ marginTop: SPACING.xs }}>
              <CategoryBreakdownChart
                data={
                  completedByCategory ?? {
                    aqeedah: 0,
                    salah: 0,
                    wudu: 0,
                    quran: 0,
                    seerah: 0,
                    adab: 0,
                    duaa: 0,
                    stories: 0,
                  }
                }
                totalPerCategory={totalPerCategory}
              />
            </View>
          </Animated.View>

          {/* ── Achievements ── */}
          <Animated.View
            entering={FadeInDown.delay(500).duration(400)}
            style={{ marginTop: SPACING.xl }}
          >
            <View style={[styles.achTitleRow, { paddingHorizontal: SPACING.lg }]}>
              <Text style={[styles.sectionLabel, { color: sem.textMuted, marginBottom: 0 }]}>
                Achievements
              </Text>
              <View
                style={[
                  styles.achCountBadge,
                  {
                    backgroundColor: isDark ? tokens.color.gold500 + '20' : tokens.color.gold50,
                    borderRadius: RADIUS.full,
                  },
                ]}
              >
                <Text style={{ fontWeight: '700', fontSize: 12, color: tokens.color.gold500 }}>
                  {unlockedCount}/{ACHIEVEMENTS.length}
                </Text>
              </View>
            </View>

            {unlockedCount === 0 && ACHIEVEMENTS.length > 0 ? (
              <View style={{ paddingHorizontal: SPACING.lg }}>
                <View
                  style={[
                    styles.emptyCard,
                    {
                      backgroundColor: isDark ? darkSemanticColors.rewardBg : tokens.color.gold50,
                      borderColor: sem.surfaceBorder,
                      marginTop: SPACING.sm,
                    },
                  ]}
                >
                  <Ionicons name="trophy" size={28} color={tokens.color.gold500} />
                  <Text style={[styles.emptyText, { color: sem.textSecondary }]}>
                    Complete lessons to unlock your first achievement!
                  </Text>
                </View>
              </View>
            ) : (
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                scrollEventThrottle={16}
                contentContainerStyle={styles.achScrollContent}
                style={{ marginTop: SPACING.sm }}
              >
                {sortedAchievements.slice(0, 6).map((ach, index) => (
                  <AchievementBadge
                    key={ach.id}
                    ach={ach}
                    isUnlocked={unlockedSet.has(ach.id)}
                    index={index}
                    itemWidth={SCREEN_WIDTH * 0.32}
                  />
                ))}
              </ScrollView>
            )}
          </Animated.View>

          <View style={{ height: SPACING.xxl }} />
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
}

// ── Styles ──────────────────────────────────────────────────────

const styles = StyleSheet.create({
  safe: { flex: 1 },

  // ── Profile Header ──
  profileHeader: { overflow: 'hidden' },
  profileRow: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between' },
  headerPageTitle: {
    fontFamily: 'Nunito-Bold',
    fontSize: 26,
    fontWeight: '700',
    lineHeight: 32,
  },
  headerPageSubtitle: {
    fontFamily: 'Nunito-Regular',
    fontSize: 14,
    lineHeight: 20,
    marginTop: 2,
  },
  levelBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginTop: 6,
  },
  xpBar: { width: '100%', height: 6, overflow: 'hidden' },
  xpFill: { height: '100%' },

  // ── Stats Cards ──
  statsRow: { flexDirection: 'row', gap: SPACING.sm },
  statCard: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: SPACING.md,
    borderRadius: RADIUS.lg,
    borderWidth: 1.5,
  },
  statLabel: { fontWeight: '400', fontSize: 14, marginTop: 2 },

  // ── Section Labels ──
  sectionLabel: {
    fontWeight: '700',
    fontSize: 12,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    marginBottom: SPACING.sm,
  },

  // ── Section Card (shared by Weekly Goal, Overall, Calendar) ──
  sectionCard: {
    borderRadius: RADIUS.lg,
    borderWidth: 1.5,
    padding: SPACING.md,
  },

  // ── Istiqamah Calendar ──
  calendarCard: {
    borderRadius: RADIUS.lg,
    borderWidth: 1.5,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.md,
  },
  calendarRow: { flexDirection: 'row', justifyContent: 'space-between' },
  dayCol: { alignItems: 'center' },
  dayCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  todayStar: { position: 'absolute', bottom: -2, right: -2 },
  dayLabel: { fontWeight: '400', fontSize: 12, marginTop: 4 },

  // ── Weekly Goal ──
  weekGoalRow: { flexDirection: 'row', alignItems: 'center' },
  miniBar: { height: 4, overflow: 'hidden' },
  miniBarFill: { height: '100%' },

  // ── Overall Progress ──
  overallRow: { flexDirection: 'row', alignItems: 'center' },
  milestoneRow: { flexDirection: 'row', justifyContent: 'space-between' },
  milestoneItem: { alignItems: 'center' },
  milestoneDot: {
    width: 16,
    height: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // ── Empty States ──
  emptyCard: {
    borderRadius: RADIUS.lg,
    borderWidth: 1.5,
    padding: SPACING.lg,
    alignItems: 'center',
  },
  emptyInline: {
    borderRadius: RADIUS.md,
    borderWidth: 1,
    padding: SPACING.md,
    alignItems: 'center',
  },
  emptyText: { fontWeight: '400', fontSize: 16, textAlign: 'center', marginTop: SPACING.sm },

  // ── Achievements Grid ──
  achTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: SPACING.sm,
  },
  achCountBadge: { paddingHorizontal: 10, paddingVertical: 3 },
  achGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.sm },
  achScrollContent: {
    paddingHorizontal: SPACING.lg,
    gap: SPACING.sm,
  },
  achCard: {
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.sm,
    alignItems: 'center',
    height: 120,
    justifyContent: 'center',
    overflow: 'hidden',
  },
  achIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  achName: { fontWeight: '700', fontSize: 13, textAlign: 'center', marginTop: 6 },
  achRarity: { fontWeight: '400', fontSize: 11, marginTop: 2 },
});
