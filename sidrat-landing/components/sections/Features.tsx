"use client";

import React from "react";
import { motion } from "framer-motion";
import {
    Book,
    Clock,
    Target,
    CheckCircle,
    MessageCircle,
    Smartphone,
} from "lucide-react";
import { FeatureCard } from "@/components/ui/FeatureCard";

const features = [
    {
        icon: <Book className="w-12 h-12" />,
        title: "Age-Based Curriculum",
        description:
            "Personalized lessons for ages 2-14. Your 5-year-old gets Prophet stories, your 12-year-old gets deeper discussions on identity and faith.",
    },
    {
        icon: <Clock className="w-12 h-12" />,
        title: "Just 15 Minutes a Week",
        description:
            "Busy parent-friendly. One focused lesson with activities takes less time than scrolling Instagram—but changes your child's life.",
    },
    {
        icon: <Target className="w-12 h-12" />,
        title: "Progress Tracking",
        description:
            'See what you\'ve covered, what\'s next, and celebrate milestones. Never wonder "did I teach them about Ramadan yet?"',
    },
    {
        icon: <CheckCircle className="w-12 h-12" />,
        title: "Scholar-Reviewed Content",
        description:
            "Every lesson reviewed by Islamic education experts. Teach with confidence knowing the content is authentic and appropriate.",
    },
    {
        icon: <MessageCircle className="w-12 h-12" />,
        title: "Conversation Starters",
        description:
            'No more "ummm..." moments. Get prompts like "Ask your child: what makes someone a good friend in Islam?"',
    },
    {
        icon: <Smartphone className="w-12 h-12" />,
        title: "Works on Your Schedule",
        description:
            "Morning? Bedtime? Car rides? Access lessons anytime, anywhere. Download activities to use offline.",
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

export function Features() {
    return (
        <section className="py-16 md:py-24 bg-white">
            <div className="container mx-auto max-w-container px-5 md:px-8 lg:px-12">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="text-center mb-12 md:mb-16"
                >
                    <h2 className="font-heading font-semibold text-h2-mobile md:text-h2-desktop text-text-dark">
                        Everything you need to raise confident Muslim children
                    </h2>
                </motion.div>

                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
                >
                    {features.map((feature) => (
                        <FeatureCard
                            key={feature.title}
                            icon={feature.icon}
                            title={feature.title}
                            description={feature.description}
                        />
                    ))}
                </motion.div>
            </div>
        </section>
    );
}
