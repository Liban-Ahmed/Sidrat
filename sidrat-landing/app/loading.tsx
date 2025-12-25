import { motion } from "framer-motion";

export default function Loading() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-white">
            <div className="text-center">
                {/* Animated Logo/Spinner */}
                <div className="relative w-20 h-20 mx-auto mb-6">
                    {/* Outer ring */}
                    <div className="absolute inset-0 rounded-full border-4 border-gray-200" />
                    {/* Spinning ring */}
                    <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-primary border-r-secondary animate-spin" />
                    {/* Inner gradient circle */}
                    <div className="absolute inset-3 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 animate-pulse" />
                </div>

                {/* Loading text */}
                <p className="text-lg font-medium text-text-dark mb-2">Loading Sidrat</p>
                <p className="text-sm text-text-secondary">Please wait a moment...</p>

                {/* Animated dots */}
                <div className="flex items-center justify-center gap-1.5 mt-4">
                    {[0, 1, 2].map((i) => (
                        <div
                            key={i}
                            className="w-2 h-2 rounded-full bg-primary animate-bounce"
                            style={{ animationDelay: `${i * 0.15}s` }}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}
