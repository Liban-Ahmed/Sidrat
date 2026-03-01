/**
 * Settings Screen — Oasis Design Spec §8.6
 *
 * Feel: Clean, functional, trustworthy.
 * Background: sand50 flat (dark: earth900 flat).
 * All interactions use JuicyPressable with haptics.
 * All colors from Oasis token system — no ad-hoc hex values.
 *
 * Structural changes vs previous version:
 *  1. Header matches Family / Progress / Learn pattern
 *     (Nunito-Bold title, earth800, left-aligned, no dark gradient)
 *  2. Active child profile indicator lives in the header (top-left),
 *     removed from the body. Tap avatar to expand inline child switcher.
 */

import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useState, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  Switch,
  Alert,
  StyleSheet,
  Linking,
  Appearance,
} from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Avatar } from '../../src/components';
import { JuicyPressable } from '../../src/components/common/JuicyPressable';
import { ParentalGate } from '../../src/components/common/ParentalGate';
import { useParentalGate } from '../../src/hooks';
import { audioService } from '../../src/services/audioService';
import { authService } from '../../src/services/auth';
import { notificationService } from '../../src/services/notificationService';
import {
  useAppStore,
  useAuthStore,
  useChildStore,
  useSettingsStore,
  useToastStore,
} from '../../src/stores';
import { useTheme } from '../../src/theme';
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

// ── Stagger enter helper — spring-based (§3.1) ────────────────────

function staggerEnter(index: number) {
  return FadeInDown.delay(Math.min(index * 60, 360))
    .springify()
    .damping(SPRINGS.gentle.damping)
    .stiffness(SPRINGS.gentle.stiffness)
    .mass(SPRINGS.gentle.mass);
}

// ════════════════════════════════════════════════════════════════════
// Component
// ════════════════════════════════════════════════════════════════════

