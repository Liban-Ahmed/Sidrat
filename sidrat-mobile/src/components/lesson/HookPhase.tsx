/**
 * HookPhase -- Immersive attention grabber with category-colored icon,
 * gentle breathing animation, and narration speaker button.
 */

import { Ionicons } from '@expo/vector-icons';
import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import Animated, {
  FadeInDown,
  FadeInUp,
  FadeIn,
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  Easing,
  interpolate,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { FormattedText } from './FormattedText';
import { useTheme } from '../../theme';
import haptic from '../../utils/haptics';
import type { HookBlock } from '../../types/curriculum';

interface Props {
  hook: HookBlock;
  isNarrating: boolean;
  onNarrate: (text: string) => void;
  onContinue: () => void;
  onSkip: () => void;
  accentColor: string;
  categoryIcon: keyof typeof Ionicons.glyphMap;
}

export function HookPhase({
  hook,
  isNarrating,
  onNarrate,
  onContinue,
  onSkip,
  accentColor,
  categoryIcon,
}: Props) {
  const { colors, typography, radius, isDark } = useTheme();
  const insets = useSafeAreaInsets();

  useEffect(() => {
    const timer = setTimeout(() => onNarrate(hook.narration), 600);
    return () => clearTimeout(timer);
  }, [hook.narration, onNarrate]);

  // Gentle breathing icon scale
  const breathe = useSharedValue(0);
  useEffect(() => {
    breathe.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 2000, easing: Easing.inOut(Easing.ease) }),
        withTiming(0, { duration: 2000, easing: Easing.inOut(Easing.ease) }),
      ),
      -1,
      true,
    );
  }, [breathe]);

  const iconStyle = useAnimatedStyle(() => ({
    transform: [{ scale: interpolate(breathe.value, [0, 1], [1, 1.06]) }],
    opacity: interpolate(breathe.value, [0, 1], [0.9, 1]),
  }));

  // Speaker pulse while narrating
  const pulseScale = useSharedValue(1);
  useEffect(() => {
    if (isNarrating) {
      pulseScale.value = withRepeat(
        withSequence(
          withTiming(1.1, { duration: 400, easing: Easing.inOut(Easing.ease) }),
          withTiming(1, { duration: 400, easing: Easing.inOut(Easing.ease) }),
        ),
        -1,
        true,
      );
    } else {
      pulseScale.value = withTiming(1, { duration: 200 });
    }
  }, [isNarrating, pulseScale]);

  const speakerStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulseScale.value }],
  }));

  const handleContinue = () => {
    haptic.medium();
    onContinue();
  };

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: colors.background, paddingBottom: insets.bottom + -24},
      ]}
    >
      {/* Content — centered in available space */}
      <View style={styles.contentArea}>
        {/* Category icon */}
        <Animated.View entering={FadeInDown.delay(100).duration(600)} style={styles.iconArea}>
          <Animated.View
            style={[
              styles.iconCircle,
              {
                backgroundColor: accentColor + (isDark ? '20' : '10'),
                shadowColor: accentColor,
                shadowOffset: { width: 0, height: 6 },
                shadowOpacity: 0.15,
                shadowRadius: 16,
              },
              iconStyle,
            ]}
          >
            <Ionicons name={categoryIcon} size={48} color={accentColor} />
          </Animated.View>
        </Animated.View>

        {/* Prompt */}
        <Animated.View entering={FadeInDown.delay(300).duration(600)} style={styles.promptArea}>
          <FormattedText
            style={[typography.title1, { color: colors.text, textAlign: 'center', lineHeight: 34 }]}
          >
            {hook.prompt}
          </FormattedText>
        </Animated.View>

        {/* Speaker button */}
        <Animated.View entering={FadeIn.delay(600).duration(500)} style={styles.speakerArea}>
          <Pressable
            onPress={() => {
              haptic.light();
              onNarrate(hook.narration);
            }}
            style={styles.speakerOuter}
          >
            <Animated.View
              style={[
                styles.speakerButton,
                {
                  backgroundColor: isNarrating
                    ? accentColor
                    : isDark
                      ? accentColor + '22'
                      : accentColor + '10',
                  shadowColor: isNarrating ? accentColor : 'transparent',
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: isNarrating ? 0.25 : 0,
                  shadowRadius: 10,
                },
                speakerStyle,
              ]}
            >
              <Ionicons
                name={isNarrating ? 'volume-high' : 'volume-medium-outline'}
                size={24}
                color={isNarrating ? '#FFF' : accentColor}
              />
            </Animated.View>
          </Pressable>
          <Text
            style={[
              typography.caption,
              {
                color: isNarrating ? accentColor : colors.textTertiary,
                fontWeight: isNarrating ? '600' : '400',
                marginTop: 8,
              },
            ]}
          >
            {isNarrating ? 'Listening...' : 'Tap to listen'}
          </Text>
        </Animated.View>
      </View>

      {/* CTA — pinned to bottom */}
      <Animated.View entering={FadeInUp.delay(800).duration(500)} style={styles.ctaArea}>
        <Pressable
          onPress={handleContinue}
          style={({ pressed }) => [
            styles.ctaButton,
            {
              backgroundColor: accentColor,
              borderRadius: radius.lg,
              shadowColor: accentColor,
              shadowOffset: { width: 0, height: 6 },
              shadowOpacity: pressed ? 0.15 : 0.25,
              shadowRadius: 14,
              elevation: 5,
              transform: [{ scale: pressed ? 0.97 : 1 }],
            },
          ]}
        >
          <Text style={[typography.headlineBold, { color: '#FFF' }]}>Let&apos;s Learn!</Text>
          <Ionicons name="arrow-forward" size={20} color="rgba(255,255,255,0.7)" />
        </Pressable>

        <Pressable
          onPress={() => {
            haptic.light();
            onSkip();
          }}
          hitSlop={12}
          style={styles.skipLink}
        >
          <Text style={[typography.caption, { color: colors.textTertiary }]}>Skip Intro</Text>
        </Pressable>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 28,
    paddingTop: 16,
    justifyContent: 'space-between',
  },
  contentArea: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconArea: {
    marginBottom: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  promptArea: {
    marginBottom: 28,
    maxWidth: 320,
  },
  speakerArea: {
    alignItems: 'center',
    marginBottom: 44,
  },
  speakerOuter: {
    width: 56,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
  },
  speakerButton: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ctaArea: { width: '100%' },
  ctaButton: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  skipLink: {
    alignItems: 'center',
    paddingVertical: 12,
  },
});
