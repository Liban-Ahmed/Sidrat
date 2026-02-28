/**
 * Home Screen (index tab)
 *
 * Distinctive home experience with:
 * - Time-based hero gradient with Islamic star motif
 * - Inline stats row (streak, XP, lessons)
 * - Compact left-edge accented lesson card
 * - Stacked compact Ayah & Dua cards
 * - Slim salah banner
 */

import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  RefreshControl,
  LayoutAnimation,
  Platform,
  UIManager,
} from 'react-native';
import Animated, {
  FadeInDown,
  useSharedValue,
  useAnimatedStyle,
  useAnimatedScrollHandler,
  withTiming,
  withRepeat,
  withSequence,
  interpolate,
  Extrapolation,
  Easing,
} from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Card, ScalePress, ProgressBar, EmptyState } from '../../src/components';
import {
  AyahOfTheDay,
  DuaOfTheDay,
  HomeSkeletonLoader,
  SalahReminder,
} from '../../src/components/home';
import { allCurriculumLessons } from '../../src/data/curriculum';
import { useReviewQueue } from '../../src/hooks/useReviewQueue';
import { useAppStore, useChildStore, useLessonStore } from '../../src/stores';
import { useTheme } from '../../src/theme';
import { categoryMeta } from '../../src/types';

const STAGGER = 80;

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 6) return 'Assalamu Alaikum';
  if (hour < 12) return 'Good Morning';
  if (hour < 17) return 'Good Afternoon';
  if (hour < 21) return 'Good Evening';
  return 'Assalamu Alaikum';
}

function getGreetingIcon(): keyof typeof Ionicons.glyphMap {
  const hour = new Date().getHours();
  if (hour < 6) return 'moon-outline';
  if (hour < 12) return 'sunny-outline';
  if (hour < 17) return 'sunny';
  if (hour < 21) return 'moon-outline';
  return 'moon';
}

function getTimeBasedHeroGradient(): [string, string] {
  const hour = new Date().getHours();
  if (hour >= 4 && hour < 7) return ['#8A5E10', '#055F6E'];
  if (hour >= 7 && hour < 12) return ['#055F6E', '#1A7AB5'];
  if (hour >= 12 && hour < 16) return ['#055F6E', '#0A3F5C'];
  if (hour >= 16 && hour < 19) return ['#8A5E10', '#9E3844'];
  if (hour >= 19 && hour < 21) return ['#3D2B7A', '#9E3844'];
  return ['#0F1A28', '#1A3A5C'];
}

