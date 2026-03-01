/**
 * JuicyPressable — Sidrat Design Spec §3.2
 *
 * The ONLY pressable wrapper used in the app. Raw TouchableOpacity
 * is never used. Every tappable element scales down on press-in
 * (0.95, responsive spring) and bounces back on press-out (1.0,
 * bouncy spring), with haptic feedback on every interaction.
 */

import React, { useCallback } from 'react';
import { Pressable, type ViewStyle, type StyleProp, type AccessibilityRole } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { SPRINGS } from '../../theme/tokens';
import haptic from '../../utils/haptics';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface JuicyPressableProps {
  children: React.ReactNode;
  onPress?: () => void;
  onLongPress?: () => void;
  style?: StyleProp<ViewStyle>;
  accessibilityLabel: string;
  accessibilityRole?: AccessibilityRole;
  accessibilityHint?: string;
  disabled?: boolean;
}

const DISABLED_OPACITY = 0.5;

export const JuicyPressable: React.FC<JuicyPressableProps> = ({
  children,
  onPress,
  onLongPress,
  style,
  accessibilityLabel,
  accessibilityRole = 'button',
  accessibilityHint,
  disabled = false,
}) => {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: disabled ? DISABLED_OPACITY : 1,
  }));

  const handlePressIn = useCallback(() => {
    if (disabled) return;
    scale.value = withSpring(0.95, SPRINGS.responsive);
    haptic.light();
  }, [disabled, scale]);

  const handlePressOut = useCallback(() => {
    if (disabled) return;
    scale.value = withSpring(1, SPRINGS.bouncy);
  }, [disabled, scale]);

  const handlePress = useCallback(() => {
    if (disabled) return;
    onPress?.();
  }, [disabled, onPress]);

  const handleLongPress = useCallback(() => {
    if (disabled || !onLongPress) return;
    haptic.heavy();
    onLongPress();
  }, [disabled, onLongPress]);

  return (
    <AnimatedPressable
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onPress={handlePress}
      onLongPress={onLongPress ? handleLongPress : undefined}
      disabled={disabled}
      accessible
      accessibilityLabel={accessibilityLabel}
      accessibilityRole={accessibilityRole}
      accessibilityHint={accessibilityHint}
      accessibilityState={{ disabled }}
      style={[animatedStyle, style]}
    >
      {children}
    </AnimatedPressable>
  );
};

export default JuicyPressable;
