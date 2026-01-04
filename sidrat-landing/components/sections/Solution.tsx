"use client";

import React from "react";
import { motion } from "framer-motion";
import { CheckCircle2, Users, BookOpen, ShieldCheck, Moon, Star, Sparkles, Gamepad2, Calendar, BarChart3 } from "lucide-react";

const benefits = [
    { icon: CheckCircle2, title: 'Kids learn independently', desc: 'through interactive app lessons' },
    { icon: CheckCircle2, title: 'Parents stay involved', desc: 'without any prep work' },
    { icon: CheckCircle2, title: 'Weekly family activities', desc: 'turn screen learning into real-world practice' },
    { icon: CheckCircle2, title: 'Progress tracking', desc: 'for both app lessons and family time' },
    { icon: CheckCircle2, title: 'Scholar-reviewed content', desc: 'throughout the entire experience' }
];

const rhythmSteps = [
    { icon: Gamepad2, label: "Monday–Friday", desc: "Your child completes bite-sized app lessons (5 min)", color: "from-primary to-primary/80" },
    { icon: Calendar, label: "Weekend", desc: "You receive a family activity tied to the week's lessons (15 min)", color: "from-secondary to-secondary/80" },
    { icon: BarChart3, label: "Always", desc: "Parent dashboard shows exactly what they've learned", color: "from-accent to-accent/80" },
];

