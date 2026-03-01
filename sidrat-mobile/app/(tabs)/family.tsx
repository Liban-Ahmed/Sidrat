/**
 * Family Screen — Weekly family activities with parent scripts.
 *
 * Design Spec §8.5: Collaborative, warm, togetherness.
 * Oasis palette, spring physics, JuicyPressable, warm shadows.
 */

import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useMemo, useCallback, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Alert,
  RefreshControl,
  useColorScheme,
} from 'react-native';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ShimmerBlock } from '../../src/components';
import { JuicyPressable } from '../../src/components/common/JuicyPressable';
import { ANALYTICS_EVENTS } from '../../src/constants/config';
import { analyticsService } from '../../src/services/analyticsService';
import { useAppStore, useFamilyStore } from '../../src/stores';
import {
  ACTIVITY_ICONS,
  getWeekOfYear,
  getActivityForWeek,
  getNextActivity,
} from '../../src/stores/familyStore';
import {
  tokens,
  semanticColors,
  darkSemanticColors,
  SPRINGS,
  SPACING,
  RADIUS,
  SHADOW,
} from '../../src/theme/tokens';
import haptic from '../../src/utils/haptics';
import type { FamilyActivity } from '../../src/stores/familyStore';

// ── Oasis Category Color Mapping (§6.5) ───────────────────────────
// Maps familyStore categories → Oasis category colors
const CATEGORY_COLORS: Record<
  FamilyActivity['category'],
  { primary: string; light: string; icon: keyof typeof Ionicons.glyphMap }
> = {
  quran: { primary: tokens.color.gold500, light: tokens.color.gold50, icon: 'book-outline' },
  dua: { primary: tokens.color.gold400, light: tokens.color.gold50, icon: 'hand-left-outline' },
  character: { primary: tokens.color.rose400, light: tokens.color.rose50, icon: 'heart-outline' },
  worship: { primary: tokens.color.olive400, light: tokens.color.olive50, icon: 'water-outline' },
  knowledge: { primary: tokens.color.sand400, light: tokens.color.sand50, icon: 'book-outline' },
};

// ── Stagger delay (§3.5) ────────────────────────────────────────
const STAGGER_MS = 60;

// ── Loading Skeleton ─────────────────────────────────────────────
function FamilySkeleton() {
  return (
    <View style={{ paddingHorizontal: SPACING.md, paddingTop: SPACING.lg }}>
      {[0, 1].map((i) => (
        <View key={i} style={{ marginBottom: SPACING.md }}>
          <ShimmerBlock width="100%" height={130} borderRadius={RADIUS.lg} />
        </View>
      ))}
      <ShimmerBlock
        width="60%"
        height={16}
        borderRadius={RADIUS.sm}
        style={{ marginTop: SPACING.md }}
      />
      <ShimmerBlock
        width="100%"
        height={80}
        borderRadius={RADIUS.lg}
        style={{ marginTop: SPACING.sm }}
      />
    </View>
  );
}

