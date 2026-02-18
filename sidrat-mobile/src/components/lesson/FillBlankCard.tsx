/**
 * FillBlankCard — Fill-in-the-blank with inline blank highlight,
 * themed input, haptic feedback, and polished result cards.
 *
 * Features:
 *  • Inline sentence with underlined blank styled in brand color
 *  • Themed input border that turns success/error on submit
 *  • Character count badge in submit button
 *  • Theme-token success/error/warning colors (no hardcoded hex)
 *  • Hint card with accent left border
 *  • Haptic feedback on submit
 *  • Dark mode aware
 */

import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, TextInput, Pressable } from 'react-native';
import Animated, { FadeInDown, FadeIn } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../theme';
import { haptics } from '../../utils/haptics';
import type { PracticeFillBlank } from '../../types/curriculum';

interface Props {
    block: PracticeFillBlank;
    onAnswer: (isCorrect: boolean, pointsEarned: number) => void;
}

export function FillBlankCard({ block, onAnswer }: Props) {
    const { brand, colors, typography, radius, isDark, shadows } = useTheme();
    const [answer, setAnswer] = useState('');
    const [showResult, setShowResult] = useState(false);
    const [showHint, setShowHint] = useState(false);
    const [attempts, setAttempts] = useState(0);

    const isCorrect = block.acceptedAnswers.some(
        (a) => a.toLowerCase().trim() === answer.toLowerCase().trim(),
    );

    const handleSubmit = useCallback(() => {
        if (answer.trim().length === 0) return;
        haptics.medium();
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
            {/* ── Sentence with blank ── */}
            <Animated.View
                entering={FadeInDown.delay(100).duration(500)}
                style={[
                    styles.sentenceCard,
                    {
                        backgroundColor: isDark ? colors.surfaceSecondary : colors.surface,
                        borderRadius: radius.xl,
                        ...shadows.card,
                    },
                ]}
            >
                <Text style={[typography.title3, { color: colors.text, lineHeight: 34 }]}>
                    {parts[0]}
                    <Text
                        style={{
                            color: showResult
                                ? isCorrect
                                    ? colors.success
                                    : colors.error
                                : brand.primary,
                            textDecorationLine: 'underline',
                            textDecorationColor: showResult
                                ? isCorrect
                                    ? colors.success
                                    : colors.error
                                : brand.primary + '60',
                            fontWeight: '700',
                        }}
                    >
                        {answer || '______'}
                    </Text>
                    {parts[1]}
                </Text>
            </Animated.View>

            {/* ── Input ── */}
            <Animated.View entering={FadeInDown.delay(300).duration(500)} style={styles.inputRow}>
                <TextInput
                    style={[
                        styles.input,
                        typography.body,
                        {
                            backgroundColor: isDark ? colors.surfaceSecondary : colors.surface,
                            color: colors.text,
                            borderRadius: radius.lg,
                            borderColor: showResult
                                ? isCorrect
                                    ? colors.success
                                    : colors.error
                                : answer.length > 0
                                    ? brand.primary
                                    : isDark
                                        ? colors.surfaceTertiary
                                        : colors.separator,
                            ...shadows.subtle,
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
                    style={({ pressed }) => [
                        styles.submitButton,
                        {
                            backgroundColor:
                                answer.trim().length > 0 && !showResult
                                    ? brand.primary
                                    : isDark
                                        ? colors.surfaceTertiary
                                        : colors.backgroundTertiary,
                            borderRadius: radius.lg,
                            shadowColor: brand.primary,
                            shadowOffset: { width: 0, height: 3 },
                            shadowOpacity: answer.trim().length > 0 && !showResult ? 0.2 : 0,
                            shadowRadius: 6,
                            transform: [{ scale: pressed ? 0.95 : 1 }],
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

            {/* ── Result feedback ── */}
            {showResult && (
                <Animated.View
                    entering={FadeIn.delay(200).duration(400)}
                    style={[
                        styles.resultCard,
                        {
                            backgroundColor: isCorrect ? colors.successMuted : colors.errorMuted,
                            borderRadius: radius.md,
                            borderLeftWidth: 3,
                            borderLeftColor: isCorrect ? colors.success : colors.error,
                        },
                    ]}
                >
                    <Ionicons
                        name={isCorrect ? 'checkmark-circle' : 'close-circle'}
                        size={20}
                        color={isCorrect ? colors.success : colors.error}
                    />
                    <Text style={[typography.bodySmall, { color: colors.text, flex: 1 }]}>
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
    sentenceCard: {
        padding: 20,
        marginBottom: 20,
    },
    inputRow: {
        flexDirection: 'row',
        gap: 10,
    },
    input: {
        flex: 1,
        height: 52,
        paddingHorizontal: 16,
        borderWidth: 1.5,
    },
    submitButton: {
        width: 52,
        height: 52,
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
    resultCard: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: 10,
        padding: 14,
        marginTop: 12,
    },
});
