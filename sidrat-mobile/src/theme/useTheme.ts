/**
 * useTheme hook
 *
 * Provides the full resolved theme based on system color scheme.
 * Single hook returns every design token needed — colors, type,
 * spacing, radii, shadows, animation timing, and helpers.
 */

import { useMemo } from 'react';
import { useColorScheme } from 'react-native';
import { brand, palette, categoryColors, rarityColors, gradients } from './colors';
import { typography } from './typography';
import { spacing, layout, radius, shadows, timing, springs } from './spacing';

export type ThemeMode = 'light' | 'dark';

export interface Theme {
    mode: ThemeMode;
    isDark: boolean;
    brand: typeof brand;
    colors: (typeof palette)[ThemeMode];
    gradients: typeof gradients;
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
    const scheme = useColorScheme();
    const mode: ThemeMode = scheme === 'dark' ? 'dark' : 'light';

    return useMemo(
        () => ({
            mode,
            isDark: mode === 'dark',
            brand,
            colors: palette[mode],
            gradients,
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
