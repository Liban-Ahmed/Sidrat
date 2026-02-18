/**
 * Home Screen (index tab)
 *
 * Production-class implementation with Reanimated-powered animations:
 * staggered entrance, scroll-driven header, spring press feedback,
 * and micro-interactions throughout.
 *
 * Components extracted to:
 *   src/components/         — ScalePress, SectionHeader, ProgressBar
 *   src/components/home/    — AnimatedCounter, AnimatedStatCard, QuickAction, WeekStreak, MiniCrescent
 */

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView as HScrollView,
    RefreshControl,
    LayoutAnimation,
    Platform,
    UIManager,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
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
import { useTheme } from '../../src/theme';
import { useAppStore, useChildStore, useLessonStore } from '../../src/stores';
import { Avatar, Badge, Button, ScalePress, SectionHeader, ProgressBar } from '../../src/components';
import { QuickAction, WeekStreak, AnimatedStatCard } from '../../src/components/home';
import { categoryMeta } from '../../src/types';
import { allCurriculumLessons } from '../../src/data/curriculum';

// ── Constants ────────────────────────────────────────────────────

const STAGGER = 80;

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
}

// ── Helpers ──────────────────────────────────────────────────────

function getGreeting(): string {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
}

function getGreetingIcon(): keyof typeof Ionicons.glyphMap {
    const hour = new Date().getHours();
    if (hour < 12) return 'sunny-outline';
    if (hour < 17) return 'sunny';
    return 'moon-outline';
}

// ── Main Component ──────────────────────────────────────────────

