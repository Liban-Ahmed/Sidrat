"use client";

import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface FeatureCardProps {
    icon: React.ReactNode;
    title: string;
    description: string;
    className?: string;
}

export function FeatureCard({
    icon,
    title,
    description,
    className = "",
}: FeatureCardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5 }}
            className={cn(
                "bg-white rounded-xl p-8 shadow-card hover:shadow-large transition-shadow duration-300",
                className
            )}
        >
            <div className="text-primary mb-4 w-12 h-12">{icon}</div>
            <h3 className="font-heading font-semibold text-h3-mobile md:text-h3 text-text-dark mb-3">
                {title}
            </h3>
            <p className="text-text-secondary leading-relaxed">{description}</p>
        </motion.div>
    );
}
