/**
 * Home Screen (index tab)
 *
 * "Playful luxury" redesign — Apple Health/Fitness meets Headspace:
 * warm gradients, soft shapes, elegant data visualization,
 * distinctive brand feel.
 *
 * Components extracted to:
 *   src/components/         — ScalePress, SectionHeader, ProgressBar, Card
 *   src/components/home/    — AnimatedCounter, AyahOfTheDay, DuaOfTheDay, SalahReminder
 */

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
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
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
import { Avatar, Badge, BismillahHeader, Button, Card, ScalePress, SectionHeader, ProgressBar } from '../../src/components';
import { AyahOfTheDay, DuaOfTheDay, HomeSkeletonLoader, SalahReminder } from '../../src/components/home';
import { categoryMeta } from '../../src/types';
import { allCurriculumLessons } from '../../src/data/curriculum';
import { useReviewQueue } from '../../src/hooks/useReviewQueue';

// ── Constants ────────────────────────────────────────────────────

const STAGGER = 80;

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
}

// ── Helpers ──────────────────────────────────────────────────────

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

function getMotivationalSubtitle(child: { currentStreak: number; totalLessonsCompleted: number } | undefined): string {
    if (!child) return 'Start your Quran journey';
    if (child.totalLessonsCompleted === 0) return 'Ready for your first lesson?';
    if (child.currentStreak >= 7) return `Masha'Allah! ${child.currentStreak}-day streak ✨`;
    if (child.currentStreak >= 3) return `Keep your ${child.currentStreak}-day streak going!`;
    if (child.currentStreak === 1) return 'Great start — keep it up!';
    return "Let's learn something new today";
}

/**
 * Returns a hero gradient pair that shifts with the time of day.
 * Dawn → warm amber/gold, Morning → teal/sky, Afternoon → golden/teal,
 * Evening → purple/coral, Night → deep indigo/navy.
 */
function getTimeBasedHeroGradient(): [string, string] {
    const hour = new Date().getHours();
    if (hour >= 4 && hour < 7) return ['#8A5E10', '#055F6E']; // Fajr — warm amber → teal
    if (hour >= 7 && hour < 12) return ['#055F6E', '#1A7AB5']; // Morning — teal → sky blue
    if (hour >= 12 && hour < 16) return ['#055F6E', '#0A3F5C']; // Afternoon — teal → deep navy (default feel)
    if (hour >= 16 && hour < 19) return ['#8A5E10', '#9E3844']; // Sunset — gold → soft coral
    if (hour >= 19 && hour < 21) return ['#3D2B7A', '#9E3844']; // Evening — purple → coral
    return ['#0F1A28', '#1A3A5C'];                              // Night — deep indigo → navy
}

// ── Main Component ──────────────────────────────────────────────