export default function HomeScreen() {
  const { brand, colors, typography, spacing, radius, shadows, isDark, gradients } = useTheme();
  const router = useRouter();

  const activeChildId = useAppStore((s) => s.activeChildId);
  const child = useChildStore((s) => s.children.find((c) => c.id === activeChildId));
  const children = useChildStore((s) => s.children);
  const addChild = useChildStore((s) => s.addChild);
  const setActiveChild = useAppStore((s) => s.setActiveChild);
  const progressMap = useLessonStore((s) => s.progress);

  const curriculumLessons = allCurriculumLessons;

  const { reviewCount, hasReviews, nextReview } = useReviewQueue();

  const completedLessonToday = useMemo(() => {
    if (!activeChildId) return false;
    const todayStr = new Date().toDateString();
    return Object.values(progressMap).some(
      (p) =>
        p.childId === activeChildId &&
        p.isCompleted &&
        p.completedAt &&
        new Date(p.completedAt).toDateString() === todayStr,
    );
  }, [activeChildId, progressMap]);

  const [reviewsDismissed, setReviewsDismissed] = useState(false);

  const todayLesson = useMemo(() => {
    if (!activeChildId) return undefined;
    return curriculumLessons.find((l) => {
      const p = progressMap[`${activeChildId}:${l.id}`];
      return !p?.isCompleted;
    });
  }, [curriculumLessons, progressMap, activeChildId]);

  const inProgressLesson = useMemo(() => {
    if (!activeChildId) return undefined;
    return curriculumLessons.find((l) => {
      const p = progressMap[`${activeChildId}:${l.id}`];
      return (
        p && !p.isCompleted && (p.attempts > 0 || Object.keys(p.phaseProgress ?? {}).length > 0)
      );
    });
  }, [curriculumLessons, progressMap, activeChildId]);

  const totalLessons = curriculumLessons.length;

  const currentLessonIndex = useMemo(() => {
    if (!todayLesson) return totalLessons;
    return curriculumLessons.findIndex((l) => l.id === todayLesson.id) + 1;
  }, [todayLesson, curriculumLessons, totalLessons]);

  const completedCount = useMemo(() => {
    if (!activeChildId) return 0;
    return Object.values(progressMap).filter((p) => p.childId === activeChildId && p.isCompleted)
      .length;
  }, [activeChildId, progressMap]);

  const [refreshing, setRefreshing] = useState(false);
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      useChildStore.getState();
      useLessonStore.getState();
    } finally {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      setRefreshing(false);
    }
  }, []);

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

  const scrollY = useSharedValue(0);
  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (e) => {
      scrollY.value = e.contentOffset.y;
    },
  });

  const headerBarStyle = useAnimatedStyle(() => ({
    opacity: interpolate(scrollY.value, [0, 80], [0, 1], Extrapolation.CLAMP),
  }));

  const headerBorderStyle = useAnimatedStyle(() => ({
    borderBottomWidth: scrollY.value > 40 ? StyleSheet.hairlineWidth : 0,
  }));

  const ctaPulse = useSharedValue(1);
  useEffect(() => {
    ctaPulse.value = withRepeat(
      withSequence(
        withTiming(1.025, { duration: 1400, easing: Easing.inOut(Easing.ease) }),
        withTiming(1, { duration: 1400, easing: Easing.inOut(Easing.ease) }),
      ),
      -1,
      true,
    );
  }, [ctaPulse]);

  const ctaStyle = useAnimatedStyle(() => ({
    transform: [{ scale: ctaPulse.value }],
  }));

  const greeting = useMemo(getGreeting, []);
  const greetingIcon = useMemo(getGreetingIcon, []);
  const heroGradient = useMemo(getTimeBasedHeroGradient, []);

  const navigateToLesson = useCallback(
    (lessonId: string) => {
      router.push(`/lesson/${lessonId}` as any);
    },
    [router],
  );

  if (!child && children.length === 0) {
    return (
      <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]}>
        <EmptyState
          icon="people-outline"
          title="Welcome to Sidrat!"
          subtitle="Let's set up your child's learning profile to get started on their Quran journey."
          actionLabel="Create Profile"
          onAction={() => router.push('/onboarding' as any)}
        />
      </SafeAreaView>
    );
  }

  if (!child) {
    return (
      <SafeAreaView
        style={[styles.safe, { backgroundColor: colors.background }]}
        edges={['left', 'right']}
      >
        <HomeSkeletonLoader />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      style={[styles.safe, { backgroundColor: colors.background }]}
      edges={['left', 'right']}
    >
      {/* Translucent header bar on scroll */}
      <Animated.View
        style={[styles.stickyHeader, { borderBottomColor: colors.separator }, headerBorderStyle]}
      >
        <Animated.View
          style={[StyleSheet.absoluteFill, { backgroundColor: colors.background }, headerBarStyle]}
        />
      </Animated.View>

      <Animated.ScrollView
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#FFFFFF"
            colors={[brand.primary]}
          />
        }
      >
        {/* ── Hero Greeting with Islamic star motif ── */}
        <Animated.View entering={FadeInDown.duration(500).springify().damping(18)}>
          <LinearGradient
            colors={heroGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={[
              styles.heroGradient,
              {
                paddingHorizontal: spacing.lg,
                paddingTop: spacing.xl + 44,
                paddingBottom: spacing.lg + 8,
              },
            ]}
          >
            {/* Islamic star pattern (two rotated squares) */}
            <View style={styles.starContainer}>
              <View style={styles.starSquare} />
              <View style={[styles.starSquare, { transform: [{ rotate: '45deg' }] }]} />
            </View>

            <View style={styles.header}>
              <View style={{ flex: 1 }}>
                <View style={styles.greetingRow}>
                  <Text style={[typography.body, { color: 'rgba(255,255,255,0.75)' }]}>
                    {greeting}
                  </Text>
                  <Ionicons
                    name={greetingIcon}
                    size={14}
                    color={brand.accentLight}
                    style={{ marginLeft: 5 }}
                  />
                </View>
                <Text style={[typography.largeTitle, { color: '#FFFFFF' }]}>
                  {child?.name ?? 'Welcome'}
                </Text>
              </View>
            </View>

            {/* Inline stats pills */}
            <View style={[styles.statsPillRow, { marginTop: spacing.md }]}>
              <View style={styles.statsPill}>
                <Ionicons name="flame" size={13} color="#FF9F43" />
                <Text style={styles.statsPillText}>{child.currentStreak}</Text>
              </View>
              <View style={styles.statsPill}>
                <Ionicons name="sparkles" size={13} color={brand.accentLight} />
                <Text style={styles.statsPillText}>{child.totalXP} XP</Text>
              </View>
              <View style={styles.statsPill}>
                <Ionicons name="book" size={13} color="rgba(255,255,255,0.7)" />
                <Text style={styles.statsPillText}>
                  {completedCount}/{totalLessons}
                </Text>
              </View>
            </View>
          </LinearGradient>
        </Animated.View>
        {/* Curved blend into background */}
        <View
          style={{
            height: 24,
            marginTop: -24,
            backgroundColor: colors.background,
            borderTopLeftRadius: radius.xl,
            borderTopRightRadius: radius.xl,
          }}
        />

        {/* ── Content ── */}
        <View style={{ paddingHorizontal: spacing.md }}>
          {/* Salah Reminder — slim inline banner */}
          <View style={{ marginTop: spacing.md }}>
            <SalahReminder />
          </View>

          {/* ── Today's Lesson ── */}
          <Animated.View
            entering={FadeInDown.delay(STAGGER).duration(600).springify().damping(16)}
            style={{ marginTop: spacing.lg }}
          >
            <Text style={[typography.title3, { color: colors.text, marginBottom: spacing.xs }]}>
              Today's Lesson
            </Text>

            {todayLesson ? (
              <ScalePress onPress={() => navigateToLesson(todayLesson.id)}>
                <View
                  style={[
                    styles.lessonCard,
                    {
                      backgroundColor: colors.surface,
                      borderRadius: radius.lg,
                      borderWidth: 1,
                      borderColor: isDark ? colors.border : brand.accent + '10',
                      ...shadows.card,
                    },
                  ]}
                >
                  <View
                    style={[
                      styles.lessonLeftEdge,
                      { backgroundColor: brand.accent, borderRadius: 2 },
                    ]}
                  />

                  <View
                    style={[
                      styles.lessonBody,
                      { padding: spacing.md, paddingLeft: spacing.md + 6 },
                    ]}
                  >
                    <View style={styles.lessonTopRow}>
                      <View style={{ flex: 1 }}>
                        <Text style={[typography.caption, { color: colors.textTertiary }]}>
                          Lesson {currentLessonIndex} · {categoryMeta[todayLesson.category].label}
                        </Text>
                        <Text
                          style={[typography.title3, { color: colors.text, marginTop: 2 }]}
                          numberOfLines={1}
                        >
                          {todayLesson.title}
                        </Text>
                        <View style={[styles.lessonMeta, { marginTop: spacing.xs }]}>
                          <Ionicons name="time-outline" size={12} color={colors.textTertiary} />
                          <Text
                            style={[
                              typography.caption,
                              { color: colors.textTertiary, marginLeft: 3 },
                            ]}
                          >
                            {todayLesson.durationMinutes} min
                          </Text>
                          <Text
                            style={[
                              typography.caption,
                              { color: colors.textTertiary, marginHorizontal: 6 },
                            ]}
                          >
                            ·
                          </Text>
                          <Ionicons name="star" size={12} color={brand.accent} />
                          <Text
                            style={[typography.caption, { color: brand.accent, marginLeft: 3 }]}
                          >
                            +{todayLesson.xpReward} XP
                          </Text>
                        </View>
                      </View>
                      <Animated.View style={ctaStyle}>
                        <LinearGradient
                          colors={gradients.heroCta as unknown as [string, string]}
                          start={{ x: 0, y: 0 }}
                          end={{ x: 1, y: 0 }}
                          style={[styles.lessonCtaCircle, { borderRadius: radius.full }]}
                        >
                          <Ionicons name="play" size={18} color="#FFFFFF" />
                        </LinearGradient>
                      </Animated.View>
                    </View>
                  </View>
                </View>
              </ScalePress>
            ) : (
              <Card
                variant="glass"
                style={{ alignItems: 'center' as const, paddingVertical: spacing.lg }}
              >
                <View
                  accessible
                  accessibilityLabel="All lessons completed"
                  style={styles.emptyCard}
                >
                  <Ionicons name="checkmark-circle" size={28} color={brand.secondary} />
                  <Text style={[typography.label, { color: colors.text, marginTop: spacing.xs }]}>
                    All caught up!
                  </Text>
                  <Text
                    style={[
                      typography.caption,
                      { color: colors.textSecondary, marginTop: 2, textAlign: 'center' },
                    ]}
                  >
                    You've completed all available lessons.
                  </Text>
                </View>
              </Card>
            )}
          </Animated.View>

          {/* ── Reviews Due ── */}
          {hasReviews && completedLessonToday && !reviewsDismissed && (
            <Animated.View
              entering={FadeInDown.delay(STAGGER * 2)
                .duration(600)
                .springify()
                .damping(16)}
              style={{ marginTop: spacing.lg }}
            >
              <ScalePress onPress={() => router.push('/review' as any)}>
                <Card variant="filled" accentColor={brand.coral} noPadding>
                  <View
                    accessible
                    accessibilityLabel={`${reviewCount} lessons due for review. Tap to start reviewing.`}
                    style={[styles.continueCard, { padding: spacing.md }]}
                  >
                    <View
                      style={[
                        styles.continueLeftEdge,
                        { backgroundColor: brand.coral, borderRadius: radius.full },
                      ]}
                    />
                    <View
                      style={[
                        styles.continueIcon,
                        { backgroundColor: brand.coral + '18', borderRadius: radius.md },
                      ]}
                    >
                      <Ionicons name="refresh" size={22} color={brand.coral} />
                    </View>
                    <View style={{ flex: 1, marginLeft: spacing.sm }}>
                      <Text style={[typography.caption, { color: brand.coral }]}>Reviews Due</Text>
                      <Text style={[typography.label, { color: colors.text, marginTop: 2 }]}>
                        {reviewCount} {reviewCount === 1 ? 'lesson' : 'lessons'} to review
                      </Text>
                      {nextReview && (
                        <Text
                          style={[typography.caption, { color: colors.textTertiary, marginTop: 2 }]}
                          numberOfLines={1}
                        >
                          Next: {nextReview.lesson.title}
                        </Text>
                      )}
                    </View>
                    <View
                      style={[
                        styles.reviewBadge,
                        { backgroundColor: brand.coral, borderRadius: radius.full },
                      ]}
                    >
                      <Text style={[typography.captionBold, { color: '#FFF' }]}>{reviewCount}</Text>
                    </View>
                  </View>
                </Card>
              </ScalePress>

              <ScalePress
                onPress={() => setReviewsDismissed(true)}
                accessibilityLabel="Dismiss review reminder"
                style={{ alignSelf: 'center', marginTop: spacing.xs }}
              >
                <Text style={[typography.caption, { color: colors.textTertiary }]}>
                  Maybe later
                </Text>
              </ScalePress>
            </Animated.View>
          )}

          {/* ── Continue Where You Left Off ── */}
          {inProgressLesson && inProgressLesson.id !== todayLesson?.id && (
            <Animated.View
              entering={FadeInDown.delay(STAGGER * 2.5)
                .duration(600)
                .springify()
                .damping(16)}
              style={{ marginTop: spacing.lg }}
            >
              <Text style={[typography.title3, { color: colors.text, marginBottom: spacing.xs }]}>
                Continue
              </Text>
              <ScalePress onPress={() => navigateToLesson(inProgressLesson.id)}>
                <Card variant="filled" accentColor={brand.accent} noPadding>
                  <View
                    accessible
                    accessibilityLabel={`Continue lesson: ${inProgressLesson.title}`}
                    style={[styles.continueCard, { padding: spacing.md }]}
                  >
                    <View style={[styles.continueLeftEdge, { borderRadius: radius.full }]}>
                      <LinearGradient
                        colors={gradients.heroCta as unknown as [string, string]}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 0, y: 1 }}
                        style={[StyleSheet.absoluteFill, { borderRadius: radius.full }]}
                      />
                    </View>
                    <View
                      style={[
                        styles.continueIcon,
                        { backgroundColor: brand.accent + '20', borderRadius: radius.md },
                      ]}
                    >
                      <Ionicons name="play-circle" size={24} color={brand.accent} />
                    </View>
                    <View style={{ flex: 1, marginLeft: spacing.sm }}>
                      <Text style={[typography.caption, { color: brand.accent }]}>
                        Pick up where you left off
                      </Text>
                      <Text
                        style={[typography.label, { color: colors.text, marginTop: 2 }]}
                        numberOfLines={1}
                      >
                        {inProgressLesson.title}
                      </Text>
                      <View style={{ marginTop: spacing.xs }}>
                        <ProgressBar
                          progress={(() => {
                            const p = progressMap[`${activeChildId}:${inProgressLesson.id}`];
                            if (!p) return 0;
                            const completedPhases = Object.keys(p.phaseProgress ?? {}).length;
                            return Math.min(completedPhases / 5, 0.95);
                          })()}
                          color={brand.accent}
                          trackColor={brand.accent + '20'}
                          height={4}
                        />
                      </View>
                    </View>
                    <Ionicons
                      name="chevron-forward"
                      size={20}
                      color={brand.accent}
                      style={{ marginLeft: spacing.sm }}
                    />
                  </View>
                </Card>
              </ScalePress>
            </Animated.View>
          )}

          {/* ── Ayah & Dua — compact stacked ── */}
          <Animated.View
            entering={FadeInDown.delay(STAGGER * 3)
              .duration(600)
              .springify()
              .damping(16)}
            style={{ marginTop: spacing.lg }}
          >
            <AyahOfTheDay compact />
          </Animated.View>
          <Animated.View
            entering={FadeInDown.delay(STAGGER * 3.5)
              .duration(600)
              .springify()
              .damping(16)}
            style={{ marginTop: spacing.sm }}
          >
            <DuaOfTheDay compact />
          </Animated.View>

          <View style={{ height: 80 }} />
        </View>
      </Animated.ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  scroll: { paddingBottom: 32 },

  stickyHeader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 1,
    zIndex: 10,
  },

  heroGradient: {
    overflow: 'hidden',
    position: 'relative',
  },

  /* Islamic star — two overlapping rotated squares */
  starContainer: {
    position: 'absolute',
    top: -10,
    right: -10,
    width: 130,
    height: 130,
    alignItems: 'center',
    justifyContent: 'center',
  },
  starSquare: {
    position: 'absolute',
    width: 80,
    height: 80,
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.08)',
    borderRadius: 4,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  greetingRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  /* Inline hero stats */
  statsPillRow: {
    flexDirection: 'row',
    gap: 8,
  },
  statsPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 4,
    gap: 5,
  },
  statsPillText: {
    color: 'rgba(255,255,255,0.85)',
    fontSize: 12,
    fontWeight: '600',
  },

  /* Lesson card — compact horizontal */
  lessonCard: {
    overflow: 'hidden',
  },
  lessonLeftEdge: {
    position: 'absolute',
    left: 0,
    top: 10,
    bottom: 10,
    width: 4,
  },
  lessonBody: {
    flex: 1,
  },
  lessonTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  lessonMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  lessonCtaCircle: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 12,
  },

  /* Continue/Review cards */
  continueCard: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  continueIcon: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  continueLeftEdge: {
    position: 'absolute',
    left: 0,
    top: 8,
    bottom: 8,
    width: 4,
  },
  reviewBadge: {
    minWidth: 26,
    height: 26,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
  },

  /* Empty states */
  emptyCard: {
    alignItems: 'center',
  },
});
