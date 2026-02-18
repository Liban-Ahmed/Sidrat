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
import { useTheme } from '../../src/theme';
import { Button } from '../../src/components/ui';
import { useChildStore, useAppStore } from '../../src/stores';

export default function ReadyScreen() {
    const { brand, colors, typography, radius } = useTheme();
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
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            <View style={styles.content}>
                {/* Celebration icon */}
                <Animated.View style={[styles.starContainer, starStyle]}>
                    <View style={[styles.starCircle, { backgroundColor: brand.accent + '20' }]}>
                        <Ionicons name="star" size={72} color={brand.accent} />
                    </View>
                </Animated.View>

                {/* Message */}
                <Animated.View entering={FadeInDown.delay(600).duration(800)} style={styles.textBlock}>
                    <Text style={[typography.largeTitle, { color: colors.text, textAlign: 'center' }]}>
                        Bismillah!
                    </Text>
                    <Text
                        style={[
                            typography.title3,
                            { color: colors.textSecondary, textAlign: 'center', marginTop: 12 },
                        ]}
                    >
                        {child?.name ?? 'Your child'}&apos;s learning journey begins now
                    </Text>
                    <Text
                        style={[
                            typography.body,
                            {
                                color: colors.textTertiary,
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
                        style={[styles.startButton, { backgroundColor: brand.primary, borderRadius: radius.lg }]}
                        textStyle={[typography.headlineBold, { color: '#FFFFFF' }]}
                    />
                </Animated.View>
            </View>
        </SafeAreaView>
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
