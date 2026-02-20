/**
 * Review Session Screen
 *
 * Displays the spaced repetition review queue — lessons due for review,
 * ordered by urgency (critical → overdue → due today). Each card shows
 * category, last score, overdue status, and review count. Tapping a card
 * launches the lesson in review mode (practice-only).
 *
 * Empty state shown when no reviews are due, with encouragement.
 */

import React, { useCallback, useMemo } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    Pressable,
    Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import Animated, { FadeInDown, FadeInUp, FadeIn } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../src/theme';
import { useReviewQueue } from '../../src/hooks/useReviewQueue';
import { useAppStore, useLessonStore } from '../../src/stores';
import { ScalePress, ProgressBar } from '../../src/components';
import { categoryMeta } from '../../src/types';
import { haptics } from '../../src/utils/haptics';
import { groupReviewsByUrgency } from '../../src/utils/reviewGroups';
import { IS_DEV } from '../../src/constants/config';
import type { ReviewItem } from '../../src/hooks/useReviewQueue';

// ── Constants ────────────────────────────────────────────────────

const STAGGER = 80;

const URGENCY_CONFIG = {
    critical: {
        label: 'Critical',
        icon: 'alert-circle' as const,
        bgSuffix: '18',
        borderSuffix: '35',
    },
    overdue: {
        label: 'Overdue',
        icon: 'time' as const,
        bgSuffix: '14',
        borderSuffix: '28',
    },
    'due-today': {
        label: 'Due Today',
        icon: 'calendar' as const,
        bgSuffix: '10',
        borderSuffix: '20',
    },
} as const;

// ── Helper ───────────────────────────────────────────────────────

function getUrgencyColor(urgency: ReviewItem['urgency'], brand: { coral: string; accent: string; primary: string }) {
    switch (urgency) {
        case 'critical': return brand.coral;
        case 'overdue': return brand.accent;
        case 'due-today': return brand.primary;
    }
}

function getScoreColor(score: number, brand: { secondary: string; accent: string; coral: string }) {
    if (score >= 80) return brand.secondary;
    if (score >= 50) return brand.accent;
    return brand.coral;
}

function getDaysLabel(days: number): string {
    if (days === 0) return 'Due today';
    if (days === 1) return '1 day overdue';
    return `${days} days overdue`;
}

// ── Main Component ──────────────────────────────────────────────

