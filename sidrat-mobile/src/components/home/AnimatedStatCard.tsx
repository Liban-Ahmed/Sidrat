/**
 * AnimatedStatCard — stat card with entrance animation, press feedback,
 * and an accented icon background.
 *
 * Features:
 *  • FadeInUp entrance with spring physics
 *  • Scale-down press feedback
 *  • Tinted icon background with subtle border
 *  • AnimatedCounter for rolling number display
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
    const { colors, typography, spacing, radius, shadows, springs, isDark } = useTheme();
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
                onPressIn={() => { scale.value = withSpring(0.93, springs.press); }}
                onPressOut={() => { scale.value = withSpring(1, springs.snappy); }}
                style={[
                    styles.statCard,
                    {
                        backgroundColor: isDark ? colors.surfaceSecondary : colors.surface,
                        borderRadius: radius.lg,
                        padding: spacing.md,
                        borderWidth: 1,
                        borderColor: isDark ? colors.border : color + '10',
                        ...shadows.card,
                    },
                ]}
                accessibilityRole="button"
                accessibilityLabel={`${label}: ${numericValue}`}
            >
                <View
                    style={[
                        styles.statIconBg,
                        {
                            backgroundColor: color + (isDark ? '20' : '12'),
                            borderRadius: radius.md,
                        },
                    ]}
                >
                    <Ionicons name={iconName} size={20} color={color} />
                </View>
                <AnimatedCounter
                    to={numericValue}
                    color={colors.text}
                    style={[typography.title2, { marginTop: spacing.xs }]}
                />
                <Text
                    style={[
                        typography.caption,
                        { color: colors.textSecondary, marginTop: spacing.xxxs },
                    ]}
                >
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
