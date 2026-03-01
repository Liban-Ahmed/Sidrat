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
// Sun (Light Mode) — rotating rays + pulsing glow
// ─────────────────────────────────────────────────────────────────

// Pre-compute ray positions once (8 alternating long/short rays)
const SUN_RAYS = Array.from({ length: 8 }, (_, i) => {
  const θ = (i * Math.PI) / 4;
  const isMain = i % 2 === 0;
  const radius = isMain ? 50 : 44;
  const height = isMain ? 20 : 13;
  return {
    left: 68 + radius * Math.sin(θ) - 2.5, // 2.5 = rayWidth/2
    top: 68 - radius * Math.cos(θ) - height / 2,
    height,
    rotation: i * 45,
  };
});

function Sun() {
  const glow = useSharedValue(0.8);
  const rotation = useSharedValue(0);

  useEffect(() => {
    glow.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 2800, easing: Easing.inOut(Easing.ease) }),
        withTiming(0.75, { duration: 2800, easing: Easing.inOut(Easing.ease) }),
      ),
      -1,
      true,
    );
    rotation.value = withRepeat(
      withTiming(360, { duration: 24000, easing: Easing.linear }),
      -1,
      false,
    );
  }, [glow, rotation]);

  const glowStyle = useAnimatedStyle(() => ({
    opacity: interpolate(glow.value, [0.75, 1], [0.25, 0.55]),
    transform: [{ scale: interpolate(glow.value, [0.75, 1], [1, 1.08]) }],
  }));

  const raysStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
  }));

  return (
    <View style={styles.sunContainer}>
      {/* Outer soft glow — pulses */}
      <Animated.View style={[styles.sunGlow, glowStyle]} />
      {/* Mid halo ring */}
      <View style={styles.sunHalo} />
      {/* Rotating rays container */}
      <Animated.View style={[StyleSheet.absoluteFill, raysStyle]}>
        {SUN_RAYS.map((ray, i) => (
          <View
            key={i}
            style={[
              {
                position: 'absolute',
                left: ray.left,
                top: ray.top,
                width: 5,
                height: ray.height,
                borderRadius: 3,
                backgroundColor: i % 2 === 0 ? '#FBBF24' : '#FDE68A',
                transform: [{ rotate: `${ray.rotation}deg` }],
              },
            ]}
          />
        ))}
      </Animated.View>
      {/* Sun body */}
      <View style={styles.sunBody} />
      {/* Inner highlight */}
      <View style={styles.sunHighlight} />
    </View>
  );
}

// ─────────────────────────────────────────────────────────────────
// Moon (Dark Mode) — crescent + floating glow
// ─────────────────────────────────────────────────────────────────

function Moon() {
  const float = useSharedValue(0);

  useEffect(() => {
    float.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 4000, easing: Easing.inOut(Easing.ease) }),
        withTiming(0, { duration: 4000, easing: Easing.inOut(Easing.ease) }),
      ),
      -1,
      true,
    );
  }, [float]);

  const floatStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: interpolate(float.value, [0, 1], [0, -8]) }],
  }));

  return (
    <Animated.View style={[styles.moonContainer, floatStyle]}>
      {/* Soft glow behind moon */}
      <View style={styles.moonGlow} />
      {/* Crescent: clip a full circle, overlay shadow to bite out the crescent */}
      <View style={styles.moonBody}>
        <View style={styles.moonCrescent} />
      </View>
    </Animated.View>
  );
}

// ─────────────────────────────────────────────────────────────────
// Twinkling Stars (Dark Mode)
// ─────────────────────────────────────────────────────────────────

const STAR_CONFIGS = Array.from({ length: 22 }, () => ({
  top: 10 + Math.random() * (SCREEN_HEIGHT * 0.42),
  left: Math.random() * SCREEN_WIDTH,
  size: 1.5 + Math.random() * 2.5,
  delay: Math.round(Math.random() * 3000),
  duration: 1400 + Math.round(Math.random() * 2000),
  initOpacity: 0.2 + Math.random() * 0.8,
}));

function StarDot({ top, left, size, delay, duration, initOpacity }: (typeof STAR_CONFIGS)[number]) {
  const opacity = useSharedValue(initOpacity);

  useEffect(() => {
    opacity.value = withDelay(
      delay,
      withRepeat(
        withSequence(
          withTiming(0.08, { duration, easing: Easing.inOut(Easing.ease) }),
          withTiming(1, { duration, easing: Easing.inOut(Easing.ease) }),
        ),
        -1,
        true,
      ),
    );
  }, [delay, duration, opacity]);

  const style = useAnimatedStyle(() => ({ opacity: opacity.value }));

  return (
    <Animated.View
      style={[
        {
          position: 'absolute',
          top,
          left,
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: '#FFFDE7',
        },
        style,
      ]}
    />
  );
}

