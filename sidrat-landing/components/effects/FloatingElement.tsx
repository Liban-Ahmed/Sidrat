"use client";

import React, { useEffect } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

interface FloatingElementProps {
    children: React.ReactNode;
    className?: string;
    parallaxStrength?: number;
}

export function FloatingElement({ 
    children, 
    className = "",
    parallaxStrength = 20 
}: FloatingElementProps) {
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    const springConfig = { damping: 25, stiffness: 150 };
    const x = useSpring(mouseX, springConfig);
    const y = useSpring(mouseY, springConfig);

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            const { clientX, clientY } = e;
            const { innerWidth, innerHeight } = window;
            
            const xPct = (clientX / innerWidth - 0.5) * parallaxStrength;
            const yPct = (clientY / innerHeight - 0.5) * parallaxStrength;
            
            mouseX.set(xPct);
            mouseY.set(yPct);
        };

        window.addEventListener("mousemove", handleMouseMove);
        return () => window.removeEventListener("mousemove", handleMouseMove);
    }, [mouseX, mouseY, parallaxStrength]);

    return (
        <motion.div style={{ x, y }} className={className}>
            {children}
        </motion.div>
    );
}
