"use client";

import React from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/Card";

const painPoints = [
    {
        emoji: "❌",
        title: "Random Teaching",
        description: "You teach Islamic concepts randomly, whenever you remember",
    },
    {
        emoji: "❌",
        title: "Age Confusion",
        description:
            "You're not sure what's appropriate for a 5-year-old vs. a 10-year-old",
    },
    {
        emoji: "❌",
        title: "Guilt",
        description:
            "You feel guilty when weeks go by without a proper Islamic lesson",
    },
    {
        emoji: "❌",
        title: "Lost Opportunity",
        description: "Your kids learn more from YouTube than from you",
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
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.5 },
    },
};

export function Problem() {
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
                    <h2 className="font-heading font-semibold text-h2-mobile md:text-h2-desktop text-text-dark mb-6">
                        You&apos;re not alone in this struggle
                    </h2>
                    <p className="text-lg text-text-secondary max-w-2xl mx-auto mb-6">
                        You love your children and want to raise them with strong Islamic
                        values. But between work, school runs, and daily chaos...
                    </p>
                    <p className="text-xl font-heading font-semibold text-text-dark">
                        The reality hits:
                    </p>
                </motion.div>

                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                    className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 max-w-4xl mx-auto mb-12"
                >
                    {painPoints.map((point) => (
                        <motion.div key={point.title} variants={itemVariants}>
                            <Card variant="bordered" className="h-full">
                                <div className="flex items-start gap-3">
                                    <span className="text-2xl" aria-hidden="true">
                                        {point.emoji}
                                    </span>
                                    <div>
                                        <h3 className="font-heading font-semibold text-lg text-text-dark mb-2">
                                            {point.title}
                                        </h3>
                                        <p className="text-text-secondary">{point.description}</p>
                                    </div>
                                </div>
                            </Card>
                        </motion.div>
                    ))}
                </motion.div>

                <motion.p
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.5, duration: 0.5 }}
                    className="text-center text-lg text-text-secondary italic max-w-2xl mx-auto"
                >
                    Sound familiar? You&apos;re doing your best—but you know there&apos;s
                    a better way.
                </motion.p>
            </div>
        </section>
    );
}
