/**
 * MiniCrescent — beautifully rendered crescent moon with animated
 * entrance, pulsing glow for active state, and refined inactive styling.
 *
 * Islamic motif used in the WeekStreak component.
 *
 * Features:
 *  • Smooth spring entrance animation when transitioning to active
 *  • Soft pulsing glow behind active crescents
 *  • Inner shadow on crescent for dimensional feel
 *  • Proportional sizing that scales cleanly
 *  • Today variant with golden tint
 */

import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withSpring,
    withRepeat,
    withSequence,
    withTiming,
    FadeIn,
} from 'react-native-reanimated';

interface MiniCrescentProps {
    active: boolean;
    parentBg: string;
    size?: number;
    /** Golden accent for today's crescent */
    isToday?: boolean;
    /** Animate entrance (default true) */
    animated?: boolean;
}

export function MiniCrescent({
    active,
    parentBg,
    size = 16,
    isToday = false,
    animated = true,
}: MiniCrescentProps) {
    const glowScale = useSharedValue(1);
    const glowOpacity = useSharedValue(0.4);

    // Pulse glow for active crescents
    useEffect(() => {
        if (active) {
            glowScale.value = withRepeat(
                withSequence(
                    withTiming(1.3, { duration: 1200 }),
                    withTiming(1, { duration: 1200 }),
                ),
                -1,
                true,
            );
            glowOpacity.value = withRepeat(
                withSequence(
                    withTiming(0.6, { duration: 1200 }),
                    withTiming(0.25, { duration: 1200 }),
                ),
                -1,
                true,
            );
        }
    }, [active, glowScale, glowOpacity]);

    const glowStyle = useAnimatedStyle(() => ({
        transform: [{ scale: glowScale.value }],
        opacity: glowOpacity.value,
    }));

    // Active crescent entrance
    const crescentScale = useSharedValue(active ? 1 : 0.6);
    useEffect(() => {
        if (active && animated) {
            crescentScale.value = withSpring(1, {
                damping: 10,
                stiffness: 180,
                mass: 0.5,
            });
        }
    }, [active, animated, crescentScale]);

    const crescentScaleStyle = useAnimatedStyle(() => ({
        transform: [{ scale: crescentScale.value }],
    }));

    const moonColor = isToday ? '#FFD700' : '#FFFFFF';
    const glowColor = isToday ? 'rgba(255,215,0,0.3)' : 'rgba(255,255,255,0.15)';

    if (!active) {
        return (
            <View
                style={[
                    styles.inactive,
                    {
                        width: size,
                        height: size,
                        borderRadius: size / 2,
                    },
                ]}
            />
        );
    }

    return (
        <Animated.View
            entering={animated ? FadeIn.duration(300) : undefined}
            style={[{ width: size + 6, height: size + 6, alignItems: 'center', justifyContent: 'center' }, crescentScaleStyle]}
        >
            {/* Animated pulsing glow */}
            <Animated.View
                style={[
                    {
                        position: 'absolute',
                        width: size + 8,
                        height: size + 8,
                        borderRadius: (size + 8) / 2,
                        backgroundColor: glowColor,
                    },
                    glowStyle,
                ]}
            />

            {/* Main moon circle */}
            <View
                style={{
                    width: size,
                    height: size,
                    borderRadius: size / 2,
                    backgroundColor: moonColor,
                    // Subtle inner shadow for depth
                    shadowColor: moonColor,
                    shadowOffset: { width: 0, height: 0 },
                    shadowOpacity: 0.5,
                    shadowRadius: 3,
                }}
            />

            {/* Cutout circle for crescent shape */}
            <View
                style={{
                    position: 'absolute',
                    width: size * 0.72,
                    height: size * 0.72,
                    borderRadius: (size * 0.72) / 2,
                    backgroundColor: parentBg,
                    top: (size + 6) / 2 - (size * 0.72) / 2 - size * 0.02,
                    left: (size + 6) / 2 - (size * 0.72) / 2 + size * 0.28,
                }}
            />
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    inactive: {
        borderWidth: 1.5,
        borderColor: 'rgba(255,255,255,0.12)',
        backgroundColor: 'rgba(255,255,255,0.04)',
        // Subtle dashed feel via border style
        borderStyle: 'solid',
    },
});