export default function HomeScreen() {
    const { brand, colors, typography, spacing, radius, shadows, isDark, gradients } = useTheme();
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

    // ── Review queue ──
    const { reviewCount, hasReviews, nextReview } = useReviewQueue();

    // Did the child complete a lesson today? (controls review card visibility)
    const completedLessonToday = useMemo(() => {
        if (!activeChildId) return false;
        const todayStr = new Date().toDateString();
        return Object.values(progressMap).some(
            (p) => p.childId === activeChildId && p.isCompleted && p.completedAt
                && new Date(p.completedAt).toDateString() === todayStr,
        );
    }, [activeChildId, progressMap]);

    // Allow user to dismiss the review card for this session
    const [reviewsDismissed, setReviewsDismissed] = useState(false);

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

    const totalLessons = curriculumLessons.length;

    // Current lesson index
    const currentLessonIndex = useMemo(() => {
        if (!todayLesson) return totalLessons;
        return curriculumLessons.findIndex((l) => l.id === todayLesson.id) + 1;
    }, [todayLesson, curriculumLessons, totalLessons]);

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

    // ── Parallax orb transforms (each orb moves at a different rate) ──
    const orbLargeStyle = useAnimatedStyle(() => ({
        transform: [
            { translateY: interpolate(scrollY.value, [0, 200], [0, -30], Extrapolation.CLAMP) },
            { translateX: interpolate(scrollY.value, [0, 200], [0, 12], Extrapolation.CLAMP) },
            { scale: interpolate(scrollY.value, [0, 200], [1, 1.15], Extrapolation.CLAMP) },
        ],
    }));
    const orbSmallStyle = useAnimatedStyle(() => ({
        transform: [
            { translateY: interpolate(scrollY.value, [0, 200], [0, -15], Extrapolation.CLAMP) },
            { translateX: interpolate(scrollY.value, [0, 200], [0, -8], Extrapolation.CLAMP) },
        ],
    }));
    const orbMediumStyle = useAnimatedStyle(() => ({
        transform: [
            { translateY: interpolate(scrollY.value, [0, 200], [0, -22], Extrapolation.CLAMP) },
            { scale: interpolate(scrollY.value, [0, 200], [1, 0.9], Extrapolation.CLAMP) },
        ],
        opacity: interpolate(scrollY.value, [0, 150], [1, 0.4], Extrapolation.CLAMP),
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

    const greeting = useMemo(getGreeting, []);
    const greetingIcon = useMemo(getGreetingIcon, []);
    const subtitle = useMemo(() => getMotivationalSubtitle(child), [child?.currentStreak, child?.totalLessonsCompleted]);
    const heroGradient = useMemo(getTimeBasedHeroGradient, []);

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
                    <BismillahHeader size="sm" color={brand.primary + '50'} />
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

    // ── Skeleton loading state: child exists but data hydrating ──
    if (!child) {
        return (
            <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]} edges={['left', 'right']}>
                <HomeSkeletonLoader />
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]} edges={['left', 'right']}>
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
                {/* ── Gradient Hero Greeting ──────────────────── */}
                <Animated.View entering={FadeInDown.duration(500).springify().damping(18)}>
                    <LinearGradient
                        colors={heroGradient}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={[
                            styles.heroGradient,
                            {
                                borderBottomLeftRadius: radius.xl,
                                borderBottomRightRadius: radius.xl,
                                paddingHorizontal: spacing.lg,
                                paddingTop: spacing.xl + 44, // account for safe area
                                paddingBottom: spacing.xl,
                            },
                        ]}
                    >
                        {/* Decorative parallax orbs */}
                        <Animated.View style={[styles.heroOrb, styles.heroOrbLarge, orbLargeStyle]} />
                        <Animated.View style={[styles.heroOrb, styles.heroOrbSmall, orbSmallStyle]} />
                        <Animated.View style={[styles.heroOrb, styles.heroOrbMedium, orbMediumStyle]} />

                        <View style={styles.header}>
                            <View style={styles.headerLeft}>
                                {child && (
                                    <ScalePress
                                        onPress={() => router.push('/family' as any)}
                                        accessibilityLabel={`${child.name}'s avatar — switch child`}
                                    >
                                        <View style={[styles.avatarRing, { borderRadius: radius.full }]}>
                                            <Avatar avatarId={child.avatarId} size={52} />
                                        </View>
                                    </ScalePress>
                                )}
                                <View style={{ marginLeft: spacing.sm, flex: 1 }}>
                                    <View style={styles.greetingRow}>
                                        <Text style={[typography.bodySmall, { color: 'rgba(255,255,255,0.8)' }]}>
                                            {greeting}
                                        </Text>
                                        <Ionicons
                                            name={greetingIcon}
                                            size={14}
                                            color={brand.accentLight}
                                            style={{ marginLeft: 5 }}
                                        />
                                    </View>
                                    <Text style={[typography.title2, { color: '#FFFFFF' }]}>
                                        {child?.name ?? 'Welcome'}
                                    </Text>
                                    <Text
                                        style={[
                                            typography.caption,
                                            { color: 'rgba(255,255,255,0.6)', marginTop: 2 },
                                        ]}
                                        numberOfLines={1}
                                    >
                                        {subtitle}
                                    </Text>
                                </View>
                            </View>

                            {/* Settings */}
                            <ScalePress
                                onPress={() => router.push('/settings' as any)}
                                accessibilityLabel="Settings"
                                style={[
                                    styles.iconBtn,
                                    { backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: radius.full },
                                ]}
                            >
                                <Ionicons name="settings-outline" size={21} color="#FFFFFF" />
                            </ScalePress>
                        </View>
                    </LinearGradient>
                </Animated.View>

                {/* ── Content area ────────────────────────────── */}
                <View style={{ paddingHorizontal: spacing.md }}>

                    {/* ── Salah Reminder (ambient) ─────────────── */}
                    <View style={{ marginTop: spacing.md }}>
                        <SalahReminder />
                    </View>

                    {/* ── Today's Lesson ─────────────────────────── */}
                    <Animated.View
                        entering={FadeInDown.delay(STAGGER).duration(600).springify().damping(16)}
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
                                            borderRadius: radius.xl,
                                            borderWidth: 1,
                                            borderColor: isDark ? colors.border : brand.accent + '18',
                                            ...shadows.cardPremium,
                                        },
                                    ]}
                                >
                                    {/* Top gradient accent strip */}
                                    <LinearGradient
                                        colors={[brand.accent + '40', brand.primary + '40', brand.accent + '40']}
                                        start={{ x: 0, y: 0 }}
                                        end={{ x: 1, y: 0 }}
                                        style={styles.lessonAccentStrip}
                                    />

                                    <View style={[styles.lessonBody, { padding: spacing.lg }]}>
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

                                        {/* Pulsing gradient CTA */}
                                        <Animated.View style={[{ marginTop: spacing.md }, ctaStyle]}>
                                            <ScalePress onPress={() => navigateToLesson(todayLesson.id)}>
                                                <LinearGradient
                                                    colors={gradients.heroCta as unknown as [string, string]}
                                                    start={{ x: 0, y: 0 }}
                                                    end={{ x: 1, y: 0 }}
                                                    style={[
                                                        styles.gradientCta,
                                                        { borderRadius: radius.lg },
                                                    ]}
                                                >
                                                    <Text style={[typography.label, { color: '#FFFFFF', letterSpacing: 0.3 }]}>
                                                        Start Lesson
                                                    </Text>
                                                    <Ionicons name="arrow-forward" size={18} color="#FFFFFF" style={{ marginLeft: 8 }} />
                                                </LinearGradient>
                                            </ScalePress>
                                        </Animated.View>
                                    </View>
                                </View>
                            </ScalePress>
                        ) : (
                            <Card
                                variant="premium"
                                style={{
                                    marginTop: spacing.sm,
                                    alignItems: 'center' as const,
                                    paddingVertical: spacing.xl,
                                }}
                            >
                                <View
                                    accessible
                                    accessibilityLabel="All lessons completed"
                                    style={styles.emptyCard}
                                >
                                    <View
                                        style={[
                                            styles.emptyIcon,
                                            { backgroundColor: brand.secondary + '12', borderRadius: radius.full, borderWidth: 1.5, borderColor: brand.secondary + '25' },
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
                            </Card>
                        )}
                    </Animated.View>

                    {/* ── Reviews Due (shown after completing a lesson today) ── */}
                    {hasReviews && completedLessonToday && !reviewsDismissed && (
                        <Animated.View
                            entering={FadeInDown.delay(STAGGER * 2).duration(600).springify().damping(16)}
                            style={{ marginTop: spacing.lg }}
                        >
                            <ScalePress onPress={() => router.push('/review' as any)}>
                                <Card variant="filled" accentColor={brand.coral} noPadding>
                                    <View
                                        accessible
                                        accessibilityLabel={`${reviewCount} lessons due for review. Tap to start reviewing.`}
                                        style={[
                                            styles.continueCard,
                                            { padding: spacing.md },
                                        ]}
                                    >
                                        {/* Left gradient indicator */}
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
                                            <Text style={[typography.caption, { color: brand.coral }]}>
                                                Reviews Due
                                            </Text>
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
                                                {
                                                    backgroundColor: brand.coral,
                                                    borderRadius: radius.full,
                                                },
                                            ]}
                                        >
                                            <Text style={[typography.captionBold, { color: '#FFF' }]}>
                                                {reviewCount}
                                            </Text>
                                        </View>
                                    </View>
                                </Card>
                            </ScalePress>

                            {/* Dismiss button */}
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

                    {/* ── Continue Where You Left Off ────────────── */}
                    {inProgressLesson && inProgressLesson.id !== todayLesson?.id && (
                        <Animated.View
                            entering={FadeInDown.delay(STAGGER * 2.5).duration(600).springify().damping(16)}
                            style={{ marginTop: spacing.lg }}
                        >
                            <SectionHeader title="Continue" />
                            <ScalePress onPress={() => navigateToLesson(inProgressLesson.id)}>
                                <Card variant="filled" accentColor={brand.accent} noPadding>
                                    <View
                                        accessible
                                        accessibilityLabel={`Continue lesson: ${inProgressLesson.title}`}
                                        style={[
                                            styles.continueCard,
                                            { padding: spacing.md },
                                        ]}
                                    >
                                        {/* Left warm gradient indicator */}
                                        <LinearGradient
                                            colors={gradients.heroCta as unknown as [string, string]}
                                            start={{ x: 0, y: 0 }}
                                            end={{ x: 0, y: 1 }}
                                            style={[
                                                styles.continueLeftEdge,
                                                { borderRadius: radius.full },
                                            ]}
                                        />
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
                                </Card>
                            </ScalePress>
                        </Animated.View>
                    )}

                    {/* ── Ayah of the Day ──────────────────────── */}
                    <Animated.View
                        entering={FadeInDown.delay(STAGGER * 3.5).duration(600).springify().damping(16)}
                        style={{ marginTop: spacing.lg }}
                    >
                        <AyahOfTheDay />
                    </Animated.View>

                    {/* ── Dua of the Day ───────────────────────── */}
                    <Animated.View
                        entering={FadeInDown.delay(STAGGER * 4).duration(600).springify().damping(16)}
                        style={{ marginTop: spacing.lg }}
                    >
                        <DuaOfTheDay />
                    </Animated.View>

                    {/* ── Bottom spacing for absolute tab bar ─── */}
                    <View style={{ height: 100 }} />
                </View>
            </Animated.ScrollView>
        </SafeAreaView>
    );
}

