/**
 * DailyAmalSection — Three daily goal cards with progress bars.
 *
 * Design Spec §5.4 — Daily Amal (Quests).
 * Three horizontal progress cards: icon + title + progress bar + Hasanat reward.
 *
 * Goals scale with child's activity level. For now we use a
 * static set per session and track local completion state.
 */

import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, {
  FadeInDown,
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import { useOasisColors } from '../../hooks/useOasisColors';
import {
  tokens,
  SPRINGS,
  SPACING,
  RADIUS,
  SHADOW,
  TYPOGRAPHY,
  type AgeGroup,
} from '../../theme/tokens';
import { JuicyPressable } from '../common/JuicyPressable';

// ── Types ────────────────────────────────────────────────────────

export interface DailyAmal {
  id: string;
  title: string;
  description: string;
  target: number;
  current: number;
  reward: number;
  type: 'lesson' | 'review' | 'listen' | 'streak';
  icon: keyof typeof Ionicons.glyphMap;
}

interface DailyAmalSectionProps {
  amals: DailyAmal[];
  ageGroup: AgeGroup;
}

// ── Animated Progress Bar ────────────────────────────────────────

function AmalProgressBar({ progress, isDark }: { progress: number; isDark: boolean }) {
  const { colors: oasis, t } = useOasisColors();
  const width = useSharedValue(0);

  React.useEffect(() => {
    width.value = withSpring(Math.min(Math.max(progress, 0), 1) * 100, SPRINGS.gentle);
  }, [progress, width]);

  const fillStyle = useAnimatedStyle(() => ({
    width: `${width.value}%` as any,
  }));

  return (
    <View
      style={[styles.progressTrack, { backgroundColor: isDark ? oasis.surfaceBorder : t.sand100 }]}
    >
      <Animated.View style={[styles.progressFill, { backgroundColor: oasis.primary }, fillStyle]} />
    </View>
  );
}

// ── Amal Card ────────────────────────────────────────────────────

function AmalCard({
  amal,
  index,
  ageGroup,
}: {
  amal: DailyAmal;
  index: number;
  ageGroup: AgeGroup;
}) {
  const { colors: oasis, t, isDark } = useOasisColors();
  const isComplete = amal.current >= amal.target;
  const progress = amal.target > 0 ? amal.current / amal.target : 0;
  const bodySize = (TYPOGRAPHY.body as Record<AgeGroup, { fontSize: number; lineHeight: number }>)[
    ageGroup
  ];

  const handlePress = () => {
    // TODO: Navigate to specific goal tracking or celebration screen
  };

  return (
    <Animated.View
      entering={FadeInDown.delay(60 * index)
        .duration(400)
        .springify()
        .damping(20)}
    >
      <JuicyPressable
        onPress={handlePress}
        accessibilityLabel={`${amal.title}: ${amal.current} of ${amal.target} complete. ${isComplete ? 'Completed!' : ''} Reward: ${amal.reward}`}
        accessibilityRole="button"
      >
        <View
          style={[
            styles.card,
            {
              backgroundColor: isComplete ? (isDark ? oasis.correctBg : t.olive50) : oasis.surface,
              borderColor: isComplete ? oasis.correct : oasis.surfaceBorder,
              ...SHADOW.rnMd,
            },
          ]}
        >
          <View style={styles.cardRow}>
            {/* Icon circle */}
            <View
              style={[
                styles.iconCircle,
                {
                  backgroundColor: isDark ? oasis.primaryLight : t.olive100,
                },
              ]}
            >
              <Ionicons name={amal.icon} size={20} color={oasis.primary} />
            </View>

            {/* Title + description */}
            <View style={styles.cardContent}>
              <Text
                style={[
                  styles.cardTitle,
                  {
                    color: oasis.textPrimary,
                    fontSize: Math.max(bodySize.fontSize - 4, 14),
                  },
                ]}
                numberOfLines={1}
              >
                {amal.title}
              </Text>
              <Text style={[styles.cardDesc, { color: oasis.textSecondary }]} numberOfLines={1}>
                {amal.description}
              </Text>
            </View>

            {/* Reward */}
            <View style={styles.rewardCol}>
              <View style={styles.rewardRow}>
                <Ionicons name="sparkles" size={12} color={t.gold500} />
                <Text style={[styles.rewardText, { color: t.gold500 }]}>{amal.reward}</Text>
              </View>
            </View>
          </View>

          {/* Checkmark for completed */}
          {isComplete && (
            <View style={[styles.checkCircle, { backgroundColor: oasis.correct }]}>
              <Ionicons name="checkmark" size={12} color={tokens.color.white} />
            </View>
          )}

          {/* Progress bar */}
          <AmalProgressBar progress={progress} isDark={isDark} />
        </View>
      </JuicyPressable>
    </Animated.View>
  );
}

// ── Section ──────────────────────────────────────────────────────

export function DailyAmalSection({ amals, ageGroup }: DailyAmalSectionProps) {
  const { colors: oasis } = useOasisColors();

  return (
    <View style={styles.section}>
      <Text style={[styles.sectionLabel, { color: oasis.textMuted }]}>DAILY AMAL</Text>
      <View style={styles.cardList}>
        {amals.map((amal, i) => (
          <AmalCard key={amal.id} amal={amal} index={i} ageGroup={ageGroup} />
        ))}
      </View>
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
  cardList: {
    gap: 12,
  },
  card: {
    borderRadius: RADIUS.lg,
    borderWidth: 1.5,
    padding: SPACING.md,
  },
  cardRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardContent: {
    flex: 1,
    marginLeft: SPACING.sm,
    marginRight: SPACING.sm,
  },
  cardTitle: {
    fontFamily: 'Nunito-Bold',
    fontWeight: '700',
    fontSize: 16,
    lineHeight: 20,
  },
  cardDesc: {
    fontFamily: 'Nunito-Regular',
    fontSize: 14,
    lineHeight: 18,
    marginTop: 2,
  },
  rewardCol: {
    alignItems: 'flex-end',
    marginTop: 20,
  },
  rewardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  rewardText: {
    fontFamily: 'Nunito-Bold',
    fontWeight: '600',
    fontSize: 12,
    lineHeight: 18,
  },
  checkCircle: {
    position: 'absolute',
    top: 8,
    right: 10,
    width: 18,
    height: 18,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressTrack: {
    height: 6,
    borderRadius: 4,
    marginTop: SPACING.sm,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
});
