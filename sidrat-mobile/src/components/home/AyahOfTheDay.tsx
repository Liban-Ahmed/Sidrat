/**
 * AyahOfTheDay — Daily Quran verse card for the home screen.
 *
 * Design Spec §8.1 — sky50→sky100 gradient card, sky200 border.
 * Arabic in default font 24pt earth800, transliteration 14pt earth700,
 * translation in italic 14pt earth700. Audio button: 44×44pt olive400 circle with white play icon.
 *
 * Rotates through hardcoded array by day-of-year % array.length.
 */

import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useCallback, useMemo } from 'react';
import { View, Text, StyleSheet, Share, Platform } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { getAyahOfTheDay } from '../../data/ayahs';
import { useOasisColors } from '../../hooks/useOasisColors';
import { useSettingsStore } from '../../stores/settingsStore';
import { SPACING, RADIUS, TYPOGRAPHY, type AgeGroup } from '../../theme/tokens';
import haptic from '../../utils/haptics';
import { JuicyPressable } from '../common/JuicyPressable';

// ── Props ────────────────────────────────────────────────────────

interface AyahOfTheDayProps {
  compact?: boolean;
  ageGroup?: AgeGroup;
}

// ── Component ────────────────────────────────────────────────────

export function AyahOfTheDay({ compact = false, ageGroup = 'early' }: AyahOfTheDayProps) {
  const { colors: oasis, t, isDark } = useOasisColors();
  const soundEnabled = useSettingsStore((s) => s.soundEnabled);

  const ayah = useMemo(() => getAyahOfTheDay(), []);

  const arabicSize = (
    TYPOGRAPHY.arabic as Record<AgeGroup, { fontSize: number; lineHeight: number }>
  )[ageGroup];
  const bodySize = (TYPOGRAPHY.body as Record<AgeGroup, { fontSize: number; lineHeight: number }>)[
    ageGroup
  ];

  const handleShare = useCallback(async () => {
    haptic.light();
    const message = `بِسْمِ اللَّهِ الرَّحْمَـٰنِ الرَّحِيمِ\n\n${ayah.arabic}\n\n"${ayah.translation}"\n\n— ${ayah.surahName} ${ayah.ayahNumber}\n\nShared from Sidrat`;
    try {
      await Share.share(
        Platform.OS === 'ios' ? { message } : { message, title: 'Ayah of the Day' },
      );
    } catch {
      /* user cancelled */
    }
  }, [ayah]);

  const handlePlayAudio = useCallback(() => {
    haptic.medium();
    // Audio playback handled by TTS or audio service
    if (!soundEnabled) return;
    // TODO: integrate expo-speech or audio for ayah recitation
  }, [soundEnabled]);

  const gradientColors: [string, string] = isDark
    ? [oasis.infoBg, oasis.infoBg]
    : [t.sky50, t.sky100];

  return (
    <Animated.View entering={FadeInDown.duration(400).springify().damping(20)}>
      <JuicyPressable
        onPress={handleShare}
        accessibilityLabel={`Ayah of the Day: ${ayah.translation}. Tap to share.`}
        accessibilityRole="button"
      >
        <LinearGradient
          colors={gradientColors}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[
            styles.container,
            {
              borderColor: isDark ? oasis.infoBorder : t.sky200,
              padding: compact ? SPACING.sm : SPACING.md,
            },
          ]}
        >
          {/* Header */}
          <View style={styles.header}>
            <Text style={[styles.label, { color: isDark ? oasis.info : t.sky500 }]}>
              AYAH OF THE DAY
            </Text>
            {!compact && (
              <JuicyPressable
                onPress={handlePlayAudio}
                accessibilityLabel="Play ayah audio"
                accessibilityRole="button"
                style={styles.audioBtn}
              >
                <View style={[styles.audioBtnInner, { backgroundColor: oasis.primary }]}>
                  <Ionicons name="play" size={16} color={t.white} />
                </View>
              </JuicyPressable>
            )}
          </View>

          {/* Bismillah */}
          <Text
            style={[
              styles.bismillah,
              {
                color: oasis.textPrimary,
                fontSize: compact ? Math.max(arabicSize.fontSize - 6, 18) : arabicSize.fontSize - 2,
                lineHeight: compact
                  ? Math.max(arabicSize.lineHeight - 8, 28)
                  : arabicSize.lineHeight - 4,
              },
            ]}
            numberOfLines={compact ? 1 : undefined}
          >
            بِسْمِ اللَّهِ الرَّحْمَـٰنِ الرَّحِيمِ
          </Text>

          {/* Arabic text */}
          <Text
            style={[
              styles.arabicText,
              {
                color: oasis.textPrimary,
                fontSize: compact ? Math.max(arabicSize.fontSize - 4, 20) : arabicSize.fontSize,
                lineHeight: compact
                  ? Math.max(arabicSize.lineHeight - 6, 32)
                  : arabicSize.lineHeight,
              },
            ]}
            numberOfLines={compact ? 2 : undefined}
          >
            {ayah.arabic}
          </Text>

          {/* Transliteration */}
          {!compact && (
            <Text
              style={[
                styles.transliteration,
                {
                  color: oasis.textSecondary,
                  fontSize: Math.max(bodySize.fontSize - 2, 12),
                  lineHeight: Math.max(bodySize.lineHeight - 4, 16),
                },
              ]}
              numberOfLines={2}
            >
              {ayah.transliteration}
            </Text>
          )}

          {/* Translation */}
          <Text
            style={[
              styles.translation,
              {
                color: oasis.textSecondary,
                fontSize: Math.max(bodySize.fontSize - 1, 13),
                lineHeight: Math.max(bodySize.lineHeight - 2, 18),
              },
            ]}
            numberOfLines={compact ? 2 : undefined}
          >
            &ldquo;{ayah.translation}&rdquo;
          </Text>

          {/* Source */}
          <Text style={[styles.source, { color: isDark ? oasis.info : t.sky500 }]}>
            — {ayah.surahName} {ayah.ayahNumber}
          </Text>
        </LinearGradient>
      </JuicyPressable>
    </Animated.View>
  );
}

// ── Styles ───────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    borderRadius: RADIUS.lg,
    borderWidth: 1.5,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  label: {
    fontFamily: 'Nunito-Bold',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
  audioBtn: {
    // Outer pressable area
  },
  audioBtnInner: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bismillah: {
    textAlign: 'right',
    writingDirection: 'rtl',
    marginTop: SPACING.sm,
    fontStyle: 'italic',
  },
  arabicText: {
    textAlign: 'right',
    writingDirection: 'rtl',
    marginTop: SPACING.xs,
  },
  transliteration: {
    fontFamily: 'Nunito-Regular',
    fontStyle: 'italic',
    marginTop: SPACING.sm,
  },
  translation: {
    fontFamily: 'Nunito-Regular',
    fontStyle: 'italic',
    marginTop: SPACING.xs,
  },
  source: {
    fontFamily: 'Nunito-Regular',
    fontSize: 12,
    lineHeight: 16,
    marginTop: SPACING.xs,
  },
});
