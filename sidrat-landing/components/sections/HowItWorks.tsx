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
        title: "Tell Us About Your Kids",
        description: "Quick quiz: How many children? What ages? What are your priorities? (Islamic manners? Quran? Prophets' stories?)",
        highlight: "Takes 2 minutes"
    },
    {
        number: 2,
        icon: Smartphone,
        title: "Get Your Weekly Plan",
        description: "Every Sunday, receive a personalized lesson plan for each child. Exactly what to teach, how to teach it, and fun activities to try.",
        highlight: "Delivered weekly"
    },
    {
        number: 3,
        icon: Sparkles,
        title: "Watch Them Grow",
        description: "Your 6-year-old asks deep questions about Allah. Your 10-year-old teaches younger siblings. You feel confident as an Islamic educator.",
        highlight: "See the results"
    },
];

export function HowItWorks() {
    return (
        <section id="how-it-works" className="py-32 md:py-40 bg-gradient-to-b from-white via-gray-50/30 to-white relative overflow-hidden">
            {/* Background decorations */}
            <div className="absolute inset-0">
                <div className="absolute top-1/4 left-10 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
                <div className="absolute bottom-1/4 right-10 w-80 h-80 bg-secondary/5 rounded-full blur-3xl" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-r from-primary/5 via-transparent to-secondary/5 rounded-full blur-3xl" />
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
                    <div className="inline-block px-6 py-3 rounded-full bg-gradient-to-r from-primary/10 to-secondary/10 border border-primary/20 mb-6">
                        <span className="text-sm font-semibold text-primary uppercase tracking-wide">HOW IT WORKS</span>
                    </div>

                    <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold font-heading text-text-dark leading-tight">
                        Getting started is
                        <span className="block mt-2 bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                            beautifully simple
                        </span>
                    </h2>

                    <p className="text-xl md:text-2xl text-text-secondary max-w-3xl mx-auto leading-relaxed">
                        Three easy steps to transform your family's Islamic education
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
                            className="relative mb-20 md:mb-24 last:mb-0"
                        >
                            <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
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
                                            <div className="group bg-white rounded-3xl p-8 md:p-10 border border-gray-100 shadow-large hover:shadow-2xl hover:-translate-y-2 transition-all duration-500">
                                                {/* Icon and title */}
                                                <div className="flex lg:flex-row-reverse items-start gap-6 mb-6">
                                                    <div className="flex-shrink-0 w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-all duration-500">
                                                        <step.icon className="w-8 h-8 md:w-10 md:h-10 text-white" strokeWidth={2} />
                                                    </div>
                                                    <div className="flex-1 lg:text-right">
                                                        <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold text-text-dark mb-3 font-heading group-hover:text-primary transition-colors">
                                                            {step.title}
                                                        </h3>
                                                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-4">
                                                            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                                                            <span className="text-sm font-semibold text-primary">{step.highlight}</span>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Description */}
                                                <p className="text-lg md:text-xl text-text-secondary leading-relaxed">
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
                                            <div className="group bg-white rounded-3xl p-8 md:p-10 border border-gray-100 shadow-large hover:shadow-2xl hover:-translate-y-2 transition-all duration-500">
                                                {/* Icon and title */}
                                                <div className="flex items-start gap-6 mb-6">
                                                    <div className="flex-shrink-0 w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-gradient-to-br from-secondary to-secondary/80 flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-all duration-500">
                                                        <step.icon className="w-8 h-8 md:w-10 md:h-10 text-white" strokeWidth={2} />
                                                    </div>
                                                    <div className="flex-1">
                                                        <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold text-text-dark mb-3 font-heading group-hover:text-secondary transition-colors">
                                                            {step.title}
                                                        </h3>
                                                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/10 border border-secondary/20 mb-4">
                                                            <span className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
                                                            <span className="text-sm font-semibold text-secondary">{step.highlight}</span>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Description */}
                                                <p className="text-lg md:text-xl text-text-secondary leading-relaxed">
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
                    className="mt-20 md:mt-24"
                >
                    <div className="relative">
                        <div className="absolute -inset-4 bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10 rounded-3xl blur-xl" />
                        <div className="relative bg-white/90 backdrop-blur-sm rounded-3xl p-8 md:p-12 shadow-large border border-gray-100">
                            <div className="text-center mb-8">
                                <h3 className="text-3xl md:text-4xl font-bold text-text-dark mb-4">
                                    The result?
                                </h3>
                                <p className="text-2xl md:text-3xl text-primary font-semibold">
                                    Confident kids. Confident parents. Stronger iman.
                                </p>
                            </div>

                            {/* Stats */}
                            <div className="grid sm:grid-cols-3 gap-6 md:gap-8">
                                {[
                                    { icon: Clock, stat: "15 min", label: "Weekly investment" },
                                    { icon: BookOpen, stat: "50+", label: "Lessons ready" },
                                    { icon: Users, stat: "100+", label: "Families waiting" }
                                ].map((item, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0, y: 20 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: 0.7 + (i * 0.1) }}
                                        className="text-center p-6 rounded-2xl bg-gradient-to-br from-gray-50 to-white border border-gray-100"
                                    >
                                        <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center mb-3">
                                            <item.icon className="w-7 h-7 text-white" strokeWidth={2} />
                                        </div>
                                        <div className="text-3xl md:text-4xl font-bold text-text-dark mb-1">{item.stat}</div>
                                        <div className="text-sm md:text-base text-text-secondary">{item.label}</div>
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
                            Join 200+ Families on the Waitlist
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

