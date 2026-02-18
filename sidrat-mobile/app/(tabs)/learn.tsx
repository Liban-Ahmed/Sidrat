/**
 * Learn Screen
 *
 * Displays curriculum organized by units with lesson cards.
 * Shows both the new structured curriculum and legacy lessons.
 * Tapping a curriculum lesson opens the 4-phase lesson player.
 */

import React from 'react';
import {
    View,
    Text,
    ScrollView,
    Pressable,
    StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../src/theme';
import { useAppStore, useLessonStore } from '../../src/stores';
import { Card } from '../../src/components';
import { allUnits, allCurriculumLessons } from '../../src/data/curriculum';
import { categoryColors } from '../../src/theme/colors';
import type { CurriculumUnit } from '../../src/types/curriculum';

export default function LearnScreen() {
    const { brand, colors, typography, spacing, radius } = useTheme();
    const router = useRouter();
    const activeChildId = useAppStore((s) => s.activeChildId);
    const progress = useLessonStore((s) => s.progress);

    // Get completion status for curriculum lessons
    const getIsCompleted = (lessonId: string) => {
        if (!activeChildId) return false;
        const key = `${activeChildId}:${lessonId}`;
        return progress[key]?.isCompleted ?? false;
    };

    const getUnitProgress = (unit: CurriculumUnit) => {
        const completed = unit.lessonIds.filter((id) => getIsCompleted(id)).length;
        return { completed, total: unit.lessonIds.length };
    };

    const handleLessonPress = (lessonId: string) => {
        router.push(`/lesson/${lessonId}`);
    };

    return (
        <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]}>
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: spacing.xxl }}
            >
                {/* Title */}
                <Text
                    style={[
                        typography.largeTitle,
                        { color: colors.text, paddingHorizontal: spacing.md, paddingTop: spacing.sm },
                    ]}
                >
                    Learn
                </Text>
                <Text
                    style={[
                        typography.body,
                        { color: colors.textSecondary, paddingHorizontal: spacing.md, marginTop: 4 },
                    ]}
                >
                    Interactive Islamic lessons for your journey
                </Text>

                {/* Curriculum Units */}
                {allUnits.map((unit, ui) => {
                    const unitProgress = getUnitProgress(unit);
                    const unitLessons = allCurriculumLessons.filter((l) => l.unitId === unit.id);
                    const cat = categoryColors[unit.category];
                    const catColor = cat ? cat.solid : brand.primary;

                    return (
                        <Animated.View
                            key={unit.id}
                            entering={FadeInDown.delay(100 + ui * 100).duration(600)}
                            style={[styles.unitSection, { paddingHorizontal: spacing.md }]}
                        >
                            {/* Unit header */}
                            <View style={styles.unitHeader}>
                                <View
                                    style={[
                                        styles.unitIcon,
                                        {
                                            backgroundColor: catColor + '15',
                                            borderRadius: radius.md,
                                        },
                                    ]}
                                >
                                    <Ionicons
                                        name={unit.icon as keyof typeof Ionicons.glyphMap}
                                        size={22}
                                        color={catColor}
                                    />
                                </View>
                                <View style={styles.unitMeta}>
                                    <Text style={[typography.title3, { color: colors.text }]}>
                                        {unit.title}
                                    </Text>
                                    <Text style={[typography.caption, { color: colors.textSecondary }]}>
                                        {unitProgress.completed}/{unitProgress.total} lessons completed
                                    </Text>
                                </View>
                                {/* Unit progress ring */}
                                <View
                                    style={[
                                        styles.progressBadge,
                                        {
                                            backgroundColor:
                                                unitProgress.completed === unitProgress.total
                                                    ? colors.success + '15'
                                                    : colors.surfaceTertiary,
                                            borderRadius: radius.full,
                                        },
                                    ]}
                                >
                                    <Text
                                        style={[
                                            typography.captionBold,
                                            {
                                                color:
                                                    unitProgress.completed === unitProgress.total
                                                        ? colors.success
                                                        : colors.textTertiary,
                                            },
                                        ]}
                                    >
                                        {unitProgress.total > 0
                                            ? Math.round((unitProgress.completed / unitProgress.total) * 100)
                                            : 0}
                                        %
                                    </Text>
                                </View>
                            </View>

                            {/* Lesson cards */}
                            {unitLessons.map((lesson, li) => {
                                const isCompleted = getIsCompleted(lesson.id);
                                const prevCompleted = li === 0 || getIsCompleted(unitLessons[li - 1]?.id ?? '');
                                const isLocked = li > 0 && !prevCompleted;

                                return (
                                    <Pressable
                                        key={lesson.id}
                                        onPress={() => !isLocked && handleLessonPress(lesson.id)}
                                        disabled={isLocked}
                                        style={{ marginTop: spacing.xs }}
                                        accessibilityRole="button"
                                        accessibilityLabel={`${lesson.title}${isCompleted ? ', completed' : isLocked ? ', locked' : ''}`}
                                        accessibilityState={{ disabled: isLocked }}
                                    >
                                        <Card
                                            style={{
                                                flexDirection: 'row',
                                                alignItems: 'center',
                                                opacity: isLocked ? 0.5 : isCompleted ? 0.75 : 1,
                                            }}
                                        >
                                            {/* Order circle */}
                                            <View
                                                style={[
                                                    styles.orderCircle,
                                                    {
                                                        backgroundColor: isCompleted
                                                            ? colors.success
                                                            : isLocked
                                                                ? colors.surfaceTertiary
                                                                : catColor + '15',
                                                        borderRadius: radius.full,
                                                    },
                                                ]}
                                            >
                                                {isCompleted ? (
                                                    <Ionicons name="checkmark" size={18} color="#FFF" />
                                                ) : isLocked ? (
                                                    <Ionicons name="lock-closed" size={14} color={colors.textTertiary} />
                                                ) : (
                                                    <Text style={[typography.labelLarge, { color: catColor }]}>
                                                        {lesson.order}
                                                    </Text>
                                                )}
                                            </View>

                                            {/* Content */}
                                            <View style={{ flex: 1, marginLeft: spacing.md }}>
                                                <Text style={[typography.label, { color: colors.text }]}>
                                                    {lesson.title}
                                                </Text>
                                                <Text
                                                    style={[
                                                        typography.caption,
                                                        { color: colors.textSecondary, marginTop: 2 },
                                                    ]}
                                                    numberOfLines={1}
                                                >
                                                    {lesson.description}
                                                </Text>
                                                <View style={[styles.metaRow, { marginTop: spacing.xxs }]}>
                                                    <Text style={[typography.caption, { color: colors.textTertiary }]}>
                                                        {lesson.durationMinutes} min
                                                    </Text>
                                                    <Text
                                                        style={[
                                                            typography.caption,
                                                            { color: brand.accent, marginLeft: spacing.sm },
                                                        ]}
                                                    >
                                                        +{lesson.xpReward} XP
                                                    </Text>
                                                    <Text
                                                        style={[
                                                            typography.caption,
                                                            { color: colors.textTertiary, marginLeft: spacing.sm },
                                                        ]}
                                                    >
                                                        {lesson.practice.length} questions
                                                    </Text>
                                                </View>
                                            </View>

                                            {/* Arrow */}
                                            <Ionicons
                                                name={isLocked ? 'lock-closed-outline' : 'chevron-forward'}
                                                size={20}
                                                color={colors.textTertiary}
                                            />
                                        </Card>
                                    </Pressable>
                                );
                            })}
                        </Animated.View>
                    );
                })}
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safe: { flex: 1 },
    unitSection: { marginTop: 24 },
    unitHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
    unitIcon: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
    unitMeta: { flex: 1, marginLeft: 12 },
    progressBadge: { paddingHorizontal: 10, paddingVertical: 4 },
    orderCircle: {
        width: 36,
        height: 36,
        alignItems: 'center',
        justifyContent: 'center',
    },
    metaRow: { flexDirection: 'row', alignItems: 'center' },
});
