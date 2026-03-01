/**
 * DuaOfTheDay — Daily dua card for the home screen.
 *
 * Design Spec §8.1 — sky50→sky100 gradient card, sky200 border.
 * Arabic in Amiri 24pt earth800, translation in italic 14pt earth700.
 * Audio button: 44×44pt olive400 circle with white play icon.
 *
 * Rotates through hardcoded array by day-of-year % array.length.
 */

import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useCallback, useMemo } from 'react';
import { View, Text, StyleSheet, Share, Platform } from 'react-native';
import { getDuaOfTheDay } from '../../data/duas';
import { useOasisColors } from '../../hooks/useOasisColors';
import { useSettingsStore } from '../../stores/settingsStore';
import { SPACING, RADIUS, TYPOGRAPHY, type AgeGroup } from '../../theme/tokens';
import haptic from '../../utils/haptics';
import { JuicyPressable } from '../common/JuicyPressable';

// ── Props ────────────────────────────────────────────────────────

interface DuaOfTheDayProps {
  compact?: boolean;
  ageGroup?: AgeGroup;
}

// ── Component ────────────────────────────────────────────────────

export function DuaOfTheDay({ compact = false, ageGroup = 'early' }: DuaOfTheDayProps) {
  const { colors: oasis, t, isDark } = useOasisColors();
  const soundEnabled = useSettingsStore((s) => s.soundEnabled);

  const dua = useMemo(() => getDuaOfTheDay(), []);
  const arabicSize = (
    TYPOGRAPHY.arabic as Record<
      AgeGroup,
      { fontSize: number; lineHeight: number; fontFamily?: string }
    >
  )[ageGroup];

  const handleShare = useCallback(async () => {
    haptic.light();
    const message = `بِسْمِ اللَّهِ الرَّحْمَـٰنِ الرَّحِيمِ\n\n${dua.arabic}\n\n"${dua.translation}"\n\n— ${dua.source}\n\nShared from Sidrat`;
    try {
      await Share.share(Platform.OS === 'ios' ? { message } : { message, title: 'Dua of the Day' });
    } catch {
      /* user cancelled */
    }
  }, [dua]);

  const handlePlayAudio = useCallback(() => {
    haptic.medium();
    // Audio playback handled by TTS or audio service
    // Only if soundEnabled
    if (!soundEnabled) return;
    // TODO: integrate expo-speech or audio for dua recitation
  }, [soundEnabled]);

  const gradientColors: [string, string] = isDark
    ? [oasis.infoBg, oasis.infoBg]
    : [t.sky50, t.sky100];

  return (
    <JuicyPressable
      onPress={handleShare}
      accessibilityLabel={`Dua of the Day: ${dua.translation}. Tap to share.`}
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
            DUA OF THE DAY
          </Text>
          {!compact && (
            <JuicyPressable
              onPress={handlePlayAudio}
              accessibilityLabel="Play dua audio"
              accessibilityRole="button"
              style={styles.audioBtn}
            >
              <View style={[styles.audioBtnInner, { backgroundColor: oasis.primary }]}>
                <Ionicons name="play" size={18} color={t.white} />
              </View>
            </JuicyPressable>
          )}
        </View>

        {/* Arabic text */}
        <Text
          style={[
            styles.arabicText,
            {
              color: oasis.textPrimary,
              fontSize: compact ? Math.max(arabicSize.fontSize - 4, 20) : arabicSize.fontSize,
              lineHeight: compact ? Math.max(arabicSize.lineHeight - 6, 32) : arabicSize.lineHeight,
            },
          ]}
          numberOfLines={compact ? 2 : undefined}
        >
          {dua.arabic}
        </Text>

        {/* Translation */}
        <Text
          style={[
            styles.translation,
            {
              color: oasis.textSecondary,
              marginTop: SPACING.xs,
            },
          ]}
          numberOfLines={compact ? 2 : undefined}
        >
          &ldquo;{dua.translation}&rdquo;
        </Text>

        {/* Source */}
        <Text style={[styles.source, { color: isDark ? oasis.info : t.sky500 }]}>
          — {dua.source}
        </Text>
      </LinearGradient>
    </JuicyPressable>
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
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  arabicText: {
    textAlign: 'right',
    writingDirection: 'rtl',
    marginTop: SPACING.sm,
  },
  translation: {
    fontFamily: 'Nunito-Regular',
    fontSize: 14,
    lineHeight: 20,
    fontStyle: 'italic',
  },
  source: {
    fontFamily: 'Nunito-Regular',
    fontSize: 12,
    lineHeight: 16,
    marginTop: SPACING.xs,
  },
});
