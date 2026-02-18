/**
 * QuizCard — Multiple choice quiz component.
 * Shows question, options, feedback, and explanation.
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
import type { PracticeQuiz } from '../../types/curriculum';

interface Props {
    block: PracticeQuiz;
    onAnswer: (isCorrect: boolean, pointsEarned: number) => void;
}

export function QuizCard({ block, onAnswer }: Props) {
    const { brand, colors, typography, radius } = useTheme();
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
                // Correct — auto-advance after showing feedback
                const pointsEarned = attempts === 0 ? block.points : Math.max(1, Math.floor(block.points / 2));
                setTimeout(() => onAnswer(true, pointsEarned), 1200);
            }
        },
        [block, showResult, onAnswer, attempts, shakeX],
    );

    return (
        <Animated.View style={[styles.container, shakeStyle]}>
            {/* Question */}
            <Animated.View entering={FadeInDown.delay(100).duration(500)}>
                <Text style={[typography.title3, { color: colors.text, marginBottom: 20 }]}>
                    {block.question}
                </Text>
            </Animated.View>

            {/* Options */}
            <View style={styles.options}>
                {block.options.map((option, i) => {
                    const isSelected = selectedIndex === i;
                    const isCorrectOption = i === block.correctIndex;
                    let bgColor: string = colors.surfaceSecondary;
                    let borderColor: string = colors.separator;
                    let textColor: string = colors.text;
                    let iconName: 'checkmark-circle' | 'close-circle' | 'ellipse-outline' = 'ellipse-outline';
                    let iconColor: string = colors.textTertiary;

                    if (showResult && isSelected) {
                        if (isCorrect) {
                            bgColor = '#E8F5E9';
                            borderColor = colors.success;
                            textColor = colors.success;
                            iconName = 'checkmark-circle';
                            iconColor = colors.success;
                        } else {
                            bgColor = '#FFEBEE';
                            borderColor = colors.error;
                            textColor = colors.error;
                            iconName = 'close-circle';
                            iconColor = colors.error;
                        }
                    } else if (showResult && isCorrectOption && !isCorrect) {
                        // Highlight the correct answer when wrong
                        bgColor = '#E8F5E9';
                        borderColor = colors.success;
                    }

                    return (
                        <Animated.View key={i} entering={FadeInDown.delay(200 + i * 80).duration(400)}>
                            <Pressable
                                onPress={() => handleSelect(i)}
                                disabled={showResult}
                                style={[
                                    styles.optionButton,
                                    {
                                        backgroundColor: bgColor,
                                        borderColor,
                                        borderRadius: radius.md,
                                    },
                                ]}
                            >
                                <Ionicons name={iconName} size={22} color={iconColor} />
                                <Text style={[typography.callout, { color: textColor, flex: 1 }]}>{option}</Text>
                            </Pressable>
                        </Animated.View>
                    );
                })}
            </View>

            {/* Hint */}
            {showHint && block.hint && (
                <Animated.View
                    entering={FadeIn.duration(400)}
                    style={[styles.hintCard, { backgroundColor: brand.accent + '15', borderRadius: radius.md }]}
                >
                    <Ionicons name="bulb-outline" size={18} color={brand.accent} />
                    <Text style={[typography.caption, { color: colors.text, flex: 1 }]}>{block.hint}</Text>
                </Animated.View>
            )}

            {/* Explanation (after correct) */}
            {showResult && isCorrect && block.explanation && (
                <Animated.View
                    entering={FadeIn.delay(400).duration(400)}
                    style={[styles.explanationCard, { backgroundColor: '#E8F5E9', borderRadius: radius.md }]}
                >
                    <Ionicons name="sparkles" size={18} color={colors.success} />
                    <Text style={[typography.caption, { color: colors.text, flex: 1 }]}>
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
        padding: 16,
        gap: 12,
        borderWidth: 1.5,
    },
    hintCard: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        padding: 14,
        marginTop: 16,
    },
    explanationCard: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        padding: 14,
        marginTop: 12,
    },
});
