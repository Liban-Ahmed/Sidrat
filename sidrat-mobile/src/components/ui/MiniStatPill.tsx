/**
 * MiniStatPill — Unified stat pill used across Learn and Progress screens.
 *
 * Two layout modes:
 *  • vertical (default) — icon on top, value, label below (for horizontal scroll rows)
 *  • horizontal — icon left, value + label right (for inline display)
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../theme';

interface MiniStatPillProps {
    icon: keyof typeof Ionicons.glyphMap;
    value: string | number;
    label: string;
    color: string;
    /** Layout direction */
    layout?: 'vertical' | 'horizontal';
}

export function MiniStatPill({
    icon,
    value,
    label,
    color,
    layout = 'vertical',
}: MiniStatPillProps) {
    const { colors, typography, spacing, radius, shadows, isDark } = useTheme();

    if (layout === 'horizontal') {
        return (
            <View
                style={[
                    styles.hPill,
                    {
                        backgroundColor: color + '10',
                        borderRadius: radius.md,
                    },
                ]}
            >
                <Ionicons name={icon} size={14} color={color} />
                <Text style={[typography.headlineBold, { color, marginLeft: 6 }]}>{value}</Text>
                <Text style={[typography.labelXs, { color: color + '90', marginLeft: spacing.xxs, textTransform: 'uppercase' as const, flexShrink: 1 }]} numberOfLines={1}>{label}</Text>
            </View>
        );
    }

    return (
        <View
            style={[
                styles.vPill,
                {
                    backgroundColor: isDark ? colors.surfaceSecondary : colors.surface,
                    borderRadius: radius.lg,
                    borderWidth: 1,
                    borderColor: isDark ? colors.border : color + '15',
                    paddingHorizontal: spacing.md,
                    paddingVertical: spacing.sm,
                    ...shadows.subtle,
                },
            ]}
        >
            <View
                style={[
                    styles.vIconWrap,
                    { backgroundColor: color + '12', borderRadius: radius.sm },
                ]}
            >
                <Ionicons name={icon} size={15} color={color} />
            </View>
            <Text style={[typography.title3, { color: colors.text, marginTop: 6 }]}>
                {typeof value === 'number' ? value : value}
            </Text>
            <Text style={[typography.caption, { color: colors.textSecondary, marginTop: 1 }]} numberOfLines={1}>
                {label}
            </Text>
        </View>
    );
}

const styles = StyleSheet.create({
    // Vertical pill
    vPill: { alignItems: 'center', minWidth: 80 },
    vIconWrap: { width: 30, height: 30, alignItems: 'center', justifyContent: 'center' },

    // Horizontal pill
    hPill: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 14,
        paddingVertical: 10,
        minWidth: 80,
    },
});
