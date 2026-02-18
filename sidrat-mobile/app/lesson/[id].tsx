/**
 * Lesson Player Screen — The main lesson experience.
 *
 * Receives a lesson ID via route params, loads the curriculum lesson,
 * and renders the 4-phase flow: Hook → Teach → Practice → Reward.
 */

import React, { useCallback } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import Animated, { FadeIn } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../src/theme';
import { useAppStore } from '../../src/stores';
import { useLessonPlayer } from '../../src/hooks/useLessonPlayer';
import { getCurriculumLesson } from '../../src/data/curriculum';
import { HookPhase, TeachPhase, PracticePhase, RewardPhase } from '../../src/components/lesson';
import { categoryMeta } from '../../src/types';

export default function LessonScreen() {
    const { brand, colors, typography } = useTheme();
    const router = useRouter();
    const { id } = useLocalSearchParams<{ id: string }>();
    const activeChildId = useAppStore((s) => s.activeChildId);

    const lesson = id ? getCurriculumLesson(id) : undefined;

    // Guard: no lesson found
    if (!lesson || !activeChildId) {
        return (
            <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
                <View style={styles.errorContainer}>
                    <Ionicons name="alert-circle-outline" size={48} color={colors.textTertiary} />
                    <Text style={[typography.title3, { color: colors.text, marginTop: 16 }]}>
                        Lesson not found
                    </Text>
                    <Pressable onPress={() => router.back()} style={styles.backLink}>
                        <Text style={[typography.callout, { color: brand.primary }]}>Go Back</Text>
                    </Pressable>
                </View>
            </SafeAreaView>
        );
    }

    return <LessonPlayerContent lesson={lesson} childId={activeChildId} />;
}

function LessonPlayerContent({
    lesson,
    childId,
}: {
    lesson: NonNullable<ReturnType<typeof getCurriculumLesson>>;
    childId: string;
}) {
    const { brand, colors, typography, radius } = useTheme();
    const router = useRouter();

    const player = useLessonPlayer({ lesson, childId });

    const handleClose = useCallback(() => {
        player.stopNarration();
        router.back();
    }, [player, router]);

    const handleDone = useCallback(() => {
        player.stopNarration();
        router.back();
    }, [player, router]);

    const categoryInfo = categoryMeta[lesson.category];

    // Phase labels for the progress bar
    const phaseLabels: Record<string, string> = {
        hook: 'Start',
        teach: 'Learn',
        practice: 'Practice',
        reward: 'Done!',
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            {/* Top bar */}
            <Animated.View entering={FadeIn.duration(400)} style={styles.topBar}>
                {/* Close button */}
                <Pressable onPress={handleClose} hitSlop={12} style={styles.closeButton}>
                    <Ionicons name="close" size={24} color={colors.textSecondary} />
                </Pressable>

                {/* Title + category */}
                <View style={styles.titleArea}>
                    <Text style={[typography.captionBold, { color: brand.primary }]} numberOfLines={1}>
                        {categoryInfo?.label ?? lesson.category}
                    </Text>
                    <Text style={[typography.footnote, { color: colors.textTertiary }]} numberOfLines={1}>
                        {lesson.title}
                    </Text>
                </View>

                {/* Phase indicator */}
                <View
                    style={[
                        styles.phaseBadge,
                        { backgroundColor: brand.primary + '12', borderRadius: radius.full },
                    ]}
                >
                    <Text style={[typography.captionBold, { color: brand.primary }]}>
                        {phaseLabels[player.phase] ?? player.phase}
                    </Text>
                </View>
            </Animated.View>

            {/* Phase progress dots */}
            <View style={styles.phaseProgress}>
                {(['hook', 'teach', 'practice', 'reward'] as const).map((phase) => {
                    const phases = ['hook', 'teach', 'practice', 'reward'];
                    const currentIdx = phases.indexOf(player.phase);
                    const thisIdx = phases.indexOf(phase);
                    const isDone = thisIdx < currentIdx;
                    const isCurrent = phase === player.phase;
                    return (
                        <View
                            key={phase}
                            style={[
                                styles.phaseDot,
                                {
                                    backgroundColor: isDone
                                        ? brand.primary
                                        : isCurrent
                                            ? brand.primary + '60'
                                            : colors.surfaceTertiary,
                                    flex: 1,
                                },
                            ]}
                        />
                    );
                })}
            </View>

            {/* Phase content */}
            <View style={styles.content}>
                {player.phase === 'hook' && (
                    <HookPhase
                        hook={lesson.hook}
                        isNarrating={player.state.isNarrating}
                        onNarrate={player.narrate}
                        onContinue={player.startTeaching}
                    />
                )}

                {player.phase === 'teach' && player.currentTeachBlock && (
                    <TeachPhase
                        block={player.currentTeachBlock}
                        index={player.state.teachIndex}
                        total={player.totalTeachBlocks}
                        isNarrating={player.state.isNarrating}
                        onNarrate={player.narrate}
                        onNext={player.nextTeachBlock}
                        isLast={player.isLastTeachBlock}
                    />
                )}

                {player.phase === 'practice' && player.currentPracticeBlock && (
                    <PracticePhase
                        key={player.currentPracticeBlock.id}
                        block={player.currentPracticeBlock}
                        index={player.state.practiceIndex}
                        total={player.totalPracticeBlocks}
                        score={player.state.score}
                        maxScore={player.state.maxScore}
                        onAnswer={player.submitAnswer}
                    />
                )}

                {player.phase === 'reward' && (
                    <RewardPhase
                        reward={lesson.reward}
                        score={player.state.score}
                        maxScore={player.state.maxScore}
                        correctCount={player.state.correctCount}
                        totalQuestions={player.totalPracticeBlocks}
                        xpEarned={lesson.xpReward}
                        onComplete={player.completeLesson}
                        onDone={handleDone}
                    />
                )}
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    errorContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    backLink: { marginTop: 16 },
    topBar: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 8,
        gap: 12,
    },
    closeButton: {
        width: 36,
        height: 36,
        alignItems: 'center',
        justifyContent: 'center',
    },
    titleArea: { flex: 1, gap: 1 },
    phaseBadge: {
        paddingHorizontal: 10,
        paddingVertical: 4,
    },
    phaseProgress: {
        flexDirection: 'row',
        gap: 4,
        paddingHorizontal: 16,
        marginBottom: 4,
    },
    phaseDot: {
        height: 4,
        borderRadius: 2,
    },
    content: { flex: 1 },
});
