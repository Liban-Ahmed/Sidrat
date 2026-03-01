/**
 * ScalePress — spring-animated pressable wrapper with haptic feedback.
 *
 * Provides premium tactile press-feedback across the app.
 * Uses tuned spring physics for a bouncy, responsive feel.
 */

import React from 'react';
import { Pressable, type ViewStyle, type StyleProp } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import hapticService from '../utils/haptics';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const SPRING_PRESS = { damping: 15, stiffness: 200, mass: 0.7 };
const SPRING_RELEASE = { damping: 20, stiffness: 300, mass: 0.8 };

interface ScalePressProps {
  children: React.ReactNode;
  onPress?: () => void;
  onLongPress?: () => void;
  style?: StyleProp<ViewStyle>;
  /** Scale factor when pressed (default 0.95) */
  pressScale?: number;
  /** Trigger haptic on press */
  haptic?: boolean;
  disabled?: boolean;
  accessibilityRole?: 'button' | 'link' | 'none';
  accessibilityLabel?: string;
}

export function ScalePress({
  children,
  onPress,
  onLongPress,
  style,
  pressScale = 0.95,
  haptic = false,
  disabled = false,
  accessibilityRole = 'button',
  accessibilityLabel,
}: ScalePressProps) {
  const scale = useSharedValue(1);
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePress = () => {
    if (haptic) hapticService.light();
    onPress?.();
  };

  return (
    <AnimatedPressable
      onPressIn={() => {
        scale.value = withSpring(pressScale, SPRING_PRESS);
      }}
      onPressOut={() => {
        scale.value = withSpring(1, SPRING_RELEASE);
      }}
      onPress={handlePress}
      onLongPress={onLongPress}
      disabled={disabled}
      style={[animatedStyle, style, disabled && { opacity: 0.5 }]}
      accessibilityRole={accessibilityRole}
      accessibilityLabel={accessibilityLabel}
      accessibilityState={{ disabled }}
    >
      {children}
    </AnimatedPressable>
  );
}
