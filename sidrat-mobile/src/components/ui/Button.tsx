/**
 * Button — Primary / Secondary / Accent / Ghost
 *
 * Premium press experience with spring animation, haptic feedback,
 * icon support, loading state, and accessible focus styles.
 */

import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import {
  Pressable,
  Text,
  StyleSheet,
  ActivityIndicator,
  type ViewStyle,
  type TextStyle,
  type PressableProps,
} from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { useTheme } from '../../theme';
import haptic from '../../utils/haptics';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

type Variant = 'primary' | 'secondary' | 'accent' | 'ghost';
type Size = 'sm' | 'md' | 'lg';

interface ButtonProps extends Omit<PressableProps, 'style'> {
  title: string;
  variant?: Variant;
  size?: Size;
  fullWidth?: boolean;
  icon?: keyof typeof Ionicons.glyphMap;
  iconPosition?: 'left' | 'right';
  loading?: boolean;
  style?: ViewStyle | ViewStyle[];
  textStyle?: TextStyle | TextStyle[];
}

export function Button({
  title,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  icon,
  iconPosition = 'left',
  loading = false,
  style,
  textStyle: textStyleProp,
  disabled,
  onPress,
  ...rest
}: ButtonProps) {
  const { brand, colors, typography, spacing, radius, shadows, springs } = useTheme();

  const scale = useSharedValue(1);
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.96, springs.press);
  };
  const handlePressOut = () => {
    scale.value = withSpring(1, springs.snappy);
  };
  const handlePress = (e: any) => {
    haptic.light();
    onPress?.(e);
  };

  // ── Size tokens ──────────────────────────────────────────────
  const sizeConfig: Record<Size, { pv: number; ph: number; iconSize: number }> = {
    sm: { pv: spacing.xs, ph: spacing.md, iconSize: 16 },
    md: { pv: spacing.sm + 2, ph: spacing.xl, iconSize: 18 },
    lg: { pv: spacing.md, ph: spacing.xxl, iconSize: 20 },
  };
  const { pv, ph, iconSize } = sizeConfig[size];

  // ── Variant styles ───────────────────────────────────────────
  const variantStyles: Record<
    Variant,
    { bg: string; text: string; border?: string; shadow?: object }
  > = {
    primary: {
      bg: brand.primary,
      text: '#FFFFFF',
      shadow: shadows.glow(brand.primary),
    },
    accent: {
      bg: brand.accent,
      text: '#FFFFFF',
      shadow: shadows.glow(brand.accent),
    },
    secondary: {
      bg: colors.interactive + '12',
      text: colors.interactive,
      border: colors.interactive + '30',
    },
    ghost: {
      bg: 'transparent',
      text: colors.interactive,
    },
  };

  const v = variantStyles[variant];
  const isDisabled = disabled || loading;

  const containerStyle: ViewStyle = {
    backgroundColor: v.bg,
    paddingVertical: pv,
    paddingHorizontal: ph,
    borderRadius: size === 'sm' ? radius.sm : radius.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
    opacity: isDisabled ? 0.45 : 1,
    ...(v.border && { borderWidth: 1.5, borderColor: v.border }),
    ...(v.shadow && !isDisabled ? v.shadow : {}),
    ...(fullWidth && { width: '100%' as unknown as number }),
    ...StyleSheet.flatten(style),
  };

  const labelStyle: TextStyle = {
    ...(size === 'sm' ? typography.label : typography.labelLarge),
    color: v.text,
    ...StyleSheet.flatten(textStyleProp),
  };

  const iconColor = v.text;

  const iconElement =
    icon && !loading ? <Ionicons name={icon} size={iconSize} color={iconColor} /> : null;

  return (
    <AnimatedPressable
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onPress={handlePress}
      disabled={isDisabled}
      style={[animatedStyle, containerStyle]}
      accessibilityRole="button"
      accessibilityLabel={rest.accessibilityLabel ?? title}
      accessibilityState={{ disabled: isDisabled }}
      {...rest}
    >
      {loading ? (
        <ActivityIndicator size="small" color={v.text} />
      ) : (
        <>
          {iconPosition === 'left' && iconElement}
          <Text style={labelStyle}>{title}</Text>
          {iconPosition === 'right' && iconElement}
        </>
      )}
    </AnimatedPressable>
  );
}
