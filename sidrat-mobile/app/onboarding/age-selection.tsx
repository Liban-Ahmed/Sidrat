/**
 * Age Selection — Child picks their birth year.
 * Determines age group (toddler/early/middle/preteen)
 * which adapts lesson difficulty and content.
 */

import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter, useLocalSearchParams } from 'expo-router';
import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button, BismillahHeader } from '../../src/components/ui';
import { useChildStore, useAppStore } from '../../src/stores';
import { useTheme } from '../../src/theme';
import { ageToGroup, AGE_GROUP_RANGES } from '../../src/types/curriculum';
import type { AvatarId } from '../../src/types';

export default function AgeSelectionScreen() {
  const { brand, colors, typography, radius, gradients, shadows } = useTheme();
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
            <Text style={[typography.title1, { color: '#FFFFFF' }]}>How old is {params.name}?</Text>
            <BismillahHeader size="sm" color="rgba(255,255,255,0.4)" align="left" />
            <Text style={[typography.body, { color: 'rgba(255,255,255,0.85)', marginTop: 4 }]}>
              This helps us pick the right lessons
            </Text>
          </LinearGradient>
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
                      backgroundColor: isSelected ? brand.primary : colors.surfaceSecondary,
                      borderRadius: radius.md,
                      borderWidth: isSelected ? 0 : 1,
                      borderColor: colors.separator,
                      overflow: isSelected ? 'hidden' : 'visible',
                      ...(isSelected ? {} : shadows.cardPremium),
                    },
                  ]}
                >
                  {isSelected && (
                    <LinearGradient
                      colors={gradients.primary}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                      style={[StyleSheet.absoluteFillObject, { borderRadius: radius.md }]}
                    />
                  )}
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
                backgroundColor: brand.primary + '10',
                borderRadius: radius.lg,
                borderColor: brand.primary + '30',
                ...shadows.cardPremium,
              },
            ]}
          >
            <LinearGradient
              colors={[brand.primary + '08', brand.primary + '18']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={[StyleSheet.absoluteFillObject, { borderRadius: radius.lg }]}
            />
            <Ionicons name="sparkles" size={20} color={brand.primary} />
            <View style={styles.groupText}>
              <Text style={[typography.calloutBold, { color: brand.primary }]}>
                {groupMeta.label} — {selectedGroup.charAt(0).toUpperCase() + selectedGroup.slice(1)}{' '}
                Learner
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
        {selectedYear ? (
          <LinearGradient
            colors={gradients.heroCta}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={{ borderRadius: radius.lg, overflow: 'hidden' }}
          >
            <Button
              title="Let's Go!"
              onPress={handleFinish}
              style={[
                styles.continueButton,
                { backgroundColor: 'transparent', borderRadius: radius.lg },
              ]}
              textStyle={[typography.headlineBold, { color: '#FFFFFF' }]}
            />
          </LinearGradient>
        ) : (
          <Button
            title="Let's Go!"
            onPress={handleFinish}
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
    position: 'relative',
    overflow: 'hidden',
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
