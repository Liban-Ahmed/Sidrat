/**
 * QuizCard — Premium multiple-choice quiz with letter labels,
 * haptic feedback, themed success/error feedback, and staggered
 * option entrance animations.
 *
 * Features:
 *  • A/B/C/D circled labels for each option
 *  • Shake animation on wrong answer with error-muted background
 *  • Theme-token success / error colors (no hardcoded hex)
 *  • Hint card after first wrong attempt (golden accent)
 *  • Explanation card on correct with sparkle icon
 *  • Haptic feedback on selection
 *  • Dark mode support
 */

import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import Animated, {
    FadeInDown,
    FadeIn,
    useSharedValue,
    useAnimatedStyle,
    withSequence,
    withTiming,
} from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../theme';
import { haptics } from '../../utils/haptics';
import type { PracticeQuiz } from '../../types/curriculum';

const OPTION_LETTERS = ['A', 'B', 'C', 'D', 'E', 'F'];

interface Props {
    block: PracticeQuiz;
    onAnswer: (isCorrect: boolean, pointsEarned: number) => void;
}

export function QuizCard({ block, onAnswer }: Props) {
    const { brand, colors, typography, radius, isDark, shadows } = useTheme();
    const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
    const [showResult, setShowResult] = useState(false);
    const [showHint, setShowHint] = useState(false);
    const [attempts, setAttempts] = useState(0);

    const isCorrect = selectedIndex === block.correctIndex;

    // Shake animation for wrong answers
    const shakeX = useSharedValue(0);
    const shakeStyle = useAnimatedStyle(() => ({
        transform: [{ translateX: shakeX.value }],
    }));

    const handleSelect = useCallback(
        (index: number) => {
            if (showResult) return;
            haptics.medium();
            setSelectedIndex(index);
            setShowResult(true);

            const correct = index === block.correctIndex;
            if (!correct) {
                setAttempts((a) => a + 1);
                shakeX.value = withSequence(
                    withTiming(-10, { duration: 50 }),
                    withTiming(10, { duration: 50 }),
                    withTiming(-8, { duration: 50 }),
                    withTiming(8, { duration: 50 }),
                    withTiming(0, { duration: 50 }),
                );
                // Show hint after first wrong attempt
                if (attempts === 0 && block.hint) {
                    setShowHint(true);
                }
                // Allow retry after a delay
                setTimeout(() => {
                    setShowResult(false);
                    setSelectedIndex(null);
                }, 1500);
            } else {
                haptics.light();
                const pointsEarned = attempts === 0 ? block.points : Math.max(1, Math.floor(block.points / 2));
                setTimeout(() => onAnswer(true, pointsEarned), 1200);
            }
        },
        [block, showResult, onAnswer, attempts, shakeX],
    );

    return (
        <Animated.View style={[styles.container, shakeStyle]}>
            {/* ── Question ── */}
            <Animated.View entering={FadeInDown.delay(100).duration(500)}>
                <Text style={[typography.title3, { color: colors.text, marginBottom: 22 }]}>
                    {block.question}
                </Text>
            </Animated.View>

            {/* ── Options ── */}
            <View style={styles.options}>
                {block.options.map((option, i) => {
                    const isSelected = selectedIndex === i;
                    const isCorrectOption = i === block.correctIndex;

                    // Default styling
                    let bgColor: string = isDark ? colors.surfaceSecondary : colors.surface;
                    let borderColor: string = isDark ? colors.surfaceTertiary : colors.separator;
                    let textColor: string = colors.text;
                    let letterBg: string = isDark ? colors.surfaceTertiary : colors.backgroundSecondary;
                    let letterColor: string = colors.textSecondary;
                    let iconName: 'checkmark-circle' | 'close-circle' | undefined;
                    let iconColor: string = colors.textTertiary;

                    if (showResult && isSelected) {
                        if (isCorrect) {
                            bgColor = colors.successMuted;
                            borderColor = colors.success;
                            textColor = colors.success;
                            letterBg = colors.success;
                            letterColor = '#FFF';
                            iconName = 'checkmark-circle';
                            iconColor = colors.success;
                        } else {
                            bgColor = colors.errorMuted;
                            borderColor = colors.error;
                            textColor = colors.error;
                            letterBg = colors.error;
                            letterColor = '#FFF';
                            iconName = 'close-circle';
                            iconColor = colors.error;
                        }
                    } else if (showResult && isCorrectOption && !isCorrect) {
                        bgColor = colors.successMuted;
                        borderColor = colors.success;
                        letterBg = colors.success;
                        letterColor = '#FFF';
                    }

                    return (
                        <Animated.View key={i} entering={FadeInDown.delay(200 + i * 80).duration(400)}>
                            <Pressable
                                onPress={() => handleSelect(i)}
                                disabled={showResult}
                                style={({ pressed }) => [
                                    styles.optionButton,
                                    {
                                        backgroundColor: bgColor,
                                        borderColor,
                                        borderRadius: radius.md,
                                        ...shadows.subtle,
                                        transform: [{ scale: pressed ? 0.98 : 1 }],
                                    },
                                ]}
                            >
                                {/* Letter circle */}
                                <View
                                    style={[
                                        styles.letterCircle,
                                        {
                                            backgroundColor: letterBg,
                                            borderRadius: radius.full,
                                        },
                                    ]}
                                >
                                    <Text style={[typography.labelSmall, { color: letterColor, fontWeight: '700' }]}>
                                        {OPTION_LETTERS[i]}
                                    </Text>
                                </View>

                                <Text style={[typography.callout, { color: textColor, flex: 1 }]}>
                                    {option}
                                </Text>

                                {iconName && (
                                    <Ionicons name={iconName} size={22} color={iconColor} />
                                )}
                            </Pressable>
                        </Animated.View>
                    );
                })}
            </View>

            {/* ── Hint ── */}
            {showHint && block.hint && (
                <Animated.View
                    entering={FadeIn.duration(400)}
                    style={[
                        styles.hintCard,
                        {
                            backgroundColor: colors.warningMuted,
                            borderRadius: radius.md,
                            borderLeftWidth: 3,
                            borderLeftColor: brand.accent,
                        },
                    ]}
                >
                    <Ionicons name="bulb-outline" size={18} color={brand.accent} />
                    <Text style={[typography.bodySmall, { color: colors.text, flex: 1 }]}>
                        {block.hint}
                    </Text>
                </Animated.View>
            )}

            {/* ── Explanation (after correct) ── */}
            {showResult && isCorrect && block.explanation && (
                <Animated.View
                    entering={FadeIn.delay(400).duration(400)}
                    style={[
                        styles.explanationCard,
                        {
                            backgroundColor: colors.successMuted,
                            borderRadius: radius.md,
                            borderLeftWidth: 3,
                            borderLeftColor: colors.success,
                        },
                    ]}
                >
                    <Ionicons name="sparkles" size={18} color={colors.success} />
                    <Text style={[typography.bodySmall, { color: colors.text, flex: 1 }]}>
                        {block.explanation}
                    </Text>
                </Animated.View>
            )}
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 24,
        paddingTop: 20,
    },
    options: { gap: 10 },
    optionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 14,
        gap: 12,
        borderWidth: 1.5,
    },
    letterCircle: {
        width: 32,
        height: 32,
        alignItems: 'center',
        justifyContent: 'center',
    },
    hintCard: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: 10,
        padding: 14,
        marginTop: 16,
    },
    explanationCard: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: 10,
        padding: 14,
        marginTop: 12,
    },
});
