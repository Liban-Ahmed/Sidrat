/**
 * RewardPhase -- Celebration screen with trophy entrance, grade display,
 * animated score counter with star rating, confetti on lesson completion,
 * fun fact, bonus dua, and category-colored accents.
 *
 * Integrates AnimatedScoreDisplay (rolling counter + 1-3 star rating)
 * and ConfettiCelebration (particle confetti + star burst on perfect).
 */

import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import Animated, {
  FadeInDown,
  FadeInUp,
  FadeIn,
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withDelay,
} from 'react-native-reanimated';
import { AnimatedScoreDisplay } from './AnimatedScoreDisplay';
import { ConfettiCelebration } from './ConfettiCelebration';
import { FormattedText } from './FormattedText';
import { useTheme } from '../../theme';
import { haptics } from '../../utils/haptics';
import type { RewardConfig } from '../../types/curriculum';

interface Props {
  reward: RewardConfig;
  score: number;
  maxScore: number;
  correctCount: number;
  totalQuestions: number;
  xpEarned: number;
  onComplete: () => void;
  onDone: () => void;
  accentColor: string;
}

function getGrade(
  percent: number,
  brand: { primary: string; secondary: string; accent: string; coral: string },
  accentColor: string,
): { icon: string; label: string; color: string } {
  if (percent >= 90) return { icon: 'trophy', label: 'Perfect!', color: accentColor };
  if (percent >= 70) return { icon: 'star', label: 'Great Job!', color: brand.secondary };
  if (percent >= 50) return { icon: 'thumbs-up', label: 'Good Effort!', color: brand.primary };
  return { icon: 'refresh', label: 'Keep Trying!', color: brand.coral };
}

