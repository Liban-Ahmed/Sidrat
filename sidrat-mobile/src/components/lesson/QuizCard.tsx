/**
 * QuizCard -- Multiple-choice quiz with letter labels and themed feedback.
 */

import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import Animated, {
    FadeInDown,
    useSharedValue,
    useAnimatedStyle,
    withSequence,
    withTiming,
} from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../theme';
import { haptics } from '../../utils/haptics';
import type { PracticeQuiz } from '../../types/curriculum';
import { FormattedText } from './FormattedText';
import { FeedbackCard } from './FeedbackCard';

const OPTION_LETTERS = ['A', 'B', 'C', 'D', 'E', 'F'];

interface Props {
    block: PracticeQuiz;
    onAnswer: (isCorrect: boolean, pointsEarned: number) => void;
}

export function QuizCard({ block, onAnswer }: Props) {
    const { colors, typography, radius, isDark, shadows } = useTheme();
    const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
    const [showResult, setShowResult] = useState(false);
    const [showHint, setShowHint] = useState(false);
    const [attempts, setAttempts] = useState(0);

    const isCorrect = selectedIndex === block.correctIndex;

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
                if (attempts === 0 && block.hint) {
                    setShowHint(true);
                }
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
            <Animated.View entering={FadeInDown.delay(100).duration(500)}>
                <FormattedText style={[typography.title3, { color: colors.text, marginBottom: 22 }]}>
                    {block.question}
                </FormattedText>
            </Animated.View>

            <View style={styles.options}>
                {block.options.map((option, i) => {
                    const isSelected = selectedIndex === i;
                    const isCorrectOption = i === block.correctIndex;

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
                                <View style={[styles.letterCircle, { backgroundColor: letterBg, borderRadius: radius.full }]}>
                                    <Text style={[typography.labelSmall, { color: letterColor, fontWeight: '700' }]}>
                                        {OPTION_LETTERS[i]}
                                    </Text>
                                </View>
                                <Text style={[typography.callout, { color: textColor, flex: 1 }]}>
                                    {option}
                                </Text>
                                {iconName && <Ionicons name={iconName} size={22} color={iconColor} />}
                            </Pressable>
                        </Animated.View>
                    );
                })}
            </View>

            {showHint && block.hint && (
                <FeedbackCard type="hint">{block.hint}</FeedbackCard>
            )}

            {showResult && isCorrect && block.explanation && (
                <FeedbackCard type="success" delay={400} useFormatted>{block.explanation}</FeedbackCard>
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
});
