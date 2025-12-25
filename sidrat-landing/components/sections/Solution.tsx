"use client";

import React from "react";
import { motion } from "framer-motion";
import { CheckCircle2, Users, BookOpen, ShieldCheck, Moon, Star, Sparkles } from "lucide-react";

const benefits = [
    { icon: CheckCircle2, title: 'Clear lessons for ages 2-14', desc: '(not too basic, not too advanced)' },
    { icon: CheckCircle2, title: '15-minute activities', desc: 'that actually engage kids' },
    { icon: CheckCircle2, title: 'Conversation prompts', desc: "so you're never tongue-tied" },
    { icon: CheckCircle2, title: 'Progress tracking', desc: 'so you see their growth' },
    { icon: CheckCircle2, title: 'Scholar-reviewed content', desc: 'you can trust' }
];

export function Solution() {
    return (
        <section className="py-32 md:py-40 bg-gradient-to-b from-white via-primary/5 to-white relative overflow-hidden">
            {/* Enhanced background decorations */}
            <div className="absolute inset-0">
                <div className="absolute top-1/4 right-10 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
                <div className="absolute bottom-1/4 left-10 w-80 h-80 bg-secondary/10 rounded-full blur-3xl" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-primary/5 via-accent/5 to-secondary/5 rounded-full blur-3xl" />
            </div>

            <div className="container mx-auto px-6 sm:px-8 md:px-12 lg:px-20 xl:px-40 max-w-[1400px] relative z-10">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-24 space-y-8"
                >
                    <div className="inline-block px-6 py-3 rounded-full bg-gradient-to-r from-primary/10 to-secondary/10 border border-primary/20 mb-6">
                        <span className="text-sm font-semibold text-primary uppercase tracking-wide">THE SOLUTION</span>
                    </div>

                    <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold font-heading text-text-dark leading-tight">
                        Meet Sidrat—Your
                        <span className="block mt-2 bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                            Islamic Curriculum Guide
                        </span>
                    </h2>

                    <p className="text-xl md:text-2xl text-text-secondary max-w-4xl mx-auto leading-relaxed">
                        Imagine having a personal Islamic education consultant who tells you exactly
                        what to teach your child this week, with ready-made activities and conversation starters.
                    </p>
                </motion.div>

                {/* Improved Bento grid layout */}
                <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 mb-20">
                    {/* Large phone mockup - spans 7 columns */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="lg:col-span-7 relative"
                    >
                        <div className="lg:sticky lg:top-32">
                            {/* Premium phone frame with 3D effect */}
                            <div className="relative mx-auto max-w-md">
                                {/* Animated glow effect */}
                                <motion.div
                                    className="absolute inset-0 bg-gradient-to-br from-primary/30 to-secondary/30 rounded-[60px] blur-3xl"
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

                                {/* Phone frame */}
                                <div className="relative bg-gradient-to-br from-gray-900 to-gray-800 rounded-[60px] p-4 shadow-2xl">
                                    {/* Screen */}
                                    <div className="bg-white rounded-[52px] overflow-hidden aspect-[9/19.5]">
                                        {/* Status bar */}
                                        <div className="bg-gray-50 px-8 py-3 flex justify-between items-center border-b border-gray-100">
                                            <span className="text-xs font-semibold text-gray-900">9:41</span>
                                            <div className="flex gap-1">
                                                <div className="w-4 h-3 bg-gray-900 rounded-sm" />
                                                <div className="w-4 h-3 bg-gray-900 rounded-sm" />
                                                <div className="w-4 h-3 bg-gray-900 rounded-sm" />
                                            </div>
                                        </div>

                                        {/* App content preview */}
                                        <div className="p-6 space-y-6 bg-gradient-to-b from-white to-gray-50">
                                            {/* Header section */}
                                            <motion.div
                                                initial={{ opacity: 0, y: 10 }}
                                                whileInView={{ opacity: 1, y: 0 }}
                                                viewport={{ once: true }}
                                                transition={{ delay: 0.3 }}
                                                className="flex items-center gap-4"
                                            >
                                                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-lg">
                                                    <Moon className="w-7 h-7 text-white" fill="currentColor" />
                                                </div>
                                                <div className="flex-1">
                                                    <div className="h-4 bg-gradient-to-r from-gray-300 to-gray-200 rounded-lg w-32 mb-2" />
                                                    <div className="h-3 bg-gradient-to-r from-gray-200 to-gray-100 rounded w-24" />
                                                </div>
                                            </motion.div>

                                            {/* Featured lesson card */}
                                            <motion.div
                                                initial={{ opacity: 0, scale: 0.95 }}
                                                whileInView={{ opacity: 1, scale: 1 }}
                                                viewport={{ once: true }}
                                                transition={{ delay: 0.4 }}
                                                className="bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10 rounded-3xl p-6 border border-primary/20 shadow-lg"
                                            >
                                                <div className="flex items-start gap-3 mb-4">
                                                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent to-accent/80 flex items-center justify-center">
                                                        <Star className="w-5 h-5 text-white" fill="currentColor" />
                                                    </div>
                                                    <div className="flex-1">
                                                        <div className="h-4 bg-white/60 rounded-lg w-3/4 mb-2" />
                                                        <div className="h-3 bg-white/40 rounded w-1/2" />
                                                    </div>
                                                </div>
                                                <div className="space-y-2">
                                                    <div className="h-3 bg-white/50 rounded-lg w-full" />
                                                    <div className="h-3 bg-white/40 rounded-lg w-5/6" />
                                                </div>
                                            </motion.div>

                                            {/* Lesson list */}
                                            <div className="space-y-3">
                                                <motion.div
                                                    initial={{ opacity: 0, x: -10 }}
                                                    whileInView={{ opacity: 1, x: 0 }}
                                                    viewport={{ once: true }}
                                                    transition={{ delay: 0.5 }}
                                                    className="flex items-center gap-3 bg-white rounded-2xl p-4 shadow-card border border-gray-100 hover:shadow-lg transition-shadow"
                                                >
                                                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-accent to-accent/80 flex items-center justify-center text-2xl shadow-md">
                                                        📖
                                                    </div>
                                                    <div className="flex-1">
                                                        <div className="h-3 bg-gradient-to-r from-gray-300 to-gray-200 rounded-lg w-full mb-2" />
                                                        <div className="h-2 bg-gradient-to-r from-gray-200 to-gray-100 rounded w-3/4" />
                                                    </div>
                                                    <div className="w-8 h-8 rounded-lg bg-secondary/10 flex items-center justify-center">
                                                        <svg className="w-4 h-4 text-secondary" fill="currentColor" viewBox="0 0 20 20">
                                                            <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                                                        </svg>
                                                    </div>
                                                </motion.div>

                                                <motion.div
                                                    initial={{ opacity: 0, x: -10 }}
                                                    whileInView={{ opacity: 1, x: 0 }}
                                                    viewport={{ once: true }}
                                                    transition={{ delay: 0.6 }}
                                                    className="flex items-center gap-3 bg-white rounded-2xl p-4 shadow-card border border-gray-100 hover:shadow-lg transition-shadow"
                                                >
                                                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-secondary to-secondary/80 flex items-center justify-center shadow-md">
                                                        <Sparkles className="w-6 h-6 text-white" />
                                                    </div>
                                                    <div className="flex-1">
                                                        <div className="h-3 bg-gradient-to-r from-gray-300 to-gray-200 rounded-lg w-full mb-2" />
                                                        <div className="h-2 bg-gradient-to-r from-gray-200 to-gray-100 rounded w-3/4" />
                                                    </div>
                                                    <div className="w-8 h-8 rounded-lg bg-secondary/10 flex items-center justify-center">
                                                        <svg className="w-4 h-4 text-secondary" fill="currentColor" viewBox="0 0 20 20">
                                                            <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                                                        </svg>
                                                    </div>
                                                </motion.div>

                                                <motion.div
                                                    initial={{ opacity: 0, x: -10 }}
                                                    whileInView={{ opacity: 1, x: 0 }}
                                                    viewport={{ once: true }}
                                                    transition={{ delay: 0.7 }}
                                                    className="flex items-center gap-3 bg-white rounded-2xl p-4 shadow-card border border-gray-100 hover:shadow-lg transition-shadow"
                                                >
                                                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center text-2xl shadow-md">
                                                        🤲
                                                    </div>
                                                    <div className="flex-1">
                                                        <div className="h-3 bg-gradient-to-r from-gray-300 to-gray-200 rounded-lg w-full mb-2" />
                                                        <div className="h-2 bg-gradient-to-r from-gray-200 to-gray-100 rounded w-3/4" />
                                                    </div>
                                                    <div className="w-8 h-8 rounded-lg bg-secondary/10 flex items-center justify-center">
                                                        <svg className="w-4 h-4 text-secondary" fill="currentColor" viewBox="0 0 20 20">
                                                            <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                                                        </svg>
                                                    </div>
                                                </motion.div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Floating indicators */}
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    whileInView={{ opacity: 1, scale: 1 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: 0.8 }}
                                    className="absolute -bottom-4 -right-4 bg-white rounded-2xl p-4 shadow-xl border border-gray-100"
                                >
                                    <div className="flex items-center gap-2">
                                        <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse" />
                                        <span className="text-sm font-semibold text-text-dark">Updated weekly</span>
                                    </div>
                                </motion.div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Feature list - spans 5 columns */}
                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="lg:col-span-5 space-y-8 flex flex-col justify-center"
                    >
                        {benefits.map((feature, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, x: 20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.1 * i, duration: 0.5 }}
                                className="flex gap-4 items-start group"
                            >
                                <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br from-secondary to-secondary/80 flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                                    <feature.icon className="w-5 h-5 text-white" strokeWidth={2.5} />
                                </div>
                                <div>
                                    <p className="text-xl md:text-2xl font-semibold text-text-dark mb-1 group-hover:text-primary transition-colors">
                                        {feature.title}
                                    </p>
                                    <p className="text-lg md:text-xl text-text-secondary">
                                        {feature.desc}
                                    </p>
                                </div>
                            </motion.div>
                        ))}

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.6 }}
                            className="pt-8 relative"
                        >
                            <div className="absolute -inset-4 bg-gradient-to-r from-primary/5 via-secondary/5 to-accent/5 rounded-3xl blur-xl" />
                            <div className="relative bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-large border border-gray-100">
                                <p className="text-2xl md:text-3xl text-text-dark font-medium leading-relaxed">
                                    No more guessing. No more guilt.
                                    <span className="block mt-3 text-primary font-bold">Just consistent, joyful Islamic education.</span>
                                </p>
                            </div>
                        </motion.div>
                    </motion.div>
                </div>

                {/* Trust indicators */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.4 }}
                    className="grid sm:grid-cols-3 gap-6 md:gap-8"
                >
                    {[
                        { icon: Users, stat: "150+", label: "Families waiting" },
                        { icon: BookOpen, stat: "50+", label: "Lesson plans ready" },
                        { icon: ShieldCheck, stat: "100%", label: "Scholar verified" }
                    ].map((item, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.5 + (i * 0.1) }}
                            className="bg-white rounded-3xl p-8 text-center shadow-card hover:shadow-xl border border-gray-100 transition-all duration-300 hover:-translate-y-2"
                        >
                            <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center mb-4">
                                <item.icon className="w-8 h-8 text-white" strokeWidth={2} />
                            </div>
                            <div className="text-4xl md:text-5xl font-bold text-text-dark mb-2">{item.stat}</div>
                            <div className="text-lg text-text-secondary">{item.label}</div>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}

