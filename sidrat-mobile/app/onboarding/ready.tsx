/**
 * Ready Screen — Onboarding complete! Celebration before entering the app.
 */

import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import Animated, {
    FadeInDown,
    FadeInUp,
    useSharedValue,
    useAnimatedStyle,
    withSequence,
    withTiming,
    withDelay,
    withSpring,
    Easing,
} from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../../src/theme';
import { Button, BismillahHeader } from '../../src/components/ui';
import { useChildStore, useAppStore } from '../../src/stores';

export default function ReadyScreen() {
    const { brand, typography, radius } = useTheme();
    const router = useRouter();
    const activeChildId = useAppStore((s) => s.activeChildId);
    const child = useChildStore((s) => s.children.find((c) => c.id === activeChildId));

    // Star burst animation
    const starScale = useSharedValue(0);
    useEffect(() => {
        starScale.value = withDelay(
            400,
            withSequence(
                withSpring(1.3, { damping: 4, stiffness: 200 }),
                withTiming(1, { duration: 300, easing: Easing.out(Easing.ease) }),
            ),
        );
    }, [starScale]);

    const starStyle = useAnimatedStyle(() => ({
        transform: [{ scale: starScale.value }],
    }));

    const handleStart = () => {
        router.replace('/(tabs)');
    };

    return (
        <LinearGradient
            colors={['#044B54', '#066570', '#0A7E8C']}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            style={styles.container}
        >
            <SafeAreaView style={styles.container}>
                <View style={styles.content}>
                    {/* Decorative orbs */}
                    <View style={styles.orb1} />
                    <View style={styles.orb2} />
                    <View style={styles.orb3} />

                    {/* Celebration icon */}
                    <Animated.View style={[styles.starContainer, starStyle]}>
                        <View style={[styles.starCircle, { backgroundColor: 'rgba(255,255,255,0.15)' }]}>
                            <Ionicons name="star" size={72} color="#FFD700" />
                        </View>
                    </Animated.View>

                    {/* Message */}
                    <Animated.View entering={FadeInDown.delay(600).duration(800)} style={styles.textBlock}>
                        <BismillahHeader size="lg" color="rgba(255,255,255,0.4)" />
                        <Text style={[typography.displayMedium, { color: '#FFFFFF', textAlign: 'center' }]}>
                            Bismillah!
                        </Text>
                        <Text
                            style={[
                                typography.title3,
                                { color: 'rgba(255,255,255,0.85)', textAlign: 'center', marginTop: 12 },
                            ]}
                        >
                            {child?.name ?? 'Your child'}&apos;s learning journey begins now
                        </Text>
                        <Text
                            style={[
                                typography.body,
                                {
                                    color: 'rgba(255,255,255,0.7)',
                                    textAlign: 'center',
                                    marginTop: 16,
                                    lineHeight: 22,
                                    maxWidth: 280,
                                },
                            ]}
                        >
                            Interactive lessons, fun quizzes, and beautiful stories await. Let&apos;s learn together!
                        </Text>
                    </Animated.View>

                    <View style={styles.spacer} />

                    {/* Start button */}
                    <Animated.View entering={FadeInUp.delay(1000).duration(800)} style={styles.buttonArea}>
                        <Button
                            title="Start Learning"
                            onPress={handleStart}
                            style={[
                                styles.startButton,
                                {
                                    backgroundColor: '#FFFFFF',
                                    borderRadius: radius.lg,
                                    shadowColor: '#000',
                                    shadowOffset: { width: 0, height: 8 },
                                    shadowOpacity: 0.15,
                                    shadowRadius: 24,
                                    elevation: 8,
                                },
                            ]}
                            textStyle={[typography.headlineBold, { color: brand.primary }]}
                        />
                    </Animated.View>
                </View>
            </SafeAreaView>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    content: {
        flex: 1,
        paddingHorizontal: 32,
        paddingTop: 80,
        paddingBottom: 40,
        alignItems: 'center',
    },
    orb1: {
        position: 'absolute',
        top: -40,
        right: -60,
        width: 200,
        height: 200,
        borderRadius: 100,
        backgroundColor: 'rgba(255,255,255,0.06)',
    },
    orb2: {
        position: 'absolute',
        bottom: 120,
        left: -80,
        width: 260,
        height: 260,
        borderRadius: 130,
        backgroundColor: 'rgba(255,255,255,0.04)',
    },
    orb3: {
        position: 'absolute',
        top: '45%',
        right: -30,
        width: 140,
        height: 140,
        borderRadius: 70,
        backgroundColor: 'rgba(255,255,255,0.05)',
    },
    starContainer: {
        marginBottom: 32,
    },
    starCircle: {
        width: 140,
        height: 140,
        borderRadius: 70,
        alignItems: 'center',
        justifyContent: 'center',
    },
    textBlock: {
        alignItems: 'center',
    },
    spacer: { flex: 1 },
    buttonArea: { width: '100%' },
    startButton: {
        height: 56,
        alignItems: 'center',
        justifyContent: 'center',
    },
});
