/**
 * Learn Screen — Curriculum Dashboard (v3)
 *
 * Premium learning experience with:
 * - "Continue Learning" hero card with lesson hook preview
 * - Mini-stat pills matching the progress page pattern
 * - Unit cards with tinted header wash + category subtitle
 * - Proper timeline layout (dedicated track column, no absolute hacks)
 * - Difficulty badges per lesson
 * - Completed-unit celebration state
 * - "Coming Soon" roadmap footer
 */

import React, { useMemo } from 'react';
import {
    View,
    Text,
    ScrollView,
    Pressable,
    StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import Animated, { FadeIn, FadeInDown, FadeInRight } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme, brand as brandTokens } from '../../src/theme';
import { useAppStore, useLessonStore } from '../../src/stores';
import { ProgressRing, IslamicDivider, MiniStatPill } from '../../src/components';
import { allUnits, allCurriculumLessons } from '../../src/data/curriculum';
import { categoryColors } from '../../src/theme/colors';
import type { CurriculumUnit, CurriculumLesson } from '../../src/types/curriculum';

// ── Constants ──

const CATEGORY_SUBTITLES: Record<string, string> = {
    aqeedah: 'Foundations of belief',
    wudu: 'Purification before prayer',
    salah: 'The five daily prayers',
    quran: 'Recitation and understanding',
    seerah: 'Life of the Prophet',
    adab: 'Islamic manners',
    duaa: 'Supplications and remembrance',
    stories: 'Prophets and companions',
};

const DIFFICULTY_META: Record<string, { label: string; icon: keyof typeof Ionicons.glyphMap; color: string }> = {
    beginner: { label: 'Beginner', icon: 'leaf-outline', color: brandTokens.secondaryLight },
    intermediate: { label: 'Intermediate', icon: 'trending-up-outline', color: brandTokens.accent },
    advanced: { label: 'Advanced', icon: 'diamond-outline', color: brandTokens.coralLight },
};

const ROADMAP_HINTS = [
    { icon: 'book-outline' as const, label: 'Seerah — Life of the Prophet' },
    { icon: 'heart-outline' as const, label: 'Adab — Manners and Character' },
    { icon: 'moon-outline' as const, label: 'Duaa — Daily Supplications' },
];



