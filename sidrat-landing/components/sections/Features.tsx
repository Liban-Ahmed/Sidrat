"use client";

import React from "react";
import { motion } from "framer-motion";
import { BookOpen, Clock, TrendingUp, ShieldCheck, MessageCircle, Smartphone } from "lucide-react";
import { AnimatedGradientText } from "@/components/effects";

const features = [
    {
        icon: BookOpen,
        title: "Age-Based Curriculum",
        description: "Personalized lessons for ages 2-14. Your 5-year-old gets Prophet stories, your 12-year-old gets deeper discussions on identity and faith.",
        gradient: "from-primary to-primary/80",
        span: "md:col-span-2"
    },
    {
        icon: Clock,
        title: "15 Minutes a Week",
        description: "Busy parent-friendly. One focused lesson with activities takes less time than scrolling Instagram.",
        gradient: "from-secondary to-secondary/80",
        span: "md:col-span-1"
    },
    {
        icon: TrendingUp,
        title: "Progress Tracking",
        description: "See what you've covered, what's next, and celebrate milestones.",
        gradient: "from-accent to-accent/80",
        span: "md:col-span-1"
    },
    {
        icon: ShieldCheck,
        title: "Scholar-Reviewed Content",
        description: "Every lesson reviewed by Islamic education experts. Teach with confidence knowing the content is authentic and appropriate.",
        gradient: "from-primary to-primary/80",
        span: "md:col-span-2"
    },
    {
        icon: MessageCircle,
        title: "Conversation Starters",
        description: 'No more "ummm..." moments. Get prompts like "Ask your child: what makes someone a good friend in Islam?"',
        gradient: "from-secondary to-secondary/80",
        span: "md:col-span-1"
    },
    {
        icon: Smartphone,
        title: "Works on Your Schedule",
        description: "Morning? Bedtime? Car rides? Access lessons anytime, anywhere. Download activities to use offline.",
        gradient: "from-accent to-accent/80",
        span: "md:col-span-1"
    }
];

export function Features() {
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.15,
                delayChildren: 0.2
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

    return (
        <section id="features" className="py-32 md:py-40 bg-gradient-to-b from-gray-50 to-white relative overflow-hidden">
            <div className="container mx-auto px-8 md:px-16 lg:px-40 max-w-7xl">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-24 space-y-6"
                >
                    <h2 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold font-heading text-text-dark">
                        Everything you need to
                        <AnimatedGradientText className="block mt-2">
                            raise confident Muslim children
                        </AnimatedGradientText>
                    </h2>
                </motion.div>

                {/* Bento grid with staggered animations - asymmetric layout */}
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                    className="grid grid-cols-1 md:grid-cols-3 gap-8"
                >
                    {features.map((feature, index) => (
                        <motion.div
                            key={feature.title}
                            variants={itemVariants}
                            className={`group relative bg-gradient-to-br from-white to-${feature.gradient.split(' ')[1].replace('to-', '')}/5 rounded-[40px] p-12 border border-gray-100 hover:border-${feature.gradient.split(' ')[1].replace('to-', '').replace('/80', '')}/30 transition-all duration-500 hover:shadow-large overflow-hidden ${feature.span}`}
                        >
                            {/* Animated gradient on hover */}
                            <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient.split(' ')[1].replace('to-', 'from-')}/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />

                            <div className="relative z-10">
                                {/* Animated icon */}
                                <div className={`w-20 h-20 rounded-3xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-8 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500`}>
                                    <feature.icon className="w-10 h-10 text-white" strokeWidth={2} />
                                </div>

                                <h3 className="text-3xl font-bold text-text-dark mb-4 font-heading">
                                    {feature.title}
                                </h3>

                                <p className="text-xl text-text-secondary leading-relaxed">
                                    {feature.description}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}

