/**
 * GradientHeader — Branded gradient header area for screen tops.
 *
 * Uses the theme gradient pairs to provide a distinctive,
 * rich visual identity at the top of key screens.
 * Supports children content overlay (title, subtitle, etc.)
 */

import React from 'react';
import { View, StyleSheet, type ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../../theme';

interface GradientHeaderProps {
    /** Gradient color pair — defaults to theme primary gradient */
    colors?: readonly [string, string] | string[];
    /** Height of the gradient area */
    height?: number;
    /** Additional style for outer container */
    style?: ViewStyle;
    children?: React.ReactNode;
}

export function GradientHeader({
    colors: gradientColors,
    height = 200,
    style,
    children,
}: GradientHeaderProps) {
    const { gradients } = useTheme();
    const finalColors = (gradientColors ?? gradients.primary) as [string, string, ...string[]];

    return (
        <View style={[{ height }, style]}>
            <LinearGradient
                colors={finalColors}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={StyleSheet.absoluteFill}
            />
            {/* Subtle geometric overlay for Islamic pattern feel */}
            <View style={styles.patternOverlay}>
                <View style={[styles.patternDot, styles.dot1]} />
                <View style={[styles.patternDot, styles.dot2]} />
                <View style={[styles.patternDot, styles.dot3]} />
            </View>
            {children}
        </View>
    );
}

const styles = StyleSheet.create({
    patternOverlay: {
        ...StyleSheet.absoluteFillObject,
        overflow: 'hidden',
    },
    patternDot: {
        position: 'absolute',
        borderRadius: 999,
        backgroundColor: 'rgba(255,255,255,0.04)',
    },
    dot1: { width: 180, height: 180, top: -60, right: -40 },
    dot2: { width: 120, height: 120, top: 40, left: -30 },
    dot3: { width: 80, height: 80, bottom: -20, right: 60 },
});
