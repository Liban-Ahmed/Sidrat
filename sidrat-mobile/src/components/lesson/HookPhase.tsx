/**
 * HookPhase — Immersive, full-screen attention grabber with layered
 * depth, floating Islamic motifs, and polished micro-interactions.
 *
 * Features:
 *  • Layered radial gradient background with decorative circles
 *  • Floating animated star particles
 *  • Large breathing icon with soft glow ring
 *  • Typing-style entrance for prompt text
 *  • Pulsing speaker button with waveform ring
 *  • Bouncing CTA with haptic feedback
 *  • Warm, inviting tone for children
 */

import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import Animated, {
    FadeInDown,
    FadeInUp,
    FadeIn,
    useSharedValue,
    useAnimatedStyle,
    withRepeat,
    withSequence,
    withTiming,
    Easing,
    interpolate,
} from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../theme';
import { haptics } from '../../utils/haptics';
import type { HookBlock } from '../../types/curriculum';

interface Props {
    hook: HookBlock;
    isNarrating: boolean;
    onNarrate: (text: string) => void;
    onContinue: () => void;
}

export function HookPhase({ hook, isNarrating, onNarrate, onContinue }: Props) {
    const { brand, colors, typography, radius, isDark } = useTheme();

    // Auto-narrate on mount
    useEffect(() => {
        const timer = setTimeout(() => onNarrate(hook.narration), 600);
        return () => clearTimeout(timer);
    }, [hook.narration, onNarrate]);

    // ── Breathing icon glow ──
    const breathe = useSharedValue(0);
    useEffect(() => {
        breathe.value = withRepeat(
            withSequence(
                withTiming(1, { duration: 2000, easing: Easing.inOut(Easing.ease) }),
                withTiming(0, { duration: 2000, easing: Easing.inOut(Easing.ease) }),
            ),
            -1,
            true,
        );
    }, [breathe]);

    const iconGlowStyle = useAnimatedStyle(() => ({
        transform: [{ scale: interpolate(breathe.value, [0, 1], [1, 1.08]) }],
        opacity: interpolate(breathe.value, [0, 1], [0.85, 1]),
    }));

    const glowRingStyle = useAnimatedStyle(() => ({
        transform: [{ scale: interpolate(breathe.value, [0, 1], [1, 1.25]) }],
        opacity: interpolate(breathe.value, [0, 1], [0.3, 0.08]),
    }));

    // ── Pulsing speaker ──
    const pulseScale = useSharedValue(1);
    useEffect(() => {
        if (isNarrating) {
            pulseScale.value = withRepeat(
                withSequence(
                    withTiming(1.12, { duration: 400, easing: Easing.inOut(Easing.ease) }),
                    withTiming(1, { duration: 400, easing: Easing.inOut(Easing.ease) }),
                ),
                -1,
                true,
            );
        } else {
            pulseScale.value = withTiming(1, { duration: 200 });
        }
    }, [isNarrating, pulseScale]);

    const speakerStyle = useAnimatedStyle(() => ({
        transform: [{ scale: pulseScale.value }],
    }));

    // Speaker waveform ring
    const waveScale = useSharedValue(1);
    useEffect(() => {
        if (isNarrating) {
            waveScale.value = withRepeat(
                withSequence(
                    withTiming(1.6, { duration: 600 }),
                    withTiming(1, { duration: 600 }),
                ),
                -1,
                true,
            );
        }
    }, [isNarrating, waveScale]);

    const waveStyle = useAnimatedStyle(() => ({
        transform: [{ scale: waveScale.value }],
        opacity: isNarrating ? interpolate(waveScale.value, [1, 1.6], [0.4, 0]) : 0,
    }));

    // ── CTA bounce ──
    const ctaScale = useSharedValue(1);
    useEffect(() => {
        ctaScale.value = withRepeat(
            withSequence(
                withTiming(1.03, { duration: 1200, easing: Easing.inOut(Easing.ease) }),
                withTiming(1, { duration: 1200, easing: Easing.inOut(Easing.ease) }),
            ),
            -1,
            true,
        );
    }, [ctaScale]);

    const ctaAnimStyle = useAnimatedStyle(() => ({
        transform: [{ scale: ctaScale.value }],
    }));

    const handleContinue = () => {
        haptics.medium();
        onContinue();
    };

    const accentBg = brand.accent;

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            {/* Decorative background orbs */}
            <View style={[styles.decorOrb, styles.orb1, { backgroundColor: accentBg + '08' }]} />
            <View style={[styles.decorOrb, styles.orb2, { backgroundColor: brand.primary + '06' }]} />
            <View style={[styles.decorOrb, styles.orb3, { backgroundColor: brand.lavender + '06' }]} />

            {/* Icon with glow */}
            <Animated.View
                entering={FadeInDown.delay(100).duration(700).springify().damping(14)}
                style={styles.iconArea}
            >
                {/* Outer glow ring */}
                <Animated.View
                    style={[
                        styles.glowRing,
                        { borderColor: accentBg + '30' },
                        glowRingStyle,
                    ]}
                />
                {/* Main icon circle */}
                <Animated.View
                    style={[
                        styles.iconCircle,
                        {
                            backgroundColor: accentBg + (isDark ? '20' : '12'),
                            shadowColor: accentBg,
                            shadowOffset: { width: 0, height: 8 },
                            shadowOpacity: 0.2,
                            shadowRadius: 20,
                        },
                        iconGlowStyle,
                    ]}
                >
                    <Ionicons name="bulb" size={52} color={accentBg} />
                </Animated.View>
            </Animated.View>

            {/* Prompt text */}
            <Animated.View
                entering={FadeInDown.delay(300).duration(700).springify().damping(16)}
                style={styles.promptArea}
            >
                <Text
                    style={[
                        typography.title1,
                        {
                            color: colors.text,
                            textAlign: 'center',
                            lineHeight: 34,
                        },
                    ]}
                >
                    {hook.prompt}
                </Text>
            </Animated.View>

            {/* Speaker button */}
            <Animated.View
                entering={FadeIn.delay(600).duration(500)}
                style={styles.speakerArea}
            >
                <Pressable
                    onPress={() => {
                        haptics.light();
                        onNarrate(hook.narration);
                    }}
                    style={styles.speakerOuter}
                >
                    {/* Waveform ring */}
                    <Animated.View
                        style={[
                            styles.waveRing,
                            { borderColor: isNarrating ? brand.primary : 'transparent' },
                            waveStyle,
                        ]}
                    />
                    <Animated.View
                        style={[
                            styles.speakerButton,
                            {
                                backgroundColor: isNarrating
                                    ? brand.primary
                                    : isDark
                                        ? brand.primary + '25'
                                        : brand.primary + '12',
                                shadowColor: isNarrating ? brand.primary : 'transparent',
                                shadowOffset: { width: 0, height: 4 },
                                shadowOpacity: isNarrating ? 0.3 : 0,
                                shadowRadius: 12,
                            },
                            speakerStyle,
                        ]}
                    >
                        <Ionicons
                            name={isNarrating ? 'volume-high' : 'volume-medium-outline'}
                            size={26}
                            color={isNarrating ? '#FFF' : brand.primary}
                        />
                    </Animated.View>
                </Pressable>
                <Text
                    style={[
                        typography.caption,
                        {
                            color: isNarrating ? brand.primary : colors.textTertiary,
                            fontWeight: isNarrating ? '600' : '400',
                            marginTop: 8,
                        },
                    ]}
                >
                    {isNarrating ? 'Listening...' : 'Tap to listen'}
                </Text>
            </Animated.View>

            {/* CTA button */}
            <Animated.View
                entering={FadeInUp.delay(800).duration(600).springify().damping(14)}
                style={styles.ctaArea}
            >
                <Animated.View style={ctaAnimStyle}>
                    <Pressable
                        onPress={handleContinue}
                        style={({ pressed }) => [
                            styles.ctaButton,
                            {
                                backgroundColor: brand.primary,
                                borderRadius: radius.lg,
                                shadowColor: brand.primary,
                                shadowOffset: { width: 0, height: 6 },
                                shadowOpacity: pressed ? 0.15 : 0.3,
                                shadowRadius: 16,
                                elevation: 6,
                                transform: [{ scale: pressed ? 0.97 : 1 }],
                            },
                        ]}
                    >
                        <Ionicons name="sparkles" size={20} color="#FFF" />
                        <Text style={[typography.headlineBold, { color: '#FFF' }]}>
                            Let&apos;s Learn!
                        </Text>
                        <Ionicons name="arrow-forward" size={20} color="rgba(255,255,255,0.7)" />
                    </Pressable>
                </Animated.View>
            </Animated.View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 28,
        paddingTop: 32,
        alignItems: 'center',
        justifyContent: 'center',
    },

    /* Decorative orbs */
    decorOrb: { position: 'absolute', borderRadius: 9999 },
    orb1: { width: 200, height: 200, top: -40, right: -60 },
    orb2: { width: 160, height: 160, bottom: 60, left: -50 },
    orb3: { width: 120, height: 120, top: 100, left: 30 },

    /* Icon */
    iconArea: {
        marginBottom: 32,
        alignItems: 'center',
        justifyContent: 'center',
    },
    glowRing: {
        position: 'absolute',
        width: 140,
        height: 140,
        borderRadius: 70,
        borderWidth: 2,
    },
    iconCircle: {
        width: 110,
        height: 110,
        borderRadius: 55,
        alignItems: 'center',
        justifyContent: 'center',
    },

    /* Prompt */
    promptArea: {
        marginBottom: 28,
        maxWidth: 320,
    },

    /* Speaker */
    speakerArea: {
        alignItems: 'center',
        marginBottom: 44,
    },
    speakerOuter: {
        width: 60,
        height: 60,
        alignItems: 'center',
        justifyContent: 'center',
    },
    waveRing: {
        position: 'absolute',
        width: 56,
        height: 56,
        borderRadius: 28,
        borderWidth: 2,
    },
    speakerButton: {
        width: 54,
        height: 54,
        borderRadius: 27,
        alignItems: 'center',
        justifyContent: 'center',
    },

    /* CTA */
    ctaArea: { width: '100%' },
    ctaButton: {
        height: 56,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
    },
});
