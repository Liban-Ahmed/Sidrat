/**
 * AchievementToast
 *
 * Animated overlay shown when an achievement is unlocked.
 * Slides down from top, auto-dismisses after 3 seconds.
 */

import React, { useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withSpring,
    withDelay,
    withTiming,
    runOnJS,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../../theme';
import { useAchievementStore, getAchievementDef } from '../../stores/achievementStore';
import { haptics } from '../../utils/haptics';

const RARITY_COLORS: Record<string, string> = {
    bronze: '#CD7F32',
    silver: '#C0C0C0',
    gold: '#FFD700',
    platinum: '#E5E4E2',
};

export function AchievementToast() {
    const { colors, typography, spacing, radius, shadows } = useTheme();
    const insets = useSafeAreaInsets();
    const pendingToasts = useAchievementStore((s) => s.pendingToasts);
    const dismissToast = useAchievementStore((s) => s.dismissToast);

    const translateY = useSharedValue(-200);
    const opacity = useSharedValue(0);
    const scale = useSharedValue(0.8);

    const currentToastId = pendingToasts[0];
    const achievement = currentToastId ? getAchievementDef(currentToastId) : null;

    const handleDismiss = useCallback(() => {
        if (currentToastId) {
            dismissToast(currentToastId);
        }
    }, [currentToastId, dismissToast]);

    useEffect(() => {
        if (achievement) {
            haptics.success();
            translateY.value = withSpring(0, { damping: 12, stiffness: 100 });
            opacity.value = withTiming(1, { duration: 300 });
            scale.value = withSpring(1, { damping: 10, stiffness: 120 });

            // Auto-dismiss after 3.5 seconds
            translateY.value = withDelay(
                3500,
                withTiming(-200, { duration: 300 }, (finished) => {
                    if (finished) {
                        runOnJS(handleDismiss)();
                    }
                }),
            );
            opacity.value = withDelay(3500, withTiming(0, { duration: 300 }));
        } else {
            translateY.value = -200;
            opacity.value = 0;
            scale.value = 0.8;
        }
    }, [achievement, handleDismiss, translateY, opacity, scale]);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ translateY: translateY.value }, { scale: scale.value }],
        opacity: opacity.value,
    }));

    if (!achievement) return null;

    const rarityColor = RARITY_COLORS[achievement.rarity] ?? RARITY_COLORS.bronze;

    return (
        <Animated.View
            style={[
                styles.container,
                animatedStyle,
                {
                    top: insets.top + 8,
                    marginHorizontal: spacing.md,
                },
            ]}
            pointerEvents="box-none"
        >
            <Pressable
                onPress={handleDismiss}
                style={[
                    styles.toast,
                    {
                        backgroundColor: colors.surfaceSecondary,
                        borderRadius: radius.lg,
                        padding: spacing.md,
                        borderLeftWidth: 4,
                        borderLeftColor: rarityColor,
                        ...shadows.card,
                    },
                ]}
            >
                <Text style={styles.icon}>{achievement.icon}</Text>
                <View style={styles.content}>
                    <Text
                        style={[
                            typography.labelSmall,
                            { color: rarityColor, textTransform: 'uppercase', letterSpacing: 1 },
                        ]}
                    >
                        Achievement Unlocked!
                    </Text>
                    <Text style={[typography.label, { color: colors.text, marginTop: 2 }]}>
                        {achievement.title}
                    </Text>
                    <Text style={[typography.caption, { color: colors.textSecondary, marginTop: 1 }]}>
                        {achievement.description}
                    </Text>
                </View>
            </Pressable>
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        left: 0,
        right: 0,
        zIndex: 9999,
    },
    toast: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    icon: {
        fontSize: 36,
        marginRight: 12,
    },
    content: {
        flex: 1,
    },
});
