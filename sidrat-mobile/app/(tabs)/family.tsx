/**
 * Family Screen
 *
 * Weekly family activities with parent scripts.
 * Matches iOS FamilyView with better card layout.
 */

import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../src/theme';
import { Card, Button } from '../../src/components';

// Placeholder data until connected to store
const sampleActivity = {
    title: 'Practice Wudu Together',
    description:
        'This week, practice making Wudu together with your child. Go through each step slowly and make it fun!',
    duration: 15,
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
};

export default function FamilyScreen() {
    const { brand, colors, typography, spacing, radius } = useTheme();

    return (
        <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]}>
            <ScrollView
                contentContainerStyle={{ paddingHorizontal: spacing.md, paddingBottom: spacing.xxl }}
                showsVerticalScrollIndicator={false}
            >
                <Text
                    style={[
                        typography.largeTitle,
                        { color: colors.text, paddingTop: spacing.sm },
                    ]}
                >
                    Family
                </Text>
                <Text
                    style={[
                        typography.bodySmall,
                        { color: colors.textSecondary, marginTop: spacing.xxs },
                    ]}
                >
                    Weekly activities to do together
                </Text>

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
                                Week 1
                            </Text>
                        </View>
                        <View style={styles.durationBadge}>
                            <Ionicons name="time-outline" size={14} color={colors.textTertiary} />
                            <Text style={[typography.caption, { color: colors.textTertiary, marginLeft: 4 }]}>
                                {sampleActivity.duration} min
                            </Text>
                        </View>
                    </View>

                    <Text style={[typography.title1, { color: colors.text, marginTop: spacing.md }]}>
                        {sampleActivity.title}
                    </Text>
                    <Text
                        style={[
                            typography.body,
                            { color: colors.textSecondary, marginTop: spacing.xs },
                        ]}
                    >
                        {sampleActivity.description}
                    </Text>

                    <Button
                        title="Start Activity"
                        variant="accent"
                        fullWidth
                        style={{ marginTop: spacing.lg }}
                    />
                </Card>

                {/* Parent Tips */}
                <Text
                    style={[
                        typography.title3,
                        { color: colors.text, marginTop: spacing.xl },
                    ]}
                >
                    Parent Tips 💡
                </Text>
                {sampleActivity.tips.map((tip, i) => (
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
                <Text
                    style={[
                        typography.title3,
                        { color: colors.text, marginTop: spacing.xl },
                    ]}
                >
                    Conversation Starters 💬
                </Text>
                {sampleActivity.prompts.map((prompt, i) => (
                    <Card key={i} style={{ marginTop: spacing.sm, backgroundColor: colors.surfaceSecondary }}>
                        <Text style={[typography.body, { color: colors.text }]}>
                            "{prompt}"
                        </Text>
                    </Card>
                ))}
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
});
