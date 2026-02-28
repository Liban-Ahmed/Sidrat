/**
 * Family Screen -- Weekly family activities with parent scripts.
 * Compact warm header, open activity layout, collapsible tips,
 * horizontal conversation pills, and staggered entrance animations.
 */

import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useMemo, useCallback, useState } from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet, Alert, RefreshControl } from 'react-native';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button, BismillahHeader, ScalePress } from '../../src/components';
import { ANALYTICS_EVENTS } from '../../src/constants/config';
import { analyticsService } from '../../src/services/analyticsService';
import { useAppStore, useFamilyStore } from '../../src/stores';
import {
  ACTIVITY_ICONS,
  getWeekOfYear,
  getActivityForWeek,
  getNextActivity,
} from '../../src/stores/familyStore';
import { useTheme } from '../../src/theme';
import type { FamilyActivity } from '../../src/stores/familyStore';

export default function FamilyScreen() {
  const { brand, colors, typography, spacing, radius, gradients, shadows, isDark } = useTheme();

  const activeChildId = useAppStore((s) => s.activeChildId);
  const { markComplete, isCompleted } = useFamilyStore();

  const weekNum = getWeekOfYear();
  const activity = useMemo(() => getActivityForWeek(weekNum), [weekNum]);
  const completed = isCompleted(weekNum, activeChildId);

  const [tipsExpanded, setTipsExpanded] = useState(false);

  const handleComplete = useCallback(() => {
    markComplete(weekNum, activeChildId);
    analyticsService.track(ANALYTICS_EVENTS.FAMILY_ACTIVITY_COMPLETED, {
      activityId: activity.id,
      childId: activeChildId ?? 'none',
    });
    Alert.alert("Masha'Allah! 🎉", "Great job completing this week's family activity together!");
  }, [activity.id, activeChildId, weekNum, markComplete]);

  const CATEGORY_COLORS: Record<FamilyActivity['category'], string> = {
    quran: brand.primary,
    dua: brand.secondary,
    character: brand.secondaryLight,
    worship: brand.accent,
    knowledge: brand.lavender,
  };

  const catColor = CATEGORY_COLORS[activity.category];
  const next = useMemo(() => getNextActivity(weekNum), [weekNum]);

  const [refreshing, setRefreshing] = useState(false);
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 600);
  }, []);

  return (
    <SafeAreaView
      style={[styles.safe, { backgroundColor: colors.background }]}
      edges={['left', 'right']}
    >
      <ScrollView
        contentContainerStyle={{ paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={brand.primary} />
        }
      >
        {/* ── Compact warm header ── */}
        <Animated.View entering={FadeIn.duration(400)}>
          <LinearGradient
            colors={gradients.familyHero as unknown as [string, string]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={[
              styles.header,
              {
                paddingHorizontal: spacing.lg,
                paddingTop: spacing.xl + 54,
                paddingBottom: spacing.lg,
              },
            ]}
          >
            <View style={styles.headerTop}>
              <View style={{ flex: 1 }}>
                <Text style={[typography.largeTitle, { color: '#FFF' }]}>Family</Text>
                <Text
                  style={[
                    typography.bodySmall,
                    { color: 'rgba(255,255,255,0.75)', marginTop: spacing.xxxs },
                  ]}
                >
                  Weekly activities to do together
                </Text>
              </View>
              <View
                style={[
                  styles.weekBadge,
                  { backgroundColor: 'rgba(255,255,255,0.18)', borderRadius: radius.full },
                ]}
              >
                <Ionicons name="calendar" size={12} color="rgba(255,255,255,0.8)" />
                <Text style={[typography.labelSmall, { color: '#FFF', marginLeft: 4 }]}>
                  Week {weekNum}
                </Text>
              </View>
            </View>
            <View style={{ marginTop: spacing.sm }}>
              <BismillahHeader size="sm" color="rgba(255,255,255,0.15)" align="center" />
            </View>
          </LinearGradient>
          {/* Bottom curve blending into background */}
          <View
            style={{
              height: 24,
              marginTop: -24,
              backgroundColor: colors.background,
              borderTopLeftRadius: radius.xl,
              borderTopRightRadius: radius.xl,
            }}
          />
        </Animated.View>

        <View style={{ paddingHorizontal: spacing.lg }}>
          {/* ── This Week's Activity (open layout) ── */}
          <Animated.View
            entering={FadeInDown.delay(100).duration(400)}
            style={{ marginTop: spacing.lg }}
          >
            <View style={styles.activityRow}>
              <View
                style={[
                  styles.activityIcon,
                  {
                    backgroundColor: catColor + (isDark ? '20' : '10'),
                    borderColor: catColor + '25',
                  },
                ]}
              >
                <Ionicons
                  name={ACTIVITY_ICONS[activity.id] ?? 'sparkles-outline'}
                  size={30}
                  color={catColor}
                />
              </View>
              <View style={{ flex: 1, marginLeft: spacing.md }}>
                <Text style={[typography.title1, { color: colors.text }]}>{activity.title}</Text>
                <View style={styles.activityMeta}>
                  <Ionicons name="time-outline" size={13} color={colors.textTertiary} />
                  <Text style={[typography.caption, { color: colors.textTertiary, marginLeft: 3 }]}>
                    {activity.duration} min
                  </Text>
                  <View style={[styles.metaDot, { backgroundColor: colors.textTertiary }]} />
                  <Text
                    style={[
                      typography.caption,
                      { color: catColor, fontWeight: '600', textTransform: 'capitalize' },
                    ]}
                  >
                    {activity.category}
                  </Text>
                </View>
              </View>
            </View>

            <Text
              style={[
                typography.body,
                { color: colors.textSecondary, marginTop: spacing.sm, lineHeight: 24 },
              ]}
            >
              {activity.description}
            </Text>

            <Button
              title={completed ? '✓ Completed!' : 'Mark as Done'}
              variant={completed ? 'secondary' : 'accent'}
              fullWidth
              disabled={completed}
              onPress={handleComplete}
              style={{ marginTop: spacing.lg }}
              accessibilityLabel={
                completed ? 'Activity completed' : 'Mark this family activity as done'
              }
              accessibilityRole="button"
            />
          </Animated.View>

          {/* ── Parent Tips (collapsible) ── */}
          <Animated.View
            entering={FadeInDown.delay(200).duration(400)}
            style={{ marginTop: spacing.xxl }}
          >
            <Pressable
              onPress={() => setTipsExpanded((v) => !v)}
              style={styles.tipsTitleRow}
              accessibilityRole="button"
              accessibilityLabel={tipsExpanded ? 'Collapse parent tips' : 'Expand parent tips'}
            >
              <Ionicons name="leaf" size={18} color={brand.secondary} />
              <Text
                style={[typography.title3, { color: colors.text, flex: 1, marginLeft: spacing.xs }]}
              >
                Parent Tips
              </Text>
              <Ionicons
                name={tipsExpanded ? 'chevron-up' : 'chevron-down'}
                size={18}
                color={colors.textTertiary}
              />
            </Pressable>

            {tipsExpanded && (
              <Animated.View entering={FadeInDown.duration(300)} style={{ marginTop: spacing.sm }}>
                {activity.tips.map((tip, i) => (
                  <View key={i} style={[styles.tipRow, { marginTop: i > 0 ? spacing.sm : 0 }]}>
                    <Text style={[typography.labelSmall, { color: brand.secondary, width: 20 }]}>
                      {i + 1}.
                    </Text>
                    <Text
                      style={[
                        typography.bodySmall,
                        { color: colors.textSecondary, flex: 1, lineHeight: 20 },
                      ]}
                    >
                      {tip}
                    </Text>
                  </View>
                ))}
              </Animated.View>
            )}
          </Animated.View>

          {/* ── Conversation Starters (horizontal pills) ── */}
          <Animated.View
            entering={FadeInDown.delay(300).duration(400)}
            style={{ marginTop: spacing.xxl }}
          >
            <View style={styles.sectionTitleRow}>
              <Ionicons name="chatbubble-ellipses-outline" size={18} color={brand.primary} />
              <Text style={[typography.title3, { color: colors.text, marginLeft: spacing.xs }]}>
                Conversation Starters
              </Text>
            </View>
          </Animated.View>
        </View>

        {/* ScrollView needs to break out of padding */}
        <Animated.View entering={FadeInDown.delay(320).duration(400)}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{
              paddingHorizontal: spacing.lg,
              gap: spacing.sm,
              paddingTop: spacing.sm,
            }}
          >
            {activity.prompts.map((prompt, i) => (
              <ScalePress key={i} pressScale={0.97} haptic>
                <View
                  style={[
                    styles.promptPill,
                    {
                      backgroundColor: isDark ? colors.surfaceSecondary : colors.surface,
                      borderRadius: radius.xl,
                      borderWidth: 1,
                      borderColor: isDark ? colors.surfaceTertiary : colors.separator,
                      ...shadows.subtle,
                    },
                  ]}
                >
                  <Ionicons name="chatbubble" size={14} color={brand.primary + '60'} />
                  <Text
                    style={[typography.bodySmall, { color: colors.text, maxWidth: 220 }]}
                    numberOfLines={3}
                  >
                    &ldquo;{prompt}&rdquo;
                  </Text>
                </View>
              </ScalePress>
            ))}
          </ScrollView>
        </Animated.View>

        {/* ── Coming Next (muted footer row) ── */}
        <Animated.View
          entering={FadeInDown.delay(380).duration(400)}
          style={[styles.comingNext, { paddingHorizontal: spacing.lg, marginTop: spacing.xxl }]}
        >
          <Text
            style={[typography.caption, { color: colors.textTertiary, marginBottom: spacing.xs }]}
          >
            Next week
          </Text>
          <View style={styles.comingNextRow}>
            <View
              style={[
                styles.comingNextIcon,
                {
                  backgroundColor: CATEGORY_COLORS[next.category] + '12',
                  borderRadius: radius.md,
                },
              ]}
            >
              <Ionicons
                name={ACTIVITY_ICONS[next.id] ?? 'sparkles-outline'}
                size={16}
                color={CATEGORY_COLORS[next.category]}
              />
            </View>
            <View style={{ flex: 1, marginLeft: spacing.sm }}>
              <Text style={[typography.label, { color: colors.textSecondary }]}>{next.title}</Text>
              <Text style={[typography.caption, { color: colors.textTertiary }]}>
                {next.duration} min · {next.category}
              </Text>
            </View>
          </View>
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },

  // Header
  header: { overflow: 'hidden' },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  weekBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 5,
  },

  // Activity
  activityRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  activityIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activityMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  metaDot: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    marginHorizontal: 8,
  },

  // Tips
  tipsTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  tipRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },

  // Section title
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  // Conversation pills
  promptPill: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    maxWidth: 280,
  },

  // Coming next
  comingNext: { opacity: 0.6 },
  comingNextRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  comingNextIcon: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
