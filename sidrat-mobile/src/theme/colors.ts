/**
 * Sidrat Color System
 *
 * Playful luxury palette — deep navy-indigo primary (Headspace-inspired),
 * warm cross-hue hero gradients per screen, rich Islamic accent palette.
 *
 * Design principles:
 *  • WCAG AA+ contrast ratios for all text on background
 *  • Warm neutrals (never pure grey) to feel inviting for children
 *  • Gradient pairs for every brand color for depth
 *  • Dark mode uses warm navy charcoal, not cold black
 *  • Each screen hero gradient has distinct cross-hue personality
 */

// ── Brand Colors (constant across modes) ──────────────────────────

export const brand = {
  /** Deep navy-indigo — primary CTAs, active states, app identity */
  primary: '#1A3A5C',
  primaryLight: '#2A6090',
  primaryDark: '#0F2440',
  primaryMuted: '#1A3A5C20',

  /** Deep emerald green — success, Quran, nature themes */
  secondary: '#1E6B42',
  secondaryLight: '#2E8B57',
  secondaryDark: '#145230',
  secondaryMuted: '#1E6B4220',

  /** Warm gold — achievements, accents, Islamic art inspiration */
  accent: '#D4982A',
  accentLight: '#EDC55E',
  accentDark: '#B07D1E',
  accentMuted: '#D4982A20',

  /** Deep coral — engagement, hearts, streak fire */
  coral: '#C74E59',
  coralLight: '#E8636F',
  coralDark: '#9E3844',

  /** Deep lavender — calm states, bedtime content, knowledge */
  lavender: '#5B4FA0',
  lavenderLight: '#7C6BC4',
  lavenderDark: '#3E3578',
} as const;

// ── Gradient Pairs ────────────────────────────────────────────────
// Use with LinearGradient or as reference for manual gradient layers.

export const gradients = {
  /** Primary CTA gradient — deep navy to medium blue */
  primary: ['#0F2440', '#2A6090'] as const,
  /** Achievement / gold shimmer */
  gold: ['#B07D1E', '#EDC55E'] as const,
  /** Success / nature */
  emerald: ['#145230', '#2E8B57'] as const,
  /** Streak fire */
  coral: ['#9E3844', '#E8636F'] as const,
  /** Night / calm */
  night: ['#0F1A28', '#1A3A5C'] as const,
  /** Warm sunset — onboarding backgrounds */
  sunset: ['#B07D1E', '#C74E59'] as const,
  /** Card shimmer overlay */
  shimmer: ['rgba(255,255,255,0)', 'rgba(255,255,255,0.08)', 'rgba(255,255,255,0)'] as const,

  // ── Screen Hero Gradients — cross-hue Headspace personality ───
  // Light mode hero gradients
  homeHero: ['#055F6E', '#0A3F5C'] as const,
  learnHero: ['#1A4A2E', '#055F6E'] as const,
  familyHero: ['#8A5E10', '#C74E59'] as const,
  progressHero: ['#055F6E', '#3D2B7A'] as const,
  settingsHero: ['#0F2440', '#1A3A5C'] as const,

  // ── Card & Surface Gradients ──────────────────────────────

  /** Glass-like frosted overlay (light mode) */
  glassLight: ['rgba(255,255,255,0.85)', 'rgba(255,255,255,0.65)'] as const,
  /** Glass-like frosted overlay (dark mode) */
  glassDark: ['rgba(20,24,32,0.88)', 'rgba(20,24,32,0.72)'] as const,
  /** Premium card border shimmer */
  borderShimmer: ['rgba(212,152,42,0.3)', 'rgba(26,58,92,0.3)', 'rgba(212,152,42,0.3)'] as const,
  /** Warm surface wash for card backgrounds */
  warmSurface: ['rgba(212,152,42,0.04)', 'rgba(26,58,92,0.04)'] as const,
  /** Hero card — navy to warm teal for CTAs */
  heroCta: ['#1A3A5C', '#055F6E'] as const,
} as const;

// Dark-mode hero gradients — deeper, richer stops for OLED-friendly dark theme
export const gradientsDark = {
  homeHero: ['#033A44', '#071F30'] as const,
  learnHero: ['#0E2A1A', '#033A44'] as const,
  familyHero: ['#5A3E0A', '#822F38'] as const,
  progressHero: ['#033A44', '#261750'] as const,
  settingsHero: ['#080E18', '#0F2440'] as const,
} as const;

