/**
 * Child Profile — Name + avatar selection for the child.
 */

import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, ScrollView, Pressable } from 'react-native';
import Animated, { FadeInDown, FadeIn } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button, BismillahHeader } from '../../src/components/ui';
import { useTheme } from '../../src/theme';
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
  const { brand, colors, typography, radius, gradients, shadows } = useTheme();
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
        {/* Hero gradient header */}
        <Animated.View entering={FadeInDown.delay(100).duration(600)} style={styles.heroWrapper}>
          <LinearGradient
            colors={[brand.primaryDark, brand.primary] as [string, string]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.heroGradient}
          >
            <View style={styles.heroOrb1} />
            <View style={styles.heroOrb2} />
            <Text style={[typography.title1, { color: '#FFFFFF' }]}>Who is learning?</Text>
            <BismillahHeader size="sm" color="rgba(255,255,255,0.4)" align="left" />
            <Text style={[typography.body, { color: 'rgba(255,255,255,0.85)', marginTop: 4 }]}>
              Let&apos;s create a profile for your child
            </Text>
          </LinearGradient>
        </Animated.View>

        {/* Name input */}
        <Animated.View entering={FadeInDown.delay(200).duration(600)}>
          <Text style={[typography.calloutBold, { color: colors.text, marginBottom: 8 }]}>
            Child&apos;s Name
          </Text>
          <View style={{ borderRadius: radius.md, ...shadows.cardPremium }}>
            <TextInput
              style={[
                styles.input,
                typography.body,
                {
                  backgroundColor: colors.surfaceSecondary,
                  color: colors.text,
                  borderRadius: radius.md,
                  borderColor: name.length > 0 ? brand.primary : colors.separator,
                  borderWidth: name.length > 0 ? 2 : 1.5,
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
          </View>
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
                  {isSelected ? (
                    <LinearGradient
                      colors={gradients.primary}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                      style={{ borderRadius: radius.lg + 2, padding: 2 }}
                    >
                      <Pressable
                        onPress={() => setSelectedAvatar(avatar.id)}
                        style={[
                          styles.avatarItem,
                          {
                            backgroundColor: brand.primary + '10',
                            borderRadius: radius.lg,
                          },
                        ]}
                      >
                        <Text style={styles.avatarEmoji}>{avatar.emoji}</Text>
                        <Text
                          style={[typography.caption, { color: brand.primary, fontWeight: '600' }]}
                        >
                          {avatar.label}
                        </Text>
                        <View style={[styles.checkBadge, { backgroundColor: brand.primary }]}>
                          <Ionicons name="checkmark" size={12} color="#FFF" />
                        </View>
                      </Pressable>
                    </LinearGradient>
                  ) : (
                    <Pressable
                      onPress={() => setSelectedAvatar(avatar.id)}
                      style={[
                        styles.avatarItem,
                        {
                          backgroundColor: colors.surfaceSecondary,
                          borderRadius: radius.lg,
                          borderWidth: 1,
                          borderColor: colors.separator,
                          ...shadows.cardPremium,
                        },
                      ]}
                    >
                      <Text style={styles.avatarEmoji}>{avatar.emoji}</Text>
                      <Text
                        style={[
                          typography.caption,
                          { color: colors.textSecondary, fontWeight: '400' },
                        ]}
                      >
                        {avatar.label}
                      </Text>
                    </Pressable>
                  )}
                </Animated.View>
              );
            })}
          </View>
        </Animated.View>
      </ScrollView>

      {/* Continue */}
      <View style={[styles.footer, { borderTopColor: colors.separator }]}>
        {canContinue ? (
          <LinearGradient
            colors={gradients.heroCta}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={{ borderRadius: radius.lg, overflow: 'hidden' }}
          >
            <Button
              title="Next"
              onPress={handleContinue}
              style={[
                styles.continueButton,
                { backgroundColor: 'transparent', borderRadius: radius.lg },
              ]}
              textStyle={[typography.headlineBold, { color: '#FFFFFF' }]}
            />
          </LinearGradient>
        ) : (
          <Button
            title="Next"
            onPress={handleContinue}
            disabled
            style={[
              styles.continueButton,
              { backgroundColor: colors.surfaceTertiary, borderRadius: radius.lg },
            ]}
            textStyle={[typography.headlineBold, { color: colors.textTertiary }]}
          />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 0,
    paddingBottom: 120,
  },
  heroWrapper: {
    marginHorizontal: -24,
    marginBottom: 28,
  },
  heroGradient: {
    paddingTop: 40,
    paddingBottom: 24,
    paddingHorizontal: 24,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    overflow: 'hidden',
  },
  heroOrb1: {
    position: 'absolute',
    top: -20,
    right: -40,
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: 'rgba(255,255,255,0.06)',
  },
  heroOrb2: {
    position: 'absolute',
    bottom: -30,
    left: -50,
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255,255,255,0.04)',
  },
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
