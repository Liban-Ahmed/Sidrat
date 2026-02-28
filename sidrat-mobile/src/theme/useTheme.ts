/**
 * useTheme hook
 *
 * Provides the full resolved theme based on the user's theme preference
 * (stored in settingsStore) with a fallback to the OS color scheme.
 *
 * Priority:
 *   'light'  → always light
 *   'dark'   → always dark
 *   'system' → follows the OS color scheme (default)
 *
 * Single hook returns every design token needed — colors, type,
 * spacing, radii, shadows, animation timing, and helpers.
 */

import { useMemo } from 'react';
import { useColorScheme } from 'react-native';
import { brand, palette, categoryColors, rarityColors, gradients, gradientsDark } from './colors';
import { typography } from './typography';
import { spacing, layout, radius, shadows, timing, springs } from './spacing';
import { useSettingsStore } from '../stores/settingsStore';

export type ThemeMode = 'light' | 'dark';

export interface Theme {
  mode: ThemeMode;
  isDark: boolean;
  brand: typeof brand;
  colors: (typeof palette)[ThemeMode];
  gradients: { [K in keyof typeof gradients]: readonly [string, string, ...string[]] };
  categoryColors: typeof categoryColors;
  rarityColors: typeof rarityColors;
  typography: typeof typography;
  spacing: typeof spacing;
  layout: typeof layout;
  radius: typeof radius;
  shadows: typeof shadows;
  timing: typeof timing;
  springs: typeof springs;
}

export function useTheme(): Theme {
  const systemScheme = useColorScheme();
  const themePreference = useSettingsStore((s) => s.themePreference);

  const mode: ThemeMode =
    themePreference === 'dark'
      ? 'dark'
      : themePreference === 'light'
        ? 'light'
        : systemScheme === 'dark'
          ? 'dark'
          : 'light';

  return useMemo(
    () => ({
      mode,
      isDark: mode === 'dark',
      brand,
      colors: palette[mode],
      gradients: mode === 'dark' ? { ...gradients, ...gradientsDark } : gradients,
      categoryColors,
      rarityColors,
      typography,
      spacing,
      layout,
      radius,
      shadows,
      timing,
      springs,
    }),
    [mode],
  );
}
