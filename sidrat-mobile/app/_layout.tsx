/**
 * Root layout — wraps the entire app.
 * Sets up status bar, safe area, error boundary,
 * service initialization, and global providers.
 * Routes to welcome/onboarding or tabs based on state.
 *
 * Initializes Sentry (error tracking) and PostHog (analytics).
 * Renders the global AchievementToast overlay.
 */

import React, { useEffect, useRef } from 'react';
import { AppState as RNAppState } from 'react-native';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as Sentry from '@sentry/react-native';
import * as SplashScreen from 'expo-splash-screen';
import { useTheme } from '../src/theme';
import { useAppStore, useAuthStore, useChildStore } from '../src/stores';
import { ErrorBoundary } from '../src/components/common/ErrorBoundary';
import { AchievementToast } from '../src/components/common/AchievementToast';
import { Toast } from '../src/components/ui/Toast';
import { authService } from '../src/services/auth';
import { syncService } from '../src/services/syncService';
import { closeDatabase } from '../src/services/localDatabase';
import { analyticsService } from '../src/services/analyticsService';
import { useAppFonts } from '../src/hooks/useAppFonts';
import { SENTRY_DSN, IS_DEV, ANALYTICS_EVENTS } from '../src/constants/config';

// Keep splash screen visible while fonts load
SplashScreen.preventAutoHideAsync();

// ── Sentry initialization (runs once at module load) ──

Sentry.init({
    dsn: SENTRY_DSN,
    debug: IS_DEV,
    enabled: !!SENTRY_DSN,
    tracesSampleRate: IS_DEV ? 1.0 : 0.2,
    // Don't send PII — COPPA compliance
    sendDefaultPii: false,
});

function AppLayout() {
    const { colors, mode } = useTheme();
    const router = useRouter();
    const segments = useSegments();
    const checkStreaks = useChildStore((s) => s.checkStreaks);
    const setReady = useAppStore((s) => s.setReady);
    const isReady = useAppStore((s) => s.isReady);
    const hasCompletedOnboarding = useAppStore((s) => s.hasCompletedOnboarding);
    const setAuthenticated = useAuthStore((s) => s.setAuthenticated);
    const clearAuth = useAuthStore((s) => s.clearAuth);
    const { fontsLoaded, fontError } = useAppFonts();

    // Initialize services and rehydrate auth on first mount
    useEffect(() => {
        checkStreaks();
        syncService.startListening();
        analyticsService.init();
        analyticsService.track(ANALYTICS_EVENTS.APP_OPENED);

        // Rehydrate session — validates cached JWT, auto-refreshes if expired
        authService.rehydrate().then((state) => {
            if (state.isAuthenticated && state.user) {
                setAuthenticated(state.user.id, state.isAnonymous);
            } else {
                clearAuth();
            }
            setReady();
        }).catch(() => {
            setReady();
        });

        // Listen for auth state changes (token refresh, sign-out, etc.)
        const { data: { subscription } } = authService.onAuthStateChange((state) => {
            if (state.isAuthenticated && state.user) {
                setAuthenticated(state.user.id, state.isAnonymous);
            } else {
                clearAuth();
            }
        });

        // Close database on app background for clean WAL checkpointing
        const appStateSubscription = RNAppState.addEventListener('change', (nextState) => {
            if (nextState === 'background') {
                closeDatabase().catch(console.error);
                analyticsService.flush();
            }
        });

        return () => {
            subscription.unsubscribe();
            appStateSubscription.remove();
            syncService.stopListening();
            analyticsService.flush();
        };
    }, [checkStreaks, setReady, setAuthenticated, clearAuth]);

    // Hide splash screen once fonts are loaded
    useEffect(() => {
        if (fontsLoaded || fontError) {
            SplashScreen.hideAsync();
        }
    }, [fontsLoaded, fontError]);

    // Route guard: redirect based on onboarding state
    // Only react to isReady and hasCompletedOnboarding changes.
    // segments and router are read from the closure but not deps —
    // avoids infinite loops from useSegments() returning a new array each render.
    const hasRedirected = useRef(false);
    useEffect(() => {
        if (!isReady) return;

        const inOnboarding = segments[0] === 'onboarding' || segments[0] === 'welcome';

        if (!hasCompletedOnboarding && !inOnboarding) {
            if (!hasRedirected.current) {
                hasRedirected.current = true;
                router.replace('/welcome');
            }
        } else if (hasCompletedOnboarding && inOnboarding) {
            hasRedirected.current = false;
            router.replace('/(tabs)');
        } else {
            hasRedirected.current = false;
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isReady, hasCompletedOnboarding]);

    // Don't render until fonts are loaded
    if (!fontsLoaded && !fontError) {
        return null;
    }

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
                <Stack.Screen
                    name="review"
                    options={{ animation: 'slide_from_right' }}
                />
            </Stack>
            <AchievementToast />
            <Toast />
        </>
    );
}

function RootLayout() {
    return (
        <ErrorBoundary>
            <AppLayout />
        </ErrorBoundary>
    );
}

export default Sentry.wrap(RootLayout);
