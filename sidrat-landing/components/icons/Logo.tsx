import React from "react";

interface LogoProps {
    className?: string;
    size?: "sm" | "md" | "lg";
}

export function Logo({ className = "", size = "md" }: LogoProps) {
    const sizeStyles = {
        sm: "text-xl",
        md: "text-2xl",
        lg: "text-3xl",
    };

    return (
        <span
            className={`font-heading font-bold ${sizeStyles[size]} ${className}`}
            aria-label="Sidrat logo"
        >
            Sidrat <span aria-hidden="true">🌙</span>
        </span>
    );
}
