/**
 * Home Screen — Oasis Palette Rewrite
 *
 * Design Spec §8.1 — Warm, welcoming, motivating home experience.
 *
 * Sections (in order):
 *   1. GreetingHeader — olive50→cream gradient, Islamic greeting, streak badge
 *   2. SalahReminder — slim prayer-time banner
 *   3. DailyAmalSection — three daily goal cards
 *   4. ContinueLearning — horizontal category scroll
 *   5. DuaOfTheDay — sky50→sky100 gradient card
 *
 * All interactions use JuicyPressable (spring pressable + haptics).
 * All colors use Oasis semantic tokens — no hardcoded hex outside tokens.
 * Typography is age-aware via TYPOGRAPHY scale and ageToGroup.
 */

import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { View, Text, StyleSheet, RefreshControl } from 'react-native';
import Animated, {
  FadeInDown,
  useSharedValue,
  useAnimatedScrollHandler,
} from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { JuicyPressable } from '../../src/components/common/JuicyPressable';
import { AyahOfTheDay } from '../../src/components/home/AyahOfTheDay';
import {
  ContinueLearning,
  type CategoryProgress,
} from '../../src/components/home/ContinueLearning';
import { DailyAmalSection, type DailyAmal } from '../../src/components/home/DailyAmalSection';
import { DuaOfTheDay } from '../../src/components/home/DuaOfTheDayOasis';
import { GreetingHeader } from '../../src/components/home/GreetingHeader';
import { HomeSkeletonLoaderOasis } from '../../src/components/home/HomeSkeletonLoaderOasis';
import { SalahReminderOasis } from '../../src/components/home/SalahReminderOasis';
import { allCurriculumLessons } from '../../src/data/curriculum';
import { useOasisColors } from '../../src/hooks/useOasisColors';
import { useReviewQueue } from '../../src/hooks/useReviewQueue';
import { useAppStore, useChildStore, useLessonStore } from '../../src/stores';
import { SPACING, RADIUS, SHADOW, type AgeGroup } from '../../src/theme/tokens';
import { categoryMeta, getAge, LESSON_CATEGORIES } from '../../src/types';
import { ageToGroup } from '../../src/types/curriculum';
import haptic from '../../src/utils/haptics';

// ── Constants ────────────────────────────────────────────────────
const STAGGER = 60;

// ── Helpers ──────────────────────────────────────────────────────

/** Build daily amal goals based on child's progress */
function buildDailyAmals(
  completedToday: number,
  reviewsDueCount: number,
  currentStreak: number,
): DailyAmal[] {
  return [
    {
      id: 'amal-lesson',
      title: 'Complete 1 Lesson',
      description: 'Learn something new today',
      target: 1,
      current: Math.min(completedToday, 1),
      reward: 25,
      type: 'lesson',
      icon: 'book-outline',
    },
    {
      id: 'amal-review',
      title: `Review ${Math.max(reviewsDueCount, 1)} Card${reviewsDueCount !== 1 ? 's' : ''}`,
      description: 'Strengthen your memory',
      target: Math.max(reviewsDueCount, 1),
      current: 0, // Updated by review tracking
      reward: 15,
      type: 'review',
      icon: 'refresh-outline',
    },
    {
      id: 'amal-streak',
      title: 'Keep Your Streak',
      description: `${currentStreak} day Istiqamah`,
      target: 1,
      current: completedToday > 0 ? 1 : 0,
      reward: 10,
      type: 'streak',
      icon: 'flame-outline',
    },
  ];
}

/** Build category progress data for Continue Learning section */
function buildCategoryProgress(
  progressMap: Record<string, { childId: string; isCompleted: boolean }>,
  activeChildId: string | null,
): CategoryProgress[] {
  if (!activeChildId) return [];

  const catCounts: Record<string, { completed: number; total: number }> = {};

  for (const lesson of allCurriculumLessons) {
    const cat = lesson.category;
    if (!catCounts[cat]) {
      catCounts[cat] = { completed: 0, total: 0 };
    }
    catCounts[cat].total++;
    const key = `${activeChildId}:${lesson.id}`;
    if (progressMap[key]?.isCompleted) {
      catCounts[cat].completed++;
    }
  }

  return LESSON_CATEGORIES.map((cat) => ({
    category: cat,
    label: categoryMeta[cat].label,
    ionIcon: categoryMeta[cat].icon as keyof typeof Ionicons.glyphMap,
    completedCount: catCounts[cat]?.completed ?? 0,
    totalCount: catCounts[cat]?.total ?? 0,
  })).filter((c) => c.totalCount > 0);
}

// ── Screen ───────────────────────────────────────────────────────

