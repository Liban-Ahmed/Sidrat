"use client";

import React from "react";
import { motion } from "framer-motion";
import { Frown, HelpCircle, CloudRain, Smartphone, AlertTriangle, Users, Clock } from "lucide-react";

const painPoints = [
    {
        icon: Frown,
        title: "App-Only Feels Hollow",
        description: "You want them to learn, but not from a screen alone. Yet Islamic apps feel disconnected from your family's values.",
        stat: "Screen guilt",
        statDesc: "is real"
    },
    {
        icon: HelpCircle,
        title: "DIY Teaching Is Exhausting",
        description: "You're not a curriculum designer, and life is busy. Finding, planning, and executing lessons takes hours you don't have.",
        stat: "No time",
        statDesc: "for prep work"
    },
    {
        icon: CloudRain,
        title: "Nothing Sticks",
        description: "They watch Islamic videos but can't tell you what they learned. Information goes in one ear and out the other.",
        stat: "Zero",
        statDesc: "retention"
    },
    {
        icon: Smartphone,
        title: "You're Disconnected",
        description: "When they do use learning apps, you have no idea what's happening. You're left out of their Islamic education journey.",
        stat: "No visibility",
        statDesc: "into progress"
    },
];

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
        },
    },
};

const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.6, ease: "easeOut" as const },
    },
};