export default function FamilyScreen() {
  const scheme = useColorScheme();
  const isDark = scheme === 'dark';
  const sc = isDark ? darkSemanticColors : semanticColors;

  const activeChildId = useAppStore((s) => s.activeChildId);
  const { markComplete, isCompleted } = useFamilyStore();

  const weekNum = getWeekOfYear();
  const activity = useMemo(() => getActivityForWeek(weekNum), [weekNum]);
  const completed = isCompleted(weekNum, activeChildId);
  const next = useMemo(() => getNextActivity(weekNum), [weekNum]);

  const [tipsExpanded, setTipsExpanded] = useState(false);
  const [isLoading] = useState(false);

  const catColor = CATEGORY_COLORS[activity.category];
  const nextCatColor = CATEGORY_COLORS[next.category];

  const handleComplete = useCallback(() => {
    haptic.success();
    markComplete(weekNum, activeChildId);
    analyticsService.track(ANALYTICS_EVENTS.FAMILY_ACTIVITY_COMPLETED, {
      activityId: activity.id,
      childId: activeChildId ?? 'none',
    });
    Alert.alert("Masha'Allah! 🎉", "Great job completing this week's family activity together!");
  }, [activity.id, activeChildId, weekNum, markComplete]);

  const handleToggleTips = useCallback(() => {
    haptic.selection();
    setTipsExpanded((v) => !v);
  }, []);

  const [refreshing, setRefreshing] = useState(false);
  const onRefresh = useCallback(() => {
    haptic.light();
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 600);
  }, []);

  // ── Screen background gradient (§6.6) ──
  const screenGradient: [string, string, string] = isDark
    ? [tokens.color.earth900, '#1F1D1A', '#222018']
    : [tokens.color.sand50, tokens.color.cream, tokens.color.olive50];

  if (isLoading) {
    return (
      <SafeAreaView
        style={[styles.safe, { backgroundColor: sc.background }]}
        edges={['left', 'right']}
      >
        <FamilySkeleton />
      </SafeAreaView>
    );
  }

  return (
    <LinearGradient colors={screenGradient} style={styles.safe}>
      <SafeAreaView style={styles.safe} edges={['left', 'right']}>
        <ScrollView
          contentContainerStyle={{ paddingBottom: 100 }}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={tokens.color.olive400}
            />
          }
        >
          {/* ── Warm Header (greeting gradient) ── */}
          <Animated.View
            entering={FadeIn.springify()
              .damping(SPRINGS.gentle.damping)
              .stiffness(SPRINGS.gentle.stiffness)}
          >
            <View
              style={[
                styles.header,
                {
                  paddingHorizontal: SPACING.md,
                  paddingTop: SPACING.xxl + 54,
                  paddingBottom: 0,
                },
              ]}
            >
              <View style={styles.headerTop}>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.headerTitle, { color: sc.textPrimary }]}>Family</Text>
                  <Text style={[styles.headerSubtitle, { color: sc.textMuted }]}>
                    Weekly activities to do together
                  </Text>
                </View>
                <View
                  style={[
                    styles.weekBadge,
                    {
                      backgroundColor: isDark ? tokens.color.earth700 : tokens.color.sand100,
                      borderColor: isDark ? tokens.color.earth700 : tokens.color.sand200,
                      borderWidth: 1,
                      borderRadius: RADIUS.full,
                      marginTop: 6,
                    },
                  ]}
                >
                  <Ionicons name="calendar" size={12} color={sc.textMuted} />
                  <Text style={[styles.weekBadgeText, { color: sc.textMuted }]}>
                    Week {weekNum}
                  </Text>
                </View>
              </View>

              {/* ── Header Divider ── */}
              <View
                style={{
                  height: 1,
                  backgroundColor: sc.surfaceBorder,
                  marginHorizontal: -SPACING.md,
                  marginTop: SPACING.md,
                }}
              />
            </View>
          </Animated.View>

          <View style={{ paddingHorizontal: SPACING.md }}>
            {/* ── Section Label: THIS WEEK ── */}
            <Animated.View
              entering={FadeInDown.springify()
                .damping(SPRINGS.gentle.damping)
                .stiffness(SPRINGS.gentle.stiffness)
                .delay(STAGGER_MS)}
            >
              <Text style={[styles.sectionLabel, { color: sc.textMuted, marginTop: SPACING.lg }]}>
                THIS WEEK&apos;S ACTIVITY
              </Text>
            </Animated.View>

            {/* ── Activity Card (§8.5 — large illustrated card) ── */}
            <Animated.View
              entering={FadeInDown.springify()
                .damping(SPRINGS.gentle.damping)
                .stiffness(SPRINGS.gentle.stiffness)
                .delay(STAGGER_MS * 2)}
              style={{ marginTop: SPACING.sm }}
            >
              <View
                style={[
                  styles.activityCard,
                  {
                    backgroundColor: isDark ? sc.surface : tokens.color.white,
                    borderLeftColor: catColor.primary,
                    ...SHADOW.rnMd,
                  },
                ]}
              >
                {/* Top row: icon + time badge */}
                <View style={styles.activityCardTop}>
                  <View
                    style={[
                      styles.activityIcon,
                      {
                        backgroundColor: isDark ? catColor.primary + '20' : catColor.light,
                      },
                    ]}
                  >
                    <Ionicons
                      name={ACTIVITY_ICONS[activity.id] ?? 'sparkles-outline'}
                      size={24}
                      color={catColor.primary}
                    />
                  </View>
                  <View
                    style={[
                      styles.timeBadge,
                      {
                        backgroundColor: isDark ? tokens.color.earth700 : tokens.color.sand100,
                        borderColor: isDark ? tokens.color.earth700 : tokens.color.sand200,
                      },
                    ]}
                  >
                    <Ionicons name="time-outline" size={11} color={sc.textMuted} />
                    <Text style={[styles.timeBadgeText, { color: sc.textMuted }]}>
                      {activity.duration} min
                    </Text>
                  </View>
                </View>

                {/* Title */}
                <Text style={[styles.activityTitle, { color: sc.textPrimary }]}>
                  {activity.title}
                </Text>

                {/* Description */}
                <Text
                  style={[styles.activityDescription, { color: sc.textSecondary }]}
                  numberOfLines={3}
                >
                  {activity.description}
                </Text>

                {/* Completion state */}
                {completed ? (
                  <View
                    style={[
                      styles.completedChip,
                      {
                        backgroundColor: isDark
                          ? tokens.color.olive400 + '15'
                          : tokens.color.olive50,
                        borderColor: isDark ? tokens.color.olive400 + '40' : tokens.color.olive400,
                      },
                    ]}
                  >
                    <Ionicons name="checkmark-circle" size={16} color={tokens.color.olive400} />
                    <Text style={[styles.completedText, { color: tokens.color.olive600 }]}>
                      Completed
                    </Text>
                  </View>
                ) : (
                  <JuicyPressable
                    onPress={handleComplete}
                    accessibilityLabel="Mark this family activity as done"
                    accessibilityRole="button"
                    style={{ marginTop: SPACING.md }}
                  >
                    <LinearGradient
                      colors={[tokens.color.olive400, tokens.color.olive500]}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                      style={styles.markDoneButton}
                    >
                      <Ionicons
                        name="checkmark-circle-outline"
                        size={18}
                        color={tokens.color.white}
                      />
                      <Text style={styles.markDoneText}>Mark as Done</Text>
                    </LinearGradient>
                  </JuicyPressable>
                )}
              </View>
            </Animated.View>

            {/* ── Section Label: PARENT TIPS ── */}
            <Animated.View
              entering={FadeInDown.springify()
                .damping(SPRINGS.gentle.damping)
                .stiffness(SPRINGS.gentle.stiffness)
                .delay(STAGGER_MS * 3)}
            >
              <JuicyPressable
                onPress={handleToggleTips}
                accessibilityLabel={tipsExpanded ? 'Collapse parent tips' : 'Expand parent tips'}
                accessibilityRole="button"
                style={styles.tipsTouchTarget}
              >
                <View style={[styles.tipsTitleRow, { marginTop: SPACING.lg }]}>
                  <Ionicons name="leaf" size={18} color={tokens.color.olive400} />
                  <Text style={[styles.tipsTitle, { color: sc.textPrimary }]}>Parent Tips</Text>
                  <Ionicons
                    name={tipsExpanded ? 'chevron-up' : 'chevron-down'}
                    size={18}
                    color={sc.textMuted}
                  />
                </View>
              </JuicyPressable>
            </Animated.View>

            {tipsExpanded && (
              <Animated.View
                entering={FadeInDown.springify()
                  .damping(SPRINGS.gentle.damping)
                  .stiffness(SPRINGS.gentle.stiffness)}
                style={[
                  styles.tipsCard,
                  {
                    backgroundColor: isDark ? sc.surface : tokens.color.white,
                    borderColor: isDark ? sc.surfaceBorder : tokens.color.sand200,
                    ...SHADOW.rnSm,
                  },
                ]}
              >
                {activity.tips.map((tip, i) => (
                  <View key={i} style={[styles.tipRow, { marginTop: i > 0 ? SPACING.sm : 0 }]}>
                    <Text style={[styles.tipNumber, { color: tokens.color.olive400 }]}>
                      {i + 1}.
                    </Text>
                    <Text style={[styles.tipText, { color: sc.textSecondary }]}>{tip}</Text>
                  </View>
                ))}
              </Animated.View>
            )}

            {/* ── Section Label: CONVERSATION STARTERS ── */}
            <Animated.View
              entering={FadeInDown.springify()
                .damping(SPRINGS.gentle.damping)
                .stiffness(SPRINGS.gentle.stiffness)
                .delay(STAGGER_MS * 4)}
            >
              <Text style={[styles.sectionLabel, { color: sc.textMuted, marginTop: SPACING.lg }]}>
                CONVERSATION STARTERS
              </Text>
            </Animated.View>
          </View>

          {/* Horizontal prompt pills (breaks out of padding) */}
          <Animated.View
            entering={FadeInDown.springify()
              .damping(SPRINGS.gentle.damping)
              .stiffness(SPRINGS.gentle.stiffness)
              .delay(STAGGER_MS * 5)}
          >
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{
                paddingHorizontal: SPACING.md,
                gap: SPACING.sm,
                paddingTop: SPACING.sm,
              }}
            >
              {activity.prompts.map((prompt, i) => (
                <JuicyPressable
                  key={i}
                  accessibilityLabel={`Conversation starter: ${prompt}`}
                  accessibilityRole="button"
                >
                  <View
                    style={[
                      styles.promptPill,
                      {
                        backgroundColor: isDark ? sc.surface : tokens.color.white,
                        borderColor: isDark ? sc.surfaceBorder : tokens.color.sand200,
                        ...SHADOW.rnSm,
                      },
                    ]}
                  >
                    <Ionicons
                      name="chatbubble"
                      size={14}
                      color={isDark ? tokens.color.olive300 : tokens.color.olive400 + '70'}
                    />
                    <Text style={[styles.promptText, { color: sc.textPrimary }]} numberOfLines={3}>
                      &ldquo;{prompt}&rdquo;
                    </Text>
                  </View>
                </JuicyPressable>
              ))}
            </ScrollView>
          </Animated.View>

          {/* ── Section Label: COMING NEXT ── */}
          <View style={{ paddingHorizontal: SPACING.md }}>
            <Animated.View
              entering={FadeInDown.springify()
                .damping(SPRINGS.gentle.damping)
                .stiffness(SPRINGS.gentle.stiffness)
                .delay(STAGGER_MS * 6)}
              style={{ marginTop: SPACING.lg }}
            >
              <Text style={[styles.sectionLabel, { color: sc.textMuted }]}>NEXT WEEK</Text>
              <View
                style={[
                  styles.comingNextCard,
                  {
                    backgroundColor: isDark ? sc.surface : tokens.color.white,
                    borderColor: isDark ? sc.surfaceBorder : tokens.color.sand200,
                    borderLeftColor: nextCatColor.primary,
                    ...SHADOW.rnSm,
                  },
                ]}
              >
                <View
                  style={[
                    styles.comingNextIcon,
                    {
                      backgroundColor: isDark ? nextCatColor.primary + '20' : nextCatColor.light,
                    },
                  ]}
                >
                  <Ionicons
                    name={ACTIVITY_ICONS[next.id] ?? 'sparkles-outline'}
                    size={16}
                    color={nextCatColor.primary}
                  />
                </View>
                <View style={{ flex: 1, marginLeft: SPACING.sm }}>
                  <Text style={[styles.comingNextTitle, { color: sc.textSecondary }]}>
                    {next.title}
                  </Text>
                  <Text style={[styles.comingNextMeta, { color: sc.textMuted }]}>
                    {next.duration} min · {next.category}
                  </Text>
                </View>
              </View>
            </Animated.View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}