// ── Styles ──────────────────────────────────────────────────────

const styles = StyleSheet.create({
    safe: { flex: 1 },
    scroll: { paddingBottom: 32 },

    /* Translucent scroll header */
    stickyHeader: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: 1,
        zIndex: 10,
    },

    /* Gradient hero */
    heroGradient: {
        overflow: 'hidden',
        position: 'relative',
    },
    heroOrb: {
        position: 'absolute',
        borderRadius: 999,
        backgroundColor: 'rgba(255,255,255,0.06)',
    },
    heroOrbLarge: {
        width: 200,
        height: 200,
        top: -40,
        right: -60,
    },
    heroOrbSmall: {
        width: 80,
        height: 80,
        bottom: 20,
        left: -20,
    },
    heroOrbMedium: {
        width: 120,
        height: 120,
        top: 30,
        left: '40%' as unknown as number,
        backgroundColor: 'rgba(255,255,255,0.03)',
    },
    avatarRing: {
        borderWidth: 2.5,
        borderColor: 'rgba(255,255,255,0.3)',
        padding: 2,
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
        flex: 1,
    },
    iconBtn: {
        width: 44,
        height: 44,
        alignItems: 'center',
        justifyContent: 'center',
    },

    /* Lesson card */
    lessonCard: {
        overflow: 'hidden',
    },
    lessonAccentStrip: {
        height: 3,
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

    /* Gradient CTA button */
    gradientCta: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 14,
        paddingHorizontal: 24,
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
    continueLeftEdge: {
        position: 'absolute',
        left: 0,
        top: 8,
        bottom: 8,
        width: 4,
    },

    /* Review badge */
    reviewBadge: {
        minWidth: 26,
        height: 26,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 6,
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
