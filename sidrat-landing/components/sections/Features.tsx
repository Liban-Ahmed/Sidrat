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
                ease: [0.22, 1, 0.36, 1]
            }
        }
    };

    const FeatureCard = ({ feature }: { feature: typeof kidFeatures[0] }) => (
        <motion.div
            variants={itemVariants}
            className="group relative bg-white rounded-3xl p-8 border border-gray-100 hover:border-primary/30 transition-all duration-500 hover:shadow-xl overflow-hidden"
        >
            <div className="relative z-10">
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500`}>
                    <feature.icon className="w-8 h-8 text-white" strokeWidth={2} />
                </div>
                <h3 className="text-xl font-bold text-text-dark mb-3 font-heading">
                    {feature.title}
                </h3>
                <p className="text-lg text-text-secondary leading-relaxed">
                    {feature.description}
                </p>
            </div>
        </motion.div>
    );

    return (
        <section id="features" className="py-32 md:py-40 bg-gradient-to-b from-gray-50 to-white relative overflow-hidden">
            <div className="container mx-auto px-6 sm:px-8 md:px-12 lg:px-20 xl:px-40 max-w-[1400px]">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-20 space-y-6"
                >
                    <h2 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold font-heading text-text-dark">
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

