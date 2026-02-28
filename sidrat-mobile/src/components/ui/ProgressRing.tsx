/**
 * ProgressRing — Animated circular progress indicator.
 *
 * Uses 4 rotated semi-circle quadrants for a true arc effect
 * without requiring react-native-svg. The fill animates smoothly
 * via Reanimated.
 *
 * Used for: daily progress, lesson completion, streaks.
 */

import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withTiming,
    Easing,
    interpolate,
} from 'react-native-reanimated';
import { useTheme } from '../../theme';

interface ProgressRingProps {
    progress: number; // 0..1
    size?: number;
    strokeWidth?: number;
    color?: string;
    trackColor?: string;
    /** Optional glow behind the ring */
    glow?: boolean;
    children?: React.ReactNode;
}

export function ProgressRing({
    progress,
    size = 80,
    strokeWidth = 6,
    color,
    trackColor,
    glow = false,
    children,
}: ProgressRingProps) {
    const { brand, typography, isDark } = useTheme();
    const fillColor = color ?? brand.primary;
    const track = trackColor ?? (isDark ? fillColor + '18' : fillColor + '12');
    const pct = Math.min(Math.max(progress, 0), 1);

    const animProgress = useSharedValue(0);
    useEffect(() => {
        animProgress.value = withTiming(pct, {
            duration: 1000,
            easing: Easing.out(Easing.cubic),
        });
    }, [pct, animProgress]);

    // Each half-circle covers 180°. We rotate them to fill the arc.
    const halfSize = size / 2;

    const leftStyle = useAnimatedStyle(() => {
        const rotate = interpolate(
            animProgress.value,
            [0, 0.5, 1],
            [0, 0, 180],
        );
        return {
            transform: [{ rotate: `${rotate}deg` }],
            opacity: animProgress.value > 0.5 ? 1 : 0,
        };
    });

    const rightStyle = useAnimatedStyle(() => {
        const rotate = interpolate(
            animProgress.value,
            [0, 0.5],
            [0, 180],
        );
        return {
            transform: [{ rotate: `${Math.min(rotate, 180)}deg` }],
        };
    });

    return (
        <View style={[styles.container, { width: size, height: size }]}>
            {/* Glow effect */}
            {glow && (
                <View
                    style={[
                        styles.glow,
                        {
                            width: size + 16,
                            height: size + 16,
                            borderRadius: (size + 16) / 2,
                            backgroundColor: fillColor + '15',
                        },
                    ]}
                />
            )}

            {/* Background track */}
            <View
                style={[
                    styles.ring,
                    {
                        width: size,
                        height: size,
                        borderRadius: halfSize,
                        borderWidth: strokeWidth,
                        borderColor: track,
                    },
                ]}
            />

            {/* Right half (0–50%) */}
            <View
                style={[
                    styles.halfClip,
                    {
                        width: halfSize,
                        height: size,
                        left: halfSize,
                        overflow: 'hidden',
                    },
                ]}
            >
                <Animated.View
                    style={[
                        rightStyle,
                        {
                            width: halfSize,
                            height: size,
                            borderTopRightRadius: halfSize,
                            borderBottomRightRadius: halfSize,
                            borderWidth: strokeWidth,
                            borderLeftWidth: 0,
                            borderColor: fillColor,
                            transformOrigin: 'left center',
                        },
                    ]}
                />
            </View>

            {/* Left half (50–100%) */}
            <View
                style={[
                    styles.halfClip,
                    {
                        width: halfSize,
                        height: size,
                        left: 0,
                        overflow: 'hidden',
                    },
                ]}
            >
                <Animated.View
                    style={[
                        leftStyle,
                        {
                            width: halfSize,
                            height: size,
                            left: 0,
                            borderTopLeftRadius: halfSize,
                            borderBottomLeftRadius: halfSize,
                            borderWidth: strokeWidth,
                            borderRightWidth: 0,
                            borderColor: fillColor,
                            transformOrigin: 'right center',
                        },
                    ]}
                />
            </View>

            {/* Center content */}
            <View style={styles.center}>
                {children ?? (
                    <Text style={[
                        size < 48 ? typography.captionBold : size < 64 ? typography.label : typography.labelLarge,
                        { color: fillColor, fontSize: Math.max(9, Math.round((size - strokeWidth * 2) * 0.26)) },
                    ]}>
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
    glow: {
        position: 'absolute',
    },
    ring: {
        position: 'absolute',
    },
    halfClip: {
        position: 'absolute',
        top: 0,
    },
    center: {
        alignItems: 'center',
        justifyContent: 'center',
    },
});
