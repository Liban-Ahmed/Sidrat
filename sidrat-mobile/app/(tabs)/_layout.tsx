/**
 * Tab Layout — Oasis Palette (Design Spec §8, §2, §3.4)
 *
 * home | learn | family | progress | settings
 *
 * Spec requirements:
 *  - Active tint:   olive400 (#7EA14B)
 *  - Inactive tint: sand400 (#D4B07A)
 *  - Background:    cream-based blur (light) / earth900-based blur (dark)
 *  - Border top:    sand200 (light) / #534D47 (dark) — warm, never cool gray
 *  - Shadow:        earth900 rgba base, never blue or gray (§6.10)
 *  - Haptic:        selectionAsync() on every tab press (§2 Haptic Map)
 *  - Font:          Nunito-Bold 10pt for labels (§6.7)
 */

import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { Tabs } from 'expo-router';
import React, { useMemo } from 'react';
import { Platform, StyleSheet } from 'react-native';
import { useTheme } from '../../src/theme';
import { tokens } from '../../src/theme/tokens';
import haptic from '../../src/utils/haptics';

// ── Tab bar background ─────────────────────────────────────────
function TabBarBackground({ isDark }: { isDark: boolean }) {
  return (
    <BlurView
      intensity={isDark ? 80 : 70}
      tint={isDark ? 'dark' : 'light'}
      style={StyleSheet.absoluteFill}
    />
  );
}

// ── Tab icon helper ────────────────────────────────────────────
function tabIcon(name: keyof typeof Ionicons.glyphMap, nameFilled: keyof typeof Ionicons.glyphMap) {
  const TabIcon = ({ color, focused }: { color: string; size: number; focused: boolean }) => (
    <Ionicons name={focused ? nameFilled : name} size={22} color={color} />
  );
  TabIcon.displayName = `TabIcon-${name}`;
  return TabIcon;
}

// ── Haptic listener — fires on every tab press (§2) ───────────
const tabListeners = {
  tabPress: () => haptic.selection(),
} as const;

// ════════════════════════════════════════════════════════════════
// Layout
// ════════════════════════════════════════════════════════════════

export default function TabLayout() {
  const { isDark } = useTheme();

  const screenOptions = useMemo(
    () => ({
      headerShown: false as const,

      // ── Active / inactive tints — Oasis olive400 / sand400 ──
      tabBarActiveTintColor: tokens.color.olive400,
      tabBarInactiveTintColor: tokens.color.sand400,

      // ── Frosted glass background ──
      tabBarBackground: () => <TabBarBackground isDark={isDark} />,

      // ── Tab bar container ──
      tabBarStyle: {
        // Warm translucent surface — cream in light, earth900 in dark
        backgroundColor: isDark
          ? 'rgba(28,25,23,0.88)' // earth900 (#1C1917) base
          : 'rgba(255,254,247,0.88)', // cream (#FFFEF7) base
        // Warm top border — sand200 light / warm dark (§6.10)
        borderTopColor: isDark ? '#534D47' : tokens.color.sand200,
        borderTopWidth: 1,
        // Warm shadow — earth900 base, never blue/gray (§6.10)
        shadowColor: tokens.color.earth900,
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: isDark ? 0.2 : 0.07,
        shadowRadius: 12,
        elevation: 8,
        paddingBottom: Platform.OS === 'ios' ? 4 : 8,
        paddingTop: 8,
        height: Platform.OS === 'ios' ? 88 : 68,
        position: 'absolute' as const,
      },

      // ── Label — Nunito-Bold 10pt (§6.7 typography) ──
      tabBarLabelStyle: {
        fontFamily: 'Nunito-Bold',
        fontSize: 10,
        fontWeight: '700' as const,
        letterSpacing: 0.3,
        marginTop: 1,
      },

      tabBarIconStyle: {
        marginBottom: -2,
      },
    }),
    [isDark],
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
        listeners={tabListeners}
      />
      <Tabs.Screen
        name="learn"
        options={{
          title: 'Learn',
          tabBarIcon: tabIcon('book-outline', 'book'),
          tabBarAccessibilityLabel: 'Learn tab — browse lessons',
        }}
        listeners={tabListeners}
      />
      <Tabs.Screen
        name="family"
        options={{
          title: 'Family',
          tabBarIcon: tabIcon('people-outline', 'people'),
          tabBarAccessibilityLabel: 'Family activities tab',
        }}
        listeners={tabListeners}
      />
      <Tabs.Screen
        name="progress"
        options={{
          title: 'Progress',
          tabBarIcon: tabIcon('stats-chart-outline', 'stats-chart'),
          tabBarAccessibilityLabel: 'Progress and achievements tab',
        }}
        listeners={tabListeners}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: tabIcon('settings-outline', 'settings'),
          tabBarAccessibilityLabel: 'Settings tab',
        }}
        listeners={tabListeners}
      />
    </Tabs>
  );
}
