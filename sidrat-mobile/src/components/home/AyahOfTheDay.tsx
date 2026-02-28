/**
 * AyahOfTheDay — Daily Quran verse card for the home screen.
 *
 * Supports two modes:
 *   - Full (default): expanded card with arabic, transliteration, translation
 *   - Compact: slimmed card for 2-column grid layout
 */

import React, { useCallback, useMemo } from 'react';
import { View, Text, StyleSheet, Share, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../theme';
import { getAyahOfTheDay } from '../../data/ayahs';
import { ScalePress } from '../ScalePress';

interface AyahOfTheDayProps {
    compact?: boolean;
}

export function AyahOfTheDay({ compact = false }: AyahOfTheDayProps) {
    const { brand, colors, typography, spacing, radius, isDark } = useTheme();

    const ayah = useMemo(() => getAyahOfTheDay(), []);

    const handleShare = useCallback(async () => {
        const message = `بِسْمِ اللَّهِ الرَّحْمَـٰنِ الرَّحِيمِ\n\n${ayah.arabic}\n\n"${ayah.translation}"\n\n— ${ayah.surahName} ${ayah.ayahNumber}\n\nShared from Sidrat 🌿`;
        try {
            await Share.share(
                Platform.OS === 'ios'
                    ? { message }
                    : { message, title: 'Ayah of the Day' },
            );
        } catch { /* user cancelled */ }
    }, [ayah]);

    return (
        <ScalePress onPress={handleShare} accessibilityLabel={`Ayah of the Day: ${ayah.translation}`}>
            <View
                style={[
                    styles.container,
                    {
                        backgroundColor: isDark ? colors.surfaceSecondary : brand.secondary + '06',
                        borderRadius: radius.lg,
                        borderWidth: 1,
                        borderColor: isDark ? brand.secondary + '25' : brand.secondary + '12',
                        padding: compact ? spacing.sm : spacing.lg,
                    },
                ]}
            >
                <View style={styles.header}>
                    <Ionicons name="book" size={compact ? 14 : 16} color={brand.secondary} />
                    <Text
                        style={[
                            typography.captionBold,
                            { color: brand.secondary, marginLeft: 6, flex: 1 },
                        ]}
                        numberOfLines={1}
                    >
                        Ayah of the Day
                    </Text>
                    {!compact && (
                        <Ionicons name="share-outline" size={16} color={brand.secondary + '60'} />
                    )}
                </View>

                <Text
                    style={[
                        styles.arabicText,
                        {
                            color: colors.text,
                            marginTop: compact ? spacing.xs : spacing.md,
                            fontSize: compact ? 18 : 24,
                            lineHeight: compact ? 30 : 38,
                        },
                    ]}
                    numberOfLines={compact ? 2 : undefined}
                >
                    {ayah.arabic}
                </Text>

                {!compact && (
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
                )}

                <Text
                    style={[
                        compact ? typography.caption : typography.body,
                        {
                            color: colors.textSecondary,
                            marginTop: spacing.xs,
                            lineHeight: compact ? 18 : 22,
                        },
                    ]}
                    numberOfLines={compact ? 2 : undefined}
                >
                    &ldquo;{ayah.translation}&rdquo;
                </Text>

                <Text
                    style={[
                        typography.caption,
                        {
                            color: brand.secondary + '80',
                            marginTop: compact ? spacing.xxs : spacing.sm,
                            fontSize: compact ? 10 : 12,
                        },
                    ]}
                >
                    {ayah.surahName} {ayah.ayahNumber}
                </Text>
            </View>
        </ScalePress>
    );
}

const styles = StyleSheet.create({
    container: {},
    header: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    arabicText: {
        textAlign: 'right',
        writingDirection: 'rtl',
    },
});
