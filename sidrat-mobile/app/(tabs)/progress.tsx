/**
 * Progress Screen — Profile-centric dashboard
 *
 * Profile header on gradient → circular stat badges → standalone streak row
 * → weekly goal → overall progress → category chart (no card) → horizontal achievements.
 */

import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useMemo, useState, useCallback } from 'react';
import { View, Text, ScrollView, StyleSheet, RefreshControl } from 'react-native';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Card, Avatar, ProgressRing, EmptyState } from '../../src/components';
import { CategoryBreakdownChart } from '../../src/components/progress';
import { allCurriculumLessons } from '../../src/data/curriculum';
import {
  useAppStore,
  useChildStore,
  useLessonStore,
  useAchievementStore,
  ACHIEVEMENTS,
} from '../../src/stores';
import { useTheme, brand as brandTokens } from '../../src/theme';
import { getAge } from '../../src/types';
import type { AchievementDef, AchievementContext } from '../../src/stores/achievementStore';
import type { LessonCategory } from '../../src/types';

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

const RARITY_COLORS: Record<AchievementDef['rarity'], string> = {
  bronze: '#CD7F32',
  silver: '#8A9FAE',
  gold: brandTokens.accent,
  platinum: '#8B78C8',
};

const RARITY_BG: Record<AchievementDef['rarity'], string> = {
  bronze: '#CD7F3210',
  silver: '#8A9FAE10',
  gold: brandTokens.accentMuted,
  platinum: '#8B78C810',
};

const RARITY_LABELS: Record<AchievementDef['rarity'], string> = {
  bronze: 'Bronze',
  silver: 'Silver',
  gold: 'Gold',
  platinum: 'Platinum',
};

function getMotivation(child: {
  currentStreak: number;
  totalLessonsCompleted: number;
  totalXP: number;
}): string {
  if (child.currentStreak >= 7) return 'Incredible dedication this week!';
  if (child.currentStreak >= 3) return 'Great consistency, keep it up!';
  if (child.totalLessonsCompleted >= 10) return 'A true knowledge seeker.';
  if (child.totalLessonsCompleted >= 5) return 'Making wonderful progress.';
  if (child.totalLessonsCompleted >= 1) return 'Off to a beautiful start!';
  return 'Begin your learning journey today.';
}

