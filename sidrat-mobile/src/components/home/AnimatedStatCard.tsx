/**
 * AnimatedStatCard — stat card with entrance animation and counter.
 */

import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, {
    FadeInUp,
    useSharedValue,
    useAnimatedStyle,
    withSpring,
} from 'react-native-reanimated';
import { useTheme } from '../../theme';
import { AnimatedCounter } from './AnimatedCounter';

const SPRING_CONFIG = { damping: 15, stiffness: 150, mass: 0.8 };
const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface AnimatedStatCardProps {
    label: string;
    numericValue: number;
    iconName: keyof typeof Ionicons.glyphMap;
    color: string;
    delay?: number;
}

export function AnimatedStatCard({
    label,
    numericValue,
    iconName,
    color,
    delay = 0,
}: AnimatedStatCardProps) {
    const { colors, typography, spacing, radius, shadows } = useTheme();
    const scale = useSharedValue(1);

    const pressStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }],
    }));

    return (
        <Animated.View
            entering={FadeInUp.delay(delay).duration(500).springify().damping(14)}
            style={[{ flex: 1 }, pressStyle]}
        >
            <AnimatedPressable
                onPressIn={() => { scale.value = withSpring(0.93, SPRING_CONFIG); }}
                onPressOut={() => { scale.value = withSpring(1, SPRING_CONFIG); }}
                style={[
                    styles.statCard,
                    {
                        backgroundColor: colors.surfaceSecondary,
                        borderRadius: radius.lg,
                        padding: spacing.md,
                        ...shadows.subtle,
                    },
                ]}
                accessibilityRole="button"
                accessibilityLabel={`${label}: ${numericValue}`}
            >
                <View
                    style={[
                        styles.statIconBg,
                        { backgroundColor: color + '15', borderRadius: radius.md },
                    ]}
                >
                    <Ionicons name={iconName} size={20} color={color} />
                </View>
                <AnimatedCounter
                    to={numericValue}
                    color={colors.text}
                    style={[typography.title2, { marginTop: spacing.xs }]}
                />
                <Text style={[typography.caption, { color: colors.textSecondary, marginTop: 2 }]}>
                    {label}
                </Text>
            </AnimatedPressable>
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    statCard: {
        alignItems: 'center',
    },
    statIconBg: {
        width: 40,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
    },
});
