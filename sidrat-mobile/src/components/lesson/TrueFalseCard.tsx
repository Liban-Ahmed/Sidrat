/**
 * TrueFalseCard — True/False practice component.
 */

import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import Animated, { FadeInDown, FadeIn } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../theme';
import type { PracticeTrueFalse } from '../../types/curriculum';

interface Props {
    block: PracticeTrueFalse;
    onAnswer: (isCorrect: boolean, pointsEarned: number) => void;
}

export function TrueFalseCard({ block, onAnswer }: Props) {
    const { brand, colors, typography, radius } = useTheme();
    const [selected, setSelected] = useState<boolean | null>(null);
    const [showResult, setShowResult] = useState(false);

    const isCorrect = selected === block.correctAnswer;

    const handleSelect = useCallback(
        (value: boolean) => {
            if (showResult) return;
            setSelected(value);
            setShowResult(true);

            const correct = value === block.correctAnswer;
            setTimeout(() => onAnswer(correct, correct ? block.points : 0), 1200);
        },
        [block, showResult, onAnswer],
    );

    const getButtonStyle = (value: boolean) => {
        const isSelected = selected === value;
        if (!showResult || !isSelected) {
            return {
                bg: isSelected ? brand.primary + '10' : colors.surfaceSecondary,
                border: isSelected ? brand.primary : colors.separator,
                text: colors.text,
            };
        }
        if (isCorrect) {
            return { bg: '#E8F5E9', border: colors.success, text: colors.success };
        }
        return { bg: '#FFEBEE', border: colors.error, text: colors.error };
    };

    return (
        <View style={styles.container}>
            {/* Statement */}
            <Animated.View entering={FadeInDown.delay(100).duration(500)}>
                <Text style={[typography.title3, { color: colors.text, textAlign: 'center', marginBottom: 32 }]}>
                    {block.statement}
                </Text>
            </Animated.View>

            {/* True / False buttons */}
            <Animated.View entering={FadeInDown.delay(300).duration(500)} style={styles.buttons}>
                {[true, false].map((value) => {
                    const style = getButtonStyle(value);
                    return (
                        <Pressable
                            key={String(value)}
                            onPress={() => handleSelect(value)}
                            disabled={showResult}
                            style={[
                                styles.button,
                                {
                                    backgroundColor: style.bg,
                                    borderColor: style.border,
                                    borderRadius: radius.lg,
                                },
                            ]}
                        >
                            <Ionicons
                                name={value ? 'checkmark-circle-outline' : 'close-circle-outline'}
                                size={32}
                                color={style.text}
                            />
                            <Text style={[typography.title3, { color: style.text }]}>
                                {value ? 'True' : 'False'}
                            </Text>
                        </Pressable>
                    );
                })}
            </Animated.View>

            {/* Explanation */}
            {showResult && block.explanation && (
                <Animated.View
                    entering={FadeIn.delay(400).duration(400)}
                    style={[
                        styles.explanation,
                        {
                            backgroundColor: isCorrect ? '#E8F5E9' : '#FFF3E0',
                            borderRadius: radius.md,
                        },
                    ]}
                >
                    <Ionicons
                        name={isCorrect ? 'sparkles' : 'information-circle-outline'}
                        size={18}
                        color={isCorrect ? colors.success : brand.accent}
                    />
                    <Text style={[typography.caption, { color: colors.text, flex: 1 }]}>
                        {block.explanation}
                    </Text>
                </Animated.View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 24,
        paddingTop: 20,
    },
    buttons: {
        flexDirection: 'row',
        gap: 14,
    },
    button: {
        flex: 1,
        height: 120,
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        borderWidth: 2,
    },
    explanation: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        padding: 14,
        marginTop: 20,
    },
});
