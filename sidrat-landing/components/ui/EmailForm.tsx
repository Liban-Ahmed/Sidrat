"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, CheckCircle, AlertCircle } from "lucide-react";

interface FormData {
    email: string;
}

interface EmailFormProps {
    className?: string;
    buttonText?: string;
    placeholder?: string;
}

const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;

export function EmailForm({
    className = "",
    buttonText = "Join the Waitlist →",
    placeholder = "Enter your email",
}: EmailFormProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");
    const [errorMessage, setErrorMessage] = useState("");

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm<FormData>();

    const onSubmit = async (data: FormData) => {
        setIsSubmitting(true);
        setSubmitStatus("idle");
        setErrorMessage("");

        try {
            // ✅ Call your own API route (key is hidden)
            const response = await fetch("/api/subscribe", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email: data.email,
                }),
            });

            const result = await response.json();

            if (response.ok) {
                setSubmitStatus("success");
                reset();
            } else {
                throw new Error(result.error || "Failed to submit");
            }
        } catch (error) {
            setSubmitStatus("error");
            setErrorMessage(error instanceof Error ? error.message : "Something went wrong. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className={className}>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="relative">
                    <input
                        type="email"
                        {...register("email", {
                            required: "Email is required",
                            pattern: {
                                value: emailRegex,
                                message: "Please enter a valid email",
                            },
                        })}
                        placeholder={placeholder}
                        disabled={isSubmitting || submitStatus === "success"}
                        className="w-full px-8 py-6 text-lg rounded-2xl border-2 border-gray-200 focus:border-primary focus:ring-4 focus:ring-primary/20 transition-all outline-none disabled:bg-gray-100 disabled:cursor-not-allowed"
                        aria-label="Email address"
                    />
                    {errors.email && (
                        <motion.p
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mt-2 text-sm text-red-500 flex items-center gap-1"
                        >
                            <AlertCircle className="w-4 h-4" />
                            {errors.email.message}
                        </motion.p>
                    )}
                </div>

                <button
                    type="submit"
                    disabled={isSubmitting || submitStatus === "success"}
                    className="w-full group relative px-10 py-6 text-xl font-semibold rounded-2xl bg-gradient-to-r from-primary to-secondary text-white shadow-primary hover:shadow-primary/50 hover:scale-[1.02] transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                    aria-label={buttonText}
                >
                    {isSubmitting ? (
                        <span className="flex items-center justify-center gap-3">
                            <Loader2 className="w-6 h-6 animate-spin" />
                            Submitting...
                        </span>
                    ) : (
                        <span className="relative z-10 flex items-center justify-center gap-3">
                            {buttonText}
                            <svg className="w-6 h-6 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                            </svg>
                        </span>
                    )}
                </button>
            </form>

            <AnimatePresence>
                {submitStatus === "success" && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="mt-6 p-4 bg-secondary/10 border border-secondary/20 rounded-2xl flex items-center gap-2 text-secondary"
                    >
                        <CheckCircle className="w-5 h-5 flex-shrink-0" />
                        <span>Thank you! You&apos;re on the waitlist. We&apos;ll be in touch soon!</span>
                    </motion.div>
                )}
                {submitStatus === "error" && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="mt-6 p-4 bg-red-50 border border-red-200 rounded-2xl flex items-center gap-2 text-red-600"
                    >
                        <AlertCircle className="w-5 h-5 flex-shrink-0" />
                        <span>{errorMessage}</span>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
