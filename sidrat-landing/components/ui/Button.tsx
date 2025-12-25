"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    children: React.ReactNode;
    variant?: "primary" | "secondary";
    size?: "default" | "large";
    href?: string;
    className?: string;
}

export function Button({
    children,
    variant = "primary",
    size = "default",
    href,
    className = "",
    ...props
}: ButtonProps) {
    const baseStyles =
        "inline-flex items-center justify-center font-heading font-semibold rounded-lg transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2";

    const variantStyles = {
        primary:
            "bg-primary text-white hover:bg-primary/90 shadow-md hover:shadow-lg",
        secondary:
            "bg-transparent border-2 border-primary text-primary hover:bg-primary hover:text-white",
    };

    const sizeStyles = {
        default: "px-8 py-3 text-base",
        large: "px-10 py-4 text-lg",
    };

    const combinedClassName = cn(
        baseStyles,
        variantStyles[variant],
        sizeStyles[size],
        className
    );

    if (href) {
        return (
            <a href={href} className={combinedClassName}>
                {children}
            </a>
        );
    }

    return (
        <button className={combinedClassName} {...props}>
            {children}
        </button>
    );
}
