/**
 * ProgressBar — animated horizontal fill bar.
 * Generic — usable throughout the app.
 */

import React, { useEffect } from 'react';
import { View } from 'react-native';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withTiming,
    Easing,
} from 'react-native-reanimated';
import { useTheme } from '../theme';

interface ProgressBarProps {
    progress: number;
    color: string;
    trackColor: string;
    height?: number;
}

export function ProgressBar({
    progress,
    color,
    trackColor,
    height = 6,
}: ProgressBarProps) {
    const { radius: _radius } = useTheme();
    const width = useSharedValue(0);

    useEffect(() => {
        width.value = withTiming(Math.min(Math.max(progress, 0), 1), {
            duration: 900,
            easing: Easing.out(Easing.cubic),
        });
    }, [progress, width]);

    const fillStyle = useAnimatedStyle(() => ({
        width: `${width.value * 100}%` as any,
    }));

    return (
        <View
            style={{ height, borderRadius: height / 2, backgroundColor: trackColor, overflow: 'hidden' }}
            accessible
            accessibilityRole="progressbar"
            accessibilityValue={{ min: 0, max: 100, now: Math.round(progress * 100) }}
        >
            <Animated.View
                style={[
                    { height, borderRadius: height / 2, backgroundColor: color },
                    fillStyle,
                ]}
            />
        </View>
    );
}
