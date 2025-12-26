"use client";

import React, { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";

interface MagneticButtonProps {
    children: React.ReactNode;
    className?: string;
    strength?: number;
}

export function MagneticButton({ 
    children, 
    className = "", 
    strength = 0.3,
}: MagneticButtonProps) {
    const ref = useRef<HTMLDivElement>(null);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [isTouchDevice, setIsTouchDevice] = useState(false);

    useEffect(() => {
        // Check if device supports touch
        setIsTouchDevice(
            'ontouchstart' in window || 
            navigator.maxTouchPoints > 0 ||
            window.matchMedia('(pointer: coarse)').matches
        );
    }, []);

    const handleMouse = (e: React.MouseEvent<HTMLDivElement>) => {
        // Disable magnetic effect on touch devices
        if (isTouchDevice) return;
        
        const { clientX, clientY } = e;
        const { width, height, left, top } = e.currentTarget.getBoundingClientRect();
        const x = (clientX - (left + width / 2)) * strength;
        const y = (clientY - (top + height / 2)) * strength;
        setPosition({ x, y });
    };

    const reset = () => setPosition({ x: 0, y: 0 });

    // On touch devices, render without magnetic effect
    if (isTouchDevice) {
        return (
            <div className={`inline-block w-full sm:w-auto ${className}`}>
                {children}
            </div>
        );
    }

    return (
        <motion.div
            ref={ref}
            onMouseMove={handleMouse}
            onMouseLeave={reset}
            animate={{ x: position.x, y: position.y }}
            transition={{ type: "spring", stiffness: 150, damping: 15, mass: 0.1 }}
            className={`inline-block ${className}`}
        >
            {children}
        </motion.div>
    );
}
