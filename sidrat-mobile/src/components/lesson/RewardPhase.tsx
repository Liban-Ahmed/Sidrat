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
    withSpring,
    withTiming,
    withDelay,
    withRepeat,
    Easing,
    interpolate,
} from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../theme';
import { haptics } from '../../utils/haptics';
import type { RewardConfig } from '../../types/curriculum';
import { FormattedText } from './FormattedText';

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

    // ── Celebration animations ──
    const trophyScale = useSharedValue(0);
    const shimmer = useSharedValue(0);
    const ring1 = useSharedValue(0);
    const ring2 = useSharedValue(0);
    const ring3 = useSharedValue(0);
    const sparkleAngle = useSharedValue(0);
    const hasCompleted = useRef(false);

    useEffect(() => {
        // Smooth trophy entrance
        trophyScale.value = withDelay(
            200,
            withSpring(1, { damping: 12, stiffness: 80 }),
        );

        // Gentle breathing shimmer
        shimmer.value = withDelay(
            700,
            withRepeat(
                withTiming(1, { duration: 3000, easing: Easing.inOut(Easing.ease) }),
                -1,
                true,
            ),
        );

        // Radiating pulse rings (staggered)
        ring1.value = withDelay(
            500,
            withRepeat(withTiming(1, { duration: 2400, easing: Easing.out(Easing.quad) }), -1),
        );
        ring2.value = withDelay(
            1300,
            withRepeat(withTiming(1, { duration: 2400, easing: Easing.out(Easing.quad) }), -1),
        );
        ring3.value = withDelay(
            2100,
            withRepeat(withTiming(1, { duration: 2400, easing: Easing.out(Easing.quad) }), -1),
        );

        // Slow sparkle rotation
        sparkleAngle.value = withRepeat(
            withTiming(360, { duration: 10000, easing: Easing.linear }),
            -1,
        );

        // Celebration haptic
        haptics.medium();
        if (!hasCompleted.current) {
            hasCompleted.current = true;
            onComplete();
        }
    }, [trophyScale, shimmer, ring1, ring2, ring3, sparkleAngle, onComplete]);

    const trophyStyle = useAnimatedStyle(() => ({
        transform: [{ scale: trophyScale.value }],
    }));

    const shimmerStyle = useAnimatedStyle(() => ({
        opacity: interpolate(shimmer.value, [0, 1], [0.06, 0.2]),
        transform: [{ scale: interpolate(shimmer.value, [0, 1], [1, 1.06]) }],
    }));

    const ring1Style = useAnimatedStyle(() => ({
        transform: [{ scale: interpolate(ring1.value, [0, 1], [0.5, 1.8]) }],
        opacity: interpolate(ring1.value, [0, 0.12, 1], [0, 0.3, 0]),
    }));

    const ring2Style = useAnimatedStyle(() => ({
        transform: [{ scale: interpolate(ring2.value, [0, 1], [0.5, 1.8]) }],
        opacity: interpolate(ring2.value, [0, 0.12, 1], [0, 0.3, 0]),
    }));

    const ring3Style = useAnimatedStyle(() => ({
        transform: [{ scale: interpolate(ring3.value, [0, 1], [0.5, 1.8]) }],
        opacity: interpolate(ring3.value, [0, 0.12, 1], [0, 0.3, 0]),
    }));

    const sparkleStyle = useAnimatedStyle(() => ({
        transform: [{ rotate: `${sparkleAngle.value}deg` }],
    }));

    return (
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
            <View style={styles.container}>
                {/* ── Celebration area ── */}
                <View style={styles.celebrationArea}>
                    {/* Radiating pulse rings */}
                    <Animated.View
                        style={[styles.pulseRing, { borderColor: grade.color }, ring1Style]}
                    />
                    <Animated.View
                        style={[styles.pulseRing, { borderColor: grade.color }, ring2Style]}
                    />
                    <Animated.View
                        style={[styles.pulseRing, { borderColor: grade.color }, ring3Style]}
                    />

                    {/* Rotating sparkle dots */}
                    <Animated.View style={[styles.sparkleContainer, sparkleStyle]}>
                        {[0, 60, 120, 180, 240, 300].map((angle) => {
                            const rad = (angle * Math.PI) / 180;
                            const x = Math.cos(rad) * 72;
                            const y = Math.sin(rad) * 72;
                            return (
                                <View
                                    key={angle}
                                    style={[
                                        styles.sparkleDot,
                                        {
                                            backgroundColor: grade.color,
                                            left: 72 + x,
                                            top: 72 + y,
                                            opacity: angle % 120 === 0 ? 0.7 : 0.3,
                                        },
                                    ]}
                                />
                            );
                        })}
                    </Animated.View>

                    {/* Trophy with entrance */}
                    <Animated.View style={[styles.trophyOuter, trophyStyle]}>
                        {/* Shimmer glow */}
                        <Animated.View
                            style={[
                                styles.trophyShimmer,
                                { backgroundColor: grade.color },
                                shimmerStyle,
                            ]}
                        />
                        {/* Main circle */}
                        <View
                            style={[
                                styles.trophyCircle,
                                { backgroundColor: grade.color + '15' },
                            ]}
                        >
                            <Ionicons
                                name={grade.icon as keyof typeof Ionicons.glyphMap}
                                size={52}
                                color={grade.color}
                            />
                        </View>
                    </Animated.View>
                </View>

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
                    <FormattedText
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
                    </FormattedText>
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
                        <FormattedText style={[typography.body, { color: colors.text, lineHeight: 24 }]}>
                            {reward.funFact}
                        </FormattedText>
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

    /* Celebration area */
    celebrationArea: {
        width: 150,
        height: 150,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 20,
    },
    pulseRing: {
        position: 'absolute',
        width: 150,
        height: 150,
        borderRadius: 75,
        borderWidth: 2,
    },
    sparkleContainer: {
        position: 'absolute',
        width: 150,
        height: 150,
    },
    sparkleDot: {
        position: 'absolute',
        width: 6,
        height: 6,
        borderRadius: 3,
    },
    trophyOuter: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    trophyShimmer: {
        position: 'absolute',
        width: 130,
        height: 130,
        borderRadius: 65,
    },
    trophyCircle: {
        width: 100,
        height: 100,
        borderRadius: 50,
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
