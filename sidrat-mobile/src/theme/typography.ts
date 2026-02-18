/**
 * Sidrat Typography System
 *
 * Uses system rounded fonts (SF Pro Rounded on iOS, Roboto on Android).
 * Improved over iOS: named text style presets with built-in line heights
 * that can be spread directly into StyleSheet definitions.
 */

import { Platform, TextStyle } from 'react-native';

const fontFamily = Platform.select({
    ios: 'System',
    android: 'Roboto',
    default: 'System',
});

// ── Text Style Factory ────────────────────────────────────────────

function text(
    size: number,
    weight: TextStyle['fontWeight'],
    lineHeight: number,
): TextStyle {
    return { fontSize: size, fontWeight: weight, lineHeight, fontFamily };
}

// ── Display ───────────────────────────────────────────────────────

export const typography = {
    /** 40pt bold — Splash screens, celebration numbers */
    displayLarge: text(40, '700', 48),
    /** 34pt bold — Section hero text */
    displayMedium: text(34, '700', 41),

    /** 80pt bold — XP counters, big celebration moments */
    heroLarge: text(80, '700', 88),
    /** 64pt bold — Streak counters */
    heroMedium: text(64, '700', 72),

    /** 34pt bold — Screen titles */
    largeTitle: text(34, '700', 41),
    /** 28pt bold — Card titles */
    title1: text(28, '700', 34),
    /** 22pt bold — Section headers */
    title2: text(22, '700', 28),
    /** 20pt semibold — Sub-section headers */
    title3: text(20, '600', 25),

    /** 18pt regular — Primary body text */
    bodyLarge: text(18, '400', 28),
    /** 16pt regular — Standard body */
    body: text(16, '400', 24),
    /** 14pt regular — Secondary body */
    bodySmall: text(14, '400', 20),

    /** 17pt semibold — Button labels, tab labels */
    labelLarge: text(17, '600', 22),
    /** 15pt semibold — Badge text, chips */
    label: text(15, '600', 20),
    /** 13pt semibold — Small labels */
    labelSmall: text(13, '600', 18),

    /** 12pt regular — Timestamps, auxiliary info */
    caption: text(12, '400', 16),
    /** 12pt semibold — Emphasized captions */
    captionBold: text(12, '600', 16),

    /** 16pt regular — Callout text, secondary CTAs */
    callout: text(16, '400', 21),
    /** 16pt semibold — Emphasized callout */
    calloutBold: text(16, '600', 21),

    /** 13pt regular — Footnote / helper text */
    footnote: text(13, '400', 18),

    /** 17pt bold — Headline within cards */
    headlineBold: text(17, '700', 22),
} as const;
