/**
 * ThinkingCountdown — 3-second "Get Ready" prompt before practice phase.
 *
 * Per PRD §2.7: "thinking time" prompt before practice (3-second countdown).
 * Per Design Spec §3: Spring physics for all animations.
 * Per Design Spec §2: Haptic light on each countdown tick.
 *
 * Shows 3… 2… 1… with category-colored accent, then auto-advances.
 */

import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withSequence,
  withTiming,
  withDelay,
  Easing,
  FadeIn,
  FadeOut,
} from 'react-native-reanimated';
import { useTheme } from '../../theme';
import { haptics } from '../../utils/haptics';

interface Props {
  /** Called when countdown finishes */
  onComplete: () => void;
  /** Category accent color for styling */
  accentColor: string;
}

export function ThinkingCountdown({ onComplete, accentColor }: Props) {
  const { colors, typography } = useTheme();
  const [count, setCount] = useState(3);
  const scale = useSharedValue(0.5);
  const opacity = useSharedValue(0);

  // Animate each number: scale in from 0.5 → 1.1 → 1.0 (spring bounce)
  useEffect(() => {
    scale.value = 0.5;
    opacity.value = 0;

    scale.value = withSequence(
      withSpring(1.15, { damping: 8, stiffness: 200, mass: 0.6 }),
      withSpring(1, { damping: 12, stiffness: 150 }),
    );

    opacity.value = withTiming(1, { duration: 150, easing: Easing.out(Easing.ease) });

    // Haptic tick for each number
    haptics.light();
  }, [count, scale, opacity]);

  useEffect(() => {
    if (count <= 0) {
      haptics.medium();
      onComplete();
      return;
    }

    const timer = setTimeout(() => {
      // Fade out current number
      opacity.value = withTiming(0, { duration: 150 }, () => {});
      setTimeout(() => setCount((c) => c - 1), 150);
    }, 850);

    return () => clearTimeout(timer);
  }, [count, onComplete, opacity]);

  const numberStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  // Pulsing ring behind the number
  const ringScale = useSharedValue(0.8);
  const ringOpacity = useSharedValue(0);

  useEffect(() => {
    ringScale.value = 0.8;
    ringOpacity.value = 0;

    ringScale.value = withSpring(1.4, { damping: 12, stiffness: 60 });
    ringOpacity.value = withSequence(
      withTiming(0.3, { duration: 200 }),
      withDelay(400, withTiming(0, { duration: 300 })),
    );
  }, [count, ringScale, ringOpacity]);

  const ringStyle = useAnimatedStyle(() => ({
    transform: [{ scale: ringScale.value }],
    opacity: ringOpacity.value,
  }));

  if (count <= 0) return null;

  return (
    <Animated.View
      entering={FadeIn.duration(200)}
      exiting={FadeOut.duration(200)}
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <View style={styles.center}>
        {/* Pulsing ring */}
        <Animated.View
          style={[
            styles.ring,
            {
              borderColor: accentColor,
              borderRadius: 70,
            },
            ringStyle,
          ]}
        />

        {/* Countdown number */}
        <Animated.View style={numberStyle}>
          <Text style={[styles.number, { color: accentColor }]}>{count}</Text>
        </Animated.View>
      </View>

      {/* "Get Ready" label */}
      <Animated.View entering={FadeIn.delay(100).duration(400)}>
        <Text style={[typography.title3, { color: colors.textSecondary, textAlign: 'center' }]}>
          Get Ready!
        </Text>
        <Text
          style={[
            typography.bodySmall,
            { color: colors.textTertiary, textAlign: 'center', marginTop: 8 },
          ]}
        >
          Practice is about to begin
        </Text>
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 60,
  },
  center: {
    width: 140,
    height: 140,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 32,
  },
  ring: {
    position: 'absolute',
    width: 140,
    height: 140,
    borderWidth: 3,
  },
  number: {
    fontSize: 72,
    fontWeight: '800',
    letterSpacing: -2,
  },
});
