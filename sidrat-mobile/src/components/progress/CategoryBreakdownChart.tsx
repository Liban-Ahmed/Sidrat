/**
 * CategoryBreakdownChart — Animated horizontal bar chart
 *
 * Shows lessons completed grouped by category with:
 *  • Category icon + label on the left
 *  • Animated fill bar in the category's brand color
 *  • Count badge on the right
 *  • Staggered entrance animations
 *  • Empty state with motivational message
 *  • Bar width = completion within that category (e.g. 15/15 → full bar)
 *
 * Built entirely with react-native-reanimated + plain Views.
 * No chart library or SVG required.
 */

import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withDelay,
  FadeIn,
  FadeInDown,
} from 'react-native-reanimated';
import { useTheme } from '../../theme';
import { tokens, SPRINGS, SPACING, RADIUS } from '../../theme/tokens';
import { categoryMeta, LESSON_CATEGORIES } from '../../types';
import type { LessonCategory } from '../../types';

interface CategoryBreakdownChartProps {
  /** Completed count per category */
  data: Record<LessonCategory, number>;
  /** Total lessons available per category (for denominator display) */
  totalPerCategory?: Record<LessonCategory, number>;
}

// ── Single animated bar row ──

interface BarRowProps {
  category: LessonCategory;
  count: number;
  total: number;
  index: number;
}

function BarRow({ category, count, total, index }: BarRowProps) {
  const { isDark, categoryColors } = useTheme();

  const meta = categoryMeta[category];
  const catColor = categoryColors[category]?.solid ?? tokens.color.sand400;
  const catMuted = categoryColors[category]?.muted ?? tokens.color.sand100;
  const textColor = isDark ? tokens.color.sand50 : tokens.color.earth800;

  // Bar fill = completion within this category (count/total).
  const fillWidth = useSharedValue(0);

  useEffect(() => {
    const ratio = total > 0 ? count / total : 0;
    const target =
      total > 0 ? Math.max(Math.min(ratio, 1), count > 0 ? 0.06 : 0) : count > 0 ? 0.06 : 0;
    fillWidth.value = withDelay(index * 60, withSpring(target, SPRINGS.gentle));
  }, [count, total, index, fillWidth]);

  const fillStyle = useAnimatedStyle(() => ({
    width: `${fillWidth.value * 100}%` as `${number}%`,
  }));

  // Count badge entrance
  const badgeScale = useSharedValue(0);
  useEffect(() => {
    badgeScale.value = withDelay(index * 60 + 400, withSpring(1, SPRINGS.bouncy));
  }, [index, badgeScale]);

  const badgeStyle = useAnimatedStyle(() => ({
    transform: [{ scale: badgeScale.value }],
    opacity: badgeScale.value,
  }));

  const trackColor = isDark ? tokens.color.earth700 : tokens.color.sand100;

  return (
    <Animated.View
      entering={FadeInDown.delay(index * 60).duration(400)}
      style={[styles.barRow, { marginBottom: SPACING.sm }]}
    >
      {/* Category icon + label */}
      <View style={styles.labelCol}>
        <View
          style={[
            styles.iconCircle,
            {
              backgroundColor: isDark ? catColor + '25' : catMuted,
              borderRadius: RADIUS.full,
            },
          ]}
        >
          <Ionicons name={meta.icon as keyof typeof Ionicons.glyphMap} size={16} color={catColor} />
        </View>
        <Text
          style={[{ fontWeight: '700', fontSize: 16, color: textColor, marginLeft: SPACING.sm }]}
          numberOfLines={1}
        >
          {meta.label}
        </Text>
      </View>

      {/* Bar track + fill — 8pt height, 6pt radius, sand100 track */}
      <View
        style={[
          styles.barTrack,
          {
            backgroundColor: trackColor,
            borderRadius: 6,
          },
        ]}
      >
        <Animated.View
          style={[
            styles.barFill,
            {
              backgroundColor: catColor,
              borderRadius: 6,
            },
            fillStyle,
          ]}
        />
      </View>

      {/* Count badge */}
      <Animated.View style={[styles.countCol, badgeStyle]}>
        <Text
          style={[
            {
              fontWeight: '600',
              fontSize: 14,
              color: count > 0 ? catColor : tokens.color.sand400,
            },
          ]}
        >
          {count}
        </Text>
        <Text
          style={[
            {
              fontWeight: '400',
              fontSize: 14,
              color: tokens.color.sand400,
            },
          ]}
        >
          /{total}
        </Text>
      </Animated.View>
    </Animated.View>
  );
}

