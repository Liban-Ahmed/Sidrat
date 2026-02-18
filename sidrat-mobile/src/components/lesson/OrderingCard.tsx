/**
 * OrderingCard — Tap-to-order practice with numbered answer slots,
 * themed feedback, haptic response, and polished chip animations.
 *
 * Features:
 *  • Numbered answer area with border-left accent per slot
 *  • Theme-token success/error/warning colors
 *  • ZoomIn chip entrance + Layout animation for reflow
 *  • Undo / Reset controls with haptic feedback
 *  • Accent left-border on explanation card
 *  • Dark mode aware
 */

import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import Animated, { FadeInDown, FadeIn, ZoomIn, Layout } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../theme';
import { haptics } from '../../utils/haptics';
import type { PracticeOrdering } from '../../types/curriculum';

interface Props {
    block: PracticeOrdering;
    onAnswer: (isCorrect: boolean, pointsEarned: number) => void;
}

export function OrderingCard({ block, onAnswer }: Props) {
    const { brand, colors, typography, radius, isDark, shadows } = useTheme();

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
            haptics.light();
            const newSelected = [...selected, item];
            setSelected(newSelected);

            if (newSelected.length === block.correctOrder.length) {
                setShowResult(true);
                const correct = newSelected.every((s, i) => s === block.correctOrder[i]);
                haptics.medium();
                setTimeout(() => onAnswer(correct, correct ? block.points : 0), 1500);
            }
        },
        [selected, block, showResult, onAnswer],
    );

    const handleUndo = useCallback(() => {
        if (showResult || selected.length === 0) return;
        haptics.light();
        setSelected((s) => s.slice(0, -1));
    }, [showResult, selected.length]);

    const handleReset = useCallback(() => {
        haptics.light();
        setSelected([]);
        setShowResult(false);
    }, []);

    return (
        <View style={styles.container}>
            {/* ── Instruction ── */}
            <Animated.View entering={FadeInDown.delay(100).duration(500)}>
                <Text style={[typography.title3, { color: colors.text, marginBottom: 18 }]}>
                    {block.instruction}
                </Text>
            </Animated.View>

            {/* ── Answer area ── */}
            <Animated.View
                entering={FadeInDown.delay(200).duration(500)}
                style={[
                    styles.answerArea,
                    {
                        backgroundColor: isDark ? colors.surfaceSecondary : colors.surface,
                        borderRadius: radius.xl,
                        borderColor: showResult
                            ? isCorrect
                                ? colors.success
                                : colors.error
                            : isDark
                                ? colors.surfaceTertiary
                                : colors.separator,
                        ...shadows.subtle,
                    },
                ]}
            >
                {selected.length === 0 ? (
                    <View style={styles.placeholderRow}>
                        <Ionicons name="swap-vertical-outline" size={18} color={colors.textTertiary} />
                        <Text style={[typography.bodySmall, { color: colors.textTertiary }]}>
                            Tap items below in the correct order
                        </Text>
                    </View>
                ) : (
                    <View style={styles.chipRow}>
                        {selected.map((item, i) => {
                            const itemCorrect = item === block.correctOrder[i];
                            return (
                                <Animated.View key={`${item}-${i}`} entering={ZoomIn.duration(200)} layout={Layout}>
                                    <View
                                        style={[
                                            styles.selectedChip,
                                            {
                                                backgroundColor: showResult
                                                    ? itemCorrect
                                                        ? colors.successMuted
                                                        : colors.errorMuted
                                                    : brand.primary + '12',
                                                borderRadius: radius.md,
                                                borderLeftWidth: 3,
                                                borderLeftColor: showResult
                                                    ? itemCorrect
                                                        ? colors.success
                                                        : colors.error
                                                    : brand.primary,
                                            },
                                        ]}
                                    >
                                        <View
                                            style={[
                                                styles.numberBadge,
                                                {
                                                    backgroundColor: showResult
                                                        ? itemCorrect
                                                            ? colors.success + '25'
                                                            : colors.error + '25'
                                                        : brand.primary + '18',
                                                    borderRadius: radius.full,
                                                },
                                            ]}
                                        >
                                            <Text
                                                style={[
                                                    typography.labelXs,
                                                    {
                                                        color: showResult
                                                            ? itemCorrect
                                                                ? colors.success
                                                                : colors.error
                                                            : brand.primary,
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
                                                    color: showResult
                                                        ? itemCorrect
                                                            ? colors.success
                                                            : colors.error
                                                        : colors.text,
                                                },
                                            ]}
                                        >
                                            {item}
                                        </Text>
                                        {showResult && (
                                            <Ionicons
                                                name={itemCorrect ? 'checkmark' : 'close'}
                                                size={14}
                                                color={itemCorrect ? colors.success : colors.error}
                                            />
                                        )}
                                    </View>
                                </Animated.View>
                            );
                        })}
                    </View>
                )}
            </Animated.View>

            {/* ── Undo / Reset ── */}
            {selected.length > 0 && !showResult && (
                <Animated.View entering={FadeIn.duration(300)} style={styles.undoRow}>
                    <Pressable onPress={handleUndo} style={styles.undoButton}>
                        <Ionicons name="arrow-undo" size={15} color={brand.primary} />
                        <Text style={[typography.labelSmall, { color: brand.primary }]}>Undo</Text>
                    </Pressable>
                    <View style={[styles.undoDivider, { backgroundColor: colors.separator }]} />
                    <Pressable onPress={handleReset} style={styles.undoButton}>
                        <Ionicons name="refresh" size={15} color={colors.textTertiary} />
                        <Text style={[typography.labelSmall, { color: colors.textTertiary }]}>Reset</Text>
                    </Pressable>
                </Animated.View>
            )}

            {/* ── Available items ── */}
            <Animated.View entering={FadeInDown.delay(300).duration(500)} style={styles.choicesArea}>
                {remaining.map((item) => (
                    <Animated.View key={item} layout={Layout}>
                        <Pressable
                            onPress={() => handleTap(item)}
                            disabled={showResult}
                            style={({ pressed }) => [
                                styles.choiceChip,
                                {
                                    backgroundColor: isDark ? colors.surfaceSecondary : colors.surface,
                                    borderColor: isDark ? colors.surfaceTertiary : colors.separator,
                                    borderRadius: radius.md,
                                    ...shadows.subtle,
                                    transform: [{ scale: pressed ? 0.95 : 1 }],
                                },
                            ]}
                        >
                            <Text style={[typography.callout, { color: colors.text }]}>{item}</Text>
                        </Pressable>
                    </Animated.View>
                ))}
            </Animated.View>

            {/* ── Explanation ── */}
            {showResult && block.explanation && (
                <Animated.View
                    entering={FadeIn.delay(600).duration(400)}
                    style={[
                        styles.explanation,
                        {
                            backgroundColor: isCorrect ? colors.successMuted : colors.warningMuted,
                            borderRadius: radius.md,
                            borderLeftWidth: 3,
                            borderLeftColor: isCorrect ? colors.success : brand.accent,
                        },
                    ]}
                >
                    <Ionicons
                        name={isCorrect ? 'sparkles' : 'information-circle-outline'}
                        size={18}
                        color={isCorrect ? colors.success : brand.accent}
                    />
                    <Text style={[typography.bodySmall, { color: colors.text, flex: 1 }]}>
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
    placeholderRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
    },
    chipRow: {
        gap: 6,
    },
    selectedChip: {
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
    undoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        marginBottom: 16,
    },
    undoButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    undoDivider: {
        width: 1,
        height: 14,
    },
    choicesArea: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10,
    },
    choiceChip: {
        paddingHorizontal: 18,
        paddingVertical: 12,
        borderWidth: 1,
    },
    explanation: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: 10,
        padding: 14,
        marginTop: 20,
    },
});
