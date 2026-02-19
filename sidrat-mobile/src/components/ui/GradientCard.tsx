/**
 * GradientCard — Card with a gradient background.
 *
 * A elevated card surface with gradient fill, perfect for
 * hero CTAs, achievement showcases, and featured content.
 * Includes subtle geometric overlay for brand texture.
 */

import React from 'react';
import { View, StyleSheet, type ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../../theme';

interface GradientCardProps {
    /** Gradient color pair */
    colors?: readonly string[] | string[];
    /** Card border radius */
    borderRadius?: number;
    /** Additional styles */
    style?: ViewStyle;
    children: React.ReactNode;
}

export function GradientCard({
    colors: gradientColors,
    borderRadius: br,
    style,
    children,
}: GradientCardProps) {
    const { gradients, radius, spacing, shadows } = useTheme();
    const finalColors = (gradientColors ?? [...gradients.primary]) as [string, string, ...string[]];
    const finalRadius = br ?? radius.xl;

    return (
        <View
            style={[
                {
                    borderRadius: finalRadius,
                    overflow: 'hidden',
                    ...shadows.card,
                },
                style,
            ]}
        >
            <LinearGradient
                colors={finalColors}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={StyleSheet.absoluteFill}
            />
            {/* Subtle geometric texture overlay */}
            <View style={styles.textureOverlay}>
                <View style={[styles.circle, styles.circle1]} />
                <View style={[styles.circle, styles.circle2]} />
            </View>
            <View style={{ padding: spacing.lg }}>{children}</View>
        </View>
    );
}

const styles = StyleSheet.create({
    textureOverlay: {
        ...StyleSheet.absoluteFillObject,
        overflow: 'hidden',
    },
    circle: {
        position: 'absolute',
        borderRadius: 999,
        backgroundColor: 'rgba(255,255,255,0.06)',
    },
    circle1: { width: 150, height: 150, top: -50, right: -30 },
    circle2: { width: 100, height: 100, bottom: -30, left: -20 },
});
