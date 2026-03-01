/**
 * AnimatedScoreDisplay — Animated counter + star rating for lesson completion.
 *
 * Per PRD §2.7: "Improve score display with animated counter, star rating
 * (1-3 stars based on %)."
 *
 * Per Design Spec §3.3: Lesson complete → score counter rolls up (0→score),
 * then 1–3 stars light up sequentially (400ms each).
 *
 * Star rating thresholds:
 *   ★★★ = 90%+  (Perfect / Mashallah!)
 *   ★★  = 70%+  (Great Job!)
 *   ★   = < 70% (Good Effort — keep going!)
 *
 * Per Design Spec §6.4: Stars use gold400 (#FBBF24) filled, sand200 empty.
 * We use brand.accent (gold) and palette sand tones.
 */

import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  withSpring,
  withSequence,
  Easing,
  FadeInDown,
} from 'react-native-reanimated';
import { useTheme } from '../../theme';
import haptic from '../../utils/haptics';

interface Props {
  /** Final score value */
  score: number;
  /** Maximum possible score */
  maxScore: number;
  /** Number of correct answers */
  correctCount: number;
  /** Total number of questions */
  totalQuestions: number;
  /** Hasanat / XP earned */
  xpEarned: number;
  /** Accent color from the lesson category */
  accentColor: string;
  /** Delay before starting the animation (ms) */
  startDelay?: number;
}

function getStarCount(percent: number): number {
  if (percent >= 90) return 3;
  if (percent >= 70) return 2;
  return 1;
}

function AnimatedStar({
  filled,
  delay,
  accentColor,
  emptyColor,
}: {
  index: number;
  filled: boolean;
  delay: number;
  accentColor: string;
  emptyColor: string;
}) {
  const scale = useSharedValue(filled ? 0 : 1);
  const opacity = useSharedValue(filled ? 0.3 : 0.3);
  const rotation = useSharedValue(0);

  useEffect(() => {
    if (filled) {
      // Star lights up: scale 0 → 1.3 → 1.0 with spring bounce
      scale.value = withDelay(
        delay,
        withSequence(
          withSpring(1.35, { damping: 6, stiffness: 180, mass: 0.5 }),
          withSpring(1, { damping: 10, stiffness: 120 }),
        ),
      );

      opacity.value = withDelay(
        delay,
        withTiming(1, { duration: 200, easing: Easing.out(Easing.ease) }),
      );

      // Subtle wobble
      rotation.value = withDelay(
        delay,
        withSequence(
          withTiming(-8, { duration: 80 }),
          withSpring(0, { damping: 8, stiffness: 200 }),
        ),
      );

      // Haptic on each star
      const hapticTimer = setTimeout(() => haptic.medium(), delay);
      return () => clearTimeout(hapticTimer);
    }
  }, [filled, delay, scale, opacity, rotation]);

  const starStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }, { rotate: `${rotation.value}deg` }],
    opacity: opacity.value,
  }));

  return (
    <Animated.View style={[styles.starContainer, starStyle]}>
      <Ionicons
        name={filled ? 'star' : 'star-outline'}
        size={40}
        color={filled ? accentColor : emptyColor}
      />
    </Animated.View>
  );
}

export function AnimatedScoreDisplay({
  score,
  maxScore,
  correctCount,
  totalQuestions,
  xpEarned,
  accentColor,
  startDelay = 400,
}: Props) {
  const { brand: themeBrand, colors, typography, radius, isDark, shadows } = useTheme();
  const percent = maxScore > 0 ? Math.round((score / maxScore) * 100) : 100;
  const starCount = getStarCount(percent);

  // Animated counter: rolls from 0 → percent
  const [displayPercent, setDisplayPercent] = useState(0);

  useEffect(() => {
    // Simple JS interval-based counter (more reliable for text display)
    const duration = 1200;
    const startTime = Date.now() + startDelay;
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      if (elapsed < 0) return;
      const progress = Math.min(elapsed / duration, 1);
      // Ease-out curve
      const eased = 1 - Math.pow(1 - progress, 3);
      const currentVal = Math.round(eased * percent);
      setDisplayPercent(currentVal);
      if (progress >= 1) {
        clearInterval(interval);
        setDisplayPercent(percent);
      }
    }, 16);

    return () => clearInterval(interval);
  }, [percent, startDelay]);

  // Determine star fill delays: sequential 400ms each, after counter finishes
  const starBaseDelay = startDelay + 1300;
  const STAR_STAGGER = 400;

  return (
    <Animated.View entering={FadeInDown.delay(startDelay).duration(500)} style={styles.container}>
      {/* Animated percentage counter */}
      <View style={styles.counterArea}>
        <Text style={[styles.percentNumber, { color: accentColor }]}>{displayPercent}</Text>
        <Text style={[styles.percentSign, { color: accentColor + '80' }]}>%</Text>
      </View>

      {/* Star rating row */}
      <View style={styles.starsRow}>
        {[0, 1, 2].map((i) => (
          <AnimatedStar
            key={i}
            index={i}
            filled={i < starCount}
            delay={starBaseDelay + i * STAR_STAGGER}
            accentColor={themeBrand.accent}
            emptyColor={isDark ? colors.surfaceTertiary : colors.backgroundTertiary}
          />
        ))}
      </View>

      {/* Stats pills beneath stars */}
      <Animated.View
        entering={FadeInDown.delay(starBaseDelay + 3 * STAR_STAGGER).duration(500)}
        style={styles.statsRow}
      >
        {/* Correct count */}
        <View
          style={[
            styles.statPill,
            {
              backgroundColor: isDark ? colors.surfaceSecondary : colors.surface,
              borderRadius: radius.full,
              ...shadows.subtle,
            },
          ]}
        >
          <Ionicons name="checkmark-done" size={14} color={themeBrand.secondary} />
          <Text style={[typography.labelSmall, { color: themeBrand.secondary }]}>
            {correctCount}/{totalQuestions}
          </Text>
        </View>

        {/* Hasanat earned */}
        <View
          style={[
            styles.statPill,
            {
              backgroundColor: isDark ? colors.surfaceSecondary : colors.surface,
              borderRadius: radius.full,
              ...shadows.subtle,
            },
          ]}
        >
          <Ionicons name="flash" size={14} color={themeBrand.accent} />
          <Text style={[typography.labelSmall, { color: themeBrand.accent }]}>
            +{xpEarned} Hasanat
          </Text>
        </View>
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  counterArea: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: 16,
  },
  percentNumber: {
    fontSize: 64,
    fontWeight: '800',
    letterSpacing: -2,
    lineHeight: 72,
  },
  percentSign: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 8,
    marginLeft: 2,
  },
  starsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 20,
  },
  starContainer: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  statPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
});
