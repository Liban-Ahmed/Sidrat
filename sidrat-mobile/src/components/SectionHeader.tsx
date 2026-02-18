/**
 * SectionHeader — title with optional "See All" link and decorative accent.
 *
 * Features:
 *  • Optional overline subtitle
 *  • Optional decorative accent bar
 *  • Animated "See All" press feedback
 */

import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../theme';

interface SectionHeaderProps {
    title: string;
    /** Small overline text above the title */
    overline?: string;
    /** Show a small decorative accent bar before the title */
    accent?: boolean;
    /** Accent bar color (defaults to brand primary) */
    accentColor?: string;
    onSeeAll?: () => void;
}

export function SectionHeader({
    title,
    overline,
    accent = false,
    accentColor,
    onSeeAll,
}: SectionHeaderProps) {
    const { colors, typography, brand, spacing } = useTheme();
    const barColor = accentColor ?? brand.primary;

    return (
        <View style={styles.row} accessible accessibilityRole="header">
            <View style={styles.left}>
                {accent && (
                    <View
                        style={[
                            styles.accentBar,
                            { backgroundColor: barColor, marginRight: spacing.xs },
                        ]}
                    />
                )}
                <View>
                    {overline && (
                        <Text
                            style={[
                                typography.overline,
                                { color: brand.primary, marginBottom: 2 },
                            ]}
                        >
                            {overline}
                        </Text>
                    )}
                    <Text style={[typography.title3, { color: colors.text }]}>{title}</Text>
                </View>
            </View>
            {onSeeAll && (
                <Pressable
                    onPress={onSeeAll}
                    hitSlop={12}
                    style={({ pressed }) => [
                        styles.seeAll,
                        {
                            backgroundColor: pressed ? colors.interactive + '10' : 'transparent',
                            borderRadius: 8,
                            paddingVertical: 4,
                            paddingHorizontal: 8,
                        },
                    ]}
                    accessibilityRole="button"
                    accessibilityLabel={`See all ${title}`}
                >
                    <Text style={[typography.label, { color: colors.interactive }]}>See All</Text>
                    <Ionicons name="chevron-forward" size={14} color={colors.interactive} style={{ marginLeft: 2 }} />
                </Pressable>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    left: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    accentBar: {
        width: 3,
        height: 20,
        borderRadius: 2,
    },
    seeAll: {
        flexDirection: 'row',
        alignItems: 'center',
    },
});