export function Problem() {
    return (
        <section className="py-12 sm:py-16 md:py-20 bg-gradient-to-b from-white via-gray-50/50 to-white relative overflow-hidden">
            {/* Enhanced background decorations */}
            <div className="absolute inset-0">
                <div className="absolute top-1/4 left-4 sm:left-10 w-48 sm:w-72 h-48 sm:h-72 bg-red-500/5 rounded-full blur-3xl" />
                <div className="absolute bottom-1/4 right-4 sm:right-10 w-64 sm:w-96 h-64 sm:h-96 bg-primary/5 rounded-full blur-3xl" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] sm:w-[500px] h-[300px] sm:h-[500px] bg-gradient-to-r from-red-500/5 via-transparent to-primary/5 rounded-full blur-3xl" />
            </div>

            <div className="container mx-auto px-4 sm:px-6 md:px-8 lg:px-16 xl:px-24 max-w-[1100px] relative z-10">
                {/* Section header with quote */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-6 sm:mb-8 md:mb-10 space-y-3 sm:space-y-4"
                >
                    {/* Quote bubble */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2, duration: 0.5 }}
                        className="inline-block"
                    >
                        <div className="bg-white/80 backdrop-blur-sm rounded-xl sm:rounded-2xl p-3 sm:p-4 md:p-5 shadow-lg border border-gray-100 max-w-2xl mx-auto">
                            <p className="text-sm sm:text-base md:text-lg text-text-dark font-medium italic leading-relaxed">
                                "I either hand them a screen and feel guilty, or try to teach them myself and feel lost."
                            </p>
                            <p className="text-xs sm:text-sm text-text-secondary mt-2">— Every Muslim parent</p>
                        </div>
                    </motion.div>

                    <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold font-heading text-text-dark leading-tight">
                        You&apos;re not alone in this
                        <span className="block mt-1 bg-gradient-to-r from-red-600 via-primary to-red-600 bg-clip-text text-transparent">
                            struggle
                        </span>
                    </h2>

                    <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/5 border border-primary/20">
                        <span className="text-xs font-medium text-primary">For parents of 5-7 year olds</span>
                    </div>

                    <p className="text-sm sm:text-base md:text-lg text-text-secondary max-w-2xl mx-auto leading-relaxed">
                        You love your children and want to raise them with strong Islamic values.
                        <span className="block mt-1 font-semibold text-text-dark">But between work, school runs, and daily chaos...</span>
                    </p>
                </motion.div>

                {/* Subheading */}
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-6 sm:mb-8"
                >
                    <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-red-50 border border-red-200">
                        <AlertTriangle className="w-4 h-4 text-red-600" strokeWidth={2.5} />
                        <span className="text-sm font-semibold text-red-700">The reality hits hard:</span>
                    </div>
                </motion.div>

                {/* Pain point cards - Single column on mobile, 2 columns on tablet+ */}
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-50px" }}
                    className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 md:gap-5 mb-8 sm:mb-10"
                >
                    {painPoints.map((point) => (
                        <motion.div key={point.title} variants={itemVariants}>
                            <div className="group relative bg-white rounded-xl sm:rounded-2xl p-4 sm:p-5 md:p-6 border border-gray-200 hover:border-red-300 transition-all duration-300 hover:shadow-lg h-full">
                                {/* Accent bar */}
                                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-12 bg-gradient-to-b from-red-500 to-red-600 rounded-r-full group-hover:h-16 transition-all duration-500" />

                                <div className="pl-4 relative z-10">
                                    {/* Icon */}
                                    <div className="w-10 h-10 sm:w-11 sm:h-11 md:w-12 md:h-12 rounded-xl bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform duration-300 shadow-sm">
                                        <point.icon className="w-5 h-5 sm:w-5.5 sm:h-5.5 text-white" strokeWidth={2} />
                                    </div>

                                    {/* Title */}
                                    <h3 className="text-base sm:text-lg md:text-xl font-bold text-text-dark mb-2 group-hover:text-red-700 transition-colors leading-tight">
                                        {point.title}
                                    </h3>

                                    {/* Description */}
                                    <p className="text-sm sm:text-base text-text-secondary leading-relaxed mb-3">
                                        {point.description}
                                    </p>

                                    {/* Stat badge */}
                                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-gradient-to-br from-red-50 to-red-100/50 border border-red-200/50">
                                        <span className="text-sm font-bold text-red-700">{point.stat}</span>
                                        <span className="text-xs text-red-600">{point.statDesc}</span>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>

                {/* Emotional statement with visual emphasis */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3, duration: 0.6 }}
                    className="text-center space-y-4 sm:space-y-5"
                >
                    {/* Main statement */}
                    <div className="relative inline-block">
                        <div className="absolute -inset-2 sm:-inset-3 bg-gradient-to-r from-primary/10 via-secondary/10 to-primary/10 rounded-xl sm:rounded-2xl blur-xl" />
                        <div className="relative bg-white/90 backdrop-blur-sm rounded-lg sm:rounded-xl p-4 sm:p-5 md:p-6 shadow-lg border border-gray-100">
                            <p className="text-sm sm:text-base md:text-lg lg:text-xl text-text-dark max-w-2xl mx-auto leading-relaxed font-medium">
                                What if they could learn independently AND you could be part of the journey?
                            </p>
                        </div>
                    </div>

                    {/* Additional context */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.5, duration: 0.6 }}
                        className="flex flex-row items-center justify-center gap-2 sm:gap-4 pt-2 sm:pt-4"
                    >
                        <div className="flex items-center gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg sm:rounded-xl bg-primary/5 border border-primary/20">
                            <div className="w-7 h-7 sm:w-9 sm:h-9 rounded-md sm:rounded-lg bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center">
                                <Users className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" strokeWidth={2} />
                            </div>
                            <div className="text-left">
                                <div className="text-sm sm:text-base font-bold text-text-dark">150+</div>
                                <div className="text-[10px] sm:text-xs text-text-secondary">families waiting</div>
                            </div>
                        </div>

                        <div className="flex items-center gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg sm:rounded-xl bg-secondary/5 border border-secondary/20">
                            <div className="w-7 h-7 sm:w-9 sm:h-9 rounded-md sm:rounded-lg bg-gradient-to-br from-secondary to-secondary/80 flex items-center justify-center">
                                <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" strokeWidth={2} />
                            </div>
                            <div className="text-left">
                                <div className="text-sm sm:text-base font-bold text-text-dark">5 min/day</div>
                                <div className="text-[10px] sm:text-xs text-text-secondary">+ 15 min/week</div>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            </div>
        </section>
    );
}

