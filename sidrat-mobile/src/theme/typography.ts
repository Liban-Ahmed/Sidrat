/**
 * Sidrat Typography System
 *
 * Uses SF Pro Rounded on iOS and Roboto on Android.
 * Every text style includes letter-spacing tuned for readability
 * at its intended size. Line heights follow a 1.2–1.5× ratio
 * depending on the text role.
 *
 * Design choices:
 *  • Display sizes use tight tracking for impact
 *  • Body text uses generous line height for children's readability
 *  • Labels use medium tracking for clarity at small sizes
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
    letterSpacing: number = 0,
): TextStyle {
    return {
        fontSize: size,
        fontWeight: weight,
        lineHeight,
        letterSpacing,
        fontFamily,
    };
}

// ── Typography Scale ──────────────────────────────────────────────

export const typography = {
    // ── Display — splash, celebrations ────────────────────────────

    /** 44pt bold — Splash hero, big celebration numbers */
    displayLarge: text(44, '800', 52, -0.5),
    /** 36pt bold — Section hero text */
    displayMedium: text(36, '700', 44, -0.3),
    /** 28pt bold — Smaller display text */
    displaySmall: text(28, '700', 36, -0.2),

    // ── Hero Numbers — XP counters, streak numbers ───────────────

    /** 80pt extra-bold — XP counters, big celebration moments */
    heroLarge: text(80, '800', 88, -1.5),
    /** 56pt bold — Streak counters, level numbers */
    heroMedium: text(56, '700', 64, -1),

    // ── Titles ───────────────────────────────────────────────────

    /** 32pt bold — Screen titles */
    largeTitle: text(32, '700', 40, -0.3),
    /** 26pt bold — Card titles, major headings */
    title1: text(26, '700', 34, -0.2),
    /** 22pt bold — Section headers */
    title2: text(22, '700', 28, -0.1),
    /** 19pt semibold — Sub-section headers */
    title3: text(19, '600', 26, 0),

    // ── Body Text ────────────────────────────────────────────────

    /** 18pt regular — Primary body text (larger for children) */
    bodyLarge: text(18, '400', 28, 0.1),
    /** 16pt regular — Standard body */
    body: text(16, '400', 26, 0.15),
    /** 14pt regular — Secondary body */
    bodySmall: text(14, '400', 22, 0.1),
    /** 16pt medium — Emphasized body */
    bodyMedium: text(16, '500', 26, 0.1),

    // ── Labels ───────────────────────────────────────────────────

    /** 17pt semibold — Button labels, tab labels */
    labelLarge: text(17, '600', 22, 0.3),
    /** 15pt semibold — Badge text, chips */
    label: text(15, '600', 20, 0.3),
    /** 13pt semibold — Small labels */
    labelSmall: text(13, '600', 18, 0.4),
    /** 11pt bold — Tiny labels, XS badges */
    labelXs: text(11, '700', 14, 0.6),

    // ── Supporting ───────────────────────────────────────────────

    /** 12pt regular — Timestamps, auxiliary info */
    caption: text(12, '400', 16, 0.2),
    /** 12pt semibold — Emphasized captions */
    captionBold: text(12, '600', 16, 0.3),

    /** 16pt regular — Callout text, secondary CTAs */
    callout: text(16, '400', 22, 0.1),
    /** 16pt semibold — Emphasized callout */
    calloutBold: text(16, '600', 22, 0.1),

    /** 13pt regular — Footnote / helper text */
    footnote: text(13, '400', 18, 0.2),

    /** 17pt bold — Headline within cards */
    headlineBold: text(17, '700', 22, 0),

    // ── Decorative ───────────────────────────────────────────────

    /** Small uppercase label — section overlines */
    overline: {
        ...text(11, '700', 14, 1.5),
        textTransform: 'uppercase' as const,
    },
} as const;
