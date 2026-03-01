/**
 * PracticePhase -- Orchestrates practice cards with category-colored
 * progress bar and score tracking.
 */

import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import { FillBlankCard } from './FillBlankCard';
import { MatchingCard } from './MatchingCard';
import { OrderingCard } from './OrderingCard';
import { QuizCard } from './QuizCard';
import { TapWordCard } from './TapWordCard';
import { TrueFalseCard } from './TrueFalseCard';
import { useTheme } from '../../theme';
import type { PracticeBlock } from '../../types/curriculum';

interface Props {
  block: PracticeBlock;
  index: number;
  total: number;
  score: number;
  maxScore: number;
  onAnswer: (isCorrect: boolean, pointsEarned: number) => void;
  accentColor: string;
}

export function PracticePhase({
  block,
  index,
  total,
  score,
  maxScore,
  onAnswer,
  accentColor,
}: Props) {
  const { colors, typography, radius, isDark, shadows } = useTheme();

  const renderBlock = () => {
    switch (block.type) {
      case 'quiz':
        return <QuizCard block={block} onAnswer={onAnswer} />;
      case 'true-false':
        return <TrueFalseCard block={block} onAnswer={onAnswer} accentColor={accentColor} />;
      case 'ordering':
        return <OrderingCard block={block} onAnswer={onAnswer} accentColor={accentColor} />;
      case 'matching':
        return <MatchingCard block={block} onAnswer={onAnswer} accentColor={accentColor} />;
      case 'fill-blank':
        return <FillBlankCard block={block} onAnswer={onAnswer} accentColor={accentColor} />;
      case 'tap-word':
        return <TapWordCard block={block} onAnswer={onAnswer} accentColor={accentColor} />;
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
      <Animated.View entering={FadeIn.duration(350)} style={styles.header}>
        <Text style={[typography.labelSmall, { color: colors.textSecondary }]}>
          Question {index + 1} of {total}
        </Text>

        <View
          style={[
            styles.scoreBadge,
            {
              backgroundColor: isDark ? accentColor + '20' : accentColor + '10',
              borderRadius: radius.full,
              ...shadows.subtle,
            },
          ]}
        >
          <Ionicons name="star" size={13} color={accentColor} />
          <Text style={[typography.labelSmall, { color: accentColor, fontWeight: '700' }]}>
            {score}
          </Text>
          <Text style={[typography.labelXs, { color: accentColor + '80' }]}>/{maxScore}</Text>
        </View>
      </Animated.View>

      {/* Segmented progress bar */}
      <Animated.View entering={FadeIn.delay(100).duration(350)} style={styles.segmentRow}>
        {Array.from({ length: total }).map((_, i) => (
          <View
            key={i}
            style={[
              styles.segment,
              {
                backgroundColor:
                  i < index
                    ? accentColor
                    : i === index
                      ? accentColor + '50'
                      : isDark
                        ? colors.surfaceTertiary
                        : colors.backgroundTertiary,
                borderRadius: 3,
              },
            ]}
          />
        ))}
      </Animated.View>

      {/* Practice card */}
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
