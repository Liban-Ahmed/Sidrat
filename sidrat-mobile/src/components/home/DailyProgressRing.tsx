/**
 * DailyProgressRing — Headspace-style "Today" card for the home screen.
 *
 * A single, calming card that shows:
 *   • Large animated ProgressRing: lessons completed today / daily goal
 *   • XP earned today as a secondary stat
 *   • Current streak as a tertiary stat
 *   • "See all progress" link
 *
 * Design: soft gradient background, premium shadow, centered ring.
 */

import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useMemo } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import { useTheme } from '../../theme';
import { ProgressRing } from '../ui/ProgressRing';

const DAILY_GOAL = 1; // lessons per day — simple and achievable for children

interface DailyProgressRingProps {
  /** Lessons completed today */
  lessonsToday: number;
  /** XP earned today */
  xpToday: number;
  /** Current streak (days) */
  streak: number;
  /** Navigate to progress tab */
  onSeeAll?: () => void;
}

export function DailyProgressRing({
  lessonsToday,
  xpToday,
  streak,
  onSeeAll,
}: DailyProgressRingProps) {
  const { brand, colors, typography, spacing, radius, shadows, isDark } = useTheme();

  const progress = Math.min(lessonsToday / DAILY_GOAL, 1);
  const isComplete = lessonsToday >= DAILY_GOAL;

  const ringColor = isComplete ? brand.accent : brand.primary;
  const ringLabel = isComplete ? 'Complete!' : `${lessonsToday}/${DAILY_GOAL}`;
  const ringSubtext = isComplete
    ? "Masha'Allah!"
    : lessonsToday === 0
      ? 'Start your lesson'
      : 'Almost there';

  const miniStats = useMemo(
    () => [
      {
        icon: 'flame' as const,
        value: `${streak}`,
        label: 'Streak',
        color: brand.coral,
      },
      {
        icon: 'flash' as const,
        value: `${xpToday}`,
        label: 'XP today',
        color: brand.accent,
      },
    ],
    [streak, xpToday, brand.coral, brand.accent],
  );

  return (
    <Animated.View entering={FadeInDown.delay(120).duration(600).springify().damping(16)}>
      <View
        style={[
          styles.card,
          {
            backgroundColor: isDark ? colors.surfaceSecondary : colors.surface,
            borderRadius: radius.xl,
            borderWidth: isDark ? 1 : 0,
            borderColor: isDark ? colors.border : 'transparent',
            ...shadows.cardPremium,
          },
        ]}
      >
        {/* Subtle gradient overlay at top */}
        <LinearGradient
          colors={
            isDark
              ? ['rgba(10,126,140,0.06)', 'transparent']
              : ['rgba(10,126,140,0.04)', 'transparent']
          }
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={[styles.gradientOverlay, { borderRadius: radius.xl }]}
        />

        {/* Section label */}
        <Animated.View
          entering={FadeIn.delay(200).duration(400)}
          style={[styles.topRow, { paddingTop: spacing.lg, paddingHorizontal: spacing.lg }]}
        >
          <Text
            style={[
              typography.caption,
              { color: colors.textTertiary, letterSpacing: 0.6, textTransform: 'uppercase' },
            ]}
          >
            Today
          </Text>
          {onSeeAll && (
            <Pressable onPress={onSeeAll} hitSlop={12}>
              <Text style={[typography.caption, { color: brand.primary }]}>See all</Text>
            </Pressable>
          )}
        </Animated.View>

        {/* Ring + summary */}
        <View style={[styles.ringSection, { paddingVertical: spacing.lg }]}>
          <ProgressRing
            progress={progress}
            size={100}
            strokeWidth={8}
            color={ringColor}
            glow={isComplete}
          >
            <View style={styles.ringCenter}>
              {isComplete ? (
                <Ionicons name="checkmark-circle" size={28} color={brand.accent} />
              ) : (
                <Text style={[typography.title1, { color: colors.text }]}>{ringLabel}</Text>
              )}
            </View>
          </ProgressRing>

          <Animated.View
            entering={FadeIn.delay(500).duration(400)}
            style={{ marginTop: spacing.sm, alignItems: 'center' }}
          >
            <Text style={[typography.label, { color: colors.text }]}>{ringSubtext}</Text>
            {isComplete && (
              <Text style={[typography.caption, { color: colors.textTertiary, marginTop: 2 }]}>
                Daily goal reached
              </Text>
            )}
          </Animated.View>
        </View>

        {/* Mini stats row */}
        <View
          style={[
            styles.statsRow,
            {
              borderTopWidth: StyleSheet.hairlineWidth,
              borderTopColor: isDark ? colors.border : colors.separator,
              paddingVertical: spacing.md,
              paddingHorizontal: spacing.lg,
              marginHorizontal: spacing.sm,
            },
          ]}
        >
          {miniStats.map((stat, i) => (
            <Animated.View
              key={stat.label}
              entering={FadeIn.delay(600 + i * 100).duration(400)}
              style={styles.miniStat}
            >
              <View
                style={[
                  styles.miniStatIcon,
                  {
                    backgroundColor: stat.color + (isDark ? '18' : '10'),
                    borderRadius: radius.md,
                  },
                ]}
              >
                <Ionicons name={stat.icon} size={16} color={stat.color} />
              </View>
              <Text style={[typography.title3, { color: colors.text }]}>{stat.value}</Text>
              <Text style={[typography.caption, { color: colors.textTertiary }]}>{stat.label}</Text>
            </Animated.View>
          ))}
        </View>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    overflow: 'hidden',
  },
  gradientOverlay: {
    ...StyleSheet.absoluteFillObject,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  ringSection: {
    alignItems: 'center',
  },
  ringCenter: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
  miniStat: {
    alignItems: 'center',
    gap: 4,
  },
  miniStatIcon: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
