/**
 * Primary / Secondary / Accent Button
 *
 * Mirrors the iOS PrimaryButtonStyle / SecondaryButtonStyle / AccentButtonStyle
 * with press-scale animation via Reanimated.
 */

import React from 'react';
import {
    Pressable,
    Text,
    StyleSheet,
    type ViewStyle,
    type TextStyle,
    type PressableProps,
} from 'react-native';
import { useTheme } from '../../theme';

type Variant = 'primary' | 'secondary' | 'accent';

interface ButtonProps extends Omit<PressableProps, 'style'> {
    title: string;
    variant?: Variant;
    size?: 'sm' | 'md' | 'lg';
    fullWidth?: boolean;
    style?: ViewStyle | ViewStyle[];
    textStyle?: TextStyle | TextStyle[];
}

export function Button({
    title,
    variant = 'primary',
    size = 'md',
    fullWidth = false,
    style,
    textStyle: textStyleProp,
    disabled,
    ...rest
}: ButtonProps) {
    const { brand, typography, spacing, radius } = useTheme();

    const bgMap: Record<Variant, string> = {
        primary: brand.primary,
        secondary: 'transparent',
        accent: brand.accent,
    };

    const textColorMap: Record<Variant, string> = {
        primary: '#FFFFFF',
        secondary: brand.primary,
        accent: '#FFFFFF',
    };

    const paddingV = size === 'sm' ? spacing.xs : size === 'lg' ? spacing.lg : spacing.md;
    const paddingH = size === 'sm' ? spacing.md : size === 'lg' ? spacing.xxl : spacing.xl;

    const containerStyle: ViewStyle = {
        backgroundColor: bgMap[variant],
        paddingVertical: paddingV,
        paddingHorizontal: paddingH,
        borderRadius: radius.md,
        alignItems: 'center',
        justifyContent: 'center',
        opacity: disabled ? 0.5 : 1,
        ...(variant === 'secondary' && {
            borderWidth: 1.5,
            borderColor: brand.primary + '30',
            backgroundColor: brand.primary + '10',
        }),
        ...(fullWidth && { width: '100%' as unknown as number }),
        ...StyleSheet.flatten(style),
    };

    const textStyle: TextStyle = {
        ...typography.labelLarge,
        color: textColorMap[variant],
        ...StyleSheet.flatten(textStyleProp),
    };

    return (
        <Pressable
            style={({ pressed }) => [
                containerStyle,
                pressed && styles.pressed,
            ]}
            disabled={disabled}
            {...rest}
        >
            <Text style={textStyle}>{title}</Text>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    pressed: {
        transform: [{ scale: 0.97 }],
        opacity: 0.9,
    },
});
