/**
 * DuaOfTheDay — Calming daily dua card for the home screen.
 *
 * Shows today's dua with:
 *   • Arabic text
 *   • Transliteration
 *   • English meaning
 *   • Source reference
 *   • Category-themed icon
 *
 * Design: Warm lavender-tinted card with elegant typography,
 * subtle gradient borders, gentle entrance animation.
 */

import React, { useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../../theme';
import { getDuaOfTheDay, type Dua } from '../../data/duas';

const CATEGORY_META: Record<Dua['category'], { icon: string; label: string }> = {
    morning: { icon: 'sunny-outline', label: 'Morning' },
    evening: { icon: 'moon-outline', label: 'Evening' },
    food: { icon: 'restaurant-outline', label: 'Food' },
    travel: { icon: 'airplane-outline', label: 'Travel' },
    sleep: { icon: 'bed-outline', label: 'Sleep' },
    general: { icon: 'heart-outline', label: 'General' },
    protection: { icon: 'shield-checkmark-outline', label: 'Protection' },
    gratitude: { icon: 'sparkles-outline', label: 'Gratitude' },
};

export function DuaOfTheDay() {
    const { brand, colors, typography, spacing, radius, shadows, isDark } = useTheme();

    const dua = useMemo(() => getDuaOfTheDay(), []);
    const meta = CATEGORY_META[dua.category];

    return (
        <Animated.View entering={FadeInDown.duration(600).springify().damping(16)}>
            <View
                style={[
                    styles.container,
                    {
                        backgroundColor: colors.surface,
                        borderRadius: radius.xl,
                        borderWidth: 1,
                        borderColor: isDark ? colors.border : brand.lavender + '18',
                        ...shadows.cardPremium,
                    },
                ]}
            >
                {/* Decorative top strip — lavender/gold */}
                <LinearGradient
                    colors={[brand.lavender + '30', brand.accent + '20', brand.lavender + '30']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.accentStrip}
                />

                <View style={{ padding: spacing.lg }}>
                    {/* Header */}
                    <View style={styles.header}>
                        <View
                            style={[
                                styles.iconCircle,
                                { backgroundColor: brand.lavender + '12', borderRadius: radius.full },
                            ]}
                        >
                            <Ionicons name="hand-left" size={16} color={brand.lavender} />
                        </View>
                        <Text style={[typography.caption, { color: brand.lavender, marginLeft: spacing.xs, flex: 1 }]}>
                            Dua of the Day
                        </Text>
                        <View
                            style={[
                                styles.categoryBadge,
                                {
                                    backgroundColor: brand.lavender + '10',
                                    borderRadius: radius.full,
                                    paddingHorizontal: spacing.sm,
                                    paddingVertical: spacing.xxs,
                                },
                            ]}
                        >
                            <Ionicons
                                name={meta.icon as any}
                                size={12}
                                color={brand.lavender}
                                style={{ marginRight: 4 }}
                            />
                            <Text style={[typography.caption, { color: brand.lavender }]}>
                                {meta.label}
                            </Text>
                        </View>
                    </View>

                    {/* Arabic text */}
                    <Text
                        style={[
                            styles.arabicText,
                            {
                                color: colors.text,
                                marginTop: spacing.md,
                                lineHeight: 38,
                            },
                        ]}
                    >
                        {dua.arabic}
                    </Text>

                    {/* Transliteration */}
                    <Text
                        style={[
                            typography.bodySmall,
                            {
                                color: colors.textTertiary,
                                marginTop: spacing.sm,
                                fontStyle: 'italic',
                            },
                        ]}
                    >
                        {dua.transliteration}
                    </Text>

                    {/* Translation */}
                    <Text
                        style={[
                            typography.body,
                            {
                                color: colors.textSecondary,
                                marginTop: spacing.xs,
                                lineHeight: 22,
                            },
                        ]}
                    >
                        "{dua.translation}"
                    </Text>

                    {/* Source */}
                    <Text
                        style={[
                            typography.caption,
                            {
                                color: colors.textTertiary,
                                marginTop: spacing.sm,
                            },
                        ]}
                    >
                        — {dua.source}
                    </Text>
                </View>
            </View>
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    container: {
        overflow: 'hidden',
    },
    accentStrip: {
        height: 3,
        width: '100%',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    iconCircle: {
        width: 28,
        height: 28,
        alignItems: 'center',
        justifyContent: 'center',
    },
    categoryBadge: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    arabicText: {
        fontSize: 22,
        textAlign: 'right',
        writingDirection: 'rtl',
    },
});
