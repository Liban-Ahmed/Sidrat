/**
 * HookPhase — Engaging introduction that grabs the child's attention.
 * Shows a prompt, narration, and "Let's Learn!" button.
 */

import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
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
import { useTheme } from '../../theme';
import type { HookBlock } from '../../types/curriculum';

interface Props {
    hook: HookBlock;
    isNarrating: boolean;
    onNarrate: (text: string) => void;
    onContinue: () => void;
}

export function HookPhase({ hook, isNarrating, onNarrate, onContinue }: Props) {
    const { brand, colors, typography, radius } = useTheme();

    // Auto-narrate on mount
    useEffect(() => {
        const timer = setTimeout(() => onNarrate(hook.narration), 600);
        return () => clearTimeout(timer);
    }, [hook.narration, onNarrate]);

    // Pulsing speaker icon
    const pulseScale = useSharedValue(1);
    useEffect(() => {
        if (isNarrating) {
            pulseScale.value = withRepeat(
                withSequence(
                    withTiming(1.15, { duration: 500, easing: Easing.inOut(Easing.ease) }),
                    withTiming(1, { duration: 500, easing: Easing.inOut(Easing.ease) }),
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

    return (
        <View style={styles.container}>
            {/* Icon / illustration */}
            <Animated.View entering={FadeInDown.delay(200).duration(800)} style={styles.iconArea}>
                <View style={[styles.iconCircle, { backgroundColor: brand.accent + '20' }]}>
                    <Ionicons name="bulb" size={56} color={brand.accent} />
                </View>
            </Animated.View>

            {/* Prompt text */}
            <Animated.View entering={FadeInDown.delay(400).duration(800)} style={styles.promptArea}>
                <Text style={[typography.title2, { color: colors.text, textAlign: 'center', lineHeight: 30 }]}>
                    {hook.prompt}
                </Text>
            </Animated.View>

            {/* Speaker button */}
            <Animated.View entering={FadeInDown.delay(600).duration(600)} style={styles.speakerArea}>
                <Pressable onPress={() => onNarrate(hook.narration)}>
                    <Animated.View
                        style={[
                            styles.speakerButton,
                            { backgroundColor: isNarrating ? brand.primary : brand.primary + '15' },
                            speakerStyle,
                        ]}
                    >
                        <Ionicons
                            name={isNarrating ? 'volume-high' : 'volume-medium-outline'}
                            size={28}
                            color={isNarrating ? '#FFF' : brand.primary}
                        />
                    </Animated.View>
                </Pressable>
                <Text style={[typography.caption, { color: colors.textTertiary }]}>
                    {isNarrating ? 'Listening...' : 'Tap to listen'}
                </Text>
            </Animated.View>

            {/* Continue button */}
            <Animated.View entering={FadeInUp.delay(800).duration(800)} style={styles.ctaArea}>
                <Pressable
                    onPress={onContinue}
                    style={[styles.ctaButton, { backgroundColor: brand.primary, borderRadius: radius.lg }]}
                >
                    <Text style={[typography.headlineBold, { color: '#FFF' }]}>Let&apos;s Learn!</Text>
                    <Ionicons name="arrow-forward" size={20} color="#FFF" />
                </Pressable>
            </Animated.View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 28,
        paddingTop: 40,
        alignItems: 'center',
        justifyContent: 'center',
    },
    iconArea: { marginBottom: 32 },
    iconCircle: {
        width: 110,
        height: 110,
        borderRadius: 55,
        alignItems: 'center',
        justifyContent: 'center',
    },
    promptArea: {
        marginBottom: 24,
        maxWidth: 320,
    },
    speakerArea: {
        alignItems: 'center',
        gap: 8,
        marginBottom: 40,
    },
    speakerButton: {
        width: 56,
        height: 56,
        borderRadius: 28,
        alignItems: 'center',
        justifyContent: 'center',
    },
    ctaArea: { width: '100%' },
    ctaButton: {
        height: 56,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
    },
});
