/**
 * Progress Screen — Premium Learning Dashboard
 *
 * Visual hierarchy: Profile hero → inline stats → streak + weekly
 * goal card → category breakdown → achievements showcase.
 *
 * Design principles:
 * - Rich depth via layered cards with warm shadows
 * - Consistent 4pt grid spacing from the theme
 * - Animated section entrances (staggered FadeInDown)
 * - No emojis — Ionicons throughout
 * - Unlocked achievements glow with their rarity color
 */

import React, { useEffect, useMemo } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, {
    FadeIn,
    FadeInDown,
} from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../src/theme';
import { useAppStore, useChildStore, useLessonStore, useAchievementStore, ACHIEVEMENTS } from '../../src/stores';
import { Card, Avatar, ProgressRing, ScreenHeader, IslamicDivider, MiniStatPill, BismillahHeader } from '../../src/components';
import { LinearGradient } from 'expo-linear-gradient';
import { CategoryBreakdownChart } from '../../src/components/progress';
import { getAge } from '../../src/types';
import { allCurriculumLessons } from '../../src/data/curriculum';
import { sampleLessons } from '../../src/data/lessons';
import type { LessonCategory } from '../../src/types';
import type { AchievementDef, AchievementContext } from '../../src/stores/achievementStore';

// ── Achievement icon mapping (unique per achievement) ──

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
    silver: '#9CA3AF',
    gold: '#D4982A',
    platinum: '#8B5CF6',
};

const RARITY_BG: Record<AchievementDef['rarity'], string> = {
    bronze: '#CD7F3210',
    silver: '#9CA3AF10',
    gold: '#D4982A10',
    platinum: '#8B5CF610',
};

const RARITY_LABELS: Record<AchievementDef['rarity'], string> = {
    bronze: 'Bronze',
    silver: 'Silver',
    gold: 'Gold',
    platinum: 'Platinum',
};

// ── Motivational messages based on real progress ──

function getMotivation(child: { currentStreak: number; totalLessonsCompleted: number; totalXP: number }): string {
    if (child.currentStreak >= 7) return "Incredible dedication this week!";
    if (child.currentStreak >= 3) return "Great consistency, keep it up!";
    if (child.totalLessonsCompleted >= 10) return "A true knowledge seeker.";
    if (child.totalLessonsCompleted >= 5) return "Making wonderful progress.";
    if (child.totalLessonsCompleted >= 1) return "Off to a beautiful start!";
    return "Begin your learning journey today.";
}

