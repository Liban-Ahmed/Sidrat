/**
 * Family Screen
 *
 * Weekly family activities with parent scripts.
 * Data-driven from a rotating activity bank.
 * Tracks completion via the child store.
 */

import React, { useMemo, useCallback, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { MMKV } from 'react-native-mmkv';
import { useTheme } from '../../src/theme';
import { useAppStore } from '../../src/stores';
import { Card, Button, ScreenHeader, IslamicDivider, BismillahHeader } from '../../src/components';
import { analyticsService } from '../../src/services/analyticsService';
import { ANALYTICS_EVENTS } from '../../src/constants/config';

const mmkv = new MMKV({ id: 'sidrat-store' });

// ── Family Activity Bank ──

interface FamilyActivity {
    id: string;
    title: string;
    emoji: string;
    description: string;
    duration: number; // minutes
    category: 'quran' | 'dua' | 'character' | 'worship' | 'knowledge';
    tips: string[];
    prompts: string[];
}

const ACTIVITIES: FamilyActivity[] = [
    {
        id: 'wudu-together',
        title: 'Practice Wudu Together',
        emoji: '💧',
        description:
            'Go through each step of Wudu together slowly and make it fun! Let them lead and gently guide when needed.',
        duration: 15,
        category: 'worship',
        tips: [
            'Make it playful — use a fun timer or sing a simple nasheed',
            "Let them splash a little — it's about learning, not perfection",
            'Praise effort, not just getting it right',
        ],
        prompts: [
            'Why do you think we clean ourselves before talking to Allah?',
            "What's your favorite part of making Wudu?",
            'How do you feel after making Wudu?',
        ],
    },
    {
        id: 'bedtime-dua',
        title: 'Bedtime Dua Together',
        emoji: '🌙',
        description:
            'End the day by reciting bedtime duas together. Teach your child to speak to Allah before sleep.',
        duration: 10,
        category: 'dua',
        tips: [
            'Start with just one dua and add more each week',
            'Make it cozy — dim lights, get comfy',
            "Explain the meaning in simple words they'll understand",
        ],
        prompts: [
            'What was the best thing that happened today?',
            "What would you like to ask Allah for tonight?",
            'Why do we say Bismillah before sleeping?',
        ],
    },
    {
        id: 'quran-listening',
        title: 'Quran Listening Circle',
        emoji: '🎧',
        description:
            'Sit together as a family and listen to a short surah. Talk about what it means and how beautiful it sounds.',
        duration: 15,
        category: 'quran',
        tips: [
            'Start with short surahs like Al-Fatiha or Al-Ikhlas',
            'Play a beautiful recitation — Mishary Al-Afasy is great for kids',
            'Ask them to close their eyes and just listen first',
        ],
        prompts: [
            'How did it make you feel when you heard the Quran?',
            "What words did you recognize?",
            'Why do you think the Quran sounds so beautiful?',
        ],
    },
    {
        id: 'kindness-tracker',
        title: 'Acts of Kindness Challenge',
        emoji: '💚',
        description:
            'Challenge each family member to do 3 kind things today. Share your acts of kindness at dinner!',
        duration: 20,
        category: 'character',
        tips: [
            'Give examples: help a sibling, share a toy, say something nice',
            'Make a simple chart they can draw check marks on',
            'Remind them the Prophet ﷺ said the best people are those most kind',
        ],
        prompts: [
            'What kind thing did you do today?',
            'How did it make the other person feel?',
            'What kind thing would you like to do tomorrow?',
        ],
    },
    {
        id: 'prophet-stories',
        title: 'Prophet Stories Storytime',
        emoji: '📖',
        description:
            'Read or tell a story about one of the Prophets (peace be upon them). Discuss the lessons we can learn.',
        duration: 20,
        category: 'knowledge',
        tips: [
            'Use age-appropriate language and keep it engaging',
            'Ask questions during the story to keep them involved',
            'Connect the story to something in their daily life',
        ],
        prompts: [
            'Which prophet did we learn about? What did they teach?',
            'What would you do if you were in their situation?',
            'How can we be like this prophet in our daily life?',
        ],
    },
    {
        id: 'morning-adhkar',
        title: 'Morning Adhkar Together',
        emoji: '☀️',
        description:
            'Start the day with morning remembrances of Allah. Say them together over breakfast!',
        duration: 10,
        category: 'dua',
        tips: [
            'Pick 3-5 short adhkar to start with',
            'Say them during breakfast so it becomes a routine',
            'Use repetition — kids love saying things together',
        ],
        prompts: [
            'How does it feel to start the day remembering Allah?',
            'What does this dua mean in your own words?',
            'When else during the day can we remember Allah?',
        ],
    },
];

const ACTIVITY_ICONS: Record<string, keyof typeof Ionicons.glyphMap> = {
    'wudu-together': 'water-outline',
    'bedtime-dua': 'moon-outline',
    'quran-listening': 'musical-notes-outline',
    'kindness-tracker': 'heart-outline',
    'prophet-stories': 'book-outline',
    'morning-adhkar': 'sunny-outline',
};

// ── Helpers ──

function getWeekOfYear(): number {
    const now = new Date();
    const start = new Date(now.getFullYear(), 0, 1);
    const diff = now.getTime() - start.getTime();
    return Math.ceil(diff / (7 * 24 * 60 * 60 * 1000));
}

export default function FamilyScreen() {
    const { brand, colors, typography, spacing, radius } = useTheme();

    const activeChildId = useAppStore((s) => s.activeChildId);

    // Rotate activities weekly
    const weekNum = getWeekOfYear();
    const activity = useMemo(() => ACTIVITIES[weekNum % ACTIVITIES.length]!, [weekNum]);

    // Persist completion per-week using MMKV
    const completionKey = `family-completed-${weekNum}-${activeChildId ?? 'default'}`;
    const [completed, setCompleted] = useState(() => mmkv.getBoolean(completionKey) ?? false);

    const handleComplete = useCallback(() => {
        setCompleted(true);
        mmkv.set(completionKey, true);
        analyticsService.track(ANALYTICS_EVENTS.FAMILY_ACTIVITY_COMPLETED, {
            activityId: activity.id,
            childId: activeChildId ?? 'none',
        });
        Alert.alert(
            'Masha\'Allah! 🎉',
            'Great job completing this week\'s family activity together!',
        );
    }, [activity.id, activeChildId]);

    const CATEGORY_COLORS: Record<FamilyActivity['category'], string> = {
        quran: brand.primary,
        dua: brand.secondary,
        character: '#10B981',
        worship: brand.accent,
        knowledge: '#8B5CF6',
    };

    return (
        <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]}>
            <ScrollView
                contentContainerStyle={{ paddingHorizontal: spacing.md, paddingBottom: spacing.xxl }}
                showsVerticalScrollIndicator={false}
            >
                <ScreenHeader
                    title="Family"
                    subtitle="Weekly activities to do together"
                    accentColor={brand.accent}
                />

                {/* This Week's Activity */}
                <Card style={{ marginTop: spacing.lg }}>
                    <View style={styles.activityHeader}>
                        <View
                            style={[
                                styles.weekBadge,
                                { backgroundColor: brand.accent + '20', borderRadius: radius.full },
                            ]}
                        >
                            <Text style={[typography.labelSmall, { color: brand.accent }]}>
                                Week {weekNum}
                            </Text>
                        </View>
                        <View style={styles.durationBadge}>
                            <Ionicons name="time-outline" size={14} color={colors.textTertiary} />
                            <Text style={[typography.caption, { color: colors.textTertiary, marginLeft: 4 }]}>
                                {activity.duration} min
                            </Text>
                        </View>
                    </View>

                    <BismillahHeader size="sm" color={CATEGORY_COLORS[activity.category] + '40'} align="left" />

                    <View
                        style={{
                            width: 56,
                            height: 56,
                            borderRadius: 28,
                            backgroundColor: CATEGORY_COLORS[activity.category] + '15',
                            borderWidth: 1.5,
                            borderColor: CATEGORY_COLORS[activity.category] + '25',
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginTop: spacing.sm,
                        }}
                    >
                        <Ionicons
                            name={ACTIVITY_ICONS[activity.id] ?? 'sparkles-outline'}
                            size={26}
                            color={CATEGORY_COLORS[activity.category]}
                        />
                    </View>
                    <Text style={[typography.title1, { color: colors.text, marginTop: spacing.xs }]}>
                        {activity.title}
                    </Text>
                    <View
                        style={[
                            styles.categoryBadge,
                            {
                                backgroundColor: CATEGORY_COLORS[activity.category] + '15',
                                borderRadius: radius.sm,
                                marginTop: spacing.xs,
                                alignSelf: 'flex-start',
                            },
                        ]}
                    >
                        <Text
                            style={[
                                typography.caption,
                                {
                                    color: CATEGORY_COLORS[activity.category],
                                    textTransform: 'capitalize',
                                    fontWeight: '600',
                                },
                            ]}
                        >
                            {activity.category}
                        </Text>
                    </View>
                    <Text
                        style={[typography.body, { color: colors.textSecondary, marginTop: spacing.sm }]}
                    >
                        {activity.description}
                    </Text>

                    <Button
                        title={completed ? '✓ Completed!' : 'Mark as Done'}
                        variant={completed ? 'secondary' : 'accent'}
                        fullWidth
                        disabled={completed}
                        onPress={handleComplete}
                        style={{ marginTop: spacing.lg }}
                        accessibilityLabel={completed ? 'Activity completed' : 'Mark this family activity as done'}
                        accessibilityRole="button"
                    />
                </Card>

                {/* Parent Tips */}
                <IslamicDivider spacing={12} />
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                    <Ionicons name="leaf" size={18} color={brand.secondary} />
                    <Text style={[typography.title3, { color: colors.text }]}>
                        Parent Tips
                    </Text>
                </View>
                {activity.tips.map((tip, i) => (
                    <View key={i} style={[styles.tipRow, { marginTop: spacing.sm }]}>
                        <Ionicons name="leaf" size={16} color={brand.secondary} />
                        <Text
                            style={[
                                typography.bodySmall,
                                { color: colors.textSecondary, flex: 1, marginLeft: spacing.xs },
                            ]}
                        >
                            {tip}
                        </Text>
                    </View>
                ))}

                {/* Conversation Starters */}
                <IslamicDivider spacing={12} />
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                    <Ionicons name="chatbubble-ellipses-outline" size={18} color={brand.primary} />
                    <Text style={[typography.title3, { color: colors.text }]}>
                        Conversation Starters
                    </Text>
                </View>
                {activity.prompts.map((prompt, i) => (
                    <Card key={i} style={{ marginTop: spacing.sm, backgroundColor: colors.surfaceSecondary }}>
                        <Text style={[typography.body, { color: colors.text }]}>
                            &ldquo;{prompt}&rdquo;
                        </Text>
                    </Card>
                ))}

                {/* Coming Next */}
                <IslamicDivider spacing={12} />
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                    <Ionicons name="calendar-outline" size={18} color={brand.lavender} />
                    <Text style={[typography.title3, { color: colors.text }]}>
                        Coming Next Week
                    </Text>
                </View>
                {(() => {
                    const next = ACTIVITIES[(weekNum + 1) % ACTIVITIES.length]!;
                    return (
                        <Card
                            style={{
                                marginTop: spacing.sm,
                                flexDirection: 'row',
                                alignItems: 'center',
                                backgroundColor: colors.surfaceSecondary,
                            }}
                        >
                            <View
                                style={{
                                    width: 44,
                                    height: 44,
                                    borderRadius: 22,
                                    backgroundColor: CATEGORY_COLORS[next.category] + '15',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}
                            >
                                <Ionicons
                                    name={ACTIVITY_ICONS[next.id] ?? 'sparkles-outline'}
                                    size={20}
                                    color={CATEGORY_COLORS[next.category]}
                                />
                            </View>
                            <View style={{ marginLeft: spacing.sm, flex: 1 }}>
                                <Text style={[typography.label, { color: colors.text }]}>
                                    {next.title}
                                </Text>
                                <Text style={[typography.caption, { color: colors.textSecondary }]}>
                                    {next.duration} min · {next.category}
                                </Text>
                            </View>
                            <Ionicons name="chevron-forward" size={18} color={colors.textTertiary} />
                        </Card>
                    );
                })()}
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safe: { flex: 1 },
    activityHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    weekBadge: { paddingHorizontal: 12, paddingVertical: 4 },
    durationBadge: { flexDirection: 'row', alignItems: 'center' },
    tipRow: { flexDirection: 'row', alignItems: 'flex-start' },
    categoryBadge: { paddingHorizontal: 10, paddingVertical: 3 },
});
