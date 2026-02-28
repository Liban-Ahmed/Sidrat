/**
 * TeachPhase -- Teaching content with Arabic showcase, narration,
 * key terms, and category-colored accents.
 */

import React, { useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import Animated, {
  FadeInDown,
  FadeIn,
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../theme';
import { haptics } from '../../utils/haptics';
import { useQuranAudio } from '../../hooks/useQuranAudio';
import type { TeachBlock } from '../../types/curriculum';
import { FormattedText } from './FormattedText';
import { QuranAudioButton } from './QuranAudioButton';

interface Props {
  block: TeachBlock;
  index: number;
  total: number;
  isNarrating: boolean;
  onNarrate: (text: string) => void;
  onStopNarration: () => void;
  onNext: () => void;
  isLast: boolean;
  accentColor: string;
}

export function TeachPhase({
  block,
  index,
  total,
  isNarrating,
  onNarrate,
  onStopNarration,
  onNext,
  isLast,
  accentColor,
}: Props) {
  const { brand, colors, typography, radius, isDark, shadows } = useTheme();

  const quranAudio = useQuranAudio();

  useEffect(() => {
    const timer = setTimeout(() => onNarrate(block.narration), 400);
    return () => clearTimeout(timer);
  }, [block.narration, onNarrate]);

  useEffect(() => {
    return () => {
      quranAudio.stop();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index]);

  useEffect(() => {
    if (isNarrating && (quranAudio.isPlaying || quranAudio.isLoading)) {
      quranAudio.stop();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isNarrating]);

  const handleNarrate = useCallback(
    (text: string) => {
      if (quranAudio.isPlaying || quranAudio.isLoading) {
        quranAudio.stop();
      }
      haptics.light();
      onNarrate(text);
    },
    [quranAudio, onNarrate],
  );

  const handleQuranPlayStart = useCallback(() => {
    onStopNarration();
  }, [onStopNarration]);

  const handleQuranPlay = useCallback(
    (globalAyahNumbers: number[]) => {
      if (globalAyahNumbers.length === 1) {
        quranAudio.play(globalAyahNumbers[0]!);
      } else {
        quranAudio.playSequence(globalAyahNumbers);
      }
    },
    [quranAudio],
  );

  // Narration pulse
  const narratePulse = useSharedValue(1);
  useEffect(() => {
    if (isNarrating) {
      narratePulse.value = withRepeat(
        withSequence(
          withTiming(1.06, { duration: 500, easing: Easing.inOut(Easing.ease) }),
          withTiming(1, { duration: 500, easing: Easing.inOut(Easing.ease) }),
        ),
        -1,
        true,
      );
    } else {
      narratePulse.value = withTiming(1, { duration: 150 });
    }
  }, [isNarrating, narratePulse]);

  const narratePulseStyle = useAnimatedStyle(() => ({
    transform: [{ scale: narratePulse.value }],
  }));

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Step counter */}
        <Animated.View entering={FadeInDown.delay(50).duration(400)}>
          <View
            style={[
              styles.stepBadge,
              {
                backgroundColor: isDark ? colors.surfaceTertiary : colors.backgroundSecondary,
                borderRadius: radius.full,
                alignSelf: 'flex-start',
              },
            ]}
          >
            <Text style={[typography.labelXs, { color: colors.textSecondary }]}>
              {index + 1} of {total}
            </Text>
          </View>
        </Animated.View>

        {/* Title */}
        <Animated.View entering={FadeInDown.delay(150).duration(500)}>
          <Text
            style={[typography.title1, { color: colors.text, marginTop: 12, marginBottom: 14 }]}
          >
            {block.title}
          </Text>
        </Animated.View>

        {/* Body */}
        <Animated.View entering={FadeInDown.delay(250).duration(500)}>
          <FormattedText style={[typography.body, { color: colors.textSecondary, lineHeight: 28 }]}>
            {block.body}
          </FormattedText>
        </Animated.View>

        {/* Speaker pill */}
        <Animated.View entering={FadeIn.delay(400).duration(400)} style={styles.speakerRow}>
          <Pressable onPress={() => handleNarrate(block.narration)} style={styles.speakerOuter}>
            <Animated.View
              style={[
                styles.speakerPill,
                {
                  backgroundColor: isNarrating
                    ? accentColor
                    : isDark
                      ? accentColor + '20'
                      : accentColor + '08',
                  borderRadius: radius.full,
                  shadowColor: isNarrating ? accentColor : 'transparent',
                  shadowOffset: { width: 0, height: 3 },
                  shadowOpacity: isNarrating ? 0.2 : 0,
                  shadowRadius: 8,
                },
                narratePulseStyle,
              ]}
            >
              <Ionicons
                name={isNarrating ? 'volume-high' : 'volume-medium-outline'}
                size={16}
                color={isNarrating ? '#FFF' : accentColor}
              />
              <Text style={[typography.labelSmall, { color: isNarrating ? '#FFF' : accentColor }]}>
                {isNarrating ? 'Playing...' : 'Listen'}
              </Text>
            </Animated.View>
          </Pressable>
        </Animated.View>

        {/* Arabic text showcase */}
        {block.arabic && (
          <Animated.View
            entering={FadeInDown.delay(500).duration(600)}
            style={[
              styles.arabicCard,
              {
                backgroundColor: isDark ? accentColor + '10' : accentColor + '05',
                borderRadius: radius.xl,
                borderWidth: 1,
                borderColor: accentColor + (isDark ? '20' : '12'),
                ...shadows.card,
              },
            ]}
          >
            <Text style={[styles.arabicText, { color: colors.text }]}>{block.arabic.text}</Text>

            {/* Simple separator */}
            <View style={[styles.separator, { backgroundColor: accentColor + '18' }]} />

            <Text
              style={[
                typography.callout,
                { color: accentColor, fontStyle: 'italic', textAlign: 'center' },
              ]}
            >
              {block.arabic.transliteration}
            </Text>
            <Text
              style={[
                typography.bodySmall,
                { color: colors.textSecondary, textAlign: 'center', marginTop: 2 },
              ]}
            >
              {block.arabic.translation}
            </Text>

            {block.arabic.quranRef && (
              <QuranAudioButton
                quranRef={block.arabic.quranRef}
                isPlaying={quranAudio.isPlaying}
                isLoading={quranAudio.isLoading}
                playingAyah={quranAudio.playingAyah}
                onPlay={handleQuranPlay}
                onPause={quranAudio.pause}
                onResume={quranAudio.resume}
                onPlayStart={handleQuranPlayStart}
              />
            )}
          </Animated.View>
        )}

        {/* Key terms */}
        {block.keyTerms && block.keyTerms.length > 0 && (
          <Animated.View entering={FadeInDown.delay(600).duration(500)} style={styles.termsSection}>
            <View style={styles.termsTitleRow}>
              <Ionicons name="bookmark" size={16} color={brand.secondary} />
              <Text style={[typography.label, { color: colors.text, marginLeft: 6 }]}>
                Key Terms
              </Text>
            </View>
            {block.keyTerms.map((term, i) => {
              const termColor = i % 2 === 0 ? accentColor : brand.secondary;
              return (
                <Animated.View key={i} entering={FadeInDown.delay(650 + i * 80).duration(400)}>
                  <View
                    style={[
                      styles.termCard,
                      {
                        backgroundColor: isDark ? colors.surfaceSecondary : colors.surface,
                        borderRadius: radius.md,
                        borderLeftWidth: 3,
                        borderLeftColor: termColor,
                        ...shadows.subtle,
                      },
                    ]}
                  >
                    <Text style={[typography.calloutBold, { color: termColor }]}>{term.term}</Text>
                    <Text
                      style={[
                        typography.bodySmall,
                        { color: colors.textSecondary, marginTop: 2, lineHeight: 20 },
                      ]}
                    >
                      {term.definition}
                    </Text>
                  </View>
                </Animated.View>
              );
            })}
          </Animated.View>
        )}
      </ScrollView>

      {/* Sticky footer */}
      <View
        style={[
          styles.footer,
          { borderTopColor: colors.separator, backgroundColor: colors.background },
        ]}
      >
        <Pressable
          onPress={() => {
            haptics.medium();
            onNext();
          }}
          style={({ pressed }) => [
            styles.nextButton,
            {
              backgroundColor: accentColor,
              borderRadius: radius.lg,
              shadowColor: accentColor,
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: pressed ? 0.12 : 0.2,
              shadowRadius: 10,
              elevation: 4,
              transform: [{ scale: pressed ? 0.97 : 1 }],
            },
          ]}
        >
          <Text style={[typography.headlineBold, { color: '#FFF' }]}>
            {isLast ? 'Start Practice' : 'Continue'}
          </Text>
          <Ionicons
            name={isLast ? 'school' : 'arrow-forward'}
            size={20}
            color="rgba(255,255,255,0.8)"
          />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 110,
  },
  stepBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  speakerRow: { marginTop: 18, marginBottom: 22 },
  speakerOuter: {
    alignSelf: 'flex-start',
    alignItems: 'center',
    justifyContent: 'center',
  },
  speakerPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  arabicCard: {
    padding: 24,
    alignItems: 'center',
    gap: 8,
    marginBottom: 22,
    overflow: 'hidden',
  },
  arabicText: {
    fontSize: 30,
    fontWeight: '300',
    textAlign: 'center',
    lineHeight: 48,
    letterSpacing: 1,
  },
  separator: {
    width: '40%',
    height: 1,
    marginVertical: 4,
  },
  termsSection: { marginTop: 4 },
  termsTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  termCard: {
    padding: 14,
    marginBottom: 8,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 24,
    paddingBottom: 36,
    paddingTop: 14,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  nextButton: {
    height: 54,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
});
