/**
 * AnimatedCounter — rolls up numbers on mount with eased timing.
 */

import React, { useCallback, useEffect, useState } from 'react';
import { Text, type TextStyle, type StyleProp } from 'react-native';
import {
    useSharedValue,
    withTiming,
    useDerivedValue,
    runOnJS,
    Easing,
} from 'react-native-reanimated';

interface AnimatedCounterProps {
    to: number;
    color: string;
    style: StyleProp<TextStyle>;
}

export function AnimatedCounter({ to, color, style }: AnimatedCounterProps) {
    const [display, setDisplay] = useState(0);
    const sv = useSharedValue(0);

    const updateDisplay = useCallback((v: number) => setDisplay(Math.round(v)), []);

    useDerivedValue(() => {
        runOnJS(updateDisplay)(sv.value);
    });

    useEffect(() => {
        sv.value = withTiming(to, { duration: 1200, easing: Easing.out(Easing.cubic) });
    }, [to, sv]);

    return (
        <Text style={[style, { color }]} accessibilityLabel={`${to}`}>
            {display}
        </Text>
    );
}
