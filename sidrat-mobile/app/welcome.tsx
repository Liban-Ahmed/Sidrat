/**
 * Welcome Screen — First screen new users see.
 * Explains the app's purpose with Islamic aesthetics.
 * Offers "Get Started" (anonymous) and "Sign In" (Apple).
 */

import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import Animated, {
    FadeInDown,
    FadeInUp,
    useSharedValue,
    useAnimatedStyle,
    withRepeat,
    withSequence,
    withTiming,
    Easing,
} from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import * as AppleAuthentication from 'expo-apple-authentication';
import { useTheme } from '../src/theme';
import { Button } from '../src/components/ui';
import { authService } from '../src/services/auth';
import { useAppStore, useAuthStore } from '../src/stores';

const { width } = Dimensions.get('window');

export default function WelcomeScreen() {
    const { brand, typography, spacing, radius } = useTheme();
    const router = useRouter();
    const setAuthenticated = useAuthStore((s) => s.setAuthenticated);
    const hasCompletedOnboarding = useAppStore((s) => s.hasCompletedOnboarding);

    // If already onboarded, skip to tabs
    useEffect(() => {
        if (hasCompletedOnboarding) {
            router.replace('/(tabs)');
        }
    }, [hasCompletedOnboarding, router]);

    // Floating animation for the crescent
    const floatY = useSharedValue(0);
    useEffect(() => {
        floatY.value = withRepeat(
            withSequence(
                withTiming(-12, { duration: 2000, easing: Easing.inOut(Easing.ease) }),
                withTiming(0, { duration: 2000, easing: Easing.inOut(Easing.ease) }),
            ),
            -1,
            true,
        );
    }, [floatY]);

    const floatStyle = useAnimatedStyle(() => ({
        transform: [{ translateY: floatY.value }],
    }));

    const handleGetStarted = async () => {
        try {
            // Sign in anonymously — no account needed
            const result = await authService.signInAnonymously();
            if (result.user) {
                setAuthenticated(result.user.id, true);
            }
        } catch {
            // Offline mode — proceed without auth
        }
        router.push('/onboarding/parent-setup');
    };

    const handleSignIn = async () => {
        try {
            const credential = await AppleAuthentication.signInAsync({
                requestedScopes: [
                    AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
                ],
            });
            if (credential.identityToken) {
                const result = await authService.signInWithApple(credential.identityToken);
                if (result.user) {
                    setAuthenticated(result.user.id, false);
                }
            }
        } catch {
            // Apple Sign-In failed or cancelled
        }
        router.push('/onboarding/parent-setup');
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: brand.primary }]}>
            <View style={styles.content}>
                {/* App Icon / Crescent */}
                <Animated.View
                    entering={FadeInDown.delay(200).duration(800)}
                    style={[styles.iconContainer, floatStyle]}
                >
                    <View style={[styles.iconCircle, { backgroundColor: 'rgba(255,255,255,0.15)' }]}>
                        <Ionicons name="moon" size={64} color="#FFD700" />
                    </View>
                </Animated.View>

                {/* Title */}
                <Animated.View entering={FadeInDown.delay(400).duration(800)}>
                    <Text style={[styles.title, typography.largeTitle, { color: '#FFFFFF' }]}>Sidrat</Text>
                    <Text style={[styles.subtitle, typography.body, { color: 'rgba(255,255,255,0.85)' }]}>
                        Islamic Learning for Young Hearts
                    </Text>
                </Animated.View>

                {/* Feature highlights */}
                <Animated.View entering={FadeInDown.delay(600).duration(800)} style={styles.features}>
                    {[
                        { icon: 'book-outline' as const, text: 'Fun, interactive lessons' },
                        { icon: 'people-outline' as const, text: 'Family activities together' },
                        { icon: 'shield-checkmark-outline' as const, text: 'Safe & ad-free' },
                    ].map((feature, i) => (
                        <View key={i} style={styles.featureRow}>
                            <View style={[styles.featureDot, { backgroundColor: 'rgba(255,255,255,0.2)' }]}>
                                <Ionicons name={feature.icon} size={20} color="#FFD700" />
                            </View>
                            <Text style={[typography.callout, { color: 'rgba(255,255,255,0.9)' }]}>
                                {feature.text}
                            </Text>
                        </View>
                    ))}
                </Animated.View>

                {/* Spacer */}
                <View style={styles.spacer} />

                {/* CTA Buttons */}
                <Animated.View entering={FadeInUp.delay(800).duration(800)} style={styles.buttons}>
                    <Button
                        title="Get Started"
                        onPress={handleGetStarted}
                        style={[
                            styles.primaryButton,
                            {
                                backgroundColor: '#FFFFFF',
                                borderRadius: radius.lg,
                            },
                        ]}
                        textStyle={[typography.headlineBold, { color: brand.primary }]}
                    />

                    {Platform.OS === 'ios' && (
                        <Button
                            title=" Sign in with Apple"
                            onPress={handleSignIn}
                            style={[
                                styles.secondaryButton,
                                {
                                    borderColor: 'rgba(255,255,255,0.4)',
                                    borderRadius: radius.lg,
                                },
                            ]}
                            textStyle={[typography.callout, { color: '#FFFFFF' }]}
                        />
                    )}

                    <Text
                        style={[
                            typography.caption,
                            {
                                color: 'rgba(255,255,255,0.5)',
                                textAlign: 'center',
                                marginTop: spacing.sm,
                            },
                        ]}
                    >
                        No account needed • 100% free to start
                    </Text>
                </Animated.View>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    content: {
        flex: 1,
        paddingHorizontal: 32,
        paddingTop: 60,
        paddingBottom: 24,
        alignItems: 'center',
    },
    iconContainer: {
        marginBottom: 32,
    },
    iconCircle: {
        width: 120,
        height: 120,
        borderRadius: 60,
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: {
        textAlign: 'center',
        marginBottom: 8,
        letterSpacing: 1,
    },
    subtitle: {
        textAlign: 'center',
        maxWidth: width * 0.7,
    },
    features: {
        marginTop: 40,
        gap: 16,
        width: '100%',
        maxWidth: 280,
    },
    featureRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 14,
    },
    featureDot: {
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    spacer: {
        flex: 1,
    },
    buttons: {
        width: '100%',
        gap: 12,
    },
    primaryButton: {
        height: 56,
        alignItems: 'center',
        justifyContent: 'center',
    },
    secondaryButton: {
        height: 50,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1.5,
        backgroundColor: 'transparent',
    },
});
