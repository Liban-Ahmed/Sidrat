/**
 * Avatar component
 *
 * Displays the child's animal avatar as an emoji (placeholder).
 * Improvement: easy to swap for Rive/Lottie later.
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../../theme';
import type { AvatarId } from '../../types';

const avatarEmojis: Record<AvatarId, string> = {
    cat: '🐱',
    lion: '🦁',
    butterfly: '🦋',
    owl: '🦉',
    rabbit: '🐰',
    panda: '🐼',
    fox: '🦊',
    deer: '🦌',
};

interface AvatarProps {
    avatarId: AvatarId;
    size?: number;
}

export function Avatar({ avatarId, size = 48 }: AvatarProps) {
    const { brand } = useTheme();

    return (
        <View
            style={[
                styles.container,
                {
                    width: size,
                    height: size,
                    borderRadius: size / 2,
                    backgroundColor: brand.primary + '15',
                },
            ]}
        >
            <Text style={{ fontSize: size * 0.55 }}>
                {avatarEmojis[avatarId] ?? '🌙'}
            </Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
    },
});
