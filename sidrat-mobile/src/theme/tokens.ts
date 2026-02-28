/**
 * Sidrat Design Tokens — Oasis Palette (Design Spec §6)
 *
 * Single source of truth for every visual primitive used in the app.
 * Components consume these tokens through the semantic layer; only
 * this file may contain raw hex values.
 */

import type { ViewStyle } from 'react-native';

// ─────────────────────────────────────────────────────────────────
// §6.1  Complete Color Token Reference
// ─────────────────────────────────────────────────────────────────

export const tokens = {
  color: {
    // ── SAND — Backgrounds, surfaces, neutral states ──
    sand50: '#FDF8F0',
    sand100: '#FAF0E1',
    sand200: '#F2E0C4',
    sand300: '#E8CFA4',
    sand400: '#D4B07A',

    // ── OLIVE — Primary brand, success, growth, learning ──
    olive50: '#F4F7EE',
    olive100: '#E4EDD5',
    olive200: '#C9DAA9',
    olive300: '#A8C276',
    olive400: '#7EA14B',
    olive500: '#5E7E32',
    olive600: '#4A6528',

    // ── GOLD — Rewards, streaks, celebrations, special moments ──
    gold50: '#FFFBEB',
    gold100: '#FEF3C7',
    gold200: '#FDE68A',
    gold300: '#FCD34D',
    gold400: '#FBBF24',
    gold500: '#D4A017',
    gold600: '#B8860B',

    // ── SKY — Info, Quran-related, calm, guidance ──
    sky50: '#F0F9FF',
    sky100: '#E0F2FE',
    sky200: '#BAE6FD',
    sky300: '#7DD3FC',
    sky400: '#38BDF8',
    sky500: '#0EA5E9',

    // ── ROSE — Emotions, hearts, warmth, gentleness ──
    rose50: '#FFF1F2',
    rose100: '#FFE4E6',
    rose200: '#FECDD3',
    rose300: '#FDA4AF',
    rose400: '#FB7185',

    // ── EARTH — Text, grounding, structural ──
    earth700: '#44403C',
    earth800: '#292524',
    earth900: '#1C1917',

    // ── CONSTANTS ──
    white: '#FFFFFF',
    cream: '#FFFEF7',
  },
} as const;

// ─────────────────────────────────────────────────────────────────
// §6.2  Semantic Colors — Light Mode
// ─────────────────────────────────────────────────────────────────

export interface SemanticColorMap {
  // Surfaces
  background: string;
  surface: string;
  surfaceAlt: string;
  surfaceBorder: string;
  // Text
  textPrimary: string;
  textSecondary: string;
  textMuted: string;
  textPlaceholder: string;
  // Brand / Primary
  primary: string;
  primaryStrong: string;
  primaryDark: string;
  primaryLight: string;
  primaryBorder: string;
  // Feedback
  correct: string;
  correctBg: string;
  incorrect: string;
  incorrectBg: string;
  // Rewards
  reward: string;
  rewardBg: string;
  rewardBorder: string;
  rewardText: string;
  // Info
  info: string;
  infoBg: string;
  infoBorder: string;
  // Warm / Emotion
  warmth: string;
  warmthBg: string;
}

export const semanticColors: SemanticColorMap = {
  // Surfaces
  background: tokens.color.cream,
  surface: tokens.color.white,
  surfaceAlt: tokens.color.sand50,
  surfaceBorder: tokens.color.sand200,

  // Text
  textPrimary: tokens.color.earth800,
  textSecondary: tokens.color.earth700,
  textMuted: tokens.color.sand400,
  textPlaceholder: tokens.color.sand300,

  // Brand / Primary
  primary: tokens.color.olive400,
  primaryStrong: tokens.color.olive500,
  primaryDark: tokens.color.olive600,
  primaryLight: tokens.color.olive50,
  primaryBorder: tokens.color.olive300,

  // Feedback
  correct: tokens.color.olive400,
  correctBg: tokens.color.olive50,
  incorrect: tokens.color.sand400,
  incorrectBg: tokens.color.gold50,

  // Rewards
  reward: tokens.color.gold400,
  rewardBg: tokens.color.gold50,
  rewardBorder: tokens.color.gold200,
  rewardText: tokens.color.gold500,

  // Info
  info: tokens.color.sky400,
  infoBg: tokens.color.sky50,
  infoBorder: tokens.color.sky200,

  // Warm / Emotion
  warmth: tokens.color.rose400,
  warmthBg: tokens.color.rose50,
};

// ─────────────────────────────────────────────────────────────────
// §6.3  Semantic Colors — Dark Mode
// ─────────────────────────────────────────────────────────────────

