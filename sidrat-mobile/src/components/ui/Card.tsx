/**
 * Card — Themed container with rich shadow depth and variants.
 *
 * Variants:
 *  • default — Standard card with warm shadow
 *  • elevated — Higher elevation, prominent shadow + subtle border glow
 *  • filled — Tinted background (pass `accentColor` for the tint)
 *  • outline — Transparent with border
 *  • premium — Warm gradient border accent + deeper shadow
 *  • glass — Frosted glass surface with subtle border
 */

import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { View, type ViewStyle, type ViewProps } from 'react-native';
import { useTheme } from '../../theme';

type CardVariant = 'default' | 'elevated' | 'filled' | 'outline' | 'premium' | 'glass';

interface CardProps extends ViewProps {
  variant?: CardVariant;
  /** Accent color for `filled` variant tinting */
  accentColor?: string;
  /** Remove default padding */
  noPadding?: boolean;
  style?: ViewStyle;
  children: React.ReactNode;
}

export function Card({
  variant = 'default',
  accentColor,
  noPadding = false,
  style,
  children,
  ...rest
}: CardProps) {
  const { colors, radius, shadows, spacing, isDark, brand } = useTheme();

  const variantStyles: Record<CardVariant, ViewStyle> = {
    default: {
      backgroundColor: colors.surface,
      ...shadows.card,
    },
    elevated: {
      backgroundColor: colors.surfaceElevated,
      ...shadows.elevated,
      borderWidth: isDark ? 1 : 0,
      borderColor: isDark ? colors.border : 'transparent',
    },
    filled: {
      backgroundColor: (accentColor ?? colors.interactive) + (isDark ? '18' : '0A'),
      borderWidth: 1,
      borderColor: (accentColor ?? colors.interactive) + '20',
    },
    outline: {
      backgroundColor: 'transparent',
      borderWidth: 1.5,
      borderColor: colors.border,
    },
    premium: {
      backgroundColor: isDark ? colors.surfaceSecondary : colors.surface,
      ...shadows.cardPremium,
      borderWidth: 1,
      borderColor: isDark ? brand.primary + '20' : brand.accent + '15',
    },
    glass: {
      backgroundColor: isDark ? 'rgba(30,38,48,0.78)' : 'rgba(255,255,255,0.72)',
      borderWidth: 1,
      borderColor: isDark ? 'rgba(255,255,255,0.12)' : 'rgba(26,58,92,0.08)',
      ...shadows.subtle,
    },
  };

  if (variant === 'premium') {
    return (
      <View
        style={[
          {
            borderRadius: radius.xl,
            overflow: 'hidden',
          },
          variantStyles[variant],
          style,
        ]}
        {...rest}
      >
        {/* Top gradient accent strip */}
        <LinearGradient
          colors={[brand.accent + '40', brand.primary + '40', brand.accent + '40']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={{ height: 2.5 }}
        />
        <View style={{ padding: noPadding ? 0 : spacing.md }}>{children}</View>
      </View>
    );
  }

  return (
    <View
      style={[
        {
          borderRadius: radius.lg,
          padding: noPadding ? 0 : spacing.md,
          overflow: 'hidden',
        },
        variantStyles[variant],
        style,
      ]}
      {...rest}
    >
      {children}
    </View>
  );
}
