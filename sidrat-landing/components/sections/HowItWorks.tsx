"use client";

import React from "react";
import { motion } from "framer-motion";
import { Clock, BookOpen, Users, ClipboardList, Smartphone, Sparkles, LucideIcon } from "lucide-react";

interface Step {
    number: number;
    icon: LucideIcon;
    title: string;
    description: string;
    highlight: string;
}

const steps: Step[] = [
    {
        number: 1,
        icon: ClipboardList,
        title: "They Learn in the App",
        description: "Your child completes 5-minute daily lessons. Games, stories, and quizzes keep them engaged and wanting more.",
        highlight: "This week: Learning about Wudu"
    },
    {
        number: 2,
        icon: Smartphone,
        title: "You Get the Activity",
        description: "Every weekend, a 15-minute family activity lands in your dashboard. Clear instructions, no prep needed.",
        highlight: "Practice Wudu together"
    },
    {
        number: 3,
        icon: Sparkles,
        title: "Watch Them Grow Together",
        description: "Track app progress and completed family activities. See what's clicking and what needs reinforcement.",
        highlight: "Week 6: Knows all Wudu steps"
    },
];

export function HowItWorks() {
    return (
        <section id="how-it-works" className="py-12 sm:py-16 md:py-20 bg-gradient-to-b from-white via-gray-50/30 to-white relative overflow-hidden">
            {/* Background decorations */}
            <div className="absolute inset-0">
                <div className="absolute top-1/4 left-4 sm:left-10 w-64 sm:w-96 h-64 sm:h-96 bg-primary/5 rounded-full blur-3xl" />
                <div className="absolute bottom-1/4 right-4 sm:right-10 w-48 sm:w-80 h-48 sm:h-80 bg-secondary/5 rounded-full blur-3xl" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] sm:w-[500px] h-[300px] sm:h-[500px] bg-gradient-to-r from-primary/5 via-transparent to-secondary/5 rounded-full blur-3xl" />
            </div>

            <div className="container mx-auto px-4 sm:px-6 md:px-8 lg:px-16 xl:px-24 max-w-[1100px] relative z-10">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-12 sm:mb-16 md:mb-20 lg:mb-24 space-y-4 sm:space-y-6 md:space-y-8"
                >
                    <div className="inline-block px-4 sm:px-6 py-2.5 sm:py-3 rounded-full bg-gradient-to-r from-primary/10 to-secondary/10 border border-primary/20 mb-4 sm:mb-6">
                        <span className="text-xs sm:text-sm font-semibold text-primary uppercase tracking-wide">HOW IT WORKS</span>
                    </div>

                    <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold font-heading text-text-dark leading-tight">
                        A weekly rhythm that
                        <span className="block mt-1 sm:mt-2 bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                            actually works
                        </span>
                    </h2>

                    <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-text-secondary max-w-3xl mx-auto leading-relaxed">
                        By week 12: Your child has learned the foundations of Islam—and you’ve been part of every step.
                    </p>
                </motion.div>

                {/* Steps - Enhanced layout */}
                <div className="relative max-w-5xl mx-auto">
                    {/* Connecting line - desktop only */}
                    <div className="hidden lg:block absolute left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-primary via-secondary to-accent transform -translate-x-1/2" />

                    {steps.map((step, index) => (
                        <motion.div
                            key={step.number}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-100px" }}
                            transition={{ delay: 0.2 * index, duration: 0.6 }}
                            className="relative mb-6 sm:mb-8 md:mb-10 last:mb-0"
                        >
                            <div className="grid lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8 items-center">
                                {/* Alternate layout on desktop */}
                                {index % 2 === 0 ? (
                                    <>
                                        {/* Content card - left */}
                                        <motion.div
                                            initial={{ opacity: 0, x: -30 }}
                                            whileInView={{ opacity: 1, x: 0 }}
                                            viewport={{ once: true }}
                                            transition={{ delay: 0.3 + (0.2 * index), duration: 0.6 }}
                                            className="lg:text-right"
                                        >
                                            <div className="group bg-white rounded-xl sm:rounded-2xl p-4 sm:p-5 md:p-6 border border-gray-100 shadow-lg hover:shadow-xl transition-all duration-500">
                                                {/* Icon and title */}
                                                <div className="flex lg:flex-row-reverse items-start gap-3 sm:gap-4 mb-3 sm:mb-4">
                                                    <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center group-hover:scale-105 transition-all duration-500">
                                                        <step.icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" strokeWidth={2} />
                                                    </div>
                                                    <div className="flex-1 lg:text-right">
                                                        <h3 className="text-base sm:text-lg md:text-xl font-bold text-text-dark mb-2 font-heading group-hover:text-primary transition-colors">
                                                            {step.title}
                                                        </h3>
                                                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-primary/10 border border-primary/20">
                                                            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                                                            <span className="text-xs font-semibold text-primary">{step.highlight}</span>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Description */}
                                                <p className="text-sm sm:text-base text-text-secondary leading-relaxed">
                                                    {step.description}
                                                </p>
                                            </div>
                                        </motion.div>

                                        {/* Number badge - center */}
                                        <div className="hidden lg:flex justify-center">
                                            <motion.div
                                                initial={{ scale: 0 }}
                                                whileInView={{ scale: 1 }}
                                                viewport={{ once: true }}
                                                transition={{ delay: 0.4 + (0.2 * index), type: "spring", stiffness: 200 }}
                                                className="relative"
                                            >
                                                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-2xl">
                                                    <span className="text-4xl font-bold text-white">{step.number}</span>
                                                </div>
                                                {/* Pulse rings */}
                                                <div className="absolute inset-0 rounded-full bg-primary animate-ping opacity-20" />
                                                <div className="absolute inset-0 rounded-full bg-secondary animate-ping opacity-10" style={{ animationDelay: '0.5s' }} />
                                            </motion.div>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        {/* Number badge - center */}
                                        <div className="hidden lg:flex justify-center">
                                            <motion.div
                                                initial={{ scale: 0 }}
                                                whileInView={{ scale: 1 }}
                                                viewport={{ once: true }}
                                                transition={{ delay: 0.4 + (0.2 * index), type: "spring", stiffness: 200 }}
                                                className="relative"
                                            >
                                                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-secondary to-accent flex items-center justify-center shadow-2xl">
                                                    <span className="text-4xl font-bold text-white">{step.number}</span>
                                                </div>
                                                {/* Pulse rings */}
                                                <div className="absolute inset-0 rounded-full bg-secondary animate-ping opacity-20" />
                                                <div className="absolute inset-0 rounded-full bg-accent animate-ping opacity-10" style={{ animationDelay: '0.5s' }} />
                                            </motion.div>
                                        </div>

                                        {/* Content card - right */}
                                        <motion.div
                                            initial={{ opacity: 0, x: 30 }}
                                            whileInView={{ opacity: 1, x: 0 }}
                                            viewport={{ once: true }}
                                            transition={{ delay: 0.3 + (0.2 * index), duration: 0.6 }}
                                        >
                                            <div className="group bg-white rounded-xl sm:rounded-2xl p-4 sm:p-5 md:p-6 border border-gray-100 shadow-lg hover:shadow-xl transition-all duration-500">
                                                {/* Icon and title */}
                                                <div className="flex items-start gap-3 sm:gap-4 mb-3 sm:mb-4">
                                                    <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-secondary to-secondary/80 flex items-center justify-center group-hover:scale-105 transition-all duration-500">
                                                        <step.icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" strokeWidth={2} />
                                                    </div>
                                                    <div className="flex-1">
                                                        <h3 className="text-base sm:text-lg md:text-xl font-bold text-text-dark mb-2 font-heading group-hover:text-secondary transition-colors">
                                                            {step.title}
                                                        </h3>
                                                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-secondary/10 border border-secondary/20">
                                                            <span className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse" />
                                                            <span className="text-xs font-semibold text-secondary">{step.highlight}</span>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Description */}
                                                <p className="text-sm sm:text-base text-text-secondary leading-relaxed">
                                                    {step.description}
                                                </p>
                                            </div>
                                        </motion.div>
                                    </>
                                )}

                                {/* Mobile number badge */}
                                <div className="lg:hidden absolute -left-4 top-0">
                                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-lg">
                                        <span className="text-xl font-bold text-white">{step.number}</span>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Results showcase */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.6, duration: 0.6 }}
                    className="mt-10 sm:mt-12 md:mt-16"
                >
                    <div className="relative">
                        <div className="absolute -inset-2 sm:-inset-3 bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10 rounded-xl sm:rounded-2xl blur-xl" />
                        <div className="relative bg-white/90 backdrop-blur-sm rounded-xl sm:rounded-2xl p-5 sm:p-6 md:p-8 shadow-lg border border-gray-100">
                            <div className="text-center mb-4 sm:mb-6">
                                <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-text-dark mb-2 sm:mb-3">
                                    The result?
                                </h3>
                                <p className="text-base sm:text-lg md:text-xl text-primary font-semibold">
                                    Confident kids. Connected parents. Stronger iman.
                                </p>
                            </div>

                            {/* Stats */}
                            <div className="grid grid-cols-3 gap-2 sm:gap-4">
                                {[
                                    { icon: Clock, stat: "5 min", label: "Daily in app" },
                                    { icon: BookOpen, stat: "15 min", label: "Weekly activity" },
                                    { icon: Users, stat: "12 weeks", label: "Full journey" }
                                ].map((item, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0, y: 20 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: 0.7 + (i * 0.1) }}
                                        className="text-center p-3 sm:p-4 rounded-lg sm:rounded-xl bg-gradient-to-br from-gray-50 to-white border border-gray-100"
                                    >
                                        <div className="w-8 h-8 sm:w-10 sm:h-10 mx-auto rounded-lg sm:rounded-xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center mb-2">
                                            <item.icon className="w-4 h-4 sm:w-5 sm:h-5 text-white" strokeWidth={2} />
                                        </div>
                                        <div className="text-base sm:text-xl md:text-2xl font-bold text-text-dark mb-0.5">{item.stat}</div>
                                        <div className="text-[10px] sm:text-xs text-text-secondary">{item.label}</div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Final CTA */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.8, duration: 0.6 }}
                    className="text-center mt-16"
                >
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="group relative px-10 md:px-12 py-5 md:py-6 text-lg md:text-xl font-semibold rounded-2xl bg-gradient-to-r from-primary via-secondary to-accent text-white shadow-primary hover:shadow-primary/50 transition-all duration-300"
                    >
                        <span className="relative z-10 flex items-center justify-center gap-3">
                            Join 150+ Families on the Waitlist
                            <svg className="w-5 h-5 md:w-6 md:h-6 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                            </svg>
                        </span>
                    </motion.button>
                </motion.div>
            </div>
        </section>
    );
}

