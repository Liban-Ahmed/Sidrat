/**
 * Sidrat Spacing & Layout Tokens
 *
 * 4-point grid system matching iOS Spacing enum,
 * plus corner radii and shadow presets.
 */

// ── Spacing (4pt grid) ───────────────────────────────────────────

export const spacing = {
    xxs: 4,
    xs: 8,
    sm: 12,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
    xxxl: 64,
} as const;

// ── Corner Radii ─────────────────────────────────────────────────

export const radius = {
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,
    xxl: 32,
    full: 9999,
} as const;

// ── Shadow presets (iOS-style layered shadows) ───────────────────
// React Native only supports a single shadow layer per view on Android,
// so these are optimized for the best cross-platform look.

export const shadows = {
    subtle: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 4,
        elevation: 2,
    },
    card: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 12,
        elevation: 4,
    },
    elevated: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.12,
        shadowRadius: 20,
        elevation: 8,
    },
} as const;