export default function ReviewScreen() {
    const { brand, colors, typography, spacing, radius, isDark } = useTheme();
    const router = useRouter();
    const { reviewQueue, reviewCount, hasReviews, nextReview } = useReviewQueue();
    const activeChildId = useAppStore((s) => s.activeChildId);

    // ── DEV ONLY: backdate all completed lessons so they appear as due ──
    const seedTestReviews = useCallback(() => {
        if (!activeChildId) return;
        const store = useLessonStore.getState();
        const progress = { ...store.progress };
        let seeded = 0;

        for (const [key, p] of Object.entries(progress)) {
            if (p.childId === activeChildId && p.isCompleted && p.completedAt) {
                // Set review date to yesterday so it shows up as due
                const yesterday = new Date();
                yesterday.setDate(yesterday.getDate() - 1);
                progress[key] = {
                    ...p,
                    nextReviewDate: yesterday.toISOString(),
                    intervalIndex: 0,
                    reviewCount: p.reviewCount ?? 0,
                };
                seeded++;
            }
        }

        if (seeded > 0) {
            useLessonStore.setState({ progress });
            haptics.success();
            Alert.alert('Dev', `Seeded ${seeded} lessons for review. They should appear now.`);
        } else {
            Alert.alert('Dev', 'No completed lessons found. Complete at least one lesson first.');
        }
    }, [activeChildId]);

    const navigateToReview = useCallback(
        (lessonId: string) => {
            haptics.light();
            router.push(`/lesson/${lessonId}?review=1` as any);
        },
        [router],
    );

    const handleStartAll = useCallback(() => {
        if (nextReview) {
            navigateToReview(nextReview.lessonId);
        }
    }, [nextReview, navigateToReview]);

    // Group reviews by urgency for section rendering
    const sections = useMemo(() => groupReviewsByUrgency(reviewQueue), [reviewQueue]);

    return (
        <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]}>
            {/* ── Header ── */}
            <Animated.View entering={FadeIn.duration(400)} style={styles.header}>
                <Pressable onPress={() => router.back()} hitSlop={12} style={styles.backButton}>
                    <Ionicons name="chevron-back" size={24} color={colors.textSecondary} />
                </Pressable>
                <View style={styles.headerCenter}>
                    <Text style={[typography.title2, { color: colors.text }]}>Reviews</Text>
                </View>
                {/* Balance the back button */}
                <View style={styles.backButton} />
            </Animated.View>

            {hasReviews ? (
                <ScrollView
                    contentContainerStyle={[styles.scroll, { paddingHorizontal: spacing.md }]}
                    showsVerticalScrollIndicator={false}
                >
                    {/* ── Summary Card ── */}
                    <Animated.View
                        entering={FadeInDown.duration(600).springify().damping(18)}
                        style={[
                            styles.summaryCard,
                            {
                                backgroundColor: isDark ? colors.surfaceSecondary : brand.primary + '08',
                                borderRadius: radius.lg,
                                padding: spacing.lg,
                                borderWidth: 1,
                                borderColor: brand.primary + '15',
                            },
                        ]}
                    >
                        <View style={styles.summaryTop}>
                            <View
                                style={[
                                    styles.summaryIcon,
                                    { backgroundColor: brand.primary + '15', borderRadius: radius.full },
                                ]}
                            >
                                <Ionicons name="refresh" size={24} color={brand.primary} />
                            </View>
                            <View style={{ flex: 1, marginLeft: spacing.sm }}>
                                <Text style={[typography.title3, { color: colors.text }]}>
                                    {reviewCount} {reviewCount === 1 ? 'Lesson' : 'Lessons'} to Review
                                </Text>
                                <Text style={[typography.bodySmall, { color: colors.textSecondary, marginTop: 2 }]}>
                                    Reviewing helps you remember what you've learned!
                                </Text>
                            </View>
                        </View>

                        <Pressable
                            onPress={handleStartAll}
                            style={[
                                styles.startAllButton,
                                {
                                    backgroundColor: brand.primary,
                                    borderRadius: radius.md,
                                    marginTop: spacing.md,
                                    paddingVertical: spacing.sm,
                                },
                            ]}
                            accessibilityLabel={`Start reviewing ${reviewCount} lessons`}
                        >
                            <Ionicons name="play-circle" size={20} color="#FFF" />
                            <Text style={[typography.label, { color: '#FFF', marginLeft: spacing.xs }]}>
                                Start Reviewing
                            </Text>
                        </Pressable>
                    </Animated.View>

                    {/* ── Review Sections by Urgency ── */}
                    {sections.map((section, sectionIdx) => {
                        const urgencyColor = getUrgencyColor(section.urgency, brand);
                        const config = URGENCY_CONFIG[section.urgency];

                        return (
                            <Animated.View
                                key={section.urgency}
                                entering={FadeInDown.delay(STAGGER * (sectionIdx + 1)).duration(600).springify().damping(16)}
                                style={{ marginTop: spacing.lg }}
                            >
                                {/* Section header */}
                                <View style={styles.sectionHeader}>
                                    <Ionicons name={config.icon} size={16} color={urgencyColor} />
                                    <Text style={[typography.label, { color: urgencyColor, marginLeft: spacing.xs }]}>
                                        {config.label}
                                    </Text>
                                    <View
                                        style={[
                                            styles.countBadge,
                                            {
                                                backgroundColor: urgencyColor + '18',
                                                borderRadius: radius.full,
                                                marginLeft: spacing.xs,
                                            },
                                        ]}
                                    >
                                        <Text style={[typography.captionBold, { color: urgencyColor }]}>
                                            {section.items.length}
                                        </Text>
                                    </View>
                                </View>

                                {/* Cards */}
                                {section.items.map((item, i) => (
                                    <ReviewCard
                                        key={item.lessonId}
                                        item={item}
                                        delay={STAGGER * (sectionIdx + 1) + STAGGER * (i + 1)}
                                        onPress={() => navigateToReview(item.lessonId)}
                                    />
                                ))}
                            </Animated.View>
                        );
                    })}

                    {/* ── Motivational footer ── */}
                    <Animated.View
                        entering={FadeInUp.delay(STAGGER * (sections.length + 2)).duration(500)}
                        style={[styles.footer, { marginTop: spacing.xl, paddingBottom: spacing.xxl }]}
                    >
                        <Ionicons name="sparkles" size={18} color={brand.accent} />
                        <Text
                            style={[
                                typography.bodySmall,
                                { color: colors.textTertiary, marginLeft: spacing.xs, fontStyle: 'italic' },
                            ]}
                        >
                            Regular review builds lasting knowledge, in sha Allah!
                        </Text>
                    </Animated.View>
                </ScrollView>
            ) : (
                /* ── Empty State ── */
                <View style={styles.emptyState}>
                    <Animated.View
                        entering={FadeInDown.duration(700).springify().damping(14)}
                        style={styles.emptyContent}
                    >
                        <View
                            style={[
                                styles.emptyIcon,
                                { backgroundColor: brand.secondary + '12', borderRadius: radius.full },
                            ]}
                        >
                            <Ionicons name="checkmark-circle" size={52} color={brand.secondary} />
                        </View>
                        <Text style={[typography.title2, { color: colors.text, marginTop: spacing.lg, textAlign: 'center' }]}>
                            All caught up!
                        </Text>
                        <Text
                            style={[
                                typography.body,
                                {
                                    color: colors.textSecondary,
                                    marginTop: spacing.xs,
                                    textAlign: 'center',
                                    paddingHorizontal: spacing.xl,
                                    lineHeight: 22,
                                },
                            ]}
                        >
                            No reviews due right now. Keep completing lessons and reviews will appear automatically.
                        </Text>

                        <Pressable
                            onPress={() => router.back()}
                            style={[
                                styles.emptyButton,
                                {
                                    backgroundColor: brand.primary + '10',
                                    borderRadius: radius.md,
                                    marginTop: spacing.xl,
                                    paddingVertical: spacing.sm,
                                    paddingHorizontal: spacing.lg,
                                },
                            ]}
                        >
                            <Ionicons name="arrow-back" size={18} color={brand.primary} />
                            <Text style={[typography.label, { color: brand.primary, marginLeft: spacing.xs }]}>
                                Back to Home
                            </Text>
                        </Pressable>

                        {/* DEV ONLY: seed test reviews */}
                        {IS_DEV && (
                            <Pressable
                                onPress={seedTestReviews}
                                style={[
                                    styles.emptyButton,
                                    {
                                        backgroundColor: brand.lavender + '15',
                                        borderRadius: radius.md,
                                        marginTop: spacing.sm,
                                        paddingVertical: spacing.sm,
                                        paddingHorizontal: spacing.lg,
                                        borderWidth: 1,
                                        borderColor: brand.lavender + '30',
                                        borderStyle: 'dashed',
                                    },
                                ]}
                            >
                                <Ionicons name="flask" size={18} color={brand.lavender} />
                                <Text style={[typography.label, { color: brand.lavender, marginLeft: spacing.xs }]}>
                                    Seed Test Reviews (Dev)
                                </Text>
                            </Pressable>
                        )}
                    </Animated.View>
                </View>
            )}
        </SafeAreaView>
    );
}

