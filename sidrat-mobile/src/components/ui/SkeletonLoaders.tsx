/**
 * Tab-specific skeleton loaders built from shared ShimmerBlock.
 */

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { ShimmerBlock } from './ShimmerBlock';
import { useTheme } from '../../theme';

export function LearnSkeletonLoader() {
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
        style={[
          styles.header,
          { paddingHorizontal: spacing.lg, paddingTop: spacing.xl + 56, paddingBottom: spacing.lg },
        ]}
      >
        <ShimmerBlock width={80} height={20} borderRadius={10} />
        <ShimmerBlock width={48} height={48} borderRadius={24} />
      </View>
      <View style={{ paddingHorizontal: spacing.lg, gap: spacing.sm, marginTop: spacing.md }}>
        <View style={[card, { flexDirection: 'row', alignItems: 'center' }]}>
          <View style={{ flex: 1 }}>
            <ShimmerBlock width={90} height={12} borderRadius={6} />
            <ShimmerBlock
              width="80%"
              height={16}
              borderRadius={8}
              style={{ marginTop: spacing.xs }}
            />
            <ShimmerBlock
              width={100}
              height={36}
              borderRadius={radius.md}
              style={{ marginTop: spacing.sm }}
            />
          </View>
          <ShimmerBlock
            width={44}
            height={44}
            borderRadius={22}
            style={{ marginLeft: spacing.sm }}
          />
        </View>
        <View style={{ flexDirection: 'row', gap: spacing.sm }}>
          {[1, 2, 3, 4].map((i) => (
            <ShimmerBlock key={i} width="23%" height={56} borderRadius={radius.md} />
          ))}
        </View>
        {[1, 2].map((i) => (
          <View key={i} style={[card, { marginTop: spacing.sm }]}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <ShimmerBlock width={32} height={32} borderRadius={16} />
              <View style={{ flex: 1, marginLeft: spacing.sm }}>
                <ShimmerBlock width="60%" height={14} borderRadius={7} />
                <ShimmerBlock width="40%" height={10} borderRadius={5} style={{ marginTop: 4 }} />
              </View>
            </View>
            <ShimmerBlock
              width="100%"
              height={4}
              borderRadius={2}
              style={{ marginTop: spacing.sm }}
            />
            {[1, 2].map((j) => (
              <ShimmerBlock
                key={j}
                width="100%"
                height={44}
                borderRadius={radius.md}
                style={{ marginTop: spacing.xs }}
              />
            ))}
          </View>
        ))}
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
