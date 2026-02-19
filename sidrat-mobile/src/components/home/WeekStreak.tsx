/**
 * WeekStreak — Minimal 7-day streak tracker.
 *
 * A clean, surface-level card that sits on the home screen with
 * the same card language as AnimatedStatCard. No hardcoded colors —
 * everything from theme tokens.
 *
 * Features:
 *  • Surface card with subtle shadow matching the theme
 *  • 7 day columns: filled circle for active, outlined for inactive
 *  • Today column gets the accent ring and label underline
 *  • Streak count + flame icon headline
 *  • "Best" and "This week" meta row
 *  • Full-week congratulations badge
 *  • Dark/light mode aware throughout
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../../theme';

const WEEKDAYS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'] as const;

interface WeekStreakProps {
    streak: number;
    longestStreak?: number;
}

export function WeekStreak({ streak, longestStreak }: WeekStreakProps) {
    const { brand, colors, typography, radius, spacing, shadows, isDark, gradients } = useTheme();
    const today = new Date().getDay(); // 0 = Sun
    const isFullWeek = streak >= 7;

    // Count how many days this week are active
    const activeDaysThisWeek = Math.min(streak, 7);

    return (
        <Animated.View
            entering={FadeIn.duration(500)}
            style={[
                styles.card,
                {
                    paddingTop: spacing.md,
                    paddingHorizontal: spacing.lg,
                    backgroundColor: isDark ? colors.surfaceSecondary : colors.surface,
                    borderRadius: radius.xl,
                    borderWidth: isDark ? 1 : 0,
                    borderColor: isDark ? colors.border : 'transparent',
                    ...shadows.card,
                },
            ]}
        >
            {/* ── Header row: streak count + meta ── */}
            <View style={[styles.header, { marginBottom: spacing.lg }]}>
                <View style={styles.streakInfo}>
                    <View style={styles.streakCountRow}>
                        <Text style={[typography.title1, { color: colors.text }]}>
                            {streak}
                        </Text>
                        <Ionicons
                            name="flame"
                            size={22}
                            color={brand.coral}
                            style={{ marginLeft: 4, marginBottom: 2 }}
                        />
                    </View>
                    <Text style={[typography.caption, { color: colors.textTertiary }]}>
                        day streak
                    </Text>
                </View>

                {longestStreak !== undefined && (
                    <View style={styles.metaPill}>
                        <Text
                            style={[
                                typography.labelXs,
                                { color: colors.textTertiary },
                            ]}
                        >
                            Best {longestStreak}
                        </Text>
                    </View>
                )}
            </View>

            {/* ── Day dots ── */}
            <View style={[styles.daysRow, { paddingHorizontal: spacing.xxs }]}>
                {WEEKDAYS.map((day, i) => {
                    const daysAgo = (today - i + 7) % 7;
                    const isActive = daysAgo < streak && daysAgo >= 0;
                    const isCurrentDay = i === today;

                    return (
                        <View key={i} style={styles.dayColumn}>
                            {/* Dot */}
                            {(isActive || isCurrentDay) ? (
                                <LinearGradient
                                    colors={
                                        isCurrentDay
                                            ? ([brand.accentDark, brand.accentLight] as [string, string])
                                            : (gradients.primary as unknown as [string, string])
                                    }
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 1 }}
                                    style={[styles.dot, { borderRadius: radius.full }]}
                                >
                                    {isActive && (
                                        <Ionicons name="checkmark" size={10} color="#FFF" />
                                    )}
                                </LinearGradient>
                            ) : (
                                <View
                                    style={[
                                        styles.dot,
                                        {
                                            borderRadius: radius.full,
                                            backgroundColor: isDark
                                                ? colors.surfaceTertiary
                                                : colors.backgroundTertiary,
                                        },
                                    ]}
                                />
                            )}

                            {/* Label */}
                            <Text
                                style={[
                                    styles.dayLabel,
                                    {
                                        color: isCurrentDay
                                            ? colors.text
                                            : isActive
                                                ? colors.textSecondary
                                                : colors.textTertiary,
                                        fontWeight: isCurrentDay ? '700' : '400',
                                    },
                                ]}
                            >
                                {day}
                            </Text>
                        </View>
                    );
                })}
            </View>

            {/* ── Progress note ── */}
            <View
                style={[
                    styles.progressRow,
                    {
                        marginTop: spacing.md,
                        paddingVertical: spacing.sm,
                        borderTopWidth: StyleSheet.hairlineWidth,
                        borderTopColor: isDark ? colors.border : colors.separator,
                    },
                ]}
            >
                {isFullWeek ? (
                    <View style={styles.celebrationRow}>
                        <View
                            style={[
                                styles.celebrationBadge,
                                { backgroundColor: brand.accent + '14', borderRadius: radius.full },
                            ]}
                        >
                            <Ionicons name="star" size={12} color={brand.accent} />
                        </View>
                        <Text
                            style={[
                                typography.captionBold,
                                { color: brand.accent },
                            ]}
                        >
                            Perfect week!
                        </Text>
                    </View>
                ) : (
                    <Text
                        style={[
                            typography.caption,
                            { color: colors.textTertiary },
                        ]}
                    >
                        {activeDaysThisWeek}/7 this week
                    </Text>
                )}
            </View>
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    card: {
    },

    /* Header */
    header: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
    },
    streakInfo: {},
    streakCountRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    metaPill: {
        paddingHorizontal: 10,
        paddingVertical: 4,
    },

    /* Day dots */
    daysRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    dayColumn: {
        alignItems: 'center',
        gap: 6,
    },
    dot: {
        width: 28,
        height: 28,
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
    },
    dayLabel: {
        fontSize: 10,
        letterSpacing: 0.3,
    },

    /* Progress row */
    progressRow: {
        alignItems: 'center',
    },
    celebrationRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    celebrationBadge: {
        width: 22,
        height: 22,
        alignItems: 'center',
        justifyContent: 'center',
    },
});
