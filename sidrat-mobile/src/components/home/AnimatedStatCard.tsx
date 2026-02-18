/**
 * AnimatedStatCard — premium stat tile with layered depth, animated
 * entrance, spring press feedback, trend indicator, and rich
 * micro-interactions.
 *
 * Features:
 *  • Multi-layer card: accent strip + icon bg + content
 *  • Staggered entrance: icon → number → label
 *  • AnimatedCounter with pulse on completion
 *  • Optional trend arrow with color coding
 *  • Colored glow shadow that matches the accent color
 *  • Premium dark-mode treatment with luminous borders
 *  • Haptic press feedback
 */

import React from 'react';
import { View, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, {
    FadeInUp,
    FadeIn,
    useSharedValue,
    useAnimatedStyle,
    withSpring,
} from 'react-native-reanimated';
import { useTheme } from '../../theme';
import { AnimatedCounter } from './AnimatedCounter';
import { haptics } from '../../utils/haptics';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

type TrendDirection = 'up' | 'down' | 'flat' | 'none';

interface AnimatedStatCardProps {
    label: string;
    numericValue: number;
    iconName: keyof typeof Ionicons.glyphMap;
    color: string;
    delay?: number;
    /** Optional suffix after the number (e.g. " XP") */
    suffix?: string;
    /** Optional prefix before the number (e.g. "+") */
    prefix?: string;
    /** Show a trend direction indicator */
    trend?: TrendDirection;
    /** Callback when card is pressed */
    onPress?: () => void;
}

const TREND_ICONS: Record<TrendDirection, keyof typeof Ionicons.glyphMap> = {
    up: 'trending-up',
    down: 'trending-down',
    flat: 'remove-outline',
    none: 'remove-outline',
};

export function AnimatedStatCard({
    label,
    numericValue,
    iconName,
    color,
    delay = 0,
    suffix,
    prefix,
    trend = 'none',
    onPress,
}: AnimatedStatCardProps) {
    const { colors, typography, spacing, radius, springs, isDark } = useTheme();
    const scale = useSharedValue(1);

    const pressStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }],
    }));

    const handlePressIn = () => {
        scale.value = withSpring(0.92, springs.press);
    };

    const handlePressOut = () => {
        scale.value = withSpring(1, springs.snappy);
    };

    const handlePress = () => {
        haptics.light();
        onPress?.();
    };

    // Card glow shadow matching accent color
    const cardGlow = {
        shadowColor: color,
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: isDark ? 0.25 : 0.12,
        shadowRadius: 16,
        elevation: 4,
    };

    // Trend color
    const trendColor =
        trend === 'up'
            ? colors.success
            : trend === 'down'
                ? colors.error
                : colors.textTertiary;

    return (
        <Animated.View
            entering={FadeInUp.delay(delay).duration(500).springify().damping(14)}
            style={[{ flex: 1 }, pressStyle]}
        >
            <AnimatedPressable
                onPressIn={handlePressIn}
                onPressOut={handlePressOut}
                onPress={handlePress}
                style={[
                    styles.card,
                    {
                        backgroundColor: isDark ? colors.surfaceSecondary : colors.surface,
                        borderRadius: radius.lg,
                        padding: spacing.md,
                        borderWidth: 1,
                        borderColor: isDark
                            ? color + '25'
                            : color + '10',
                        ...cardGlow,
                    },
                ]}
                accessibilityRole="button"
                accessibilityLabel={`${label}: ${numericValue}${suffix ?? ''}`}
            >
                {/* Top accent strip */}
                <View
                    style={[
                        styles.accentStrip,
                        {
                            backgroundColor: color,
                            borderTopLeftRadius: radius.lg - 1,
                            borderTopRightRadius: radius.lg - 1,
                        },
                    ]}
                />

                {/* Icon with gradient-like layered background */}
                <Animated.View
                    entering={FadeIn.delay(delay + 150).duration(300)}
                    style={[
                        styles.iconContainer,
                        {
                            borderRadius: radius.md,
                        },
                    ]}
                >
                    {/* Outer subtle ring */}
                    <View
                        style={[
                            styles.iconOuter,
                            {
                                backgroundColor: color + (isDark ? '10' : '06'),
                                borderRadius: radius.md + 2,
                            },
                        ]}
                    />
                    {/* Inner icon bg */}
                    <View
                        style={[
                            styles.iconInner,
                            {
                                backgroundColor: color + (isDark ? '22' : '14'),
                                borderRadius: radius.md,
                            },
                        ]}
                    >
                        <Ionicons name={iconName} size={20} color={color} />
                    </View>
                </Animated.View>

                {/* Number with optional trend */}
                <View style={styles.valueRow}>
                    <AnimatedCounter
                        to={numericValue}
                        color={colors.text}
                        style={[typography.title2, { marginTop: spacing.sm }]}
                        suffix={suffix}
                        prefix={prefix}
                        pulse
                        duration={900}
                    />
                    {trend !== 'none' && (
                        <Animated.View
                            entering={FadeIn.delay(delay + 400).duration(300)}
                            style={[
                                styles.trendBadge,
                                {
                                    backgroundColor: trendColor + '15',
                                    borderRadius: radius.full,
                                },
                            ]}
                        >
                            <Ionicons name={TREND_ICONS[trend]} size={10} color={trendColor} />
                        </Animated.View>
                    )}
                </View>

                {/* Label */}
                <Animated.Text
                    entering={FadeIn.delay(delay + 250).duration(300)}
                    style={[
                        typography.caption,
                        {
                            color: colors.textSecondary,
                            marginTop: spacing.xxxs,
                            letterSpacing: 0.3,
                        },
                    ]}
                >
                    {label}
                </Animated.Text>
            </AnimatedPressable>
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    card: {
        alignItems: 'center',
        overflow: 'hidden',
    },
    accentStrip: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: 3,
    },
    iconContainer: {
        marginTop: 4,
        alignItems: 'center',
        justifyContent: 'center',
    },
    iconOuter: {
        position: 'absolute',
        width: 48,
        height: 48,
    },
    iconInner: {
        width: 40,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
    },
    valueRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    trendBadge: {
        width: 18,
        height: 18,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 8,
    },
});
