/**
 * IslamicDivider — Decorative section divider with Islamic motif.
 *
 * A thin line with a small diamond/star accent in the center,
 * reminiscent of Islamic geometric patterns found in manuscripts.
 * Supports a "rich" variant for premium sections with gradient line.
 */

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../../theme';

interface IslamicDividerProps {
  /** Color of the divider line and accent */
  color?: string;
  /** Vertical margin around the divider */
  spacing?: number;
  /** Use rich gradient variant */
  variant?: 'default' | 'rich';
}

export function IslamicDivider({
  color,
  spacing: vertSpacing,
  variant = 'default',
}: IslamicDividerProps) {
  const { colors, brand, spacing } = useTheme();
  const lineColor = color ?? colors.separator;
  const accentColor = color ?? brand.accent;
  const vMargin = vertSpacing ?? spacing.lg;

  if (variant === 'rich') {
    return (
      <View style={[styles.container, { marginVertical: vMargin }]}>
        <LinearGradient
          colors={['transparent', accentColor + '30', 'transparent']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.gradientLine}
        />
        <View style={styles.accentContainer}>
          <View style={[styles.diamondSmall, { backgroundColor: accentColor + '40' }]} />
          <View style={[styles.diamondLarge, { backgroundColor: accentColor + '80' }]} />
          <View style={[styles.diamond, { backgroundColor: accentColor }]} />
          <View style={[styles.diamondLarge, { backgroundColor: accentColor + '80' }]} />
          <View style={[styles.diamondSmall, { backgroundColor: accentColor + '40' }]} />
        </View>
        <LinearGradient
          colors={['transparent', accentColor + '30', 'transparent']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.gradientLine}
        />
      </View>
    );
  }

  return (
    <View style={[styles.container, { marginVertical: vMargin }]}>
      <View style={[styles.line, { backgroundColor: lineColor }]} />
      {/* Center diamond accent */}
      <View style={styles.accentContainer}>
        <View style={[styles.diamond, { backgroundColor: accentColor }]} />
        <View
          style={[styles.diamondSmall, styles.diamondLeft, { backgroundColor: accentColor + '60' }]}
        />
        <View
          style={[
            styles.diamondSmall,
            styles.diamondRight,
            { backgroundColor: accentColor + '60' },
          ]}
        />
      </View>
      <View style={[styles.line, { backgroundColor: lineColor }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  line: {
    flex: 1,
    height: StyleSheet.hairlineWidth,
  },
  gradientLine: {
    flex: 1,
    height: 1,
  },
  accentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 12,
    gap: 5,
  },
  diamond: {
    width: 6,
    height: 6,
    borderRadius: 1,
    transform: [{ rotate: '45deg' }],
  },
  diamondLarge: {
    width: 4,
    height: 4,
    borderRadius: 1,
    transform: [{ rotate: '45deg' }],
  },
  diamondSmall: {
    width: 4,
    height: 4,
    borderRadius: 1,
    transform: [{ rotate: '45deg' }],
  },
  diamondLeft: {},
  diamondRight: {},
});
