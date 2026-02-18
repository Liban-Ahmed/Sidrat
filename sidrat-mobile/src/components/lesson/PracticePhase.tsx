/**
 * PracticePhase — Renders the appropriate practice card based on block type.
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../theme';
import type { PracticeBlock } from '../../types/curriculum';
import { QuizCard } from './QuizCard';
import { TrueFalseCard } from './TrueFalseCard';
import { OrderingCard } from './OrderingCard';
import { MatchingCard } from './MatchingCard';
import { FillBlankCard } from './FillBlankCard';

interface Props {
    block: PracticeBlock;
    index: number;
    total: number;
    score: number;
    maxScore: number;
    onAnswer: (isCorrect: boolean, pointsEarned: number) => void;
}

export function PracticePhase({ block, index, total, score, maxScore, onAnswer }: Props) {
    const { brand, colors, typography, radius } = useTheme();

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
            {/* Header */}
            <Animated.View entering={FadeIn.duration(400)} style={styles.header}>
                <View style={styles.headerLeft}>
                    <Ionicons name="school" size={18} color={brand.primary} />
                    <Text style={[typography.caption, { color: colors.textTertiary }]}>
                        Question {index + 1} of {total}
                    </Text>
                </View>

                {/* Score badge */}
                <View
                    style={[
                        styles.scoreBadge,
                        { backgroundColor: brand.accent + '15', borderRadius: radius.full },
                    ]}
                >
                    <Ionicons name="star" size={14} color={brand.accent} />
                    <Text style={[typography.captionBold, { color: brand.accent }]}>
                        {score}/{maxScore}
                    </Text>
                </View>
            </Animated.View>

            {/* Progress bar */}
            <View style={[styles.progressBar, { backgroundColor: colors.surfaceTertiary }]}>
                <Animated.View
                    style={[
                        styles.progressFill,
                        {
                            backgroundColor: brand.primary,
                            width: `${((index + 1) / total) * 100}%`,
                        },
                    ]}
                />
            </View>

            {/* Practice block */}
            {renderBlock()}
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
        gap: 6,
    },
    scoreBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        paddingHorizontal: 10,
        paddingVertical: 4,
    },
    progressBar: {
        height: 4,
        marginHorizontal: 24,
        marginTop: 12,
        borderRadius: 2,
        overflow: 'hidden',
    },
    progressFill: {
        height: '100%',
        borderRadius: 2,
    },
});
