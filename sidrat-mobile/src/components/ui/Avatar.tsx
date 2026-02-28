/**
 * Avatar — Child's animal avatar with gradient ring and status indicator.
 *
 * Features:
 *  • Gradient-like ring effect using layered borders
 *  • Optional status dot (online, streak active)
 *  • Size variants from small (32) to hero (80)
 *  • Easy to swap for Rive/Lottie later
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../../theme';
import type { AvatarId } from '../../types';

const avatarEmojis: Record<AvatarId, string> = {
  cat: '🐱',
  lion: '🦁',
  butterfly: '🦋',
  owl: '🦉',
  rabbit: '🐰',
  panda: '🐼',
  fox: '🦊',
  deer: '🦌',
};

interface AvatarProps {
  avatarId: AvatarId;
  size?: number;
  /** Show a colored ring around the avatar */
  showRing?: boolean;
  /** Ring color (defaults to brand primary) */
  ringColor?: string;
  /** Show a small status dot */
  status?: 'active' | 'streak' | 'none';
}

export function Avatar({
  avatarId,
  size = 48,
  showRing = false,
  ringColor,
  status = 'none',
}: AvatarProps) {
  const { brand, colors, isDark } = useTheme();
  const ring = ringColor ?? brand.primary;

  const ringWidth = Math.max(2, size * 0.05);
  const ringGap = ringWidth;
  const outerSize = showRing ? size + (ringWidth + ringGap) * 2 : size;

  const statusDotSize = Math.max(10, size * 0.22);
  const statusColor =
    status === 'active' ? brand.secondary : status === 'streak' ? brand.accent : 'transparent';

  return (
    <View style={[styles.wrapper, { width: outerSize, height: outerSize }]}>
      {/* Ring */}
      {showRing && (
        <View
          style={[
            styles.ring,
            {
              width: outerSize,
              height: outerSize,
              borderRadius: outerSize / 2,
              borderWidth: ringWidth,
              borderColor: ring,
            },
          ]}
        />
      )}

      {/* Avatar circle */}
      <View
        style={[
          styles.avatar,
          {
            width: size,
            height: size,
            borderRadius: size / 2,
            backgroundColor: isDark ? brand.primary + '20' : brand.primary + '10',
          },
        ]}
      >
        <Text style={{ fontSize: size * 0.5 }}>{avatarEmojis[avatarId] ?? '🌙'}</Text>
      </View>

      {/* Status dot */}
      {status !== 'none' && (
        <View
          style={[
            styles.statusDot,
            {
              width: statusDotSize,
              height: statusDotSize,
              borderRadius: statusDotSize / 2,
              backgroundColor: statusColor,
              borderWidth: 2,
              borderColor: colors.background,
              bottom: 0,
              right: showRing ? ringWidth : 0,
            },
          ]}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  ring: {
    position: 'absolute',
  },
  avatar: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusDot: {
    position: 'absolute',
  },
});
