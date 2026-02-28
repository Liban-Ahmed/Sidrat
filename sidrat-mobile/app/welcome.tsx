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
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../src/theme';
import { Button, BismillahHeader } from '../src/components/ui';
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
      // Offline mode — proceed without auth (data stored locally)
    }
    router.push('/onboarding/parent-setup');
  };

  const handleSignIn = async () => {
    try {
      const credential = await AppleAuthentication.signInAsync({
        requestedScopes: [AppleAuthentication.AppleAuthenticationScope.FULL_NAME],
      });
      if (credential.identityToken) {
        const result = await authService.signInWithApple(credential.identityToken);
        if (result.user) {
          setAuthenticated(result.user.id, false);
          router.push('/onboarding/parent-setup');
          return;
        }
      }
    } catch {
      // Apple Sign-In failed or cancelled — don't navigate
      return;
    }
  };

  return (
    <LinearGradient
      colors={[brand.primaryDark, brand.primary, '#055F6E', brand.primaryLight]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      {/* Decorative orbs */}
      <View
        style={{
          position: 'absolute',
          top: -40,
          right: -60,
          width: 200,
          height: 200,
          borderRadius: 100,
          backgroundColor: 'rgba(255,255,255,0.06)',
        }}
      />
      <View
        style={{
          position: 'absolute',
          bottom: 120,
          left: -80,
          width: 260,
          height: 260,
          borderRadius: 130,
          backgroundColor: 'rgba(255,255,255,0.04)',
        }}
      />
      <View
        style={{
          position: 'absolute',
          top: '40%',
          right: -30,
          width: 140,
          height: 140,
          borderRadius: 70,
          backgroundColor: 'rgba(255,255,255,0.05)',
        }}
      />

      <SafeAreaView style={styles.container}>
        <View style={styles.content}>
          {/* App Icon / Crescent */}
          <Animated.View
            entering={FadeInDown.delay(200).duration(800)}
            style={[styles.iconContainer, floatStyle]}
          >
            <View
              style={[
                styles.iconOuterRing,
                { borderWidth: 2, borderColor: 'rgba(255,255,255,0.1)' },
              ]}
            >
              <View style={[styles.iconCircle, { backgroundColor: 'rgba(255,255,255,0.18)' }]}>
                <Ionicons name="moon" size={64} color={brand.accentLight} />
              </View>
            </View>
          </Animated.View>

          {/* Title */}
          <Animated.View entering={FadeInDown.delay(400).duration(800)}>
            <BismillahHeader size="sm" color="rgba(255,255,255,0.5)" />
            <Text style={[styles.title, typography.displayMedium, { color: '#FFFFFF' }]}>
              Sidrat
            </Text>
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
                <View
                  style={[
                    styles.featureDot,
                    {
                      backgroundColor: 'rgba(255,255,255,0.2)',
                      borderWidth: 1,
                      borderColor: 'rgba(255,255,255,0.15)',
                    },
                  ]}
                >
                  <Ionicons name={feature.icon} size={20} color={brand.accentLight} />
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
              accessibilityLabel="Get started with Sidrat — no account needed"
              style={[
                styles.primaryButton,
                {
                  backgroundColor: '#FFFFFF',
                  borderRadius: radius.lg,
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 8 },
                  shadowOpacity: 0.15,
                  shadowRadius: 20,
                  elevation: 8,
                },
              ]}
              textStyle={[typography.headlineBold, { color: brand.primary }]}
            />

            {Platform.OS === 'ios' && (
              <Button
                title=" Sign in with Apple"
                onPress={handleSignIn}
                accessibilityLabel="Sign in with Apple"
                style={[
                  styles.secondaryButton,
                  {
                    borderColor: 'rgba(255,255,255,0.5)',
                    borderRadius: radius.lg,
                    backgroundColor: 'rgba(255,255,255,0.08)',
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
    </LinearGradient>
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
  iconOuterRing: {
    width: 136,
    height: 136,
    borderRadius: 68,
    alignItems: 'center',
    justifyContent: 'center',
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
    width: 44,
    height: 44,
    borderRadius: 22,
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
