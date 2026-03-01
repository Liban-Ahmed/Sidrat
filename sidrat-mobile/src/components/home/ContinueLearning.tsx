/**
 * ContinueLearning — Horizontal scroll row of category cards.
 *
 * Design Spec §8.1 — Continue Learning section.
 * Shows each curriculum category with icon, name, progress bar,
 * and completion percentage.
 */

import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import Animated, {
  FadeInDown,
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import { useOasisColors } from '../../hooks/useOasisColors';
import { tokens, SPRINGS, SPACING, RADIUS, SHADOW, type AgeGroup } from '../../theme/tokens';
import haptic from '../../utils/haptics';
import { JuicyPressable } from '../common/JuicyPressable';

// ── Category colors per spec §6.5 ───────────────────────────────

const CATEGORY_OASIS_COLORS: Record<string, { primary: string; light: string }> = {
  aqeedah: { primary: tokens.color.sky400, light: tokens.color.sky50 },
  quran: { primary: tokens.color.gold500, light: tokens.color.gold50 },
  salah: { primary: tokens.color.olive400, light: tokens.color.olive50 },
  wudu: { primary: tokens.color.sky500, light: tokens.color.sky100 },
  duaa: { primary: tokens.color.gold400, light: tokens.color.gold50 },
  seerah: { primary: tokens.color.sand400, light: tokens.color.sand50 },
  adab: { primary: tokens.color.rose400, light: tokens.color.rose50 },
  stories: { primary: tokens.color.olive300, light: tokens.color.olive50 },
};

// ── Types ────────────────────────────────────────────────────────

export interface CategoryProgress {
  category: string;
  label: string;
  ionIcon: keyof typeof Ionicons.glyphMap;
  completedCount: number;
  totalCount: number;
}

interface ContinueLearningProps {
  categories: CategoryProgress[];
  ageGroup: AgeGroup;
}

// ── Progress Bar ─────────────────────────────────────────────────

function CategoryBar({
  progress,
  color,
  isDark,
}: {
  progress: number;
  color: string;
  isDark: boolean;
}) {
  const { colors: oasis, t } = useOasisColors();
  const barWidth = useSharedValue(0);

  React.useEffect(() => {
    barWidth.value = withSpring(Math.min(Math.max(progress, 0), 1) * 100, SPRINGS.gentle);
  }, [progress, barWidth]);

  const fillStyle = useAnimatedStyle(() => ({
    width: `${barWidth.value}%` as any,
  }));

  return (
    <View style={[styles.barTrack, { backgroundColor: isDark ? oasis.surfaceBorder : t.sand100 }]}>
      <Animated.View style={[styles.barFill, { backgroundColor: color }, fillStyle]} />
    </View>
  );
}

// ── Category Card ────────────────────────────────────────────────

function CategoryCard({ item, index }: { item: CategoryProgress; index: number }) {
  const { colors: oasis, isDark } = useOasisColors();
  const router = useRouter();
  const meta = CATEGORY_OASIS_COLORS[item.category] ?? {
    primary: oasis.primary,
    light: oasis.primaryLight,
    icon: '📚',
  };
  const progress = item.totalCount > 0 ? item.completedCount / item.totalCount : 0;
  const pct = Math.round(progress * 100);

  return (
    <Animated.View
      entering={FadeInDown.delay(60 * index)
        .duration(400)
        .springify()
        .damping(20)}
    >
      <JuicyPressable
        onPress={() => {
          haptic.light();
          router.push('/(tabs)/learn' as any);
        }}
        accessibilityLabel={`${item.label}: ${pct}% complete. Tap to continue learning.`}
        accessibilityRole="button"
      >
        <View
          style={[
            styles.card,
            {
              backgroundColor: oasis.surface,
              borderColor: oasis.surfaceBorder,
              ...SHADOW.rnSm,
            },
          ]}
        >
          {/* Icon circle */}
          <View
            style={[
              styles.iconCircle,
              { backgroundColor: isDark ? meta.primary + '20' : meta.light },
            ]}
          >
            <Ionicons name={item.ionIcon} size={24} color={meta.primary} />
          </View>

          {/* Category name */}
          <Text style={[styles.catName, { color: oasis.textPrimary }]} numberOfLines={1}>
            {item.label}
          </Text>

          {/* Progress bar */}
          <CategoryBar progress={progress} color={meta.primary} isDark={isDark} />

          {/* Percentage */}
          <Text style={[styles.pct, { color: oasis.textMuted }]}>{pct}%</Text>
        </View>
      </JuicyPressable>
    </Animated.View>
  );
}

// ── Section ──────────────────────────────────────────────────────

export function ContinueLearning({ categories, ageGroup: _ageGroup }: ContinueLearningProps) {
  const { colors: oasis, t, isDark } = useOasisColors();

  if (categories.length === 0) {
    return (
      <View style={styles.section}>
        <Text style={[styles.sectionLabel, { color: oasis.textMuted }]}>CONTINUE LEARNING</Text>
        <View
          style={[
            styles.emptyCard,
            {
              backgroundColor: isDark ? oasis.primaryLight : t.olive50,
              borderColor: oasis.surfaceBorder,
            },
          ]}
        >
          <Text style={[styles.emptyText, { color: oasis.textSecondary }]}>
            Start your first lesson!
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.section}>
      <Text style={[styles.sectionLabel, { color: oasis.textMuted }]}>CONTINUE LEARNING</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {categories.map((cat, i) => (
          <CategoryCard key={cat.category} item={cat} index={i} />
        ))}
      </ScrollView>
    </View>
  );
}

// ── Styles ───────────────────────────────────────────────────────

const styles = StyleSheet.create({
  section: {
    marginTop: SPACING.lg,
  },
  sectionLabel: {
    fontFamily: 'Nunito-Bold',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    marginBottom: SPACING.sm,
  },
  scrollContent: {
    paddingRight: SPACING.md,
    gap: 12,
  },
  card: {
    width: 140,
    height: 100,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    padding: SPACING.sm,
    justifyContent: 'space-between',
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  catName: {
    fontFamily: 'Nunito-Bold',
    fontWeight: '700',
    fontSize: 14,
    lineHeight: 18,
  },
  barTrack: {
    height: 4,
    borderRadius: 2,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    borderRadius: 2,
  },
  pct: {
    fontFamily: 'Nunito-Regular',
    fontSize: 12,
    lineHeight: 16,
    textAlign: 'right',
  },
  emptyCard: {
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    padding: SPACING.lg,
    alignItems: 'center',
    justifyContent: 'center',
    height: 100,
  },
  emptyText: {
    fontFamily: 'Nunito-Regular',
    fontSize: 16,
    lineHeight: 22,
  },
});
