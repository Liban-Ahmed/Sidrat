/**
 * MatchingCard — Match pairs practice component.
 * Child taps left item, then taps matching right item.
 */

import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import Animated, { FadeInDown, FadeIn, ZoomIn } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../theme';
import type { PracticeMatching } from '../../types/curriculum';

interface Props {
    block: PracticeMatching;
    onAnswer: (isCorrect: boolean, pointsEarned: number) => void;
}

export function MatchingCard({ block, onAnswer }: Props) {
    const { brand, colors, typography, radius } = useTheme();

    // Shuffle right column
    const [shuffledRight] = useState(() =>
        [...block.pairs.map((p) => p.right)].sort(() => Math.random() - 0.5),
    );

    const [selectedLeft, setSelectedLeft] = useState<string | null>(null);
    const [matched, setMatched] = useState<Map<string, string>>(new Map());
    const [wrongPair, setWrongPair] = useState<{ left: string; right: string } | null>(null);

    const allMatched = matched.size === block.pairs.length;

    const handleLeftTap = useCallback(
        (left: string) => {
            if (matched.has(left)) return;
            setSelectedLeft(left);
            setWrongPair(null);
        },
        [matched],
    );

    const handleRightTap = useCallback(
        (right: string) => {
            if (!selectedLeft) return;
            if ([...matched.values()].includes(right)) return;

            const correctPair = block.pairs.find((p) => p.left === selectedLeft);
            if (correctPair && correctPair.right === right) {
                // Correct match
                const newMatched = new Map(matched);
                newMatched.set(selectedLeft, right);
                setMatched(newMatched);
                setSelectedLeft(null);
                setWrongPair(null);

                if (newMatched.size === block.pairs.length) {
                    // All matched
                    setTimeout(() => onAnswer(true, block.points), 800);
                }
            } else {
                // Wrong match
                setWrongPair({ left: selectedLeft, right });
                setTimeout(() => {
                    setWrongPair(null);
                    setSelectedLeft(null);
                }, 800);
            }
        },
        [selectedLeft, matched, block, onAnswer],
    );

    return (
        <View style={styles.container}>
            {/* Instruction */}
            <Animated.View entering={FadeInDown.delay(100).duration(500)}>
                <Text style={[typography.calloutBold, { color: colors.text, marginBottom: 20 }]}>
                    {block.instruction}
                </Text>
            </Animated.View>

            {/* Matching columns */}
            <View style={styles.columns}>
                {/* Left column */}
                <View style={styles.column}>
                    {block.pairs.map((pair, i) => {
                        const isMatched = matched.has(pair.left);
                        const isSelected = selectedLeft === pair.left;
                        const isWrong = wrongPair?.left === pair.left;
                        return (
                            <Animated.View key={pair.left} entering={FadeInDown.delay(200 + i * 80).duration(400)}>
                                <Pressable
                                    onPress={() => handleLeftTap(pair.left)}
                                    disabled={isMatched}
                                    style={[
                                        styles.matchItem,
                                        {
                                            backgroundColor: isMatched
                                                ? '#E8F5E9'
                                                : isWrong
                                                    ? '#FFEBEE'
                                                    : isSelected
                                                        ? brand.primary + '15'
                                                        : colors.surfaceSecondary,
                                            borderColor: isMatched
                                                ? colors.success
                                                : isWrong
                                                    ? colors.error
                                                    : isSelected
                                                        ? brand.primary
                                                        : colors.separator,
                                            borderRadius: radius.md,
                                        },
                                    ]}
                                >
                                    <Text
                                        style={[
                                            typography.callout,
                                            {
                                                color: isMatched
                                                    ? colors.success
                                                    : isSelected
                                                        ? brand.primary
                                                        : colors.text,
                                                fontWeight: isSelected ? '600' : '400',
                                            },
                                        ]}
                                    >
                                        {pair.left}
                                    </Text>
                                    {isMatched && (
                                        <Animated.View entering={ZoomIn.duration(200)}>
                                            <Ionicons name="checkmark-circle" size={18} color={colors.success} />
                                        </Animated.View>
                                    )}
                                </Pressable>
                            </Animated.View>
                        );
                    })}
                </View>

                {/* Right column */}
                <View style={styles.column}>
                    {shuffledRight.map((right, i) => {
                        const isMatched = [...matched.values()].includes(right);
                        const isWrong = wrongPair?.right === right;
                        return (
                            <Animated.View key={right} entering={FadeInDown.delay(300 + i * 80).duration(400)}>
                                <Pressable
                                    onPress={() => handleRightTap(right)}
                                    disabled={isMatched || !selectedLeft}
                                    style={[
                                        styles.matchItem,
                                        {
                                            backgroundColor: isMatched
                                                ? '#E8F5E9'
                                                : isWrong
                                                    ? '#FFEBEE'
                                                    : colors.surfaceSecondary,
                                            borderColor: isMatched
                                                ? colors.success
                                                : isWrong
                                                    ? colors.error
                                                    : colors.separator,
                                            borderRadius: radius.md,
                                            opacity: !selectedLeft && !isMatched ? 0.6 : 1,
                                        },
                                    ]}
                                >
                                    <Text
                                        style={[
                                            typography.callout,
                                            { color: isMatched ? colors.success : colors.text },
                                        ]}
                                    >
                                        {right}
                                    </Text>
                                    {isMatched && (
                                        <Animated.View entering={ZoomIn.duration(200)}>
                                            <Ionicons name="checkmark-circle" size={18} color={colors.success} />
                                        </Animated.View>
                                    )}
                                </Pressable>
                            </Animated.View>
                        );
                    })}
                </View>
            </View>

            {/* Completion */}
            {allMatched && block.explanation && (
                <Animated.View
                    entering={FadeIn.delay(400).duration(400)}
                    style={[styles.explanation, { backgroundColor: '#E8F5E9', borderRadius: radius.md }]}
                >
                    <Ionicons name="sparkles" size={18} color={colors.success} />
                    <Text style={[typography.caption, { color: colors.text, flex: 1 }]}>
                        {block.explanation}
                    </Text>
                </Animated.View>
            )}

            {/* Helper text */}
            {!allMatched && !selectedLeft && (
                <Text
                    style={[typography.caption, { color: colors.textTertiary, textAlign: 'center', marginTop: 16 }]}
                >
                    Tap an item on the left, then tap its match on the right
                </Text>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 24,
        paddingTop: 20,
    },
    columns: {
        flexDirection: 'row',
        gap: 12,
    },
    column: {
        flex: 1,
        gap: 10,
    },
    matchItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 14,
        borderWidth: 1.5,
        minHeight: 50,
    },
    explanation: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        padding: 14,
        marginTop: 20,
    },
});
