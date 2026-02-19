/**
 * Parent Setup — Parental gate + acknowledgment.
 * Ensures the parent is setting up the app (COPPA compliance).
 */

import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../src/theme';
import { Button, BismillahHeader, IslamicDivider } from '../../src/components/ui';
import { ParentalGate } from '../../src/components/common';
import { useAppStore } from '../../src/stores';

export default function ParentSetupScreen() {
    const { brand, colors, typography, radius } = useTheme();
    const router = useRouter();
    const unlockParentalGate = useAppStore((s) => s.unlockParentalGate);

    const [showGate, setShowGate] = useState(true);
    const [gateUnlocked, setGateUnlocked] = useState(false);

    const handleGateSuccess = () => {
        setGateUnlocked(true);
        setShowGate(false);
        unlockParentalGate();
    };

    const handleContinue = () => {
        router.push('/onboarding/child-profile');
    };

    if (showGate && !gateUnlocked) {
        return (
            <ParentalGate
                visible={true}
                onSuccess={handleGateSuccess}
                onCancel={() => router.back()}
            />
        );
    }

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                {/* Header */}
                <Animated.View entering={FadeInDown.delay(100).duration(600)} style={styles.header}>
                    <View style={[styles.iconCircle, { backgroundColor: brand.primary + '15' }]}>
                        <Ionicons name="shield-checkmark" size={40} color={brand.primary} />
                    </View>
                    <BismillahHeader size="sm" color={brand.primary + '50'} />
                    <Text style={[typography.title1, { color: colors.text, textAlign: 'center' }]}>
                        For Parents
                    </Text>
                    <Text
                        style={[
                            typography.body,
                            { color: colors.textSecondary, textAlign: 'center', marginTop: 8 },
                        ]}
                    >
                        Sidrat is a safe, ad-free Islamic learning app designed for children ages 2-14.
                    </Text>
                </Animated.View>

                {/* Safety features */}
                <IslamicDivider spacing={16} />
                <Animated.View entering={FadeInDown.delay(300).duration(600)} style={styles.features}>
                    {[
                        {
                            icon: 'eye-off-outline' as const,
                            title: 'No Ads Ever',
                            desc: 'Your child learns without distractions or inappropriate content.',
                        },
                        {
                            icon: 'lock-closed-outline' as const,
                            title: 'Parental Controls',
                            desc: 'Settings are behind a parental gate so children can explore freely.',
                        },
                        {
                            icon: 'cloud-offline-outline' as const,
                            title: 'Works Offline',
                            desc: 'All lessons are available without internet. No data is shared.',
                        },
                        {
                            icon: 'people-outline' as const,
                            title: 'Multiple Children',
                            desc: 'Add up to 4 child profiles, each with their own progress.',
                        },
                    ].map((feature, i) => (
                        <View
                            key={i}
                            style={[
                                styles.featureCard,
                                {
                                    backgroundColor: colors.surfaceSecondary,
                                    borderRadius: radius.md,
                                },
                            ]}
                        >
                            <Ionicons name={feature.icon} size={24} color={brand.primary} />
                            <View style={styles.featureText}>
                                <Text style={[typography.calloutBold, { color: colors.text }]}>
                                    {feature.title}
                                </Text>
                                <Text style={[typography.caption, { color: colors.textSecondary }]}>
                                    {feature.desc}
                                </Text>
                            </View>
                        </View>
                    ))}
                </Animated.View>
            </ScrollView>

            {/* Continue button */}
            <Animated.View
                entering={FadeInDown.delay(500).duration(600)}
                style={[styles.footer, { borderTopColor: colors.separator }]}
            >
                <Button
                    title="Set Up Child Profile"
                    onPress={handleContinue}
                    style={[styles.continueButton, { backgroundColor: brand.primary, borderRadius: radius.lg }]}
                    textStyle={[typography.headlineBold, { color: '#FFFFFF' }]}
                />
            </Animated.View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollContent: {
        paddingHorizontal: 24,
        paddingTop: 40,
        paddingBottom: 100,
    },
    header: {
        alignItems: 'center',
        marginBottom: 32,
    },
    iconCircle: {
        width: 80,
        height: 80,
        borderRadius: 40,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 16,
    },
    features: {
        gap: 12,
    },
    featureCard: {
        flexDirection: 'row',
        padding: 16,
        gap: 14,
        alignItems: 'flex-start',
    },
    featureText: {
        flex: 1,
        gap: 2,
    },
    footer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        paddingHorizontal: 24,
        paddingBottom: 40,
        paddingTop: 16,
        borderTopWidth: StyleSheet.hairlineWidth,
    },
    continueButton: {
        height: 56,
        alignItems: 'center',
        justifyContent: 'center',
    },
});