// ── Semantic Palette ──────────────────────────────────────────────

export const palette = {
  light: {
    /** Warm off-white — never pure #FFF */
    background: '#F9F8F5',
    backgroundSecondary: '#F2F0EC',
    backgroundTertiary: '#E8E5DE',

    /** Card surfaces — slightly warmer than background */
    surface: '#FFFFFF',
    surfaceSecondary: '#F7F5F1',
    surfaceTertiary: '#ECEAE4',
    surfaceElevated: '#FFFFFF',

    /** Text — warm dark with navy tint, never pure black */
    text: '#1A2B35',
    textSecondary: '#4E5E6A',
    textTertiary: '#8A9299',
    textInverse: '#FFFFFF',

    /** Interactive states */
    interactive: brand.primary,
    interactiveHover: brand.primaryDark,
    interactivePressed: brand.primaryDark,
    interactiveMuted: brand.primaryMuted,

    /** Borders & dividers */
    separator: '#E2DDD5',
    border: '#D5D0C8',
    borderFocused: brand.primary,

    /** Overlay — navy tinted */
    overlay: 'rgba(15, 36, 64, 0.45)',
    overlayHeavy: 'rgba(15, 36, 64, 0.70)',

    /** Feedback colors */
    success: '#1E6B42',
    successMuted: '#1E6B4215',
    warning: '#D4982A',
    warningMuted: '#D4982A15',
    error: '#C74E59',
    errorMuted: '#C74E5915',
    info: brand.primary,
    infoMuted: brand.primaryMuted,
  },
  dark: {
    /** Warm dark earth — Oasis palette §6.6 */
    background: '#1C1917',
    backgroundSecondary: '#1F1D1A',
    backgroundTertiary: '#252220',

    /** Card surfaces — warm elevation steps */
    surface: '#292524',
    surfaceSecondary: '#302D2A',
    surfaceTertiary: '#3A3632',
    surfaceElevated: '#3A3632',

    /** Text — warm sand tones, never cool gray */
    text: '#FDF8F0',
    textSecondary: '#E8CFA4',
    textTertiary: '#A89070',
    textInverse: '#1C1917',

    /** Interactive states — olive primary */
    interactive: '#7EA14B',
    interactiveHover: '#A8C276',
    interactivePressed: '#5E7E32',
    interactiveMuted: '#7EA14B25',

    /** Borders & dividers — warm earth tones */
    separator: '#302D2A',
    border: '#3A3632',
    borderFocused: '#7EA14B',

    /** Overlay — earth-tinted */
    overlay: 'rgba(28, 25, 23, 0.65)',
    overlayHeavy: 'rgba(28, 25, 23, 0.85)',

    /** Feedback colors — brightened for dark bg */
    success: '#A8C276',
    successMuted: '#A8C27620',
    warning: '#FBBF24',
    warningMuted: '#FBBF2420',
    error: '#FB7185',
    errorMuted: '#FB718520',
    info: '#38BDF8',
    infoMuted: '#38BDF820',
  },
} as const;

// ── Category Colors — Oasis Palette (Design Spec §6.5) ───────────

export const categoryColors: Record<string, { solid: string; muted: string }> = {
  aqeedah: { solid: '#38BDF8', muted: '#F0F9FF' }, // sky400 / sky50
  salah: { solid: '#7EA14B', muted: '#F4F7EE' }, // olive400 / olive50
  wudu: { solid: '#0EA5E9', muted: '#E0F2FE' }, // sky500 / sky100
  quran: { solid: '#D4A017', muted: '#FFFBEB' }, // gold500 / gold50
  seerah: { solid: '#D4B07A', muted: '#FDF8F0' }, // sand400 / sand50
  adab: { solid: '#FB7185', muted: '#FFF1F2' }, // rose400 / rose50
  duaa: { solid: '#FBBF24', muted: '#FFFBEB' }, // gold400 / gold50
  stories: { solid: '#A8C276', muted: '#F4F7EE' }, // olive300 / olive50
};

// ── Achievement Rarity Colors ────────────────────────────────────

export const rarityColors = {
  bronze: { solid: '#CD7F32', glow: '#CD7F3240' },
  silver: { solid: '#8A9FAE', glow: '#8A9FAE40' },
  gold: { solid: '#D4982A', glow: '#D4982A40' },
  platinum: { solid: '#8B78C8', glow: '#8B78C840' },
} as const;
