/**
 * FeedbackCard -- Shared hint/explanation/result card used across all practice types.
 */

import React from 'react';
import { Text, StyleSheet } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../theme';
import { FormattedText } from './FormattedText';

interface FeedbackCardProps {
  type: 'hint' | 'success' | 'error' | 'info';
  children: string;
  delay?: number;
  useFormatted?: boolean;
}

export function FeedbackCard({
  type,
  children,
  delay = 0,
  useFormatted = false,
}: FeedbackCardProps) {
  const { brand, colors, radius } = useTheme();

  const config = {
    hint: { icon: 'bulb-outline' as const, color: brand.accent, bg: colors.warningMuted },
    success: { icon: 'sparkles' as const, color: colors.success, bg: colors.successMuted },
    error: { icon: 'close-circle' as const, color: colors.error, bg: colors.errorMuted },
    info: {
      icon: 'information-circle-outline' as const,
      color: brand.primary,
      bg: colors.infoMuted,
    },
  }[type];

  const TextComponent = useFormatted ? FormattedText : Text;

  return (
    <Animated.View
      entering={FadeIn.delay(delay).duration(400)}
      style={[
        styles.card,
        {
          backgroundColor: config.bg,
          borderRadius: radius.md,
          borderLeftWidth: 3,
          borderLeftColor: config.color,
        },
      ]}
    >
      <Ionicons name={config.icon} size={18} color={config.color} />
      <TextComponent style={[styles.text, { color: colors.text }]}>{children}</TextComponent>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    padding: 14,
    marginTop: 14,
  },
  text: {
    fontSize: 14,
    lineHeight: 22,
    flex: 1,
  },
});
