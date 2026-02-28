/**
 * Settings Screen
 *
 * Parent controls, profile management, parental gate.
 * All toggles wired to settingsStore.
 */

import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  Switch,
  Alert,
  StyleSheet,
  Linking,
  Appearance,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useTheme } from '../../src/theme';
import { useAppStore, useAuthStore, useChildStore, useSettingsStore } from '../../src/stores';
import { Avatar, Card } from '../../src/components';
import { authService } from '../../src/services/auth';
import { audioService } from '../../src/services/audioService';
import { notificationService } from '../../src/services/notificationService';
import { useParentalGate } from '../../src/hooks';
import { ParentalGate } from '../../src/components/common/ParentalGate';

// ── Reminder time options ──────────────────────────────────────────

const REMINDER_HOURS = [
  { label: '7:00 AM', hour: 7 },
  { label: '12:00 PM', hour: 12 },
  { label: '3:00 PM', hour: 15 },
  { label: '5:00 PM', hour: 17 },
  { label: '8:00 PM', hour: 20 },
] as const;

function formatReminderHour(hour: number): string {
  const match = REMINDER_HOURS.find((r) => r.hour === hour);
  if (match) return match.label;
  const suffix = hour >= 12 ? 'PM' : 'AM';
  const h = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
  return `${h}:00 ${suffix}`;
}

