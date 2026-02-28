import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../theme';
import type { ReactNode } from 'react';
import type { ViewStyle } from 'react-native';
import type { SafeAreaViewProps } from 'react-native-safe-area-context';

interface ScreenWrapperProps extends SafeAreaViewProps {
  children: ReactNode;
  style?: ViewStyle;
  /**
   * If true, uses a gradient background (if available in theme) or primary color.
   * Default: false (uses theme background color).
   */
  useGradientBackground?: boolean;
  /**
   * If true, ignores safe area insets (useful for screens with full-bleed headers).
   * Default: false.
   */
  fullScreen?: boolean;
  /**
   * Status bar style override.
   * Default: based on theme mode.
   */
  statusBarStyle?: 'light' | 'dark' | 'auto';
}

export function ScreenWrapper({
  children,
  style,
  useGradientBackground = false,
  fullScreen = false,
  statusBarStyle,
  edges = ['top', 'left', 'right', 'bottom'], // Default edges from safe-area-context
  ...props
}: ScreenWrapperProps) {
  const { colors, brand, mode } = useTheme();

  const containerStyle = [
    styles.container,
    { backgroundColor: useGradientBackground ? brand.primary : colors.background },
    style,
  ];

  const computedStatusBarStyle = statusBarStyle ?? (mode === 'dark' ? 'light' : 'dark');

  if (fullScreen) {
    return (
      <View style={containerStyle} {...props}>
        <StatusBar style={computedStatusBarStyle} />
        {children}
      </View>
    );
  }

  return (
    <SafeAreaView style={containerStyle} edges={edges} {...props}>
      <StatusBar style={computedStatusBarStyle} />
      {children}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
