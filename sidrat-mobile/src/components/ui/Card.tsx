/**
 * Themed Card component
 *
 * Adaptive background + shadow that works in both light and dark modes.
 */

import React from 'react';
import { View, type ViewStyle, type ViewProps } from 'react-native';
import { useTheme } from '../../theme';

interface CardProps extends ViewProps {
    variant?: 'default' | 'elevated';
    style?: ViewStyle;
    children: React.ReactNode;
}

export function Card({ variant = 'default', style, children, ...rest }: CardProps) {
    const { colors, radius, shadows } = useTheme();

    const shadow = variant === 'elevated' ? shadows.elevated : shadows.card;

    return (
        <View
            style={[
                {
                    backgroundColor: variant === 'elevated' ? colors.surfaceElevated : colors.surface,
                    borderRadius: radius.lg,
                    padding: 16,
                    ...shadow,
                },
                style,
            ]}
            {...rest}
        >
            {children}
        </View>
    );
}