export default function HomeScreen() {
    const { brand, colors, typography, spacing, radius, shadows } = useTheme();
    const router = useRouter();

    // ── Store selectors ──
    const activeChildId = useAppStore((s) => s.activeChildId);
    const child = useChildStore((s) =>
        s.children.find((c) => c.id === activeChildId),
    );
    const children = useChildStore((s) => s.children);
    const addChild = useChildStore((s) => s.addChild);
    const setActiveChild = useAppStore((s) => s.setActiveChild);
    const progressMap = useLessonStore((s) => s.progress);

    // Use curriculum lessons as the source of truth
    const curriculumLessons = allCurriculumLessons;

    // Next uncompleted curriculum lesson
    const todayLesson = useMemo(() => {
        if (!activeChildId) return undefined;
        return curriculumLessons.find((l) => {
            const p = progressMap[`${activeChildId}:${l.id}`];
            return !p?.isCompleted;
        });
    }, [curriculumLessons, progressMap, activeChildId]);

    // In-progress lesson (started but not finished)
    const inProgressLesson = useMemo(() => {
        if (!activeChildId) return undefined;
        return curriculumLessons.find((l) => {
            const p = progressMap[`${activeChildId}:${l.id}`];
            return p && !p.isCompleted && (p.attempts > 0 || Object.keys(p.phaseProgress ?? {}).length > 0);
        });
    }, [curriculumLessons, progressMap, activeChildId]);

    // Daily progress stats
    const completedCount = useMemo(() => {
        if (!activeChildId) return 0;
        return curriculumLessons.filter((l) => progressMap[`${activeChildId}:${l.id}`]?.isCompleted).length;
    }, [curriculumLessons, progressMap, activeChildId]);
    const totalLessons = curriculumLessons.length;
    const dailyProgress = totalLessons > 0 ? completedCount / totalLessons : 0;

    // Current lesson index
    const currentLessonIndex = useMemo(() => {
        if (!todayLesson) return totalLessons;
        return curriculumLessons.findIndex((l) => l.id === todayLesson.id) + 1;
    }, [todayLesson, curriculumLessons, totalLessons]);

    // Memoized quick actions config
    const quickActions = useMemo(() => [
        { icon: 'refresh' as const, label: 'Review', color: brand.primary },
        { icon: 'pencil' as const, label: 'Practice', color: brand.secondary },
        { icon: 'headset' as const, label: 'Listen', color: brand.accent },
        { icon: 'people' as const, label: 'Family', color: brand.primaryLight, route: '/family' },
    ], [brand]);

    // Pull-to-refresh with store re-hydration
    const [refreshing, setRefreshing] = useState(false);
    const onRefresh = useCallback(async () => {
        setRefreshing(true);
        try {
            // Re-read store state (Zustand persist will pick up any changes)
            useChildStore.getState();
            useLessonStore.getState();
        } finally {
            LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
            setRefreshing(false);
        }
    }, []);

    // ── Seed demo child ──
    const ensureChild = useCallback(() => {
        if (children.length === 0) {
            const c = addChild({ name: 'Yusuf', birthYear: 2019, avatarId: 'lion' });
            setActiveChild(c.id);
        } else if (!activeChildId) {
            const first = children[0];
            if (first) setActiveChild(first.id);
        }
    }, [children.length, activeChildId, addChild, setActiveChild]);

    useEffect(() => { ensureChild(); }, [ensureChild]);

    // ── Scroll-driven translucent header bar ──
    const scrollY = useSharedValue(0);
    const scrollHandler = useAnimatedScrollHandler({
        onScroll: (e) => { scrollY.value = e.contentOffset.y; },
    });

    const headerBarStyle = useAnimatedStyle(() => ({
        opacity: interpolate(scrollY.value, [0, 80], [0, 1], Extrapolation.CLAMP),
    }));

    const headerBorderStyle = useAnimatedStyle(() => ({
        borderBottomWidth: scrollY.value > 40 ? StyleSheet.hairlineWidth : 0,
    }));

    // ── Pulsing CTA ──
    const ctaPulse = useSharedValue(1);
    useEffect(() => {
        ctaPulse.value = withRepeat(
            withSequence(
                withTiming(1.025, { duration: 1400, easing: Easing.inOut(Easing.ease) }),
                withTiming(1, { duration: 1400, easing: Easing.inOut(Easing.ease) }),
            ),
            -1, true,
        );
    }, [ctaPulse]);

    const ctaStyle = useAnimatedStyle(() => ({
        transform: [{ scale: ctaPulse.value }],
    }));

    // ── Flame icon glow pulse ──
    const flameGlow = useSharedValue(0.8);
    useEffect(() => {
        flameGlow.value = withRepeat(
            withSequence(
                withTiming(1, { duration: 800, easing: Easing.out(Easing.ease) }),
                withTiming(0.8, { duration: 800, easing: Easing.in(Easing.ease) }),
            ),
            -1, true,
        );
    }, [flameGlow]);

    const flameStyle = useAnimatedStyle(() => ({
        opacity: flameGlow.value,
        transform: [{ scale: interpolate(flameGlow.value, [0.8, 1], [0.95, 1.12]) }],
    }));

    const greeting = useMemo(getGreeting, []);
    const greetingIcon = useMemo(getGreetingIcon, []);

    // ── Navigate to lesson player ──
    const navigateToLesson = useCallback((lessonId: string) => {
        router.push(`/lesson/${lessonId}` as any);
    }, [router]);

    // ── Empty state: no child profile yet ──
    if (!child && children.length === 0) {
        return (
            <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]}>
                <View style={styles.emptyState}>
                    <View
                        style={[
                            styles.emptyStateIcon,
                            { backgroundColor: brand.primary + '15', borderRadius: radius.full },
                        ]}
                    >
                        <Ionicons name="people-outline" size={48} color={brand.primary} />
                    </View>
                    <Text style={[typography.title2, { color: colors.text, marginTop: spacing.lg, textAlign: 'center' }]}>
                        Welcome to Sidrat!
                    </Text>
                    <Text
                        style={[
                            typography.bodySmall,
                            { color: colors.textSecondary, marginTop: spacing.xs, textAlign: 'center', paddingHorizontal: spacing.xl },
                        ]}
                    >
                        Let's set up your child's learning profile to get started on their Quran journey.
                    </Text>
                    <View style={{ marginTop: spacing.lg }}>
                        <Button
                            title="Create Profile"
                            variant="primary"
                            onPress={() => router.push('/onboarding' as any)}
                        />
                    </View>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]}>
            {/* ── Translucent header bar on scroll ── */}
            <Animated.View
                style={[
                    styles.stickyHeader,
                    { borderBottomColor: colors.separator },
                    headerBorderStyle,
                ]}
            >
                <Animated.View
                    style={[
                        StyleSheet.absoluteFill,
                        { backgroundColor: colors.background },
                        headerBarStyle,
                    ]}
                />
            </Animated.View>

            <Animated.ScrollView
                onScroll={scrollHandler}
                scrollEventThrottle={16}
                contentContainerStyle={[styles.scroll, { paddingHorizontal: spacing.md }]}
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        tintColor={brand.primary}
                        colors={[brand.primary]}
                    />
                }
            >
                {/* ── Header ─────────────────────────────────── */}
                <Animated.View
                    entering={FadeInDown.duration(500).springify().damping(18)}
                    style={styles.header}
                >
                    <View style={styles.headerLeft}>
                        {child && (
                            <ScalePress accessibilityLabel={`${child.name}'s avatar`}>
                                <Avatar avatarId={child.avatarId} size={52} />
                            </ScalePress>
                        )}
                        <View style={{ marginLeft: spacing.sm }}>
                            <View style={styles.greetingRow}>
                                <Text style={[typography.bodySmall, { color: colors.textSecondary }]}>
                                    {greeting}
                                </Text>
                                <Ionicons
                                    name={greetingIcon}
                                    size={14}
                                    color={brand.accent}
                                    style={{ marginLeft: 5 }}
                                />
                            </View>
                            <Text style={[typography.title2, { color: colors.text }]}>
                                {child?.name ?? 'Welcome'}
                            </Text>
                        </View>
                    </View>

                    <ScalePress
                        onPress={() => router.push('/notifications' as any)}
                        accessibilityLabel="Notifications"
                        style={[
                            styles.iconBtn,
                            { backgroundColor: colors.surfaceSecondary, borderRadius: radius.full },
                        ]}
                    >
                        <Ionicons name="notifications-outline" size={22} color={colors.textSecondary} />
                        {/* Notification badge dot */}
                        <View style={[
                            styles.notifDot,
                            { backgroundColor: colors.error, borderColor: colors.surfaceSecondary },
                        ]} />
                    </ScalePress>
                </Animated.View>

                {/* ── Streak Banner ──────────────────────────── */}
                {child && (
                    <Animated.View
                        entering={FadeInDown.delay(STAGGER).duration(600).springify().damping(16)}
                    >
                        <ScalePress accessibilityLabel={`Daily streak: ${child.currentStreak} days. Best: ${child.longestStreak} days`}>
                            <View
                                accessible
                                accessibilityLabel={`Daily streak: ${child.currentStreak} days. Best streak: ${child.longestStreak} days. Week ${child.currentWeekNumber}`}
                                style={[
                                    styles.streakBanner,
                                    {
                                        marginTop: spacing.lg,
                                        backgroundColor: brand.primary,
                                        borderRadius: radius.xl,
                                        padding: spacing.lg,
                                        ...shadows.elevated,
                                    },
                                ]}
                            >
                                {/* Decorative background circles */}
                                <View style={[styles.decorCircle, styles.decorCircle1]} />
                                <View style={[styles.decorCircle, styles.decorCircle2]} />

                                <View style={styles.streakContent}>
                                    <View style={{ flex: 1 }}>
                                        <Text
                                            style={[
                                                typography.captionBold,
                                                {
                                                    color: 'rgba(255,255,255,0.7)',
                                                    textTransform: 'uppercase',
                                                    letterSpacing: 1.2,
                                                },
                                            ]}
                                        >
                                            Daily Streak
                                        </Text>
                                        <View style={styles.streakRow}>
                                            <Text style={[typography.displayMedium, { color: '#FFFFFF' }]}>
                                                {child.currentStreak}
                                            </Text>
                                            <Animated.View style={[styles.flameWrapper, flameStyle]}>
                                                <Ionicons name="flame" size={30} color="#FF9500" />
                                            </Animated.View>
                                        </View>
                                        <Text
                                            style={[
                                                typography.caption,
                                                { color: 'rgba(255,255,255,0.5)', marginTop: 2 },
                                            ]}
                                        >
                                            Best: {child.longestStreak} days
                                        </Text>
                                    </View>

                                    {/* Week indicator ring */}
                                    <View style={styles.weekRingOuter}>
                                        <Text style={[typography.labelSmall, { color: 'rgba(255,255,255,0.6)' }]}>
                                            WEEK
                                        </Text>
                                        <Text style={[typography.title1, { color: '#FFFFFF' }]}>
                                            {child.currentWeekNumber}
                                        </Text>
                                    </View>
                                </View>

                                {/* Weekly crescent streak tracker */}
                                <WeekStreak streak={child.currentStreak} parentBg={brand.primary} />
                            </View>
                        </ScalePress>
                    </Animated.View>
                )}

                {/* ── Quick Actions ────────────────────────── */}
                <Animated.View
                    entering={FadeInDown.delay(STAGGER * 2).duration(600).springify().damping(16)}
                    style={{ marginTop: spacing.xl }}
                >
                    <SectionHeader title="Quick Actions" />
                    <HScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={{ gap: spacing.sm, paddingVertical: spacing.sm }}
                    >
                        {quickActions.map((action) => (
                            <QuickAction
                                key={action.label}
                                icon={action.icon}
                                label={action.label}
                                color={action.color}
                                onPress={action.route ? () => router.push(action.route as any) : undefined}
                            />
                        ))}
                    </HScrollView>
                </Animated.View>

                {/* ── Daily Progress ──────────────────────────── */}
                {child && (
                    <Animated.View
                        entering={FadeInDown.delay(STAGGER * 2.5).duration(600).springify().damping(16)}
                        style={{ marginTop: spacing.lg }}
                    >
                        <View
                            accessible
                            accessibilityLabel={`Daily progress: ${completedCount} of ${totalLessons} lessons completed`}
                            style={[
                                styles.progressCard,
                                {
                                    backgroundColor: colors.surface,
                                    borderRadius: radius.lg,
                                    padding: spacing.md,
                                    ...shadows.subtle,
                                },
                            ]}
                        >
                            <View style={styles.progressHeader}>
                                <View style={styles.progressLeft}>
                                    <Ionicons name="trending-up" size={18} color={brand.secondary} />
                                    <Text style={[typography.label, { color: colors.text, marginLeft: spacing.xs }]}>
                                        Daily Progress
                                    </Text>
                                </View>
                                <Text style={[typography.labelSmall, { color: brand.secondary }]}>
                                    {completedCount}/{totalLessons}
                                </Text>
                            </View>
                            <View style={{ marginTop: spacing.sm }}>
                                <ProgressBar
                                    progress={dailyProgress}
                                    color={brand.secondary}
                                    trackColor={brand.secondary + '18'}
                                    height={8}
                                />
                            </View>
                        </View>
                    </Animated.View>
                )}

                {/* ── Continue Where You Left Off ────────────── */}
                {inProgressLesson && inProgressLesson.id !== todayLesson?.id && (
                    <Animated.View
                        entering={FadeInDown.delay(STAGGER * 2.8).duration(600).springify().damping(16)}
                        style={{ marginTop: spacing.lg }}
                    >
                        <SectionHeader title="Continue" />
                        <ScalePress onPress={() => navigateToLesson(inProgressLesson.id)}>
                            <View
                                accessible
                                accessibilityLabel={`Continue lesson: ${inProgressLesson.title}`}
                                style={[
                                    styles.continueCard,
                                    {
                                        marginTop: spacing.sm,
                                        backgroundColor: brand.accent + '10',
                                        borderRadius: radius.lg,
                                        borderWidth: 1,
                                        borderColor: brand.accent + '25',
                                        padding: spacing.md,
                                    },
                                ]}
                            >
                                <View style={[styles.continueIcon, { backgroundColor: brand.accent + '20', borderRadius: radius.md }]}>
                                    <Ionicons name="play-circle" size={24} color={brand.accent} />
                                </View>
                                <View style={{ flex: 1, marginLeft: spacing.sm }}>
                                    <Text style={[typography.caption, { color: brand.accent }]}>
                                        Pick up where you left off
                                    </Text>
                                    <Text style={[typography.label, { color: colors.text, marginTop: 2 }]} numberOfLines={1}>
                                        {inProgressLesson.title}
                                    </Text>
                                    <View style={{ marginTop: spacing.xs }}>
                                        <ProgressBar
                                            progress={
                                                (() => {
                                                    const p = progressMap[`${activeChildId}:${inProgressLesson.id}`];
                                                    if (!p) return 0;
                                                    const completedPhases = Object.keys(p.phaseProgress ?? {}).length;
                                                    // Estimate progress from phases (5 typical phases per lesson)
                                                    return Math.min(completedPhases / 5, 0.95);
                                                })()
                                            }
                                            color={brand.accent}
                                            trackColor={brand.accent + '20'}
                                            height={4}
                                        />
                                    </View>
                                </View>
                                <Ionicons name="chevron-forward" size={20} color={brand.accent} style={{ marginLeft: spacing.sm }} />
                            </View>
                        </ScalePress>
                    </Animated.View>
                )}

                {/* ── Today's Lesson ─────────────────────────── */}
                <Animated.View
                    entering={FadeInDown.delay(STAGGER * 3).duration(600).springify().damping(16)}
                >
                    <SectionHeader
                        title="Today's Lesson"
                        onSeeAll={() => router.push('/learn' as any)}
                    />

                    {todayLesson ? (
                        <ScalePress
                            onPress={() => navigateToLesson(todayLesson.id)}
                            accessibilityLabel={`Today's lesson: ${todayLesson.title}. ${todayLesson.durationMinutes} minutes, ${todayLesson.xpReward} XP reward`}
                        >
                            <View
                                style={[
                                    styles.lessonCard,
                                    {
                                        marginTop: spacing.sm,
                                        backgroundColor: colors.surface,
                                        borderRadius: radius.lg,
                                        ...shadows.card,
                                    },
                                ]}
                            >
                                {/* Left accent bar */}
                                <View
                                    style={[
                                        styles.accentBar,
                                        { backgroundColor: brand.primary, borderRadius: radius.full },
                                    ]}
                                />

                                <View style={[styles.lessonBody, { padding: spacing.lg, paddingLeft: spacing.md }]}>
                                    {/* Lesson position indicator */}
                                    <Text style={[typography.caption, { color: colors.textTertiary, marginBottom: spacing.xxs }]}>
                                        Lesson {currentLessonIndex} of {totalLessons}
                                    </Text>
                                    <View style={styles.badgeRow}>
                                        <View
                                            style={[
                                                styles.categoryIcon,
                                                { backgroundColor: brand.primary + '15', borderRadius: radius.sm },
                                            ]}
                                        >
                                            <Ionicons
                                                name={categoryMeta[todayLesson.category].icon as any}
                                                size={14}
                                                color={brand.primary}
                                            />
                                        </View>
                                        <Badge
                                            label={categoryMeta[todayLesson.category].label}
                                            color={brand.primary}
                                        />
                                    </View>
                                    <Text
                                        style={[typography.title2, { color: colors.text, marginTop: spacing.sm }]}
                                    >
                                        {todayLesson.title}
                                    </Text>
                                    <Text
                                        style={[
                                            typography.bodySmall,
                                            { color: colors.textSecondary, marginTop: spacing.xxs },
                                        ]}
                                        numberOfLines={2}
                                    >
                                        {todayLesson.description}
                                    </Text>

                                    {/* Meta chips */}
                                    <View style={[styles.lessonMeta, { marginTop: spacing.md }]}>
                                        <View
                                            style={[
                                                styles.metaChip,
                                                {
                                                    backgroundColor: colors.surfaceSecondary,
                                                    borderRadius: radius.full,
                                                    paddingVertical: spacing.xxs,
                                                    paddingHorizontal: spacing.sm,
                                                },
                                            ]}
                                        >
                                            <Ionicons name="time-outline" size={14} color={colors.textTertiary} />
                                            <Text
                                                style={[
                                                    typography.captionBold,
                                                    { color: colors.textTertiary, marginLeft: 4 },
                                                ]}
                                            >
                                                {todayLesson.durationMinutes} min
                                            </Text>
                                        </View>
                                        <View
                                            style={[
                                                styles.metaChip,
                                                {
                                                    backgroundColor: brand.accent + '15',
                                                    borderRadius: radius.full,
                                                    paddingVertical: spacing.xxs,
                                                    paddingHorizontal: spacing.sm,
                                                },
                                            ]}
                                        >
                                            <Ionicons name="star" size={14} color={brand.accent} />
                                            <Text
                                                style={[
                                                    typography.captionBold,
                                                    { color: brand.accent, marginLeft: 4 },
                                                ]}
                                            >
                                                +{todayLesson.xpReward} XP
                                            </Text>
                                        </View>
                                    </View>

                                    {/* Pulsing CTA */}
                                    <Animated.View style={[{ marginTop: spacing.md }, ctaStyle]}>
                                        <Button
                                            title="Start Lesson"
                                            variant="primary"
                                            fullWidth
                                            onPress={() => navigateToLesson(todayLesson.id)}
                                        />
                                    </Animated.View>
                                </View>
                            </View>
                        </ScalePress>
                    ) : (
                        <View
                            accessible
                            accessibilityLabel="All lessons completed"
                            style={[
                                styles.emptyCard,
                                {
                                    marginTop: spacing.sm,
                                    backgroundColor: colors.surface,
                                    borderRadius: radius.lg,
                                    paddingVertical: spacing.xl,
                                    paddingHorizontal: spacing.lg,
                                    ...shadows.card,
                                },
                            ]}
                        >
                            <View
                                style={[
                                    styles.emptyIcon,
                                    { backgroundColor: brand.secondary + '15', borderRadius: radius.full },
                                ]}
                            >
                                <Ionicons name="checkmark-circle" size={36} color={brand.secondary} />
                            </View>
                            <Text style={[typography.title3, { color: colors.text, marginTop: spacing.sm }]}>
                                All caught up!
                            </Text>
                            <Text
                                style={[
                                    typography.bodySmall,
                                    { color: colors.textSecondary, marginTop: spacing.xxs, textAlign: 'center' },
                                ]}
                            >
                                You've completed all available lessons.
                            </Text>
                        </View>
                    )}
                </Animated.View>

                {/* ── Quick Stats ─────────────────────────────── */}
                {child && (
                    <Animated.View
                        entering={FadeInDown.delay(STAGGER * 4).duration(600).springify().damping(16)}
                    >
                        <SectionHeader
                            title="Your Progress"
                            onSeeAll={() => router.push('/progress' as any)}
                        />
                        <View style={[styles.statsRow, { marginTop: spacing.sm, gap: spacing.sm }]}>
                            <AnimatedStatCard
                                label="Total XP"
                                numericValue={child.totalXP}
                                iconName="flash"
                                color={brand.accent}
                                delay={STAGGER * 4}
                            />
                            <AnimatedStatCard
                                label="Lessons"
                                numericValue={child.totalLessonsCompleted}
                                iconName="book"
                                color={brand.secondary}
                                delay={STAGGER * 5}
                            />
                            <AnimatedStatCard
                                label="Streak"
                                numericValue={child.currentStreak}
                                iconName="flame"
                                color={brand.primary}
                                delay={STAGGER * 6}
                            />
                        </View>
                    </Animated.View>
                )}

                <View style={{ height: spacing.xxl }} />
            </Animated.ScrollView>
        </SafeAreaView>
    );
}

