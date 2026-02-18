/**
 * ArabicText — renders Arabic text with proper RTL styling and Amiri font.
 *
 * Usage:
 *   <ArabicText>بِسْمِ اللّٰهِ</ArabicText>
 *   <ArabicText size="lg" bold>الحمد لله</ArabicText>
 */

import React from 'react';
import { Text, TextStyle, StyleSheet, I18nManager } from 'react-native';

type ArabicSize = 'sm' | 'md' | 'lg' | 'xl' | 'xxl';

interface ArabicTextProps {
    children: React.ReactNode;
    size?: ArabicSize;
    bold?: boolean;
    color?: string;
    style?: TextStyle | TextStyle[];
    /** Center the text (default: true) */
    center?: boolean;
    /** Number of lines before truncating */
    numberOfLines?: number;
}

const SIZE_MAP: Record<ArabicSize, number> = {
    sm: 18,
    md: 24,
    lg: 32,
    xl: 40,
    xxl: 52,
};

const LINE_HEIGHT_RATIO = 1.8; // Arabic text needs more line height

export function ArabicText({
    children,
    size = 'md',
    bold = false,
    color,
    style,
    center = true,
    numberOfLines,
}: ArabicTextProps) {
    const fontSize = SIZE_MAP[size];

    return (
        <Text
            style={[
                styles.base,
                {
                    fontSize,
                    lineHeight: fontSize * LINE_HEIGHT_RATIO,
                    fontFamily: bold ? 'Amiri-Bold' : 'Amiri-Regular',
                    textAlign: center ? 'center' : 'right',
                },
                color ? { color } : undefined,
                style,
            ]}
            numberOfLines={numberOfLines}
        >
            {children}
        </Text>
    );
}

const styles = StyleSheet.create({
    base: {
        writingDirection: 'rtl',
        // Android needs explicit RTL handling
        ...(I18nManager.isRTL ? {} : { direction: 'rtl' as const }),
    },
});
