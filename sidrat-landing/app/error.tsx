"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";
import Link from "next/link";

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error("Application error:", error);
    }, [error]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-white px-6">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="text-center max-w-md"
            >
                {/* Error Icon */}
                <div className="w-20 h-20 mx-auto mb-8 rounded-2xl bg-gradient-to-br from-red-100 to-red-50 flex items-center justify-center">
                    <AlertTriangle className="w-10 h-10 text-red-500" />
                </div>

                <h2 className="text-3xl sm:text-4xl font-bold text-text-dark mb-4 font-heading">
                    Something went wrong
                </h2>

                <p className="text-lg text-text-secondary mb-8 leading-relaxed">
                    We apologize for the inconvenience. An unexpected error occurred. Please try again or return to the homepage.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <button
                        onClick={reset}
                        className="group inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl bg-gradient-to-r from-primary to-secondary text-white font-semibold shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 hover:-translate-y-0.5 transition-all duration-300"
                    >
                        <RefreshCw className="w-5 h-5 group-hover:rotate-180 transition-transform duration-500" />
                        Try Again
                    </button>

                    <Link
                        href="/"
                        className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl bg-gray-100 hover:bg-gray-200 text-text-dark font-semibold transition-all duration-300"
                    >
                        <Home className="w-5 h-5" />
                        Go Home
                    </Link>
                </div>

                {error.digest && (
                    <p className="mt-8 text-sm text-text-secondary">
                        Error ID: {error.digest}
                    </p>
                )}
            </motion.div>
        </div>
    );
}
