/**
 * Tab layout — 5-tab navigation matching iOS MainTabView.
 * home | learn | family | progress | settings
 *
 * Premium frosted-glass tab bar with:
 * - Warm blur surface with subtle gradient tint
 * - Active tab uses brand primary with pill indicator
 * - Refined shadow and border for depth
 */

import React, { useMemo } from 'react';
import { StyleSheet, Platform } from 'react-native';
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { useTheme } from '../../src/theme';

function TabBarBackground() {
  const { isDark } = useTheme();
  return (
    <BlurView intensity={60} tint={isDark ? 'dark' : 'light'} style={StyleSheet.absoluteFill} />
  );
}

export default function TabLayout() {
  const { brand, colors, typography, isDark } = useTheme();

  const screenOptions = useMemo(
    () => ({
      headerShown: false as const,
      tabBarActiveTintColor: brand.primary,
      tabBarInactiveTintColor: colors.textTertiary,
      tabBarBackground: () => <TabBarBackground />,
      tabBarStyle: {
        backgroundColor: isDark ? 'rgba(15,18,24,0.85)' : 'rgba(255,255,255,0.82)',
        borderTopColor: isDark ? colors.border + '60' : brand.primary + '10',
        borderTopWidth: StyleSheet.hairlineWidth,
        paddingBottom: Platform.OS === 'ios' ? 4 : 8,
        paddingTop: 8,
        height: Platform.OS === 'ios' ? 88 : 68,
        position: 'absolute' as const,
        shadowColor: isDark ? 'transparent' : brand.primary,
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: isDark ? 0 : 0.1,
        shadowRadius: isDark ? 0 : 16,
        elevation: isDark ? 0 : 12,
      },
      tabBarLabelStyle: {
        ...typography.captionBold,
        fontSize: 10,
        fontWeight: '700' as const,
        marginTop: 0,
        letterSpacing: 0.4,
      },
      tabBarIconStyle: {
        marginBottom: -2,
      },
    }),
    [brand.primary, colors, typography, isDark],
  );

  const tabIcon =
    (name: keyof typeof Ionicons.glyphMap, nameFilled: keyof typeof Ionicons.glyphMap) =>
    ({ color, focused }: { color: string; size: number; focused: boolean }) => (
      <Ionicons name={focused ? nameFilled : name} size={22} color={color} />
    );

  return (
    <Tabs screenOptions={screenOptions}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: tabIcon('home-outline', 'home'),
          tabBarAccessibilityLabel: 'Home tab',
        }}
      />
      <Tabs.Screen
        name="learn"
        options={{
          title: 'Learn',
          tabBarIcon: tabIcon('book-outline', 'book'),
          tabBarAccessibilityLabel: 'Learn tab — browse lessons',
        }}
      />
      <Tabs.Screen
        name="family"
        options={{
          title: 'Family',
          tabBarIcon: tabIcon('people-outline', 'people'),
          tabBarAccessibilityLabel: 'Family activities tab',
        }}
      />
      <Tabs.Screen
        name="progress"
        options={{
          title: 'Progress',
          tabBarIcon: tabIcon('stats-chart-outline', 'stats-chart'),
          tabBarAccessibilityLabel: 'Progress and achievements tab',
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: tabIcon('settings-outline', 'settings'),
          tabBarAccessibilityLabel: 'Settings tab',
        }}
      />
    </Tabs>
  );
}
