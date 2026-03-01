/**
 * ShimmerBlock — Shared animated skeleton placeholder block.
 *
 * A single shimmering rectangle used to compose per-screen skeleton loaders.
 */

import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  Easing,
  interpolate,
} from 'react-native-reanimated';
import { useTheme } from '../../theme';
import { tokens } from '../../theme/tokens';

interface ShimmerBlockProps {
  width: number | `${number}%`;
  height: number;
  borderRadius?: number;
  style?: object;
}

export function ShimmerBlock({ width, height, borderRadius = 8, style }: ShimmerBlockProps) {
  const { isDark } = useTheme();
  const shimmerProgress = useSharedValue(0);

  useEffect(() => {
    shimmerProgress.value = withRepeat(
      withTiming(1, { duration: 1200, easing: Easing.inOut(Easing.ease) }),
      -1,
      false,
    );
  }, [shimmerProgress]);

  const shimmerStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: interpolate(shimmerProgress.value, [0, 1], [-200, 200]) }],
  }));

  const baseColor = isDark ? tokens.color.earth700 + '40' : tokens.color.sand100;
  const shimmerColor = isDark ? tokens.color.earth700 + '80' : tokens.color.sand200;

  return (
    <View
      style={[
        { width, height, borderRadius, backgroundColor: baseColor, overflow: 'hidden' },
        style,
      ]}
    >
      <Animated.View style={[StyleSheet.absoluteFill, shimmerStyle]}>
        <LinearGradient
          colors={['transparent', shimmerColor, 'transparent']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={[StyleSheet.absoluteFill, { width: 200 }]}
        />
      </Animated.View>
    </View>
  );
}