export default function HomeScreen() {
  const { colors: oasis, t, isDark } = useOasisColors();
  const router = useRouter();

  // ── Store reads ──────────────────────────────────────────────
  const activeChildId = useAppStore((s) => s.activeChildId);
  const child = useChildStore((s) => s.children.find((c) => c.id === activeChildId));
  const children = useChildStore((s) => s.children);
  const addChild = useChildStore((s) => s.addChild);
  const setActiveChild = useAppStore((s) => s.setActiveChild);
  const progressMap = useLessonStore((s) => s.progress);

  const { reviewCount, hasReviews } = useReviewQueue();

  // ── Derived data ─────────────────────────────────────────────
  const ageGroup: AgeGroup = useMemo(() => {
    if (!child) return 'early';
    return ageToGroup(getAge(child.birthYear));
  }, [child]);

  const completedTodayCount = useMemo(() => {
    if (!activeChildId) return 0;
    const todayStr = new Date().toDateString();
    return Object.values(progressMap).filter(
      (p) =>
        p.childId === activeChildId &&
        p.isCompleted &&
        p.completedAt &&
        new Date(p.completedAt).toDateString() === todayStr,
    ).length;
  }, [activeChildId, progressMap]);

  const todayLesson = useMemo(() => {
    if (!activeChildId) return undefined;
    return allCurriculumLessons.find((l) => {
      const p = progressMap[`${activeChildId}:${l.id}`];
      return !p?.isCompleted;
    });
  }, [activeChildId, progressMap]);

  const dailyAmals = useMemo(
    () => buildDailyAmals(completedTodayCount, reviewCount, child?.currentStreak ?? 0),
    [completedTodayCount, reviewCount, child?.currentStreak],
  );

  const categoryProgress = useMemo(
    () => buildCategoryProgress(progressMap as any, activeChildId),
    [progressMap, activeChildId],
  );

  // ── Refresh ──────────────────────────────────────────────────
  const [refreshing, setRefreshing] = useState(false);
  const onRefresh = useCallback(async () => {
    haptic.light();
    setRefreshing(true);
    try {
      useChildStore.getState();
      useLessonStore.getState();
    } finally {
      setRefreshing(false);
    }
  }, []);

  // ── Ensure child ─────────────────────────────────────────────
  const ensureChild = useCallback(() => {
    if (children.length === 0) {
      const c = addChild({ name: 'Yusuf', birthYear: 2019, avatarId: 'lion' });
      setActiveChild(c.id);
    } else if (!activeChildId) {
      const first = children[0];
      if (first) setActiveChild(first.id);
    }
  }, [children, activeChildId, addChild, setActiveChild]);

  useEffect(() => {
    ensureChild();
  }, [ensureChild]);

  // ── Scroll animations ───────────────────────────────────────
  const scrollY = useSharedValue(0);
  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (e) => {
      scrollY.value = e.contentOffset.y;
    },
  });

  // ── Navigate to lesson ──────────────────────────────────────
  const navigateToLesson = useCallback(
    (lessonId: string) => {
      haptic.light();
      router.push(`/lesson/${lessonId}` as any);
    },
    [router],
  );

  // ── Screen gradient ─────────────────────────────────────────
  const screenGradient: [string, string, string] = isDark
    ? [t.earth900, '#1F1D1A', '#222018']
    : [t.sand50, t.cream, t.olive50];

  // ── Empty state (no children) ───────────────────────────────
  if (!child && children.length === 0) {
    return (
      <SafeAreaView style={[styles.safe, { backgroundColor: oasis.background }]}>
        <LinearGradient colors={screenGradient} style={styles.flex}>
          <View style={styles.emptyRoot}>
            <Ionicons name="leaf" size={56} color={oasis.primary} />
            <Text style={[styles.emptyTitle, { color: oasis.textPrimary }]}>
              Welcome to Sidrat!
            </Text>
            <Text style={[styles.emptySubtitle, { color: oasis.textSecondary }]}>
              Let's set up your child's learning profile to begin their Islamic learning journey.
            </Text>
            <JuicyPressable
              onPress={() => router.push('/onboarding' as any)}
              accessibilityLabel="Create a child profile to get started"
              accessibilityRole="button"
            >
              <View style={[styles.emptyBtn, { backgroundColor: oasis.primaryStrong }]}>
                <Text style={[styles.emptyBtnText, { color: t.white }]}>Create Profile</Text>
              </View>
            </JuicyPressable>
          </View>
        </LinearGradient>
      </SafeAreaView>
    );
  }

  // ── Loading state ───────────────────────────────────────────
  if (!child) {
    return (
      <SafeAreaView
        style={[styles.safe, { backgroundColor: oasis.background }]}
        edges={['left', 'right']}
      >
        <HomeSkeletonLoaderOasis />
      </SafeAreaView>
    );
  }

  // ── Main content ────────────────────────────────────────────
  return (
    <SafeAreaView
      style={[styles.safe, { backgroundColor: oasis.background }]}
      edges={['left', 'right']}
    >
      <LinearGradient colors={screenGradient} style={styles.flex}>
        <Animated.ScrollView
          onScroll={scrollHandler}
          scrollEventThrottle={16}
          contentContainerStyle={styles.scroll}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={oasis.primary}
              colors={[oasis.primary]}
            />
          }
        >
          {/* 1. GREETING HEADER */}
          <GreetingHeader childName={child.name} streak={child.currentStreak} ageGroup={ageGroup} />

          {/* Content area with padding */}
          <View style={{ paddingHorizontal: SPACING.md }}>
            {/* 2. SALAH REMINDER */}
            <Animated.View
              entering={FadeInDown.delay(STAGGER).duration(400).springify().damping(20)}
              style={{ marginTop: SPACING.md }}
            >
              <SalahReminderOasis />
            </Animated.View>

            {/* 3. DAILY AMAL */}
            <Animated.View
              entering={FadeInDown.delay(STAGGER * 2)
                .duration(400)
                .springify()
                .damping(20)}
            >
              <DailyAmalSection amals={dailyAmals} ageGroup={ageGroup} />
            </Animated.View>

            {/* TODAY'S LESSON — quick CTA */}
            {todayLesson && (
              <Animated.View
                entering={FadeInDown.delay(STAGGER * 3)
                  .duration(400)
                  .springify()
                  .damping(20)}
                style={{ marginTop: SPACING.lg }}
              >
                <Text style={[styles.sectionLabel, { color: oasis.textMuted }]}>
                  TODAY'S LESSON
                </Text>
                <JuicyPressable
                  onPress={() => navigateToLesson(todayLesson.id)}
                  accessibilityLabel={`Continue lesson: ${todayLesson.title}. ${todayLesson.durationMinutes} minutes. Tap to start.`}
                  accessibilityRole="button"
                >
                  <View
                    style={[
                      styles.lessonCard,
                      {
                        backgroundColor: oasis.surface,
                        borderColor: oasis.surfaceBorder,
                        ...SHADOW.rnMd,
                      },
                    ]}
                  >
                    {/* Left accent bar */}
                    <View style={[styles.lessonAccent, { backgroundColor: oasis.primary }]} />

                    <View style={styles.lessonBody}>
                      <View style={styles.lessonRow}>
                        <View style={{ flex: 1 }}>
                          <Text style={[styles.lessonCategory, { color: oasis.textMuted }]}>
                            {categoryMeta[todayLesson.category].label}
                          </Text>
                          <Text
                            style={[styles.lessonTitle, { color: oasis.textPrimary }]}
                            numberOfLines={1}
                          >
                            {todayLesson.title}
                          </Text>
                          <View style={styles.lessonMeta}>
                            <Ionicons name="time-outline" size={12} color={oasis.textMuted} />
                            <Text style={[styles.lessonMetaText, { color: oasis.textMuted }]}>
                              {todayLesson.durationMinutes} min
                            </Text>
                            <Text style={[styles.lessonMetaText, { color: oasis.textMuted }]}>
                              {' '}
                              ·{' '}
                            </Text>
                            <Ionicons name="sparkles" size={12} color={t.gold500} />
                            <Text style={[styles.lessonMetaText, { color: t.gold500 }]}>
                              +{todayLesson.xpReward}
                            </Text>
                          </View>
                        </View>

                        {/* Play button */}
                        <View style={[styles.playBtn, { backgroundColor: oasis.primaryStrong }]}>
                          <Ionicons name="play" size={18} color={t.white} />
                        </View>
                      </View>
                    </View>
                  </View>
                </JuicyPressable>
              </Animated.View>
            )}

            {/* REVIEWS DUE */}
            {hasReviews && (
              <Animated.View
                entering={FadeInDown.delay(STAGGER * 3.5)
                  .duration(400)
                  .springify()
                  .damping(20)}
                style={{ marginTop: SPACING.md }}
              >
                <JuicyPressable
                  onPress={() => {
                    haptic.light();
                    router.push('/review' as any);
                  }}
                  accessibilityLabel={`${reviewCount} lessons due for review. Tap to start reviewing.`}
                  accessibilityRole="button"
                >
                  <View
                    style={[
                      styles.reviewCard,
                      {
                        backgroundColor: isDark ? oasis.rewardBg : t.gold50,
                        borderColor: isDark ? oasis.rewardBorder : t.gold200,
                      },
                    ]}
                  >
                    <Ionicons name="refresh" size={20} color={t.gold500} />
                    <View style={{ flex: 1, marginLeft: SPACING.sm }}>
                      <Text style={[styles.reviewTitle, { color: oasis.textPrimary }]}>
                        Reviews Due
                      </Text>
                      <Text style={[styles.reviewSub, { color: oasis.textSecondary }]}>
                        {reviewCount} {reviewCount === 1 ? 'lesson' : 'lessons'} to review
                      </Text>
                    </View>
                    <View style={[styles.reviewBadge, { backgroundColor: t.gold500 }]}>
                      <Text style={[styles.reviewBadgeText, { color: t.white }]}>
                        {reviewCount}
                      </Text>
                    </View>
                  </View>
                </JuicyPressable>
              </Animated.View>
            )}

            {/* 4. CONTINUE LEARNING */}
            <Animated.View
              entering={FadeInDown.delay(STAGGER * 4)
                .duration(400)
                .springify()
                .damping(20)}
            >
              <ContinueLearning categories={categoryProgress} ageGroup={ageGroup} />
            </Animated.View>

            {/* 5. DUA OF THE DAY */}
            <Animated.View
              entering={FadeInDown.delay(STAGGER * 5)
                .duration(400)
                .springify()
                .damping(20)}
              style={{ marginTop: SPACING.lg }}
            >
              <DuaOfTheDay ageGroup={ageGroup} />
            </Animated.View>

            {/* 6. AYAH OF THE DAY */}
            <Animated.View
              entering={FadeInDown.delay(STAGGER * 6)
                .duration(400)
                .springify()
                .damping(20)}
              style={{ marginTop: SPACING.lg }}
            >
              <AyahOfTheDay ageGroup={ageGroup} />
            </Animated.View>

            {/* Offline banner placeholder */}
            {/* TODO: show when NetInfo detects no connectivity */}

            {/* Bottom spacer for tab bar */}
            <View style={{ height: 100 }} />
          </View>
        </Animated.ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
}