export default function SettingsScreen() {
  const { brand, colors, typography, spacing, radius, gradients, shadows, isDark } = useTheme();
  const router = useRouter();

  const children = useChildStore((s) => s.children);
  const removeChild = useChildStore((s) => s.removeChild);
  const activeChildId = useAppStore((s) => s.activeChildId);
  const setActiveChild = useAppStore((s) => s.setActiveChild);
  const resetApp = useAppStore((s) => s.reset);
  const clearAuth = useAuthStore((s) => s.clearAuth);
  const isAnonymous = useAuthStore((s) => s.isAnonymous);

  // Settings store
  const soundEnabled = useSettingsStore((s) => s.soundEnabled);
  const setSoundEnabled = useSettingsStore((s) => s.setSoundEnabled);
  const hapticsEnabled = useSettingsStore((s) => s.hapticsEnabled);
  const setHapticsEnabled = useSettingsStore((s) => s.setHapticsEnabled);
  const narrationEnabled = useSettingsStore((s) => s.narrationEnabled);
  const setNarrationEnabled = useSettingsStore((s) => s.setNarrationEnabled);
  const dailyReminderEnabled = useSettingsStore((s) => s.dailyReminderEnabled);
  const setDailyReminder = useSettingsStore((s) => s.setDailyReminder);
  const reminderHour = useSettingsStore((s) => s.reminderHour);
  const setReminderHour = useSettingsStore((s) => s.setReminderHour);
  const themePreference = useSettingsStore((s) => s.themePreference);
  const setThemePreference = useSettingsStore((s) => s.setThemePreference);
  const analyticsEnabled = useSettingsStore((s) => s.analyticsEnabled);
  const setAnalyticsEnabled = useSettingsStore((s) => s.setAnalyticsEnabled);

  // Parental gate
  const { isUnlocked, attemptUnlock } = useParentalGate();
  const [gateVisible, setGateVisible] = useState(false);
  const [pendingAction, setPendingAction] = useState<(() => void) | null>(null);

  const requireGate = useCallback(
    (action: () => void) => {
      if (isUnlocked) {
        action();
      } else {
        const { showGate, onVerified } = attemptUnlock(action);
        if (showGate) {
          setPendingAction(() => onVerified);
          setGateVisible(true);
        } else {
          onVerified();
        }
      }
    },
    [isUnlocked, attemptUnlock],
  );

  const handleGateSuccess = useCallback(() => {
    pendingAction?.();
    setPendingAction(null);
    setGateVisible(false);
  }, [pendingAction]);

  const handleGateCancel = useCallback(() => {
    setPendingAction(null);
    setGateVisible(false);
  }, []);

  // ── Handlers ──

  const handleToggleSound = useCallback(
    (value: boolean) => {
      setSoundEnabled(value);
      // Stop any playing TTS immediately when sound is switched off
      if (!value) audioService.stop();
    },
    [setSoundEnabled],
  );

  const handleToggleHaptics = useCallback(
    (value: boolean) => setHapticsEnabled(value),
    // haptics.ts reads hapticsEnabled from store directly — no extra wiring needed
    [setHapticsEnabled],
  );

  const handleToggleNarration = useCallback(
    (value: boolean) => {
      setNarrationEnabled(value);
      // Stop any in-progress speech when narration is turned off
      if (!value) audioService.stop();
    },
    [setNarrationEnabled],
  );

  const handleToggleReminder = useCallback(
    async (value: boolean) => {
      if (value) {
        const granted = await notificationService.requestPermissions();
        if (granted) {
          // Use the stored reminderHour so the toggle respects the current time
          await notificationService.scheduleDailyReminder(reminderHour);
          setDailyReminder(true);
        } else {
          Alert.alert(
            'Notifications Disabled',
            'Please enable notifications in your device Settings to receive daily reminders.',
          );
        }
      } else {
        await notificationService.cancelAll();
        setDailyReminder(false);
      }
    },
    [setDailyReminder, reminderHour],
  );

  const handleReminderTime = useCallback(() => {
    Alert.alert('Reminder Time', 'Choose when to send the daily reminder:', [
      ...REMINDER_HOURS.map(({ label, hour }) => ({
        text: hour === reminderHour ? `${label} ✓` : label,
        onPress: async () => {
          setReminderHour(hour);
          if (dailyReminderEnabled) {
            const granted = await notificationService.hasPermission();
            if (granted) {
              await notificationService.scheduleDailyReminder(hour);
            }
          }
        },
      })),
      { text: 'Cancel', style: 'cancel' as const },
    ]);
  }, [reminderHour, setReminderHour, dailyReminderEnabled]);

  const handleRemoveChild = useCallback(
    (id: string, name: string) => {
      requireGate(() => {
        Alert.alert(
          'Remove Profile',
          `Are you sure you want to remove ${name}'s profile? This cannot be undone.`,
          [
            { text: 'Cancel', style: 'cancel' },
            {
              text: 'Remove',
              style: 'destructive',
              onPress: () => {
                removeChild(id);
                if (activeChildId === id) {
                  const remaining = children.filter((c) => c.id !== id);
                  if (remaining.length > 0 && remaining[0]) {
                    setActiveChild(remaining[0].id);
                  }
                }
              },
            },
          ],
        );
      });
    },
    [requireGate, removeChild, activeChildId, children, setActiveChild],
  );

  const handleDeleteAccount = useCallback(() => {
    requireGate(() => {
      Alert.alert(
        'Delete Account',
        "This will permanently delete your account and all children's data. This action cannot be undone.",
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Delete Everything',
            style: 'destructive',
            onPress: async () => {
              // Attempt remote deletion but never let it block local cleanup.
              // Anonymous sessions have no remote record to delete.
              if (!isAnonymous) {
                try {
                  await authService.deleteAccount();
                } catch (error) {
                  // Network/server errors are non-fatal — we still wipe
                  // local data so the user is signed out on this device.
                  console.warn(
                    '[Settings] Remote account deletion failed (local data will still be cleared):',
                    error,
                  );
                }
              }

              // Always clear local state and navigate away
              clearAuth();
              resetApp();
              router.replace('/welcome');
            },
          },
        ],
      );
    });
  }, [requireGate, isAnonymous, clearAuth, resetApp, router]);

  // Sign out does NOT require the parental gate — it's a parent action the parent initiates
  const handleSignOut = useCallback(() => {
    Alert.alert('Sign Out', 'Your local data will be preserved. You can sign in again later.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Sign Out',
        onPress: async () => {
          try {
            await authService.signOut();
            clearAuth();
            resetApp();
            router.replace('/welcome');
          } catch {
            clearAuth();
            resetApp();
            router.replace('/welcome');
          }
        },
      },
    ]);
  }, [clearAuth, resetApp, router]);

  // ── Theme segment ──

  const THEME_OPTIONS: {
    value: 'system' | 'light' | 'dark';
    icon: keyof typeof Ionicons.glyphMap;
    label: string;
    previewBg: string;
    previewBar1: string;
    previewBar2: string;
  }[] = [
    {
      value: 'light',
      icon: 'sunny-outline',
      label: 'Light',
      previewBg: '#F5F5F5',
      previewBar1: '#1A3A5C',
      previewBar2: '#C8C8C8',
    },
    {
      value: 'system',
      icon: 'phone-portrait-outline',
      label: 'Auto',
      // Uses current theme colors so the preview is contextual
      previewBg: isDark ? '#1C1C1E' : '#F5F5F5',
      previewBar1: isDark ? '#E0E0E0' : '#1A3A5C',
      previewBar2: isDark ? '#555' : '#C8C8C8',
    },
    {
      value: 'dark',
      icon: 'moon-outline',
      label: 'Dark',
      previewBg: '#1C1C1E',
      previewBar1: '#E0E0E0',
      previewBar2: '#555555',
    },
  ];

  // ── Preferences toggle list ──

  interface ToggleItem {
    icon: keyof typeof Ionicons.glyphMap;
    label: string;
    value: boolean;
    onToggle: (v: boolean) => void;
  }

  const preferenceToggles: ToggleItem[] = [
    {
      icon: 'volume-medium-outline',
      label: 'Sound Effects',
      value: soundEnabled,
      onToggle: handleToggleSound,
    },
    {
      icon: 'phone-portrait-outline',
      label: 'Haptic Feedback',
      value: hapticsEnabled,
      onToggle: handleToggleHaptics,
    },
    {
      icon: 'mic-outline',
      label: 'Voice Narration',
      value: narrationEnabled,
      onToggle: handleToggleNarration,
    },
    {
      icon: 'notifications-outline',
      label: 'Daily Reminder',
      value: dailyReminderEnabled,
      onToggle: handleToggleReminder,
    },
    {
      icon: 'analytics-outline',
      label: 'Usage Analytics',
      value: analyticsEnabled,
      onToggle: setAnalyticsEnabled,
    },
  ];

  const delay = (i: number) => Math.min(80 + i * 60, 400);

  return (
    <SafeAreaView
      style={[styles.safe, { backgroundColor: colors.background }]}
      edges={['left', 'right']}
    >
      {/* ── Gradient Header (no orbs) ── */}
      <Animated.View entering={FadeIn.duration(400)}>
        <LinearGradient
          colors={gradients.settingsHero}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{
            paddingHorizontal: spacing.lg,
            paddingTop: spacing.xl + 54,
            paddingBottom: spacing.xxl + 12,
          }}
        >
          <Text style={[typography.largeTitle, { color: '#FFFFFF' }]}>Settings</Text>
          <Text
            style={[typography.body, { color: 'rgba(255,255,255,0.75)', marginTop: spacing.xxs }]}
          >
            Preferences & child profiles
          </Text>
        </LinearGradient>
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

      <ScrollView
        contentContainerStyle={{ paddingHorizontal: spacing.md, paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Child Profiles ── */}
        <Animated.View entering={FadeInDown.delay(delay(0)).duration(400)}>
          <Text style={[typography.title3, { color: colors.text, marginTop: spacing.lg }]}>
            Profiles
          </Text>

          {children.length > 0 && (
            <>
              <View style={[styles.profileRow, { marginTop: spacing.sm, gap: spacing.sm }]}>
                {children.map((child) => {
                  const isActive = child.id === activeChildId;
                  return (
                    <Pressable
                      key={child.id}
                      onPress={() => setActiveChild(child.id)}
                      onLongPress={() => handleRemoveChild(child.id, child.name)}
                      style={[
                        styles.profileItem,
                        {
                          backgroundColor: isActive
                            ? brand.primary + '12'
                            : isDark
                              ? colors.surfaceSecondary
                              : colors.surface,
                          borderRadius: radius.lg,
                          padding: spacing.md,
                          borderWidth: isActive ? 2 : StyleSheet.hairlineWidth,
                          borderColor: isActive ? brand.primary : colors.border,
                          ...(isActive ? shadows.card : {}),
                        },
                      ]}
                    >
                      {isActive && (
                        <View
                          style={[
                            styles.profileAccentStrip,
                            { borderTopLeftRadius: radius.lg, borderTopRightRadius: radius.lg },
                          ]}
                        >
                          <LinearGradient
                            colors={gradients.primary}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                            style={StyleSheet.absoluteFill}
                          />
                        </View>
                      )}
                      <Avatar avatarId={child.avatarId} size={40} />
                      <Text
                        style={[
                          typography.labelSmall,
                          {
                            color: isActive ? brand.primary : colors.textSecondary,
                            marginTop: spacing.xxs,
                            fontWeight: isActive ? '600' : '400',
                          },
                        ]}
                        numberOfLines={1}
                      >
                        {child.name}
                      </Text>
                      {isActive && (
                        <View style={[styles.activeDot, { backgroundColor: brand.primary }]} />
                      )}
                    </Pressable>
                  );
                })}
              </View>
              <Text
                style={[
                  typography.caption,
                  { color: colors.textTertiary, marginTop: spacing.xs, marginLeft: 2 },
                ]}
              >
                Hold a profile to remove it.
              </Text>
            </>
          )}
        </Animated.View>

        {/* ── Preferences ── */}
        <Animated.View
          entering={FadeInDown.delay(delay(1)).duration(400)}
          style={{ marginTop: spacing.xxl }}
        >
          <View style={styles.sectionHeader}>
            <Ionicons name="options-outline" size={17} color={brand.primary} />
            <Text style={[typography.title3, { color: colors.text, marginLeft: spacing.xs }]}>
              Preferences
            </Text>
          </View>
          <Card variant="glass" noPadding style={{ marginTop: spacing.sm }}>
            {preferenceToggles.map((item, i) => (
              <View
                key={item.label}
                style={[
                  styles.settingRow,
                  {
                    paddingVertical: spacing.sm + 2,
                    paddingHorizontal: spacing.md,
                    borderBottomWidth:
                      i < preferenceToggles.length - 1 ? StyleSheet.hairlineWidth : 0,
                    borderBottomColor: colors.separator,
                  },
                ]}
              >
                <View
                  style={[
                    styles.iconWrap,
                    { backgroundColor: brand.primary + '12', borderRadius: radius.sm },
                  ]}
                >
                  <Ionicons name={item.icon} size={16} color={brand.primary} />
                </View>
                <Text
                  style={[typography.body, { color: colors.text, flex: 1, marginLeft: spacing.sm }]}
                >
                  {item.label}
                </Text>
                <Switch
                  value={item.value}
                  onValueChange={item.onToggle}
                  trackColor={{ false: colors.surfaceTertiary, true: brand.primary + '60' }}
                  thumbColor={item.value ? brand.primary : colors.textTertiary}
                />
              </View>
            ))}

            {/* Reminder time sub-row — only when reminder is on */}
            {dailyReminderEnabled && (
              <Pressable
                onPress={handleReminderTime}
                style={({ pressed }) => [
                  styles.settingRow,
                  {
                    paddingVertical: spacing.sm + 2,
                    paddingHorizontal: spacing.md,
                    paddingLeft: spacing.md + 36,
                    backgroundColor: pressed ? colors.surfaceTertiary : brand.accent + '06',
                  },
                ]}
              >
                <View
                  style={[
                    styles.iconWrap,
                    { backgroundColor: brand.accent + '12', borderRadius: radius.sm },
                  ]}
                >
                  <Ionicons name="time-outline" size={16} color={brand.accent} />
                </View>
                <Text
                  style={[
                    typography.bodySmall,
                    { color: colors.textSecondary, flex: 1, marginLeft: spacing.sm },
                  ]}
                >
                  Reminder Time
                </Text>
                <Text
                  style={[typography.bodySmall, { color: brand.accent, marginRight: spacing.xxs }]}
                >
                  {formatReminderHour(reminderHour)}
                </Text>
                <Ionicons name="chevron-forward" size={15} color={colors.textTertiary} />
              </Pressable>
            )}
          </Card>
        </Animated.View>

        {/* ── Appearance ── */}
        <Animated.View
          entering={FadeInDown.delay(delay(2)).duration(400)}
          style={{ marginTop: spacing.xxl }}
        >
          <View style={styles.sectionHeader}>
            <Ionicons name="color-palette-outline" size={17} color={brand.secondary} />
            <Text style={[typography.title3, { color: colors.text, marginLeft: spacing.xs }]}>
              Appearance
            </Text>
          </View>
          <Text style={[typography.caption, { color: colors.textTertiary, marginTop: 2 }]}>
            Choose how Sidrat looks on your device
          </Text>
          <View style={[styles.themeRow, { marginTop: spacing.md, gap: spacing.sm }]}>
            {THEME_OPTIONS.map(({ value, icon, label, previewBg, previewBar1, previewBar2 }) => {
              const isSelected = themePreference === value;
              return (
                <Pressable
                  key={value}
                  onPress={() => {
                    setThemePreference(value);
                    // Push preference to the native layer so system
                    // components (Switch, Alert, keyboard) match too.
                    Appearance.setColorScheme(value === 'system' ? null : value);
                  }}
                  style={[
                    styles.themeCard,
                    {
                      backgroundColor: isSelected
                        ? brand.primary + '0E'
                        : isDark
                          ? colors.surfaceSecondary
                          : colors.surface,
                      borderRadius: radius.lg,
                      borderWidth: isSelected ? 2 : StyleSheet.hairlineWidth,
                      borderColor: isSelected ? brand.primary : colors.border,
                      ...(isSelected ? shadows.card : {}),
                    },
                  ]}
                >
                  {/* Mini screen preview */}
                  <View
                    style={[
                      styles.themePreview,
                      {
                        backgroundColor: previewBg,
                        borderRadius: radius.sm,
                        borderWidth: StyleSheet.hairlineWidth,
                        borderColor: colors.separator,
                      },
                    ]}
                  >
                    {/* Simulated status bar */}
                    <View
                      style={{
                        height: 5,
                        backgroundColor: previewBar1,
                        borderRadius: 2,
                        marginBottom: 3,
                      }}
                    />
                    {/* Simulated content rows */}
                    <View
                      style={{
                        height: 4,
                        backgroundColor: previewBar1,
                        borderRadius: 2,
                        width: '70%',
                        marginBottom: 2,
                      }}
                    />
                    <View
                      style={{
                        height: 4,
                        backgroundColor: previewBar2,
                        borderRadius: 2,
                        width: '90%',
                        marginBottom: 2,
                      }}
                    />
                    <View
                      style={{
                        height: 4,
                        backgroundColor: previewBar2,
                        borderRadius: 2,
                        width: '55%',
                      }}
                    />
                  </View>

                  {/* Label row */}
                  <View style={styles.themeCardLabel}>
                    <Ionicons
                      name={icon}
                      size={14}
                      color={isSelected ? brand.primary : colors.textSecondary}
                    />
                    <Text
                      style={[
                        typography.captionBold,
                        {
                          color: isSelected ? brand.primary : colors.textSecondary,
                          marginLeft: 4,
                          fontSize: 12,
                        },
                      ]}
                    >
                      {label}
                    </Text>
                  </View>

                  {/* Selected checkmark */}
                  {isSelected && (
                    <View
                      style={[
                        styles.themeCheck,
                        { backgroundColor: brand.primary, borderRadius: radius.full },
                      ]}
                    >
                      <Ionicons name="checkmark" size={10} color="#FFF" />
                    </View>
                  )}
                </Pressable>
              );
            })}
          </View>
        </Animated.View>

        {/* ── Parent Zone ── */}
        <Animated.View
          entering={FadeInDown.delay(delay(3)).duration(400)}
          style={{ marginTop: spacing.xxl }}
        >
          <View style={styles.sectionHeader}>
            <Ionicons name="shield-outline" size={17} color={brand.accent} />
            <Text style={[typography.title3, { color: colors.text, marginLeft: spacing.xs }]}>
              Parent Zone
            </Text>
          </View>
          <Text
            style={[
              typography.caption,
              { color: colors.textTertiary, marginTop: 2, marginBottom: spacing.sm },
            ]}
          >
            Protected by parental gate
          </Text>
          <Card variant="glass" noPadding>
            <Pressable
              onPress={() => requireGate(() => router.push('/onboarding/child-profile'))}
              style={({ pressed }) => [
                styles.settingRow,
                {
                  paddingVertical: spacing.sm + 2,
                  paddingHorizontal: spacing.md,
                  backgroundColor: pressed ? colors.surfaceTertiary : 'transparent',
                  borderBottomWidth: StyleSheet.hairlineWidth,
                  borderBottomColor: colors.separator,
                },
              ]}
            >
              <View
                style={[
                  styles.iconWrap,
                  { backgroundColor: brand.accent + '12', borderRadius: radius.sm },
                ]}
              >
                <Ionicons name="person-add-outline" size={16} color={brand.accent} />
              </View>
              <Text
                style={[typography.body, { color: colors.text, flex: 1, marginLeft: spacing.sm }]}
              >
                Add Child Profile
              </Text>
              <Ionicons name="chevron-forward" size={16} color={colors.textTertiary} />
            </Pressable>
            <Pressable
              onPress={() => requireGate(handleDeleteAccount)}
              style={({ pressed }) => [
                styles.settingRow,
                {
                  paddingVertical: spacing.sm + 2,
                  paddingHorizontal: spacing.md,
                  backgroundColor: pressed ? colors.surfaceTertiary : 'transparent',
                },
              ]}
            >
              <View
                style={[
                  styles.iconWrap,
                  { backgroundColor: colors.error + '12', borderRadius: radius.sm },
                ]}
              >
                <Ionicons name="trash-outline" size={16} color={colors.error} />
              </View>
              <Text
                style={[typography.body, { color: colors.error, flex: 1, marginLeft: spacing.sm }]}
              >
                Delete Account & Data
              </Text>
              <Ionicons name="chevron-forward" size={16} color={colors.error + '60'} />
            </Pressable>
          </Card>
        </Animated.View>

        {/* ── About ── */}
        <Animated.View
          entering={FadeInDown.delay(delay(4)).duration(400)}
          style={{ marginTop: spacing.xxl }}
        >
          <View style={styles.sectionHeader}>
            <Ionicons name="information-circle-outline" size={17} color={brand.lavender} />
            <Text style={[typography.title3, { color: colors.text, marginLeft: spacing.xs }]}>
              About
            </Text>
          </View>
          <Card variant="glass" noPadding style={{ marginTop: spacing.sm }}>
            {[
              {
                icon: 'information-circle-outline' as const,
                label: 'About Sidrat',
                color: brand.lavender,
                action: () =>
                  Alert.alert(
                    'Sidrat',
                    'Islamic learning for the whole family.\n\nVersion 1.0.0\n\nBuilt with love, Bismillah.',
                  ),
              },
              {
                icon: 'shield-checkmark-outline' as const,
                label: 'Privacy Policy',
                color: brand.primary,
                action: () => Linking.openURL('https://sidratapp.com/privacy'),
              },
              {
                icon: 'document-text-outline' as const,
                label: 'Terms of Service',
                color: brand.primary,
                action: () => Linking.openURL('https://sidratapp.com/terms'),
              },
            ].map((item, i, arr) => (
              <Pressable
                key={item.label}
                onPress={item.action}
                style={({ pressed }) => [
                  styles.settingRow,
                  {
                    paddingVertical: spacing.sm + 2,
                    paddingHorizontal: spacing.md,
                    backgroundColor: pressed ? colors.surfaceTertiary : 'transparent',
                    borderBottomWidth: i < arr.length - 1 ? StyleSheet.hairlineWidth : 0,
                    borderBottomColor: colors.separator,
                  },
                ]}
              >
                <View
                  style={[
                    styles.iconWrap,
                    { backgroundColor: item.color + '12', borderRadius: radius.sm },
                  ]}
                >
                  <Ionicons name={item.icon} size={16} color={item.color} />
                </View>
                <Text
                  style={[typography.body, { color: colors.text, flex: 1, marginLeft: spacing.sm }]}
                >
                  {item.label}
                </Text>
                <Ionicons name="chevron-forward" size={16} color={colors.textTertiary} />
              </Pressable>
            ))}
          </Card>
        </Animated.View>

        {/* ── Sign Out ── */}
        <Animated.View
          entering={FadeInDown.delay(delay(5)).duration(400)}
          style={{ marginTop: spacing.xl }}
        >
          <Pressable
            onPress={handleSignOut}
            style={({ pressed }) => [
              styles.settingRow,
              {
                paddingVertical: spacing.sm + 2,
                paddingHorizontal: spacing.md,
                backgroundColor: pressed ? colors.surfaceTertiary : colors.surface,
                borderRadius: radius.lg,
                borderWidth: StyleSheet.hairlineWidth,
                borderColor: colors.border,
              },
            ]}
          >
            <View
              style={[
                styles.iconWrap,
                { backgroundColor: brand.coral + '12', borderRadius: radius.sm },
              ]}
            >
              <Ionicons name="log-out-outline" size={16} color={brand.coral} />
            </View>
            <Text
              style={[typography.body, { color: brand.coral, flex: 1, marginLeft: spacing.sm }]}
            >
              Sign Out
            </Text>
            <Ionicons name="chevron-forward" size={16} color={brand.coral + '60'} />
          </Pressable>
        </Animated.View>

        {/* ── Version ── */}
        <Animated.View entering={FadeInDown.delay(delay(6)).duration(400)}>
          <Text
            style={[
              typography.caption,
              {
                color: colors.textTertiary,
                textAlign: 'center',
                marginTop: spacing.xl,
                fontFamily: 'Amiri-Regular',
                fontSize: 13,
              },
            ]}
          >
            Sidrat v1.0.0
          </Text>
        </Animated.View>
      </ScrollView>

      {gateVisible && (
        <ParentalGate
          visible={gateVisible}
          onSuccess={handleGateSuccess}
          onCancel={handleGateCancel}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  profileRow: { flexDirection: 'row', flexWrap: 'wrap' },
  profileItem: { alignItems: 'center', minWidth: 80, overflow: 'hidden' },
  profileAccentStrip: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 3,
    overflow: 'hidden',
  },
  activeDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    marginTop: 4,
  },
  sectionHeader: { flexDirection: 'row', alignItems: 'center' },
  settingRow: { flexDirection: 'row', alignItems: 'center' },
  iconWrap: { width: 28, height: 28, alignItems: 'center', justifyContent: 'center' },
  themeRow: { flexDirection: 'row' },
  themeCard: { flex: 1, padding: 10, overflow: 'hidden' },
  themePreview: { height: 56, padding: 8, marginBottom: 8 },
  themeCardLabel: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
  themeCheck: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 18,
    height: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
