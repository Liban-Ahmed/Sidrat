/**
 * EmptyState — Reusable placeholder for screens with no data.
 *
 * Renders a centered icon, title, optional subtitle, and optional CTA.
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../theme';
import { Button } from './Button';

interface EmptyStateProps {
    icon: keyof typeof Ionicons.glyphMap;
    title: string;
    subtitle?: string;
    actionLabel?: string;
    onAction?: () => void;
    /** Icon circle tint color — defaults to brand.primary */
    color?: string;
}

export function EmptyState({
    icon,
    title,
    subtitle,
    actionLabel,
    onAction,
    color,
}: EmptyStateProps) {
    const { brand, colors, typography, spacing, radius } = useTheme();
    const tint = color ?? brand.primary;

    return (
        <View style={styles.root} accessible accessibilityRole="text">
            <View style={[styles.iconCircle, { backgroundColor: tint + '15', borderRadius: radius.full }]}>
                <Ionicons name={icon} size={32} color={tint} />
            </View>
            <Text style={[typography.title3, { color: colors.text, marginTop: spacing.md, textAlign: 'center' }]}>
                {title}
            </Text>
            {subtitle && (
                <Text style={[typography.body, { color: colors.textSecondary, marginTop: spacing.xs, textAlign: 'center', lineHeight: 22 }]}>
                    {subtitle}
                </Text>
            )}
            {actionLabel && onAction && (
                <Button
                    title={actionLabel}
                    onPress={onAction}
                    variant="primary"
                    size="sm"
                    style={{ marginTop: spacing.lg }}
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    root: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 40 },
    iconCircle: { width: 72, height: 72, alignItems: 'center', justifyContent: 'center' },
});
