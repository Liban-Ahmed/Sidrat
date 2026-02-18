/**
 * AnimatedCounter — premium number roll-up with spring physics,
 * locale-aware formatting, optional prefix/suffix, and a subtle
 * scale pulse on completion.
 *
 * Features:
 *  • Spring-driven roll-up (not just linear timing)
 *  • Thousands separator formatting (1,234)
 *  • Optional prefix ("+" ) and suffix (" XP")
 *  • Micro-scale pulse when value arrives
 *  • Responds to live value changes smoothly
 */

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { type TextStyle, type StyleProp } from 'react-native';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withTiming,
    withSpring,
    withSequence,
    useDerivedValue,
    runOnJS,
    Easing,
} from 'react-native-reanimated';

interface AnimatedCounterProps {
    /** Target number to count to */
    to: number;
    /** Text color */
    color: string;
    /** Text style (size, weight, etc.) */
    style: StyleProp<TextStyle>;
    /** Prefix shown before the number (e.g. "+") */
    prefix?: string;
    /** Suffix shown after the number (e.g. " XP") */
    suffix?: string;
    /** Format with thousands separators (default true) */
    formatted?: boolean;
    /** Duration in ms (default 1000) */
    duration?: number;
    /** Pulse the number on arrival (default false) */
    pulse?: boolean;
}

function formatNumber(n: number): string {
    return n.toLocaleString('en-US');
}

export function AnimatedCounter({
    to,
    color,
    style,
    prefix,
    suffix,
    formatted = true,
    duration = 1000,
    pulse = false,
}: AnimatedCounterProps) {
    const [display, setDisplay] = useState(0);
    const sv = useSharedValue(0);
    const scale = useSharedValue(1);
    const prevTo = useRef(to);

    const updateDisplay = useCallback((v: number) => setDisplay(Math.round(v)), []);

    useDerivedValue(() => {
        runOnJS(updateDisplay)(sv.value);
    });

    useEffect(() => {
        const from = prevTo.current;
        prevTo.current = to;

        // If counting up from 0 use eased timing, otherwise spring for live changes
        if (from === 0) {
            sv.value = withTiming(to, {
                duration,
                easing: Easing.out(Easing.cubic),
            });
        } else {
            sv.value = withSpring(to, { damping: 28, stiffness: 120, mass: 0.8 });
        }

        // Pulse scale on arrival
        if (pulse && to > 0) {
            const delay = from === 0 ? duration * 0.85 : 300;
            setTimeout(() => {
                scale.value = withSequence(
                    withSpring(1.12, { damping: 8, stiffness: 400 }),
                    withSpring(1, { damping: 12, stiffness: 200 }),
                );
            }, delay);
        }
    }, [to, sv, duration, pulse, scale]);

    const animatedScale = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }],
    }));

    const displayText = `${prefix ?? ''}${formatted ? formatNumber(display) : display}${suffix ?? ''}`;

    return (
        <Animated.Text
            style={[style, { color }, animatedScale]}
            accessibilityLabel={`${prefix ?? ''}${to}${suffix ?? ''}`}
        >
            {displayText}
        </Animated.Text>
    );
}
