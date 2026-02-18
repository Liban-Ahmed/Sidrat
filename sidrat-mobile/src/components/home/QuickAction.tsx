/**
 * QuickAction — single action tile in the quick-actions row.
 *
 * Features:
 *  • Tinted icon circle with subtle border
 *  • Spring press animation via ScalePress
 *  • Dark-mode adaptive surface
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
    const { colors, typography, spacing, radius, shadows, isDark } = useTheme();

    return (
        <ScalePress onPress={onPress} accessibilityLabel={label} haptic>
            <View
                style={[
                    styles.card,
                    {
                        backgroundColor: isDark ? colors.surfaceSecondary : colors.surface,
                        borderRadius: radius.lg,
                        padding: spacing.sm,
                        borderWidth: 1,
                        borderColor: isDark ? colors.border : color + '12',
                        ...shadows.subtle,
                    },
                ]}
            >
                <View
                    style={[
                        styles.iconCircle,
                        {
                            backgroundColor: color + (isDark ? '20' : '10'),
                            borderRadius: radius.md,
                        },
                    ]}
                >
                    <Ionicons name={icon} size={22} color={color} />
                </View>
                <Text
                    style={[
                        typography.labelSmall,
                        { color: colors.text, marginTop: spacing.xs },
                    ]}
                    numberOfLines={1}
                >
                    {label}
                </Text>
            </View>
        </ScalePress>
    );
}

const styles = StyleSheet.create({
    card: {
        width: 88,
        alignItems: 'center',
    },
    iconCircle: {
        width: 44,
        height: 44,
        alignItems: 'center',
        justifyContent: 'center',
    },
});
