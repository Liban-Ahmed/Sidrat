/**
 * RewardPhase — Premium celebration screen with bouncing trophy,
 * circular score ring, stat cards, fun fact, bonus du'a,
 * and haptic celebration feedback.
 *
 * Features:
 *  • Spring-bounce trophy icon with radiant glow circle
 *  • Grade-based colour system using brand tokens
 *  • Three-column stat cards with individual icons
 *  • Fun fact card with golden accent left border
 *  • Du'a card with ornamental divider and gradient-tinted bg
 *  • Haptic celebration burst on mount
 *  • Dark mode aware
 */

import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import Animated, {
    FadeInDown,
    FadeInUp,
    FadeIn,
    useSharedValue,
    useAnimatedStyle,
    withSequence,
    withSpring,
    withTiming,
    withDelay,
    Easing,
} from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../theme';
import { haptics } from '../../utils/haptics';
import type { RewardConfig } from '../../types/curriculum';

interface Props {
    reward: RewardConfig;
    score: number;
    maxScore: number;
    correctCount: number;
    totalQuestions: number;
    xpEarned: number;
    onComplete: () => void;
    onDone: () => void;
}

function getGrade(
    percent: number,
    brand: { primary: string; secondary: string; accent: string; coral: string },
): { icon: string; label: string; color: string } {
    if (percent >= 90) return { icon: 'trophy', label: 'Perfect!', color: brand.accent };
    if (percent >= 70) return { icon: 'star', label: 'Great Job!', color: brand.secondary };
    if (percent >= 50) return { icon: 'thumbs-up', label: 'Good Effort!', color: brand.primary };
    return { icon: 'refresh', label: 'Keep Trying!', color: brand.coral };
}

