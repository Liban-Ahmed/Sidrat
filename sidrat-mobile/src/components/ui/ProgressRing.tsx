/**
 * Progress Ring — circular progress indicator
 *
 * Used for daily progress, lesson completion, streaks.
 * Draws an SVG-style ring using borderRadius trick.
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../../theme';

interface ProgressRingProps {
    progress: number; // 0..1
    size?: number;
    strokeWidth?: number;
    color?: string;
    children?: React.ReactNode;
}

export function ProgressRing({
    progress,
    size = 80,
    strokeWidth = 6,
    color,
    children,
}: ProgressRingProps) {
    const { brand, typography } = useTheme();
    const fillColor = color ?? brand.primary;
    const pct = Math.min(Math.max(progress, 0), 1);

    // Simple approach: background ring + foreground ring via border trick
    // For a proper SVG ring, swap in react-native-svg later.
    return (
        <View style={[styles.container, { width: size, height: size }]}>
            {/* Track */}
            <View
                style={[
                    styles.ring,
                    {
                        width: size,
                        height: size,
                        borderRadius: size / 2,
                        borderWidth: strokeWidth,
                        borderColor: fillColor + '20',
                    },
                ]}
            />
            {/* Center content */}
            <View style={styles.center}>
                {children ?? (
                    <Text style={[typography.labelLarge, { color: fillColor }]}>
                        {Math.round(pct * 100)}%
                    </Text>
                )}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    ring: {
        position: 'absolute',
    },
    center: {
        alignItems: 'center',
        justifyContent: 'center',
    },
});
