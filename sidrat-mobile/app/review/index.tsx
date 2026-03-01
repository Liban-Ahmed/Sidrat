/**
 * Review Session Screen
 *
 * Displays the spaced repetition review queue — lessons due for review,
 * ordered by urgency (critical → overdue → due today). Each card shows
 * category, last score, overdue status, and review count. Tapping a card
 * launches the lesson in review mode (practice-only).
 *
 * Empty state shown when no reviews are due, with encouragement.
 *
 * Design: Oasis palette (Design Spec §6) — olive/gold/sand/earth tones.
 * Never red for wrong/critical; use warm gold/sand instead.
 */

import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useCallback, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import Animated, { FadeInDown, FadeInUp, FadeIn } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScalePress, ProgressBar, EmptyState } from '../../src/components';
import { useReviewQueue } from '../../src/hooks/useReviewQueue';
import { useTheme } from '../../src/theme';
import { tokens } from '../../src/theme/tokens';
import { categoryMeta } from '../../src/types';
import haptic from '../../src/utils/haptics';
import { groupReviewsByUrgency } from '../../src/utils/reviewGroups';
import type { ReviewItem } from '../../src/hooks/useReviewQueue';

// ── Constants ────────────────────────────────────────────────────

const STAGGER = 80;

const URGENCY_CONFIG = {
  critical: {
    label: 'Critical',
    icon: 'alert-circle' as const,
    // Oasis: gold500 (strong warm warning — never red)
    colorLight: tokens.color.gold500,
    colorDark: tokens.color.gold300,
  },
  overdue: {
    label: 'Overdue',
    icon: 'time' as const,
    // Oasis: gold400 (reward/streak warm tone)
    colorLight: tokens.color.gold400,
    colorDark: tokens.color.gold300,
  },
  'due-today': {
    label: 'Due Today',
    icon: 'calendar' as const,
    // Oasis: olive400 (primary brand, growth)
    colorLight: tokens.color.olive400,
    colorDark: tokens.color.olive400,
  },
} as const;

// ── Helper ───────────────────────────────────────────────────────

/**
 * Returns Oasis-palette urgency color.
 * Critical/overdue use warm gold (NOT red — per design spec §4.2 & §11).
 * Due-today uses primary olive.
 */
function getUrgencyColor(urgency: ReviewItem['urgency'], isDark: boolean): string {
  const config = URGENCY_CONFIG[urgency];
  return isDark ? config.colorDark : config.colorLight;
}

/**
 * Returns Oasis-palette score color.
 * Good (≥80) → olive400 (correct/success)
 * Moderate (≥50) → gold400 (reward warm tone)
 * Low (<50) → sand400 (gentle warm, NOT red or orange)
 */
function getScoreColor(score: number, isDark: boolean): string {
  if (score >= 80) return tokens.color.olive400;
  if (score >= 50) return isDark ? tokens.color.gold300 : tokens.color.gold500;
  return tokens.color.sand400;
}

function getDaysLabel(days: number): string {
  if (days === 0) return 'Due today';
  if (days === 1) return '1 day overdue';
  return `${days} days overdue`;
}

// ── Main Component ──────────────────────────────────────────────

