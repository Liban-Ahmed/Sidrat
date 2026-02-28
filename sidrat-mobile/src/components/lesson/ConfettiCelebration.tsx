/**
 * ConfettiCelebration — Full-screen confetti overlay for lesson completion.
 *
 * Per Design Spec §3.3: Perfect score triggers "Stars burst from center,
 * confetti from top" (1500ms). Uses react-native-reanimated particle
 * system since Lottie JSON assets aren't bundled yet.
 *
 * Per Design Spec §5.1: All correct → "⭐ Perfect — Barakallahu feek!"
 * with gold400 star burst + success notification × 2.
 *
 * Falls back to a pure Reanimated implementation — no external Lottie
 * JSON file required.
 */

import React, { useEffect, useMemo } from 'react';
import { StyleSheet, Dimensions } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  withSequence,
  withSpring,
  Easing,
  runOnJS,
  FadeIn,
  FadeOut,
} from 'react-native-reanimated';
import { brand } from '../../theme/colors';
import { haptics } from '../../utils/haptics';

const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get('window');

const CONFETTI_COLORS = [
  brand.accent, // Gold
  brand.accentLight, // Light gold
  brand.secondary, // Emerald
  brand.coral, // Coral
  brand.lavender, // Lavender
  '#FFD700', // Bright gold
  '#FFF4BD', // Pale gold
];

const PARTICLE_COUNT = 40;
const STAR_COUNT = 8;
const CELEBRATION_DURATION = 2000;

interface ConfettiPieceProps {
  index: number;
  color: string;
  startX: number;
  startDelay: number;
}

function ConfettiPiece({ index, color, startX, startDelay }: ConfettiPieceProps) {
  const translateY = useSharedValue(-20);
  const translateX = useSharedValue(startX);
  const rotate = useSharedValue(0);
  const opacity = useSharedValue(1);
  const scale = useSharedValue(0);

  const size = 6 + Math.random() * 6;
  const isRect = index % 3 !== 0;

  useEffect(() => {
    const drift = (Math.random() - 0.5) * 100;
    const fallDuration = 1400 + Math.random() * 600;
    const spinEnd = 360 * (1 + Math.random() * 2);

    scale.value = withDelay(startDelay, withSpring(1, { damping: 8, stiffness: 200 }));

    translateY.value = withDelay(
      startDelay,
      withTiming(SCREEN_H * 0.7 + Math.random() * SCREEN_H * 0.3, {
        duration: fallDuration,
        easing: Easing.in(Easing.quad),
      }),
    );

    translateX.value = withDelay(
      startDelay,
      withTiming(startX + drift, {
        duration: fallDuration,
        easing: Easing.inOut(Easing.sin),
      }),
    );

    rotate.value = withDelay(
      startDelay,
      withTiming(spinEnd, {
        duration: fallDuration,
        easing: Easing.linear,
      }),
    );

    opacity.value = withDelay(startDelay + fallDuration - 400, withTiming(0, { duration: 400 }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const style = useAnimatedStyle(() => ({
    position: 'absolute',
    top: 0,
    left: 0,
    width: isRect ? size : size * 0.7,
    height: isRect ? size * 0.5 : size * 0.7,
    borderRadius: isRect ? 1 : size,
    backgroundColor: color,
    opacity: opacity.value,
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { rotate: `${rotate.value}deg` },
      { scale: scale.value },
    ],
  }));

  return <Animated.View style={style} />;
}

interface StarBurstProps {
  index: number;
  delay: number;
}

function StarBurst({ index, delay }: StarBurstProps) {
  const scale = useSharedValue(0);
  const opacity = useSharedValue(1);
  const angle = (index * 360) / STAR_COUNT;
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const distance = 60 + Math.random() * 40;

  useEffect(() => {
    const rad = (angle * Math.PI) / 180;
    const targetX = Math.cos(rad) * distance;
    const targetY = Math.sin(rad) * distance;

    scale.value = withDelay(
      delay,
      withSequence(
        withSpring(1.2, { damping: 6, stiffness: 200 }),
        withSpring(0.8, { damping: 10, stiffness: 150 }),
      ),
    );

    translateX.value = withDelay(delay, withSpring(targetX, { damping: 14, stiffness: 80 }));
    translateY.value = withDelay(delay, withSpring(targetY, { damping: 14, stiffness: 80 }));

    opacity.value = withDelay(delay + 800, withTiming(0, { duration: 400 }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const style = useAnimatedStyle(() => ({
    position: 'absolute',
    opacity: opacity.value,
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { scale: scale.value },
    ],
  }));

  return (
    <Animated.View style={style}>
      <Animated.Text style={styles.star}>⭐</Animated.Text>
    </Animated.View>
  );
}

interface Props {
  /** Whether confetti is visible */
  visible: boolean;
  /** Whether this was a perfect score (triggers star burst) */
  isPerfect?: boolean;
  /** Called when animation completes */
  onComplete?: () => void;
}

export function ConfettiCelebration({ visible, isPerfect = false, onComplete }: Props) {
  const containerOpacity = useSharedValue(1);

  const particles = useMemo(
    () =>
      Array.from({ length: PARTICLE_COUNT }).map((_, i) => ({
        index: i,
        color: CONFETTI_COLORS[i % CONFETTI_COLORS.length]!,
        startX: Math.random() * SCREEN_W,
        startDelay: Math.random() * 300,
      })),
    [],
  );

  const stars = useMemo(
    () =>
      Array.from({ length: STAR_COUNT }).map((_, i) => ({
        index: i,
        delay: 100 + i * 60,
      })),
    [],
  );

  useEffect(() => {
    if (visible) {
      // Double success haptic for perfect (Design Spec §5.1)
      haptics.success();
      if (isPerfect) {
        setTimeout(() => haptics.success(), 200);
      }

      // Auto-dismiss
      const timer = setTimeout(() => {
        containerOpacity.value = withTiming(0, { duration: 400 }, (finished) => {
          if (finished && onComplete) {
            runOnJS(onComplete)();
          }
        });
      }, CELEBRATION_DURATION);

      return () => clearTimeout(timer);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible, isPerfect]);

  if (!visible) return null;

  return (
    <Animated.View
      entering={FadeIn.duration(100)}
      exiting={FadeOut.duration(300)}
      style={styles.overlay}
      pointerEvents="none"
    >
      {/* Confetti particles from top */}
      {particles.map((p) => (
        <ConfettiPiece key={p.index} {...p} />
      ))}

      {/* Star burst from center (only on perfect) */}
      {isPerfect && (
        <Animated.View style={styles.starBurstCenter}>
          {stars.map((s) => (
            <StarBurst key={s.index} {...s} />
          ))}
        </Animated.View>
      )}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 1000,
  },
  starBurstCenter: {
    position: 'absolute',
    top: SCREEN_H * 0.35,
    left: SCREEN_W * 0.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  star: {
    fontSize: 24,
  },
});
