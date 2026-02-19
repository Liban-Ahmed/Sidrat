/**
 * SkeletonLoader — Shimmer placeholder components for the home screen.
 *
 * Shows beautiful skeleton placeholders while data loads:
 *   • ShimmerBlock — a single shimmering rectangle
 *   • HomeSkeletonLoader — full-page skeleton matching the home layout
 *
 * Uses a translating linear gradient to create the shimmer effect.
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

// ── Shimmer Block ────────────────────────────────────────────────

interface ShimmerBlockProps {
    width: number | `${number}%`;
    height: number;
    borderRadius?: number;
    style?: object;
}

function ShimmerBlock({ width, height, borderRadius = 8, style }: ShimmerBlockProps) {
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
                {
                    width,
                    height,
                    borderRadius,
                    backgroundColor: baseColor,
                    overflow: 'hidden',
                },
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

// ── Home Skeleton Loader ─────────────────────────────────────────

export function HomeSkeletonLoader() {
    const { colors, spacing, radius, brand, isDark } = useTheme();

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            {/* Hero skeleton */}
            <View
                style={[
                    styles.heroSkeleton,
                    {
                        backgroundColor: isDark ? 'rgba(255,255,255,0.04)' : brand.primary + '08',
                        borderBottomLeftRadius: radius.xl,
                        borderBottomRightRadius: radius.xl,
                        paddingHorizontal: spacing.lg,
                        paddingTop: spacing.xl + 64,
                        paddingBottom: spacing.xl,
                    },
                ]}
            >
                <View style={styles.heroRow}>
                    {/* Avatar placeholder */}
                    <ShimmerBlock width={56} height={56} borderRadius={28} />
                    <View style={{ marginLeft: spacing.sm, flex: 1 }}>
                        {/* Greeting */}
                        <ShimmerBlock width={120} height={14} borderRadius={7} />
                        {/* Name */}
                        <ShimmerBlock
                            width={100}
                            height={22}
                            borderRadius={11}
                            style={{ marginTop: spacing.xs }}
                        />
                        {/* Subtitle */}
                        <ShimmerBlock
                            width={180}
                            height={12}
                            borderRadius={6}
                            style={{ marginTop: spacing.xs }}
                        />
                    </View>
                    {/* Settings icon placeholder */}
                    <ShimmerBlock width={44} height={44} borderRadius={22} />
                </View>
            </View>

            <View style={{ paddingHorizontal: spacing.md, marginTop: spacing.md }}>
                {/* Salah Reminder skeleton */}
                <ShimmerBlock
                    width="100%"
                    height={56}
                    borderRadius={radius.lg}
                />

                {/* Section header skeleton */}
                <View style={[styles.sectionRow, { marginTop: spacing.lg }]}>
                    <ShimmerBlock width={120} height={18} borderRadius={9} />
                    <ShimmerBlock width={60} height={14} borderRadius={7} />
                </View>

                {/* Lesson card skeleton */}
                <View
                    style={[
                        styles.cardSkeleton,
                        {
                            backgroundColor: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)',
                            borderRadius: radius.xl,
                            marginTop: spacing.sm,
                            padding: spacing.lg,
                            borderWidth: 1,
                            borderColor: isDark ? colors.border : 'rgba(0,0,0,0.04)',
                        },
                    ]}
                >
                    {/* Accent strip */}
                    <ShimmerBlock
                        width="100%"
                        height={3}
                        borderRadius={2}
                        style={{ marginBottom: spacing.sm }}
                    />
                    {/* Category badge */}
                    <ShimmerBlock width={90} height={24} borderRadius={12} />
                    {/* Title */}
                    <ShimmerBlock
                        width="80%"
                        height={20}
                        borderRadius={10}
                        style={{ marginTop: spacing.sm }}
                    />
                    {/* Description */}
                    <ShimmerBlock
                        width="100%"
                        height={14}
                        borderRadius={7}
                        style={{ marginTop: spacing.xs }}
                    />
                    <ShimmerBlock
                        width="60%"
                        height={14}
                        borderRadius={7}
                        style={{ marginTop: spacing.xxs }}
                    />
                    {/* Meta chips */}
                    <View style={[styles.chipRow, { marginTop: spacing.md }]}>
                        <ShimmerBlock width={70} height={28} borderRadius={14} />
                        <ShimmerBlock
                            width={80}
                            height={28}
                            borderRadius={14}
                            style={{ marginLeft: spacing.xs }}
                        />
                    </View>
                    {/* CTA button */}
                    <ShimmerBlock
                        width="100%"
                        height={48}
                        borderRadius={radius.lg}
                        style={{ marginTop: spacing.md }}
                    />
                </View>

                {/* Ayah card skeleton */}
                <View
                    style={[
                        styles.cardSkeleton,
                        {
                            backgroundColor: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)',
                            borderRadius: radius.xl,
                            marginTop: spacing.lg,
                            padding: spacing.lg,
                            borderWidth: 1,
                            borderColor: isDark ? colors.border : 'rgba(0,0,0,0.04)',
                        },
                    ]}
                >
                    <View style={styles.sectionRow}>
                        <ShimmerBlock width={28} height={28} borderRadius={14} />
                        <ShimmerBlock
                            width={100}
                            height={14}
                            borderRadius={7}
                            style={{ marginLeft: spacing.xs }}
                        />
                    </View>
                    {/* Arabic text */}
                    <ShimmerBlock
                        width="90%"
                        height={30}
                        borderRadius={8}
                        style={{ marginTop: spacing.md, alignSelf: 'flex-end' }}
                    />
                    {/* Translation lines */}
                    <ShimmerBlock
                        width="100%"
                        height={14}
                        borderRadius={7}
                        style={{ marginTop: spacing.sm }}
                    />
                    <ShimmerBlock
                        width="75%"
                        height={14}
                        borderRadius={7}
                        style={{ marginTop: spacing.xxs }}
                    />
                </View>
            </View>
        </View>
    );
}

// ── Styles ───────────────────────────────────────────────────────

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    heroSkeleton: {
        overflow: 'hidden',
    },
    heroRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    sectionRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    cardSkeleton: {
        overflow: 'hidden',
    },
    chipRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
});