export default function ProgressScreen() {
  const { brand, colors, typography, spacing, radius, gradients, isDark } = useTheme();

  // Move hooks before any conditional returns
  const [refreshing, setRefreshing] = useState(false);
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 600);
  }, []);

  const activeChildId = useAppStore((s) => s.activeChildId);
  const child = useChildStore((s) => s.children.find((c) => c.id === activeChildId));
  const completedCount = useLessonStore((s) =>
    activeChildId ? s.getCompletedCount(activeChildId) : 0,
  );

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
      } catch {}
    }
    return set;
  }, [achievementCtx]);

  const unlockedCount = unlockedSet.size;
  useEffect(() => {
    if (achievementCtx) checkAchievements(achievementCtx);
  }, [achievementCtx, checkAchievements]);

  const streakDays = useMemo(() => {
    const today = new Date();
    const shortLabels = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
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
        label: shortLabels[d.getDay()]!,
        fullLabel: fullLabels[d.getDay()]!,
        active: i < streak,
        isToday: i === 0,
      });
    }
    return days;
  }, [child?.currentStreak]);

  if (!child) {
    return (
      <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]}>
        <EmptyState
          icon="analytics-outline"
          title="No profile selected"
          subtitle={'Create a child profile to start\ntracking their learning journey.'}
        />
      </SafeAreaView>
    );
  }

  const weekProgress = Math.min(completedCount / 5, 1);
  const xpInLevel = child.totalXP % 100;
  const level = Math.floor(child.totalXP / 100) + 1;
  const totalLessons = Object.values(totalPerCategory).reduce((a, b) => a + b, 0);
  const overallProgress = totalLessons > 0 ? child.totalLessonsCompleted / totalLessons : 0;

  const STATS = [
    { icon: 'flame' as const, value: child.currentStreak, label: 'Streak', color: brand.coral },
    { icon: 'trophy' as const, value: child.longestStreak, label: 'Best', color: brand.accent },
    {
      icon: 'book' as const,
      value: child.totalLessonsCompleted,
      label: 'Lessons',
      color: brand.primary,
    },
    { icon: 'ribbon' as const, value: unlockedCount, label: 'Badges', color: brand.lavender },
    { icon: 'sparkles' as const, value: child.totalXP, label: 'XP', color: brand.secondary },
  ] as const;

  const rarityOrder: AchievementDef['rarity'][] = ['platinum', 'gold', 'silver', 'bronze'];
  const sortedAchievements = [...ACHIEVEMENTS].sort((a, b) => {
    const aUnlocked = unlockedSet.has(a.id) ? 0 : 1;
    const bUnlocked = unlockedSet.has(b.id) ? 0 : 1;
    if (aUnlocked !== bUnlocked) return aUnlocked - bUnlocked;
    return rarityOrder.indexOf(a.rarity) - rarityOrder.indexOf(b.rarity);
  });

  const delay = (i: number) => Math.min(100 + i * 80, 400);

  return (
    <SafeAreaView
      style={[styles.safe, { backgroundColor: colors.background }]}
      edges={['left', 'right']}
    >
      <ScrollView
        contentContainerStyle={{ paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={brand.primary} />
        }
      >
        {/* ── Profile-centric header ── */}
        <Animated.View entering={FadeIn.duration(400)}>
          <LinearGradient
            colors={gradients.progressHero as readonly [string, string]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={[
              styles.profileHeader,
              {
                paddingHorizontal: spacing.lg,
                paddingTop: spacing.xl + 54,
                paddingBottom: spacing.lg,
              },
            ]}
          >
            <View style={styles.profileRow}>
              <View style={styles.avatarRing}>
                <Avatar avatarId={child.avatarId} size={60} />
              </View>
              <View style={{ marginLeft: spacing.md, flex: 1 }}>
                <Text style={[typography.title1, { color: '#FFF' }]}>{child.name}</Text>
                <Text
                  style={[typography.bodySmall, { color: 'rgba(255,255,255,0.75)', marginTop: 2 }]}
                >
                  {getAge(child.birthYear)} years old
                </Text>
                <Text
                  style={[
                    typography.caption,
                    { color: 'rgba(255,255,255,0.6)', marginTop: 6, fontStyle: 'italic' },
                  ]}
                >
                  {getMotivation(child)}
                </Text>
              </View>
            </View>
            <View style={[styles.levelSection, { marginTop: spacing.md }]}>
              <View
                style={[
                  styles.levelBadge,
                  { backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: radius.full },
                ]}
              >
                <Ionicons name="star" size={12} color="#FFF" />
                <Text style={[typography.captionBold, { color: '#FFF', marginLeft: 4 }]}>
                  Level {level}
                </Text>
              </View>
              <Text style={[typography.caption, { color: 'rgba(255,255,255,0.8)' }]}>
                {xpInLevel}/100 XP
              </Text>
            </View>
            <View
              style={[
                styles.xpBar,
                {
                  backgroundColor: 'rgba(255,255,255,0.2)',
                  borderRadius: radius.full,
                  marginTop: spacing.xs,
                },
              ]}
            >
              <View
                style={[
                  styles.xpFill,
                  {
                    backgroundColor: '#FFF',
                    borderRadius: radius.full,
                    width: `${Math.min(xpInLevel / 100, 1) * 100}%` as `${number}%`,
                  },
                ]}
              />
            </View>
          </LinearGradient>
          <View
            style={{
              height: 24,
              marginTop: -24,
              backgroundColor: colors.background,
              borderTopLeftRadius: radius.xl,
              borderTopRightRadius: radius.xl,
            }}
          />
        </Animated.View>

        {/* ── Circular stat badges ── */}
        <Animated.View
          entering={FadeInDown.delay(delay(0)).duration(400)}
          style={[styles.statsRow, { paddingHorizontal: spacing.lg, marginTop: spacing.lg }]}
        >
          {STATS.map((stat) => (
            <View key={stat.label} style={styles.statBadge}>
              <View
                style={[
                  styles.statCircle,
                  { backgroundColor: stat.color + (isDark ? '25' : '15') },
                ]}
              >
                <Ionicons name={stat.icon} size={18} color={stat.color} />
              </View>
              <Text style={[typography.title3, { color: colors.text, marginTop: 4, fontSize: 15 }]}>
                {stat.value}
              </Text>
              <Text
                style={[
                  typography.caption,
                  { color: colors.textTertiary, marginTop: 1, fontSize: 10 },
                ]}
              >
                {stat.label}
              </Text>
            </View>
          ))}
        </Animated.View>

        {/* ── This Week: crescent streak + weekly goal in one card ── */}
        <Animated.View
          entering={FadeInDown.delay(delay(1)).duration(400)}
          style={{ paddingHorizontal: spacing.lg, marginTop: spacing.xxl }}
        >
          <Text style={[typography.title3, { color: colors.text }]}>This Week</Text>
          <Card variant="glass" style={{ marginTop: spacing.sm }}>
            <View style={[styles.streakRow]}>
              {streakDays.map((day, i) => (
                <View
                  key={i}
                  style={styles.streakDayCol}
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
                      typography.caption,
                      {
                        color:
                          day.active || day.isToday ? colors.textSecondary : colors.textTertiary,
                        marginTop: 3,
                        fontSize: 10,
                        fontWeight: day.isToday ? '600' : '400',
                      },
                    ]}
                  >
                    {day.label}
                  </Text>
                </View>
              ))}
            </View>
            <View
              style={[
                styles.divider,
                { backgroundColor: colors.separator, marginVertical: spacing.md },
              ]}
            />
            <View style={[styles.weekGoalRow]}>
              <ProgressRing
                progress={weekProgress}
                size={48}
                strokeWidth={4}
                color={weekProgress >= 1 ? brand.secondary : brand.primary}
                glow={weekProgress >= 1}
              >
                <Text
                  style={[
                    typography.captionBold,
                    { color: weekProgress >= 1 ? brand.secondary : brand.primary, fontSize: 10 },
                  ]}
                >
                  {completedCount}/5
                </Text>
              </ProgressRing>
              <View style={{ marginLeft: spacing.md, flex: 1 }}>
                <Text style={[typography.label, { color: colors.text }]}>Weekly Goal</Text>
                <View
                  style={[
                    styles.miniBar,
                    {
                      backgroundColor: colors.surfaceTertiary,
                      borderRadius: radius.full,
                      marginTop: 4,
                    },
                  ]}
                >
                  <View
                    style={[
                      styles.miniBarFill,
                      {
                        backgroundColor: weekProgress >= 1 ? brand.secondary : brand.primary,
                        borderRadius: radius.full,
                        width: `${weekProgress * 100}%` as `${number}%`,
                      },
                    ]}
                  />
                </View>
                <Text style={[typography.caption, { color: colors.textSecondary, marginTop: 3 }]}>
                  {weekProgress >= 1
                    ? "Masha'Allah! All done."
                    : `${5 - completedCount} lessons left this week.`}
                </Text>
              </View>
            </View>
          </Card>
        </Animated.View>

        {/* ── Overall Progress ── */}
        <Animated.View
          entering={FadeInDown.delay(delay(2)).duration(400)}
          style={{ paddingHorizontal: spacing.lg, marginTop: spacing.xxl }}
        >
          <Text style={[typography.title3, { color: colors.text }]}>Overall Progress</Text>
          <Card variant="glass" style={{ marginTop: spacing.sm }}>
            <View style={styles.overallRow}>
              <ProgressRing
                progress={overallProgress}
                size={64}
                strokeWidth={5}
                color={brand.secondary}
              >
                <Text style={[typography.label, { color: brand.secondary }]}>
                  {Math.round(overallProgress * 100)}%
                </Text>
              </ProgressRing>
              <View style={{ marginLeft: spacing.md, flex: 1 }}>
                <Text style={[typography.label, { color: colors.text }]}>
                  {child.totalLessonsCompleted} of {totalLessons} lessons
                </Text>
                <Text style={[typography.bodySmall, { color: colors.textSecondary, marginTop: 4 }]}>
                  {overallProgress >= 1
                    ? 'All done!'
                    : overallProgress >= 0.5
                      ? 'More than halfway!'
                      : 'Keep learning — every lesson counts.'}
                </Text>
                <View style={[styles.milestoneRow, { marginTop: spacing.sm }]}>
                  {[0.25, 0.5, 0.75, 1].map((m) => (
                    <View key={m} style={styles.milestoneItem}>
                      <View
                        style={[
                          styles.milestoneDot,
                          {
                            backgroundColor:
                              overallProgress >= m ? brand.secondary : colors.surfaceTertiary,
                            borderRadius: radius.full,
                          },
                        ]}
                      >
                        {overallProgress >= m && (
                          <Ionicons name="checkmark" size={8} color="#FFF" />
                        )}
                      </View>
                      <Text
                        style={[
                          typography.caption,
                          { color: colors.textTertiary, marginTop: 2, fontSize: 10 },
                        ]}
                      >
                        {Math.round(m * 100)}%
                      </Text>
                    </View>
                  ))}
                </View>
              </View>
            </View>
          </Card>
        </Animated.View>

        {/* ── Lessons by Category (no card) ── */}
        <Animated.View
          entering={FadeInDown.delay(delay(3)).duration(400)}
          style={{ paddingHorizontal: spacing.lg, marginTop: spacing.xxl }}
        >
          <Text style={[typography.title3, { color: colors.text }]}>Lessons by Category</Text>
          <View style={{ marginTop: spacing.sm }}>
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

        {/* ── Achievements (horizontal) ── */}
        <Animated.View
          entering={FadeInDown.delay(delay(4)).duration(400)}
          style={{ marginTop: spacing.xxl }}
        >
          <View style={[styles.achTitleRow, { paddingHorizontal: spacing.lg }]}>
            <Text style={[typography.title3, { color: colors.text }]}>Achievements</Text>
            <View
              style={[
                styles.achCountBadge,
                { backgroundColor: brand.lavender + '15', borderRadius: radius.full },
              ]}
            >
              <Text style={[typography.captionBold, { color: brand.lavender }]}>
                {unlockedCount}/{ACHIEVEMENTS.length}
              </Text>
            </View>
          </View>
          <View
            style={[
              styles.achProgressTrack,
              {
                marginHorizontal: spacing.lg,
                marginTop: spacing.sm,
                backgroundColor: colors.surfaceTertiary,
                borderRadius: radius.full,
                height: 4,
                overflow: 'hidden',
              },
            ]}
          >
            <View
              style={[
                styles.achProgressFill,
                {
                  backgroundColor: brand.lavender,
                  borderRadius: radius.full,
                  height: '100%',
                  width:
                    `${ACHIEVEMENTS.length > 0 ? (unlockedCount / ACHIEVEMENTS.length) * 100 : 0}%` as `${number}%`,
                },
              ]}
            />
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{
              paddingHorizontal: spacing.lg,
              paddingTop: spacing.sm,
              paddingBottom: spacing.lg,
              gap: 8,
            }}
          >
            {sortedAchievements.map((ach) => {
              const isUnlocked = unlockedSet.has(ach.id);
              const rarityColor = RARITY_COLORS[ach.rarity];
              return (
                <View
                  key={ach.id}
                  accessible
                  accessibilityRole="summary"
                  accessibilityLabel={`${ach.title}, ${isUnlocked ? `unlocked, ${RARITY_LABELS[ach.rarity]} rarity` : 'locked'}`}
                  style={[
                    styles.achCard,
                    {
                      backgroundColor: isUnlocked
                        ? RARITY_BG[ach.rarity]
                        : isDark
                          ? colors.surfaceSecondary
                          : colors.surface,
                      borderRadius: radius.md,
                      borderWidth: StyleSheet.hairlineWidth,
                      borderColor: isUnlocked ? rarityColor + '40' : colors.border,
                      borderTopWidth: isUnlocked ? 2 : StyleSheet.hairlineWidth,
                      borderTopColor: isUnlocked ? rarityColor : colors.border,
                      opacity: isUnlocked ? 1 : 0.65,
                    },
                  ]}
                >
                  <View
                    style={[
                      styles.achIconCircle,
                      { backgroundColor: isUnlocked ? rarityColor + '18' : colors.surfaceTertiary },
                    ]}
                  >
                    <Ionicons
                      name={ACHIEVEMENT_ICONS[ach.id] ?? 'ribbon-outline'}
                      size={16}
                      color={isUnlocked ? rarityColor : colors.textTertiary}
                    />
                  </View>
                  <Text
                    style={[
                      typography.captionBold,
                      {
                        color: isUnlocked ? colors.text : colors.textTertiary,
                        marginTop: 6,
                        fontSize: 11,
                        textAlign: 'center',
                      },
                    ]}
                    numberOfLines={2}
                  >
                    {ach.title}
                  </Text>
                  {isUnlocked ? (
                    <View
                      style={[
                        styles.rarityPill,
                        {
                          backgroundColor: rarityColor + '18',
                          borderRadius: radius.full,
                          marginTop: 5,
                          alignSelf: 'center',
                        },
                      ]}
                    >
                      <Text
                        style={{
                          color: rarityColor,
                          fontSize: 8,
                          fontWeight: '700',
                          textTransform: 'uppercase',
                          letterSpacing: 0.3,
                        }}
                      >
                        {RARITY_LABELS[ach.rarity]}
                      </Text>
                    </View>
                  ) : (
                    <Ionicons
                      name="lock-closed-outline"
                      size={10}
                      color={colors.textTertiary}
                      style={{ marginTop: 5 }}
                    />
                  )}
                </View>
              );
            })}
          </ScrollView>
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  profileHeader: { overflow: 'hidden' },
  profileRow: { flexDirection: 'row', alignItems: 'center' },
  avatarRing: {
    width: 64,
    height: 64,
    borderRadius: 32,
    overflow: 'hidden',
    backgroundColor: 'rgba(255,255,255,0.2)',
    padding: 2,
  },
  levelSection: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  levelBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  xpBar: { width: '100%', height: 5, overflow: 'hidden' },
  xpFill: { height: '100%' },
  statsRow: { flexDirection: 'row', justifyContent: 'space-between' },
  statBadge: { alignItems: 'center', minWidth: 56 },
  statCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  streakRow: { flexDirection: 'row', justifyContent: 'space-between' },
  streakDayCol: { alignItems: 'center' },
  weekGoalRow: { flexDirection: 'row', alignItems: 'center' },
  miniBar: { height: 4, overflow: 'hidden' },
  miniBarFill: { height: '100%' },
  overallRow: { flexDirection: 'row', alignItems: 'center' },
  milestoneRow: { flexDirection: 'row', justifyContent: 'space-between' },
  milestoneItem: { alignItems: 'center' },
  milestoneDot: { width: 16, height: 16, alignItems: 'center', justifyContent: 'center' },
  divider: { height: StyleSheet.hairlineWidth },
  achTitleRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  achCountBadge: { paddingHorizontal: 10, paddingVertical: 3 },
  achProgressTrack: {},
  achProgressFill: {},
  achCard: { width: 96, paddingHorizontal: 10, paddingVertical: 12, alignItems: 'center' },
  achIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rarityPill: { paddingHorizontal: 5, paddingVertical: 2 },
});
