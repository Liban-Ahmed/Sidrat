/**
 * Onboarding layout — wraps parent-setup and child-profile screens.
 */

import { Stack } from 'expo-router';
import React from 'react';
import { useTheme } from '../../src/theme';

export default function OnboardingLayout() {
  const { colors } = useTheme();

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.background },
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen name="parent-setup" />
      <Stack.Screen name="child-profile" />
      <Stack.Screen name="age-selection" />
      <Stack.Screen name="ready" />
    </Stack>
  );
}
