/**
 * MiniCrescent — small crescent moon rendered from overlapping circles.
 *
 * Islamic motif used in the WeekStreak component.
 * Active crescents glow softly in dark mode.
 */

import React from 'react';
import { View, StyleSheet } from 'react-native';

interface MiniCrescentProps {
    active: boolean;
    parentBg: string;
    size?: number;
}

export function MiniCrescent({ active, parentBg, size = 14 }: MiniCrescentProps) {
    if (!active) {
        return (
            <View
                style={[
                    styles.inactive,
                    {
                        width: size,
                        height: size,
                        borderRadius: size / 2,
                    },
                ]}
            />
        );
    }

    return (
        <View style={{ width: size, height: size }}>
            {/* Subtle glow behind active crescent */}
            <View
                style={{
                    position: 'absolute',
                    width: size + 4,
                    height: size + 4,
                    borderRadius: (size + 4) / 2,
                    backgroundColor: 'rgba(255,255,255,0.08)',
                    top: -2,
                    left: -2,
                }}
            />
            {/* Full moon circle */}
            <View
                style={{
                    width: size,
                    height: size,
                    borderRadius: size / 2,
                    backgroundColor: '#FFFFFF',
                }}
            />
            {/* Cutout for crescent shape */}
            <View
                style={{
                    position: 'absolute',
                    width: size * 0.75,
                    height: size * 0.75,
                    borderRadius: (size * 0.75) / 2,
                    backgroundColor: parentBg,
                    top: size * 0.05,
                    left: size * 0.38,
                }}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    inactive: {
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.10)',
        backgroundColor: 'rgba(255,255,255,0.03)',
    },
});
