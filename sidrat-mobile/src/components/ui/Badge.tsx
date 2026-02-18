/**
 * XP / Streak / Category Badge
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../../theme';

interface BadgeProps {
    label: string;
    color?: string;
    icon?: string; // emoji fallback for now
}

export function Badge({ label, color, icon }: BadgeProps) {
    const { brand, typography, spacing, radius } = useTheme();

    const bg = color ?? brand.primary;

    return (
        <View
            style={[
                styles.container,
                {
                    backgroundColor: bg + '18',
                    borderRadius: radius.full,
                    paddingVertical: spacing.xxs,
                    paddingHorizontal: spacing.sm,
                },
            ]}
        >
            {icon ? <Text style={styles.icon}>{icon}</Text> : null}
            <Text
                style={[
                    typography.labelSmall,
                    { color: bg, marginLeft: icon ? 4 : 0 },
                ]}
            >
                {label}
            </Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'flex-start',
    },
    icon: {
        fontSize: 12,
    },
});
