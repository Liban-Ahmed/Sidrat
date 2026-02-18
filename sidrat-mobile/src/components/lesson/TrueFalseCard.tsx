/**
 * TrueFalseCard — Premium true/false practice with large tactile buttons,
 * themed feedback, haptic response, and animated icon transitions.
 *
 * Features:
 *  • Full-width card buttons with icon + label
 *  • Theme-token success/error/warning colors (no hardcoded hex)
 *  • Colored glow shadow on feedback state
 *  • Haptic feedback on tap
 *  • Staggered entrance animation
 *  • Explanation card with accent left border
 *  • Dark mode aware
 */

import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import Animated, { FadeInDown, FadeInUp, FadeIn } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../theme';
import { haptics } from '../../utils/haptics';
import type { PracticeTrueFalse } from '../../types/curriculum';

interface Props {
    block: PracticeTrueFalse;
    onAnswer: (isCorrect: boolean, pointsEarned: number) => void;
}

export function TrueFalseCard({ block, onAnswer }: Props) {
    const { brand, colors, typography, radius, isDark } = useTheme();
    const [selected, setSelected] = useState<boolean | null>(null);
    const [showResult, setShowResult] = useState(false);

    const isCorrect = selected === block.correctAnswer;

    const handleSelect = useCallback(
        (value: boolean) => {
            if (showResult) return;
            haptics.medium();
            setSelected(value);
            setShowResult(true);

            const correct = value === block.correctAnswer;
            setTimeout(() => onAnswer(correct, correct ? block.points : 0), 1200);
        },
        [block, showResult, onAnswer],
    );

    const getButtonStyle = (value: boolean) => {
        const isSelected = selected === value;
        const base = {
            bg: isDark ? colors.surfaceSecondary : colors.surface,
            border: isDark ? colors.surfaceTertiary : colors.separator,
            text: colors.text,
            iconColor: value ? brand.secondary : brand.coral,
            shadow: 'transparent',
        };

        if (!showResult) {
            return isSelected
                ? {
                    ...base,
                    bg: brand.primary + '10',
                    border: brand.primary,
                    shadow: brand.primary,
                }
                : base;
        }

        if (!isSelected) return base;

        if (isCorrect) {
            return {
                bg: colors.successMuted,
                border: colors.success,
                text: colors.success,
                iconColor: colors.success,
                shadow: colors.success,
            };
        }
        return {
            bg: colors.errorMuted,
            border: colors.error,
            text: colors.error,
            iconColor: colors.error,
            shadow: colors.error,
        };
    };

    return (
        <View style={styles.container}>
            {/* ── Statement ── */}
            <Animated.View entering={FadeInDown.delay(100).duration(500)}>
                <Text
                    style={[
                        typography.title3,
                        {
                            color: colors.text,
                            textAlign: 'center',
                            marginBottom: 32,
                            lineHeight: 32,
                        },
                    ]}
                >
                    {block.statement}
                </Text>
            </Animated.View>

            {/* ── True / False buttons ── */}
            <View style={styles.buttons}>
                {([true, false] as const).map((value, i) => {
                    const s = getButtonStyle(value);
                    return (
                        <Animated.View
                            key={String(value)}
                            entering={FadeInUp.delay(250 + i * 100).duration(450).springify().damping(16)}
                            style={{ flex: 1 }}
                        >
                            <Pressable
                                onPress={() => handleSelect(value)}
                                disabled={showResult}
                                style={({ pressed }) => [
                                    styles.button,
                                    {
                                        backgroundColor: s.bg,
                                        borderColor: s.border,
                                        borderRadius: radius.xl,
                                        shadowColor: s.shadow,
                                        shadowOffset: { width: 0, height: 4 },
                                        shadowOpacity: s.shadow !== 'transparent' ? 0.2 : 0,
                                        shadowRadius: 10,
                                        elevation: s.shadow !== 'transparent' ? 3 : 0,
                                        transform: [{ scale: pressed ? 0.96 : 1 }],
                                    },
                                ]}
                            >
                                <View
                                    style={[
                                        styles.iconBg,
                                        {
                                            backgroundColor: s.iconColor + '14',
                                            borderRadius: radius.full,
                                        },
                                    ]}
                                >
                                    <Ionicons
                                        name={value ? 'checkmark-circle' : 'close-circle'}
                                        size={30}
                                        color={s.iconColor}
                                    />
                                </View>
                                <Text style={[typography.title3, { color: s.text }]}>
                                    {value ? 'True' : 'False'}
                                </Text>
                            </Pressable>
                        </Animated.View>
                    );
                })}
            </View>

            {/* ── Explanation ── */}
            {showResult && block.explanation && (
                <Animated.View
                    entering={FadeIn.delay(400).duration(400)}
                    style={[
                        styles.explanation,
                        {
                            backgroundColor: isCorrect
                                ? colors.successMuted
                                : colors.warningMuted,
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
    buttons: {
        flexDirection: 'row',
        gap: 14,
    },
    button: {
        height: 130,
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
        borderWidth: 2,
    },
    iconBg: {
        width: 52,
        height: 52,
        alignItems: 'center',
        justifyContent: 'center',
    },
    explanation: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: 10,
        padding: 14,
        marginTop: 20,
    },
});
