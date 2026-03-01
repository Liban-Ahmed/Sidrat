/**
 * MatchingCard — Two-column tap-to-match with themed feedback,
 * haptic response, and polished visual states.
 *
 * Features:
 *  • Theme-token success/error colors (no hardcoded hex)
 *  • Haptic feedback on selection and match
 *  • Selected item highlight with colored left border
 *  • ZoomIn checkmark on matched pairs
 *  • Subtle shadow on items + dark mode aware
 *  • Explanation with accent left-border card
 */

import { Ionicons } from '@expo/vector-icons';
import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import Animated, { FadeInDown, ZoomIn } from 'react-native-reanimated';
import { FeedbackCard } from './FeedbackCard';
import { FormattedText } from './FormattedText';
import { useTheme } from '../../theme';
import haptic from '../../utils/haptics';
import type { PracticeMatching } from '../../types/curriculum';

interface Props {
  block: PracticeMatching;
  onAnswer: (isCorrect: boolean, pointsEarned: number) => void;
  accentColor: string;
}

export function MatchingCard({ block, onAnswer, accentColor }: Props) {
  const { brand, colors, typography, radius, isDark, shadows } = useTheme();

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
      haptic.light();
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
        haptic.medium();
        const newMatched = new Map(matched);
        newMatched.set(selectedLeft, right);
        setMatched(newMatched);
        setSelectedLeft(null);
        setWrongPair(null);

        if (newMatched.size === block.pairs.length) {
          setTimeout(() => onAnswer(true, block.points), 800);
        }
      } else {
        haptic.light();
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
      {/* ── Instruction ── */}
      <Animated.View entering={FadeInDown.delay(100).duration(500)}>
        <FormattedText style={[typography.title3, { color: colors.text, marginBottom: 20 }]}>
          {block.instruction}
        </FormattedText>
      </Animated.View>

      {/* ── Matching columns ── */}
      <View style={styles.columns}>
        {/* Left column */}
        <View style={styles.column}>
          {block.pairs.map((pair, i) => {
            const isMatched = matched.has(pair.left);
            const isSelected = selectedLeft === pair.left;
            const isWrong = wrongPair?.left === pair.left;

            let bg: string = isDark ? colors.surfaceSecondary : colors.surface;
            let border: string = isDark ? colors.surfaceTertiary : colors.separator;
            let textColor: string = colors.text;

            if (isMatched) {
              bg = colors.successMuted;
              border = colors.success;
              textColor = colors.success;
            } else if (isWrong) {
              bg = colors.errorMuted;
              border = colors.error;
              textColor = colors.error;
            } else if (isSelected) {
              bg = accentColor + '12';
              border = accentColor;
              textColor = accentColor;
            }

            return (
              <Animated.View
                key={pair.left}
                entering={FadeInDown.delay(200 + i * 80).duration(400)}
              >
                <Pressable
                  onPress={() => handleLeftTap(pair.left)}
                  disabled={isMatched}
                  style={({ pressed }) => [
                    styles.matchItem,
                    {
                      backgroundColor: bg,
                      borderColor: border,
                      borderRadius: radius.md,
                      borderLeftWidth: isSelected || isMatched ? 3 : 1.5,
                      borderLeftColor: isMatched
                        ? colors.success
                        : isSelected
                          ? accentColor
                          : border,
                      ...shadows.subtle,
                      transform: [{ scale: pressed ? 0.97 : 1 }],
                    },
                  ]}
                >
                  <Text
                    style={[
                      typography.callout,
                      {
                        color: textColor,
                        fontWeight: isSelected ? '600' : '400',
                        flex: 1,
                      },
                    ]}
                  >
                    {pair.left}
                  </Text>
                  {isMatched && (
                    <Animated.View entering={ZoomIn.duration(200)}>
                      <Ionicons name="checkmark-circle" size={16} color={colors.success} />
                    </Animated.View>
                  )}
                </Pressable>
              </Animated.View>
            );
          })}
        </View>

        {/* Connection indicator */}
        <View style={styles.connectorCol}>
          {block.pairs.map((_, i) => (
            <View
              key={i}
              style={[
                styles.connectorDot,
                {
                  backgroundColor: matched.size > i ? colors.success : colors.textTertiary + '30',
                },
              ]}
            />
          ))}
        </View>

        {/* Right column */}
        <View style={styles.column}>
          {shuffledRight.map((right, i) => {
            const isMatched = [...matched.values()].includes(right);
            const isWrong = wrongPair?.right === right;

            let bg: string = isDark ? colors.surfaceSecondary : colors.surface;
            let border: string = isDark ? colors.surfaceTertiary : colors.separator;
            let textColor: string = colors.text;

            if (isMatched) {
              bg = colors.successMuted;
              border = colors.success;
              textColor = colors.success;
            } else if (isWrong) {
              bg = colors.errorMuted;
              border = colors.error;
              textColor = colors.error;
            }

            return (
              <Animated.View key={right} entering={FadeInDown.delay(300 + i * 80).duration(400)}>
                <Pressable
                  onPress={() => handleRightTap(right)}
                  disabled={isMatched || !selectedLeft}
                  style={({ pressed }) => [
                    styles.matchItem,
                    {
                      backgroundColor: bg,
                      borderColor: border,
                      borderRadius: radius.md,
                      opacity: !selectedLeft && !isMatched ? 0.5 : 1,
                      ...shadows.subtle,
                      transform: [{ scale: pressed ? 0.97 : 1 }],
                    },
                  ]}
                >
                  <Text style={[typography.callout, { color: textColor, flex: 1 }]}>{right}</Text>
                  {isMatched && (
                    <Animated.View entering={ZoomIn.duration(200)}>
                      <Ionicons name="checkmark-circle" size={16} color={colors.success} />
                    </Animated.View>
                  )}
                </Pressable>
              </Animated.View>
            );
          })}
        </View>
      </View>

      {allMatched && block.explanation && (
        <FeedbackCard type="success" delay={400} useFormatted>
          {block.explanation}
        </FeedbackCard>
      )}

      {/* ── Helper text ── */}
      {!allMatched && !selectedLeft && (
        <View style={styles.helperRow}>
          <Ionicons name="hand-left-outline" size={14} color={colors.textTertiary} />
          <Text style={[typography.bodySmall, { color: colors.textTertiary }]}>
            Tap left, then tap its match on the right
          </Text>
        </View>
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
    gap: 8,
  },
  column: {
    flex: 1,
    gap: 10,
  },
  connectorCol: {
    width: 16,
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingVertical: 8,
  },
  connectorDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  matchItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    borderWidth: 1.5,
    minHeight: 50,
  },
  helperRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginTop: 18,
  },
});
