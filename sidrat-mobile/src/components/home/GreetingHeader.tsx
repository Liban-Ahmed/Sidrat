/**
 * GreetingHeader — Warm olive50→cream gradient hero area.
 *
 * Layout:
 *   Caption  — Hijri date (muted, small)
 *   Top row  — "Good Morning, Yusuf" (hero, 26pt) + 🔥 streak badge
 *   HR       — full-bleed divider (matches learn/family tabs)
 *
 * Design Spec §8.1 — Home Screen greeting area.
 */

import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useOasisColors } from '../../hooks/useOasisColors';
import { SPACING, RADIUS, type AgeGroup } from '../../theme/tokens';
import haptic from '../../utils/haptics';
import { formatHijriDate } from '../../utils/hijriDate';
import { JuicyPressable } from '../common/JuicyPressable';

// ── Helpers ──────────────────────────────────────────────────────

function getTimeGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good Morning';
  if (hour < 17) return 'Good Afternoon';
  if (hour < 21) return 'Good Evening';
  return 'Good Night';
}

// ── Props ────────────────────────────────────────────────────────

interface GreetingHeaderProps {
  childName: string;
  streak: number;
  ageGroup: AgeGroup;
}

// ── Component ────────────────────────────────────────────────────

export function GreetingHeader({ childName, streak, ageGroup: _ageGroup }: GreetingHeaderProps) {
  const { colors: oasis, t, isDark } = useOasisColors();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const timeGreeting = useMemo(getTimeGreeting, []);
  const hijriDate = useMemo(() => formatHijriDate(), []);

  const gradientColors: [string, string] = isDark ? [t.earth900, '#1F1D1A'] : [t.olive50, t.cream];

  const navigateToProgress = () => {
    haptic.light();
    router.push('/(tabs)/progress' as any);
  };

  return (
    <Animated.View entering={FadeInDown.duration(500).springify().damping(18)}>
      <LinearGradient
        colors={gradientColors}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={[styles.container, { paddingTop: insets.top + SPACING.sm }]}
      >
        {/* ── Hijri date caption ── */}
        <Text style={[styles.caption, { color: oasis.textMuted }]} numberOfLines={1}>
          {hijriDate}
        </Text>

        {/* ── Hero row: greeting + streak badge ── */}
        <View style={styles.topRow}>
          <Text style={[styles.hero, { color: oasis.textPrimary }]} numberOfLines={1}>
            {timeGreeting}, <Text style={{ color: oasis.primaryDark }}>{childName}</Text>
          </Text>

          {streak > 0 && (
            <JuicyPressable
              onPress={navigateToProgress}
              accessibilityLabel={`Istiqamah streak: ${streak} days. Tap to view progress.`}
              accessibilityRole="button"
            >
              <LinearGradient
                colors={isDark ? [oasis.rewardBg, oasis.rewardBg] : [t.gold50, t.gold100]}
                style={[
                  styles.streakBadge,
                  { borderColor: isDark ? oasis.rewardBorder : t.gold200 },
                ]}
              >
                <Ionicons name="flame" size={15} color={t.gold600} />
                <Text style={[styles.streakCount, { color: t.gold600 }]}>{streak}</Text>
              </LinearGradient>
            </JuicyPressable>
          )}
        </View>

        {/* ── Divider — full-bleed, matches learn/family tabs ── */}
        <View style={[styles.divider, { backgroundColor: oasis.surfaceBorder }]} />
      </LinearGradient>
    </Animated.View>
  );
}

// ── Styles ───────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.md,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: SPACING.sm,
  },
  caption: {
    fontFamily: 'Nunito-Regular',
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 3,
    opacity: 0.75,
  },
  hero: {
    flex: 1,
    fontFamily: 'ReemKufi-Regular',
    fontWeight: '700',
    fontSize: 26,
    lineHeight: 34,
  },
  streakBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: RADIUS.md,
    borderWidth: 1.5,
    gap: 4,
  },
  streakCount: {
    fontFamily: 'Nunito-Bold',
    fontWeight: '700',
    fontSize: 18,
    lineHeight: 24,
  },
  // Full-bleed HR — negative margins cancel the container's paddingHorizontal
  divider: {
    height: 1,
    marginTop: SPACING.md,
    marginHorizontal: -SPACING.lg,
  },
});
