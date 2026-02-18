/**
 * Settings Screen
 *
 * Parent controls, profile management, parental gate.
 * Matches iOS SettingsView.
 */

import React from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../src/theme';
import { useAppStore, useChildStore } from '../../src/stores';
import { Avatar } from '../../src/components';

export default function SettingsScreen() {
    const { brand, colors, typography, spacing, radius } = useTheme();
    const children = useChildStore((s) => s.children);
    const activeChildId = useAppStore((s) => s.activeChildId);
    const setActiveChild = useAppStore((s) => s.setActiveChild);

    const sections = [
        {
            title: 'Profiles',
            items: [
                { icon: 'person-add-outline' as const, label: 'Add Child Profile', action: () => { } },
                { icon: 'swap-horizontal-outline' as const, label: 'Switch Profile', action: () => { } },
            ],
        },
        {
            title: 'Preferences',
            items: [
                { icon: 'volume-medium-outline' as const, label: 'Sound Effects', action: () => { } },
                { icon: 'musical-notes-outline' as const, label: 'Background Music', action: () => { } },
                { icon: 'language-outline' as const, label: 'Language', action: () => { } },
            ],
        },
        {
            title: 'Parent Zone',
            items: [
                { icon: 'lock-closed-outline' as const, label: 'Parental Controls', action: () => { } },
                { icon: 'time-outline' as const, label: 'Screen Time Limits', action: () => { } },
                { icon: 'analytics-outline' as const, label: 'Learning Reports', action: () => { } },
            ],
        },
        {
            title: 'About',
            items: [
                { icon: 'information-circle-outline' as const, label: 'About Sidrat', action: () => { } },
                { icon: 'shield-checkmark-outline' as const, label: 'Privacy Policy', action: () => { } },
                { icon: 'document-text-outline' as const, label: 'Terms of Service', action: () => { } },
            ],
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

                {/* Active Profile */}
                {children.length > 0 && (
                    <View style={[styles.profileRow, { marginTop: spacing.lg }]}>
                        {children.map((child) => (
                            <Pressable
                                key={child.id}
                                onPress={() => setActiveChild(child.id)}
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

                {/* Setting Sections */}
                {sections.map((section) => (
                    <View key={section.title} style={{ marginTop: spacing.xl }}>
                        <Text
                            style={[
                                typography.labelSmall,
                                {
                                    color: colors.textTertiary,
                                    textTransform: 'uppercase',
                                    letterSpacing: 1,
                                    marginBottom: spacing.xs,
                                },
                            ]}
                        >
                            {section.title}
                        </Text>
                        <View
                            style={{
                                backgroundColor: colors.surfaceSecondary,
                                borderRadius: radius.lg,
                                overflow: 'hidden',
                            }}
                        >
                            {section.items.map((item, i) => (
                                <Pressable
                                    key={item.label}
                                    onPress={item.action}
                                    style={({ pressed }) => [
                                        styles.settingRow,
                                        {
                                            paddingVertical: spacing.md,
                                            paddingHorizontal: spacing.md,
                                            backgroundColor: pressed ? colors.surfaceTertiary : 'transparent',
                                            borderBottomWidth: i < section.items.length - 1 ? 0.5 : 0,
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
                    </View>
                ))}

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
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safe: { flex: 1 },
    profileRow: { flexDirection: 'row', gap: 12 },
    profileItem: { alignItems: 'center', minWidth: 80 },
    settingRow: { flexDirection: 'row', alignItems: 'center' },
});
