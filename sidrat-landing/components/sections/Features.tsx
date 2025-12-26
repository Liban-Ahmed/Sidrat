"use client";

import React from "react";
import { motion } from "framer-motion";
import { BookOpen, Clock, TrendingUp, ShieldCheck, MessageCircle, Smartphone, Gamepad2, Award, Ban, Calendar } from "lucide-react";
import { AnimatedGradientText } from "@/components/effects";

// Features for Kids (In-App)
const kidFeatures = [
    {
        icon: Gamepad2,
        title: "Daily Lessons",
        description: "5-minute interactive games, stories, and quizzes that make learning feel like play.",
        gradient: "from-primary to-primary/80",
    },
    {
        icon: BookOpen,
        title: "Friendly Characters",
        description: "Guides that make learning engaging and fun—designed specifically for ages 5-7.",
        gradient: "from-secondary to-secondary/80",
    },
    {
        icon: Award,
        title: "Streaks & Badges",
        description: "Rewards that keep them coming back, building a habit of Islamic learning.",
        gradient: "from-accent to-accent/80",
    },
    {
        icon: Smartphone,
        title: "Voice & Visuals",
        description: "Designed for kids who can't read yet—audio narration and visual learning.",
        gradient: "from-primary to-primary/80",
    },
];

// Features for Parents
const parentFeatures = [
    {
        icon: Calendar,
        title: "Weekly Family Activity",
        description: "A simple 15-minute activity based on what they learned in the app.",
        gradient: "from-secondary to-secondary/80",
    },
    {
        icon: TrendingUp,
        title: "Progress Dashboard",
        description: "See exactly what they've learned and mastered—no guessing.",
        gradient: "from-primary to-primary/80",
    },
    {
        icon: MessageCircle,
        title: "Conversation Prompts",
        description: "Know what to ask at dinner or bedtime to reinforce learning.",
        gradient: "from-accent to-accent/80",
    },
    {
        icon: Clock,
        title: "No Prep Required",
        description: "Everything explained step-by-step. Just open and go.",
        gradient: "from-secondary to-secondary/80",
    },
];

// Shared features
const sharedFeatures = [
    {
        icon: ShieldCheck,
        title: "Scholar-Reviewed Content",
        description: "Accurate and age-appropriate Islamic education you can trust.",
        gradient: "from-primary to-primary/80",
    },
    {
        icon: Ban,
        title: "Safe & Ad-Free",
        description: "No ads, no in-app purchases. Just pure, safe learning.",
        gradient: "from-secondary to-secondary/80",
    },
    {
        icon: Smartphone,
        title: "Works on Your Schedule",
        description: "Catch up anytime. Flexible learning that fits your family's life.",
        gradient: "from-accent to-accent/80",
    },
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
            className="group relative bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-6 md:p-8 border border-gray-100 hover:border-primary/30 transition-all duration-500 hover:shadow-xl overflow-hidden"
        >
            <div className="relative z-10">
                <div className={`w-12 sm:w-14 md:w-16 h-12 sm:h-14 md:h-16 rounded-xl sm:rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-4 sm:mb-6 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500`}>
                    <feature.icon className="w-6 sm:w-7 md:w-8 h-6 sm:h-7 md:h-8 text-white" strokeWidth={2} />
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-text-dark mb-2 sm:mb-3 font-heading">
                    {feature.title}
                </h3>
                <p className="text-sm sm:text-base md:text-lg text-text-secondary leading-relaxed">
                    {feature.description}
                </p>
            </div>
        </motion.div>
    );

    return (
        <section id="features" className="py-20 sm:py-24 md:py-32 lg:py-40 bg-gradient-to-b from-gray-50 to-white relative overflow-hidden">
            <div className="container mx-auto px-4 sm:px-6 md:px-8 lg:px-20 xl:px-40 max-w-[1400px]">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-12 sm:mb-16 md:mb-20 space-y-4 sm:space-y-6"
                >
                    <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold font-heading text-text-dark">
                        <AnimatedGradientText>
                            The best of both worlds
                        </AnimatedGradientText>
                    </h2>
                </motion.div>

                {/* For Kids Section */}
                <div className="mb-20">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="flex items-center gap-4 mb-10"
                    >
                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center">
                            <Gamepad2 className="w-7 h-7 text-white" strokeWidth={2} />
                        </div>
                        <div>
                            <h3 className="text-2xl md:text-3xl font-bold text-text-dark">For Kids</h3>
                            <p className="text-lg text-text-secondary">In-App Learning</p>
                        </div>
                    </motion.div>
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-100px" }}
                        className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6"
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
                    className="flex items-center justify-center mb-20"
                >
                    <div className="relative bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10 rounded-full px-8 py-4 border border-primary/20">
                        <div className="flex items-center gap-4">
                            <span className="text-lg font-semibold text-primary">App Learning</span>
                            <div className="w-12 h-0.5 bg-gradient-to-r from-primary to-secondary" />
                            <span className="text-xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">+</span>
                            <div className="w-12 h-0.5 bg-gradient-to-r from-secondary to-accent" />
                            <span className="text-lg font-semibold text-secondary">Family Time</span>
                        </div>
                    </div>
                </motion.div>

                {/* For Parents Section */}
                <div className="mb-20">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="flex items-center gap-4 mb-10"
                    >
                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-secondary to-secondary/80 flex items-center justify-center">
                            <TrendingUp className="w-7 h-7 text-white" strokeWidth={2} />
                        </div>
                        <div>
                            <h3 className="text-2xl md:text-3xl font-bold text-text-dark">For Parents</h3>
                            <p className="text-lg text-text-secondary">Dashboard + Activities</p>
                        </div>
                    </motion.div>
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-100px" }}
                        className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6"
                    >
                        {parentFeatures.map((feature) => (
                            <FeatureCard key={feature.title} feature={feature} />
                        ))}
                    </motion.div>
                </div>

                {/* Shared Features */}
                <div>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="flex items-center gap-4 mb-10"
                    >
                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-accent to-accent/80 flex items-center justify-center">
                            <ShieldCheck className="w-7 h-7 text-white" strokeWidth={2} />
                        </div>
                        <div>
                            <h3 className="text-2xl md:text-3xl font-bold text-text-dark">Shared</h3>
                            <p className="text-lg text-text-secondary">For the whole family</p>
                        </div>
                    </motion.div>
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-100px" }}
                        className="grid sm:grid-cols-3 gap-6"
                    >
                        {sharedFeatures.map((feature) => (
                            <FeatureCard key={feature.title} feature={feature} />
                        ))}
                    </motion.div>
                </div>
            </div>
        </section>
    );
}

