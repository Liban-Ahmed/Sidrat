/**
 * Child Profile — Name + avatar selection for the child.
 */

import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    ScrollView,
    Pressable,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import Animated, { FadeInDown, FadeIn } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../src/theme';
import { Button, BismillahHeader } from '../../src/components/ui';
import type { AvatarId } from '../../src/types';

const AVATARS: { id: AvatarId; emoji: string; label: string }[] = [
    { id: 'lion', emoji: '🦁', label: 'Lion' },
    { id: 'cat', emoji: '🐱', label: 'Cat' },
    { id: 'butterfly', emoji: '🦋', label: 'Butterfly' },
    { id: 'owl', emoji: '🦉', label: 'Owl' },
    { id: 'rabbit', emoji: '🐰', label: 'Rabbit' },
    { id: 'panda', emoji: '🐼', label: 'Panda' },
    { id: 'fox', emoji: '🦊', label: 'Fox' },
    { id: 'deer', emoji: '🦌', label: 'Deer' },
];

export default function ChildProfileScreen() {
    const { brand, colors, typography, radius } = useTheme();
    const router = useRouter();

    const [name, setName] = useState('');
    const [selectedAvatar, setSelectedAvatar] = useState<AvatarId>('lion');

    const canContinue = name.trim().length >= 1;

    const handleContinue = () => {
        router.push({
            pathname: '/onboarding/age-selection',
            params: { name: name.trim(), avatar: selectedAvatar },
        });
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                {/* Header */}
                <Animated.View entering={FadeInDown.delay(100).duration(600)} style={styles.header}>
                    <Text style={[typography.title1, { color: colors.text }]}>
                        Who is learning?
                    </Text>
                    <BismillahHeader size="sm" color={brand.primary + '30'} align="left" />
                    <Text style={[typography.body, { color: colors.textSecondary, marginTop: 4 }]}>
                        Let&apos;s create a profile for your child
                    </Text>
                </Animated.View>

                {/* Name input */}
                <Animated.View entering={FadeInDown.delay(200).duration(600)}>
                    <Text style={[typography.calloutBold, { color: colors.text, marginBottom: 8 }]}>
                        Child&apos;s Name
                    </Text>
                    <TextInput
                        style={[
                            styles.input,
                            typography.body,
                            {
                                backgroundColor: colors.surfaceSecondary,
                                color: colors.text,
                                borderRadius: radius.md,
                                borderColor: name.length > 0 ? brand.primary : colors.separator,
                            },
                        ]}
                        placeholder="Enter name"
                        placeholderTextColor={colors.textTertiary}
                        value={name}
                        onChangeText={setName}
                        autoCapitalize="words"
                        autoCorrect={false}
                        maxLength={20}
                        returnKeyType="done"
                    />
                </Animated.View>

                {/* Avatar selection */}
                <Animated.View entering={FadeInDown.delay(300).duration(600)} style={styles.avatarSection}>
                    <Text style={[typography.calloutBold, { color: colors.text, marginBottom: 12 }]}>
                        Choose an Avatar
                    </Text>
                    <View style={styles.avatarGrid}>
                        {AVATARS.map((avatar, i) => {
                            const isSelected = selectedAvatar === avatar.id;
                            return (
                                <Animated.View key={avatar.id} entering={FadeIn.delay(400 + i * 60).duration(400)}>
                                    <Pressable
                                        onPress={() => setSelectedAvatar(avatar.id)}
                                        style={[
                                            styles.avatarItem,
                                            {
                                                backgroundColor: isSelected
                                                    ? brand.primary + '15'
                                                    : colors.surfaceSecondary,
                                                borderRadius: radius.lg,
                                                borderWidth: isSelected ? 2 : 1,
                                                borderColor: isSelected ? brand.primary : colors.separator,
                                            },
                                        ]}
                                    >
                                        <Text style={styles.avatarEmoji}>{avatar.emoji}</Text>
                                        <Text
                                            style={[
                                                typography.caption,
                                                {
                                                    color: isSelected ? brand.primary : colors.textSecondary,
                                                    fontWeight: isSelected ? '600' : '400',
                                                },
                                            ]}
                                        >
                                            {avatar.label}
                                        </Text>
                                        {isSelected && (
                                            <View style={[styles.checkBadge, { backgroundColor: brand.primary }]}>
                                                <Ionicons name="checkmark" size={12} color="#FFF" />
                                            </View>
                                        )}
                                    </Pressable>
                                </Animated.View>
                            );
                        })}
                    </View>
                </Animated.View>
            </ScrollView>

            {/* Continue */}
            <View style={[styles.footer, { borderTopColor: colors.separator }]}>
                <Button
                    title="Next"
                    onPress={handleContinue}
                    disabled={!canContinue}
                    style={[
                        styles.continueButton,
                        {
                            backgroundColor: canContinue ? brand.primary : colors.surfaceTertiary,
                            borderRadius: radius.lg,
                        },
                    ]}
                    textStyle={[
                        typography.headlineBold,
                        { color: canContinue ? '#FFFFFF' : colors.textTertiary },
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
    input: {
        height: 52,
        paddingHorizontal: 16,
        borderWidth: 1.5,
        fontSize: 17,
    },
    avatarSection: { marginTop: 28 },
    avatarGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
    },
    avatarItem: {
        width: 80,
        height: 90,
        alignItems: 'center',
        justifyContent: 'center',
        gap: 4,
        position: 'relative',
    },
    avatarEmoji: { fontSize: 36 },
    checkBadge: {
        position: 'absolute',
        top: 4,
        right: 4,
        width: 18,
        height: 18,
        borderRadius: 9,
        alignItems: 'center',
        justifyContent: 'center',
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