// ── Styles ───────────────────────────────────────────────────────

const styles = StyleSheet.create({
  safe: { flex: 1 },
  flex: { flex: 1 },
  scroll: { paddingBottom: 32 },

  // Section label
  sectionLabel: {
    fontFamily: 'Nunito-Bold',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    marginBottom: SPACING.sm,
  },

  // Today's lesson card
  lessonCard: {
    borderRadius: RADIUS.lg,
    borderWidth: 1.5,
    overflow: 'hidden',
    minHeight: 72,
  },
  lessonAccent: {
    position: 'absolute',
    left: 0,
    top: 10,
    bottom: 10,
    width: 4,
    borderRadius: 2,
  },
  lessonBody: {
    padding: SPACING.md,
    paddingLeft: SPACING.md + 6,
  },
  lessonRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  lessonCategory: {
    fontFamily: 'Nunito-Regular',
    fontSize: 12,
    lineHeight: 16,
  },
  lessonTitle: {
    fontFamily: 'Nunito-Bold',
    fontWeight: '700',
    fontSize: 18,
    lineHeight: 24,
    marginTop: 2,
  },
  lessonMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: SPACING.xs,
  },
  lessonMetaText: {
    fontFamily: 'Nunito-Regular',
    fontSize: 13,
    lineHeight: 18,
    marginLeft: 3,
  },
  playBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: SPACING.sm,
  },

  // Review card
  reviewCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: RADIUS.lg,
    borderWidth: 1.5,
    padding: SPACING.md,
  },
  reviewTitle: {
    fontFamily: 'Nunito-Bold',
    fontWeight: '700',
    fontSize: 15,
    lineHeight: 20,
  },
  reviewSub: {
    fontFamily: 'Nunito-Regular',
    fontSize: 13,
    lineHeight: 18,
    marginTop: 2,
  },
  reviewBadge: {
    minWidth: 26,
    height: 26,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
  },
  reviewBadgeText: {
    fontFamily: 'Nunito-Bold',
    fontWeight: '700',
    fontSize: 13,
  },

  // Empty state
  emptyRoot: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontFamily: 'Nunito-Bold',
    fontWeight: '700',
    fontSize: 22,
    lineHeight: 28,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontFamily: 'Nunito-Regular',
    fontSize: 16,
    lineHeight: 22,
    textAlign: 'center',
    marginTop: SPACING.sm,
  },
  emptyBtn: {
    marginTop: SPACING.lg,
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: RADIUS.md,
  },
  emptyBtnText: {
    fontFamily: 'Nunito-Bold',
    fontWeight: '700',
    fontSize: 16,
  },
});