// ─────────────────────────────────────────────────────────────────
// Styles — all values from Oasis tokens, no ad-hoc hex
// ─────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  safe: { flex: 1 },

  // ── Header ──
  header: { overflow: 'hidden' },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  headerTitle: {
    fontFamily: 'Nunito-Bold',
    fontSize: 26,
    lineHeight: 32,
    fontWeight: '700',
  },
  headerSubtitle: {
    fontFamily: 'Nunito-Regular',
    fontSize: 14,
    lineHeight: 20,
    marginTop: 2,
  },
  weekBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 5,
  },
  weekBadgeText: {
    fontFamily: 'Nunito-SemiBold',
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
  },

  // ── Section Labels (§6 — uppercase, sand400, bold 12pt, 1.2 spacing) ──
  sectionLabel: {
    fontFamily: 'Nunito-Bold',
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1.2,
    marginBottom: SPACING.sm,
  },

  // ── Activity Card ──
  activityCard: {
    borderRadius: RADIUS.lg,
    borderLeftWidth: 4,
    padding: SPACING.md,
    minHeight: 100,
  },
  activityCardTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  activityIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  timeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: RADIUS.sm,
    borderWidth: 1,
  },
  timeBadgeText: {
    fontFamily: 'Nunito-Regular',
    fontSize: 12,
    marginLeft: 3,
  },
  activityTitle: {
    fontFamily: 'Nunito-Bold',
    fontSize: 17,
    fontWeight: '700',
    lineHeight: 22,
    marginTop: SPACING.sm,
  },
  activityDescription: {
    fontFamily: 'Nunito-Regular',
    fontSize: 14,
    lineHeight: 22,
    marginTop: SPACING.xs,
  },
  completedChip: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: RADIUS.sm,
    borderWidth: 1,
    marginTop: SPACING.md,
    gap: 5,
  },
  completedText: {
    fontFamily: 'Nunito-Bold',
    fontSize: 13,
    fontWeight: '700',
  },
  markDoneButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: RADIUS.md,
    gap: 8,
    minHeight: 48,
  },
  markDoneText: {
    fontFamily: 'Nunito-Bold',
    fontSize: 16,
    fontWeight: '700',
    color: tokens.color.white,
  },

  // ── Tips ──
  tipsTouchTarget: {
    minHeight: 48,
    justifyContent: 'center',
  },
  tipsTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  tipsTitle: {
    fontFamily: 'Nunito-Bold',
    fontSize: 16,
    fontWeight: '700',
    flex: 1,
    marginLeft: SPACING.xs,
  },
  tipsCard: {
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    padding: SPACING.md,
    marginTop: SPACING.sm,
  },
  tipRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  tipNumber: {
    fontFamily: 'Nunito-SemiBold',
    fontSize: 13,
    fontWeight: '600',
    width: 20,
  },
  tipText: {
    fontFamily: 'Nunito-Regular',
    fontSize: 14,
    lineHeight: 20,
    flex: 1,
  },

  // ── Conversation Pills ──
  promptPill: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    maxWidth: 280,
    borderRadius: RADIUS.xl,
    borderWidth: 1,
  },
  promptText: {
    fontFamily: 'Nunito-Regular',
    fontSize: 14,
    maxWidth: 220,
    lineHeight: 20,
  },

  // ── Coming Next ──
  comingNextCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderLeftWidth: 3,
    padding: SPACING.md,
    marginTop: SPACING.xs,
  },
  comingNextIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  comingNextTitle: {
    fontFamily: 'Nunito-SemiBold',
    fontSize: 15,
    fontWeight: '600',
  },
  comingNextMeta: {
    fontFamily: 'Nunito-Regular',
    fontSize: 13,
    marginTop: 2,
  },
});
