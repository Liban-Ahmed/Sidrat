/**
 * TapWordCard — Build-a-sentence practice where children tap word tokens
 * in the correct order to construct a sentence.
 *
 * Features:
 *  • Shuffled word bank with tappable chips
 *  • Sentence construction area with numbered word slots
 *  • Shake animation on wrong word selection
 *  • Highlighted completed words with success styling
 *  • Hint button reveals the next correct word
 *  • Undo / Reset controls with haptic feedback
 *  • Theme-token colors, dark mode aware
 *  • Staggered entrance animations
 */

import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import Animated, {
    FadeInDown,
    FadeIn,
    ZoomIn,
    Layout,
    useSharedValue,
    useAnimatedStyle,
    withSequence,
    withTiming,
} from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../theme';
import { haptics } from '../../utils/haptics';
import type { PracticeTapWord } from '../../types/curriculum';
import { FormattedText } from './FormattedText';

interface Props {
    block: PracticeTapWord;
    onAnswer: (isCorrect: boolean, pointsEarned: number) => void;
}

export function TapWordCard({ block, onAnswer }: Props) {
    const { brand, colors, typography, radius, isDark, shadows } = useTheme();

    // Shuffle word bank on mount
    const [shuffled] = useState(() => [...block.words].sort(() => Math.random() - 0.5));
    const [selected, setSelected] = useState<string[]>([]);
    const [showResult, setShowResult] = useState(false);
    const [showHint, setShowHint] = useState(false);
    const [wrongIndex, setWrongIndex] = useState<number | null>(null);
    const [attempts, setAttempts] = useState(0);

    // Track which word-bank indices have been used (handles duplicate words)
    const [usedIndices, setUsedIndices] = useState<Set<number>>(new Set());

    const remaining = shuffled.map((word, i) => ({ word, index: i })).filter(({ index }) => !usedIndices.has(index));

    // Shake animation for wrong word taps
    const shakeX = useSharedValue(0);
    const shakeStyle = useAnimatedStyle(() => ({
        transform: [{ translateX: shakeX.value }],
    }));

    const triggerShake = useCallback(() => {
        shakeX.value = withSequence(
            withTiming(-8, { duration: 50 }),
            withTiming(8, { duration: 50 }),
            withTiming(-6, { duration: 50 }),
            withTiming(6, { duration: 50 }),
            withTiming(0, { duration: 50 }),
        );
    }, [shakeX]);

    const handleTap = useCallback(
        (word: string, bankIndex: number) => {
            if (showResult) return;

            const nextPosition = selected.length;
            const expectedWord = block.correctSentence[nextPosition];

            if (word === expectedWord) {
                // Correct word tapped
                haptics.light();
                const newSelected = [...selected, word];
                const newUsed = new Set(usedIndices);
                newUsed.add(bankIndex);
                setSelected(newSelected);
                setUsedIndices(newUsed);
                setWrongIndex(null);

                // Check if sentence is complete
                if (newSelected.length === block.correctSentence.length) {
                    setShowResult(true);
                    haptics.medium();
                    const pointsEarned = attempts === 0 ? block.points : Math.max(1, Math.floor(block.points / 2));
                    setTimeout(() => onAnswer(true, pointsEarned), 1500);
                }
            } else {
                // Wrong word tapped
                haptics.medium();
                setAttempts((a) => a + 1);
                setWrongIndex(bankIndex);
                triggerShake();

                // Show hint after first wrong attempt
                if (attempts === 0 && block.hint) {
                    setShowHint(true);
                }

                // Clear wrong highlight after a delay
                setTimeout(() => setWrongIndex(null), 800);
            }
        },
        [selected, block, showResult, onAnswer, attempts, usedIndices, triggerShake],
    );

    const handleUndo = useCallback(() => {
        if (showResult || selected.length === 0) return;
        haptics.light();
        const lastWord = selected[selected.length - 1];

        // Find the last used bank index matching this word
        const usedArr = [...usedIndices];
        const matchingUsed = usedArr.filter((i) => shuffled[i] === lastWord);
        const indexToRestore = matchingUsed[matchingUsed.length - 1];

        const newUsed = new Set(usedIndices);
        if (indexToRestore !== undefined) {
            newUsed.delete(indexToRestore);
        }

        setSelected((s) => s.slice(0, -1));
        setUsedIndices(newUsed);
    }, [showResult, selected, shuffled, usedIndices]);

    const handleReset = useCallback(() => {
        haptics.light();
        setSelected([]);
        setUsedIndices(new Set());
        setShowResult(false);
        setWrongIndex(null);
    }, []);

    const handleHint = useCallback(() => {
        if (showResult) return;
        haptics.light();
        setShowHint(true);

        // Auto-place the next correct word
        const nextPosition = selected.length;
        const expectedWord = block.correctSentence[nextPosition];

        // Find this word in the remaining bank
        const match = remaining.find(({ word }) => word === expectedWord);
        if (match) {
            const newSelected = [...selected, match.word];
            const newUsed = new Set(usedIndices);
            newUsed.add(match.index);
            setSelected(newSelected);
            setUsedIndices(newUsed);

            // Mark that we used a hint (reduce points)
            setAttempts((a) => Math.max(a, 1));

            // Check if sentence is complete after hint
            if (newSelected.length === block.correctSentence.length) {
                setShowResult(true);
                haptics.medium();
                const pointsEarned = Math.max(1, Math.floor(block.points / 2));
                setTimeout(() => onAnswer(true, pointsEarned), 1500);
            }
        }
    }, [showResult, selected, block, remaining, usedIndices, onAnswer]);

    // Determine nextExpected word for hint highlighting
    const nextExpected = selected.length < block.correctSentence.length
        ? block.correctSentence[selected.length]
        : null;

    return (
        <Animated.View style={[styles.container, shakeStyle]}>
            {/* ── Instruction ── */}
            <Animated.View entering={FadeInDown.delay(100).duration(500)}>
                <FormattedText style={[typography.title3, { color: colors.text, marginBottom: 18 }]}>
                    {block.instruction}
                </FormattedText>
            </Animated.View>

            {/* ── Sentence Construction Area ── */}
            <Animated.View
                entering={FadeInDown.delay(200).duration(500)}
                style={[
                    styles.sentenceArea,
                    {
                        backgroundColor: isDark ? colors.surfaceSecondary : colors.surface,
                        borderRadius: radius.xl,
                        borderColor: showResult
                            ? colors.success
                            : isDark
                                ? colors.surfaceTertiary
                                : colors.separator,
                        ...shadows.subtle,
                    },
                ]}
            >
                {selected.length === 0 ? (
                    <View style={styles.placeholderRow}>
                        <Ionicons name="text-outline" size={18} color={colors.textTertiary} />
                        <Text style={[typography.bodySmall, { color: colors.textTertiary }]}>
                            Tap the words below to build the sentence
                        </Text>
                    </View>
                ) : (
                    <View style={styles.wordRow}>
                        {selected.map((word, i) => (
                            <Animated.View key={`${word}-${i}`} entering={ZoomIn.duration(200)} layout={Layout}>
                                <View
                                    style={[
                                        styles.selectedWord,
                                        {
                                            backgroundColor: showResult
                                                ? colors.successMuted
                                                : brand.primary + '12',
                                            borderRadius: radius.md,
                                            borderLeftWidth: 3,
                                            borderLeftColor: showResult
                                                ? colors.success
                                                : brand.primary,
                                        },
                                    ]}
                                >
                                    <View
                                        style={[
                                            styles.numberBadge,
                                            {
                                                backgroundColor: showResult
                                                    ? colors.success + '25'
                                                    : brand.primary + '18',
                                                borderRadius: radius.full,
                                            },
                                        ]}
                                    >
                                        <Text
                                            style={[
                                                typography.labelXs,
                                                {
                                                    color: showResult ? colors.success : brand.primary,
                                                    fontWeight: '700',
                                                },
                                            ]}
                                        >
                                            {i + 1}
                                        </Text>
                                    </View>
                                    <Text
                                        style={[
                                            typography.callout,
                                            {
                                                color: showResult ? colors.success : colors.text,
                                            },
                                        ]}
                                    >
                                        {word}
                                    </Text>
                                    {showResult && (
                                        <Ionicons name="checkmark" size={14} color={colors.success} />
                                    )}
                                </View>
                            </Animated.View>
                        ))}
                    </View>
                )}
            </Animated.View>

            {/* ── Undo / Reset / Hint controls ── */}
            {selected.length > 0 && !showResult && (
                <Animated.View entering={FadeIn.duration(300)} style={styles.controlRow}>
                    <Pressable onPress={handleUndo} style={styles.controlButton}>
                        <Ionicons name="arrow-undo" size={15} color={brand.primary} />
                        <Text style={[typography.labelSmall, { color: brand.primary }]}>Undo</Text>
                    </Pressable>
                    <View style={[styles.controlDivider, { backgroundColor: colors.separator }]} />
                    <Pressable onPress={handleReset} style={styles.controlButton}>
                        <Ionicons name="refresh" size={15} color={colors.textTertiary} />
                        <Text style={[typography.labelSmall, { color: colors.textTertiary }]}>Reset</Text>
                    </Pressable>
                    {block.hint && (
                        <>
                            <View style={[styles.controlDivider, { backgroundColor: colors.separator }]} />
                            <Pressable onPress={handleHint} style={styles.controlButton}>
                                <Ionicons name="bulb-outline" size={15} color={brand.accent} />
                                <Text style={[typography.labelSmall, { color: brand.accent }]}>Hint</Text>
                            </Pressable>
                        </>
                    )}
                </Animated.View>
            )}

            {/* ── Hint (no words placed yet) ── */}
            {selected.length === 0 && !showResult && block.hint && (
                <Animated.View entering={FadeIn.duration(300)} style={styles.controlRow}>
                    <Pressable onPress={handleHint} style={styles.controlButton}>
                        <Ionicons name="bulb-outline" size={15} color={brand.accent} />
                        <Text style={[typography.labelSmall, { color: brand.accent }]}>Hint</Text>
                    </Pressable>
                </Animated.View>
            )}

            {/* ── Word Bank ── */}
            <Animated.View entering={FadeInDown.delay(300).duration(500)} style={styles.wordBank}>
                {remaining.map(({ word, index: bankIndex }) => {
                    const isWrong = wrongIndex === bankIndex;
                    const isHinted = showHint && word === nextExpected;

                    return (
                        <Animated.View key={`bank-${bankIndex}`} layout={Layout}>
                            <Pressable
                                onPress={() => handleTap(word, bankIndex)}
                                disabled={showResult}
                                style={({ pressed }) => [
                                    styles.wordChip,
                                    {
                                        backgroundColor: isWrong
                                            ? colors.errorMuted
                                            : isHinted
                                                ? brand.accent + '18'
                                                : isDark
                                                    ? colors.surfaceSecondary
                                                    : colors.surface,
                                        borderColor: isWrong
                                            ? colors.error
                                            : isHinted
                                                ? brand.accent
                                                : isDark
                                                    ? colors.surfaceTertiary
                                                    : colors.separator,
                                        borderRadius: radius.md,
                                        ...shadows.subtle,
                                        transform: [{ scale: pressed ? 0.95 : 1 }],
                                    },
                                ]}
                            >
                                <Text
                                    style={[
                                        typography.callout,
                                        {
                                            color: isWrong
                                                ? colors.error
                                                : isHinted
                                                    ? brand.accent
                                                    : colors.text,
                                        },
                                    ]}
                                >
                                    {word}
                                </Text>
                            </Pressable>
                        </Animated.View>
                    );
                })}
            </Animated.View>

            {/* ── Hint Card ── */}
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

            {/* ── Explanation (after completion) ── */}
            {showResult && block.explanation && (
                <Animated.View
                    entering={FadeIn.delay(600).duration(400)}
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
                    <FormattedText style={[typography.bodySmall, { color: colors.text, flex: 1 }]}>
                        {block.explanation}
                    </FormattedText>
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
    sentenceArea: {
        minHeight: 80,
        padding: 14,
        borderWidth: 1.5,
        justifyContent: 'center',
        marginBottom: 12,
    },
    placeholderRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
    },
    wordRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 6,
    },
    selectedWord: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        paddingHorizontal: 12,
        paddingVertical: 10,
    },
    numberBadge: {
        width: 22,
        height: 22,
        alignItems: 'center',
        justifyContent: 'center',
    },
    controlRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        marginBottom: 16,
    },
    controlButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    controlDivider: {
        width: 1,
        height: 14,
    },
    wordBank: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10,
    },
    wordChip: {
        paddingHorizontal: 18,
        paddingVertical: 12,
        borderWidth: 1,
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
