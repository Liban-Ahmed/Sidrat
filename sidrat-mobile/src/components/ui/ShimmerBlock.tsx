/**
 * ShimmerBlock — Shared animated skeleton placeholder block.
 *
 * A single shimmering rectangle used to compose per-screen skeleton loaders.
 */

import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withRepeat,
    withTiming,
    Easing,
    interpolate,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../../theme';

interface ShimmerBlockProps {
    width: number | `${number}%`;
    height: number;
    borderRadius?: number;
    style?: object;
}

export function ShimmerBlock({ width, height, borderRadius = 8, style }: ShimmerBlockProps) {
    const { isDark } = useTheme();
    const shimmerProgress = useSharedValue(0);

    useEffect(() => {
        shimmerProgress.value = withRepeat(
            withTiming(1, { duration: 1200, easing: Easing.inOut(Easing.ease) }),
            -1,
            false,
        );
    }, [shimmerProgress]);

    const shimmerStyle = useAnimatedStyle(() => ({
        transform: [{ translateX: interpolate(shimmerProgress.value, [0, 1], [-200, 200]) }],
    }));

    const baseColor = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)';
    const shimmerColor = isDark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.10)';

    return (
        <View
            style={[
                { width, height, borderRadius, backgroundColor: baseColor, overflow: 'hidden' },
                style,
            ]}
        >
            <Animated.View style={[StyleSheet.absoluteFill, shimmerStyle]}>
                <LinearGradient
                    colors={['transparent', shimmerColor, 'transparent']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={[StyleSheet.absoluteFill, { width: 200 }]}
                />
            </Animated.View>
        </View>
    );
}