export default function SettingsScreen() {
  const { isDark } = useTheme();
  const router = useRouter();

  // Oasis semantic palette (light / dark)
  const sc = isDark ? darkSemanticColors : semanticColors;

  // Screen bg — spec §8.6: sand50 flat (dark: earth900)
  const screenBg = isDark ? tokens.color.earth900 : tokens.color.sand50;

  // ── Store reads ──────────────────────────────────────────────

  const children = useChildStore((s) => s.children);
  const removeChild = useChildStore((s) => s.removeChild);
  const activeChildId = useAppStore((s) => s.activeChildId);
  const setActiveChild = useAppStore((s) => s.setActiveChild);
  const resetApp = useAppStore((s) => s.reset);
  const clearAuth = useAuthStore((s) => s.clearAuth);
  const isAnonymous = useAuthStore((s) => s.isAnonymous);

  // Active child (derived)
  const activeChild = useMemo(
    () => children.find((c) => c.id === activeChildId),
    [children, activeChildId],
  );

  // Child switcher expand state
  const [childSwitcherOpen, setChildSwitcherOpen] = useState(false);

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

  const showToast = useToastStore((s) => s.show);

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
      if (!value) audioService.stop();
    },
    [setSoundEnabled],
  );

  const handleToggleHaptics = useCallback(
    (value: boolean) => setHapticsEnabled(value),
    [setHapticsEnabled],
  );

  const handleToggleNarration = useCallback(
    (value: boolean) => {
      setNarrationEnabled(value);
      if (!value) audioService.stop();
    },
    [setNarrationEnabled],
  );

  const handleToggleReminder = useCallback(
    async (value: boolean) => {
      if (value) {
        const granted = await notificationService.requestPermissions();
        if (granted) {
          await notificationService.scheduleDailyReminder(reminderHour);
          setDailyReminder(true);
        } else {
          showToast('Enable notifications in Settings to receive reminders', 'info');
        }
      } else {
        await notificationService.cancelAll();
        setDailyReminder(false);
      }
    },
    [setDailyReminder, reminderHour, showToast],
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
          showToast(`Reminder set for ${label}`);
        },
      })),
      { text: 'Cancel', style: 'cancel' as const },
    ]);
  }, [reminderHour, setReminderHour, dailyReminderEnabled, showToast]);

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
                showToast(`${name}'s profile removed`);
              },
            },
          ],
        );
      });
    },
    [requireGate, removeChild, activeChildId, children, setActiveChild, showToast],
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
              if (!isAnonymous) {
                try {
                  await authService.deleteAccount();
                } catch (error) {
                  console.warn(
                    '[Settings] Remote account deletion failed (local data will still be cleared):',
                    error,
                  );
                }
              }
              clearAuth();
              resetApp();
              router.replace('/welcome');
            },
          },
        ],
      );
    });
  }, [requireGate, isAnonymous, clearAuth, resetApp, router]);

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

  const handleAvatarPress = useCallback(() => {
    setChildSwitcherOpen((v) => !v);
  }, []);

  const handleSwitchChild = useCallback(
    (childId: string) => {
      setActiveChild(childId);
      setChildSwitcherOpen(false);
    },
    [setActiveChild],
  );

  // ── Theme options — Oasis palette only ──

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
      previewBg: tokens.color.sand50,
      previewBar1: tokens.color.earth800,
      previewBar2: tokens.color.sand200,
    },
    {
      value: 'system',
      icon: 'phone-portrait-outline',
      label: 'Auto',
      previewBg: isDark ? tokens.color.earth900 : tokens.color.sand50,
      previewBar1: isDark ? tokens.color.sand50 : tokens.color.earth800,
      previewBar2: isDark ? tokens.color.earth700 : tokens.color.sand200,
    },
    {
      value: 'dark',
      icon: 'moon-outline',
      label: 'Dark',
      previewBg: tokens.color.earth900,
      previewBar1: tokens.color.sand50,
      previewBar2: tokens.color.earth700,
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

  // ═══════════════════════════════════════════════════════════════
  // Render
  // ═══════════════════════════════════════════════════════════════

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: screenBg }]} edges={['left', 'right']}>
      <ScrollView
        contentContainerStyle={{ paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      >
        {/* ══════ Header (matches Family / Progress / Learn pattern) ══════ */}
        <Animated.View entering={staggerEnter(0)} style={{ zIndex: 100 }}>
          <View style={styles.header}>
            {/* Title row — title/subtitle on left, active child avatar on right */}
            <View style={styles.headerTitleRow}>
              <View style={{ flex: 1 }}>
                {/* Page title — Nunito-Bold 26pt, matches Progress headerPageTitle */}
                <Text style={[styles.headerTitle, { color: sc.textPrimary }]}>Settings</Text>
                <Text style={[styles.headerSubtitle, { color: sc.textMuted }]}>
                  Preferences & child profiles
                </Text>
              </View>

              {/* Active child avatar + overlay dropdown — top-right */}
              {activeChild && (
                <View style={{ position: 'relative' }}>
                  <JuicyPressable
                    onPress={handleAvatarPress}
                    accessibilityLabel={`Active profile: ${activeChild.name}. Tap to switch.`}
                    accessibilityRole="button"
                    style={styles.headerProfileRow}
                  >
                    <LinearGradient
                      colors={[tokens.color.olive100, tokens.color.olive200]}
                      style={styles.headerAvatar}
                    >
                      <Avatar avatarId={activeChild.avatarId} size={28} />
                    </LinearGradient>
                    <Ionicons
                      name={childSwitcherOpen ? 'chevron-up' : 'chevron-down'}
                      size={14}
                      color={tokens.color.olive600}
                      style={{ marginLeft: 4 }}
                    />
                  </JuicyPressable>

                  {/* ── Dropdown overlays content below ── */}
                  {childSwitcherOpen && children.length > 0 && (
                    <Animated.View
                      entering={FadeInDown.springify()
                        .damping(SPRINGS.snappy.damping)
                        .stiffness(SPRINGS.snappy.stiffness)
                        .mass(SPRINGS.snappy.mass)}
                      style={[
                        styles.childSwitcher,
                        {
                          backgroundColor: isDark ? tokens.color.earth800 : tokens.color.white,
                          borderColor: sc.surfaceBorder,
                        },
                      ]}
                    >
                      <Text style={[styles.switcherHint, { color: sc.textMuted }]}>
                        Hold a profile to remove it
                      </Text>
                      {children.map((child) => {
                        const isActive = child.id === activeChildId;
                        return (
                          <JuicyPressable
                            key={child.id}
                            onPress={() => handleSwitchChild(child.id)}
                            onLongPress={() => handleRemoveChild(child.id, child.name)}
                            accessibilityLabel={`${child.name}, ${isActive ? 'active profile' : 'inactive profile'}. Long press to remove.`}
                            accessibilityRole="button"
                            style={[
                              styles.switcherItem,
                              {
                                backgroundColor: isActive
                                  ? isDark
                                    ? tokens.color.olive400 + '18'
                                    : tokens.color.olive50
                                  : sc.surface,
                                borderColor: isActive ? tokens.color.olive400 : sc.surfaceBorder,
                                borderWidth: isActive ? 2 : 1,
                              },
                            ]}
                          >
                            <LinearGradient
                              colors={[tokens.color.olive100, tokens.color.olive200]}
                              style={[
                                styles.switcherAvatar,
                                {
                                  borderWidth: 2,
                                  borderColor: isActive
                                    ? tokens.color.olive400
                                    : tokens.color.sand200,
                                },
                              ]}
                            >
                              <Avatar avatarId={child.avatarId} size={24} />
                            </LinearGradient>
                            <Text
                              style={[
                                styles.switcherName,
                                {
                                  flex: 1,
                                  color: isActive ? sc.textPrimary : sc.textSecondary,
                                  fontWeight: isActive ? '700' : '500',
                                },
                              ]}
                              numberOfLines={1}
                            >
                              {child.name}
                            </Text>
                            {isActive && (
                              <Ionicons
                                name="checkmark-circle"
                                size={18}
                                color={tokens.color.olive400}
                              />
                            )}
                          </JuicyPressable>
                        );
                      })}
                    </Animated.View>
                  )}
                </View>
              )}
            </View>
            <View
              style={[
                styles.headerDivider,
                {
                  backgroundColor: sc.surfaceBorder,
                  marginHorizontal: -SPACING.md,
                },
              ]}
            />
          </View>
        </Animated.View>

        <View style={{ paddingHorizontal: SPACING.md }}>
          {/* ══════ PREFERENCES ══════ */}
          <Animated.View entering={staggerEnter(1)}>
            <Text style={styles.sectionLabel}>PREFERENCES</Text>
            <View style={styles.sectionGroup}>
              {preferenceToggles.map((item, i) => {
                const isLast = i === preferenceToggles.length - 1 && !dailyReminderEnabled;
                return (
                  <JuicyPressable
                    key={item.label}
                    onPress={() => {
                      haptic.selection();
                      item.onToggle(!item.value);
                    }}
                    accessibilityLabel={`${item.label}, currently ${item.value ? 'on' : 'off'}`}
                    accessibilityRole="switch"
                    style={[
                      styles.row,
                      {
                        backgroundColor: sc.surface,
                        borderBottomWidth: isLast ? 0 : 1,
                        borderBottomColor: sc.surfaceBorder,
                      },
                    ]}
                  >
                    <Ionicons
                      name={item.icon}
                      size={20}
                      color={tokens.color.sand400}
                      style={styles.rowIcon}
                    />
                    <Text style={[styles.rowTitle, { color: sc.textPrimary }]}>{item.label}</Text>
                    <View style={{ marginTop: 3 }}>
                      <Switch
                        value={item.value}
                        onValueChange={(v) => {
                          haptic.selection();
                          item.onToggle(v);
                        }}
                        trackColor={{
                          false: isDark ? tokens.color.earth700 : tokens.color.sand200,
                          true: tokens.color.olive400,
                        }}
                        thumbColor={tokens.color.white}
                      />
                    </View>
                  </JuicyPressable>
                );
              })}

              {/* Reminder time sub-row — only when daily reminder is on */}
              {dailyReminderEnabled && (
                <JuicyPressable
                  onPress={handleReminderTime}
                  accessibilityLabel={`Reminder time, currently ${formatReminderHour(reminderHour)}`}
                  accessibilityRole="button"
                  style={[
                    styles.row,
                    {
                      backgroundColor: sc.surface,
                      borderBottomWidth: 0,
                    },
                  ]}
                >
                  <Ionicons
                    name="time-outline"
                    size={20}
                    color={tokens.color.sand400}
                    style={styles.rowIcon}
                  />
                  <Text style={[styles.rowTitle, { color: sc.textPrimary }]}>Reminder Time</Text>
                  <Text style={[styles.rowValue, { color: tokens.color.olive400 }]}>
                    {formatReminderHour(reminderHour)}
                  </Text>
                  <Ionicons name="chevron-forward" size={16} color={tokens.color.sand300} />
                </JuicyPressable>
              )}
            </View>
          </Animated.View>

          {/* ══════ APPEARANCE ══════ */}
          <Animated.View entering={staggerEnter(2)}>
            <Text style={styles.sectionLabel}>APPEARANCE</Text>
            <View style={[styles.themeRow, { gap: SPACING.sm }]}>
              {THEME_OPTIONS.map(({ value, icon, label, previewBg, previewBar1, previewBar2 }) => {
                const isSelected = themePreference === value;
                return (
                  <JuicyPressable
                    key={value}
                    onPress={() => {
                      setThemePreference(value);
                      Appearance.setColorScheme(value === 'system' ? null : value);
                    }}
                    accessibilityLabel={`${label} theme${isSelected ? ', selected' : ''}`}
                    accessibilityRole="button"
                    style={[
                      styles.themeCard,
                      {
                        backgroundColor: isSelected
                          ? isDark
                            ? tokens.color.olive400 + '18'
                            : tokens.color.olive50
                          : sc.surface,
                        borderRadius: RADIUS.lg,
                        borderWidth: isSelected ? 2 : 1,
                        borderColor: isSelected ? tokens.color.olive400 : sc.surfaceBorder,
                        ...(isSelected ? SHADOW.rnSm : {}),
                      },
                    ]}
                  >
                    {/* Mini screen preview */}
                    <View
                      style={[
                        styles.themePreview,
                        {
                          backgroundColor: previewBg,
                          borderRadius: RADIUS.sm,
                          borderWidth: 1,
                          borderColor: sc.surfaceBorder,
                        },
                      ]}
                    >
                      <View
                        style={{
                          height: 5,
                          backgroundColor: previewBar1,
                          borderRadius: 2,
                          marginBottom: 3,
                        }}
                      />
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

                    {/* Label */}
                    <View style={styles.themeCardLabel}>
                      <Ionicons
                        name={icon}
                        size={14}
                        color={isSelected ? tokens.color.olive400 : sc.textMuted}
                      />
                      <Text
                        style={[
                          styles.themeCardLabelText,
                          {
                            color: isSelected ? tokens.color.olive400 : sc.textMuted,
                          },
                        ]}
                      >
                        {label}
                      </Text>
                    </View>

                    {/* Checkmark badge */}
                    {isSelected && (
                      <View style={[styles.themeCheck, { backgroundColor: tokens.color.olive400 }]}>
                        <Ionicons name="checkmark" size={10} color={tokens.color.white} />
                      </View>
                    )}
                  </JuicyPressable>
                );
              })}
            </View>
          </Animated.View>

          {/* ══════ PARENT ZONE ══════ */}
          <Animated.View entering={staggerEnter(3)}>
            <Text style={styles.sectionLabel}>PARENT ZONE</Text>
            <View style={styles.sectionGroup}>
              {/* Add Child Profile */}
              <JuicyPressable
                onPress={() => requireGate(() => router.push('/onboarding/child-profile'))}
                accessibilityLabel="Add child profile"
                accessibilityRole="button"
                style={[
                  styles.row,
                  {
                    backgroundColor: sc.surface,
                    borderBottomWidth: 1,
                    borderBottomColor: sc.surfaceBorder,
                  },
                ]}
              >
                <Ionicons
                  name="person-add-outline"
                  size={20}
                  color={tokens.color.sand400}
                  style={styles.rowIcon}
                />
                <Text style={[styles.rowTitle, { color: sc.textPrimary }]}>Add Child Profile</Text>
                <Ionicons name="chevron-forward" size={16} color={tokens.color.sand300} />
              </JuicyPressable>

              {/* Delete Account — sand400 text, no red per spec §7.1 */}
              <JuicyPressable
                onPress={() => {
                  haptic.error();
                  requireGate(handleDeleteAccount);
                }}
                accessibilityLabel="Delete account and data"
                accessibilityRole="button"
                style={[
                  styles.row,
                  {
                    backgroundColor: sc.surface,
                    borderBottomWidth: 0,
                  },
                ]}
              >
                <Ionicons
                  name="trash-outline"
                  size={20}
                  color={isDark ? tokens.color.rose300 : tokens.color.rose400}
                  style={styles.rowIcon}
                />
                <Text
                  style={[
                    styles.rowTitle,
                    { color: isDark ? tokens.color.rose300 : tokens.color.rose400 },
                  ]}
                >
                  Delete Account & Data
                </Text>
                <Ionicons name="chevron-forward" size={16} color={tokens.color.sand300} />
              </JuicyPressable>
            </View>
          </Animated.View>

          {/* ══════ ABOUT ══════ */}
          <Animated.View entering={staggerEnter(4)}>
            <Text style={styles.sectionLabel}>ABOUT</Text>
            <View style={styles.sectionGroup}>
              {[
                {
                  icon: 'information-circle-outline' as keyof typeof Ionicons.glyphMap,
                  label: 'About Sidrat',
                  action: () =>
                    Alert.alert(
                      'Sidrat',
                      'Islamic learning for the whole family.\n\nVersion 1.0.0\n\nBuilt with love, Bismillah.',
                    ),
                },
                {
                  icon: 'shield-checkmark-outline' as keyof typeof Ionicons.glyphMap,
                  label: 'Privacy Policy',
                  action: () => Linking.openURL('https://sidratapp.com/privacy'),
                },
                {
                  icon: 'document-text-outline' as keyof typeof Ionicons.glyphMap,
                  label: 'Terms of Service',
                  action: () => Linking.openURL('https://sidratapp.com/terms'),
                },
              ].map((item, i, arr) => (
                <JuicyPressable
                  key={item.label}
                  onPress={item.action}
                  accessibilityLabel={item.label}
                  accessibilityRole="button"
                  style={[
                    styles.row,
                    {
                      backgroundColor: sc.surface,
                      borderBottomWidth: i < arr.length - 1 ? 1 : 0,
                      borderBottomColor: sc.surfaceBorder,
                    },
                  ]}
                >
                  <Ionicons
                    name={item.icon}
                    size={20}
                    color={tokens.color.sand400}
                    style={styles.rowIcon}
                  />
                  <Text style={[styles.rowTitle, { color: sc.textPrimary }]}>{item.label}</Text>
                  <Ionicons name="chevron-forward" size={16} color={tokens.color.sand300} />
                </JuicyPressable>
              ))}
            </View>
          </Animated.View>

          {/* ══════ SIGN OUT ══════ */}
          <Animated.View entering={staggerEnter(5)} style={{ marginTop: SPACING.lg }}>
            <JuicyPressable
              onPress={() => {
                haptic.error();
                handleSignOut();
              }}
              accessibilityLabel="Sign out"
              accessibilityRole="button"
              style={[
                styles.signOutRow,
                {
                  backgroundColor: sc.surface,
                  borderColor: sc.surfaceBorder,
                },
              ]}
            >
              <Ionicons
                name="log-out-outline"
                size={20}
                color={isDark ? tokens.color.rose300 : tokens.color.rose400}
                style={styles.rowIcon}
              />
              <Text
                style={[
                  styles.rowTitle,
                  { color: isDark ? tokens.color.rose300 : tokens.color.rose400 },
                ]}
              >
                Sign Out
              </Text>
              <Ionicons name="chevron-forward" size={16} color={tokens.color.sand300} />
            </JuicyPressable>
          </Animated.View>

          {/* ══════ Version ══════ */}
          <Animated.View entering={staggerEnter(6)}>
            <Text style={[styles.versionText, { color: sc.textMuted }]}>Sidrat v1.0.0</Text>
          </Animated.View>
        </View>
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

// ════════════════════════════════════════════════════════════════════
// Styles — all values from Oasis token system
// ════════════════════════════════════════════════════════════════════

const styles = StyleSheet.create({
  safe: { flex: 1 },

  // ── Header (matches Family / Progress / Learn pattern) ──
  header: {
    paddingHorizontal: SPACING.md,
    paddingTop: SPACING.xxl + 54,
    paddingBottom: 0,
  },
  headerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerProfileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: SPACING.sm,
  },
  headerAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: tokens.color.olive400,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  headerTitle: {
    fontFamily: 'Nunito-Bold',
    fontSize: 26,
    fontWeight: '700',
    lineHeight: 32,
  },
  headerSubtitle: {
    fontFamily: 'Nunito-Regular',
    fontSize: 14,
    lineHeight: 20,
    marginTop: 2,
  },
  headerDivider: {
    height: 1,
    marginTop: SPACING.md,
    borderRadius: 1,
  },

  // ── Child Switcher (inline expand below header) ──
  childSwitcher: {
    position: 'absolute',
    top: 48,
    right: 0,
    width: 200,
    gap: SPACING.xs,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    padding: SPACING.xs,
    zIndex: 1000,
    elevation: 10,
    ...SHADOW.rnMd,
  },
  switcherItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.xs,
    paddingHorizontal: SPACING.sm,
    borderRadius: RADIUS.md,
    gap: SPACING.sm,
  },
  switcherAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  switcherName: {
    fontFamily: 'Nunito-Bold',
    fontSize: 14,
  },
  switcherHint: {
    fontFamily: 'Nunito-Regular',
    fontSize: 11,
    marginTop: 2,
    marginLeft: SPACING.xs,
    textAlign: 'left',
  },

  // ── Section Label (§8.6: Nunito bold, 11pt, sand400, UPPERCASE, LS 1.2) ──
  sectionLabel: {
    fontFamily: 'Nunito-Bold',
    fontSize: 11,
    fontWeight: '700',
    color: tokens.color.sand400,
    textTransform: 'uppercase',
    letterSpacing: 1.2,
    marginTop: SPACING.lg,
    marginBottom: SPACING.sm,
  },

  // ── Grouped Section (§8.6: 12pt gap between sections, rounded 12pt corners) ──
  sectionGroup: {
    borderRadius: RADIUS.md,
    overflow: 'hidden',
  },

  // ── Row (min 56pt, 16pt horizontal padding) ──
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 56,
    paddingHorizontal: SPACING.md,
  },
  rowIcon: {
    width: 20,
    textAlign: 'center',
    marginRight: SPACING.sm,
  },
  rowTitle: {
    fontFamily: 'Nunito-Regular',
    fontSize: 16,
    lineHeight: 22,
    flex: 1,
  },
  rowValue: {
    fontFamily: 'Nunito-Regular',
    fontSize: 14,
    marginRight: SPACING.xs,
  },

  // ── Sign Out (standalone rounded row) ──
  signOutRow: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 56,
    paddingHorizontal: SPACING.md,
    borderRadius: RADIUS.md,
    borderWidth: 1,
  },

  // ── Theme Picker ──
  themeRow: { flexDirection: 'row' },
  themeCard: { flex: 1, padding: 10, overflow: 'hidden' },
  themePreview: { height: 56, padding: 8, marginBottom: 8 },
  themeCardLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  themeCardLabelText: {
    fontFamily: 'Nunito-Bold',
    fontSize: 12,
    fontWeight: '700',
    marginLeft: 4,
  },
  themeCheck: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 18,
    height: 18,
    borderRadius: RADIUS.full,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // ── Version ──
  versionText: {
    fontFamily: 'Amiri-Regular',
    fontSize: 13,
    textAlign: 'center',
    marginTop: SPACING.xl,
  },
});