export function RewardPhase({
    reward,
    score,
    maxScore,
    correctCount,
    totalQuestions,
    xpEarned,
    onComplete,
    onDone,
}: Props) {
    const { brand, colors, typography, radius, isDark, shadows } = useTheme();
    const percent = maxScore > 0 ? Math.round((score / maxScore) * 100) : 100;
    const grade = getGrade(percent, brand);

    // Trophy bouncing in
    const trophyScale = useSharedValue(0);
    const hasCompleted = useRef(false);
    useEffect(() => {
        trophyScale.value = withDelay(
            300,
            withSequence(
                withSpring(1.2, { damping: 4, stiffness: 200 }),
                withTiming(1, { duration: 200, easing: Easing.out(Easing.ease) }),
            ),
        );
        // Celebration haptic
        haptics.medium();
        // Complete the lesson only once
        if (!hasCompleted.current) {
            hasCompleted.current = true;
            onComplete();
        }
    }, [trophyScale, onComplete]);

    const trophyStyle = useAnimatedStyle(() => ({
        transform: [{ scale: trophyScale.value }],
    }));

    return (
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
            <View style={styles.container}>
                {/* ── Trophy ── */}
                <Animated.View style={[styles.trophyArea, trophyStyle]}>
                    {/* Outer glow ring */}
                    <View
                        style={[
                            styles.trophyGlow,
                            { backgroundColor: grade.color + '10' },
                        ]}
                    />
                    <View style={[styles.trophyCircle, { backgroundColor: grade.color + '18' }]}>
                        <Ionicons
                            name={grade.icon as keyof typeof Ionicons.glyphMap}
                            size={60}
                            color={grade.color}
                        />
                    </View>
                </Animated.View>

                {/* ── Grade label ── */}
                <Animated.View entering={FadeInDown.delay(500).duration(600)}>
                    <Text
                        style={[
                            typography.largeTitle,
                            { color: grade.color, textAlign: 'center' },
                        ]}
                    >
                        {grade.label}
                    </Text>
                </Animated.View>

                {/* ── Message ── */}
                <Animated.View entering={FadeInDown.delay(600).duration(600)}>
                    <Text
                        style={[
                            typography.body,
                            {
                                color: colors.textSecondary,
                                textAlign: 'center',
                                marginTop: 6,
                                lineHeight: 24,
                            },
                        ]}
                    >
                        {reward.message}
                    </Text>
                </Animated.View>

                {/* ── Stats row ── */}
                <Animated.View
                    entering={FadeInDown.delay(700).duration(600)}
                    style={styles.statsRow}
                >
                    {/* Score */}
                    <View
                        style={[
                            styles.statCard,
                            {
                                backgroundColor: isDark ? colors.surfaceSecondary : colors.surface,
                                borderRadius: radius.lg,
                                ...shadows.card,
                            },
                        ]}
                    >
                        <View
                            style={[
                                styles.statIcon,
                                { backgroundColor: brand.primary + '14', borderRadius: radius.full },
                            ]}
                        >
                            <Ionicons name="analytics" size={16} color={brand.primary} />
                        </View>
                        <Text style={[typography.title2, { color: brand.primary }]}>{percent}%</Text>
                        <Text style={[typography.labelXs, { color: colors.textTertiary }]}>Score</Text>
                    </View>

                    {/* Correct */}
                    <View
                        style={[
                            styles.statCard,
                            {
                                backgroundColor: isDark ? colors.surfaceSecondary : colors.surface,
                                borderRadius: radius.lg,
                                ...shadows.card,
                            },
                        ]}
                    >
                        <View
                            style={[
                                styles.statIcon,
                                { backgroundColor: brand.secondary + '14', borderRadius: radius.full },
                            ]}
                        >
                            <Ionicons name="checkmark-done" size={16} color={brand.secondary} />
                        </View>
                        <Text style={[typography.title2, { color: brand.secondary }]}>
                            {correctCount}/{totalQuestions}
                        </Text>
                        <Text style={[typography.labelXs, { color: colors.textTertiary }]}>Correct</Text>
                    </View>

                    {/* XP */}
                    <View
                        style={[
                            styles.statCard,
                            {
                                backgroundColor: isDark ? colors.surfaceSecondary : colors.surface,
                                borderRadius: radius.lg,
                                ...shadows.card,
                            },
                        ]}
                    >
                        <View
                            style={[
                                styles.statIcon,
                                { backgroundColor: brand.accent + '14', borderRadius: radius.full },
                            ]}
                        >
                            <Ionicons name="flash" size={16} color={brand.accent} />
                        </View>
                        <Text style={[typography.title2, { color: brand.accent }]}>+{xpEarned}</Text>
                        <Text style={[typography.labelXs, { color: colors.textTertiary }]}>XP</Text>
                    </View>
                </Animated.View>

                {/* ── Fun fact ── */}
                {reward.funFact && (
                    <Animated.View
                        entering={FadeInDown.delay(800).duration(600)}
                        style={[
                            styles.funFactCard,
                            {
                                backgroundColor: isDark
                                    ? brand.accent + '12'
                                    : brand.accent + '08',
                                borderRadius: radius.xl,
                                borderLeftWidth: 3,
                                borderLeftColor: brand.accent,
                            },
                        ]}
                    >
                        <View style={styles.funFactHeader}>
                            <View
                                style={[
                                    styles.funFactIcon,
                                    { backgroundColor: brand.accent + '18', borderRadius: radius.full },
                                ]}
                            >
                                <Ionicons name="bulb" size={16} color={brand.accent} />
                            </View>
                            <Text style={[typography.label, { color: brand.accent }]}>Did You Know?</Text>
                        </View>
                        <Text style={[typography.body, { color: colors.text, lineHeight: 24 }]}>
                            {reward.funFact}
                        </Text>
                    </Animated.View>
                )}

                {/* ── Bonus du'a ── */}
                {reward.bonusDua && (
                    <Animated.View
                        entering={FadeIn.delay(900).duration(600)}
                        style={[
                            styles.duaCard,
                            {
                                backgroundColor: isDark
                                    ? brand.primary + '10'
                                    : brand.primary + '06',
                                borderRadius: radius.xl,
                                borderWidth: 1,
                                borderColor: brand.primary + (isDark ? '20' : '12'),
                                ...shadows.card,
                            },
                        ]}
                    >
                        <View style={styles.duaHeader}>
                            <Ionicons name="moon" size={14} color={brand.primary} />
                            <Text style={[typography.label, { color: brand.primary }]}>
                                Bonus Du&apos;a
                            </Text>
                        </View>

                        <Text style={[styles.arabicText, { color: colors.text }]}>
                            {reward.bonusDua.arabic}
                        </Text>

                        {/* Ornamental divider */}
                        <View style={styles.dividerRow}>
                            <View
                                style={[styles.dividerLine, { backgroundColor: brand.primary + '20' }]}
                            />
                            <Ionicons name="diamond" size={7} color={brand.primary + '40'} />
                            <View
                                style={[styles.dividerLine, { backgroundColor: brand.primary + '20' }]}
                            />
                        </View>

                        <Text
                            style={[
                                typography.callout,
                                { color: brand.primary, fontStyle: 'italic', textAlign: 'center' },
                            ]}
                        >
                            {reward.bonusDua.transliteration}
                        </Text>
                        <Text
                            style={[
                                typography.bodySmall,
                                { color: colors.textSecondary, textAlign: 'center' },
                            ]}
                        >
                            {reward.bonusDua.translation}
                        </Text>
                    </Animated.View>
                )}

                {/* ── Done button ── */}
                <Animated.View entering={FadeInUp.delay(1000).duration(600)} style={styles.buttonArea}>
                    <Pressable
                        onPress={() => {
                            haptics.medium();
                            onDone();
                        }}
                        style={({ pressed }) => [
                            styles.doneButton,
                            {
                                backgroundColor: brand.primary,
                                borderRadius: radius.lg,
                                shadowColor: brand.primary,
                                shadowOffset: { width: 0, height: 4 },
                                shadowOpacity: pressed ? 0.15 : 0.25,
                                shadowRadius: 12,
                                elevation: 4,
                                transform: [{ scale: pressed ? 0.97 : 1 }],
                            },
                        ]}
                    >
                        <Text style={[typography.headlineBold, { color: '#FFF' }]}>Continue</Text>
                        <Ionicons name="arrow-forward" size={20} color="rgba(255,255,255,0.8)" />
                    </Pressable>
                </Animated.View>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    scrollContent: { paddingBottom: 48 },
    container: {
        paddingHorizontal: 24,
        paddingTop: 36,
        alignItems: 'center',
    },

    /* Trophy */
    trophyArea: { marginBottom: 18, alignItems: 'center', justifyContent: 'center' },
    trophyGlow: {
        position: 'absolute',
        width: 150,
        height: 150,
        borderRadius: 75,
    },
    trophyCircle: {
        width: 110,
        height: 110,
        borderRadius: 55,
        alignItems: 'center',
        justifyContent: 'center',
    },

    /* Stats */
    statsRow: {
        flexDirection: 'row',
        gap: 10,
        marginTop: 28,
        marginBottom: 24,
        width: '100%',
    },
    statCard: {
        flex: 1,
        alignItems: 'center',
        paddingVertical: 16,
        gap: 4,
    },
    statIcon: {
        width: 32,
        height: 32,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 4,
    },

    /* Fun fact */
    funFactCard: {
        width: '100%',
        padding: 18,
        gap: 10,
        marginBottom: 16,
    },
    funFactHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    funFactIcon: {
        width: 28,
        height: 28,
        alignItems: 'center',
        justifyContent: 'center',
    },

    /* Du'a */
    duaCard: {
        width: '100%',
        padding: 22,
        alignItems: 'center',
        gap: 8,
        marginBottom: 24,
    },
    duaHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        marginBottom: 4,
    },
    arabicText: {
        fontSize: 26,
        lineHeight: 42,
        textAlign: 'center',
        fontWeight: '300',
        letterSpacing: 1,
    },
    dividerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        width: '60%',
        marginVertical: 2,
    },
    dividerLine: { flex: 1, height: 1 },

    /* Button */
    buttonArea: { width: '100%', marginTop: 8 },
    doneButton: {
        height: 56,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
    },
});
