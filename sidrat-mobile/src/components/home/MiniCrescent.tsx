/**
 * MiniCrescent — small crescent moon rendered from overlapping circles.
 * Islamic motif used in the WeekStreak component.
 */

import React from 'react';
import { View } from 'react-native';

interface MiniCrescentProps {
    active: boolean;
    parentBg: string;
    size?: number;
}

export function MiniCrescent({ active, parentBg, size = 14 }: MiniCrescentProps) {
    if (!active) {
        return (
            <View
                style={{
                    width: size,
                    height: size,
                    borderRadius: size / 2,
                    borderWidth: 1,
                    borderColor: 'rgba(255,255,255,0.12)',
                }}
            />
        );
    }

    return (
        <View style={{ width: size, height: size }}>
            <View
                style={{
                    width: size,
                    height: size,
                    borderRadius: size / 2,
                    backgroundColor: '#FFFFFF',
                }}
            />
            <View
                style={{
                    position: 'absolute',
                    width: size * 0.78,
                    height: size * 0.78,
                    borderRadius: (size * 0.78) / 2,
                    backgroundColor: parentBg,
                    top: size * 0.04,
                    left: size * 0.35,
                }}
            />
        </View>
    );
}
