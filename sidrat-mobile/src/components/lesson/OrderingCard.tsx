/**
 * OrderingCard — Drag-to-order practice component.
 * For simplicity, uses tap-to-select ordering (child taps items
 * in order) rather than drag-and-drop which requires complex gestures.
 */

import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import Animated, { FadeInDown, FadeIn, ZoomIn, Layout } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../theme';
import type { PracticeOrdering } from '../../types/curriculum';

interface Props {
    block: PracticeOrdering;
    onAnswer: (isCorrect: boolean, pointsEarned: number) => void;
}

export function OrderingCard({ block, onAnswer }: Props) {
    const { brand, colors, typography, radius } = useTheme();

    // Shuffle the items
    const [shuffled] = useState(() => [...block.correctOrder].sort(() => Math.random() - 0.5));
    const [selected, setSelected] = useState<string[]>([]);
    const [showResult, setShowResult] = useState(false);

    const remaining = shuffled.filter((item) => !selected.includes(item));
    const isComplete = selected.length === block.correctOrder.length;
    const isCorrect =
        isComplete && selected.every((item, i) => item === block.correctOrder[i]);

    const handleTap = useCallback(
        (item: string) => {
            if (showResult) return;
            const newSelected = [...selected, item];
            setSelected(newSelected);

            if (newSelected.length === block.correctOrder.length) {
                setShowResult(true);
                const correct = newSelected.every((s, i) => s === block.correctOrder[i]);
                setTimeout(() => onAnswer(correct, correct ? block.points : 0), 1500);
            }
        },
        [selected, block, showResult, onAnswer],
    );

    const handleUndo = useCallback(() => {
        if (showResult || selected.length === 0) return;
        setSelected((s) => s.slice(0, -1));
    }, [showResult, selected.length]);

    const handleReset = useCallback(() => {
        setSelected([]);
        setShowResult(false);
    }, []);

    return (
        <View style={styles.container}>
            {/* Instruction */}
            <Animated.View entering={FadeInDown.delay(100).duration(500)}>
                <Text style={[typography.calloutBold, { color: colors.text, marginBottom: 16 }]}>
                    {block.instruction}
                </Text>
            </Animated.View>

            {/* Selected items (answer area) */}
            <Animated.View
                entering={FadeInDown.delay(200).duration(500)}
                style={[
                    styles.answerArea,
                    {
                        backgroundColor: colors.surfaceSecondary,
                        borderRadius: radius.lg,
                        borderColor: showResult
                            ? isCorrect
                                ? colors.success
                                : colors.error
                            : colors.separator,
                    },
                ]}
            >
                {selected.length === 0 ? (
                    <Text style={[typography.caption, { color: colors.textTertiary }]}>
                        Tap items below in the correct order
                    </Text>
                ) : (
                    <View style={styles.chipRow}>
                        {selected.map((item, i) => (
                            <Animated.View key={`${item}-${i}`} entering={ZoomIn.duration(200)} layout={Layout}>
                                <View
                                    style={[
                                        styles.selectedChip,
                                        {
                                            backgroundColor: showResult
                                                ? item === block.correctOrder[i]
                                                    ? '#E8F5E9'
                                                    : '#FFEBEE'
                                                : brand.primary + '15',
                                            borderRadius: radius.sm,
                                        },
                                    ]}
                                >
                                    <Text style={[typography.footnote, { color: colors.textTertiary }]}>
                                        {i + 1}.
                                    </Text>
                                    <Text
                                        style={[
                                            typography.callout,
                                            {
                                                color: showResult
                                                    ? item === block.correctOrder[i]
                                                        ? colors.success
                                                        : colors.error
                                                    : brand.primary,
                                            },
                                        ]}
                                    >
                                        {item}
                                    </Text>
                                </View>
                            </Animated.View>
                        ))}
                    </View>
                )}
            </Animated.View>

            {/* Undo / Reset row */}
            {selected.length > 0 && !showResult && (
                <Animated.View entering={FadeIn.duration(300)} style={styles.undoRow}>
                    <Pressable onPress={handleUndo} style={styles.undoButton}>
                        <Ionicons name="arrow-undo" size={16} color={brand.primary} />
                        <Text style={[typography.caption, { color: brand.primary }]}>Undo</Text>
                    </Pressable>
                    <Pressable onPress={handleReset} style={styles.undoButton}>
                        <Ionicons name="refresh" size={16} color={colors.textTertiary} />
                        <Text style={[typography.caption, { color: colors.textTertiary }]}>Reset</Text>
                    </Pressable>
                </Animated.View>
            )}

            {/* Available items */}
            <Animated.View entering={FadeInDown.delay(300).duration(500)} style={styles.choicesArea}>
                {remaining.map((item) => (
                    <Animated.View key={item} layout={Layout}>
                        <Pressable
                            onPress={() => handleTap(item)}
                            disabled={showResult}
                            style={[
                                styles.choiceChip,
                                {
                                    backgroundColor: colors.surface,
                                    borderColor: colors.separator,
                                    borderRadius: radius.md,
                                },
                            ]}
                        >
                            <Text style={[typography.callout, { color: colors.text }]}>{item}</Text>
                        </Pressable>
                    </Animated.View>
                ))}
            </Animated.View>

            {/* Explanation */}
            {showResult && block.explanation && (
                <Animated.View
                    entering={FadeIn.delay(600).duration(400)}
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
    answerArea: {
        minHeight: 80,
        padding: 14,
        borderWidth: 1.5,
        justifyContent: 'center',
        marginBottom: 12,
    },
    chipRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    selectedChip: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        paddingHorizontal: 12,
        paddingVertical: 8,
    },
    undoRow: {
        flexDirection: 'row',
        gap: 16,
        marginBottom: 16,
    },
    undoButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    choicesArea: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10,
    },
    choiceChip: {
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderWidth: 1,
    },
    explanation: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        padding: 14,
        marginTop: 20,
    },
});
