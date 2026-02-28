/**
 * ProgressBar — animated horizontal progress with glow and milestone markers.
 *
 * Features:
 *  • Smooth animated fill via Reanimated
 *  • Optional pulsing glow on the fill tip
 *  • Optional milestone markers (e.g., at 25%, 50%, 75%)
 *  • Rounded pill shape
 */

import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withRepeat,
  withSequence,
  Easing,
} from 'react-native-reanimated';
import { useTheme } from '../theme';

interface ProgressBarProps {
  progress: number; // 0..1
  color: string;
  trackColor?: string;
  height?: number;
  /** Show a gentle glow pulse on the fill tip */
  glow?: boolean;
  /** Milestone positions (0..1) to show small dots */
  milestones?: number[];
}

export function ProgressBar({
  progress,
  color,
  trackColor,
  height = 8,
  glow = false,
  milestones,
}: ProgressBarProps) {
  const { colors, isDark } = useTheme();
  const track = trackColor ?? (isDark ? color + '18' : color + '12');
  const fillWidth = useSharedValue(0);

  useEffect(() => {
    fillWidth.value = withTiming(Math.min(Math.max(progress, 0), 1), {
      duration: 900,
      easing: Easing.out(Easing.cubic),
    });
  }, [progress, fillWidth]);

  const fillStyle = useAnimatedStyle(() => ({
    width: `${fillWidth.value * 100}%` as any,
  }));

  // Glow pulse on the tip
  const glowOpacity = useSharedValue(0.6);
  useEffect(() => {
    if (glow) {
      glowOpacity.value = withRepeat(
        withSequence(withTiming(1, { duration: 800 }), withTiming(0.4, { duration: 800 })),
        -1,
        true,
      );
    }
  }, [glow, glowOpacity]);

  const glowStyle = useAnimatedStyle(() => ({
    opacity: glowOpacity.value,
  }));

  return (
    <View
      style={[
        styles.track,
        {
          height,
          borderRadius: height / 2,
          backgroundColor: track,
        },
      ]}
      accessible
      accessibilityRole="progressbar"
      accessibilityValue={{ min: 0, max: 100, now: Math.round(progress * 100) }}
    >
      <Animated.View
        style={[
          styles.fill,
          {
            height,
            borderRadius: height / 2,
            backgroundColor: color,
          },
          fillStyle,
        ]}
      >
        {glow && (
          <Animated.View
            style={[
              styles.glowDot,
              {
                width: height + 4,
                height: height + 4,
                borderRadius: (height + 4) / 2,
                backgroundColor: color,
                right: -2,
              },
              glowStyle,
            ]}
          />
        )}
      </Animated.View>

      {/* Milestone dots */}
      {milestones?.map((m) => (
        <View
          key={m}
          style={[
            styles.milestone,
            {
              left: `${m * 100}%` as any,
              width: height * 0.5,
              height: height * 0.5,
              borderRadius: height * 0.25,
              backgroundColor: progress >= m ? '#FFFFFF' : colors.textTertiary + '40',
            },
          ]}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    overflow: 'hidden',
    position: 'relative',
  },
  fill: {
    position: 'absolute',
    left: 0,
    top: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  glowDot: {
    position: 'absolute',
  },
  milestone: {
    position: 'absolute',
    top: '50%',
    marginTop: -2,
    marginLeft: -2,
  },
});
