/**
 * Tab-specific skeleton loaders built from shared ShimmerBlock.
 */

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { ShimmerBlock } from './ShimmerBlock';
import { useTheme } from '../../theme';
import { tokens, SPACING, RADIUS } from '../../theme/tokens';

export function LearnSkeletonLoader() {
  const { isDark } = useTheme();
  // Oasis-token card skeleton: sand100 bg, sand200 border
  const card = {
    backgroundColor: isDark ? '#292524' + '0A' : tokens.color.sand100,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    borderWidth: 1.5,
    borderColor: isDark ? '#534D47' : tokens.color.sand200,
  };

  return (
    <View style={[styles.root, { backgroundColor: 'transparent' }]}>
      {/* Header skeleton */}
      <View
        style={[
          styles.header,
          { paddingHorizontal: SPACING.md, paddingTop: SPACING.xl + 56, paddingBottom: SPACING.lg },
        ]}
      >
        <ShimmerBlock width={80} height={20} borderRadius={10} />
        <ShimmerBlock width={44} height={44} borderRadius={22} />
      </View>

      {/* Hero card skeleton */}
      <View style={{ paddingHorizontal: SPACING.md, marginTop: SPACING.md }}>
        <View style={[card, { flexDirection: 'row', alignItems: 'center' }]}>
          <View style={{ flex: 1 }}>
            <ShimmerBlock width={90} height={12} borderRadius={6} />
            <ShimmerBlock
              width="80%"
              height={16}
              borderRadius={8}
              style={{ marginTop: SPACING.xs }}
            />
            <ShimmerBlock
              width={100}
              height={36}
              borderRadius={RADIUS.md}
              style={{ marginTop: SPACING.sm }}
            />
          </View>
          <ShimmerBlock
            width={44}
            height={44}
            borderRadius={22}
            style={{ marginLeft: SPACING.sm }}
          />
        </View>
      </View>

      {/* 2×N category grid skeleton */}
      <View style={{ paddingHorizontal: SPACING.md, marginTop: SPACING.lg }}>
        {[0, 1].map((row) => (
          <View
            key={row}
            style={{ flexDirection: 'row', gap: SPACING.md, marginBottom: SPACING.md }}
          >
            {[0, 1].map((col) => (
              <View key={col} style={[card, { flex: 1, minHeight: 100, alignItems: 'center' }]}>
                <ShimmerBlock width={48} height={48} borderRadius={24} />
                <ShimmerBlock
                  width={80}
                  height={14}
                  borderRadius={7}
                  style={{ marginTop: SPACING.sm }}
                />
                <ShimmerBlock width={50} height={10} borderRadius={5} style={{ marginTop: 4 }} />
                <ShimmerBlock
                  width={36}
                  height={36}
                  borderRadius={18}
                  style={{ marginTop: SPACING.sm }}
                />
              </View>
            ))}
          </View>
        ))}
        {/* Extra row with one card */}
        <View style={{ flexDirection: 'row', gap: SPACING.md, marginBottom: SPACING.md }}>
          <View style={[card, { flex: 1, minHeight: 100, alignItems: 'center' }]}>
            <ShimmerBlock width={48} height={48} borderRadius={24} />
            <ShimmerBlock
              width={80}
              height={14}
              borderRadius={7}
              style={{ marginTop: SPACING.sm }}
            />
            <ShimmerBlock width={50} height={10} borderRadius={5} style={{ marginTop: 4 }} />
            <ShimmerBlock
              width={36}
              height={36}
              borderRadius={18}
              style={{ marginTop: SPACING.sm }}
            />
          </View>
          <View style={{ flex: 1 }} />
        </View>
      </View>
    </View>
  );
}

export function ProgressSkeletonLoader() {
  const { colors, spacing, radius, isDark } = useTheme();
  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      <View
        style={[
          styles.profileBlock,
          {
            paddingHorizontal: spacing.lg,
            paddingTop: spacing.xl + 56,
            paddingBottom: spacing.xl,
            backgroundColor: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)',
            borderBottomLeftRadius: radius.xl,
            borderBottomRightRadius: radius.xl,
          },
        ]}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <ShimmerBlock width={64} height={64} borderRadius={32} />
          <View style={{ marginLeft: spacing.md, flex: 1 }}>
            <ShimmerBlock width={120} height={18} borderRadius={9} />
            <ShimmerBlock width={80} height={12} borderRadius={6} style={{ marginTop: 6 }} />
          </View>
        </View>
        <ShimmerBlock width="100%" height={6} borderRadius={3} style={{ marginTop: spacing.md }} />
      </View>
      <View style={{ paddingHorizontal: spacing.lg, marginTop: spacing.lg }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          {[1, 2, 3, 4, 5].map((i) => (
            <View key={i} style={{ alignItems: 'center' }}>
              <ShimmerBlock width={40} height={40} borderRadius={20} />
              <ShimmerBlock width={28} height={10} borderRadius={5} style={{ marginTop: 4 }} />
            </View>
          ))}
        </View>
        <ShimmerBlock
          width="100%"
          height={80}
          borderRadius={radius.lg}
          style={{ marginTop: spacing.xl }}
        />
        <ShimmerBlock
          width="100%"
          height={120}
          borderRadius={radius.lg}
          style={{ marginTop: spacing.lg }}
        />
      </View>
    </View>
  );
}

export function FamilySkeletonLoader() {
  const { colors, spacing, radius, isDark } = useTheme();
  const card = {
    backgroundColor: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)',
    borderRadius: radius.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: isDark ? colors.border : 'rgba(0,0,0,0.04)',
  };

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      <View
        style={{
          paddingHorizontal: spacing.lg,
          paddingTop: spacing.xl + 56,
          paddingBottom: spacing.lg,
          backgroundColor: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)',
          borderBottomLeftRadius: radius.xl,
          borderBottomRightRadius: radius.xl,
        }}
      >
        <ShimmerBlock width={140} height={20} borderRadius={10} />
        <ShimmerBlock width={80} height={24} borderRadius={12} style={{ marginTop: spacing.sm }} />
      </View>
      <View style={{ paddingHorizontal: spacing.lg, marginTop: spacing.lg, gap: spacing.md }}>
        <View style={card}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <ShimmerBlock width={64} height={64} borderRadius={radius.lg} />
            <View style={{ flex: 1, marginLeft: spacing.md }}>
              <ShimmerBlock width="70%" height={16} borderRadius={8} />
              <ShimmerBlock width="50%" height={12} borderRadius={6} style={{ marginTop: 6 }} />
              <ShimmerBlock
                width={100}
                height={36}
                borderRadius={radius.md}
                style={{ marginTop: spacing.sm }}
              />
            </View>
          </View>
        </View>
        <ShimmerBlock width={120} height={16} borderRadius={8} />
        {[1, 2, 3].map((i) => (
          <ShimmerBlock
            key={i}
            width="100%"
            height={20}
            borderRadius={6}
            style={{ marginTop: spacing.xs }}
          />
        ))}
        <ShimmerBlock width={160} height={16} borderRadius={8} style={{ marginTop: spacing.lg }} />
        <View style={{ flexDirection: 'row', gap: spacing.sm, marginTop: spacing.xs }}>
          {[1, 2, 3].map((i) => (
            <ShimmerBlock key={i} width={120} height={36} borderRadius={18} />
          ))}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  profileBlock: { overflow: 'hidden' },
});
