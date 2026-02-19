/**
 * Tab layout — 5-tab navigation matching iOS MainTabView.
 * home | learn | family | progress | settings
 *
 * Enhanced with brand-distinctive styling:
 * - Warm surface background with subtle top border
 * - Active tab uses brand primary with subtle glow
 * - Amiri-styled labels inherited from theme
 */

import React, { useMemo } from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../src/theme';

export default function TabLayout() {
    const { brand, colors, typography, isDark } = useTheme();

    const screenOptions = useMemo(
        () => ({
            headerShown: false as const,
            tabBarActiveTintColor: brand.primary,
            tabBarInactiveTintColor: colors.textTertiary,
            tabBarStyle: {
                backgroundColor: isDark ? colors.surface : colors.surface,
                borderTopColor: isDark ? colors.border : brand.primary + '12',
                borderTopWidth: 1,
                paddingBottom: Platform.OS === 'ios' ? 4 : 8,
                paddingTop: 6,
                height: Platform.OS === 'ios' ? 88 : 68,
                ...(isDark ? {} : {
                    shadowColor: brand.primary,
                    shadowOffset: { width: 0, height: -2 },
                    shadowOpacity: 0.06,
                    shadowRadius: 8,
                    elevation: 8,
                }),
            },
            tabBarLabelStyle: {
                ...typography.captionBold,
                marginTop: -2,
            },
            tabBarIconStyle: {
                marginBottom: -2,
            },
        }),
        [brand.primary, colors, typography, isDark],
    );

    const tabIcon = (name: keyof typeof Ionicons.glyphMap, nameFilled: keyof typeof Ionicons.glyphMap) =>
        ({ color, focused }: { color: string; size: number; focused: boolean }) => (
            <View style={focused ? styles.activeIconWrap : undefined}>
                <Ionicons name={focused ? nameFilled : name} size={22} color={color} />
                {focused && <View style={[styles.activeIndicator, { backgroundColor: brand.primary }]} />}
            </View>
        );

    return (
        <Tabs screenOptions={screenOptions}>
            <Tabs.Screen
                name="index"
                options={{
                    title: 'Home',
                    tabBarIcon: tabIcon('home-outline', 'home'),
                }}
            />
            <Tabs.Screen
                name="learn"
                options={{
                    title: 'Learn',
                    tabBarIcon: tabIcon('book-outline', 'book'),
                }}
            />
            <Tabs.Screen
                name="family"
                options={{
                    title: 'Family',
                    tabBarIcon: tabIcon('people-outline', 'people'),
                }}
            />
            <Tabs.Screen
                name="progress"
                options={{
                    title: 'Progress',
                    tabBarIcon: tabIcon('stats-chart-outline', 'stats-chart'),
                }}
            />
            <Tabs.Screen
                name="settings"
                options={{
                    title: 'Settings',
                    tabBarIcon: tabIcon('settings-outline', 'settings'),
                }}
            />
        </Tabs>
    );
}

const styles = StyleSheet.create({
    activeIconWrap: {
        alignItems: 'center',
    },
    activeIndicator: {
        width: 4,
        height: 4,
        borderRadius: 2,
        marginTop: 3,
    },
});
