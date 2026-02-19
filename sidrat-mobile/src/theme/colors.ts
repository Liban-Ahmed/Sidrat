/**
 * Sidrat Color System
 *
 * A rich, warm palette inspired by Islamic art — deep teals from
 * mosque tiles, emerald greens from the Prophet's banner ﷺ, and
 * golden accents evoking illuminated manuscripts.
 *
 * Design principles:
 *  • WCAG AA+ contrast ratios for all text on background
 *  • Warm neutrals (never pure grey) to feel inviting for children
 *  • Gradient pairs for every brand color for depth
 *  • Dark mode uses warm charcoal, not cold black
 */

// ── Brand Colors (constant across modes) ──────────────────────────

export const brand = {
    /** Deep teal — primary CTAs, active states, app identity */
    primary: '#0A7E8C',
    primaryLight: '#12A4B4',
    primaryDark: '#066570',
    primaryMuted: '#0A7E8C20',

    /** Emerald green — success, Quran, nature themes */
    secondary: '#2E8B57',
    secondaryLight: '#3DA96C',
    secondaryDark: '#1E6B42',
    secondaryMuted: '#2E8B5720',

    /** Warm gold — achievements, accents, Islamic art inspiration */
    accent: '#D4982A',
    accentLight: '#EDC55E',
    accentDark: '#B07D1E',
    accentMuted: '#D4982A20',

    /** Soft coral — engagement, hearts, streak fire */
    coral: '#E8636F',
    coralLight: '#F2959D',
    coralDark: '#C74E59',

    /** Lavender — calm states, bedtime content */
    lavender: '#7C6BC4',
    lavenderLight: '#A599D9',
    lavenderDark: '#5B4FA0',
} as const;

// ── Gradient Pairs ────────────────────────────────────────────────
// Use with LinearGradient or as reference for manual gradient layers.

export const gradients = {
    /** Primary CTA gradient — teal to bright teal */
    primary: ['#066570', '#12A4B4'] as const,
    /** Achievement / gold shimmer */
    gold: ['#B07D1E', '#EDC55E'] as const,
    /** Success / nature */
    emerald: ['#1E6B42', '#3DA96C'] as const,
    /** Streak fire */
    coral: ['#C74E59', '#F2959D'] as const,
    /** Night / calm */
    night: ['#1B1B3A', '#2D2D5E'] as const,
    /** Warm sunset — onboarding backgrounds */
    sunset: ['#D4982A', '#E8636F'] as const,
    /** Card shimmer overlay */
    shimmer: ['rgba(255,255,255,0)', 'rgba(255,255,255,0.08)', 'rgba(255,255,255,0)'] as const,

    // ── Screen Hero Gradients (warm luxury feel) ───────────────

    /** Home screen — warm teal to deep teal */
    homeHero: ['#0A7E8C', '#066570'] as const,
    /** Learn screen — deep emerald to teal */
    learnHero: ['#1E6B42', '#0A7E8C'] as const,
    /** Family screen — warm gold to coral */
    familyHero: ['#B07D1E', '#D4982A'] as const,
    /** Progress screen — deep teal to lavender */
    progressHero: ['#066570', '#5B4FA0'] as const,
    /** Settings screen — warm charcoal to teal */
    settingsHero: ['#1A2B2D', '#066570'] as const,

    // ── Card & Surface Gradients ──────────────────────────────

    /** Glass-like frosted overlay (light mode) */
    glassLight: ['rgba(255,255,255,0.85)', 'rgba(255,255,255,0.65)'] as const,
    /** Glass-like frosted overlay (dark mode) */
    glassDark: ['rgba(28,31,34,0.88)', 'rgba(28,31,34,0.72)'] as const,
    /** Premium card border shimmer */
    borderShimmer: ['rgba(212,152,42,0.3)', 'rgba(10,126,140,0.3)', 'rgba(212,152,42,0.3)'] as const,
    /** Warm surface wash for card backgrounds */
    warmSurface: ['rgba(212,152,42,0.04)', 'rgba(10,126,140,0.04)'] as const,
    /** Hero card — teal to emerald for CTAs */
    heroCta: ['#0A7E8C', '#2E8B57'] as const,
} as const;

