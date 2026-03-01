/**
 * DuaOfTheDay — Daily dua card for the home screen.
 *
 * Supports two modes:
 *   - Full (default): expanded card with all details
 *   - Compact: slimmed card for 2-column grid layout
 */

import { Ionicons } from '@expo/vector-icons';
import React, { useCallback, useMemo } from 'react';
import { View, Text, StyleSheet, Share, Platform } from 'react-native';
import { getDuaOfTheDay, type Dua } from '../../data/duas';
import { useTheme } from '../../theme';
import { ScalePress } from '../ScalePress';

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

interface DuaOfTheDayProps {
  compact?: boolean;
}

export function DuaOfTheDay({ compact = false }: DuaOfTheDayProps) {
  const { brand, colors, typography, spacing, radius, isDark } = useTheme();

  const dua = useMemo(() => getDuaOfTheDay(), []);
  const meta = CATEGORY_META[dua.category];

  const handleShare = useCallback(async () => {
    const message = `بِسْمِ اللَّهِ الرَّحْمَـٰنِ الرَّحِيمِ\n\n${dua.arabic}\n\n"${dua.translation}"\n\n— ${dua.source}\n\nShared from Sidrat`;
    try {
      await Share.share(Platform.OS === 'ios' ? { message } : { message, title: 'Dua of the Day' });
    } catch {
      /* user cancelled */
    }
  }, [dua]);

  return (
    <ScalePress onPress={handleShare} accessibilityLabel={`Dua of the Day: ${dua.translation}`}>
      <View
        style={[
          styles.container,
          {
            backgroundColor: isDark ? colors.surfaceSecondary : brand.lavender + '06',
            borderRadius: radius.lg,
            borderWidth: 1,
            borderColor: isDark ? brand.lavender + '25' : brand.lavender + '12',
            padding: compact ? spacing.sm : spacing.lg,
          },
        ]}
      >
        <View style={styles.header}>
          <Ionicons name="hand-left" size={compact ? 14 : 16} color={brand.lavender} />
          <Text
            style={[typography.captionBold, { color: brand.lavender, marginLeft: 6, flex: 1 }]}
            numberOfLines={1}
          >
            Dua of the Day
          </Text>
          {!compact && (
            <View style={styles.categoryTag}>
              <Ionicons name={meta.icon as any} size={11} color={brand.lavender + '80'} />
              <Text
                style={[
                  typography.caption,
                  { color: brand.lavender + '80', marginLeft: 3, fontSize: 10 },
                ]}
              >
                {meta.label}
              </Text>
            </View>
          )}
        </View>

        <Text
          style={[
            styles.arabicText,
            {
              color: colors.text,
              marginTop: compact ? spacing.xs : spacing.md,
              fontSize: compact ? 18 : 22,
              lineHeight: compact ? 30 : 38,
            },
          ]}
          numberOfLines={compact ? 2 : undefined}
        >
          {dua.arabic}
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
            {dua.transliteration}
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
          &ldquo;{dua.translation}&rdquo;
        </Text>

        <Text
          style={[
            typography.caption,
            {
              color: brand.lavender + '80',
              marginTop: compact ? spacing.xxs : spacing.sm,
              fontSize: compact ? 10 : 12,
            },
          ]}
        >
          — {dua.source}
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
  categoryTag: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  arabicText: {
    textAlign: 'right',
    writingDirection: 'rtl',
  },
});
