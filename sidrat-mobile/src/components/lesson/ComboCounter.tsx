/**
 * ComboCounter — Barakah Multiplier visual (Design Spec §5.1)
 *
 * Shows an animated flame + count when the player has ≥ 2 consecutive
 * correct answers. Escalates visual intensity at thresholds 2, 3, 5+.
 *
 * - 2 correct: flame icon + "🔥 2", scale bounce
 * - 3 correct: gold400 text pulses — "🔥 3 — Mashallah!"
 * - 5 correct: "🔥 5 — Barakah Multiplier active!", gold300 edge glow
 * - All correct (perfect): handled externally (star burst Lottie in RewardPhase)
 *
 * On wrong answer: combo resets to 0 and this component unmounts (no
 * negative visual — the combo simply fades out).
 */

import React, { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, {
  Easing,
  FadeIn,
  FadeOut,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { tokens, SPRINGS } from '../../theme/tokens';

// ── Props ────────────────────────────────────────────────────────

interface ComboCounterProps {
  /** Current consecutive correct-answer count */
  comboCount: number;
  /** Current Barakah Multiplier (×1 / ×1.5 / ×2) */
  multiplier: number;
}

// ── Thresholds ───────────────────────────────────────────────────

const COMBO_SHOW = 2; // Show at 2+ correct
const COMBO_MID = 3; // Mashallah label
const COMBO_HIGH = 5; // Barakah Multiplier active

// ── Component ────────────────────────────────────────────────────

export function ComboCounter({ comboCount, multiplier }: ComboCounterProps) {
  // Only render when combo ≥ 2
  if (comboCount < COMBO_SHOW) return null;

  const isHigh = comboCount >= COMBO_HIGH;
  const isMid = comboCount >= COMBO_MID;

  return (
    <Animated.View
      entering={FadeIn.duration(250)}
      exiting={FadeOut.duration(200)}
      style={styles.wrapper}
      pointerEvents="none"
    >
      <ComboBody comboCount={comboCount} isMid={isMid} isHigh={isHigh} />
      {isMid && <ComboLabel comboCount={comboCount} isHigh={isHigh} multiplier={multiplier} />}
    </Animated.View>
  );
}

// ── Animated count body ──────────────────────────────────────────

function ComboBody({
  comboCount,
  isMid,
  isHigh,
}: {
  comboCount: number;
  isMid: boolean;
  isHigh: boolean;
}) {
  const scale = useSharedValue(1);
  const pulseOpacity = useSharedValue(1);

  // Bounce on every combo increment
  useEffect(() => {
    scale.value = withSpring(1, SPRINGS.bouncy, () => {
      // Intentionally set start value below 1 so the spring overshoots
    });
    // Kick off the spring from a smaller value
    scale.value = 0.6;
    scale.value = withSpring(1, SPRINGS.bouncy);
  }, [comboCount, scale]);

  // At 3+ combo, add a gentle pulsing glow
  useEffect(() => {
    if (isMid) {
      pulseOpacity.value = withRepeat(
        withSequence(
          withTiming(0.6, { duration: 600, easing: Easing.inOut(Easing.ease) }),
          withTiming(1, { duration: 600, easing: Easing.inOut(Easing.ease) }),
        ),
        -1,
        true,
      );
    } else {
      pulseOpacity.value = 1;
    }
  }, [isMid, pulseOpacity]);

  const bodyStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const glowStyle = useAnimatedStyle(() => ({
    opacity: pulseOpacity.value,
  }));

  return (
    <View style={styles.bodyRow}>
      {/* Gold glow behind the count (visible at 3+) */}
      {isMid && (
        <Animated.View
          style={[
            styles.countGlow,
            {
              backgroundColor: isHigh ? tokens.color.gold300 : tokens.color.gold400,
            },
            glowStyle,
          ]}
        />
      )}

      <Animated.View style={[styles.countContainer, bodyStyle]}>
        <Text style={styles.flameEmoji}>🔥</Text>
        <Text
          style={[
            styles.countText,
            {
              color: isHigh ? tokens.color.gold400 : tokens.color.gold500,
              fontSize: isHigh ? 32 : 26,
            },
          ]}
        >
          {comboCount}
        </Text>
      </Animated.View>
    </View>
  );
}

// ── Label (Mashallah / Barakah Multiplier) ───────────────────────

function ComboLabel({
  isHigh,
  multiplier,
}: {
  comboCount: number;
  isHigh: boolean;
  multiplier: number;
}) {
  const labelText = isHigh ? `Barakah Multiplier ×${multiplier}` : 'Mashallah!';

  return (
    <Animated.View entering={FadeIn.delay(100).duration(200)} style={styles.labelContainer}>
      <Text
        style={[
          styles.labelText,
          {
            color: isHigh ? tokens.color.gold400 : tokens.color.gold500,
          },
        ]}
      >
        {labelText}
      </Text>
    </Animated.View>
  );
}

// ── Edge Glow (renders at combo ≥ 5) ────────────────────────────

interface EdgeGlowProps {
  comboCount: number;
}

/**
 * Gold border glow overlay, rendered as a child of the practice container.
 * Uses animated opacity to pulse gently.
 */
export function ComboEdgeGlow({ comboCount }: EdgeGlowProps) {
  const opacity = useSharedValue(0);

  useEffect(() => {
    if (comboCount >= COMBO_HIGH) {
      opacity.value = withRepeat(
        withSequence(
          withTiming(0.45, { duration: 800, easing: Easing.inOut(Easing.ease) }),
          withTiming(0.15, { duration: 800, easing: Easing.inOut(Easing.ease) }),
        ),
        -1,
        true,
      );
    } else {
      opacity.value = withTiming(0, { duration: 300 });
    }
  }, [comboCount, opacity]);

  const glowAnimStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  if (comboCount < COMBO_HIGH) return null;

  return (
    <Animated.View
      pointerEvents="none"
      style={[StyleSheet.absoluteFill, styles.edgeGlow, glowAnimStyle]}
    />
  );
}

// ── Styles ───────────────────────────────────────────────────────

const styles = StyleSheet.create({
  wrapper: {
    alignItems: 'center',
    paddingTop: 4,
    paddingBottom: 2,
    zIndex: 10,
  },

  // ── Count ──
  bodyRow: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  countGlow: {
    position: 'absolute',
    width: 64,
    height: 64,
    borderRadius: 32,
    // Intentionally large + blurred to act as a soft glow
    transform: [{ scale: 1.5 }],
    opacity: 0.25,
  },
  countContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  flameEmoji: {
    fontSize: 22,
  },
  countText: {
    fontFamily: 'ReemKufi-Bold',
    fontWeight: '700',
    includeFontPadding: false,
  },

  // ── Label ──
  labelContainer: {
    marginTop: 2,
  },
  labelText: {
    fontFamily: 'Nunito-Bold',
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 0.2,
    textAlign: 'center',
  },

  // ── Edge Glow ──
  edgeGlow: {
    borderWidth: 3,
    borderColor: tokens.color.gold300,
    borderRadius: 24,
    // Soft outer shadow glow
    shadowColor: tokens.color.gold300,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 16,
    elevation: 8,
  },
});
