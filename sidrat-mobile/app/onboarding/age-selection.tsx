/**
 * Age Selection — Child picks their birth year.
 * Determines age group (toddler/early/middle/preteen)
 * which adapts lesson difficulty and content.
 */

import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../src/theme';
import { Button } from '../../src/components/ui';
import { useChildStore, useAppStore } from '../../src/stores';
import { ageToGroup, AGE_GROUP_RANGES } from '../../src/types/curriculum';
import type { AvatarId } from '../../src/types';

export default function AgeSelectionScreen() {
    const { brand, colors, typography, radius } = useTheme();
    const router = useRouter();
    const params = useLocalSearchParams<{ name: string; avatar: string }>();
    const addChild = useChildStore((s) => s.addChild);
    const setActiveChild = useAppStore((s) => s.setActiveChild);
    const completeOnboarding = useAppStore((s) => s.completeOnboarding);

    const currentYear = new Date().getFullYear();

    // Generate birth years for ages 2-14
    const years = useMemo(() => {
        const result: { year: number; age: number }[] = [];
        for (let age = 2; age <= 14; age++) {
            result.push({ year: currentYear - age, age });
        }
        return result;
    }, [currentYear]);

    const [selectedYear, setSelectedYear] = useState<number | null>(null);

    const selectedAge = selectedYear ? currentYear - selectedYear : null;
    const selectedGroup = selectedAge ? ageToGroup(selectedAge) : null;
    const groupMeta = selectedGroup ? AGE_GROUP_RANGES[selectedGroup] : null;

    const handleFinish = () => {
        if (!selectedYear || !params.name) return;

        const child = addChild({
            name: params.name,
            birthYear: selectedYear,
            avatarId: (params.avatar ?? 'lion') as AvatarId,
        });

        setActiveChild(child.id);
        completeOnboarding();

        // Navigate to the ready screen
        router.push('/onboarding/ready');
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                {/* Header */}
                <Animated.View entering={FadeInDown.delay(100).duration(600)} style={styles.header}>
                    <Text style={[typography.title1, { color: colors.text }]}>
                        How old is {params.name}?
                    </Text>
                    <Text style={[typography.body, { color: colors.textSecondary, marginTop: 4 }]}>
                        This helps us pick the right lessons
                    </Text>
                </Animated.View>

                {/* Age grid */}
                <Animated.View entering={FadeInDown.delay(200).duration(600)}>
                    <View style={styles.ageGrid}>
                        {years.map(({ year, age }) => {
                            const isSelected = selectedYear === year;
                            return (
                                <Pressable
                                    key={year}
                                    onPress={() => setSelectedYear(year)}
                                    style={[
                                        styles.ageItem,
                                        {
                                            backgroundColor: isSelected
                                                ? brand.primary
                                                : colors.surfaceSecondary,
                                            borderRadius: radius.md,
                                            borderWidth: isSelected ? 0 : 1,
                                            borderColor: colors.separator,
                                        },
                                    ]}
                                >
                                    <Text
                                        style={[
                                            typography.title2,
                                            {
                                                color: isSelected ? '#FFFFFF' : colors.text,
                                                textAlign: 'center',
                                            },
                                        ]}
                                    >
                                        {age}
                                    </Text>
                                    <Text
                                        style={[
                                            typography.caption,
                                            {
                                                color: isSelected ? 'rgba(255,255,255,0.7)' : colors.textTertiary,
                                                textAlign: 'center',
                                            },
                                        ]}
                                    >
                                        years
                                    </Text>
                                </Pressable>
                            );
                        })}
                    </View>
                </Animated.View>

                {/* Age group indicator */}
                {selectedGroup && groupMeta && (
                    <Animated.View
                        entering={FadeInDown.duration(400)}
                        style={[
                            styles.groupCard,
                            {
                                backgroundColor: brand.primary + '12',
                                borderRadius: radius.lg,
                                borderColor: brand.primary + '30',
                            },
                        ]}
                    >
                        <Ionicons name="sparkles" size={20} color={brand.primary} />
                        <View style={styles.groupText}>
                            <Text style={[typography.calloutBold, { color: brand.primary }]}>
                                {groupMeta.label} — {selectedGroup.charAt(0).toUpperCase() + selectedGroup.slice(1)} Learner
                            </Text>
                            <Text style={[typography.caption, { color: colors.textSecondary }]}>
                                Lessons will be adapted for this age group
                            </Text>
                        </View>
                    </Animated.View>
                )}
            </ScrollView>

            {/* Done button */}
            <View style={[styles.footer, { borderTopColor: colors.separator }]}>
                <Button
                    title="Let's Go!"
                    onPress={handleFinish}
                    disabled={!selectedYear}
                    style={[
                        styles.continueButton,
                        {
                            backgroundColor: selectedYear ? brand.primary : colors.surfaceTertiary,
                            borderRadius: radius.lg,
                        },
                    ]}
                    textStyle={[
                        typography.headlineBold,
                        { color: selectedYear ? '#FFFFFF' : colors.textTertiary },
                    ]}
                />
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    scrollContent: {
        paddingHorizontal: 24,
        paddingTop: 40,
        paddingBottom: 120,
    },
    header: { marginBottom: 28 },
    ageGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10,
        justifyContent: 'center',
    },
    ageItem: {
        width: 72,
        height: 72,
        alignItems: 'center',
        justifyContent: 'center',
    },
    groupCard: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        gap: 12,
        marginTop: 24,
        borderWidth: 1,
    },
    groupText: { flex: 1, gap: 2 },
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