export default function ReviewScreen() {
  const { colors, typography, spacing, radius, isDark } = useTheme();
  const router = useRouter();
  const { reviewQueue, reviewCount, hasReviews, nextReview } = useReviewQueue();
  const navigateToReview = useCallback(
    (lessonId: string) => {
      haptic.light();
      router.push(`/lesson/${lessonId}?review=1` as any);
    },
    [router],
  );

  const handleStartAll = useCallback(() => {
    if (nextReview) {
      navigateToReview(nextReview.lessonId);
    }
  }, [nextReview, navigateToReview]);

  // Group reviews by urgency for section rendering
  const sections = useMemo(() => groupReviewsByUrgency(reviewQueue), [reviewQueue]);

  // Oasis palette: olive400 for primary action (buttons, progress, active states)
  const primaryColor = tokens.color.olive400;

  // Oasis summary card: olive50 bg with olive200 border in light;
  // dark olive tint bg with olive400 border in dark
  const summaryCardBg = isDark ? '#1E2A16' : tokens.color.olive50;
  const summaryCardBorder = isDark ? tokens.color.olive400 : tokens.color.olive200;

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]}>
      {/* ── Header ── */}
      <Animated.View entering={FadeIn.duration(400)} style={styles.header}>
        <Pressable
          onPress={() => router.back()}
          hitSlop={12}
          style={styles.backButton}
          accessibilityLabel="Go back"
          accessibilityRole="button"
        >
          <Ionicons name="chevron-back" size={24} color={colors.textSecondary} />
        </Pressable>
        <View style={styles.headerCenter}>
          <Text style={[typography.title2, { color: colors.text }]}>Reviews</Text>
        </View>
        {/* Balance the back button */}
        <View style={styles.backButton} />
      </Animated.View>

      {hasReviews ? (
        <ScrollView
          contentContainerStyle={[styles.scroll, { paddingHorizontal: spacing.md }]}
          showsVerticalScrollIndicator={false}
        >
          {/* ── Summary Card ── */}
          {/* Oasis: olive50 bg + olive200 border → signals "growth/learning" context */}
          <Animated.View
            entering={FadeInDown.duration(600).springify().damping(18)}
            style={[
              styles.summaryCard,
              {
                backgroundColor: summaryCardBg,
                borderRadius: radius.lg,
                padding: spacing.lg,
                borderWidth: 1.5,
                borderColor: summaryCardBorder,
                // Warm earth shadow (spec §6.10)
                shadowColor: tokens.color.earth900,
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.08,
                shadowRadius: 12,
                elevation: 3,
              },
            ]}
          >
            <View style={styles.summaryTop}>
              <View
                style={[
                  styles.summaryIcon,
                  {
                    backgroundColor: isDark ? tokens.color.olive400 + '25' : tokens.color.olive100,
                    borderRadius: radius.full,
                  },
                ]}
              >
                <Ionicons name="refresh" size={24} color={tokens.color.olive400} />
              </View>
              <View style={{ flex: 1, marginLeft: spacing.sm }}>
                <Text style={[typography.title3, { color: colors.text }]}>
                  {reviewCount} {reviewCount === 1 ? 'Lesson' : 'Lessons'} to Review
                </Text>
                <Text style={[typography.bodySmall, { color: colors.textSecondary, marginTop: 2 }]}>
                  Reviewing helps you remember what you've learned!
                </Text>
              </View>
            </View>

            {/* Start button — olive400 → olive500 (spec §6.6 primaryButton gradient) */}
            <ScalePress
              onPress={handleStartAll}
              accessibilityLabel={`Start reviewing ${reviewCount} lessons`}
            >
              <View
                style={[
                  styles.startAllButton,
                  {
                    backgroundColor: primaryColor,
                    borderRadius: radius.md,
                    marginTop: spacing.md,
                    paddingVertical: spacing.sm + 2,
                    // Warm shadow to lift the CTA
                    shadowColor: tokens.color.olive500,
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.3,
                    shadowRadius: 8,
                    elevation: 4,
                  },
                ]}
              >
                <Ionicons name="play-circle" size={20} color={tokens.color.white} />
                <Text
                  style={[typography.label, { color: tokens.color.white, marginLeft: spacing.xs }]}
                >
                  Start Reviewing
                </Text>
              </View>
            </ScalePress>
          </Animated.View>

          {/* ── Review Sections by Urgency ── */}
          {sections.map((section, sectionIdx) => {
            const urgencyColor = getUrgencyColor(section.urgency, isDark);
            const config = URGENCY_CONFIG[section.urgency];

            return (
              <Animated.View
                key={section.urgency}
                entering={FadeInDown.delay(STAGGER * (sectionIdx + 1))
                  .duration(600)
                  .springify()
                  .damping(16)}
                style={{ marginTop: spacing.lg }}
              >
                {/* Section header */}
                <View style={styles.sectionHeader}>
                  <Ionicons name={config.icon} size={16} color={urgencyColor} />
                  <Text style={[typography.label, { color: urgencyColor, marginLeft: spacing.xs }]}>
                    {config.label}
                  </Text>
                  <View
                    style={[
                      styles.countBadge,
                      {
                        backgroundColor: urgencyColor + '22',
                        borderRadius: radius.full,
                        marginLeft: spacing.xs,
                      },
                    ]}
                  >
                    <Text style={[typography.captionBold, { color: urgencyColor }]}>
                      {section.items.length}
                    </Text>
                  </View>
                </View>

                {/* Cards */}
                {section.items.map((item, i) => (
                  <ReviewCard
                    key={item.lessonId}
                    item={item}
                    delay={STAGGER * (sectionIdx + 1) + STAGGER * (i + 1)}
                    onPress={() => navigateToReview(item.lessonId)}
                  />
                ))}
              </Animated.View>
            );
          })}

          {/* ── Motivational footer ── */}
          {/* Oasis: gold400 sparkle — reward color signals encouragement */}
          <Animated.View
            entering={FadeInUp.delay(STAGGER * (sections.length + 2)).duration(500)}
            style={[styles.footer, { marginTop: spacing.xl, paddingBottom: spacing.xxl }]}
          >
            <Ionicons name="sparkles" size={18} color={tokens.color.gold400} />
            <Text
              style={[
                typography.caption,
                { color: colors.textTertiary, marginLeft: spacing.xs, fontStyle: 'italic' },
              ]}
            >
              Regular review builds lasting knowledge, in sha Allah!
            </Text>
          </Animated.View>
        </ScrollView>
      ) : (
        /* ── Empty State ── */
        <EmptyState
          icon="checkmark-circle"
          title="All caught up!"
          subtitle="No reviews due right now. Keep completing lessons and reviews will appear automatically."
          actionLabel="Back to Home"
          onAction={() => router.back()}
          color={tokens.color.olive400}
        />
      )}
    </SafeAreaView>
  );
}

