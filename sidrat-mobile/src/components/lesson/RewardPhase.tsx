/**
 * RewardPhase — Celebration screen shown after completing a lesson.
 * Shows score, fun fact, bonus du'a, and confetti animation.
 */

import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import Animated, {
    FadeInDown,
    FadeInUp,
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

function getGrade(percent: number): { icon: string; label: string; color: string } {
    if (percent >= 90) return { icon: 'trophy', label: 'Perfect!', color: '#FFD700' };
    if (percent >= 70) return { icon: 'star', label: 'Great Job!', color: '#5AA85B' };
    if (percent >= 50) return { icon: 'thumbs-up', label: 'Good Effort!', color: '#0E8FA6' };
    return { icon: 'refresh', label: 'Keep Trying!', color: '#E8636F' };
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
    const { brand, colors, typography, radius } = useTheme();
    const percent = maxScore > 0 ? Math.round((score / maxScore) * 100) : 100;
    const grade = getGrade(percent);

    // Trophy bouncing in
    const trophyScale = useSharedValue(0);
    useEffect(() => {
        trophyScale.value = withDelay(
            300,
            withSequence(
                withSpring(1.2, { damping: 4, stiffness: 200 }),
                withTiming(1, { duration: 200, easing: Easing.out(Easing.ease) }),
            ),
        );
        // Complete the lesson on mount
        onComplete();
    }, [trophyScale, onComplete]);

    const trophyStyle = useAnimatedStyle(() => ({
        transform: [{ scale: trophyScale.value }],
    }));

    return (
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
            <View style={styles.container}>
                {/* Trophy / Icon  */}
                <Animated.View style={[styles.trophyArea, trophyStyle]}>
                    <View style={[styles.trophyCircle, { backgroundColor: grade.color + '20' }]}>
                        <Ionicons name={grade.icon as keyof typeof Ionicons.glyphMap} size={64} color={grade.color} />
                    </View>
                </Animated.View>

                {/* Grade label */}
                <Animated.View entering={FadeInDown.delay(500).duration(600)}>
                    <Text style={[typography.largeTitle, { color: colors.text, textAlign: 'center' }]}>
                        {grade.label}
                    </Text>
                </Animated.View>

                {/* Message */}
                <Animated.View entering={FadeInDown.delay(600).duration(600)}>
                    <Text
                        style={[
                            typography.body,
                            { color: colors.textSecondary, textAlign: 'center', marginTop: 8 },
                        ]}
                    >
                        {reward.message}
                    </Text>
                </Animated.View>

                {/* Stats row */}
                <Animated.View
                    entering={FadeInDown.delay(700).duration(600)}
                    style={[styles.statsRow, { borderRadius: radius.lg }]}
                >
                    <View style={styles.stat}>
                        <Text style={[typography.title2, { color: brand.primary }]}>{percent}%</Text>
                        <Text style={[typography.caption, { color: colors.textTertiary }]}>Score</Text>
                    </View>
                    <View style={[styles.statDivider, { backgroundColor: colors.separator }]} />
                    <View style={styles.stat}>
                        <Text style={[typography.title2, { color: brand.secondary }]}>
                            {correctCount}/{totalQuestions}
                        </Text>
                        <Text style={[typography.caption, { color: colors.textTertiary }]}>Correct</Text>
                    </View>
                    <View style={[styles.statDivider, { backgroundColor: colors.separator }]} />
                    <View style={styles.stat}>
                        <Text style={[typography.title2, { color: brand.accent }]}>+{xpEarned}</Text>
                        <Text style={[typography.caption, { color: colors.textTertiary }]}>XP</Text>
                    </View>
                </Animated.View>

                {/* Fun fact */}
                {reward.funFact && (
                    <Animated.View
                        entering={FadeInDown.delay(800).duration(600)}
                        style={[
                            styles.funFactCard,
                            {
                                backgroundColor: brand.accent + '12',
                                borderRadius: radius.lg,
                            },
                        ]}
                    >
                        <View style={styles.funFactHeader}>
                            <Ionicons name="bulb" size={18} color={brand.accent} />
                            <Text style={[typography.captionBold, { color: brand.accent }]}>Did You Know?</Text>
                        </View>
                        <Text style={[typography.body, { color: colors.text, lineHeight: 24 }]}>
                            {reward.funFact}
                        </Text>
                    </Animated.View>
                )}

                {/* Bonus du'a */}
                {reward.bonusDua && (
                    <Animated.View
                        entering={FadeInDown.delay(900).duration(600)}
                        style={[
                            styles.duaCard,
                            {
                                backgroundColor: brand.primary + '08',
                                borderRadius: radius.lg,
                                borderColor: brand.primary + '20',
                            },
                        ]}
                    >
                        <Text style={[typography.captionBold, { color: brand.primary, marginBottom: 8 }]}>
                            Bonus Du&apos;a
                        </Text>
                        <Text style={[styles.arabicText, { color: colors.text }]}>
                            {reward.bonusDua.arabic}
                        </Text>
                        <Text style={[typography.callout, { color: brand.primary, fontStyle: 'italic' }]}>
                            {reward.bonusDua.transliteration}
                        </Text>
                        <Text style={[typography.caption, { color: colors.textSecondary }]}>
                            {reward.bonusDua.translation}
                        </Text>
                    </Animated.View>
                )}

                {/* Done button */}
                <Animated.View entering={FadeInUp.delay(1000).duration(600)} style={styles.buttonArea}>
                    <Pressable
                        onPress={onDone}
                        style={[styles.doneButton, { backgroundColor: brand.primary, borderRadius: radius.lg }]}
                    >
                        <Text style={[typography.headlineBold, { color: '#FFF' }]}>Continue</Text>
                    </Pressable>
                </Animated.View>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    scrollContent: { paddingBottom: 40 },
    container: {
        paddingHorizontal: 24,
        paddingTop: 40,
        alignItems: 'center',
    },
    trophyArea: { marginBottom: 20 },
    trophyCircle: {
        width: 120,
        height: 120,
        borderRadius: 60,
        alignItems: 'center',
        justifyContent: 'center',
    },
    statsRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 28,
        marginBottom: 24,
        width: '100%',
        justifyContent: 'space-evenly',
    },
    stat: { alignItems: 'center', gap: 2 },
    statDivider: { width: 1, height: 36 },
    funFactCard: {
        width: '100%',
        padding: 18,
        gap: 8,
        marginBottom: 16,
    },
    funFactHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    duaCard: {
        width: '100%',
        padding: 20,
        alignItems: 'center',
        gap: 6,
        borderWidth: 1,
        marginBottom: 24,
    },
    arabicText: {
        fontSize: 24,
        lineHeight: 40,
        textAlign: 'center',
        fontWeight: '300',
    },
    buttonArea: { width: '100%', marginTop: 8 },
    doneButton: {
        height: 56,
        alignItems: 'center',
        justifyContent: 'center',
    },
});