export function RewardPhase({
  reward,
  score,
  maxScore,
  correctCount,
  totalQuestions,
  xpEarned,
  onComplete,
  onDone,
  accentColor,
}: Props) {
  const { brand, colors, typography, radius, isDark, shadows } = useTheme();
  const percent = maxScore > 0 ? Math.round((score / maxScore) * 100) : 100;
  const grade = getGrade(percent, brand, accentColor);
  const isPerfect = percent >= 90;

  // Confetti state — show on mount, auto-dismiss after animation
  const [showConfetti, setShowConfetti] = useState(true);

  // Trophy spring entrance
  const trophyScale = useSharedValue(0);
  const hasCompleted = useRef(false);

  useEffect(() => {
    trophyScale.value = withDelay(200, withSpring(1, { damping: 12, stiffness: 80 }));

    haptics.medium();
    if (!hasCompleted.current) {
      hasCompleted.current = true;
      onComplete();
    }
  }, [trophyScale, onComplete]);

  const trophyStyle = useAnimatedStyle(() => ({
    transform: [{ scale: trophyScale.value }],
  }));

  return (
    <View style={{ flex: 1 }}>
      {/* Confetti overlay (Design Spec §3.3 / §5.1) */}
      <ConfettiCelebration
        visible={showConfetti}
        isPerfect={isPerfect}
        onComplete={() => setShowConfetti(false)}
      />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.container}>
          {/* Trophy */}
          <Animated.View style={[styles.trophyOuter, trophyStyle]}>
            <View style={[styles.trophyCircle, { backgroundColor: grade.color + '12' }]}>
              <Ionicons
                name={grade.icon as keyof typeof Ionicons.glyphMap}
                size={52}
                color={grade.color}
              />
            </View>
          </Animated.View>

          {/* Grade */}
          <Animated.View entering={FadeInDown.delay(500).duration(600)}>
            <Text style={[typography.largeTitle, { color: grade.color, textAlign: 'center' }]}>
              {grade.label}
            </Text>
          </Animated.View>

          {/* Message */}
          <Animated.View entering={FadeInDown.delay(600).duration(600)}>
            <FormattedText
              style={[
                typography.body,
                { color: colors.textSecondary, textAlign: 'center', marginTop: 6, lineHeight: 24 },
              ]}
            >
              {reward.message}
            </FormattedText>
          </Animated.View>

          {/* Animated score counter + star rating (replaces static stats pills) */}
          <AnimatedScoreDisplay
            score={score}
            maxScore={maxScore}
            correctCount={correctCount}
            totalQuestions={totalQuestions}
            xpEarned={xpEarned}
            accentColor={accentColor}
            startDelay={700}
          />

          {/* Fun fact */}
          {reward.funFact && (
            <Animated.View
              entering={FadeInDown.delay(800).duration(600)}
              style={[
                styles.funFactCard,
                {
                  backgroundColor: isDark ? brand.accent + '12' : brand.accent + '06',
                  borderRadius: radius.xl,
                  borderLeftWidth: 3,
                  borderLeftColor: brand.accent,
                },
              ]}
            >
              <View style={styles.funFactHeader}>
                <Ionicons name="bulb" size={16} color={brand.accent} />
                <Text style={[typography.label, { color: brand.accent }]}>Did You Know?</Text>
              </View>
              <FormattedText style={[typography.body, { color: colors.text, lineHeight: 24 }]}>
                {reward.funFact}
              </FormattedText>
            </Animated.View>
          )}

          {/* Bonus dua */}
          {reward.bonusDua && (
            <Animated.View
              entering={FadeIn.delay(900).duration(600)}
              style={[
                styles.duaCard,
                {
                  backgroundColor: isDark ? accentColor + '10' : accentColor + '05',
                  borderRadius: radius.xl,
                  borderWidth: 1,
                  borderColor: accentColor + (isDark ? '20' : '10'),
                  ...shadows.card,
                },
              ]}
            >
              <View style={styles.duaHeader}>
                <Ionicons name="moon" size={14} color={accentColor} />
                <Text style={[typography.label, { color: accentColor }]}>Bonus Du&apos;a</Text>
              </View>

              <Text style={[styles.arabicText, { color: colors.text }]}>
                {reward.bonusDua.arabic}
              </Text>

              <View style={[styles.separator, { backgroundColor: accentColor + '18' }]} />

              <Text
                style={[
                  typography.callout,
                  { color: accentColor, fontStyle: 'italic', textAlign: 'center' },
                ]}
              >
                {reward.bonusDua.transliteration}
              </Text>
              <Text
                style={[typography.bodySmall, { color: colors.textSecondary, textAlign: 'center' }]}
              >
                {reward.bonusDua.translation}
              </Text>
            </Animated.View>
          )}

          {/* Done button */}
          <Animated.View entering={FadeInUp.delay(1000).duration(600)} style={styles.buttonArea}>
            <Pressable
              onPress={() => {
                haptics.medium();
                onDone();
              }}
              style={({ pressed }) => [
                styles.doneButton,
                {
                  backgroundColor: accentColor,
                  borderRadius: radius.lg,
                  shadowColor: accentColor,
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: pressed ? 0.12 : 0.2,
                  shadowRadius: 10,
                  elevation: 4,
                  transform: [{ scale: pressed ? 0.97 : 1 }],
                },
              ]}
            >
              <Text style={[typography.headlineBold, { color: '#FFF' }]}>Continue</Text>
              <Ionicons name="arrow-forward" size={20} color="rgba(255,255,255,0.8)" />
            </Pressable>
          </Animated.View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  scrollContent: { paddingBottom: 48 },
  container: {
    paddingHorizontal: 24,
    paddingTop: 36,
    alignItems: 'center',
  },
  trophyOuter: {
    marginBottom: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  trophyCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statsPillRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 24,
    marginBottom: 24,
  },
  statPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  funFactCard: {
    width: '100%',
    padding: 18,
    gap: 10,
    marginBottom: 16,
  },
  funFactHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  duaCard: {
    width: '100%',
    padding: 22,
    alignItems: 'center',
    gap: 8,
    marginBottom: 24,
  },
  duaHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  arabicText: {
    fontSize: 26,
    lineHeight: 42,
    textAlign: 'center',
    fontWeight: '300',
    letterSpacing: 1,
  },
  separator: {
    width: '40%',
    height: 1,
    marginVertical: 2,
  },
  buttonArea: { width: '100%', marginTop: 8 },
  doneButton: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
});
