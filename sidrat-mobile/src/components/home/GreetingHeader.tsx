/**
 * GreetingHeader — Warm olive50→cream gradient hero area
 * with time-aware Islamic greeting, child name, Hijri date,
 * and Istiqamah streak badge.
 *
 * Design Spec §8.1 — Home Screen greeting area.
 */

import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useMemo } from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import Animated, {
  FadeInDown,
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { useOasisColors } from '../../hooks/useOasisColors';
import { SPACING, RADIUS, TYPOGRAPHY, type AgeGroup } from '../../theme/tokens';
import haptic from '../../utils/haptics';
import { formatHijriDate } from '../../utils/hijriDate';
import { JuicyPressable } from '../common/JuicyPressable';

// ── Helpers ──────────────────────────────────────────────────────

function getGreeting(): { islamic: string; timeOfDay: string } {
  const hour = new Date().getHours();
  if (hour < 12) return { islamic: 'Assalamu Alaikum', timeOfDay: 'Good Morning' };
  if (hour < 17) return { islamic: 'Assalamu Alaikum', timeOfDay: 'Good Afternoon' };
  if (hour < 21) return { islamic: 'Assalamu Alaikum', timeOfDay: 'Good Evening' };
  return { islamic: 'Assalamu Alaikum', timeOfDay: 'Good Night' };
}

// ── Props ────────────────────────────────────────────────────────

interface GreetingHeaderProps {
  childName: string;
  streak: number;
  ageGroup: AgeGroup;
}

// ── Component ────────────────────────────────────────────────────

export function GreetingHeader({ childName, streak, ageGroup }: GreetingHeaderProps) {
  const { colors: oasis, t, isDark } = useOasisColors();
  const router = useRouter();
  const greeting = useMemo(getGreeting, []);
  const hijriDate = useMemo(() => formatHijriDate(), []);

  // Streak badge gentle pulse
  const pulseScale = useSharedValue(1);
  React.useEffect(() => {
    if (streak > 0) {
      pulseScale.value = withRepeat(
        withSequence(
          withTiming(1.04, { duration: 1200, easing: Easing.inOut(Easing.ease) }),
          withTiming(1, { duration: 1200, easing: Easing.inOut(Easing.ease) }),
        ),
        -1,
        true,
      );
    }
  }, [streak, pulseScale]);

  const pulseStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulseScale.value }],
  }));

  const headingSize = (
    TYPOGRAPHY.heading as Record<AgeGroup, { fontSize: number; lineHeight: number }>
  )[ageGroup];

  const gradientColors: [string, string] = isDark ? [t.earth900, '#1F1D1A'] : [t.olive50, t.cream];

  return (
    <Animated.View entering={FadeInDown.duration(500).springify().damping(18)}>
      <LinearGradient
        colors={gradientColors}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={[styles.container, { paddingTop: Platform.OS === 'ios' ? 60 : 44 }]}
      >
        <View style={styles.row}>
          {/* Greeting + name */}
          <View style={styles.greetingArea}>
            <Text
              style={[
                styles.islamicGreeting,
                {
                  color: oasis.textPrimary,
                  fontSize: Math.max(headingSize.fontSize, 26),
                  lineHeight: Math.max(headingSize.lineHeight, 34),
                },
              ]}
            >
              {greeting.islamic}
            </Text>
            <Text style={[styles.timeGreeting, { color: oasis.textPrimary }]}>
              {greeting.timeOfDay}
            </Text>
            <Text style={[styles.childName, { color: oasis.primaryDark }]}>{childName}</Text>
            <Text style={[styles.hijriDate, { color: oasis.textMuted }]}>{hijriDate}</Text>
          </View>

          {/* Istiqamah streak badge */}
          {streak > 0 && (
            <Animated.View style={pulseStyle}>
              <JuicyPressable
                onPress={() => {
                  haptic.light();
                  router.push('/(tabs)/progress' as any);
                }}
                accessibilityLabel={`Istiqamah streak: ${streak} days. Tap to view your progress`}
                accessibilityRole="button"
                accessibilityHint="Navigate to progress tab"
              >
                <LinearGradient
                  colors={isDark ? [oasis.rewardBg, oasis.rewardBg] : [t.gold50, t.gold100]}
                  style={[
                    styles.streakBadge,
                    {
                      borderColor: isDark ? oasis.rewardBorder : t.gold200,
                    },
                  ]}
                >
                  <Ionicons name="flame" size={18} color={t.gold600} />
                  <Text style={[styles.streakCount, { color: t.gold600 }]}>{streak}</Text>
                </LinearGradient>
              </JuicyPressable>
            </Animated.View>
          )}
        </View>
      </LinearGradient>
    </Animated.View>
  );
}

// ── Styles ───────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.lg,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  greetingArea: {
    flex: 1,
    marginRight: SPACING.md,
  },
  islamicGreeting: {
    fontFamily: 'ReemKufi-Regular',
    fontWeight: '700',
  },
  timeGreeting: {
    fontFamily: 'Nunito-Regular',
    fontSize: 16,
    lineHeight: 22,
    marginTop: 2,
  },
  childName: {
    fontFamily: 'Nunito-Bold',
    fontSize: 20,
    lineHeight: 26,
    fontWeight: '700',
    marginTop: SPACING.xs,
  },
  hijriDate: {
    fontFamily: 'Nunito-Regular',
    fontSize: 14,
    lineHeight: 18,
    marginTop: SPACING.xs,
  },
  streakBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: RADIUS.md,
    borderWidth: 2,
    gap: 6,
  },

  streakCount: {
    fontFamily: 'Nunito-Bold',
    fontSize: 22,
    fontWeight: '700',
    lineHeight: 28,
  },
});
