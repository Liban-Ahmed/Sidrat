/**
 * ScreenHeader — Unified screen header component.
 *
 * Provides a consistent header pattern across all tab screens
 * with the Amiri display font, optional subtitle, and optional
 * decorative accent line with Islamic diamond motif.
 */

import React from 'react';
import { View, Text, StyleSheet, type ViewStyle } from 'react-native';
import { useTheme } from '../../theme';

interface ScreenHeaderProps {
    /** Main title (rendered in Amiri display font via largeTitle) */
    title: string;
    /** Optional subtitle below the title */
    subtitle?: string;
    /** Show decorative accent bar below title */
    accent?: boolean;
    /** Accent color — defaults to brand primary */
    accentColor?: string;
    /** Right-side accessory (e.g. notification bell, avatar) */
    rightAccessory?: React.ReactNode;
    /** Additional styles */
    style?: ViewStyle;
}

export function ScreenHeader({
    title,
    subtitle,
    accent = true,
    accentColor,
    rightAccessory,
    style,
}: ScreenHeaderProps) {
    const { colors, brand, typography, spacing } = useTheme();
    const barColor = accentColor ?? brand.primary;

    return (
        <View
            style={[
                styles.container,
                { paddingHorizontal: spacing.lg, paddingTop: spacing.sm, paddingBottom: spacing.xs },
                style,
            ]}
        >
            <View style={styles.row}>
                <View style={styles.textArea}>
                    <Text style={[typography.largeTitle, { color: colors.text }]}>
                        {title}
                    </Text>
                    {accent && (
                        <View style={styles.accentRow}>
                            <View style={[styles.accentBar, { backgroundColor: barColor }]} />
                            <View style={[styles.accentDot, { backgroundColor: barColor + '60' }]} />
                            <View style={[styles.accentDotSm, { backgroundColor: barColor + '30' }]} />
                        </View>
                    )}
                    {subtitle && (
                        <Text
                            style={[
                                typography.body,
                                { color: colors.textSecondary, marginTop: 2 },
                            ]}
                        >
                            {subtitle}
                        </Text>
                    )}
                </View>
                {rightAccessory && <View style={styles.rightSlot}>{rightAccessory}</View>}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {},
    row: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
    },
    textArea: { flex: 1 },
    rightSlot: { marginLeft: 12 },
    accentRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 4,
        marginBottom: 2,
    },
    accentBar: {
        width: 24,
        height: 3,
        borderRadius: 2,
    },
    accentDot: {
        width: 5,
        height: 5,
        borderRadius: 3,
        marginLeft: 5,
        transform: [{ rotate: '45deg' }],
    },
    accentDotSm: {
        width: 3,
        height: 3,
        borderRadius: 2,
        marginLeft: 4,
        transform: [{ rotate: '45deg' }],
    },
});