export default function ProgressScreen() {
    const { brand, colors, typography, spacing, radius, shadows, isDark } = useTheme();

    const activeChildId = useAppStore((s) => s.activeChildId);
    const child = useChildStore((s) =>
        s.children.find((c) => c.id === activeChildId),
    );
    const completedCount = useLessonStore((s) =>
        activeChildId ? s.getCompletedCount(activeChildId) : 0,
    );

    // Pull raw progress (stable ref) and derive category counts in useMemo
    const progress = useLessonStore((s) => s.progress);
    const lessons = useLessonStore((s) => s.lessons);
    const completedByCategory = useMemo(() => {
        if (!activeChildId) return null;
        const categoryMap = new Map<string, LessonCategory>();
        for (const l of lessons) categoryMap.set(l.id, l.category);
        for (const l of allCurriculumLessons) categoryMap.set(l.id, l.category);

        const counts: Record<LessonCategory, number> = {
            aqeedah: 0, salah: 0, wudu: 0, quran: 0,
            seerah: 0, adab: 0, duaa: 0, stories: 0,
        };
        for (const p of Object.values(progress)) {
            if (p.childId !== activeChildId || !p.isCompleted) continue;
            const cat = categoryMap.get(p.lessonId);
            if (cat) counts[cat]++;
        }
        return counts;
    }, [activeChildId, progress, lessons]);

    const totalPerCategory = useMemo(() => {
        const counts: Record<LessonCategory, number> = {
            aqeedah: 0, salah: 0, wudu: 0, quran: 0,
            seerah: 0, adab: 0, duaa: 0, stories: 0,
        };
        const seen = new Set<string>();
        for (const l of sampleLessons) {
            if (!seen.has(l.id)) { counts[l.category]++; seen.add(l.id); }
        }
        for (const l of allCurriculumLessons) {
            if (!seen.has(l.id)) { counts[l.category]++; seen.add(l.id); }
        }
        return counts;
    }, []);

    // Achievements — evaluate live from child stats
    const checkAchievements = useAchievementStore((s) => s.checkAchievements);

    const achievementCtx = useMemo<AchievementContext | null>(() => {
        if (!child || !activeChildId) return null;
        const completedLessonIds: string[] = [];
        const completedCategoriesSet = new Set<LessonCategory>();
        const categoryMap = new Map<string, LessonCategory>();
        for (const l of lessons) categoryMap.set(l.id, l.category);
        for (const l of allCurriculumLessons) categoryMap.set(l.id, l.category);
        for (const p of Object.values(progress)) {
            if (p.childId !== activeChildId || !p.isCompleted) continue;
            completedLessonIds.push(p.lessonId);
            const cat = categoryMap.get(p.lessonId);
            if (cat) completedCategoriesSet.add(cat);
        }
        return { child, completedLessonIds, completedCategories: completedCategoriesSet, reviewCount: 0 };
    }, [child, activeChildId, progress, lessons]);

    const unlockedSet = useMemo(() => {
        if (!achievementCtx) return new Set<string>();
        const set = new Set<string>();
        for (const ach of ACHIEVEMENTS) {
            try { if (ach.check(achievementCtx)) set.add(ach.id); } catch { }
        }
        return set;
    }, [achievementCtx]);

    const unlockedCount = unlockedSet.size;

    useEffect(() => {
        if (achievementCtx) checkAchievements(achievementCtx);
    }, [achievementCtx, checkAchievements]);

    // Streak calendar — last 7 days
    const streakDays = useMemo(() => {
        const today = new Date();
        const days: { label: string; fullLabel: string; active: boolean; isToday: boolean }[] = [];
        const dayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        const shortLabels = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
        const streak = child?.currentStreak ?? 0;
        for (let i = 6; i >= 0; i--) {
            const d = new Date(today);
            d.setDate(d.getDate() - i);
            days.push({
                label: shortLabels[d.getDay()]!,
                fullLabel: dayLabels[d.getDay()]!,
                active: i < streak,
                isToday: i === 0,
            });
        }
        return days;
    }, [child?.currentStreak]);

    // ── Empty state ──
    if (!child) {
        return (
            <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]}>
                <View style={styles.empty}>
                    <View
                        style={[
                            styles.emptyIcon,
                            { backgroundColor: brand.primaryMuted, borderRadius: radius.full },
                        ]}
                    >
                        <Ionicons name="analytics-outline" size={36} color={brand.primary} />
                    </View>
                    <BismillahHeader size="sm" color={brand.primary + '40'} />
                    <Text style={[typography.title2, { color: colors.text, marginTop: spacing.sm, textAlign: 'center' }]}>
                        No profile selected
                    </Text>
                    <Text style={[typography.body, { color: colors.textSecondary, marginTop: spacing.xs, textAlign: 'center' }]}>
                        Create a child profile to start{'\n'}tracking their learning journey.
                    </Text>
                </View>
            </SafeAreaView>
        );
    }

    const weekProgress = Math.min(completedCount / 5, 1);
    const xpInLevel = child.totalXP % 100;
    const level = Math.floor(child.totalXP / 100) + 1;
    const totalLessons = Object.values(totalPerCategory).reduce((a, b) => a + b, 0);
    const overallProgress = totalLessons > 0 ? child.totalLessonsCompleted / totalLessons : 0;

    return (
        <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]}>
            <ScrollView
                contentContainerStyle={{ paddingBottom: spacing.huge }}
                showsVerticalScrollIndicator={false}
            >
                {/* ── Hero Section ── */}
                <Animated.View entering={FadeIn.duration(500)}>
                    <ScreenHeader
                        title="Progress"
                        subtitle="Track your learning journey"
                        accentColor={brand.secondary}
                    />

                    {/* Profile header with gradient accent */}
                    <View style={{ paddingHorizontal: spacing.md, marginTop: spacing.md }}>
                        <Card variant="elevated" noPadding>
                            {/* Gradient accent strip */}
                            <LinearGradient
                                colors={[brand.primaryDark, brand.primaryLight]}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 0 }}
                                style={{
                                    height: 4,
                                    borderTopLeftRadius: radius.md,
                                    borderTopRightRadius: radius.md,
                                }}
                            />

                            <View style={{ padding: spacing.lg }}>
                                <View style={styles.profileRow}>
                                    <Avatar avatarId={child.avatarId} size={64} showRing ringColor={brand.primary} />
                                    <View style={{ marginLeft: spacing.md, flex: 1 }}>
                                        <Text style={[typography.title2, { color: colors.text }]}>
                                            {child.name}
                                        </Text>
                                        <Text style={[typography.bodySmall, { color: colors.textSecondary, marginTop: 1 }]}>
                                            {getAge(child.birthYear)} years old
                                        </Text>
                                        <Text style={[typography.caption, { color: brand.primary, marginTop: 4, fontStyle: 'italic' }]}>
                                            {getMotivation(child)}
                                        </Text>
                                    </View>
                                </View>

                                {/* Level + XP */}
                                <View style={[styles.levelSection, { marginTop: spacing.lg }]}>
                                    <View style={styles.levelMeta}>
                                        <View
                                            style={[
                                                styles.levelBadge,
                                                {
                                                    backgroundColor: brand.accent + '15',
                                                    borderRadius: radius.full,
                                                    borderWidth: 1,
                                                    borderColor: brand.accent + '30',
                                                },
                                            ]}
                                        >
                                            <Ionicons name="star" size={11} color={brand.accent} />
                                            <Text style={[typography.captionBold, { color: brand.accent, marginLeft: 3 }]}>
                                                Level {level}
                                            </Text>
                                        </View>
                                        <Text style={[typography.caption, { color: colors.textTertiary }]}>
                                            {xpInLevel}/100 XP
                                        </Text>
                                    </View>
                                    <View style={[styles.xpBar, { backgroundColor: colors.surfaceTertiary, borderRadius: radius.full }]}>
                                        <Animated.View
                                            style={[
                                                styles.xpFill,
                                                {
                                                    backgroundColor: brand.accent,
                                                    borderRadius: radius.full,
                                                    width: `${Math.min(xpInLevel / 100, 1) * 100}%` as `${number}%`,
                                                },
                                            ]}
                                        />
                                    </View>
                                </View>
                            </View>
                        </Card>
                    </View>
                </Animated.View>

                {/* ── Mini Stats Row ── */}
                <Animated.View
                    entering={FadeInDown.delay(120).duration(500)}
                    style={{ paddingHorizontal: spacing.md, marginTop: spacing.md }}
                >
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={{ gap: spacing.sm }}
                    >
                        <MiniStatPill icon="flame" value={child.currentStreak} label="Streak" color={brand.coral} />
                        <MiniStatPill icon="trophy" value={child.longestStreak} label="Best" color={brand.accent} />
                        <MiniStatPill icon="book" value={child.totalLessonsCompleted} label="Lessons" color={brand.primary} />
                        <MiniStatPill icon="ribbon" value={unlockedCount} label="Badges" color={brand.lavender} />
                        <MiniStatPill icon="sparkles" value={child.totalXP} label="XP" color={brand.secondary} />
                    </ScrollView>
                </Animated.View>

                {/* ── Streak + Weekly Goal ── */}
                <Animated.View
                    entering={FadeInDown.delay(220).duration(500)}
                    style={{ paddingHorizontal: spacing.md, marginTop: spacing.lg }}
                >
                    <IslamicDivider spacing={4} />
                    <SectionHeader icon="calendar-outline" title="This Week" color={brand.primary} />
                    <Card style={{ marginTop: spacing.sm }}>
                        {/* Day circles */}
                        <View style={styles.streakRow}>
                            {streakDays.map((day, i) => (
                                <View key={i} style={styles.streakDayCol}>
                                    <Text
                                        style={[
                                            typography.caption,
                                            {
                                                color: day.isToday ? brand.primary : colors.textTertiary,
                                                fontWeight: day.isToday ? '700' : '500',
                                                marginBottom: 6,
                                            },
                                        ]}
                                    >
                                        {day.label}
                                    </Text>
                                    <View
                                        style={[
                                            styles.streakDot,
                                            {
                                                backgroundColor: day.active
                                                    ? brand.coral
                                                    : isDark ? colors.surfaceSecondary : colors.surfaceTertiary,
                                                borderRadius: radius.full,
                                                borderWidth: day.isToday && !day.active ? 2 : 0,
                                                borderColor: day.isToday ? brand.primary + '50' : 'transparent',
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

                        <View style={[styles.divider, { backgroundColor: colors.separator, marginVertical: spacing.md }]} />

                        {/* Weekly goal with dynamic messaging */}
                        <View style={styles.weekRow}>
                            <ProgressRing
                                progress={weekProgress}
                                size={56}
                                strokeWidth={5}
                                color={weekProgress >= 1 ? brand.secondary : brand.primary}
                                glow={weekProgress >= 1}
                            >
                                <Text style={[typography.captionBold, { color: weekProgress >= 1 ? brand.secondary : brand.primary }]}>
                                    {completedCount}/5
                                </Text>
                            </ProgressRing>
                            <View style={{ marginLeft: spacing.md, flex: 1 }}>
                                <Text style={[typography.label, { color: colors.text }]}>
                                    Weekly Goal
                                </Text>
                                <Text style={[typography.bodySmall, { color: colors.textSecondary, marginTop: 2 }]}>
                                    {weekProgress >= 1
                                        ? "Masha'Allah! All done this week."
                                        : weekProgress >= 0.6
                                            ? `Almost there — ${5 - completedCount} more to go!`
                                            : `${5 - completedCount} lessons remaining this week.`}
                                </Text>
                                {weekProgress >= 1 && (
                                    <View style={[styles.completedBadge, { backgroundColor: colors.successMuted, borderRadius: radius.full, marginTop: 6 }]}>
                                        <Ionicons name="checkmark-circle" size={12} color={colors.success} />
                                        <Text style={[typography.captionBold, { color: colors.success, marginLeft: 3 }]}>
                                            Complete
                                        </Text>
                                    </View>
                                )}
                            </View>
                        </View>
                    </Card>
                </Animated.View>

                {/* ── Overall Progress ── */}
                <Animated.View
                    entering={FadeInDown.delay(320).duration(500)}
                    style={{ paddingHorizontal: spacing.md, marginTop: spacing.lg }}
                >
                    <IslamicDivider spacing={4} />
                    <SectionHeader icon="analytics-outline" title="Overall Progress" color={brand.secondary} />
                    <Card style={{ marginTop: spacing.sm }}>
                        <View style={styles.overallRow}>
                            <ProgressRing
                                progress={overallProgress}
                                size={72}
                                strokeWidth={6}
                                color={brand.secondary}
                            >
                                <Text style={[typography.label, { color: brand.secondary }]}>
                                    {Math.round(overallProgress * 100)}%
                                </Text>
                            </ProgressRing>
                            <View style={{ marginLeft: spacing.lg, flex: 1 }}>
                                <Text style={[typography.label, { color: colors.text }]}>
                                    {child.totalLessonsCompleted} of {totalLessons} lessons
                                </Text>
                                <Text style={[typography.bodySmall, { color: colors.textSecondary, marginTop: 4 }]}>
                                    {overallProgress >= 1
                                        ? "All lessons completed!"
                                        : overallProgress >= 0.5
                                            ? "More than halfway through!"
                                            : "Keep learning — every lesson counts."}
                                </Text>
                                {/* Milestone dots */}
                                <View style={[styles.milestoneRow, { marginTop: spacing.sm }]}>
                                    {[0.25, 0.5, 0.75, 1].map((m) => (
                                        <View key={m} style={styles.milestoneItem}>
                                            <View
                                                style={[
                                                    styles.milestoneDot,
                                                    {
                                                        backgroundColor: overallProgress >= m ? brand.secondary : colors.surfaceTertiary,
                                                        borderRadius: radius.full,
                                                    },
                                                ]}
                                            >
                                                {overallProgress >= m && (
                                                    <Ionicons name="checkmark" size={8} color="#FFF" />
                                                )}
                                            </View>
                                            <Text style={[typography.caption, { color: colors.textTertiary, marginTop: 2, fontSize: 10 }]}>
                                                {Math.round(m * 100)}%
                                            </Text>
                                        </View>
                                    ))}
                                </View>
                            </View>
                        </View>
                    </Card>
                </Animated.View>

                {/* ── Lessons by Category ── */}
                <Animated.View
                    entering={FadeInDown.delay(420).duration(500)}
                    style={{ paddingHorizontal: spacing.md, marginTop: spacing.lg }}
                >
                    <IslamicDivider spacing={4} />
                    <SectionHeader icon="grid-outline" title="Lessons by Category" color={brand.primary} />
                    <Card style={{ marginTop: spacing.sm }}>
                        <CategoryBreakdownChart
                            data={completedByCategory ?? { aqeedah: 0, salah: 0, wudu: 0, quran: 0, seerah: 0, adab: 0, duaa: 0, stories: 0 }}
                            totalPerCategory={totalPerCategory}
                        />
                    </Card>
                </Animated.View>

                {/* ── Achievements ── */}
                <Animated.View
                    entering={FadeInDown.delay(520).duration(500)}
                    style={{ paddingHorizontal: spacing.md, marginTop: spacing.lg }}
                >
                    <IslamicDivider spacing={4} />
                    <View style={styles.achHeader}>
                        <SectionHeader icon="ribbon-outline" title="Achievements" color={brand.lavender} />
                        <View
                            style={[
                                styles.achCountBadge,
                                {
                                    backgroundColor: brand.lavender + '15',
                                    borderRadius: radius.full,
                                },
                            ]}
                        >
                            <Text style={[typography.captionBold, { color: brand.lavender }]}>
                                {unlockedCount}/{ACHIEVEMENTS.length}
                            </Text>
                        </View>
                    </View>

                    {/* Achievement progress */}
                    <View style={[styles.achProgressContainer, { marginTop: spacing.sm }]}>
                        <View style={[styles.achProgressTrack, { backgroundColor: colors.surfaceTertiary, borderRadius: radius.full }]}>
                            <Animated.View
                                style={[
                                    styles.achProgressFill,
                                    {
                                        backgroundColor: brand.lavender,
                                        borderRadius: radius.full,
                                        width: `${ACHIEVEMENTS.length > 0 ? (unlockedCount / ACHIEVEMENTS.length) * 100 : 0}%` as `${number}%`,
                                    },
                                ]}
                            />
                        </View>
                    </View>

                    {/* Unlocked first, then locked — sorted by rarity */}
                    {(() => {
                        const rarityOrder: AchievementDef['rarity'][] = ['platinum', 'gold', 'silver', 'bronze'];
                        const sorted = [...ACHIEVEMENTS].sort((a, b) => {
                            const aUnlocked = unlockedSet.has(a.id) ? 0 : 1;
                            const bUnlocked = unlockedSet.has(b.id) ? 0 : 1;
                            if (aUnlocked !== bUnlocked) return aUnlocked - bUnlocked;
                            return rarityOrder.indexOf(a.rarity) - rarityOrder.indexOf(b.rarity);
                        });

                        return sorted.map((ach, i) => {
                            const isUnlocked = unlockedSet.has(ach.id);
                            const rarityColor = RARITY_COLORS[ach.rarity];
                            return (
                                <Animated.View
                                    key={ach.id}
                                    entering={FadeInDown.delay(560 + i * 30).duration(350)}
                                >
                                    <View
                                        style={[
                                            styles.achCard,
                                            {
                                                backgroundColor: isUnlocked
                                                    ? RARITY_BG[ach.rarity]
                                                    : isDark ? colors.surfaceSecondary : colors.surface,
                                                borderRadius: radius.lg,
                                                padding: spacing.md,
                                                marginTop: spacing.xs,
                                                borderWidth: isUnlocked ? 1 : StyleSheet.hairlineWidth,
                                                borderColor: isUnlocked
                                                    ? rarityColor + '30'
                                                    : colors.border,
                                                opacity: isUnlocked ? 1 : 0.5,
                                                ...(isUnlocked ? shadows.subtle : {}),
                                            },
                                        ]}
                                    >
                                        {/* Icon circle */}
                                        <View
                                            style={[
                                                styles.achIconCircle,
                                                {
                                                    backgroundColor: isUnlocked
                                                        ? rarityColor + '20'
                                                        : colors.surfaceTertiary,
                                                    borderRadius: radius.full,
                                                    borderWidth: isUnlocked ? 1.5 : 0,
                                                    borderColor: isUnlocked ? rarityColor + '40' : 'transparent',
                                                },
                                            ]}
                                        >
                                            <Ionicons
                                                name={ACHIEVEMENT_ICONS[ach.id] ?? 'ribbon-outline'}
                                                size={18}
                                                color={isUnlocked ? rarityColor : colors.textTertiary}
                                            />
                                        </View>

                                        {/* Content */}
                                        <View style={{ marginLeft: spacing.sm, flex: 1 }}>
                                            <View style={styles.achTitleRow}>
                                                <Text
                                                    style={[
                                                        typography.label,
                                                        { color: isUnlocked ? colors.text : colors.textTertiary, flex: 1 },
                                                    ]}
                                                    numberOfLines={1}
                                                >
                                                    {ach.title}
                                                </Text>
                                                <View
                                                    style={[
                                                        styles.rarityPill,
                                                        {
                                                            backgroundColor: rarityColor + (isUnlocked ? '20' : '10'),
                                                            borderRadius: radius.full,
                                                        },
                                                    ]}
                                                >
                                                    <Text
                                                        style={{
                                                            color: rarityColor,
                                                            fontSize: 9,
                                                            fontWeight: '700',
                                                            textTransform: 'uppercase',
                                                            letterSpacing: 0.6,
                                                            opacity: isUnlocked ? 1 : 0.6,
                                                        }}
                                                    >
                                                        {RARITY_LABELS[ach.rarity]}
                                                    </Text>
                                                </View>
                                            </View>
                                            <Text
                                                style={[
                                                    typography.caption,
                                                    { color: isUnlocked ? colors.textSecondary : colors.textTertiary, marginTop: 2 },
                                                ]}
                                                numberOfLines={2}
                                            >
                                                {ach.description}
                                            </Text>
                                        </View>

                                        {/* Status indicator */}
                                        <View style={{ marginLeft: spacing.xs }}>
                                            {isUnlocked ? (
                                                <View style={[styles.achCheckCircle, { backgroundColor: rarityColor + '20', borderRadius: radius.full }]}>
                                                    <Ionicons name="checkmark" size={14} color={rarityColor} />
                                                </View>
                                            ) : (
                                                <Ionicons name="lock-closed-outline" size={14} color={colors.textTertiary} />
                                            )}
                                        </View>
                                    </View>
                                </Animated.View>
                            );
                        });
                    })()}
                </Animated.View>
            </ScrollView>
        </SafeAreaView>
    );
}

// ── Section Header ──

function SectionHeader({
    icon,
    title,
    color,
    style,
}: {
    icon: keyof typeof Ionicons.glyphMap;
    title: string;
    color: string;
    style?: object;
}) {
    const { typography, colors, spacing } = useTheme();
    return (
        <View style={[styles.sectionHeader, style]}>
            <Ionicons name={icon} size={17} color={color} />
            <Text style={[typography.title3, { color: colors.text, marginLeft: spacing.xs }]}>
                {title}
            </Text>
        </View>
    );
}

const styles = StyleSheet.create({
    safe: { flex: 1 },
    empty: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 40 },
    emptyIcon: { width: 80, height: 80, alignItems: 'center', justifyContent: 'center' },

    // Profile
    profileRow: { flexDirection: 'row', alignItems: 'center' },
    levelSection: {},
    levelMeta: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 },
    levelBadge: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10, paddingVertical: 3 },
    xpBar: { width: '100%', height: 5, overflow: 'hidden' },
    xpFill: { height: '100%' },

    // Section header
    sectionHeader: { flexDirection: 'row', alignItems: 'center' },

    // Streak
    streakRow: { flexDirection: 'row', justifyContent: 'space-around' },
    streakDayCol: { alignItems: 'center' },
    streakDot: { width: 32, height: 32, alignItems: 'center', justifyContent: 'center' },
    divider: { height: StyleSheet.hairlineWidth },
    weekRow: { flexDirection: 'row', alignItems: 'center' },
    completedBadge: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 8, paddingVertical: 3, alignSelf: 'flex-start' },

    // Overall progress
    overallRow: { flexDirection: 'row', alignItems: 'center' },
    milestoneRow: { flexDirection: 'row', justifyContent: 'space-between' },
    milestoneItem: { alignItems: 'center' },
    milestoneDot: { width: 16, height: 16, alignItems: 'center', justifyContent: 'center' },

    // Achievements
    achHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
    achCountBadge: { paddingHorizontal: 10, paddingVertical: 3 },
    achProgressContainer: {},
    achProgressTrack: { height: 4, overflow: 'hidden' },
    achProgressFill: { height: '100%' },
    achCard: { flexDirection: 'row', alignItems: 'center' },
    achIconCircle: { width: 38, height: 38, alignItems: 'center', justifyContent: 'center' },
    achTitleRow: { flexDirection: 'row', alignItems: 'center' },
    rarityPill: { paddingHorizontal: 7, paddingVertical: 2, marginLeft: 6 },
    achCheckCircle: { width: 24, height: 24, alignItems: 'center', justifyContent: 'center' },
});