// ── Main chart component ──

export function CategoryBreakdownChart({ data, totalPerCategory }: CategoryBreakdownChartProps) {
  const { colors, typography, spacing, radius, shadows } = useTheme();

  // Only show categories that have lessons available (total > 0) or have progress
  const categories = useMemo(() => {
    return LESSON_CATEGORIES.filter((cat) => {
      const total = totalPerCategory?.[cat] ?? 0;
      const completed = data[cat] ?? 0;
      return total > 0 || completed > 0;
    });
  }, [data, totalPerCategory]);

  const totalCompleted = useMemo(() => Object.values(data).reduce((sum, n) => sum + n, 0), [data]);

  const totalLessons = useMemo(() => {
    if (!totalPerCategory) return 0;
    return Object.values(totalPerCategory).reduce((sum, n) => sum + n, 0);
  }, [totalPerCategory]);

  // Empty state
  if (categories.length === 0) {
    return (
      <Animated.View
        entering={FadeIn.duration(500)}
        style={[
          styles.emptyCard,
          {
            backgroundColor: colors.surfaceSecondary,
            borderRadius: radius.xl,
            padding: spacing.xl,
            ...shadows.subtle,
          },
        ]}
      >
        <Ionicons name="bar-chart-outline" size={36} color={colors.textTertiary} />
        <Text
          style={[
            typography.label,
            { color: colors.text, marginTop: spacing.sm, textAlign: 'center' },
          ]}
        >
          No lessons yet
        </Text>
        <Text
          style={[
            typography.caption,
            { color: colors.textSecondary, marginTop: 4, textAlign: 'center' },
          ]}
        >
          Complete lessons to see your category breakdown!
        </Text>
      </Animated.View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Summary header */}
      <Animated.View
        entering={FadeIn.duration(400)}
        style={[styles.summaryRow, { marginBottom: spacing.md }]}
      >
        <View style={styles.summaryLeft}>
          <Text style={[typography.title2, { color: colors.text }]}>{totalCompleted}</Text>
          <Text style={[typography.caption, { color: colors.textSecondary, marginLeft: 4 }]}>
            {totalLessons > 0 ? `of ${totalLessons} lessons` : 'lessons completed'}
          </Text>
        </View>

        {/* Completion percentage badge */}
        {totalLessons > 0 && (
          <View
            style={[
              styles.percentBadge,
              {
                backgroundColor: tokens.color.olive400 + '12',
                borderRadius: radius.full,
              },
            ]}
          >
            <Text style={[typography.captionBold, { color: tokens.color.olive400 }]}>
              {Math.round((totalCompleted / totalLessons) * 100)}%
            </Text>
          </View>
        )}
      </Animated.View>

      {/* Category bars */}
      {categories.map((cat, i) => (
        <BarRow
          key={cat}
          category={cat}
          count={data[cat] ?? 0}
          total={totalPerCategory?.[cat] ?? 0}
          index={i}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {},
  summaryRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
  },
  summaryLeft: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  percentBadge: {
    paddingHorizontal: 10,
    paddingVertical: 3,
  },
  emptyCard: {
    alignItems: 'center',
  },
  barRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  labelCol: {
    width: 110,
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconCircle: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  barTrack: {
    flex: 1,
    height: 8,
    overflow: 'hidden',
    marginHorizontal: 8,
  },
  barFill: {
    height: '100%',
    minWidth: 0,
  },
  countCol: {
    width: 40,
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'flex-end',
  },
});
