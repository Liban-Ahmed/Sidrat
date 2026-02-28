/**
 * PracticePhase — Orchestrates practice cards with a polished header,
 * animated segmented progress bar, star-burst score badge, and smooth
 * card transitions.
 *
 * Features:
 *  • Segmented progress bar (one cell per question, current highlighted)
 *  • Animated score badge with golden star icon
 *  • FadeIn card entrance per question transition
 *  • Dark-mode aware header + progress
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../theme';
import type { PracticeBlock } from '../../types/curriculum';
import { QuizCard } from './QuizCard';
import { TrueFalseCard } from './TrueFalseCard';
import { OrderingCard } from './OrderingCard';
import { MatchingCard } from './MatchingCard';
import { FillBlankCard } from './FillBlankCard';
import { TapWordCard } from './TapWordCard';

interface Props {
    block: PracticeBlock;
    index: number;
    total: number;
    score: number;
    maxScore: number;
    onAnswer: (isCorrect: boolean, pointsEarned: number) => void;
}

export function PracticePhase({ block, index, total, score, maxScore, onAnswer }: Props) {
    const { brand, colors, typography, radius, isDark, shadows } = useTheme();

    const renderBlock = () => {
        switch (block.type) {
            case 'quiz':
                return <QuizCard block={block} onAnswer={onAnswer} />;
            case 'true-false':
                return <TrueFalseCard block={block} onAnswer={onAnswer} />;
            case 'ordering':
                return <OrderingCard block={block} onAnswer={onAnswer} />;
            case 'matching':
                return <MatchingCard block={block} onAnswer={onAnswer} />;
            case 'fill-blank':
                return <FillBlankCard block={block} onAnswer={onAnswer} />;
            case 'tap-word':
                return <TapWordCard block={block} onAnswer={onAnswer} />;
            default:
                return (
                    <View style={{ padding: 24 }}>
                        <Text style={[typography.body, { color: colors.textSecondary }]}>
                            Unknown practice type
                        </Text>
                    </View>
                );
        }
    };

    return (
        <View style={styles.container}>
            {/* ── Header ── */}
            <Animated.View entering={FadeIn.duration(350)} style={styles.header}>
                <View style={styles.headerLeft}>
                    <View
                        style={[
                            styles.iconCircle,
                            {
                                backgroundColor: brand.primary + '14',
                            },
                        ]}
                    >
                        <Ionicons name="school" size={15} color={brand.primary} />
                    </View>
                    <Text style={[typography.labelSmall, { color: colors.textSecondary }]}>
                        Question {index + 1} of {total}
                    </Text>
                </View>

                {/* Score badge */}
                <View
                    style={[
                        styles.scoreBadge,
                        {
                            backgroundColor: isDark
                                ? brand.accent + '20'
                                : brand.accent + '12',
                            borderRadius: radius.full,
                            ...shadows.subtle,
                        },
                    ]}
                >
                    <Ionicons name="star" size={13} color={brand.accent} />
                    <Text style={[typography.labelSmall, { color: brand.accent, fontWeight: '700' }]}>
                        {score}
                    </Text>
                    <Text style={[typography.labelXs, { color: brand.accent + '80' }]}>
                        /{maxScore}
                    </Text>
                </View>
            </Animated.View>

            {/* ── Segmented progress bar ── */}
            <Animated.View
                entering={FadeIn.delay(100).duration(350)}
                style={styles.segmentRow}
            >
                {Array.from({ length: total }).map((_, i) => (
                    <View
                        key={i}
                        style={[
                            styles.segment,
                            {
                                backgroundColor:
                                    i < index
                                        ? brand.primary
                                        : i === index
                                            ? brand.primary + '50'
                                            : isDark
                                                ? colors.surfaceTertiary
                                                : colors.backgroundTertiary,
                                borderRadius: 3,
                            },
                        ]}
                    />
                ))}
            </Animated.View>

            {/* ── Practice card ── */}
            <Animated.View
                key={`practice-${index}`}
                entering={FadeInDown.delay(150).duration(400)}
                style={styles.cardWrapper}
            >
                {renderBlock()}
            </Animated.View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 24,
        paddingTop: 16,
    },
    headerLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    iconCircle: {
        width: 30,
        height: 30,
        borderRadius: 15,
        alignItems: 'center',
        justifyContent: 'center',
    },
    scoreBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 3,
        paddingHorizontal: 12,
        paddingVertical: 6,
    },
    segmentRow: {
        flexDirection: 'row',
        gap: 4,
        paddingHorizontal: 24,
        marginTop: 14,
        marginBottom: 4,
    },
    segment: {
        flex: 1,
        height: 5,
    },
    cardWrapper: { flex: 1 },
});
