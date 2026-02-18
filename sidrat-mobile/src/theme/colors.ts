/**
 * Sidrat Color System
 *
 * Matches landing page palette with full dark mode support.
 * Improved over iOS version: semantic tokens with clear naming,
 * no legacy aliases, and explicit light/dark variants.
 */

// ── Brand Colors (constant across modes) ──────────────────────────

export const brand = {
    primary: '#0C7489',
    primaryLight: '#0E8FA6',
    primaryDark: '#095A6B',

    secondary: '#488B49',
    secondaryLight: '#5AA85B',
    secondaryDark: '#3A7A3B',

    accent: '#DAA520',
    accentLight: '#E8B84A',
    accentDark: '#C49318',
} as const;

// ── Semantic Palette ──────────────────────────────────────────────

export const palette = {
    light: {
        background: '#FFFFFF',
        backgroundSecondary: '#F5F5F5',
        backgroundTertiary: '#EDEDED',

        surface: '#FFFFFF',
        surfaceSecondary: '#F5F5F5',
        surfaceTertiary: '#EDEDED',
        surfaceElevated: '#FFFFFF',

        text: '#2C3E3F',
        textSecondary: '#6B7280',
        textTertiary: '#9CA3AF',

        separator: '#E5E5EA',
        overlay: 'rgba(0,0,0,0.4)',

        success: '#488B49',
        warning: '#DAA520',
        error: '#DC2626',
    },
    dark: {
        background: '#121214',
        backgroundSecondary: '#1C1C1E',
        backgroundTertiary: '#2C2C2E',

        surface: '#121214',
        surfaceSecondary: '#1C1C1E',
        surfaceTertiary: '#2C2C2E',
        surfaceElevated: '#2C2C2E',

        text: '#F5F5F7',
        textSecondary: '#A1A1A6',
        textTertiary: '#6B6B70',

        separator: '#38383A',
        overlay: 'rgba(0,0,0,0.6)',

        success: '#5AA85B',
        warning: '#E8B84A',
        error: '#EF4444',
    },
} as const;

// ── Category Colors (for lesson categories) ──────────────────────

export const categoryColors: Record<string, string> = {
    aqeedah: brand.primary,
    salah: brand.accent,
    wudu: brand.primaryLight,
    quran: brand.secondary,
    seerah: brand.accentDark,
    adab: '#E8636F',
    duaa: brand.primaryDark,
    stories: brand.secondaryLight,
};

// ── Achievement Rarity Colors ────────────────────────────────────

export const rarityColors = {
    bronze: '#CD7F32',
    silver: '#C0C0C0',
    gold: '#DAA520',
    platinum: '#E5E4E2',
} as const;
