/**
 * Progress Screen
 *
 * Dashboard showing streaks, XP, lesson completion,
 * achievements, and a 7-day streak calendar.
 */

import React, { useMemo, useRef } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../src/theme';
import { useAppStore, useChildStore, useLessonStore, useAchievementStore, ACHIEVEMENTS } from '../../src/stores';
import { Card, Avatar, ProgressRing } from '../../src/components';
import { getAge } from '../../src/types';
import type { AchievementDef } from '../../src/stores/achievementStore';

// ── Rarity colors ──

const RARITY_COLORS: Record<AchievementDef['rarity'], string> = {
    bronze: '#CD7F32',
    silver: '#C0C0C0',
    gold: '#FFD700',
    platinum: '#E5E4E2',
};

const RARITY_BG: Record<AchievementDef['rarity'], string> = {
    bronze: '#CD7F3215',
    silver: '#C0C0C015',
    gold: '#FFD70015',
    platinum: '#E5E4E215',
};

export default function ProgressScreen() {
    const { brand, colors, typography, spacing, radius, shadows } = useTheme();

    const activeChildId = useAppStore((s) => s.activeChildId);
    const child = useChildStore((s) =>
        s.children.find((c) => c.id === activeChildId),
    );
    const completedCount = useLessonStore((s) =>
        activeChildId ? s.getCompletedCount(activeChildId) : 0,
    );

    // Achievements — use stable empty array to avoid new ref each render
    const EMPTY_ACHIEVEMENTS: import('../../src/stores/achievementStore').UnlockedAchievement[] = useRef([]).current;
    const unlockedAchievements = useAchievementStore((s) =>
        activeChildId ? (s.unlocked[activeChildId] ?? EMPTY_ACHIEVEMENTS) : EMPTY_ACHIEVEMENTS,
    );
    const unlockedSet = useMemo(
        () => new Set(unlockedAchievements.map((a) => a.id)),
        [unlockedAchievements],
    );

    // Streak calendar — last 7 days
    const streakDays = useMemo(() => {
        const today = new Date();
        const days: { label: string; active: boolean }[] = [];
        const dayLabels = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
        const streak = child?.currentStreak ?? 0;
        for (let i = 6; i >= 0; i--) {
            const d = new Date(today);
            d.setDate(d.getDate() - i);
            days.push({
                label: dayLabels[d.getDay()]!,
                active: i < streak,
            });
        }
        return days;
    }, [child?.currentStreak]);

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
                    <StatTile icon="🔥" value={`${child.currentStreak}`} label="Current Streak" color={brand.accent} />
                    <StatTile icon="🏆" value={`${child.longestStreak}`} label="Best Streak" color={brand.secondary} />
                    <StatTile icon="📚" value={`${child.totalLessonsCompleted}`} label="Lessons Done" color={brand.primary} />
                    <StatTile icon="🏅" value={`${unlockedAchievements.length}`} label="Achievements" color={brand.primaryDark} />
                </View>

                {/* 7-Day Streak Calendar */}
                <Text style={[typography.title3, { color: colors.text, marginTop: spacing.xl }]}>
                    This Week
                </Text>
                <Card style={{ marginTop: spacing.sm }}>
                    <View style={styles.streakRow}>
                        {streakDays.map((day, i) => (
                            <View key={i} style={styles.streakDayCol}>
                                <Text style={[typography.caption, { color: colors.textTertiary, marginBottom: 4 }]}>
                                    {day.label}
                                </Text>
                                <View
                                    style={[
                                        styles.streakDot,
                                        {
                                            backgroundColor: day.active ? brand.accent : colors.surfaceTertiary,
                                            borderRadius: radius.full,
                                        },
                                    ]}
                                >
                                    {day.active && (
                                        <Ionicons name="checkmark" size={14} color="#FFF" />
                                    )}
                                </View>
                            </View>
                        ))}
                    </View>

                    {/* Weekly lessons progress */}
                    <View style={[styles.weekRow, { marginTop: spacing.md }]}>
                        <ProgressRing progress={weekProgress} size={48} strokeWidth={4} />
                        <View style={{ marginLeft: spacing.md, flex: 1 }}>
                            <Text style={[typography.label, { color: colors.text }]}>
                                {completedCount} / 5 lessons
                            </Text>
                            <Text style={[typography.caption, { color: colors.textSecondary, marginTop: 2 }]}>
                                {weekProgress >= 1
                                    ? 'Masha\'Allah! Week complete! 🎉'
                                    : 'Keep going, you\'re doing amazing!'}
                            </Text>
                        </View>
                    </View>
                </Card>

                {/* Achievements */}
                <Text style={[typography.title3, { color: colors.text, marginTop: spacing.xl }]}>
                    Achievements ({unlockedAchievements.length} / {ACHIEVEMENTS.length})
                </Text>

                {ACHIEVEMENTS.map((ach) => {
                    const isUnlocked = unlockedSet.has(ach.id);
                    return (
                        <View
                            key={ach.id}
                            style={[
                                styles.achCard,
                                {
                                    backgroundColor: isUnlocked
                                        ? RARITY_BG[ach.rarity]
                                        : colors.surfaceSecondary,
                                    borderRadius: radius.lg,
                                    padding: spacing.md,
                                    marginTop: spacing.xs,
                                    borderLeftWidth: 3,
                                    borderLeftColor: isUnlocked
                                        ? RARITY_COLORS[ach.rarity]
                                        : colors.surfaceTertiary,
                                    opacity: isUnlocked ? 1 : 0.5,
                                    ...shadows.subtle,
                                },
                            ]}
                        >
                            <Text style={{ fontSize: 28 }}>{ach.icon}</Text>
                            <View style={{ marginLeft: spacing.sm, flex: 1 }}>
                                <Text style={[typography.label, { color: isUnlocked ? colors.text : colors.textTertiary }]}>
                                    {ach.title}
                                </Text>
                                <Text style={[typography.caption, { color: colors.textSecondary, marginTop: 2 }]}>
                                    {ach.description}
                                </Text>
                            </View>
                            {isUnlocked && (
                                <Ionicons name="checkmark-circle" size={22} color={RARITY_COLORS[ach.rarity]} />
                            )}
                            {!isUnlocked && (
                                <Ionicons name="lock-closed-outline" size={18} color={colors.textTertiary} />
                            )}
                        </View>
                    );
                })}
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
    streakRow: { flexDirection: 'row', justifyContent: 'space-around' },
    streakDayCol: { alignItems: 'center' },
    streakDot: {
        width: 28,
        height: 28,
        alignItems: 'center',
        justifyContent: 'center',
    },
    weekRow: { flexDirection: 'row', alignItems: 'center' },
    achCard: { flexDirection: 'row', alignItems: 'center' },
});
