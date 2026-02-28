/**
 * Learn Screen -- Curriculum Dashboard
 *
 * Flat header with ProgressRing, category-colored unit cards
 * with left-edge accents, timeline layout, and interactive feedback.
 */

import React, { useMemo, useCallback, useState } from 'react';
import {
    View,
    Text,
    ScrollView,
    StyleSheet,
    RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../src/theme';
import { useAppStore, useLessonStore } from '../../src/stores';
import { MiniStatPill, ProgressRing, ScalePress, ProgressBar } from '../../src/components';
import { allUnits, allCurriculumLessons } from '../../src/data/curriculum';
import { categoryColors } from '../../src/theme/colors';
import { haptics } from '../../src/utils/haptics';
import type { CurriculumUnit, CurriculumLesson } from '../../src/types/curriculum';
import type { LessonCategory } from '../../src/types/models';

const CATEGORY_SUBTITLES: Record<LessonCategory, string> = {
    aqeedah: 'Foundations of belief',
    wudu: 'Purification before prayer',
    salah: 'The five daily prayers',
    quran: 'Recitation and understanding',
    seerah: 'Life of the Prophet',
    adab: 'Islamic manners',
    duaa: 'Supplications and remembrance',
    stories: 'Prophets and companions',
};

const ROADMAP_HINTS = [
    { icon: 'book-outline' as const, label: 'Seerah — Life of the Prophet' },
    { icon: 'heart-outline' as const, label: 'Adab — Manners and Character' },
    { icon: 'moon-outline' as const, label: 'Duaa — Daily Supplications' },
];

export default function LearnScreen() {
    const { brand, colors, typography, spacing, radius, shadows, isDark } = useTheme();
    const router = useRouter();
    const activeChildId = useAppStore((s) => s.activeChildId);
    const progress = useLessonStore((s) => s.progress);

    const lessonMap = useMemo(
        () => new Map(allCurriculumLessons.map((l) => [l.id, l])),
        [],
    );
    const unitLessonsMap = useMemo(() => {
        const map = new Map<string, CurriculumLesson[]>();
        for (const lesson of allCurriculumLessons) {
            const bucket = map.get(lesson.unitId) ?? [];
            bucket.push(lesson);
            map.set(lesson.unitId, bucket);
        }
        return map;
    }, []);

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
                    const lesson = lessonMap.get(lid);
                    if (lesson) xp += lesson.xpReward;
                }
            }
        }
        return { completed, total, xp, pct: total > 0 ? completed / total : 0 };
    }, [activeChildId, progress, lessonMap]);

    const nextLesson = useMemo<{ lesson: CurriculumLesson; unit: CurriculumUnit } | null>(() => {
        for (const unit of allUnits) {
            const unitLessons = unitLessonsMap.get(unit.id) ?? [];
            for (let i = 0; i < unitLessons.length; i++) {
                const lesson = unitLessons[i]!;
                if (!lesson) continue;
                if (getIsCompleted(lesson.id)) continue;
                const prevDone = i === 0 || getIsCompleted(unitLessons[i - 1]?.id ?? '');
                if (prevDone) return { lesson, unit };
            }
        }
        return null;
    }, [activeChildId, progress, unitLessonsMap]);

    const handleLessonPress = (lessonId: string) => {
        haptics.light();
        router.push(`/lesson/${lessonId}`);
    };

    const [refreshing, setRefreshing] = useState(false);
    const onRefresh = useCallback(() => {
        setRefreshing(true);
        setTimeout(() => setRefreshing(false), 600);
    }, []);

    return (
        <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]} edges={['left', 'right']}>
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 100 }}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={brand.primary} />}
            >
                {/* ── Flat header ── */}
                <Animated.View
                    entering={FadeIn.duration(400)}
                    style={[styles.header, { paddingHorizontal: spacing.lg, paddingTop: spacing.xl + 54 }]}
                >
                    <View style={styles.headerLeft}>
                        <Text style={[typography.largeTitle, { color: colors.text }]}>Learn</Text>
                        <Text style={[typography.bodySmall, { color: colors.textTertiary, marginTop: spacing.xxxs }]}>
                            {overallStats.completed} of {overallStats.total} lessons
                        </Text>
                    </View>
                    <View style={styles.headerRing}>
                        <ProgressRing
                            progress={overallStats.pct}
                            size={52}
                            strokeWidth={4}
                            color={brand.secondary}
                        >
                            <Text style={[typography.captionBold, { color: brand.secondary, fontSize: 11 }]}>
                                {overallStats.total > 0 ? Math.round(overallStats.pct * 100) : 0}%
                            </Text>
                        </ProgressRing>
                    </View>
                </Animated.View>

                {/* ── Continue Learning hero card ── */}
                {nextLesson && (
                    <Animated.View entering={FadeInDown.delay(100).duration(400)}>
                        <ScalePress
                            onPress={() => handleLessonPress(nextLesson.lesson.id)}
                            haptic
                            style={[
                                styles.heroCard,
                                {
                                    marginHorizontal: spacing.lg,
                                    marginTop: spacing.lg,
                                    backgroundColor: isDark ? colors.surfaceSecondary : colors.surface,
                                    borderRadius: radius.xl,
                                    overflow: 'hidden',
                                    ...shadows.cardPremium,
                                },
                            ]}
                        >
                            {(() => {
                                const heroColor = categoryColors[nextLesson.unit.category]?.solid ?? brand.primary;
                                const unitProg = getUnitProgress(nextLesson.unit);
                                return (
                                    <>
                                        {/* Left-edge accent bar */}
                                        <View
                                            style={[
                                                styles.leftAccent,
                                                { backgroundColor: heroColor, borderTopLeftRadius: radius.xl, borderBottomLeftRadius: radius.xl },
                                            ]}
                                        />

                                        <View style={{ padding: spacing.lg, paddingLeft: spacing.lg + 4 }}>
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

                                            <Text style={[typography.title2, { color: colors.text, marginTop: spacing.sm }]}>
                                                {nextLesson.lesson.title}
                                            </Text>

                                            <Text
                                                style={[
                                                    typography.body,
                                                    { color: colors.textSecondary, marginTop: spacing.xxs, lineHeight: 22 },
                                                ]}
                                                numberOfLines={3}
                                            >
                                                {nextLesson.lesson.hook.prompt}
                                            </Text>

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
                                                <View
                                                    style={[
                                                        styles.heroCta,
                                                        { backgroundColor: heroColor, borderRadius: radius.lg },
                                                    ]}
                                                >
                                                    <Ionicons name="play" size={16} color="#FFF" />
                                                    <Text style={styles.heroCtaText}>Continue</Text>
                                                </View>
                                            </View>
                                        </View>
                                    </>
                                );
                            })()}
                        </ScalePress>
                    </Animated.View>
                )}

                {/* ── Quick Stats (2x2 grid) ── */}
                <Animated.View entering={FadeInDown.delay(200).duration(400)}>
                    <View style={[styles.statsGrid, { marginHorizontal: spacing.lg, marginTop: spacing.lg, gap: spacing.sm }]}>
                        <View style={styles.statsGridRow}>
                            <View style={styles.statCell}>
                                <MiniStatPill
                                    icon="school-outline"
                                    value={overallStats.completed}
                                    label="Lessons done"
                                    color={brand.primary}
                                    layout="vertical"
                                />
                            </View>
                            <View style={styles.statCell}>
                                <MiniStatPill
                                    icon="library-outline"
                                    value={overallStats.total - overallStats.completed}
                                    label="Remaining"
                                    color={brand.lavender}
                                    layout="vertical"
                                />
                            </View>
                        </View>
                        <View style={styles.statsGridRow}>
                            <View style={styles.statCell}>
                                <MiniStatPill
                                    icon="sparkles-outline"
                                    value={overallStats.xp}
                                    label="XP earned"
                                    color={brand.accent}
                                    layout="vertical"
                                />
                            </View>
                            <View style={styles.statCell}>
                                <MiniStatPill
                                    icon="layers-outline"
                                    value={allUnits.length}
                                    label="Units"
                                    color={brand.secondary}
                                    layout="vertical"
                                />
                            </View>
                        </View>
                    </View>
                </Animated.View>

                {/* ── Unit Cards ── */}
                <View style={{ marginTop: spacing.lg }}>
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
                        const delay = Math.min(300 + ui * 80, 400);

                        return (
                            <Animated.View
                                key={unit.id}
                                entering={FadeInDown.delay(delay).duration(400)}
                                style={{ paddingHorizontal: spacing.lg, marginTop: ui === 0 ? 0 : spacing.md }}
                            >
                                <View
                                    style={[
                                        styles.unitCard,
                                        {
                                            backgroundColor: isDark ? colors.surfaceSecondary : colors.surface,
                                            borderRadius: radius.xl,
                                            ...shadows.card,
                                        },
                                    ]}
                                >
                                    {/* Left-edge accent */}
                                    <View
                                        style={[
                                            styles.leftAccent,
                                            { backgroundColor: unitComplete ? colors.success : catColor, borderTopLeftRadius: radius.xl, borderBottomLeftRadius: radius.xl },
                                        ]}
                                    />

                                    {/* Unit header */}
                                    <View style={[styles.unitHeader, { padding: spacing.md, paddingLeft: spacing.md + 4 }]}>
                                        <View style={styles.unitHeaderLeft}>
                                            <View
                                                style={[
                                                    styles.unitIconWrap,
                                                    {
                                                        backgroundColor: unitComplete
                                                            ? colors.successMuted
                                                            : (isDark ? catColor + '20' : catMuted),
                                                        borderRadius: radius.sm,
                                                    },
                                                ]}
                                            >
                                                {unitComplete ? (
                                                    <Ionicons name="checkmark-circle" size={18} color={colors.success} />
                                                ) : (
                                                    <Ionicons
                                                        name={unit.icon as keyof typeof Ionicons.glyphMap}
                                                        size={16}
                                                        color={catColor}
                                                    />
                                                )}
                                            </View>
                                            <View style={{ marginLeft: spacing.sm, flex: 1 }}>
                                                <Text style={[typography.label, { color: colors.text }]} numberOfLines={1}>
                                                    {unit.title}
                                                </Text>
                                                <Text
                                                    style={[typography.caption, { color: colors.textTertiary, marginTop: 1 }]}
                                                    numberOfLines={1}
                                                >
                                                    {CATEGORY_SUBTITLES[unit.category] ?? unit.description}
                                                </Text>
                                            </View>
                                        </View>

                                        <Text style={[typography.caption, { color: unitComplete ? colors.success : catColor, fontWeight: '600' }]}>
                                            {unitProgress.completed}/{unitProgress.total}
                                        </Text>
                                    </View>

                                    {/* ProgressBar component */}
                                    <View style={{ paddingHorizontal: spacing.md + 4, paddingBottom: spacing.xs }}>
                                        <ProgressBar
                                            progress={pct}
                                            color={unitComplete ? colors.success : catColor}
                                            height={4}
                                        />
                                    </View>

                                    {/* Lesson timeline */}
                                    <View style={{ paddingTop: spacing.xxs, paddingBottom: spacing.sm }}>
                                        {unitLessons.map((lesson, li) => {
                                            const isCompleted = getIsCompleted(lesson.id);
                                            const prevCompleted = li === 0 || getIsCompleted(unitLessons[li - 1]?.id ?? '');
                                            const isLocked = li > 0 && !prevCompleted;
                                            const isNext = !isCompleted && !isLocked;
                                            const isLast = li === unitLessons.length - 1;

                                            return (
                                                <ScalePress
                                                    key={lesson.id}
                                                    onPress={() => handleLessonPress(lesson.id)}
                                                    disabled={isLocked}
                                                    haptic
                                                    pressScale={0.98}
                                                    accessibilityLabel={`${lesson.title}${isCompleted ? ', completed' : isLocked ? ', locked' : ''}`}
                                                    style={[
                                                        styles.lessonRow,
                                                        {
                                                            paddingRight: spacing.md,
                                                            paddingVertical: spacing.xs,
                                                            backgroundColor: isNext
                                                                ? (isDark ? catColor + '06' : catColor + '04')
                                                                : 'transparent',
                                                            opacity: isLocked ? 0.4 : 1,
                                                        },
                                                    ]}
                                                >
                                                    {/* Timeline track */}
                                                    <View style={styles.timelineTrack}>
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

                                                    {/* Content */}
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

                                                        {!isCompleted && (
                                                            <Text
                                                                style={[
                                                                    typography.caption,
                                                                    { color: colors.textTertiary, marginTop: 2, lineHeight: 16 },
                                                                ]}
                                                                numberOfLines={isNext ? 2 : 1}
                                                            >
                                                                {isNext ? lesson.hook.prompt : lesson.description}
                                                            </Text>
                                                        )}

                                                        {!isLocked && !isCompleted && (
                                                            <View style={[styles.metaRow, { marginTop: spacing.xxs }]}>
                                                                <Ionicons name="time-outline" size={10} color={colors.textTertiary} />
                                                                <Text style={[styles.chipText, { color: colors.textTertiary, marginLeft: 3 }]}>
                                                                    {lesson.durationMinutes}m
                                                                </Text>
                                                                <View style={{ width: 8 }} />
                                                                <Ionicons name="sparkles-outline" size={10} color={brand.accent} />
                                                                <Text style={[styles.chipText, { color: brand.accent, marginLeft: 3 }]}>
                                                                    {lesson.xpReward} XP
                                                                </Text>
                                                            </View>
                                                        )}
                                                    </View>
                                                </ScalePress>
                                            );
                                        })}
                                    </View>
                                </View>
                            </Animated.View>
                        );
                    })}
                </View>

                {/* ── Coming Soon (ambient footer) ── */}
                <Animated.View
                    entering={FadeInDown.delay(400).duration(400)}
                    style={[styles.roadmapFooter, { paddingHorizontal: spacing.lg, marginTop: spacing.xxl }]}
                >
                    <View style={styles.roadmapTitleRow}>
                        <Ionicons name="telescope-outline" size={16} color={colors.textTertiary} />
                        <Text style={[typography.label, { color: colors.textTertiary, marginLeft: spacing.xs }]}>
                            Coming Soon
                        </Text>
                    </View>
                    {ROADMAP_HINTS.map((hint, i) => (
                        <View
                            key={hint.label}
                            style={[
                                styles.roadmapRow,
                                {
                                    paddingVertical: spacing.xxs,
                                    borderTopWidth: i > 0 ? StyleSheet.hairlineWidth : 0,
                                    borderTopColor: colors.separator,
                                },
                            ]}
                        >
                            <Ionicons name={hint.icon} size={14} color={colors.textTertiary + '80'} />
                            <Text style={[typography.caption, { color: colors.textTertiary, marginLeft: spacing.xs }]}>
                                {hint.label}
                            </Text>
                        </View>
                    ))}
                    <Text
                        style={[
                            typography.caption,
                            { color: colors.textTertiary, textAlign: 'center', fontStyle: 'italic', marginTop: spacing.xs, opacity: 0.7 },
                        ]}
                    >
                        In sha Allah
                    </Text>
                </Animated.View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safe: { flex: 1 },

    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingBottom: 12,
    },
    headerLeft: { flex: 1, minWidth: 0 },
    headerRing: { marginLeft: 16 },

    // Hero card
    heroCard: { position: 'relative' },
    leftAccent: {
        position: 'absolute',
        left: 0,
        top: 0,
        bottom: 0,
        width: 4,
    },
    heroContext: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
    heroBadge: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 8, paddingVertical: 4 },
    heroBadgeText: { fontSize: 11, fontWeight: '700', marginLeft: 4 },
    heroBottom: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
    heroMeta: { flexDirection: 'row', alignItems: 'center' },
    heroMetaItem: { flexDirection: 'row', alignItems: 'center' },
    heroMetaText: { fontSize: 13, fontWeight: '500', marginLeft: 4 },
    heroCta: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 10 },
    heroCtaText: { color: '#FFF', fontSize: 14, fontWeight: '700', marginLeft: 6 },

    // Stats 2x2 grid
    statsGrid: {},
    statsGridRow: {
        flexDirection: 'row',
        gap: 12,
    },
    statCell: {
        flex: 1,
        minWidth: 0,
    },

    // Unit card
    unitCard: { overflow: 'hidden', position: 'relative' },
    unitHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
    unitHeaderLeft: { flexDirection: 'row', alignItems: 'center', flex: 1, marginRight: 12 },
    unitIconWrap: { width: 32, height: 32, alignItems: 'center', justifyContent: 'center' },

    // Timeline layout
    lessonRow: { flexDirection: 'row', alignItems: 'stretch' },
    timelineTrack: { width: 52, alignItems: 'center', position: 'relative' },
    timelineLineTop: { width: 2, flex: 1, borderRadius: 1 },
    timelineLineBottom: { width: 2, flex: 1, borderRadius: 1 },
    stepCircle: { width: 28, height: 28, borderRadius: 9999, alignItems: 'center', justifyContent: 'center', zIndex: 1 },
    stepNum: { fontSize: 12, fontWeight: '700' },
    lessonContent: { flex: 1 },

    // Meta
    metaRow: { flexDirection: 'row', alignItems: 'center' },
    chipText: { fontSize: 10, fontWeight: '600' },

    // Status
    statusPill: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 8, paddingVertical: 3, gap: 3 },
    statusText: { fontSize: 10, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5 },
    playBtn: { width: 28, height: 28, alignItems: 'center', justifyContent: 'center' },

    // Roadmap footer
    roadmapFooter: { opacity: 0.6 },
    roadmapTitleRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
    roadmapRow: { flexDirection: 'row', alignItems: 'center' },
});
