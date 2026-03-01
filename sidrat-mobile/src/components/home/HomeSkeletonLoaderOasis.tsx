/**
 * HomeSkeletonLoaderOasis — Shimmer placeholder matching the new Oasis home layout.
 *
 * Uses sand100 pulse rectangles (never blank white) matching:
 * 1. GreetingHeader area
 * 2. SalahReminder row
 * 3. Daily Amal cards ×3
 * 4. Continue Learning horizontal scroll
 * 5. Dua of the Day card
 */

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useOasisColors } from '../../hooks/useOasisColors';
import { SPACING, RADIUS } from '../../theme/tokens';
import { ShimmerBlock } from '../ui/ShimmerBlock';

export function HomeSkeletonLoaderOasis() {
  const { colors: oasis, t, isDark } = useOasisColors();

  return (
    <View style={[styles.container, { backgroundColor: oasis.background }]}>
      {/* Greeting header skeleton */}
      <View
        style={[
          styles.heroSkeleton,
          {
            backgroundColor: isDark ? oasis.surfaceAlt : t.olive50,
            paddingHorizontal: SPACING.lg,
            paddingTop: 60,
            paddingBottom: SPACING.lg,
          },
        ]}
      >
        <View style={styles.heroRow}>
          <View style={{ flex: 1 }}>
            {/* Islamic greeting */}
            <ShimmerBlock width={200} height={26} borderRadius={13} />
            {/* Time greeting */}
            <ShimmerBlock
              width={130}
              height={16}
              borderRadius={8}
              style={{ marginTop: SPACING.xs }}
            />
            {/* Child name */}
            <ShimmerBlock
              width={100}
              height={20}
              borderRadius={10}
              style={{ marginTop: SPACING.xs }}
            />
            {/* Hijri date */}
            <ShimmerBlock
              width={160}
              height={14}
              borderRadius={7}
              style={{ marginTop: SPACING.xs }}
            />
          </View>
          {/* Streak badge */}
          <ShimmerBlock width={72} height={44} borderRadius={RADIUS.md} />
        </View>
      </View>

      <View style={{ paddingHorizontal: SPACING.md, marginTop: SPACING.md }}>
        {/* Salah Reminder skeleton */}
        <ShimmerBlock width="100%" height={40} borderRadius={RADIUS.sm} />

        {/* Daily Amal section */}
        <View style={{ marginTop: SPACING.lg }}>
          <ShimmerBlock width={90} height={12} borderRadius={6} />
          <View style={{ gap: 12, marginTop: SPACING.sm }}>
            {[0, 1, 2].map((i) => (
              <View
                key={i}
                style={[
                  styles.amalSkeleton,
                  {
                    backgroundColor: isDark ? oasis.surface : t.sand50,
                    borderColor: oasis.surfaceBorder,
                  },
                ]}
              >
                <View style={styles.amalRow}>
                  <ShimmerBlock width={40} height={40} borderRadius={20} />
                  <View style={{ flex: 1, marginLeft: SPACING.sm }}>
                    <ShimmerBlock width="70%" height={16} borderRadius={8} />
                    <ShimmerBlock
                      width="50%"
                      height={12}
                      borderRadius={6}
                      style={{ marginTop: 4 }}
                    />
                  </View>
                  <ShimmerBlock width={40} height={14} borderRadius={7} />
                </View>
                <ShimmerBlock
                  width="100%"
                  height={6}
                  borderRadius={4}
                  style={{ marginTop: SPACING.sm }}
                />
              </View>
            ))}
          </View>
        </View>

        {/* Continue Learning section */}
        <View style={{ marginTop: SPACING.lg }}>
          <ShimmerBlock width={130} height={12} borderRadius={6} />
          <View style={[styles.scrollRow, { marginTop: SPACING.sm }]}>
            {[0, 1, 2].map((i) => (
              <ShimmerBlock key={i} width={140} height={100} borderRadius={RADIUS.lg} />
            ))}
          </View>
        </View>

        {/* Dua of the Day skeleton */}
        <View
          style={[
            styles.duaSkeleton,
            {
              backgroundColor: isDark ? oasis.infoBg : t.sky50,
              borderColor: isDark ? oasis.infoBorder : t.sky200,
              marginTop: SPACING.lg,
            },
          ]}
        >
          <ShimmerBlock width={100} height={12} borderRadius={6} />
          <ShimmerBlock
            width="90%"
            height={24}
            borderRadius={8}
            style={{ marginTop: SPACING.sm, alignSelf: 'flex-end' }}
          />
          <ShimmerBlock
            width="100%"
            height={14}
            borderRadius={7}
            style={{ marginTop: SPACING.sm }}
          />
          <ShimmerBlock
            width="60%"
            height={12}
            borderRadius={6}
            style={{ marginTop: SPACING.xs }}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  heroSkeleton: {
    overflow: 'hidden',
  },
  heroRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  amalSkeleton: {
    borderRadius: RADIUS.lg,
    borderWidth: 1.5,
    padding: SPACING.md,
  },
  amalRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  scrollRow: {
    flexDirection: 'row',
    gap: 12,
  },
  duaSkeleton: {
    borderRadius: RADIUS.lg,
    borderWidth: 1.5,
    padding: SPACING.md,
  },
});
