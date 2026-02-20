/**
 * Family Screen
 *
 * Weekly family activities with parent scripts.
 * Data-driven from a rotating activity bank.
 * Tracks completion via the family store.
 */

import React, { useMemo, useCallback } from 'react';
import { View, Text, ScrollView, StyleSheet, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../src/theme';
import { useAppStore, useFamilyStore } from '../../src/stores';
import {
    ACTIVITY_ICONS,
    getWeekOfYear,
    getActivityForWeek,
    getNextActivity,
} from '../../src/stores/familyStore';
import type { FamilyActivity } from '../../src/stores/familyStore';
import { Card, Button, IslamicDivider, BismillahHeader } from '../../src/components';
import { analyticsService } from '../../src/services/analyticsService';
import { ANALYTICS_EVENTS } from '../../src/constants/config';

export default function FamilyScreen() {
    const { brand, colors, typography, spacing, radius, gradients } = useTheme();

    const activeChildId = useAppStore((s) => s.activeChildId);
    const { markComplete, isCompleted } = useFamilyStore();

    // Rotate activities weekly
    const weekNum = getWeekOfYear();
    const activity = useMemo(() => getActivityForWeek(weekNum), [weekNum]);

    const completed = isCompleted(weekNum, activeChildId);

    const handleComplete = useCallback(() => {
        markComplete(weekNum, activeChildId);
        analyticsService.track(ANALYTICS_EVENTS.FAMILY_ACTIVITY_COMPLETED, {
            activityId: activity.id,
            childId: activeChildId ?? 'none',
        });
        Alert.alert(
            'Masha\'Allah! 🎉',
            'Great job completing this week\'s family activity together!',
        );
    }, [activity.id, activeChildId, weekNum, markComplete]);

    const CATEGORY_COLORS: Record<FamilyActivity['category'], string> = {
        quran: brand.primary,
        dua: brand.secondary,
        character: brand.secondaryLight,
        worship: brand.accent,
        knowledge: brand.lavender,
    };

    return (
        <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]} edges={['left', 'right']}>
            <ScrollView
                contentContainerStyle={{ paddingBottom: 100 }}
                showsVerticalScrollIndicator={false}
            >
                {/* ── Gradient Hero Header ──────────────────── */}
                <LinearGradient
                    colors={gradients.familyHero as unknown as [string, string]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={[
                        styles.heroGradient,
                        {
                            paddingHorizontal: spacing.lg,
                            paddingTop: spacing.xl + 54,
                            paddingBottom: spacing.xxl + 12,
                        },
                    ]}
                >
                    {/* Decorative orbs */}
                    <View style={[styles.heroOrb, styles.heroOrbLarge]} />
                    <View style={[styles.heroOrb, styles.heroOrbSmall]} />
                    <View style={[styles.heroOrb, styles.heroOrbMedium]} />

                    <Text style={[typography.largeTitle, { color: '#FFFFFF' }]}>Family</Text>
                    <Text style={[typography.body, { color: 'rgba(255,255,255,0.8)', marginTop: spacing.xxs }]}>
                        Weekly activities to do together
                    </Text>
                </LinearGradient>
                {/* Bottom curve blending into background */}
                <View
                    style={{
                        height: 24,
                        marginTop: -24,
                        backgroundColor: colors.background,
                        borderTopLeftRadius: radius.xl,
                        borderTopRightRadius: radius.xl,
                    }}
                />

                <View style={{ paddingHorizontal: spacing.md }}>

                    {/* This Week's Activity */}
                    <Card variant="premium" style={{ marginTop: spacing.lg }}>
                        <View style={styles.activityHeader}>
                            <View
                                style={[
                                    styles.weekBadge,
                                    { backgroundColor: brand.accent + '20', borderRadius: radius.full },
                                ]}
                            >
                                <Text style={[typography.labelSmall, { color: brand.accent }]}>
                                    Week {weekNum}
                                </Text>
                            </View>
                            <View style={styles.durationBadge}>
                                <Ionicons name="time-outline" size={14} color={colors.textTertiary} />
                                <Text style={[typography.caption, { color: colors.textTertiary, marginLeft: 4 }]}>
                                    {activity.duration} min
                                </Text>
                            </View>
                        </View>

                        <BismillahHeader size="sm" color={CATEGORY_COLORS[activity.category] + '40'} align="left" />

                        <View
                            style={{
                                width: 48,
                                height: 48,
                                borderRadius: 24,
                                backgroundColor: CATEGORY_COLORS[activity.category] + '15',
                                borderWidth: 1.5,
                                borderColor: CATEGORY_COLORS[activity.category] + '25',
                                alignItems: 'center',
                                justifyContent: 'center',
                                marginTop: spacing.sm,
                            }}
                        >
                            <Ionicons
                                name={ACTIVITY_ICONS[activity.id] ?? 'sparkles-outline'}
                                size={24}
                                color={CATEGORY_COLORS[activity.category]}
                            />
                        </View>
                        <Text style={[typography.title1, { color: colors.text, marginTop: spacing.xs }]}>
                            {activity.title}
                        </Text>
                        <View
                            style={[
                                styles.categoryBadge,
                                {
                                    backgroundColor: CATEGORY_COLORS[activity.category] + '15',
                                    borderRadius: radius.sm,
                                    marginTop: spacing.xs,
                                    alignSelf: 'flex-start',
                                },
                            ]}
                        >
                            <Text
                                style={[
                                    typography.caption,
                                    {
                                        color: CATEGORY_COLORS[activity.category],
                                        textTransform: 'capitalize',
                                        fontWeight: '600',
                                    },
                                ]}
                            >
                                {activity.category}
                            </Text>
                        </View>
                        <Text
                            style={[typography.body, { color: colors.textSecondary, marginTop: spacing.sm }]}
                        >
                            {activity.description}
                        </Text>

                        <Button
                            title={completed ? '✓ Completed!' : 'Mark as Done'}
                            variant={completed ? 'secondary' : 'accent'}
                            fullWidth
                            disabled={completed}
                            onPress={handleComplete}
                            style={{ marginTop: spacing.lg }}
                            accessibilityLabel={completed ? 'Activity completed' : 'Mark this family activity as done'}
                            accessibilityRole="button"
                        />
                    </Card>

                    {/* Parent Tips */}
                    <IslamicDivider spacing={12} variant="rich" />
                    <View
                        style={{
                            backgroundColor: brand.secondary + '06',
                            borderRadius: radius.lg,
                            padding: spacing.md,
                            marginTop: spacing.xs,
                        }}
                    >
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: spacing.xs }}>
                            <Ionicons name="leaf" size={18} color={brand.secondary} />
                            <Text style={[typography.title3, { color: colors.text }]}>
                                Parent Tips
                            </Text>
                        </View>
                        {activity.tips.map((tip, i) => (
                            <View key={i} style={[styles.tipRow, { marginTop: spacing.sm }]}>
                                <Ionicons name="leaf" size={16} color={brand.secondary} />
                                <Text
                                    style={[
                                        typography.bodySmall,
                                        { color: colors.textSecondary, flex: 1, marginLeft: spacing.xs },
                                    ]}
                                >
                                    {tip}
                                </Text>
                            </View>
                        ))}
                    </View>

                    {/* Conversation Starters */}
                    <IslamicDivider spacing={12} variant="rich" />
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                        <Ionicons name="chatbubble-ellipses-outline" size={18} color={brand.primary} />
                        <Text style={[typography.title3, { color: colors.text }]}>
                            Conversation Starters
                        </Text>
                    </View>
                    {activity.prompts.map((prompt, i) => (
                        <Card key={i} variant="glass" style={{ marginTop: spacing.sm }}>
                            <Text style={[typography.body, { color: colors.text }]}>
                                &ldquo;{prompt}&rdquo;
                            </Text>
                        </Card>
                    ))}

                    {/* Coming Next */}
                    <IslamicDivider spacing={12} variant="rich" />
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                        <Ionicons name="calendar-outline" size={18} color={brand.lavender} />
                        <Text style={[typography.title3, { color: colors.text }]}>
                            Coming Next Week
                        </Text>
                    </View>
                    {(() => {
                        const next = getNextActivity(weekNum);
                        return (
                            <Card
                                variant="filled"
                                accentColor={CATEGORY_COLORS[next.category]}
                                style={{
                                    marginTop: spacing.sm,
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                }}
                            >
                                <View
                                    style={{
                                        width: 44,
                                        height: 44,
                                        borderRadius: 22,
                                        backgroundColor: CATEGORY_COLORS[next.category] + '15',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                    }}
                                >
                                    <Ionicons
                                        name={ACTIVITY_ICONS[next.id] ?? 'sparkles-outline'}
                                        size={20}
                                        color={CATEGORY_COLORS[next.category]}
                                    />
                                </View>
                                <View style={{ marginLeft: spacing.sm, flex: 1 }}>
                                    <Text style={[typography.label, { color: colors.text }]}>
                                        {next.title}
                                    </Text>
                                    <Text style={[typography.caption, { color: colors.textSecondary }]}>
                                        {next.duration} min · {next.category}
                                    </Text>
                                </View>
                                <Ionicons name="chevron-forward" size={18} color={colors.textTertiary} />
                            </Card>
                        );
                    })()}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safe: { flex: 1 },
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
    activityHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    weekBadge: { paddingHorizontal: 12, paddingVertical: 4 },
    durationBadge: { flexDirection: 'row', alignItems: 'center' },
    tipRow: { flexDirection: 'row', alignItems: 'flex-start' },
    categoryBadge: { paddingHorizontal: 10, paddingVertical: 3 },
});