export default function LearnScreen() {
    const { brand, colors, typography, spacing, radius, shadows, gradients, isDark } = useTheme();
    const router = useRouter();
    const activeChildId = useAppStore((s) => s.activeChildId);
    const progress = useLessonStore((s) => s.progress);

    // ── Derived state ──

    const getIsCompleted = (lessonId: string) => {
        if (!activeChildId) return false;
        return progress[`${activeChildId}:${lessonId}`]?.isCompleted ?? false;
    };

    const getUnitProgress = (unit: CurriculumUnit) => {
        const completed = unit.lessonIds.filter((id) => getIsCompleted(id)).length;
        return { completed, total: unit.lessonIds.length };
    };

    const overallStats = useMemo(() => {
        let completed = 0;
        let total = 0;
        let xp = 0;
        for (const unit of allUnits) {
            for (const lid of unit.lessonIds) {
                total++;
                if (getIsCompleted(lid)) {
                    completed++;
                    const lesson = allCurriculumLessons.find((l) => l.id === lid);
                    if (lesson) xp += lesson.xpReward;
                }
            }
        }
        return { completed, total, xp, pct: total > 0 ? completed / total : 0 };
    }, [activeChildId, progress]);

    // Find the global "next" lesson — first incomplete, unlocked lesson across all units
    const nextLesson = useMemo<{ lesson: CurriculumLesson; unit: CurriculumUnit } | null>(() => {
        for (const unit of allUnits) {
            const unitLessons = allCurriculumLessons.filter((l) => l.unitId === unit.id);
            for (let i = 0; i < unitLessons.length; i++) {
                const lesson = unitLessons[i]!;
                if (!lesson) continue;
                if (getIsCompleted(lesson.id)) continue;
                const prevDone = i === 0 || getIsCompleted(unitLessons[i - 1]?.id ?? '');
                if (prevDone) return { lesson, unit };
            }
        }
        return null;
    }, [activeChildId, progress]);

    const handleLessonPress = (lessonId: string) => {
        router.push(`/lesson/${lessonId}`);
    };

    return (
        <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]} edges={['left', 'right']}>
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 100 }}
            >
                {/* ── Gradient Hero Header ── */}
                <Animated.View entering={FadeIn.duration(400)}>
                    <LinearGradient
                        colors={gradients.learnHero as unknown as [string, string]}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={[
                            styles.heroGradient,
                            {
                                paddingHorizontal: spacing.lg,
                                paddingTop: spacing.xl + 54,
                                paddingBottom: spacing.xxl,
                                borderBottomLeftRadius: radius.xl,
                                borderBottomRightRadius: radius.xl,
                            },
                        ]}
                    >
                        {/* Decorative orbs */}
                        <View style={[styles.heroOrb, styles.heroOrbLarge]} />
                        <View style={[styles.heroOrb, styles.heroOrbSmall]} />
                        <View style={[styles.heroOrb, styles.heroOrbMedium]} />

                        <Text style={[typography.title1, { color: '#FFFFFF' }]}>Learn</Text>
                        <Text style={[typography.body, { color: 'rgba(255,255,255,0.75)', marginTop: spacing.xxs }]}>
                            Your Islamic learning journey
                        </Text>
                    </LinearGradient>
                </Animated.View>

                {/* ── Continue Learning Hero ── */}
                {nextLesson && (
                    <Animated.View entering={FadeInDown.delay(100).duration(500)}>
                        <Pressable
                            onPress={() => handleLessonPress(nextLesson.lesson.id)}
                            style={({ pressed }) => [
                                styles.heroCard,
                                {
                                    marginHorizontal: spacing.lg,
                                    marginTop: -spacing.lg,
                                    backgroundColor: isDark ? colors.surfaceSecondary : colors.surface,
                                    borderRadius: radius.xl,
                                    overflow: 'hidden',
                                    opacity: pressed ? 0.92 : 1,
                                    ...shadows.cardPremium,
                                },
                            ]}
                        >
                            {(() => {
                                const heroColor = categoryColors[nextLesson.unit.category]?.solid ?? brand.primary;
                                const unitProg = getUnitProgress(nextLesson.unit);
                                return (
                                    <>
                                        {/* Gradient accent strip at top */}
                                        <LinearGradient
                                            colors={[heroColor, heroColor + '80']}
                                            start={{ x: 0, y: 0 }}
                                            end={{ x: 1, y: 0 }}
                                            style={{ height: 3 }}
                                        />

                                        <View style={{ padding: spacing.lg }}>
                                            {/* Top: unit context */}
                                            <View style={styles.heroContext}>
                                                <View style={[styles.heroBadge, { backgroundColor: heroColor + '18', borderRadius: radius.xs }]}>
                                                    <Ionicons
                                                        name={nextLesson.unit.icon as keyof typeof Ionicons.glyphMap}
                                                        size={11}
                                                        color={heroColor}
                                                    />
                                                    <Text style={[styles.heroBadgeText, { color: heroColor }]}>
                                                        {nextLesson.unit.title}
                                                    </Text>
                                                </View>
                                                <Text style={[typography.caption, { color: colors.textTertiary }]}>
                                                    Lesson {nextLesson.lesson.order} of {unitProg.total}
                                                </Text>
                                            </View>

                                            {/* Lesson title */}
                                            <Text style={[typography.title2, { color: colors.text, marginTop: spacing.sm }]}>
                                                {nextLesson.lesson.title}
                                            </Text>

                                            {/* Hook prompt (the engaging question) */}
                                            <Text
                                                style={[
                                                    typography.body,
                                                    { color: colors.textSecondary, marginTop: spacing.xxs, lineHeight: 22 },
                                                ]}
                                                numberOfLines={2}
                                            >
                                                {nextLesson.lesson.hook.prompt}
                                            </Text>

                                            {/* Bottom row: meta + CTA */}
                                            <View style={[styles.heroBottom, { marginTop: spacing.md }]}>
                                                <View style={styles.heroMeta}>
                                                    <View style={styles.heroMetaItem}>
                                                        <Ionicons name="time-outline" size={13} color={colors.textTertiary} />
                                                        <Text style={[styles.heroMetaText, { color: colors.textTertiary }]}>
                                                            {nextLesson.lesson.durationMinutes} min
                                                        </Text>
                                                    </View>
                                                    <View style={[styles.heroMetaItem, { marginLeft: spacing.sm }]}>
                                                        <Ionicons name="sparkles-outline" size={13} color={brand.accent} />
                                                        <Text style={[styles.heroMetaText, { color: brand.accent }]}>
                                                            +{nextLesson.lesson.xpReward} XP
                                                        </Text>
                                                    </View>
                                                </View>
                                                <LinearGradient
                                                    colors={gradients.heroCta as unknown as [string, string]}
                                                    start={{ x: 0, y: 0 }}
                                                    end={{ x: 1, y: 0 }}
                                                    style={[styles.heroCta, { borderRadius: radius.lg }]}
                                                >
                                                    <Ionicons name="play" size={16} color="#FFF" />
                                                    <Text style={styles.heroCtaText}>Continue</Text>
                                                </LinearGradient>
                                            </View>
                                        </View>
                                    </>
                                );
                            })()}
                        </Pressable>
                    </Animated.View>
                )}

                {/* ── Quick Stats ── */}
                <Animated.View entering={FadeInDown.delay(200).duration(450)}>
                    <View style={{ marginHorizontal: spacing.lg, marginTop: spacing.lg, borderRadius: radius.xl, overflow: 'hidden' }}>
                        <LinearGradient
                            colors={
                                isDark
                                    ? ['rgba(26,58,92,0.08)', 'rgba(26,58,92,0.04)']
                                    : ['rgba(26,58,92,0.04)', 'rgba(212,152,42,0.03)']
                            }
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                            style={{ borderRadius: radius.xl, padding: spacing.sm }}
                        >
                            <ScrollView
                                horizontal
                                showsHorizontalScrollIndicator={false}
                                contentContainerStyle={{
                                    gap: spacing.xs,
                                }}
                            >
                                <MiniStatPill
                                    icon="school-outline"
                                    value={`${overallStats.completed}`}
                                    label="done"
                                    color={brand.primary}
                                    layout="horizontal"
                                />
                                <MiniStatPill
                                    icon="library-outline"
                                    value={`${overallStats.total - overallStats.completed}`}
                                    label="remaining"
                                    color={brand.lavender}
                                    layout="horizontal"
                                />
                                <MiniStatPill
                                    icon="sparkles-outline"
                                    value={`${overallStats.xp}`}
                                    label="XP earned"
                                    color={brand.accent}
                                    layout="horizontal"
                                />
                                <MiniStatPill
                                    icon="layers-outline"
                                    value={`${allUnits.length}`}
                                    label="units"
                                    color={brand.secondary}
                                    layout="horizontal"
                                />
                            </ScrollView>
                        </LinearGradient>
                    </View>
                </Animated.View>

                {/* ── Section divider ── */}
                <View style={{ paddingHorizontal: spacing.lg }}>
                    <IslamicDivider spacing={12} variant="rich" />
                </View>

                {/* ── Section label ── */}
                <Animated.View entering={FadeIn.delay(300).duration(400)}>
                    <View style={{ paddingHorizontal: spacing.lg, marginBottom: spacing.xs, flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                        <Ionicons name="layers-outline" size={18} color={brand.primary} />
                        <Text style={[typography.title3, { color: colors.text }]}>
                            Units
                        </Text>
                    </View>
                </Animated.View>

                {/* ── Unit Cards ── */}
                {allUnits.map((unit, ui) => {
                    const unitProgress = getUnitProgress(unit);
                    const unitLessons = allCurriculumLessons
                        .filter((l) => l.unitId === unit.id)
                        .sort((a, b) => a.order - b.order);
                    const cat = categoryColors[unit.category];
                    const catColor = cat?.solid ?? brand.primary;
                    const catMuted = cat?.muted ?? brand.primaryMuted;
                    const unitComplete = unitProgress.completed === unitProgress.total;
                    const pct = unitProgress.total > 0
                        ? unitProgress.completed / unitProgress.total
                        : 0;

                    return (
                        <Animated.View
                            key={unit.id}
                            entering={FadeInDown.delay(320 + ui * 90).duration(500)}
                            style={{ paddingHorizontal: spacing.lg, marginTop: spacing.md }}
                        >
                            <View
                                style={[
                                    styles.unitCard,
                                    {
                                        backgroundColor: isDark ? colors.surfaceSecondary : colors.surface,
                                        borderRadius: radius.xl,
                                        borderWidth: StyleSheet.hairlineWidth,
                                        borderColor: isDark ? colors.border : catColor + '15',
                                        ...shadows.cardPremium,
                                        ...shadows.softGlow(catColor),
                                    },
                                ]}
                            >
                                {/* ── Tinted header wash ── */}
                                <View
                                    style={[
                                        styles.unitHeaderWash,
                                        {
                                            backgroundColor: catColor + (isDark ? '0A' : '06'),
                                            borderTopLeftRadius: radius.xl,
                                            borderTopRightRadius: radius.xl,
                                            padding: spacing.md,
                                            paddingBottom: spacing.sm,
                                        },
                                    ]}
                                >
                                    {/* Accent strip at very top — gradient */}
                                    <LinearGradient
                                        colors={[catColor, catColor + '60']}
                                        start={{ x: 0, y: 0 }}
                                        end={{ x: 1, y: 0 }}
                                        style={[
                                            styles.unitAccent,
                                            {
                                                borderTopLeftRadius: radius.xl,
                                                borderTopRightRadius: radius.xl,
                                                position: 'absolute',
                                                top: 0,
                                                left: 0,
                                                right: 0,
                                            },
                                        ]}
                                    />

                                    <View style={styles.unitHeader}>
                                        <View style={styles.unitHeaderLeft}>
                                            <View
                                                style={[
                                                    styles.unitIconWrap,
                                                    {
                                                        backgroundColor: isDark ? catColor + '25' : catMuted,
                                                        borderRadius: radius.md,
                                                        borderWidth: 1,
                                                        borderColor: catColor + '25',
                                                    },
                                                ]}
                                            >
                                                <Ionicons
                                                    name={unit.icon as keyof typeof Ionicons.glyphMap}
                                                    size={20}
                                                    color={catColor}
                                                />
                                            </View>
                                            <View style={{ marginLeft: spacing.sm, flex: 1 }}>
                                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                                    <Text style={[typography.title3, { color: colors.text }]}>
                                                        {unit.title}
                                                    </Text>
                                                    {unitComplete && (
                                                        <View style={[styles.completedBadge, { backgroundColor: colors.successMuted, borderRadius: radius.full, marginLeft: spacing.xs }]}>
                                                            <Ionicons name="checkmark-circle" size={12} color={colors.success} />
                                                            <Text style={[styles.completedBadgeText, { color: colors.success }]}>Completed</Text>
                                                        </View>
                                                    )}
                                                </View>
                                                <Text
                                                    style={[typography.caption, { color: colors.textSecondary, marginTop: 1 }]}
                                                    numberOfLines={1}
                                                >
                                                    {CATEGORY_SUBTITLES[unit.category] ?? unit.description}
                                                </Text>
                                            </View>
                                        </View>

                                        <ProgressRing
                                            progress={pct}
                                            size={44}
                                            strokeWidth={3.5}
                                            color={unitComplete ? colors.success : catColor}
                                            glow={unitComplete}
                                        >
                                            {unitComplete ? (
                                                <Ionicons name="checkmark" size={16} color={colors.success} />
                                            ) : (
                                                <Text style={{ color: catColor, fontWeight: '700', fontSize: 11 }}>
                                                    {unitProgress.completed}/{unitProgress.total}
                                                </Text>
                                            )}
                                        </ProgressRing>
                                    </View>

                                    {/* Thin progress bar */}
                                    <View style={[styles.unitProgressTrack, { backgroundColor: catColor + '15', borderRadius: radius.full, marginTop: spacing.sm }]}>
                                        <View
                                            style={[
                                                styles.unitProgressFill,
                                                {
                                                    backgroundColor: unitComplete ? colors.success : catColor,
                                                    borderRadius: radius.full,
                                                    width: `${pct * 100}%` as `${number}%`,
                                                },
                                            ]}
                                        />
                                    </View>
                                </View>

                                {/* ── Lesson timeline ── */}
                                <View style={{ paddingTop: spacing.xs, paddingBottom: spacing.sm }}>
                                    {unitLessons.map((lesson, li) => {
                                        const isCompleted = getIsCompleted(lesson.id);
                                        const prevCompleted = li === 0 || getIsCompleted(unitLessons[li - 1]?.id ?? '');
                                        const isLocked = li > 0 && !prevCompleted;
                                        const isNext = !isCompleted && !isLocked;
                                        const isLast = li === unitLessons.length - 1;
                                        const diff = DIFFICULTY_META[lesson.difficulty];

                                        return (
                                            <Pressable
                                                key={lesson.id}
                                                onPress={() => !isLocked && handleLessonPress(lesson.id)}
                                                disabled={isLocked}
                                                accessibilityRole="button"
                                                accessibilityLabel={`${lesson.title}${isCompleted ? ', completed' : isLocked ? ', locked' : ''}`}
                                                accessibilityState={{ disabled: isLocked }}
                                                style={({ pressed }) => [
                                                    styles.lessonRow,
                                                    {
                                                        paddingRight: spacing.md,
                                                        paddingVertical: spacing.xs,
                                                        backgroundColor: pressed && !isLocked
                                                            ? catColor + '08'
                                                            : isNext
                                                                ? (isDark ? catColor + '06' : catColor + '04')
                                                                : 'transparent',
                                                        opacity: isLocked ? 0.4 : 1,
                                                    },
                                                ]}
                                            >
                                                {/* ── Timeline track (left column) ── */}
                                                <View style={styles.timelineTrack}>
                                                    {/* Top connector */}
                                                    {li > 0 && (
                                                        <View
                                                            style={[
                                                                styles.timelineLineTop,
                                                                {
                                                                    backgroundColor: getIsCompleted(unitLessons[li - 1]?.id ?? '')
                                                                        ? colors.success + '50'
                                                                        : colors.surfaceTertiary,
                                                                },
                                                            ]}
                                                        />
                                                    )}

                                                    {/* Step circle */}
                                                    <View
                                                        style={[
                                                            styles.stepCircle,
                                                            {
                                                                backgroundColor: isCompleted
                                                                    ? colors.success
                                                                    : isNext
                                                                        ? catColor
                                                                        : isDark ? colors.surfaceTertiary : colors.surfaceTertiary,
                                                                borderWidth: isNext ? 2.5 : 0,
                                                                borderColor: isNext ? catColor + '35' : 'transparent',
                                                            },
                                                        ]}
                                                    >
                                                        {isCompleted ? (
                                                            <Ionicons name="checkmark" size={14} color="#FFF" />
                                                        ) : isLocked ? (
                                                            <Ionicons name="lock-closed" size={11} color={colors.textTertiary} />
                                                        ) : (
                                                            <Text style={[styles.stepNum, { color: isNext ? '#FFF' : colors.textTertiary }]}>
                                                                {lesson.order}
                                                            </Text>
                                                        )}
                                                    </View>

                                                    {/* Bottom connector */}
                                                    {!isLast && (
                                                        <View
                                                            style={[
                                                                styles.timelineLineBottom,
                                                                {
                                                                    backgroundColor: isCompleted
                                                                        ? colors.success + '50'
                                                                        : colors.surfaceTertiary,
                                                                },
                                                            ]}
                                                        />
                                                    )}
                                                </View>

                                                {/* ── Content ── */}
                                                <View style={[styles.lessonContent, { paddingVertical: spacing.xs }]}>
                                                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                                        <Text
                                                            style={[
                                                                typography.label,
                                                                {
                                                                    color: isLocked
                                                                        ? colors.textTertiary
                                                                        : isCompleted
                                                                            ? colors.textSecondary
                                                                            : colors.text,
                                                                    flex: 1,
                                                                },
                                                            ]}
                                                            numberOfLines={1}
                                                        >
                                                            {lesson.title}
                                                        </Text>

                                                        {/* Action */}
                                                        {isCompleted ? (
                                                            <View style={[styles.statusPill, { backgroundColor: colors.successMuted, borderRadius: radius.full }]}>
                                                                <Ionicons name="checkmark" size={10} color={colors.success} />
                                                                <Text style={[styles.statusText, { color: colors.success }]}>Done</Text>
                                                            </View>
                                                        ) : isNext ? (
                                                            <View style={[styles.playBtn, { backgroundColor: catColor, borderRadius: radius.full }]}>
                                                                <Ionicons name="play" size={12} color="#FFF" />
                                                            </View>
                                                        ) : !isLocked ? (
                                                            <Ionicons name="chevron-forward" size={16} color={colors.textTertiary} />
                                                        ) : null}
                                                    </View>

                                                    {/* Description — show hook for next lesson, description otherwise */}
                                                    <Text
                                                        style={[
                                                            typography.caption,
                                                            { color: colors.textTertiary, marginTop: 2, lineHeight: 16 },
                                                        ]}
                                                        numberOfLines={isNext ? 2 : 1}
                                                    >
                                                        {isNext ? lesson.hook.prompt : lesson.description}
                                                    </Text>

                                                    {/* Meta row: difficulty + duration + XP */}
                                                    <View style={[styles.metaRow, { marginTop: spacing.xxs }]}>
                                                        {diff && (
                                                            <View style={[styles.chip, { backgroundColor: diff.color + '10', borderRadius: radius.xs }]}>
                                                                <Ionicons name={diff.icon} size={9} color={diff.color} />
                                                                <Text style={[styles.chipText, { color: diff.color }]}>
                                                                    {diff.label}
                                                                </Text>
                                                            </View>
                                                        )}
                                                        <View style={[styles.chip, { backgroundColor: colors.surfaceTertiary, borderRadius: radius.xs, marginLeft: 4 }]}>
                                                            <Ionicons name="time-outline" size={9} color={colors.textTertiary} />
                                                            <Text style={[styles.chipText, { color: colors.textTertiary }]}>
                                                                {lesson.durationMinutes}m
                                                            </Text>
                                                        </View>
                                                        <View style={[styles.chip, { backgroundColor: brand.accent + '10', borderRadius: radius.xs, marginLeft: 4 }]}>
                                                            <Ionicons name="sparkles-outline" size={9} color={brand.accent} />
                                                            <Text style={[styles.chipText, { color: brand.accent }]}>
                                                                {lesson.xpReward} XP
                                                            </Text>
                                                        </View>
                                                        <View style={[styles.chip, { backgroundColor: brand.primary + '10', borderRadius: radius.xs, marginLeft: 4 }]}>
                                                            <Ionicons name="help-circle-outline" size={9} color={brand.primary} />
                                                            <Text style={[styles.chipText, { color: brand.primary }]}>
                                                                {lesson.practice.length}Q
                                                            </Text>
                                                        </View>
                                                    </View>
                                                </View>
                                            </Pressable>
                                        );
                                    })}
                                </View>
                            </View>
                        </Animated.View>
                    );
                })}

                {/* ── Coming Soon Roadmap ── */}
                <Animated.View
                    entering={FadeInDown.delay(320 + allUnits.length * 90 + 80).duration(500)}
                    style={{
                        paddingHorizontal: spacing.lg,
                        marginTop: spacing.xxl,
                    }}
                >
                    <View
                        style={[
                            styles.roadmapCard,
                            {
                                backgroundColor: isDark ? colors.surfaceSecondary : colors.surface,
                                borderRadius: radius.xl,
                                overflow: 'hidden',
                                ...shadows.cardPremium,
                            },
                        ]}
                    >
                        {/* Premium gradient accent strip */}
                        <LinearGradient
                            colors={gradients.primary as unknown as [string, string]}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                            style={{ height: 3 }}
                        />
                        <View style={{ padding: spacing.lg }}>
                            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: spacing.sm }}>
                                <Ionicons name="telescope-outline" size={18} color={brand.lavender} />
                                <Text style={[typography.label, { color: colors.text, marginLeft: spacing.xs }]}>
                                    Coming Soon
                                </Text>
                            </View>
                            {ROADMAP_HINTS.map((hint, i) => (
                                <Animated.View
                                    key={hint.label}
                                    entering={FadeInRight.delay(400 + allUnits.length * 90 + i * 60).duration(400)}
                                    style={[
                                        styles.roadmapRow,
                                        {
                                            paddingVertical: spacing.xs,
                                            borderTopWidth: i > 0 ? StyleSheet.hairlineWidth : 0,
                                            borderTopColor: colors.separator,
                                        },
                                    ]}
                                >
                                    <Ionicons name={hint.icon} size={16} color={colors.textTertiary} />
                                    <Text style={[typography.bodySmall, { color: colors.textSecondary, marginLeft: spacing.xs }]}>
                                        {hint.label}
                                    </Text>
                                </Animated.View>
                            ))}
                            <IslamicDivider spacing={8} variant="rich" color={brand.lavender + '30'} />
                            <Text style={[typography.caption, { color: colors.textTertiary, textAlign: 'center', fontStyle: 'italic' }]}>
                                In sha Allah
                            </Text>
                        </View>
                    </View>
                </Animated.View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safe: { flex: 1 },

    /* Gradient hero header */
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

    // Hero card
    heroCard: {},
    heroContext: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
    heroBadge: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 8, paddingVertical: 4 },
    heroBadgeText: { fontSize: 11, fontWeight: '700', marginLeft: 4 },
    heroBottom: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
    heroMeta: { flexDirection: 'row', alignItems: 'center' },
    heroMetaItem: { flexDirection: 'row', alignItems: 'center' },
    heroMetaText: { fontSize: 13, fontWeight: '500', marginLeft: 4 },
    heroCta: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 10 },
    heroCtaText: { color: '#FFF', fontSize: 14, fontWeight: '700', marginLeft: 6 },

    // Unit card
    unitCard: { overflow: 'hidden' },
    unitHeaderWash: {},
    unitAccent: { height: 3 },
    unitHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
    unitHeaderLeft: { flexDirection: 'row', alignItems: 'center', flex: 1, marginRight: 12 },
    unitIconWrap: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
    unitProgressTrack: { height: 3, overflow: 'hidden' },
    unitProgressFill: { height: '100%' },
    completedBadge: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 6, paddingVertical: 2 },
    completedBadgeText: { fontSize: 10, fontWeight: '700', marginLeft: 3 },

    // Timeline layout
    lessonRow: { flexDirection: 'row', alignItems: 'stretch' },
    timelineTrack: { width: 52, alignItems: 'center', position: 'relative' },
    timelineLineTop: { width: 2, flex: 1, borderRadius: 1 },
    timelineLineBottom: { width: 2, flex: 1, borderRadius: 1 },
    stepCircle: { width: 28, height: 28, borderRadius: 9999, alignItems: 'center', justifyContent: 'center', zIndex: 1 },
    stepNum: { fontSize: 12, fontWeight: '700' },
    lessonContent: { flex: 1 },

    // Meta
    metaRow: { flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap' },
    chip: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 5, paddingVertical: 2 },
    chipText: { fontSize: 10, fontWeight: '600', marginLeft: 2 },

    // Status
    statusPill: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 8, paddingVertical: 3, gap: 3 },
    statusText: { fontSize: 10, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5 },
    playBtn: { width: 28, height: 28, alignItems: 'center', justifyContent: 'center' },

    // Roadmap
    roadmapCard: {},
    roadmapRow: { flexDirection: 'row', alignItems: 'center' },
});
