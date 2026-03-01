/**
 * HookPhase -- Immersive attention grabber with cherry blossom background,
 * category-colored icon, gentle breathing animation, falling petals,
 * and narration speaker button.
 */

import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, Dimensions } from 'react-native';
import Animated, {
  FadeInUp,
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  withDelay,
  Easing,
  interpolate,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { FormattedText } from './FormattedText';
import CherryTree from '../../../assets/illustrations/cherry_tree-pana.svg';
import { useTheme } from '../../theme';
import haptic from '../../utils/haptics';
import type { HookBlock } from '../../types/curriculum';

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get('window');
const PANEL_HEIGHT = 260;

// ─────────────────────────────────────────────────────────────────
// Falling Petals
// ─────────────────────────────────────────────────────────────────

const PETAL_COUNT = 7;
const PETAL_CONFIGS = Array.from({ length: PETAL_COUNT }, () => ({
  size: 5 + Math.random() * 4, // 5–9 px
  left: `${5 + Math.random() * 90}%` as const,
  delay: Math.round(Math.random() * 5000), // 0–5 s
  duration: 7000 + Math.round(Math.random() * 5000), // 7–12 s
}));

function Petal({ size, left, delay, duration }: (typeof PETAL_CONFIGS)[number]) {
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withDelay(
      delay,
      withRepeat(withTiming(1, { duration, easing: Easing.linear }), -1, false),
    );
  }, [delay, duration, progress]);

  const style = useAnimatedStyle(() => ({
    transform: [
      { translateY: interpolate(progress.value, [0, 1], [-20, SCREEN_HEIGHT + 50]) },
      { rotate: `${interpolate(progress.value, [0, 1], [0, 480])}deg` },
    ],
    opacity: interpolate(progress.value, [0, 0.1, 0.9, 1], [0, 1, 1, 0]),
  }));

  const half = size / 2;

  return (
    <Animated.View
      style={[
        {
          position: 'absolute',
          top: 0,
          left: left as unknown as number,
          width: size,
          height: size,
          backgroundColor: '#FF9080',
          borderTopLeftRadius: half,
          borderTopRightRadius: 0,
          borderBottomRightRadius: half,
          borderBottomLeftRadius: 0,
        },
        style,
      ]}
    />
  );
}

function FallingPetals() {
  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      {PETAL_CONFIGS.map((cfg, i) => (
        <Petal key={i} {...cfg} />
      ))}
    </View>
  );
}

// ─────────────────────────────────────────────────────────────────
// Cherry Tree with gentle sway
// ─────────────────────────────────────────────────────────────────

function SwayingTree() {
  const sway = useSharedValue(0);

  useEffect(() => {
    sway.value = withRepeat(
      withSequence(
        withTiming(-0.4, { duration: 4500, easing: Easing.inOut(Easing.ease) }),
        withTiming(0.4, { duration: 4500, easing: Easing.inOut(Easing.ease) }),
      ),
      -1,
      true,
    );
  }, [sway]);

  const treeStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${sway.value}deg` }],
  }));

  return (
    <Animated.View style={[styles.treeWrapper, treeStyle]}>
      <CherryTree width={SCREEN_WIDTH * 1.2} height={SCREEN_HEIGHT} />
    </Animated.View>
  );
}

// ─────────────────────────────────────────────────────────────────
// HookPhase
// ─────────────────────────────────────────────────────────────────

interface Props {
  hook: HookBlock;
  unitLabel: string;
  isNarrating: boolean;
  onNarrate: (text: string) => void;
  onContinue: () => void;
  onSkip: () => void;
  accentColor: string;
  categoryIcon: keyof typeof Ionicons.glyphMap;
}

export function HookPhase({ hook, unitLabel, onNarrate, onContinue, accentColor }: Props) {
  const { colors, typography, radius, spacing, shadows, isDark } = useTheme();
  const insets = useSafeAreaInsets();

  useEffect(() => {
    const timer = setTimeout(() => onNarrate(hook.narration), 600);
    return () => clearTimeout(timer);
  }, [hook.narration, onNarrate]);

  const handleContinue = () => {
    haptic.medium();
    onContinue();
  };

  return (
    <View style={styles.container}>
      {/* ── Background layer ── */}
      <View style={StyleSheet.absoluteFill}>
        <LinearGradient
          colors={
            isDark
              ? ['#0B1A22', '#0D1E18', '#181410', '#13100A']
              : ['#C5E5F4', '#D8EDF7', '#F0E2C4', '#E2CA96']
          }
          style={StyleSheet.absoluteFill}
        />
        <SwayingTree />
        <FallingPetals />
      </View>

      {/* ── Bottom panel ── */}
      <View
        style={[
          styles.bottomPanel,
          {
            backgroundColor: colors.surfaceSecondary,
            paddingBottom: insets.bottom + spacing.xs,
            borderTopLeftRadius: radius.xl,
            borderTopRightRadius: radius.xl,
            paddingHorizontal: spacing.xl,
            paddingTop: spacing.lg,
            ...shadows.elevated,
          },
        ]}
      >
        <Animated.View
          entering={FadeInUp.delay(150).duration(450)}
          style={[
            styles.unitPill,
            {
              backgroundColor: isDark ? accentColor + '20' : accentColor + '10',
              borderColor: isDark ? accentColor + '40' : accentColor + '30',
            },
          ]}
        >
          <Text style={[typography.captionBold, { color: accentColor }]} numberOfLines={1}>
            {unitLabel}
          </Text>
        </Animated.View>

        <Animated.View entering={FadeInUp.delay(250).duration(500)} style={styles.panelPromptArea}>
          <FormattedText
            style={[typography.body, { color: colors.text, textAlign: 'center', lineHeight: 24 }]}
            numberOfLines={4}
          >
            {hook.prompt}
          </FormattedText>
        </Animated.View>

        {/* CTA */}
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
        </Animated.View>
      </View>
    </View>
  );
}

// ─────────────────────────────────────────────────────────────────
// Styles
// ─────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
  /* ── Tree ── */
  treeWrapper: {
    position: 'absolute',
    bottom: 0,
    left: '-10%',
    width: '120%',
    height: SCREEN_HEIGHT,
    alignItems: 'center',
    justifyContent: 'flex-end',
    transformOrigin: 'center bottom',
  },
  /* ── Bottom panel ── */
  bottomPanel: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: PANEL_HEIGHT,
  },
  panelPromptArea: {
    maxWidth: 340,
    alignSelf: 'center',
    marginTop: 12, // spacing.sm
    flex: 1,
    maxHeight: 100,
  },
  unitPill: {
    alignSelf: 'center',
    paddingHorizontal: 12, // spacing.sm
    paddingVertical: 6, // spacing.xs / custom
    borderRadius: 999,
    borderWidth: 1,
  },
  ctaArea: {
    width: '100%',
    marginTop: 'auto',
  },
  ctaButton: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
});