// ── Review Card Component ───────────────────────────────────────

function ReviewCard({
    item,
    delay,
    onPress,
}: {
    item: ReviewItem;
    delay: number;
    onPress: () => void;
}) {
    const { brand, colors, typography, spacing, radius, shadows, isDark } = useTheme();

    const urgencyColor = getUrgencyColor(item.urgency, brand);
    const scoreColor = getScoreColor(item.lastScore, brand);
    const categoryInfo = categoryMeta[item.lesson.category];

    return (
        <Animated.View entering={FadeInDown.delay(delay).duration(500).springify().damping(16)}>
            <ScalePress onPress={onPress} accessibilityLabel={`Review ${item.lesson.title}. ${getDaysLabel(item.daysOverdue)}`}>
                <View
                    style={[
                        styles.card,
                        {
                            backgroundColor: colors.surface,
                            borderRadius: radius.lg,
                            marginTop: spacing.sm,
                            borderWidth: 1,
                            borderColor: isDark ? urgencyColor + '20' : colors.separator,
                            ...shadows.subtle,
                        },
                    ]}
                >
                    {/* Left accent bar */}
                    <View style={[styles.cardAccent, { backgroundColor: urgencyColor, borderRadius: radius.full }]} />

                    <View style={[styles.cardBody, { padding: spacing.md, paddingLeft: spacing.sm }]}>
                        {/* Category + urgency badges */}
                        <View style={styles.cardBadgeRow}>
                            <View
                                style={[
                                    styles.categoryBadge,
                                    {
                                        backgroundColor: brand.primary + '12',
                                        borderRadius: radius.full,
                                        paddingHorizontal: spacing.xs,
                                        paddingVertical: 2,
                                    },
                                ]}
                            >
                                <Ionicons name={categoryInfo?.icon as any} size={12} color={brand.primary} />
                                <Text style={[typography.captionBold, { color: brand.primary, marginLeft: 3 }]}>
                                    {categoryInfo?.label}
                                </Text>
                            </View>

                            <View
                                style={[
                                    styles.urgencyBadge,
                                    {
                                        backgroundColor: urgencyColor + '12',
                                        borderRadius: radius.full,
                                        paddingHorizontal: spacing.xs,
                                        paddingVertical: 2,
                                        marginLeft: spacing.xs,
                                    },
                                ]}
                            >
                                <Ionicons name={URGENCY_CONFIG[item.urgency].icon} size={11} color={urgencyColor} />
                                <Text style={[typography.captionBold, { color: urgencyColor, marginLeft: 3, fontSize: 10 }]}>
                                    {getDaysLabel(item.daysOverdue)}
                                </Text>
                            </View>
                        </View>

                        {/* Title */}
                        <Text
                            style={[typography.label, { color: colors.text, marginTop: spacing.xs }]}
                            numberOfLines={1}
                        >
                            {item.lesson.title}
                        </Text>

                        {/* Meta row */}
                        <View style={[styles.cardMeta, { marginTop: spacing.sm, gap: spacing.md }]}>
                            {/* Last score */}
                            <View style={styles.metaItem}>
                                <Ionicons name="bar-chart" size={13} color={scoreColor} />
                                <Text style={[typography.caption, { color: scoreColor, marginLeft: 3 }]}>
                                    {item.lastScore}%
                                </Text>
                            </View>

                            {/* Review count */}
                            <View style={styles.metaItem}>
                                <Ionicons name="repeat" size={13} color={colors.textTertiary} />
                                <Text style={[typography.caption, { color: colors.textTertiary, marginLeft: 3 }]}>
                                    {item.reviewCount === 0
                                        ? 'First review'
                                        : `Reviewed ${item.reviewCount}x`}
                                </Text>
                            </View>

                            {/* Duration */}
                            <View style={styles.metaItem}>
                                <Ionicons name="time-outline" size={13} color={colors.textTertiary} />
                                <Text style={[typography.caption, { color: colors.textTertiary, marginLeft: 3 }]}>
                                    ~{Math.max(2, Math.round(item.lesson.durationMinutes * 0.4))} min
                                </Text>
                            </View>
                        </View>

                        {/* Score progress bar */}
                        <View style={{ marginTop: spacing.sm }}>
                            <ProgressBar
                                progress={item.lastScore / 100}
                                color={scoreColor}
                                trackColor={scoreColor + '18'}
                                height={4}
                            />
                        </View>
                    </View>

                    {/* Chevron */}
                    <View style={[styles.cardChevron, { paddingRight: spacing.sm }]}>
                        <Ionicons name="play-circle" size={24} color={urgencyColor + '80'} />
                    </View>
                </View>
            </ScalePress>
        </Animated.View>
    );
}

