/**
 * useTheme hook
 *
 * Provides the full resolved theme based on the current color scheme.
 * Improvement over iOS: single hook returns everything needed, no
 * separate @Environment lookups.
 */

import { useColorScheme } from 'react-native';
import { brand, palette, categoryColors, rarityColors } from './colors';
import { typography } from './typography';
import { spacing, radius, shadows } from './spacing';

export type ThemeMode = 'light' | 'dark';

export interface Theme {
    mode: ThemeMode;
    brand: typeof brand;
    colors: (typeof palette)[ThemeMode];
    categoryColors: typeof categoryColors;
    rarityColors: typeof rarityColors;
    typography: typeof typography;
    spacing: typeof spacing;
    radius: typeof radius;
    shadows: typeof shadows;
}

export function useTheme(): Theme {
    const scheme = useColorScheme();
    const mode: ThemeMode = scheme === 'dark' ? 'dark' : 'light';

    return {
        mode,
        brand,
        colors: palette[mode],
        categoryColors,
        rarityColors,
        typography,
        spacing,
        radius,
        shadows,
    };
}