// ── Semantic Palette ──────────────────────────────────────────────

export const palette = {
    light: {
        /** Warm off-white — never pure #FFF */
        background: '#FAFAF8',
        backgroundSecondary: '#F2F1EE',
        backgroundTertiary: '#E8E6E1',

        /** Card surfaces — slightly warmer than background */
        surface: '#FFFFFF',
        surfaceSecondary: '#F7F6F3',
        surfaceTertiary: '#EEEDEA',
        surfaceElevated: '#FFFFFF',

        /** Text — warm charcoal, never pure black */
        text: '#1A2B2D',
        textSecondary: '#5A6B6D',
        textTertiary: '#8A9496',
        textInverse: '#FFFFFF',

        /** Interactive states */
        interactive: brand.primary,
        interactiveHover: brand.primaryDark,
        interactivePressed: brand.primaryDark,
        interactiveMuted: brand.primaryMuted,

        /** Borders & dividers */
        separator: '#E2DFD9',
        border: '#D8D5CE',
        borderFocused: brand.primary,

        /** Overlay */
        overlay: 'rgba(26, 43, 45, 0.45)',
        overlayHeavy: 'rgba(26, 43, 45, 0.7)',

        /** Feedback colors */
        success: '#2E8B57',
        successMuted: '#2E8B5715',
        warning: '#D4982A',
        warningMuted: '#D4982A15',
        error: '#D94052',
        errorMuted: '#D9405215',
        info: brand.primary,
        infoMuted: brand.primaryMuted,
    },
    dark: {
        /** Warm dark — charcoal with slight warmth */
        background: '#141618',
        backgroundSecondary: '#1C1F22',
        backgroundTertiary: '#262A2E',

        /** Card surfaces — elevated from background */
        surface: '#1C1F22',
        surfaceSecondary: '#242830',
        surfaceTertiary: '#2E3238',
        surfaceElevated: '#2E3238',

        /** Text — warm white, never pure #FFF */
        text: '#F0EDE8',
        textSecondary: '#9BA4A6',
        textTertiary: '#636B6D',
        textInverse: '#1A2B2D',

        /** Interactive states */
        interactive: '#12A4B4',
        interactiveHover: '#15B8CA',
        interactivePressed: '#0A7E8C',
        interactiveMuted: '#12A4B425',

        /** Borders & dividers */
        separator: '#2E3238',
        border: '#3A3E44',
        borderFocused: '#12A4B4',

        /** Overlay */
        overlay: 'rgba(0, 0, 0, 0.55)',
        overlayHeavy: 'rgba(0, 0, 0, 0.8)',

        /** Feedback colors */
        success: '#3DA96C',
        successMuted: '#3DA96C20',
        warning: '#EDC55E',
        warningMuted: '#EDC55E20',
        error: '#EF5F6B',
        errorMuted: '#EF5F6B20',
        info: '#12A4B4',
        infoMuted: '#12A4B420',
    },
} as const;

// ── Category Colors (for lesson categories) ──────────────────────

export const categoryColors: Record<string, { solid: string; muted: string }> = {
    aqeedah: { solid: '#0A7E8C', muted: '#0A7E8C18' },
    salah: { solid: '#D4982A', muted: '#D4982A18' },
    wudu: { solid: '#12A4B4', muted: '#12A4B418' },
    quran: { solid: '#2E8B57', muted: '#2E8B5718' },
    seerah: { solid: '#B07D1E', muted: '#B07D1E18' },
    adab: { solid: '#E8636F', muted: '#E8636F18' },
    duaa: { solid: '#7C6BC4', muted: '#7C6BC418' },
    stories: { solid: '#3DA96C', muted: '#3DA96C18' },
};

// ── Achievement Rarity Colors ────────────────────────────────────

export const rarityColors = {
    bronze: { solid: '#CD7F32', glow: '#CD7F3240' },
    silver: { solid: '#A8B5BD', glow: '#A8B5BD40' },
    gold: { solid: '#D4982A', glow: '#D4982A40' },
    platinum: { solid: '#B8C4D0', glow: '#B8C4D040' },
} as const;
