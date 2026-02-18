/**
 * Root layout — wraps the entire app.
 * Sets up status bar, safe area, error boundary,
 * service initialization, and global providers.
 * Routes to welcome/onboarding or tabs based on state.
 */

import React, { useEffect } from 'react';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useTheme } from '../src/theme';
import { useAppStore, useChildStore } from '../src/stores';
import { ErrorBoundary } from '../src/components/common/ErrorBoundary';
import { syncService } from '../src/services/syncService';

function AppLayout() {
    const { colors, mode } = useTheme();
    const router = useRouter();
    const segments = useSegments();
    const checkStreaks = useChildStore((s) => s.checkStreaks);
    const setReady = useAppStore((s) => s.setReady);
    const isReady = useAppStore((s) => s.isReady);
    const hasCompletedOnboarding = useAppStore((s) => s.hasCompletedOnboarding);

    // Initialize services on first mount
    useEffect(() => {
        checkStreaks();
        syncService.startListening();
        setReady();

        return () => {
            syncService.stopListening();
        };
    }, [checkStreaks, setReady]);

    // Route guard: redirect based on onboarding state
    useEffect(() => {
        if (!isReady) return;

        const inOnboarding = segments[0] === 'onboarding' || segments[0] === 'welcome';

        if (!hasCompletedOnboarding && !inOnboarding) {
            router.replace('/welcome');
        } else if (hasCompletedOnboarding && inOnboarding) {
            router.replace('/(tabs)');
        }
    }, [isReady, hasCompletedOnboarding, segments, router]);

    return (
        <>
            <StatusBar style={mode === 'dark' ? 'light' : 'dark'} />
            <Stack
                screenOptions={{
                    headerShown: false,
                    contentStyle: { backgroundColor: colors.background },
                }}
            >
                <Stack.Screen name="welcome" />
                <Stack.Screen name="onboarding" />
                <Stack.Screen name="(tabs)" />
                <Stack.Screen
                    name="lesson/[id]"
                    options={{ animation: 'slide_from_bottom', gestureEnabled: false }}
                />
            </Stack>
        </>
    );
}

export default function RootLayout() {
    return (
        <ErrorBoundary>
            <AppLayout />
        </ErrorBoundary>
    );
}