// ── Review Card Component ───────────────────────────────────────

function ReviewCard({
  item,
  delay,
  onPress,
}: {
  item: ReviewItem;
  delay: number;
  onPress: () => void;
}) {
  const { colors, typography, spacing, radius, isDark } = useTheme();

  // Oasis palette — warm gold/sand for urgency, olive for success scores
  const urgencyColor = getUrgencyColor(item.urgency, isDark);
  const scoreColor = getScoreColor(item.lastScore, isDark);
  const categoryInfo = categoryMeta[item.lesson.category];

  // Card border: use urgency color hint in dark, neutral sand200 in light
  const cardBorderColor = isDark ? urgencyColor + '28' : tokens.color.sand200;

  // Category badge: sky50/sky400 → use categoryColors or subtle olive tint
  const categoryBadgeBg = isDark ? tokens.color.olive400 + '20' : tokens.color.olive50;

  return (
    <Animated.View entering={FadeInDown.delay(delay).duration(500).springify().damping(16)}>
      <ScalePress
        onPress={onPress}
        accessibilityLabel={`Review ${item.lesson.title}. ${getDaysLabel(item.daysOverdue)}`}
      >
        <View
          style={[
            styles.card,
            {
              backgroundColor: colors.surface,
              borderRadius: radius.lg,
              marginTop: spacing.sm,
              borderWidth: 1.5,
              borderColor: cardBorderColor,
              // Warm earth shadow (spec §6.10 rnMd)
              shadowColor: tokens.color.earth900,
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: isDark ? 0.2 : 0.08,
              shadowRadius: 12,
              elevation: 3,
            },
          ]}
        >
          {/* Left accent bar — Oasis urgency color strip */}
          <View
            style={[
              styles.cardAccent,
              { backgroundColor: urgencyColor, borderRadius: radius.full },
            ]}
          />

          <View style={[styles.cardBody, { padding: spacing.md, paddingLeft: spacing.sm }]}>
            {/* Category + urgency badges */}
            <View style={styles.cardBadgeRow}>
              {/* Category badge — olive50/olive400 (primary brand tint) */}
              <View
                style={[
                  styles.categoryBadge,
                  {
                    backgroundColor: categoryBadgeBg,
                    borderRadius: radius.full,
                    paddingHorizontal: spacing.xs,
                    paddingVertical: 2,
                  },
                ]}
              >
                <Ionicons
                  name={categoryInfo?.icon as any}
                  size={12}
                  color={tokens.color.olive400}
                />
                <Text
                  style={[typography.captionBold, { color: tokens.color.olive500, marginLeft: 3 }]}
                >
                  {categoryInfo?.label}
                </Text>
              </View>

              {/* Urgency badge — gold/sand warm tones, never red */}
              <View
                style={[
                  styles.urgencyBadge,
                  {
                    backgroundColor: urgencyColor + '18',
                    borderRadius: radius.full,
                    paddingHorizontal: spacing.xs,
                    paddingVertical: 2,
                    marginLeft: spacing.xs,
                  },
                ]}
              >
                <Ionicons name={URGENCY_CONFIG[item.urgency].icon} size={11} color={urgencyColor} />
                <Text
                  style={[
                    typography.captionBold,
                    { color: urgencyColor, marginLeft: 3, fontSize: 10 },
                  ]}
                >
                  {getDaysLabel(item.daysOverdue)}
                </Text>
              </View>
            </View>

            {/* Title — earth800 (primary text, Oasis spec §6.1) */}
            <Text
              style={[typography.label, { color: colors.text, marginTop: spacing.xs }]}
              numberOfLines={1}
            >
              {item.lesson.title}
            </Text>

            {/* Meta row */}
            <View style={[styles.cardMeta, { marginTop: spacing.sm, gap: spacing.md }]}>
              {/* Last score — olive (good) / gold (moderate) / sand (needs work) */}
              <View style={styles.metaItem}>
                <Ionicons name="bar-chart" size={13} color={scoreColor} />
                <Text style={[typography.caption, { color: scoreColor, marginLeft: 3 }]}>
                  {item.lastScore}%
                </Text>
              </View>

              {/* Review count — muted sand400 */}
              <View style={styles.metaItem}>
                <Ionicons name="repeat" size={13} color={colors.textTertiary} />
                <Text style={[typography.caption, { color: colors.textTertiary, marginLeft: 3 }]}>
                  {item.reviewCount === 0 ? 'First review' : `Reviewed ${item.reviewCount}x`}
                </Text>
              </View>

              {/* Duration — muted sand400 */}
              <View style={styles.metaItem}>
                <Ionicons name="time-outline" size={13} color={colors.textTertiary} />
                <Text style={[typography.caption, { color: colors.textTertiary, marginLeft: 3 }]}>
                  ~{Math.max(2, Math.round(item.lesson.durationMinutes * 0.4))} min
                </Text>
              </View>
            </View>

            {/* Score progress bar — olive/gold/sand fill on sand100 track */}
            <View style={{ marginTop: spacing.sm }}>
              <ProgressBar
                progress={item.lastScore / 100}
                color={scoreColor}
                trackColor={isDark ? scoreColor + '22' : tokens.color.sand100}
                height={4}
              />
            </View>
          </View>

          {/* Chevron — urgency color, semi-opaque */}
          <View style={[styles.cardChevron, { paddingRight: spacing.sm }]}>
            <Ionicons name="play-circle" size={24} color={urgencyColor + '90'} />
          </View>
        </View>
      </ScalePress>
    </Animated.View>
  );
}

// ── Styles ──────────────────────────────────────────────────────

const styles = StyleSheet.create({
  safe: { flex: 1 },
  scroll: { paddingTop: 8, paddingBottom: 32 },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  backButton: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
  },

  // Summary card
  summaryCard: {},
  summaryTop: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  summaryIcon: {
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  startAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Section headers
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  countBadge: {
    paddingHorizontal: 7,
    paddingVertical: 1,
  },

  // Review card
  card: {
    flexDirection: 'row',
    overflow: 'hidden',
  },
  cardAccent: {
    width: 4,
  },
  cardBody: {
    flex: 1,
  },
  cardBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  categoryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  urgencyBadge: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardChevron: {
    justifyContent: 'center',
  },

  // Footer
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Empty state
});