export function Solution() {
    return (
        <section className="py-12 sm:py-16 md:py-20 bg-gradient-to-b from-white via-primary/5 to-white relative overflow-hidden">
            {/* Enhanced background decorations */}
            <div className="absolute inset-0">
                <div className="absolute top-1/4 right-4 sm:right-10 w-64 sm:w-96 h-64 sm:h-96 bg-primary/10 rounded-full blur-3xl" />
                <div className="absolute bottom-1/4 left-4 sm:left-10 w-48 sm:w-80 h-48 sm:h-80 bg-secondary/10 rounded-full blur-3xl" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] sm:w-[600px] h-[350px] sm:h-[600px] bg-gradient-to-r from-primary/5 via-accent/5 to-secondary/5 rounded-full blur-3xl" />
            </div>

            <div className="container mx-auto px-4 sm:px-6 md:px-8 lg:px-16 xl:px-24 max-w-[1100px] relative z-10">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-8 sm:mb-10 md:mb-12 space-y-3 sm:space-y-4"
                >
                    <div className="inline-block px-3 sm:px-4 py-2 rounded-full bg-gradient-to-r from-primary/10 to-secondary/10 border border-primary/20 mb-2 sm:mb-4">
                        <span className="text-xs font-semibold text-primary uppercase tracking-wide">THE SOLUTION</span>
                    </div>

                    <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold font-heading text-text-dark leading-tight">
                        Meet Sidrat—Where
                        <span className="block mt-1 bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                            App Learning Meets Family Teaching
                        </span>
                    </h2>

                    <p className="text-sm sm:text-base md:text-lg text-text-secondary max-w-2xl mx-auto leading-relaxed">
                        Your child spends 5 minutes a day learning through games and stories. Then once a week, you get a simple 15-minute activity to do together—reinforcing exactly what they learned. They build knowledge. You build connection.
                    </p>
                </motion.div>

                {/* How the rhythm works */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="mb-8 sm:mb-10 md:mb-12"
                >
                    <h3 className="text-base sm:text-lg md:text-xl font-bold text-center text-text-dark mb-4 sm:mb-6">How the rhythm works:</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                        {rhythmSteps.map((step, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.1 * i, duration: 0.5 }}
                                className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-5 shadow-card border border-gray-100 hover:shadow-lg transition-all duration-300"
                            >
                                <div className={`w-10 sm:w-11 md:w-12 h-10 sm:h-11 md:h-12 rounded-lg sm:rounded-xl bg-gradient-to-br ${step.color} flex items-center justify-center mb-3 sm:mb-4`}>
                                    <step.icon className="w-5 sm:w-5.5 md:w-6 h-5 sm:h-5.5 md:h-6 text-white" strokeWidth={2} />
                                </div>
                                <h4 className="text-sm sm:text-base font-bold text-text-dark mb-1.5 sm:mb-2">{step.label}</h4>
                                <p className="text-xs sm:text-sm text-text-secondary">{step.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>

                {/* Improved Bento grid layout */}
                <div className="grid lg:grid-cols-12 gap-4 sm:gap-6 lg:gap-8 mb-10 sm:mb-14 md:mb-16">
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
                            <div className="relative mx-auto max-w-[200px] sm:max-w-[280px] md:max-w-sm">
                                {/* Animated glow effect */}
                                <motion.div
                                    className="absolute inset-0 bg-gradient-to-br from-primary/30 to-secondary/30 rounded-[30px] sm:rounded-[45px] md:rounded-[60px] blur-2xl sm:blur-3xl"
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
                                <div className="relative bg-gradient-to-br from-gray-900 to-gray-800 rounded-[30px] sm:rounded-[45px] md:rounded-[60px] p-2 sm:p-3 md:p-4 shadow-xl sm:shadow-2xl">
                                    {/* Screen */}
                                    <div className="bg-white rounded-[26px] sm:rounded-[40px] md:rounded-[52px] overflow-hidden aspect-[9/19.5]">
                                        {/* Status bar */}
                                        <div className="bg-gray-50 px-3 sm:px-5 md:px-8 py-1.5 sm:py-2 md:py-3 flex justify-between items-center border-b border-gray-100">
                                            <span className="text-[8px] sm:text-[10px] md:text-xs font-semibold text-gray-900">9:41</span>
                                            <div className="flex gap-0.5 sm:gap-1">
                                                <div className="w-2 sm:w-3 md:w-4 h-1.5 sm:h-2 md:h-3 bg-gray-900 rounded-sm" />
                                                <div className="w-2 sm:w-3 md:w-4 h-1.5 sm:h-2 md:h-3 bg-gray-900 rounded-sm" />
                                                <div className="w-2 sm:w-3 md:w-4 h-1.5 sm:h-2 md:h-3 bg-gray-900 rounded-sm" />
                                            </div>
                                        </div>

                                        {/* App content preview */}
                                        <div className="p-3 sm:p-4 md:p-6 space-y-3 sm:space-y-4 md:space-y-6 bg-gradient-to-b from-white to-gray-50">
                                            {/* Header section */}
                                            <motion.div
                                                initial={{ opacity: 0, y: 10 }}
                                                whileInView={{ opacity: 1, y: 0 }}
                                                viewport={{ once: true }}
                                                transition={{ delay: 0.3 }}
                                                className="flex items-center gap-2 sm:gap-3 md:gap-4"
                                            >
                                                <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-14 md:h-14 rounded-lg sm:rounded-xl md:rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-md sm:shadow-lg">
                                                    <Moon className="w-4 h-4 sm:w-5 sm:h-5 md:w-7 md:h-7 text-white" fill="currentColor" />
                                                </div>
                                                <div className="flex-1">
                                                    <div className="h-2 sm:h-3 md:h-4 bg-gradient-to-r from-gray-300 to-gray-200 rounded-md sm:rounded-lg w-16 sm:w-24 md:w-32 mb-1 sm:mb-2" />
                                                    <div className="h-1.5 sm:h-2 md:h-3 bg-gradient-to-r from-gray-200 to-gray-100 rounded w-12 sm:w-18 md:w-24" />
                                                </div>
                                            </motion.div>

                                            {/* Featured lesson card */}
                                            <motion.div
                                                initial={{ opacity: 0, scale: 0.95 }}
                                                whileInView={{ opacity: 1, scale: 1 }}
                                                viewport={{ once: true }}
                                                transition={{ delay: 0.4 }}
                                                className="bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10 rounded-xl sm:rounded-2xl md:rounded-3xl p-3 sm:p-4 md:p-6 border border-primary/20 shadow-md sm:shadow-lg"
                                            >
                                                <div className="flex items-start gap-2 sm:gap-3 mb-2 sm:mb-3 md:mb-4">
                                                    <div className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 rounded-md sm:rounded-lg md:rounded-xl bg-gradient-to-br from-accent to-accent/80 flex items-center justify-center">
                                                        <Star className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 text-white" fill="currentColor" />
                                                    </div>
                                                    <div className="flex-1">
                                                        <div className="h-2 sm:h-3 md:h-4 bg-white/60 rounded-md sm:rounded-lg w-3/4 mb-1 sm:mb-2" />
                                                        <div className="h-1.5 sm:h-2 md:h-3 bg-white/40 rounded w-1/2" />
                                                    </div>
                                                </div>
                                                <div className="space-y-1 sm:space-y-2">
                                                    <div className="h-1.5 sm:h-2 md:h-3 bg-white/50 rounded-md sm:rounded-lg w-full" />
                                                    <div className="h-1.5 sm:h-2 md:h-3 bg-white/40 rounded-md sm:rounded-lg w-5/6" />
                                                </div>
                                            </motion.div>

                                            {/* Lesson list */}
                                            <div className="space-y-2 sm:space-y-3">
                                                <motion.div
                                                    initial={{ opacity: 0, x: -10 }}
                                                    whileInView={{ opacity: 1, x: 0 }}
                                                    viewport={{ once: true }}
                                                    transition={{ delay: 0.5 }}
                                                    className="flex items-center gap-2 sm:gap-3 bg-white rounded-lg sm:rounded-xl md:rounded-2xl p-2 sm:p-3 md:p-4 shadow-card border border-gray-100 hover:shadow-lg transition-shadow"
                                                >
                                                    <div className="w-7 h-7 sm:w-9 sm:h-9 md:w-12 md:h-12 rounded-md sm:rounded-lg md:rounded-xl bg-gradient-to-br from-accent to-accent/80 flex items-center justify-center text-sm sm:text-lg md:text-2xl shadow-sm sm:shadow-md">
                                                        📖
                                                    </div>
                                                    <div className="flex-1">
                                                        <div className="h-1.5 sm:h-2 md:h-3 bg-gradient-to-r from-gray-300 to-gray-200 rounded-md sm:rounded-lg w-full mb-1 sm:mb-2" />
                                                        <div className="h-1 sm:h-1.5 md:h-2 bg-gradient-to-r from-gray-200 to-gray-100 rounded w-3/4" />
                                                    </div>
                                                    <div className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 rounded-md sm:rounded-lg bg-secondary/10 flex items-center justify-center">
                                                        <svg className="w-2.5 h-2.5 sm:w-3 sm:h-3 md:w-4 md:h-4 text-secondary" fill="currentColor" viewBox="0 0 20 20">
                                                            <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                                                        </svg>
                                                    </div>
                                                </motion.div>

                                                <motion.div
                                                    initial={{ opacity: 0, x: -10 }}
                                                    whileInView={{ opacity: 1, x: 0 }}
                                                    viewport={{ once: true }}
                                                    transition={{ delay: 0.6 }}
                                                    className="flex items-center gap-2 sm:gap-3 bg-white rounded-lg sm:rounded-xl md:rounded-2xl p-2 sm:p-3 md:p-4 shadow-card border border-gray-100 hover:shadow-lg transition-shadow"
                                                >
                                                    <div className="w-7 h-7 sm:w-9 sm:h-9 md:w-12 md:h-12 rounded-md sm:rounded-lg md:rounded-xl bg-gradient-to-br from-secondary to-secondary/80 flex items-center justify-center shadow-sm sm:shadow-md">
                                                        <Sparkles className="w-3.5 h-3.5 sm:w-4.5 sm:h-4.5 md:w-6 md:h-6 text-white" />
                                                    </div>
                                                    <div className="flex-1">
                                                        <div className="h-1.5 sm:h-2 md:h-3 bg-gradient-to-r from-gray-300 to-gray-200 rounded-md sm:rounded-lg w-full mb-1 sm:mb-2" />
                                                        <div className="h-1 sm:h-1.5 md:h-2 bg-gradient-to-r from-gray-200 to-gray-100 rounded w-3/4" />
                                                    </div>
                                                    <div className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 rounded-md sm:rounded-lg bg-secondary/10 flex items-center justify-center">
                                                        <svg className="w-2.5 h-2.5 sm:w-3 sm:h-3 md:w-4 md:h-4 text-secondary" fill="currentColor" viewBox="0 0 20 20">
                                                            <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                                                        </svg>
                                                    </div>
                                                </motion.div>

                                                <motion.div
                                                    initial={{ opacity: 0, x: -10 }}
                                                    whileInView={{ opacity: 1, x: 0 }}
                                                    viewport={{ once: true }}
                                                    transition={{ delay: 0.7 }}
                                                    className="flex items-center gap-2 sm:gap-3 bg-white rounded-lg sm:rounded-xl md:rounded-2xl p-2 sm:p-3 md:p-4 shadow-card border border-gray-100 hover:shadow-lg transition-shadow"
                                                >
                                                    <div className="w-7 h-7 sm:w-9 sm:h-9 md:w-12 md:h-12 rounded-md sm:rounded-lg md:rounded-xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center text-sm sm:text-lg md:text-2xl shadow-sm sm:shadow-md">
                                                        🤲
                                                    </div>
                                                    <div className="flex-1">
                                                        <div className="h-1.5 sm:h-2 md:h-3 bg-gradient-to-r from-gray-300 to-gray-200 rounded-md sm:rounded-lg w-full mb-1 sm:mb-2" />
                                                        <div className="h-1 sm:h-1.5 md:h-2 bg-gradient-to-r from-gray-200 to-gray-100 rounded w-3/4" />
                                                    </div>
                                                    <div className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 rounded-md sm:rounded-lg bg-secondary/10 flex items-center justify-center">
                                                        <svg className="w-2.5 h-2.5 sm:w-3 sm:h-3 md:w-4 md:h-4 text-secondary" fill="currentColor" viewBox="0 0 20 20">
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
                                    className="absolute -bottom-2 sm:-bottom-3 md:-bottom-4 -right-2 sm:-right-3 md:-right-4 bg-white rounded-lg sm:rounded-xl md:rounded-2xl p-2 sm:p-3 md:p-4 shadow-lg sm:shadow-xl border border-gray-100"
                                >
                                    <div className="flex items-center gap-1.5 sm:gap-2">
                                        <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 md:w-3 md:h-3 rounded-full bg-green-500 animate-pulse" />
                                        <span className="text-[10px] sm:text-xs md:text-sm font-semibold text-text-dark">Updated weekly</span>
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
                            <div className="relative bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-large border border-gray-100">
                                <p className="text-2xl md:text-3xl text-text-dark font-medium leading-relaxed">
                                    No more guessing. No more guilt.
                                    <span className="block mt-3 text-primary font-bold">They learn. You connect. Together.</span>
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
                    className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4"
                >
                    {[
                        { icon: Users, stat: "150+", label: "Families waiting" },
                        { icon: BookOpen, stat: "50+", label: "App lessons" },
                        { icon: Calendar, stat: "12", label: "Family activities" },
                        { icon: ShieldCheck, stat: "100%", label: "Scholar reviewed" }
                    ].map((item, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.5 + (i * 0.1) }}
                            className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-5 text-center shadow-card hover:shadow-lg border border-gray-100 transition-all duration-300"
                        >
                            <div className="w-10 h-10 sm:w-11 sm:h-11 mx-auto rounded-lg sm:rounded-xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center mb-2 sm:mb-3">
                                <item.icon className="w-5 h-5 sm:w-5.5 sm:h-5.5 text-white" strokeWidth={2} />
                            </div>
                            <div className="text-xl sm:text-2xl md:text-3xl font-bold text-text-dark mb-0.5 sm:mb-1">{item.stat}</div>
                            <div className="text-xs sm:text-sm text-text-secondary">{item.label}</div>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}

