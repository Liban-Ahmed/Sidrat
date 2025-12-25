"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface CardProps {
    children: React.ReactNode;
    className?: string;
    variant?: "default" | "bordered" | "accent";
}

export function Card({ children, className = "", variant = "default" }: CardProps) {
    const baseStyles = "bg-white rounded-xl p-8";

    const variantStyles = {
        default: "shadow-card hover:shadow-large transition-shadow",
        bordered: "border-l-4 border-text-secondary shadow-subtle",
        accent: "border-t-4 border-accent shadow-large",
    };

    return (
        <div className={cn(baseStyles, variantStyles[variant], className)}>
            {children}
        </div>
    );
}
