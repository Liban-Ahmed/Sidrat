/**
 * PhaseTransition — Animated cross-fade wrapper for lesson phase content.
 *
 * Per Design Spec §3.4: Phase transitions use cross-fade with slight
 * upward slide (300ms) using spring physics (gentle config).
 * Haptic light feedback on each phase change.
 */

import React, { useEffect } from 'react';
import { StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { springs, timing } from '../../theme/spacing';
import haptic from '../../utils/haptics';

interface Props {
  /** Unique key for the current phase — triggers re-animation on change */
  phaseKey: string;
  children: React.ReactNode;
}

export function PhaseTransition({ phaseKey, children }: Props) {
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(16);

  useEffect(() => {
    // Reset values for incoming phase
    opacity.value = 0;
    translateY.value = 16;

    // Animate in: cross-fade + slight upward slide with spring
    opacity.value = withTiming(1, {
      duration: timing.moderate,
      easing: Easing.out(Easing.ease),
    });
    translateY.value = withSpring(0, springs.gentle);

    // Haptic light on phase transition (Design Spec §2)
    haptic.light();
  }, [phaseKey, opacity, translateY]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));

  return <Animated.View style={[styles.container, animatedStyle]}>{children}</Animated.View>;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
