/**
 * Badge — Status indicator with size variants, dot mode, and pulse animation.
 *
 * Variants:
 *  • default — Tinted pill with label
 *  • solid — Solid colored pill
 *  • dot — Small status dot (no label)
 */

import React, { useEffect } from 'react';
import { Text, StyleSheet } from 'react-native';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withRepeat,
    withSequence,
    withTiming,
} from 'react-native-reanimated';
import { useTheme } from '../../theme';

type BadgeVariant = 'default' | 'solid' | 'dot';
type BadgeSize = 'sm' | 'md' | 'lg';

interface BadgeProps {
    label?: string;
    color?: string;
    icon?: string; // emoji fallback
    variant?: BadgeVariant;
    size?: BadgeSize;
    /** Animate with a gentle pulse (great for "new" or "live") */
    pulse?: boolean;
}

const SIZE_CONFIG: Record<BadgeSize, { pv: number; ph: number; dot: number }> = {
    sm: { pv: 2, ph: 8, dot: 6 },
    md: { pv: 4, ph: 12, dot: 8 },
    lg: { pv: 6, ph: 16, dot: 10 },
};

export function Badge({
    label,
    color,
    icon,
    variant = 'default',
    size = 'md',
    pulse = false,
}: BadgeProps) {
    const { brand, typography, radius } = useTheme();
    const bg = color ?? brand.primary;
    const cfg = SIZE_CONFIG[size];

    // ── Pulse animation ──────────────────────────────────────────
    const pulseScale = useSharedValue(1);
    useEffect(() => {
        if (pulse) {
            pulseScale.value = withRepeat(
                withSequence(
                    withTiming(1.08, { duration: 800 }),
                    withTiming(1, { duration: 800 }),
                ),
                -1,
                true,
            );
        }
    }, [pulse, pulseScale]);
    const pulseStyle = useAnimatedStyle(() => ({
        transform: [{ scale: pulseScale.value }],
    }));

    // ── Dot variant ──────────────────────────────────────────────
    if (variant === 'dot') {
        return (
            <Animated.View
                style={[
                    {
                        width: cfg.dot,
                        height: cfg.dot,
                        borderRadius: cfg.dot / 2,
                        backgroundColor: bg,
                    },
                    pulse && pulseStyle,
                ]}
            />
        );
    }

    // ── Text sizing ──────────────────────────────────────────────
    const textStyle =
        size === 'sm' ? typography.labelXs : size === 'lg' ? typography.label : typography.labelSmall;

    const isSolid = variant === 'solid';

    return (
        <Animated.View
            style={[
                styles.container,
                {
                    backgroundColor: isSolid ? bg : bg + '15',
                    borderRadius: radius.full,
                    paddingVertical: cfg.pv,
                    paddingHorizontal: cfg.ph,
                    borderWidth: isSolid ? 0 : 1,
                    borderColor: isSolid ? 'transparent' : bg + '25',
                },
                pulse && pulseStyle,
            ]}
        >
            {icon ? <Text style={[styles.icon, { fontSize: size === 'sm' ? 10 : 12 }]}>{icon}</Text> : null}
            {label ? (
                <Text
                    style={[
                        textStyle,
                        {
                            color: isSolid ? '#FFFFFF' : bg,
                            marginLeft: icon ? 4 : 0,
                        },
                    ]}
                >
                    {label}
                </Text>
            ) : null}
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'flex-start',
    },
    icon: {
        lineHeight: 16,
    },
});
