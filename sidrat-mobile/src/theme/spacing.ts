/**
 * Sidrat Spacing, Layout & Shadow Tokens
 *
 * 4-point grid, plus rich shadow presets with colored depth,
 * layout constants, and animation timing presets.
 */

import { Dimensions, Platform } from 'react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// ── Spacing (4pt grid) ───────────────────────────────────────────

export const spacing = {
    /** 2pt — hairline gaps */
    xxxs: 2,
    /** 4pt — icon gap, inline spacing */
    xxs: 4,
    /** 8pt — tight grouping */
    xs: 8,
    /** 12pt — related element spacing */
    sm: 12,
    /** 16pt — default content padding */
    md: 16,
    /** 20pt — breathing room */
    lg: 20,
    /** 24pt — section gaps */
    xl: 24,
    /** 32pt — major section separation */
    xxl: 32,
    /** 48pt — hero spacing */
    xxxl: 48,
    /** 64pt — splash spacing */
    huge: 64,
} as const;

// ── Layout Constants ─────────────────────────────────────────────

export const layout = {
    /** Horizontal screen padding */
    screenPaddingH: 20,
    /** Max content width (for tablets) */
    maxContentWidth: 428,
    /** Screen width */
    screenWidth: SCREEN_WIDTH,
    /** Bottom tab bar height */
    tabBarHeight: Platform.select({ ios: 88, default: 64 }) as number,
    /** Standard header height */
    headerHeight: Platform.select({ ios: 96, default: 56 }) as number,
} as const;

// ── Corner Radii ─────────────────────────────────────────────────

export const radius = {
    /** 6pt — subtle rounding (inputs, small chips) */
    xs: 6,
    /** 10pt — badges, small cards */
    sm: 10,
    /** 14pt — standard cards */
    md: 14,
    /** 18pt — prominent cards, buttons */
    lg: 18,
    /** 24pt — modal sheets, large cards */
    xl: 24,
    /** 32pt — pill shapes, avatars */
    xxl: 32,
    /** Full circle */
    full: 9999,
} as const;

// ── Shadow Presets ───────────────────────────────────────────────
// Warm shadows with slight color tint for a less "flat" feel.

export const shadows = {
    /** Barely visible lift — chips, badges */
    subtle: {
        shadowColor: '#0F2440',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.06,
        shadowRadius: 3,
        elevation: 1,
    },
    /** Standard card shadow — navy depth */
    card: {
        shadowColor: '#0F2440',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 12,
        elevation: 3,
    },
    /** Premium card — deeper navy shadow with slight spread */
    cardPremium: {
        shadowColor: '#1A3A5C',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.12,
        shadowRadius: 20,
        elevation: 5,
    },
    /** Floating elements — modals, FABs */
    elevated: {
        shadowColor: '#0F2440',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.12,
        shadowRadius: 24,
        elevation: 8,
    },
    /** Luxury elevated — deeper navy with rich tint */
    luxuryElevated: {
        shadowColor: '#1A3A5C',
        shadowOffset: { width: 0, height: 12 },
        shadowOpacity: 0.18,
        shadowRadius: 32,
        elevation: 10,
    },
    /** Pressed / inset feel */
    inner: {
        shadowColor: '#0F2440',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.04,
        shadowRadius: 2,
        elevation: 0,
    },
    /** Colored glow — use with brand colored elements */
    glow: (color: string) => ({
        shadowColor: color,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 12,
        elevation: 6,
    }),
    /** Soft colored glow — for hero sections and featured content */
    softGlow: (color: string) => ({
        shadowColor: color,
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.18,
        shadowRadius: 24,
        elevation: 8,
    }),
} as const;

// ── Animation Timing ─────────────────────────────────────────────

export const timing = {
    /** Quick micro-interactions */
    fast: 150,
    /** Button presses, toggles */
    normal: 250,
    /** Card transitions */
    moderate: 400,
    /** Page transitions, modal entrance */
    slow: 600,
    /** Celebration animations */
    celebration: 1200,
} as const;

// ── Spring Configs ───────────────────────────────────────────────

export const springs = {
    /** Snappy — buttons, toggles */
    snappy: { damping: 20, stiffness: 300, mass: 0.8 },
    /** Bouncy — celebration elements */
    bouncy: { damping: 10, stiffness: 150, mass: 0.6 },
    /** Gentle — page transitions */
    gentle: { damping: 20, stiffness: 120, mass: 1 },
    /** Quick press */
    press: { damping: 15, stiffness: 200, mass: 0.7 },
} as const;
