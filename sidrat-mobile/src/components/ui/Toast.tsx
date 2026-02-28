/**
 * Toast — Lightweight snackbar overlay for transient feedback.
 *
 * Usage:
 *   import { useToast } from '../../stores/toastStore';
 *   const show = useToast(s => s.show);
 *   show('Settings saved');
 *   show('Profile removed', 'error');
 *
 * Mount <Toast /> once at the root layout (next to AchievementToast).
 */

import React, { useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withDelay,
  withTiming,
  runOnJS,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../../theme';
import { useToastStore, type ToastType } from '../../stores/toastStore';

const ICON_MAP: Record<ToastType, keyof typeof Ionicons.glyphMap> = {
  success: 'checkmark-circle',
  error: 'alert-circle',
  info: 'information-circle',
};

export function Toast() {
  const { colors, brand, typography, spacing, radius, shadows } = useTheme();
  const insets = useSafeAreaInsets();
  const current = useToastStore((s) => s.current);
  const dismiss = useToastStore((s) => s.dismiss);

  const translateY = useSharedValue(-200);
  const opacity = useSharedValue(0);

  const handleDismiss = useCallback(() => {
    dismiss();
  }, [dismiss]);

  useEffect(() => {
    if (current) {
      translateY.value = withSpring(0, { damping: 14, stiffness: 120 });
      opacity.value = withTiming(1, { duration: 250 });

      const duration = current.duration ?? 2500;
      translateY.value = withDelay(
        duration,
        withTiming(-200, { duration: 250 }, (finished) => {
          if (finished) runOnJS(handleDismiss)();
        }),
      );
      opacity.value = withDelay(duration, withTiming(0, { duration: 250 }));
    } else {
      translateY.value = -200;
      opacity.value = 0;
    }
  }, [current, handleDismiss, translateY, opacity]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
    opacity: opacity.value,
  }));

  if (!current) return null;

  const tintMap: Record<ToastType, string> = {
    success: brand.secondary,
    error: brand.coral,
    info: brand.primary,
  };
  const tint = tintMap[current.type];

  return (
    <Animated.View
      style={[
        styles.container,
        animatedStyle,
        { top: insets.top + 8, marginHorizontal: spacing.md },
      ]}
      pointerEvents="box-none"
    >
      <Pressable
        onPress={handleDismiss}
        style={[
          styles.toast,
          {
            backgroundColor: colors.surfaceElevated,
            borderRadius: radius.lg,
            paddingVertical: spacing.sm,
            paddingHorizontal: spacing.md,
            borderLeftWidth: 3,
            borderLeftColor: tint,
            ...shadows.elevated,
          },
        ]}
        accessibilityRole="alert"
      >
        <View
          style={[styles.iconWrap, { backgroundColor: tint + '15', borderRadius: radius.full }]}
        >
          <Ionicons name={ICON_MAP[current.type]} size={18} color={tint} />
        </View>
        <Text
          style={[typography.label, { color: colors.text, flex: 1, marginLeft: spacing.sm }]}
          numberOfLines={2}
        >
          {current.message}
        </Text>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: { position: 'absolute', left: 0, right: 0, zIndex: 9998 },
  toast: { flexDirection: 'row', alignItems: 'center' },
  iconWrap: { width: 32, height: 32, alignItems: 'center', justifyContent: 'center' },
});
