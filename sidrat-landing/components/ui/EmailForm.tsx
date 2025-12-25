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
            // Using Formspree - replace YOUR_FORM_ID with actual ID
            const response = await fetch("https://formspree.io/f/YOUR_FORM_ID", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email: data.email }),
            });

            if (response.ok) {
                setSubmitStatus("success");
                reset();
            } else {
                throw new Error("Failed to submit");
            }
        } catch {
            setSubmitStatus("error");
            setErrorMessage("Something went wrong. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className={className}>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="flex flex-col sm:flex-row gap-3">
                    <div className="flex-1">
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
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none transition-colors disabled:bg-gray-100 disabled:cursor-not-allowed"
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
                        className="inline-flex items-center justify-center px-6 py-3 bg-primary text-white font-heading font-semibold rounded-lg hover:bg-primary/90 transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100 sm:w-auto w-full"
                        aria-label={buttonText}
                    >
                        {isSubmitting ? (
                            <>
                                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                                Submitting...
                            </>
                        ) : (
                            buttonText
                        )}
                    </button>
                </div>
            </form>

            <AnimatePresence>
                {submitStatus === "success" && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="mt-4 p-4 bg-secondary/10 border border-secondary/20 rounded-lg flex items-center gap-2 text-secondary"
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
                        className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-600"
                    >
                        <AlertCircle className="w-5 h-5 flex-shrink-0" />
                        <span>{errorMessage}</span>
                    </motion.div>
                )}
            </AnimatePresence>

            <p className="mt-3 text-sm text-text-secondary flex items-center gap-1">
                🔒 We respect your privacy. Unsubscribe anytime.
            </p>
        </div>
    );
}
