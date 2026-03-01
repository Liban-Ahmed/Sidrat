/**
 * BismillahHeader — Islamic branding accent.
 *
 * A small, elegant "Bismillah" in Arabic with Amiri font,
 * used as a decorative header element on key screens.
 * Adds a distinctive Islamic identity touch.
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../../theme';

interface BismillahHeaderProps {
  /** Size variant */
  size?: 'sm' | 'md' | 'lg';
  /** Custom color — defaults to textTertiary */
  color?: string;
  /** Text alignment */
  align?: 'left' | 'center' | 'right';
  /** Horizontal stretch scale — widens without changing font size */
  scaleX?: number;
}

export function BismillahHeader({
  size = 'md',
  color,
  align = 'center',
  scaleX,
}: BismillahHeaderProps) {
  const { colors } = useTheme();
  const textColor = color ?? colors.textTertiary;

  const sizeMap = {
    sm: { fontSize: 16, lineHeight: 28 },
    md: { fontSize: 22, lineHeight: 36 },
    lg: { fontSize: 30, lineHeight: 48 },
  };

  return (
    <View
      style={[
        styles.container,
        {
          width: '100%',
          alignItems: align === 'center' ? 'center' : align === 'right' ? 'flex-end' : 'flex-start',
        },
      ]}
    >
      <Text
        style={[
          sizeMap[size],
          {
            fontFamily: 'Amiri-Regular',
            color: textColor,
            textAlign: align,
            ...(scaleX ? { transform: [{ scaleX }] } : {}),
          },
        ]}
      >
        بِسْمِ ٱللَّهِ ٱلرَّحْمَـٰنِ ٱلرَّحِيمِ
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 4,
  },
});
