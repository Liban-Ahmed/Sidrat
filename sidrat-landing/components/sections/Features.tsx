"use client";

import React from "react";
import { motion } from "framer-motion";
import { Clock, TrendingUp, ShieldCheck, Smartphone, Gamepad2, Award, Ban, Calendar } from "lucide-react";
import { AnimatedGradientText } from "@/components/effects";

// Features for Kids (In-App) - Consolidated
const kidFeatures = [
    {
        icon: Gamepad2,
        title: "5-Min Daily Lessons",
        description: "Interactive games, stories & quizzes designed for ages 5-7",
        gradient: "from-primary to-primary/80",
    },
    {
        icon: Award,
        title: "Streaks & Rewards",
        description: "Badges and streaks that build lasting learning habits",
        gradient: "from-secondary to-secondary/80",
    },
    {
        icon: Smartphone,
        title: "No Reading Required",
        description: "Audio narration and visual learning for pre-readers",
        gradient: "from-accent to-accent/80",
    },
];

// Features for Parents - Consolidated
const parentFeatures = [
    {
        icon: Calendar,
        title: "Weekly Family Activity",
        description: "15-min guided activities based on what they learned",
        gradient: "from-secondary to-secondary/80",
    },
    {
        icon: TrendingUp,
        title: "Progress Dashboard",
        description: "See exactly what they've learned and mastered",
        gradient: "from-primary to-primary/80",
    },
    {
        icon: Clock,
        title: "Zero Prep Required",
        description: "Everything explained step-by-step. Just open and go.",
        gradient: "from-accent to-accent/80",
    },
];

// Shared features - as simple badges
const sharedFeatures = [
    { icon: ShieldCheck, label: "Scholar-Reviewed" },
    { icon: Ban, label: "Ad-Free & Safe" },
    { icon: Smartphone, label: "Flexible Schedule" },
];

export function Features() {
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.6,
                ease: "easeOut" as const
            }
        }
    };

    const FeatureCard = ({ feature }: { feature: typeof kidFeatures[0] }) => (
        <motion.div
            variants={itemVariants}
            className="group relative bg-white rounded-xl sm:rounded-2xl p-4 sm:p-5 border border-gray-100 hover:border-primary/30 transition-all duration-300 hover:shadow-lg overflow-hidden"
        >
            <div className="relative z-10">
                <div className={`w-10 h-10 sm:w-11 sm:h-11 rounded-lg sm:rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-3 group-hover:scale-105 transition-transform duration-300`}>
                    <feature.icon className="w-5 h-5 sm:w-5.5 sm:h-5.5 text-white" strokeWidth={2} />
                </div>
                <h3 className="text-sm sm:text-base font-bold text-text-dark mb-1 sm:mb-1.5 font-heading">
                    {feature.title}
                </h3>
                <p className="text-xs sm:text-sm text-text-secondary leading-relaxed">
                    {feature.description}
                </p>
            </div>
        </motion.div>
    );

    return (
        <section id="features" className="py-12 sm:py-16 md:py-20 bg-gradient-to-b from-gray-50 to-white relative overflow-hidden">
            <div className="container mx-auto px-4 sm:px-6 md:px-8 lg:px-16 xl:px-24 max-w-[1100px]">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-8 sm:mb-10 md:mb-12 space-y-3 sm:space-y-4"
                >
                    <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold font-heading text-text-dark">
                        <AnimatedGradientText>
                            The best of both worlds
                        </AnimatedGradientText>
                    </h2>
                </motion.div>

                {/* For Kids Section */}
                <div className="mb-10 sm:mb-12">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="flex items-center gap-3 mb-5 sm:mb-6"
                    >
                        <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center">
                            <Gamepad2 className="w-5 h-5 sm:w-5.5 sm:h-5.5 text-white" strokeWidth={2} />
                        </div>
                        <div>
                            <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-text-dark">For Kids</h3>
                            <p className="text-sm sm:text-base text-text-secondary">In-App Learning</p>
                        </div>
                    </motion.div>
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-50px" }}
                        className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4"
                    >
                        {kidFeatures.map((feature) => (
                            <FeatureCard key={feature.title} feature={feature} />
                        ))}
                    </motion.div>
                </div>

                {/* Visual connector */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    className="flex items-center justify-center mb-6 sm:mb-8"
                >
                    <div className="relative bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10 rounded-full px-4 sm:px-6 py-2 sm:py-3 border border-primary/20">
                        <div className="flex items-center gap-2 sm:gap-3">
                            <span className="text-xs sm:text-sm font-semibold text-primary">App Learning</span>
                            <div className="w-6 sm:w-8 h-0.5 bg-gradient-to-r from-primary to-secondary" />
                            <span className="text-sm sm:text-base font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">+</span>
                            <div className="w-6 sm:w-8 h-0.5 bg-gradient-to-r from-secondary to-accent" />
                            <span className="text-xs sm:text-sm font-semibold text-secondary">Family Time</span>
                        </div>
                    </div>
                </motion.div>

                {/* For Parents Section */}
                <div className="mb-10 sm:mb-12">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="flex items-center gap-3 mb-5 sm:mb-6"
                    >
                        <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-br from-secondary to-secondary/80 flex items-center justify-center">
                            <TrendingUp className="w-5 h-5 sm:w-5.5 sm:h-5.5 text-white" strokeWidth={2} />
                        </div>
                        <div>
                            <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-text-dark">For Parents</h3>
                            <p className="text-sm sm:text-base text-text-secondary">Dashboard + Activities</p>
                        </div>
                    </motion.div>
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-50px" }}
                        className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4"
                    >
                        {parentFeatures.map((feature) => (
                            <FeatureCard key={feature.title} feature={feature} />
                        ))}
                    </motion.div>
                </div>

                {/* Shared Features - Compact badges */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 pt-4 sm:pt-6 border-t border-gray-100"
                >
                    {sharedFeatures.map((feature, i) => (
                        <div
                            key={i}
                            className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-white border border-gray-200 shadow-sm"
                        >
                            <feature.icon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary" strokeWidth={2} />
                            <span className="text-xs sm:text-sm font-medium text-text-dark">{feature.label}</span>
                        </div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}

