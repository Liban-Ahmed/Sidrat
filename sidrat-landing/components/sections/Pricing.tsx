"use client";

import React from "react";
import { motion } from "framer-motion";
import { Zap, ShieldCheck, Award, Sparkles, Gift, Users } from "lucide-react";
import { EmailForm } from "@/components/ui/EmailForm";
import { AnimatedGradientText } from "@/components/effects";

const included = [
    "Full 12-week Ages 5-7 experience",
    "50+ interactive app lessons",
    "12 guided family activities",
    "Unlimited child profiles",
    "Parent dashboard",
    "All future age ranges free when released",
    "Lifetime updates",
    "Priority support",
    "Founding member badge",
];

export function Pricing() {
    return (
        <section id="pricing" className="py-32 md:py-40 bg-gradient-to-b from-gray-50 via-white to-gray-50 relative overflow-hidden scroll-mt-8">
            {/* Enhanced background decoration */}
            <div className="absolute inset-0">
                <div className="absolute top-1/4 left-10 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
                <div className="absolute bottom-1/4 right-10 w-80 h-80 bg-primary/5 rounded-full blur-3xl" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-accent/5 via-transparent to-secondary/5 rounded-full blur-3xl" />
            </div>

            <div className="container mx-auto px-6 sm:px-8 md:px-12 lg:px-20 xl:px-40 max-w-[1400px] relative z-10">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-20 md:mb-24 space-y-8"
                >
                    <div className="inline-block px-6 py-3 rounded-full bg-gradient-to-r from-accent/20 to-accent/10 border border-accent/30 mb-6">
                        <span className="text-sm font-semibold text-accent uppercase tracking-wide">
                            Founding Member Offer
                        </span>
                    </div>

                    <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold font-heading text-text-dark leading-tight">
                        Join the
                        <AnimatedGradientText className="block mt-2">
                            founding members
                        </AnimatedGradientText>
                    </h2>

                    <p className="text-xl md:text-2xl text-text-secondary max-w-3xl mx-auto leading-relaxed">
                        Be among the first 200 families to get lifetime access at this special price
                    </p>
                </motion.div>

                {/* Premium pricing card */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="relative max-w-3xl mx-auto"
                >
                    {/* Animated glow effect */}
                    <motion.div
                        className="absolute -inset-4 bg-gradient-to-r from-accent/20 via-primary/20 to-secondary/20 rounded-[50px] blur-3xl"
                        animate={{
                            scale: [0.95, 1.05, 0.95],
                            opacity: [0.5, 0.8, 0.5],
                        }}
                        transition={{
                            duration: 4,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                    />

                    <div className="relative bg-white/95 backdrop-blur-xl rounded-[48px] p-8 sm:p-12 md:p-16 border border-white/50 shadow-2xl">
                        {/* Badge */}
                        <div className="absolute -top-5 sm:-top-6 left-1/2 transform -translate-x-1/2">
                            <div className="px-5 sm:px-8 py-2.5 sm:py-3 rounded-full bg-gradient-to-r from-accent to-accent/90 text-white font-bold text-xs sm:text-sm uppercase tracking-wide shadow-xl flex items-center gap-2 whitespace-nowrap">
                                <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                                Early Access
                            </div>
                        </div>

                        {/* Pricing */}
                        <div className="text-center mb-12 pt-4 sm:pt-0">
                            <div className="flex flex-col items-center justify-center gap-2 sm:gap-4 mb-6">
                                <span className="text-lg sm:text-2xl text-text-secondary line-through">$144/year</span>
                                <div className="flex items-baseline gap-1 sm:gap-2">
                                    <AnimatedGradientText className="text-5xl sm:text-7xl md:text-8xl font-bold">
                                        $99
                                    </AnimatedGradientText>
                                    <span className="text-xl sm:text-3xl text-text-secondary">/year</span>
                                </div>
                            </div>

                            <div className="inline-flex items-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 rounded-full bg-green-50 border border-green-200 mb-4">
                                <svg className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                                <span className="text-green-800 font-semibold text-sm sm:text-base">Save $45 + Lock in this rate forever</span>
                            </div>

                            <p className="text-sm sm:text-base text-text-secondary">
                                <span className="font-semibold text-text-dark">One-time payment</span> • No subscriptions
                            </p>
                        </div>

                        {/* Features included */}
                        <div className="space-y-5 mb-12">
                            {included.map((feature, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, x: -20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: 0.1 * i, duration: 0.4 }}
                                    className="flex items-center gap-4 group"
                                >
                                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-secondary to-secondary/80 flex items-center justify-center shadow-md group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                                        <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                    <span className="text-lg sm:text-xl text-text-dark font-medium">{feature}</span>
                                </motion.div>
                            ))}
                        </div>

                        {/* Bonus */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.6 }}
                            className="bg-gradient-to-r from-accent/10 to-accent/5 rounded-3xl p-6 sm:p-8 mb-12 border border-accent/20"
                        >
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-accent to-accent/80 flex items-center justify-center flex-shrink-0">
                                    <Gift className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <p className="text-lg sm:text-xl font-bold text-text-dark mb-2">
                                        Bonus: Printable "My Islamic Learning" Journal
                                    </p>
                                    <p className="text-base sm:text-lg text-text-secondary">
                                        Track your child's progress with this beautifully designed journal
                                        <span className="block mt-1 text-accent font-semibold">($19 value, yours FREE)</span>
                                    </p>
                                </div>
                            </div>
                        </motion.div>

                        {/* Email form */}
                        <EmailForm
                            buttonText="🚀 Join the Waitlist"
                            placeholder="Enter your email"
                        />

                        {/* Privacy & Urgency */}
                        <div className="mt-8 space-y-4 text-center">
                            <p className="flex items-center justify-center gap-2 text-sm sm:text-base text-text-secondary">
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                                </svg>
                                We respect your privacy. Unsubscribe anytime.
                            </p>

                            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 text-sm sm:text-base">
                                <div className="flex items-center gap-2">
                                    <div className="relative flex h-3 w-3">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                                    </div>
                                    <span className="font-semibold text-text-dark">Launching December 2026</span>
                                </div>
                                <span className="hidden sm:inline text-text-secondary">•</span>
                                <div className="flex items-center gap-2">
                                    <Users className="w-5 h-5 text-primary" />
                                    <span className="text-text-secondary">
                                        <span className="font-semibold text-text-dark">150+ families</span> already joined
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Social proof section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.8 }}
                    className="mt-16 sm:mt-20 text-center"
                >
                    <div className="grid sm:grid-cols-3 gap-6 sm:gap-8 max-w-4xl mx-auto">
                        {[
                            { icon: Zap, stat: "Ad-free", label: "Safe learning" },
                            { icon: ShieldCheck, stat: "100%", label: "Scholar reviewed" },
                            { icon: Award, stat: "30-day", label: "Money-back guarantee" }
                        ].map((item, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.9 + (i * 0.1) }}
                                className="bg-white rounded-2xl p-6 shadow-card border border-gray-100"
                            >
                                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center mb-3">
                                    <item.icon className="w-7 h-7 text-white" strokeWidth={2} />
                                </div>
                                <div className="text-2xl sm:text-3xl font-bold text-text-dark mb-1">{item.stat}</div>
                                <div className="text-sm sm:text-base text-text-secondary">{item.label}</div>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