// ── Styles ──────────────────────────────────────────────────────

const styles = StyleSheet.create({
    safe: { flex: 1 },
    scroll: { paddingTop: 8, paddingBottom: 32 },

    /* Translucent scroll header */
    stickyHeader: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: 1,
        zIndex: 10,
    },

    /* Greeting header */
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    headerLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    iconBtn: {
        width: 44,
        height: 44,
        alignItems: 'center',
        justifyContent: 'center',
    },
    notifDot: {
        position: 'absolute',
        top: 8,
        right: 9,
        width: 9,
        height: 9,
        borderRadius: 4.5,
        borderWidth: 1.5,
    },

    /* Streak banner */
    streakBanner: {
        overflow: 'hidden',
    },
    streakContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    streakRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 4,
    },
    decorCircle: {
        position: 'absolute',
        borderRadius: 9999,
        backgroundColor: 'rgba(255,255,255,0.07)',
    },
    decorCircle1: {
        width: 130,
        height: 130,
        top: -35,
        right: -25,
    },
    decorCircle2: {
        width: 90,
        height: 90,
        bottom: -25,
        right: 55,
    },
    weekRingOuter: {
        width: 64,
        height: 64,
        borderRadius: 32,
        borderWidth: 2,
        borderColor: 'rgba(255,255,255,0.15)',
        alignItems: 'center',
        justifyContent: 'center',
    },

    /* Lesson card */
    lessonCard: {
        flexDirection: 'row',
        overflow: 'hidden',
    },
    accentBar: {
        width: 4,
    },
    lessonBody: {
        flex: 1,
    },
    lessonMeta: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    metaChip: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    emptyCard: {
        alignItems: 'center',
    },
    emptyIcon: {
        width: 64,
        height: 64,
        alignItems: 'center',
        justifyContent: 'center',
    },

    /* Daily progress card */
    progressCard: {},
    progressHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    progressLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    badgeRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    categoryIcon: {
        width: 28,
        height: 28,
        alignItems: 'center',
        justifyContent: 'center',
    },
    greetingRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    flameWrapper: {
        marginLeft: 6,
    },

    /* Stat cards */
    statsRow: {
        flexDirection: 'row',
    },

    /* Continue card */
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

    /* Empty state (no child) */
    emptyState: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 32,
    },
    emptyStateIcon: {
        width: 96,
        height: 96,
        alignItems: 'center',
        justifyContent: 'center',
    },
});
