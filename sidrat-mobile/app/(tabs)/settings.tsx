/**
 * Settings Screen
 *
 * Parent controls, profile management, parental gate.
 * All toggles wired to settingsStore.
 */

import React, { useState, useCallback } from 'react';
import { View, Text, ScrollView, Pressable, Switch, Alert, StyleSheet, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useTheme } from '../../src/theme';
import { useAppStore, useChildStore, useSettingsStore } from '../../src/stores';
import { Avatar } from '../../src/components';
import { notificationService } from '../../src/services/notificationService';
import { useParentalGate } from '../../src/hooks';
import { ParentalGate } from '../../src/components/common/ParentalGate';

export default function SettingsScreen() {
    const { brand, colors, typography, spacing, radius } = useTheme();
    const router = useRouter();

    const children = useChildStore((s) => s.children);
    const removeChild = useChildStore((s) => s.removeChild);
    const activeChildId = useAppStore((s) => s.activeChildId);
    const setActiveChild = useAppStore((s) => s.setActiveChild);

    // Settings store
    const soundEnabled = useSettingsStore((s) => s.soundEnabled);
    const setSoundEnabled = useSettingsStore((s) => s.setSoundEnabled);
    const hapticsEnabled = useSettingsStore((s) => s.hapticsEnabled);
    const setHapticsEnabled = useSettingsStore((s) => s.setHapticsEnabled);
    const narrationEnabled = useSettingsStore((s) => s.narrationEnabled);
    const setNarrationEnabled = useSettingsStore((s) => s.setNarrationEnabled);
    const dailyReminderEnabled = useSettingsStore((s) => s.dailyReminderEnabled);
    const setDailyReminder = useSettingsStore((s) => s.setDailyReminder);
    const themePreference = useSettingsStore((s) => s.themePreference);
    const setThemePreference = useSettingsStore((s) => s.setThemePreference);

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
        (value: boolean) => setSoundEnabled(value),
        [setSoundEnabled],
    );

    const handleToggleHaptics = useCallback(
        (value: boolean) => setHapticsEnabled(value),
        [setHapticsEnabled],
    );

    const handleToggleNarration = useCallback(
        (value: boolean) => setNarrationEnabled(value),
        [setNarrationEnabled],
    );

    const handleToggleReminder = useCallback(
        async (value: boolean) => {
            if (value) {
                const granted = await notificationService.requestPermissions();
                if (granted) {
                    await notificationService.scheduleDailyReminder();
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
        [setDailyReminder],
    );

    const handleThemeChange = useCallback(() => {
        const next =
            themePreference === 'system'
                ? 'light'
                : themePreference === 'light'
                    ? 'dark'
                    : 'system';
        setThemePreference(next);
    }, [themePreference, setThemePreference]);

    const themeLabel =
        themePreference === 'system'
            ? 'System'
            : themePreference === 'light'
                ? 'Light'
                : 'Dark';

    const handleAddChild = useCallback(() => {
        requireGate(() => {
            router.push('/onboarding/child-profile');
        });
    }, [requireGate, router]);

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

    // ── Toggle Items ──

    interface ToggleItem {
        icon: keyof typeof Ionicons.glyphMap;
        label: string;
        value: boolean;
        onToggle: (v: boolean) => void;
    }

    interface ActionItem {
        icon: keyof typeof Ionicons.glyphMap;
        label: string;
        action: () => void;
        detail?: string;
    }

    const preferenceToggles: ToggleItem[] = [
        { icon: 'volume-medium-outline', label: 'Sound Effects', value: soundEnabled, onToggle: handleToggleSound },
        { icon: 'phone-portrait-outline', label: 'Haptic Feedback', value: hapticsEnabled, onToggle: handleToggleHaptics },
        { icon: 'mic-outline', label: 'Voice Narration', value: narrationEnabled, onToggle: handleToggleNarration },
        { icon: 'notifications-outline', label: 'Daily Reminder', value: dailyReminderEnabled, onToggle: handleToggleReminder },
    ];

    const parentActions: ActionItem[] = [
        { icon: 'person-add-outline', label: 'Add Child Profile', action: handleAddChild },
        { icon: 'color-palette-outline', label: 'Theme', action: handleThemeChange, detail: themeLabel },
    ];

    const aboutActions: ActionItem[] = [
        {
            icon: 'information-circle-outline',
            label: 'About Sidrat',
            action: () =>
                Alert.alert(
                    'Sidrat',
                    'Islamic learning for the whole family.\n\nVersion 1.0.0\n\nBuilt with love, Bismillah.',
                ),
        },
        {
            icon: 'shield-checkmark-outline',
            label: 'Privacy Policy',
            action: () => Linking.openURL('https://sidrat.app/privacy'),
        },
        {
            icon: 'document-text-outline',
            label: 'Terms of Service',
            action: () => Linking.openURL('https://sidrat.app/terms'),
        },
    ];

    return (
        <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]}>
            <ScrollView
                contentContainerStyle={{ paddingHorizontal: spacing.md, paddingBottom: spacing.xxl }}
                showsVerticalScrollIndicator={false}
            >
                <Text
                    style={[
                        typography.largeTitle,
                        { color: colors.text, paddingTop: spacing.sm },
                    ]}
                >
                    Settings
                </Text>

                {/* Active Profile Selector */}
                {children.length > 0 && (
                    <View style={[styles.profileRow, { marginTop: spacing.lg, gap: spacing.sm }]}>
                        {children.map((child) => (
                            <Pressable
                                key={child.id}
                                onPress={() => setActiveChild(child.id)}
                                onLongPress={() => handleRemoveChild(child.id, child.name)}
                                style={[
                                    styles.profileItem,
                                    {
                                        backgroundColor:
                                            child.id === activeChildId
                                                ? brand.primary + '15'
                                                : colors.surfaceSecondary,
                                        borderRadius: radius.lg,
                                        padding: spacing.md,
                                        borderWidth: child.id === activeChildId ? 2 : 0,
                                        borderColor: brand.primary,
                                    },
                                ]}
                            >
                                <Avatar avatarId={child.avatarId} size={40} />
                                <Text
                                    style={[
                                        typography.labelSmall,
                                        {
                                            color:
                                                child.id === activeChildId
                                                    ? brand.primary
                                                    : colors.textSecondary,
                                            marginTop: spacing.xxs,
                                        },
                                    ]}
                                >
                                    {child.name}
                                </Text>
                            </Pressable>
                        ))}
                    </View>
                )}

                {/* Preferences — Toggles */}
                <SectionTitle title="Preferences" typography={typography} colors={colors} spacing={spacing} />
                <View
                    style={{
                        backgroundColor: colors.surfaceSecondary,
                        borderRadius: radius.lg,
                        overflow: 'hidden',
                    }}
                >
                    {preferenceToggles.map((item, i) => (
                        <View
                            key={item.label}
                            style={[
                                styles.settingRow,
                                {
                                    paddingVertical: spacing.md,
                                    paddingHorizontal: spacing.md,
                                    borderBottomWidth: i < preferenceToggles.length - 1 ? 0.5 : 0,
                                    borderBottomColor: colors.separator,
                                },
                            ]}
                        >
                            <Ionicons name={item.icon} size={20} color={brand.primary} />
                            <Text
                                style={[
                                    typography.body,
                                    { color: colors.text, flex: 1, marginLeft: spacing.sm },
                                ]}
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
                </View>

                {/* Parent Zone — Actions */}
                <SectionTitle title="Parent Zone" typography={typography} colors={colors} spacing={spacing} />
                <View
                    style={{
                        backgroundColor: colors.surfaceSecondary,
                        borderRadius: radius.lg,
                        overflow: 'hidden',
                    }}
                >
                    {parentActions.map((item, i) => (
                        <Pressable
                            key={item.label}
                            onPress={item.action}
                            style={({ pressed }) => [
                                styles.settingRow,
                                {
                                    paddingVertical: spacing.md,
                                    paddingHorizontal: spacing.md,
                                    backgroundColor: pressed ? colors.surfaceTertiary : 'transparent',
                                    borderBottomWidth: i < parentActions.length - 1 ? 0.5 : 0,
                                    borderBottomColor: colors.separator,
                                },
                            ]}
                        >
                            <Ionicons name={item.icon} size={20} color={brand.primary} />
                            <Text
                                style={[
                                    typography.body,
                                    { color: colors.text, flex: 1, marginLeft: spacing.sm },
                                ]}
                            >
                                {item.label}
                            </Text>
                            {item.detail && (
                                <Text
                                    style={[
                                        typography.bodySmall,
                                        { color: colors.textTertiary, marginRight: spacing.xxs },
                                    ]}
                                >
                                    {item.detail}
                                </Text>
                            )}
                            <Ionicons name="chevron-forward" size={18} color={colors.textTertiary} />
                        </Pressable>
                    ))}
                </View>

                {/* About */}
                <SectionTitle title="About" typography={typography} colors={colors} spacing={spacing} />
                <View
                    style={{
                        backgroundColor: colors.surfaceSecondary,
                        borderRadius: radius.lg,
                        overflow: 'hidden',
                    }}
                >
                    {aboutActions.map((item, i) => (
                        <Pressable
                            key={item.label}
                            onPress={item.action}
                            style={({ pressed }) => [
                                styles.settingRow,
                                {
                                    paddingVertical: spacing.md,
                                    paddingHorizontal: spacing.md,
                                    backgroundColor: pressed ? colors.surfaceTertiary : 'transparent',
                                    borderBottomWidth: i < aboutActions.length - 1 ? 0.5 : 0,
                                    borderBottomColor: colors.separator,
                                },
                            ]}
                        >
                            <Ionicons name={item.icon} size={20} color={brand.primary} />
                            <Text
                                style={[
                                    typography.body,
                                    { color: colors.text, flex: 1, marginLeft: spacing.sm },
                                ]}
                            >
                                {item.label}
                            </Text>
                            <Ionicons name="chevron-forward" size={18} color={colors.textTertiary} />
                        </Pressable>
                    ))}
                </View>

                {/* Version */}
                <Text
                    style={[
                        typography.caption,
                        {
                            color: colors.textTertiary,
                            textAlign: 'center',
                            marginTop: spacing.xl,
                        },
                    ]}
                >
                    Sidrat v1.0.0
                </Text>
            </ScrollView>

            {gateVisible && <ParentalGate visible={gateVisible} onSuccess={handleGateSuccess} onCancel={handleGateCancel} />}
        </SafeAreaView>
    );
}

function SectionTitle({
    title,
    typography,
    colors,
    spacing,
}: {
    title: string;
    typography: ReturnType<typeof useTheme>['typography'];
    colors: ReturnType<typeof useTheme>['colors'];
    spacing: ReturnType<typeof useTheme>['spacing'];
}) {
    return (
        <Text
            style={[
                typography.labelSmall,
                {
                    color: colors.textTertiary,
                    textTransform: 'uppercase',
                    letterSpacing: 1,
                    marginTop: spacing.xl,
                    marginBottom: spacing.xs,
                },
            ]}
        >
            {title}
        </Text>
    );
}

const styles = StyleSheet.create({
    safe: { flex: 1 },
    profileRow: { flexDirection: 'row', flexWrap: 'wrap' },
    profileItem: { alignItems: 'center', minWidth: 80 },
    settingRow: { flexDirection: 'row', alignItems: 'center' },
});
