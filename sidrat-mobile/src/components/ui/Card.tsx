/**
 * Card — Themed container with rich shadow depth and variants.
 *
 * Variants:
 *  • default — Standard card with warm shadow
 *  • elevated — Higher elevation, prominent shadow + subtle border glow
 *  • filled — Tinted background (pass `accentColor` for the tint)
 *  • outline — Transparent with border
 */

import React from 'react';
import { View, type ViewStyle, type ViewProps } from 'react-native';
import { useTheme } from '../../theme';

type CardVariant = 'default' | 'elevated' | 'filled' | 'outline';

interface CardProps extends ViewProps {
    variant?: CardVariant;
    /** Accent color for `filled` variant tinting */
    accentColor?: string;
    /** Remove default padding */
    noPadding?: boolean;
    style?: ViewStyle;
    children: React.ReactNode;
}

export function Card({
    variant = 'default',
    accentColor,
    noPadding = false,
    style,
    children,
    ...rest
}: CardProps) {
    const { colors, radius, shadows, spacing, isDark } = useTheme();

    const variantStyles: Record<CardVariant, ViewStyle> = {
        default: {
            backgroundColor: colors.surface,
            ...shadows.card,
        },
        elevated: {
            backgroundColor: colors.surfaceElevated,
            ...shadows.elevated,
            borderWidth: isDark ? 1 : 0,
            borderColor: isDark ? colors.border : 'transparent',
        },
        filled: {
            backgroundColor: (accentColor ?? colors.interactive) + (isDark ? '18' : '0A'),
            borderWidth: 1,
            borderColor: (accentColor ?? colors.interactive) + '20',
        },
        outline: {
            backgroundColor: 'transparent',
            borderWidth: 1.5,
            borderColor: colors.border,
        },
    };

    return (
        <View
            style={[
                {
                    borderRadius: radius.lg,
                    padding: noPadding ? 0 : spacing.md,
                    overflow: 'hidden',
                },
                variantStyles[variant],
                style,
            ]}
            {...rest}
        >
            {children}
        </View>
    );
}
