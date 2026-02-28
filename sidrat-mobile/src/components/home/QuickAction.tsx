/**
 * QuickAction — premium action tile with layered icon background,
 * entrance animation, badge support, and refined press feedback.
 *
 * Features:
 *  • Layered icon: outer ring + inner filled circle + icon
 *  • Optional notification badge dot
 *  • Staggered fade-in entrance
 *  • Haptic press via ScalePress
 *  • Disabled state with reduced opacity
 *  • Colored glow shadow in light mode
 *  • Luminous accent border in dark mode
 */

import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { useTheme } from '../../theme';
import { ScalePress } from '../ScalePress';

interface QuickActionProps {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  color: string;
  onPress?: () => void;
  /** Show a notification dot badge */
  badge?: boolean;
  /** Disable the action */
  disabled?: boolean;
  /** Entrance animation delay */
  delay?: number;
}

export function QuickAction({
  icon,
  label,
  color,
  onPress,
  badge = false,
  disabled = false,
  delay = 0,
}: QuickActionProps) {
  const { colors, typography, spacing, radius, isDark } = useTheme();

  // Colored ambient glow
  const glowShadow = isDark
    ? {}
    : {
        shadowColor: color,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 2,
      };

  return (
    <Animated.View
      entering={delay > 0 ? FadeInUp.delay(delay).duration(400).springify().damping(16) : undefined}
    >
      <ScalePress
        onPress={onPress}
        accessibilityLabel={label}
        haptic
        disabled={disabled}
        pressScale={0.9}
      >
        <View
          style={[
            styles.card,
            {
              backgroundColor: isDark ? colors.surfaceSecondary : colors.surface,
              borderRadius: radius.lg,
              paddingVertical: spacing.md,
              paddingHorizontal: spacing.sm,
              borderWidth: 1,
              borderColor: isDark ? color + '18' : color + '08',
              ...glowShadow,
            },
            disabled && styles.disabled,
          ]}
        >
          {/* Layered icon background */}
          <View style={styles.iconStack}>
            {/* Outer subtle ring */}
            <View
              style={[
                styles.iconOuter,
                {
                  backgroundColor: color + (isDark ? '08' : '05'),
                  borderRadius: radius.xl,
                },
              ]}
            />
            {/* Inner circle */}
            <View
              style={[
                styles.iconInner,
                {
                  backgroundColor: color + (isDark ? '20' : '12'),
                  borderRadius: radius.lg,
                },
              ]}
            >
              <Ionicons name={icon} size={22} color={color} />
            </View>

            {/* Badge dot */}
            {badge && (
              <View
                style={[
                  styles.badgeDot,
                  {
                    backgroundColor: colors.error,
                    borderColor: isDark ? colors.surfaceSecondary : colors.surface,
                    borderRadius: radius.full,
                  },
                ]}
              />
            )}
          </View>

          {/* Label */}
          <Text
            style={[
              typography.labelSmall,
              {
                color: colors.text,
                marginTop: spacing.xs,
              },
            ]}
            numberOfLines={1}
          >
            {label}
          </Text>
        </View>
      </ScalePress>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 92,
    alignItems: 'center',
  },
  disabled: {
    opacity: 0.45,
  },
  iconStack: {
    width: 52,
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconOuter: {
    position: 'absolute',
    width: 52,
    height: 52,
  },
  iconInner: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeDot: {
    position: 'absolute',
    top: 2,
    right: 2,
    width: 10,
    height: 10,
    borderWidth: 2,
  },
});
