/**
 * ScalePress — spring-animated pressable wrapper.
 * Provides tactile press-feedback across the app.
 */

import React from 'react';
import { Pressable, type ViewStyle, type StyleProp } from 'react-native';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withSpring,
} from 'react-native-reanimated';

const SPRING_CONFIG = { damping: 15, stiffness: 150, mass: 0.8 };
const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface ScalePressProps {
    children: React.ReactNode;
    onPress?: () => void;
    style?: StyleProp<ViewStyle>;
    accessibilityRole?: 'button' | 'link' | 'none';
    accessibilityLabel?: string;
}

export function ScalePress({
    children,
    onPress,
    style,
    accessibilityRole = 'button',
    accessibilityLabel,
}: ScalePressProps) {
    const scale = useSharedValue(1);
    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }],
    }));

    return (
        <AnimatedPressable
            onPressIn={() => { scale.value = withSpring(0.96, SPRING_CONFIG); }}
            onPressOut={() => { scale.value = withSpring(1, SPRING_CONFIG); }}
            onPress={onPress}
            style={[animatedStyle, style]}
            accessibilityRole={accessibilityRole}
            accessibilityLabel={accessibilityLabel}
        >
            {children}
        </AnimatedPressable>
    );
}
