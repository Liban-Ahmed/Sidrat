/**
 * HomeSkeletonLoader — Shimmer placeholder matching the home layout.
 */

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useOasisColors } from '../../hooks/useOasisColors';
import { useTheme } from '../../theme';
import { ShimmerBlock } from '../ui/ShimmerBlock';

// ── Home Skeleton Loader ─────────────────────────────────────────

export function HomeSkeletonLoader() {
  const { spacing, radius } = useTheme();
  const { colors: oasis, t, isDark } = useOasisColors();

  return (
    <View style={[styles.container, { backgroundColor: oasis.background }]}>
      {/* Hero skeleton */}
      <View
        style={[
          styles.heroSkeleton,
          {
            backgroundColor: isDark ? t.earth700 + '20' : t.olive50,
            borderBottomLeftRadius: radius.xl,
            borderBottomRightRadius: radius.xl,
            paddingHorizontal: spacing.lg,
            paddingTop: spacing.xl + 64,
            paddingBottom: spacing.xl,
          },
        ]}
      >
        <View style={styles.heroRow}>
          {/* Avatar placeholder */}
          <ShimmerBlock width={56} height={56} borderRadius={28} />
          <View style={{ marginLeft: spacing.sm, flex: 1 }}>
            {/* Greeting */}
            <ShimmerBlock width={120} height={14} borderRadius={7} />
            {/* Name */}
            <ShimmerBlock
              width={100}
              height={22}
              borderRadius={11}
              style={{ marginTop: spacing.xs }}
            />
            {/* Subtitle */}
            <ShimmerBlock
              width={180}
              height={12}
              borderRadius={6}
              style={{ marginTop: spacing.xs }}
            />
          </View>
          {/* Settings icon placeholder */}
          <ShimmerBlock width={44} height={44} borderRadius={22} />
        </View>
      </View>

      <View style={{ paddingHorizontal: spacing.md, marginTop: spacing.md }}>
        {/* Salah Reminder skeleton */}
        <ShimmerBlock width="100%" height={56} borderRadius={radius.lg} />

        {/* Section header skeleton */}
        <View style={[styles.sectionRow, { marginTop: spacing.lg }]}>
          <ShimmerBlock width={120} height={18} borderRadius={9} />
          <ShimmerBlock width={60} height={14} borderRadius={7} />
        </View>

        {/* Lesson card skeleton */}
        <View
          style={[
            styles.cardSkeleton,
            {
              backgroundColor: isDark ? t.earth800 + '20' : t.sand50,
              borderRadius: radius.xl,
              marginTop: spacing.sm,
              padding: spacing.lg,
              borderWidth: 1,
              borderColor: isDark ? oasis.surfaceBorder : t.sand200,
            },
          ]}
        >
          {/* Accent strip */}
          <ShimmerBlock
            width="100%"
            height={3}
            borderRadius={2}
            style={{ marginBottom: spacing.sm }}
          />
          {/* Category badge */}
          <ShimmerBlock width={90} height={24} borderRadius={12} />
          {/* Title */}
          <ShimmerBlock
            width="80%"
            height={20}
            borderRadius={10}
            style={{ marginTop: spacing.sm }}
          />
          {/* Description */}
          <ShimmerBlock
            width="100%"
            height={14}
            borderRadius={7}
            style={{ marginTop: spacing.xs }}
          />
          <ShimmerBlock
            width="60%"
            height={14}
            borderRadius={7}
            style={{ marginTop: spacing.xxs }}
          />
          {/* Meta chips */}
          <View style={[styles.chipRow, { marginTop: spacing.md }]}>
            <ShimmerBlock width={70} height={28} borderRadius={14} />
            <ShimmerBlock
              width={80}
              height={28}
              borderRadius={14}
              style={{ marginLeft: spacing.xs }}
            />
          </View>
          {/* CTA button */}
          <ShimmerBlock
            width="100%"
            height={48}
            borderRadius={radius.lg}
            style={{ marginTop: spacing.md }}
          />
        </View>

        {/* Ayah card skeleton */}
        <View
          style={[
            styles.cardSkeleton,
            {
              backgroundColor: isDark ? t.earth800 + '20' : t.sand50,
              borderRadius: radius.xl,
              marginTop: spacing.lg,
              padding: spacing.lg,
              borderWidth: 1,
              borderColor: isDark ? oasis.surfaceBorder : t.sand200,
            },
          ]}
        >
          <View style={styles.sectionRow}>
            <ShimmerBlock width={28} height={28} borderRadius={14} />
            <ShimmerBlock
              width={100}
              height={14}
              borderRadius={7}
              style={{ marginLeft: spacing.xs }}
            />
          </View>
          {/* Arabic text */}
          <ShimmerBlock
            width="90%"
            height={30}
            borderRadius={8}
            style={{ marginTop: spacing.md, alignSelf: 'flex-end' }}
          />
          {/* Translation lines */}
          <ShimmerBlock
            width="100%"
            height={14}
            borderRadius={7}
            style={{ marginTop: spacing.sm }}
          />
          <ShimmerBlock
            width="75%"
            height={14}
            borderRadius={7}
            style={{ marginTop: spacing.xxs }}
          />
        </View>
      </View>
    </View>
  );
}

// ── Styles ───────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  heroSkeleton: {
    overflow: 'hidden',
  },
  heroRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sectionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  cardSkeleton: {
    overflow: 'hidden',
  },
  chipRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
