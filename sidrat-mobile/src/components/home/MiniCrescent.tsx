/**
 * MiniCrescent — Refined crescent moon indicator for the WeekStreak.
 *
 * Islamic motif: a crescent shape created by overlapping two circles.
 * Active crescents are solid white (or accent-tinted for today),
 * inactive ones are a subtle outlined circle.
 *
 * Features:
 *  • Clean crescent rendered via circle + parentBg-coloured cutout
 *  • Today variant uses brand accent color
 *  • Inactive state is a soft outlined circle
 *  • Proportional sizing
 */

import React from 'react';
import { View, StyleSheet } from 'react-native';

interface MiniCrescentProps {
    active: boolean;
    parentBg: string;
    size?: number;
    /** Accent-tinted crescent for today */
    isToday?: boolean;
}

export function MiniCrescent({
    active,
    parentBg,
    size = 14,
    isToday = false,
}: MiniCrescentProps) {
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

    const moonColor = isToday ? '#FFD' : '#FFFFFF';
    const outerSize = size + 2;

    return (
        <View
            style={{
                width: outerSize,
                height: outerSize,
                alignItems: 'center',
                justifyContent: 'center',
            }}
        >
            {/* Main moon circle */}
            <View
                style={{
                    width: size,
                    height: size,
                    borderRadius: size / 2,
                    backgroundColor: moonColor,
                    opacity: isToday ? 1 : 0.9,
                }}
            />

            {/* Cutout circle for crescent shape */}
            <View
                style={{
                    position: 'absolute',
                    width: size * 0.72,
                    height: size * 0.72,
                    borderRadius: (size * 0.72) / 2,
                    backgroundColor: parentBg,
                    top: outerSize / 2 - (size * 0.72) / 2 - size * 0.02,
                    left: outerSize / 2 - (size * 0.72) / 2 + size * 0.26,
                }}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    inactive: {
        borderWidth: 1.5,
        borderColor: 'rgba(255,255,255,0.15)',
        backgroundColor: 'rgba(255,255,255,0.04)',
    },
});
