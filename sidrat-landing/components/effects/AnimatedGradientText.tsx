"use client";

import React from "react";
import { motion } from "framer-motion";

interface AnimatedGradientTextProps {
    children: React.ReactNode;
    className?: string;
}

export function AnimatedGradientText({ children, className = "" }: AnimatedGradientTextProps) {
    return (
        <motion.span
            className={`bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent bg-[length:200%_auto] ${className}`}
            animate={{
                backgroundPosition: ["0% center", "200% center", "0% center"],
            }}
            transition={{
                duration: 8,
                ease: "linear",
                repeat: Infinity,
            }}
        >
            {children}
        </motion.span>
    );
}
