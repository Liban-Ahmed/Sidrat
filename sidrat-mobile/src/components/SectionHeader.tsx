/**
 * SectionHeader — title with optional "See All" link.
 * Generic component for any section heading.
 */

import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../theme';

interface SectionHeaderProps {
    title: string;
    onSeeAll?: () => void;
}

export function SectionHeader({ title, onSeeAll }: SectionHeaderProps) {
    const { colors, typography, brand } = useTheme();
    return (
        <View style={styles.row} accessible accessibilityRole="header">
            <Text style={[typography.title3, { color: colors.text }]}>{title}</Text>
            {onSeeAll && (
                <Pressable
                    onPress={onSeeAll}
                    hitSlop={12}
                    style={styles.seeAll}
                    accessibilityRole="button"
                    accessibilityLabel={`See all ${title}`}
                >
                    <Text style={[typography.labelSmall, { color: brand.primary }]}>See All</Text>
                    <Ionicons name="chevron-forward" size={14} color={brand.primary} style={{ marginLeft: 2 }} />
                </Pressable>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    seeAll: { flexDirection: 'row', alignItems: 'center' },
});
