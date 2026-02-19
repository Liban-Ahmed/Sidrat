/**
 * AyahOfTheDay — Elegant daily Quran verse card for the home screen.
 *
 * Shows today's ayah with:
 *   • Arabic text in a distinguished style
 *   • Transliteration
 *   • English translation
 *   • Surah reference badge
 *
 * Design: Subtle emerald-tinted glass card with decorative crescent,
 * warm typography hierarchy, and gentle fade-in animation.
 */

import React, { useCallback, useMemo } from 'react';
import { View, Text, StyleSheet, Share, Platform } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../../theme';
import { getAyahOfTheDay } from '../../data/ayahs';
import { ScalePress } from '../ScalePress';

export function AyahOfTheDay() {
    const { brand, colors, typography, spacing, radius, shadows, isDark } = useTheme();

    const ayah = useMemo(() => getAyahOfTheDay(), []);

    const handleShare = useCallback(async () => {
        const message = `بِسْمِ اللَّهِ الرَّحْمَـٰنِ الرَّحِيمِ\n\n${ayah.arabic}\n\n"${ayah.translation}"\n\n— ${ayah.surahName} ${ayah.ayahNumber}\n\nShared from Sidrat 🌿`;
        try {
            await Share.share(
                Platform.OS === 'ios'
                    ? { message }
                    : { message, title: 'Ayah of the Day' },
            );
        } catch { /* user cancelled */ }
    }, [ayah]);

    return (
        <Animated.View entering={FadeInDown.duration(600).springify().damping(16)}>
            <View
                style={[
                    styles.container,
                    {
                        backgroundColor: colors.surface,
                        borderRadius: radius.xl,
                        borderWidth: 1,
                        borderColor: isDark ? colors.border : brand.secondary + '18',
                        ...shadows.cardPremium,
                    },
                ]}
            >
                {/* Decorative top strip */}
                <LinearGradient
                    colors={[brand.secondary + '30', brand.primary + '20', brand.secondary + '30']}
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
                                { backgroundColor: brand.secondary + '12', borderRadius: radius.full },
                            ]}
                        >
                            <Ionicons name="book" size={16} color={brand.secondary} />
                        </View>
                        <Text style={[typography.caption, { color: brand.secondary, marginLeft: spacing.xs, flex: 1 }]}>
                            Ayah of the Day
                        </Text>
                        <View
                            style={[
                                styles.surahBadge,
                                {
                                    backgroundColor: brand.secondary + '10',
                                    borderRadius: radius.full,
                                    paddingHorizontal: spacing.sm,
                                    paddingVertical: spacing.xxs,
                                },
                            ]}
                        >
                            <Text style={[typography.caption, { color: brand.secondary }]}>
                                {ayah.surahName} {ayah.ayahNumber}
                            </Text>
                        </View>
                        <ScalePress
                            onPress={handleShare}
                            accessibilityLabel="Share this ayah"
                            style={{
                                width: 32,
                                height: 32,
                                alignItems: 'center',
                                justifyContent: 'center',
                                marginLeft: spacing.xs,
                            }}
                        >
                            <Ionicons name="share-outline" size={18} color={brand.secondary + '80'} />
                        </ScalePress>
                    </View>

                    {/* Arabic text */}
                    <Text
                        style={[
                            styles.arabicText,
                            {
                                color: colors.text,
                                marginTop: spacing.md,
                                fontFamily: undefined, // system Arabic rendering
                                lineHeight: 38,
                            },
                        ]}
                    >
                        {ayah.arabic}
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
                        {ayah.transliteration}
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
                        "{ayah.translation}"
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
    surahBadge: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    arabicText: {
        fontSize: 24,
        textAlign: 'right',
        writingDirection: 'rtl',
    },
});
