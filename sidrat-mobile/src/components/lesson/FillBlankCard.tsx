/**
 * FillBlankCard — Fill-in-the-blank practice component.
 */

import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, TextInput, Pressable } from 'react-native';
import Animated, { FadeInDown, FadeIn } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../theme';
import type { PracticeFillBlank } from '../../types/curriculum';

interface Props {
    block: PracticeFillBlank;
    onAnswer: (isCorrect: boolean, pointsEarned: number) => void;
}

export function FillBlankCard({ block, onAnswer }: Props) {
    const { brand, colors, typography, radius } = useTheme();
    const [answer, setAnswer] = useState('');
    const [showResult, setShowResult] = useState(false);
    const [showHint, setShowHint] = useState(false);
    const [attempts, setAttempts] = useState(0);

    const isCorrect = block.acceptedAnswers.some(
        (a) => a.toLowerCase().trim() === answer.toLowerCase().trim(),
    );

    const handleSubmit = useCallback(() => {
        if (answer.trim().length === 0) return;
        setShowResult(true);

        if (isCorrect) {
            const points = attempts === 0 ? block.points : Math.max(1, Math.floor(block.points / 2));
            setTimeout(() => onAnswer(true, points), 1200);
        } else {
            setAttempts((a) => a + 1);
            if (block.hint && attempts === 0) setShowHint(true);
            setTimeout(() => {
                setShowResult(false);
                setAnswer('');
            }, 1500);
        }
    }, [answer, isCorrect, block, onAnswer, attempts]);

    // Split sentence around ___
    const parts = block.sentence.split('___');

    return (
        <View style={styles.container}>
            {/* Sentence with blank */}
            <Animated.View entering={FadeInDown.delay(100).duration(500)} style={styles.sentenceArea}>
                <Text style={[typography.title3, { color: colors.text, lineHeight: 32 }]}>
                    {parts[0]}
                    <Text
                        style={{
                            color: showResult
                                ? isCorrect
                                    ? colors.success
                                    : colors.error
                                : brand.primary,
                            textDecorationLine: 'underline',
                            fontWeight: '700',
                        }}
                    >
                        {answer || '______'}
                    </Text>
                    {parts[1]}
                </Text>
            </Animated.View>

            {/* Input */}
            <Animated.View entering={FadeInDown.delay(300).duration(500)} style={styles.inputRow}>
                <TextInput
                    style={[
                        styles.input,
                        typography.body,
                        {
                            backgroundColor: colors.surfaceSecondary,
                            color: colors.text,
                            borderRadius: radius.md,
                            borderColor: showResult
                                ? isCorrect
                                    ? colors.success
                                    : colors.error
                                : answer.length > 0
                                    ? brand.primary
                                    : colors.separator,
                        },
                    ]}
                    placeholder="Type your answer..."
                    placeholderTextColor={colors.textTertiary}
                    value={answer}
                    onChangeText={setAnswer}
                    autoCapitalize="none"
                    autoCorrect={false}
                    returnKeyType="done"
                    onSubmitEditing={handleSubmit}
                    editable={!showResult}
                />
                <Pressable
                    onPress={handleSubmit}
                    disabled={answer.trim().length === 0 || showResult}
                    style={[
                        styles.submitButton,
                        {
                            backgroundColor:
                                answer.trim().length > 0 && !showResult
                                    ? brand.primary
                                    : colors.surfaceTertiary,
                            borderRadius: radius.md,
                        },
                    ]}
                >
                    <Ionicons
                        name="arrow-forward"
                        size={22}
                        color={answer.trim().length > 0 && !showResult ? '#FFF' : colors.textTertiary}
                    />
                </Pressable>
            </Animated.View>

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

            {/* Result feedback */}
            {showResult && (
                <Animated.View
                    entering={FadeIn.delay(200).duration(400)}
                    style={[
                        styles.resultCard,
                        {
                            backgroundColor: isCorrect ? '#E8F5E9' : '#FFEBEE',
                            borderRadius: radius.md,
                        },
                    ]}
                >
                    <Ionicons
                        name={isCorrect ? 'checkmark-circle' : 'close-circle'}
                        size={20}
                        color={isCorrect ? colors.success : colors.error}
                    />
                    <Text style={[typography.callout, { color: colors.text, flex: 1 }]}>
                        {isCorrect
                            ? block.explanation ?? 'Correct!'
                            : `Try again! The answer starts with "${block.acceptedAnswers[0]?.charAt(0) ?? ''}..."`}
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
    sentenceArea: {
        marginBottom: 24,
    },
    inputRow: {
        flexDirection: 'row',
        gap: 10,
    },
    input: {
        flex: 1,
        height: 50,
        paddingHorizontal: 16,
        borderWidth: 1.5,
    },
    submitButton: {
        width: 50,
        height: 50,
        alignItems: 'center',
        justifyContent: 'center',
    },
    hintCard: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        padding: 14,
        marginTop: 16,
    },
    resultCard: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        padding: 14,
        marginTop: 12,
    },
});