// ── Styles ──────────────────────────────────────────────────────

const styles = StyleSheet.create({
    safe: { flex: 1 },
    scroll: { paddingTop: 8, paddingBottom: 32 },

    // Header
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 8,
    },
    backButton: {
        width: 36,
        height: 36,
        alignItems: 'center',
        justifyContent: 'center',
    },
    headerCenter: {
        flex: 1,
        alignItems: 'center',
    },

    // Summary card
    summaryCard: {},
    summaryTop: {
        flexDirection: 'row',
        alignItems: 'flex-start',
    },
    summaryIcon: {
        width: 48,
        height: 48,
        alignItems: 'center',
        justifyContent: 'center',
    },
    startAllButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },

    // Section headers
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 4,
    },
    countBadge: {
        paddingHorizontal: 7,
        paddingVertical: 1,
    },

    // Review card
    card: {
        flexDirection: 'row',
        overflow: 'hidden',
    },
    cardAccent: {
        width: 4,
    },
    cardBody: {
        flex: 1,
    },
    cardBadgeRow: {
        flexDirection: 'row',
        alignItems: 'center',
        flexWrap: 'wrap',
    },
    categoryBadge: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    urgencyBadge: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    cardMeta: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    metaItem: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    cardChevron: {
        justifyContent: 'center',
    },

    // Footer
    footer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },

    // Empty state
    emptyState: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 32,
    },
    emptyContent: {
        alignItems: 'center',
    },
    emptyIcon: {
        width: 96,
        height: 96,
        alignItems: 'center',
        justifyContent: 'center',
    },
    emptyButton: {
        flexDirection: 'row',
        alignItems: 'center',
    },
});