export const darkSemanticColors: SemanticColorMap = {
  // Surfaces — inverted earth tones, NOT cold grays
  background: tokens.color.earth900,
  surface: tokens.color.earth800,
  surfaceAlt: tokens.color.earth700,
  surfaceBorder: '#534D47',

  // Text — light sand tones
  textPrimary: tokens.color.sand50,
  textSecondary: tokens.color.sand200,
  textMuted: tokens.color.sand400,
  textPlaceholder: '#6B6560',

  // Brand — olive remains, slightly brightened for contrast
  primary: tokens.color.olive400,
  primaryStrong: tokens.color.olive300,
  primaryDark: tokens.color.olive200,
  primaryLight: '#2A3022',
  primaryBorder: tokens.color.olive400,

  // Feedback — same hues, adjusted for dark bg
  correct: tokens.color.olive300,
  correctBg: '#1E2A16',
  incorrect: tokens.color.sand300,
  incorrectBg: '#2A2518',

  // Rewards — gold pops on dark
  reward: tokens.color.gold400,
  rewardBg: '#2A2510',
  rewardBorder: tokens.color.gold500,
  rewardText: tokens.color.gold300,

  // Info
  info: tokens.color.sky400,
  infoBg: '#0F1A24',
  infoBorder: tokens.color.sky500,

  // Warm
  warmth: tokens.color.rose300,
  warmthBg: '#2A1518',
} as const;

// ─────────────────────────────────────────────────────────────────
// §3.1  Spring Physics Configs (react-native-reanimated)
// ─────────────────────────────────────────────────────────────────

export const SPRINGS = {
  /** Responsive — button presses, card taps */
  responsive: { damping: 15, stiffness: 150, mass: 0.5 },
  /** Gentle — screen transitions, cards appearing */
  gentle: { damping: 20, stiffness: 100, mass: 0.8 },
  /** Bouncy — celebrations, achievements, streak animations */
  bouncy: { damping: 8, stiffness: 180, mass: 0.6 },
  /** Snappy — toggles, tab switches */
  snappy: { damping: 20, stiffness: 300, mass: 0.5 },
} as const;

// ─────────────────────────────────────────────────────────────────
// §6.9  Spacing
// ─────────────────────────────────────────────────────────────────

export const SPACING = {
  /** 4pt — tight internal gaps (icon to text in badge) */
  xs: 4,
  /** 8pt — between related items (list item padding) */
  sm: 8,
  /** 16pt — standard card padding, section gaps */
  md: 16,
  /** 24pt — between sections, generous card padding */
  lg: 24,
  /** 32pt — screen-level horizontal margins */
  xl: 32,
  /** 48pt — major section breaks */
  xxl: 48,
} as const;

// ─────────────────────────────────────────────────────────────────
// §6.9  Border Radii
// ─────────────────────────────────────────────────────────────────

export const RADIUS = {
  /** 8pt — small badges, inline tags */
  sm: 8,
  /** 12pt — buttons, input fields, small cards */
  md: 12,
  /** 16pt — standard cards, answer options, modals */
  lg: 16,
  /** 24pt — large feature cards, Barakah Box, celebration modals */
  xl: 24,
  /** Circular — avatars, dots */
  full: 9999,
} as const;

// ─────────────────────────────────────────────────────────────────
// §6.10  Shadows (warm earth900 base — never cool gray)
// ─────────────────────────────────────────────────────────────────

export const SHADOW: Record<'rnSm' | 'rnMd' | 'rnLg', ViewStyle> = {
  rnSm: {
    shadowColor: tokens.color.earth900,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 3,
    elevation: 1,
  },
  rnMd: {
    shadowColor: tokens.color.earth900,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  },
  rnLg: {
    shadowColor: tokens.color.earth900,
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.1,
    shadowRadius: 32,
    elevation: 8,
  },
} as const;

// ─────────────────────────────────────────────────────────────────
// §6.8  Age-Aware Typography Scale
// ─────────────────────────────────────────────────────────────────

export type AgeGroup = 'toddler' | 'early' | 'middle' | 'preteen';

interface TypeSize {
  fontSize: number;
  lineHeight: number;
  fontFamily?: string;
}

export const TYPOGRAPHY: Record<
  'heading' | 'body' | 'arabic' | 'caption',
  Record<AgeGroup, TypeSize> | { all: TypeSize }
> = {
  heading: {
    toddler: { fontSize: 28, lineHeight: 36 },
    early: { fontSize: 24, lineHeight: 32 },
    middle: { fontSize: 22, lineHeight: 30 },
    preteen: { fontSize: 20, lineHeight: 28 },
  },
  body: {
    toddler: { fontSize: 22, lineHeight: 28 },
    early: { fontSize: 20, lineHeight: 26 },
    middle: { fontSize: 18, lineHeight: 24 },
    preteen: { fontSize: 16, lineHeight: 22 },
  },
  arabic: {
    toddler: { fontSize: 32, lineHeight: 44, fontFamily: 'Amiri' },
    early: { fontSize: 28, lineHeight: 40, fontFamily: 'Amiri' },
    middle: { fontSize: 26, lineHeight: 36, fontFamily: 'Amiri' },
    preteen: { fontSize: 24, lineHeight: 32, fontFamily: 'Amiri' },
  },
  caption: {
    all: { fontSize: 14, lineHeight: 18 },
  },
} as const;

// ─────────────────────────────────────────────────────────────────
// §6.7  Font Families
// ─────────────────────────────────────────────────────────────────

export const FONT = {
  /** Arabic display headings, logo */
  display: "'Reem Kufi', 'Amiri', serif",
  /** Headings, buttons, bold labels */
  heading: "'Nunito', 'SF Pro Rounded', sans-serif",
  /** Body text, descriptions */
  body: "'Nunito', 'SF Pro Text', sans-serif",
  /** Quranic text, Arabic content */
  arabic: "'Amiri', 'Scheherazade New', serif",
  /** Code, technical (rare) */
  mono: "'JetBrains Mono', monospace",
} as const;
