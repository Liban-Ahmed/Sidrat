/**
 * Progress Screen
 *
 * Dashboard showing streaks, XP, lesson completion,
 * and achievements. Matches iOS ProgressDashboardView.
 */

import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../src/theme';
import { useAppStore, useChildStore, useLessonStore } from '../../src/stores';
import { Card, Avatar, ProgressRing } from '../../src/components';
import { getAge } from '../../src/types';

export default function ProgressScreen() {
    const { brand, colors, typography, spacing, radius } = useTheme();

    const activeChildId = useAppStore((s) => s.activeChildId);
    const child = useChildStore((s) =>
        s.children.find((c) => c.id === activeChildId),
    );
    const completedCount = useLessonStore((s) =>
        activeChildId ? s.getCompletedCount(activeChildId) : 0,
    );

    if (!child) {
        return (
            <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]}>
                <View style={styles.empty}>
                    <Text style={[typography.title2, { color: colors.text }]}>
                        No profile selected
                    </Text>
                    <Text style={[typography.bodySmall, { color: colors.textSecondary, marginTop: 8 }]}>
                        Create a child profile to track progress.
                    </Text>
                </View>
            </SafeAreaView>
        );
    }

    const weekProgress = Math.min(completedCount / 5, 1);

    return (
        <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]}>
            <ScrollView
                contentContainerStyle={{ paddingHorizontal: spacing.md, paddingBottom: spacing.xxl }}
                showsVerticalScrollIndicator={false}
            >
                <Text
                    style={[typography.largeTitle, { color: colors.text, paddingTop: spacing.sm }]}
                >
                    Progress
                </Text>

                {/* Profile Card */}
                <Card style={{ marginTop: spacing.lg, alignItems: 'center', paddingVertical: spacing.xl }}>
                    <Avatar avatarId={child.avatarId} size={72} />
                    <Text style={[typography.title1, { color: colors.text, marginTop: spacing.sm }]}>
                        {child.name}
                    </Text>
                    <Text style={[typography.bodySmall, { color: colors.textSecondary }]}>
                        {getAge(child.birthYear)} years old
                    </Text>

                    {/* XP bar */}
                    <View style={[styles.xpContainer, { marginTop: spacing.lg }]}>
                        <View
                            style={[
                                styles.xpBar,
                                { backgroundColor: colors.surfaceTertiary, borderRadius: radius.full },
                            ]}
                        >
                            <View
                                style={[
                                    styles.xpFill,
                                    {
                                        backgroundColor: brand.accent,
                                        borderRadius: radius.full,
                                        width: `${Math.min((child.totalXP % 100) / 100, 1) * 100}%` as `${number}%`,
                                    },
                                ]}
                            />
                        </View>
                        <Text style={[typography.labelSmall, { color: brand.accent, marginTop: spacing.xxs }]}>
                            {child.totalXP} XP
                        </Text>
                    </View>
                </Card>

                {/* Stats Grid */}
                <View style={[styles.grid, { marginTop: spacing.lg, gap: spacing.sm }]}>
                    <StatTile
                        icon="🔥"
                        value={`${child.currentStreak}`}
                        label="Current Streak"
                        color={brand.accent}
                    />
                    <StatTile
                        icon="🏆"
                        value={`${child.longestStreak}`}
                        label="Best Streak"
                        color={brand.secondary}
                    />
                    <StatTile
                        icon="📚"
                        value={`${child.totalLessonsCompleted}`}
                        label="Lessons Done"
                        color={brand.primary}
                    />
                    <StatTile
                        icon="📅"
                        value={`Week ${child.currentWeekNumber}`}
                        label="Curriculum"
                        color={brand.primaryDark}
                    />
                </View>

                {/* Weekly Progress */}
                <Text
                    style={[
                        typography.title3,
                        { color: colors.text, marginTop: spacing.xl },
                    ]}
                >
                    This Week
                </Text>
                <Card style={{ marginTop: spacing.sm, flexDirection: 'row', alignItems: 'center' }}>
                    <ProgressRing progress={weekProgress} size={64} strokeWidth={5} />
                    <View style={{ marginLeft: spacing.md, flex: 1 }}>
                        <Text style={[typography.label, { color: colors.text }]}>
                            {completedCount} / 5 lessons
                        </Text>
                        <Text style={[typography.caption, { color: colors.textSecondary, marginTop: 2 }]}>
                            {weekProgress >= 1
                                ? 'Great job! Week complete! 🎉'
                                : "Keep going, you're doing amazing!"}
                        </Text>
                    </View>
                </Card>

                {/* Achievements Placeholder */}
                <Text
                    style={[
                        typography.title3,
                        { color: colors.text, marginTop: spacing.xl },
                    ]}
                >
                    Achievements
                </Text>
                <Card
                    style={{
                        marginTop: spacing.sm,
                        alignItems: 'center',
                        paddingVertical: spacing.xl,
                        backgroundColor: colors.surfaceSecondary,
                    }}
                >
                    <Text style={{ fontSize: 40 }}>🏅</Text>
                    <Text style={[typography.label, { color: colors.textSecondary, marginTop: spacing.sm }]}>
                        Complete lessons to earn badges!
                    </Text>
                </Card>
            </ScrollView>
        </SafeAreaView>
    );
}

function StatTile({
    icon,
    value,
    label,
    color: _color,
}: {
    icon: string;
    value: string;
    label: string;
    color: string;
}) {
    const { colors, typography, spacing, radius, shadows } = useTheme();

    return (
        <View
            style={[
                styles.tile,
                {
                    backgroundColor: colors.surfaceSecondary,
                    borderRadius: radius.lg,
                    padding: spacing.md,
                    ...shadows.subtle,
                },
            ]}
        >
            <Text style={{ fontSize: 22 }}>{icon}</Text>
            <Text style={[typography.title2, { color: colors.text, marginTop: spacing.xxs }]}>
                {value}
            </Text>
            <Text style={[typography.caption, { color: colors.textSecondary }]}>{label}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    safe: { flex: 1 },
    empty: { flex: 1, alignItems: 'center', justifyContent: 'center' },
    xpContainer: { width: '100%', paddingHorizontal: 32, alignItems: 'center' },
    xpBar: { width: '100%', height: 8, overflow: 'hidden' },
    xpFill: { height: '100%' },
    grid: { flexDirection: 'row', flexWrap: 'wrap' },
    tile: { width: '48%', alignItems: 'center' },
});
