"use client";

import React from "react";
import { motion } from "framer-motion";
import { Frown, HelpCircle, CloudRain, Smartphone, AlertTriangle, Users, Clock } from "lucide-react";

const painPoints = [
    {
        icon: Frown,
        title: "Random Teaching",
        description: "You teach Islamic concepts randomly, whenever you remember. No structure, no plan—just guilt when weeks pass by.",
        stat: "73% of parents",
        statDesc: "feel unprepared"
    },
    {
        icon: HelpCircle,
        title: "Age Confusion",
        description: "Should your 5-year-old learn about Jannah? Is your 10-year-old too young for Seerah? You're constantly second-guessing.",
        stat: "Every parent",
        statDesc: "asks this"
    },
    {
        icon: CloudRain,
        title: "The Guilt",
        description: "Sunday rolls around again. You promised yourself you'd start teaching regularly. But you didn't. Again.",
        stat: "2 weeks",
        statDesc: "average gap"
    },
    {
        icon: Smartphone,
        title: "Lost to Screens",
        description: "Your kids know every TikTok trend but can't name the 5 pillars. YouTube teaches them more than you do.",
        stat: "4+ hours",
        statDesc: "screen time daily"
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
        transition: { duration: 0.6, ease: "easeOut" },
    },
};

export function Problem() {
    return (
        <section className="py-32 md:py-40 bg-gradient-to-b from-white via-gray-50/50 to-white relative overflow-hidden">
            {/* Enhanced background decorations */}
            <div className="absolute inset-0">
                <div className="absolute top-1/4 left-10 w-72 h-72 bg-red-500/5 rounded-full blur-3xl" />
                <div className="absolute bottom-1/4 right-10 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-r from-red-500/5 via-transparent to-primary/5 rounded-full blur-3xl" />
            </div>

            <div className="container mx-auto px-6 sm:px-8 md:px-12 lg:px-20 xl:px-40 max-w-[1400px] relative z-10">
                {/* Section header with quote */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-20 space-y-8"
                >
                    {/* Quote bubble */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2, duration: 0.5 }}
                        className="inline-block"
                    >
                        <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-large border border-gray-100 max-w-3xl mx-auto">
                            <p className="text-2xl md:text-3xl text-text-dark font-medium italic leading-relaxed">
                                "I want to raise my kids with strong Islamic values... but I have no idea where to start."
                            </p>
                            <p className="text-lg text-text-secondary mt-4">— Every Muslim parent</p>
                        </div>
                    </motion.div>

                    <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold font-heading text-text-dark leading-tight">
                        You&apos;re not alone in this
                        <span className="block mt-2 bg-gradient-to-r from-red-600 via-primary to-red-600 bg-clip-text text-transparent">
                            struggle
                        </span>
                    </h2>

                    <p className="text-xl md:text-2xl text-text-secondary max-w-4xl mx-auto leading-relaxed">
                        You love your children and want to raise them with strong Islamic values.
                        <span className="block mt-2 font-semibold text-text-dark">But between work, school runs, and daily chaos...</span>
                    </p>
                </motion.div>

                {/* Subheading */}
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-16"
                >
                    <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-red-50 border border-red-200">
                        <AlertTriangle className="w-6 h-6 text-red-600" strokeWidth={2.5} />
                        <span className="text-lg font-semibold text-red-700">The reality hits hard:</span>
                    </div>
                </motion.div>

                {/* Pain point cards - Enhanced 2x2 grid */}
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                    className="grid sm:grid-cols-2 gap-6 md:gap-8 mb-20"
                >
                    {painPoints.map((point, index) => (
                        <motion.div key={point.title} variants={itemVariants}>
                            <div className="group relative bg-white rounded-3xl p-8 md:p-10 border border-gray-200 hover:border-red-300 transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 h-full">
                                {/* Accent bar */}
                                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-20 bg-gradient-to-b from-red-500 to-red-600 rounded-r-full group-hover:h-32 transition-all duration-500" />

                                {/* Corner accent */}
                                <div className="absolute top-6 right-6 w-12 h-12 rounded-full bg-red-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 group-hover:scale-110">
                                    <AlertTriangle className="w-5 h-5 text-red-600" strokeWidth={2.5} />
                                </div>

                                <div className="pl-6 relative z-10">
                                    {/* Icon with animation */}
                                    <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500 shadow-lg">
                                        <point.icon className="w-8 h-8 md:w-10 md:h-10 text-white" strokeWidth={2} />
                                    </div>

                                    {/* Title */}
                                    <h3 className="text-2xl md:text-3xl font-bold text-text-dark mb-4 group-hover:text-red-700 transition-colors">
                                        {point.title}
                                    </h3>

                                    {/* Description */}
                                    <p className="text-lg md:text-xl text-text-secondary leading-relaxed mb-6">
                                        {point.description}
                                    </p>

                                    {/* Stat badge */}
                                    <div className="inline-flex flex-col gap-1 px-5 py-3 rounded-xl bg-gradient-to-br from-red-50 to-red-100/50 border border-red-200/50">
                                        <span className="text-xl md:text-2xl font-bold text-red-700">{point.stat}</span>
                                        <span className="text-sm text-red-600">{point.statDesc}</span>
                                    </div>
                                </div>

                                {/* Hover gradient overlay */}
                                <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 via-transparent to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl pointer-events-none" />
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
                    className="text-center space-y-8"
                >
                    {/* Main statement */}
                    <div className="relative inline-block">
                        <div className="absolute -inset-4 bg-gradient-to-r from-primary/10 via-secondary/10 to-primary/10 rounded-3xl blur-xl" />
                        <div className="relative bg-white/90 backdrop-blur-sm rounded-3xl p-10 md:p-12 shadow-large border border-gray-100">
                            <p className="text-2xl md:text-3xl lg:text-4xl text-text-dark max-w-4xl mx-auto leading-relaxed font-medium">
                                Sound familiar? You&apos;re doing your best—but you know there&apos;s a
                                <span className="block mt-3 text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent animate-gradient">
                                    better way
                                </span>
                            </p>
                        </div>
                    </div>

                    {/* Additional context */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.5, duration: 0.6 }}
                        className="flex flex-col sm:flex-row items-center justify-center gap-6 md:gap-8 pt-6"
                    >
                        <div className="flex items-center gap-3 px-6 py-4 rounded-2xl bg-primary/5 border border-primary/20">
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center">
                                <Users className="w-6 h-6 text-white" strokeWidth={2} />
                            </div>
                            <div className="text-left">
                                <div className="text-2xl font-bold text-text-dark">150+</div>
                                <div className="text-sm text-text-secondary">families waiting</div>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 px-6 py-4 rounded-2xl bg-secondary/5 border border-secondary/20">
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-secondary to-secondary/80 flex items-center justify-center">
                                <Clock className="w-6 h-6 text-white" strokeWidth={2} />
                            </div>
                            <div className="text-left">
                                <div className="text-2xl font-bold text-text-dark">15 min</div>
                                <div className="text-sm text-text-secondary">per week needed</div>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            </div>
        </section>
    );
}