function TwinklingStars() {
  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      {STAR_CONFIGS.map((cfg, i) => (
        <StarDot key={i} {...cfg} />
      ))}
    </View>
  );
}

// ─────────────────────────────────────────────────────────────────
// Floating Clouds (Light Mode)
// ─────────────────────────────────────────────────────────────────

interface CloudConfig {
  top: number;
  startLeft: number;
  scale: number;
  speed: number;
  delay: number;
  opacity: number;
}

const CLOUD_CONFIGS: CloudConfig[] = [
  { top: 48, startLeft: -160, scale: 1.0, speed: 32000, delay: 0, opacity: 0.82 },
  { top: 105, startLeft: -100, scale: 0.65, speed: 42000, delay: 10000, opacity: 0.7 },
  { top: 72, startLeft: -220, scale: 0.8, speed: 38000, delay: 20000, opacity: 0.6 },
];

function Cloud({ top, startLeft, scale, speed, delay, opacity: baseOpacity }: CloudConfig) {
  const x = useSharedValue(0);
  const baseWidth = 130 * scale;

  useEffect(() => {
    x.value = withDelay(
      delay,
      withRepeat(
        withTiming(SCREEN_WIDTH - startLeft + baseWidth, {
          duration: speed,
          easing: Easing.linear,
        }),
        -1,
        false,
      ),
    );
  }, [baseWidth, delay, speed, startLeft, x]);

  const animStyle = useAnimatedStyle(() => ({ transform: [{ translateX: x.value }] }));

  const w = 130 * scale;
  const h = 44 * scale;
  const r = h * 0.5;

  return (
    <Animated.View
      style={[{ position: 'absolute', top, left: startLeft }, animStyle]}
      pointerEvents="none"
    >
      {/* Base oval */}
      <View
        style={{
          position: 'absolute',
          bottom: 0,
          width: w,
          height: h * 0.65,
          borderRadius: r * 0.65,
          backgroundColor: `rgba(255,255,255,${baseOpacity})`,
        }}
      />
      {/* Left puff */}
      <View
        style={{
          position: 'absolute',
          bottom: h * 0.28,
          left: w * 0.08,
          width: w * 0.48,
          height: h * 0.78,
          borderRadius: h * 0.39,
          backgroundColor: `rgba(255,255,255,${baseOpacity + 0.06})`,
        }}
      />
      {/* Right puff */}
      <View
        style={{
          position: 'absolute',
          bottom: h * 0.18,
          left: w * 0.44,
          width: w * 0.38,
          height: h * 0.62,
          borderRadius: h * 0.31,
          backgroundColor: `rgba(255,255,255,${baseOpacity})`,
        }}
      />
      {/* Centre top puff */}
      <View
        style={{
          position: 'absolute',
          bottom: h * 0.5,
          left: w * 0.28,
          width: w * 0.3,
          height: h * 0.55,
          borderRadius: h * 0.28,
          backgroundColor: `rgba(255,255,255,${baseOpacity + 0.04})`,
        }}
      />
    </Animated.View>
  );
}

function FloatingClouds() {
  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      {CLOUD_CONFIGS.map((cfg, i) => (
        <Cloud key={i} {...cfg} />
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
      <CherryTree width={SCREEN_WIDTH * 0.9} height={SCREEN_HEIGHT} />
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
        {isDark ? <Moon /> : <Sun />}
        {isDark ? <TwinklingStars /> : <FloatingClouds />}
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
    bottom: -40,
    left: '-12%',
    width: '124%',
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
  /* ── Sun (Light Mode) ── */
  sunContainer: {
    position: 'absolute',
    top: 44,
    right: 28,
    width: 136,
    height: 136,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sunGlow: {
    position: 'absolute',
    width: 116,
    height: 116,
    borderRadius: 58,
    backgroundColor: '#FDE68A',
  },
  sunHalo: {
    position: 'absolute',
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: '#FCD34D',
    opacity: 0.45,
  },
  sunBody: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#FBBF24',
    shadowColor: '#F59E0B',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 14,
    elevation: 6,
  },
  sunHighlight: {
    position: 'absolute',
    width: 22,
    height: 14,
    borderRadius: 11,
    backgroundColor: 'rgba(255,255,255,0.35)',
    top: 46,
    left: 56,
  },
  /* ── Moon (Dark Mode) ── */
  moonContainer: {
    position: 'absolute',
    top: 50,
    right: 36,
    width: 90,
    height: 90,
    alignItems: 'center',
    justifyContent: 'center',
  },
  moonGlow: {
    position: 'absolute',
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: '#BAE6FD',
    opacity: 0.15,
  },
  moonBody: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: '#E8F4FD',
    overflow: 'hidden',
    shadowColor: '#BAE6FD',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 14,
    elevation: 4,
  },
  moonCrescent: {
    position: 'absolute',
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: '#0D1B24',
    left: 18,
    top: -6,
  },
});
