/**
 * QuickAction — single action button in the quick-actions row.
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../theme';
import { ScalePress } from '../ScalePress';

interface QuickActionProps {
    icon: keyof typeof Ionicons.glyphMap;
    label: string;
    color: string;
    onPress?: () => void;
}

export function QuickAction({ icon, label, color, onPress }: QuickActionProps) {
    const { colors, typography, spacing, radius, shadows } = useTheme();
    return (
        <ScalePress onPress={onPress} accessibilityLabel={label}>
            <View style={[
                styles.card,
                {
                    backgroundColor: colors.surface,
                    borderRadius: radius.lg,
                    padding: spacing.md,
                    ...shadows.subtle,
                },
            ]}>
                <View style={[
                    styles.iconCircle,
                    { backgroundColor: color + '12', borderRadius: radius.full },
                ]}>
                    <Ionicons name={icon} size={22} color={color} />
                </View>
                <Text
                    style={[typography.labelSmall, { color: colors.text, marginTop: spacing.xs }]}
                    numberOfLines={1}
                >
                    {label}
                </Text>
            </View>
        </ScalePress>
    );
}

const styles = StyleSheet.create({
    card: { width: 88, alignItems: 'center' },
    iconCircle: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
});
