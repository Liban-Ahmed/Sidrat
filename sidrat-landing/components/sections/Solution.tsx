"use client";

import React from "react";
import { motion } from "framer-motion";
import { Check } from "lucide-react";

const benefits = [
    "Clear lessons for ages 2-14 (not too basic, not too advanced)",
    "15-minute activities that actually engage kids",
    "Conversation prompts so you're never tongue-tied",
    "Progress tracking so you see their growth",
    "Scholar-reviewed content you can trust",
];

export function Solution() {
    return (
        <section className="py-16 md:py-24 bg-background">
            <div className="container mx-auto max-w-container px-5 md:px-8 lg:px-12">
                <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
                    {/* Phone Mockup */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="flex-1 flex justify-center"
                    >
                        <div className="relative">
                            {/* Phone frame */}
                            <div className="relative w-[280px] md:w-[300px] h-[560px] md:h-[600px] bg-text-dark rounded-[40px] p-3 shadow-phone">
                                {/* Phone inner bezel */}
                                <div className="relative w-full h-full bg-white rounded-[32px] overflow-hidden">
                                    {/* Phone notch */}
                                    <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-32 h-6 bg-text-dark rounded-b-2xl z-10" />

                                    {/* App interface placeholder */}
                                    <div className="w-full h-full bg-gradient-to-b from-primary/5 to-secondary/5 flex flex-col items-center justify-center p-6">
                                        <div className="text-4xl mb-4" aria-hidden="true">
                                            📱
                                        </div>
                                        <p className="text-text-dark font-heading font-semibold text-center">
                                            Sidrat App Interface
                                        </p>
                                        <p className="text-sm text-text-secondary text-center mt-2">
                                            Weekly lessons, activities & progress tracking
                                        </p>

                                        {/* Mini preview elements */}
                                        <div className="w-full mt-6 space-y-3">
                                            <div className="bg-white rounded-lg p-3 shadow-subtle">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-8 h-8 bg-primary/20 rounded-full" />
                                                    <div className="flex-1">
                                                        <div className="h-3 bg-gray-200 rounded w-3/4" />
                                                        <div className="h-2 bg-gray-100 rounded w-1/2 mt-1" />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="bg-white rounded-lg p-3 shadow-subtle">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-8 h-8 bg-secondary/20 rounded-full" />
                                                    <div className="flex-1">
                                                        <div className="h-3 bg-gray-200 rounded w-2/3" />
                                                        <div className="h-2 bg-gray-100 rounded w-1/3 mt-1" />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Decorative elements */}
                            <div
                                className="absolute -top-8 -right-8 w-24 h-24 bg-accent/20 rounded-full blur-xl"
                                aria-hidden="true"
                            />
                            <div
                                className="absolute -bottom-8 -left-8 w-32 h-32 bg-primary/10 rounded-full blur-xl"
                                aria-hidden="true"
                            />
                        </div>
                    </motion.div>

                    {/* Text Content */}
                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="flex-1"
                    >
                        <h2 className="font-heading font-semibold text-h2-mobile md:text-h2-desktop text-text-dark mb-6">
                            Meet Sidrat—Your Islamic Curriculum Guide
                        </h2>
                        <p className="text-lg text-text-secondary mb-8">
                            Imagine having a personal Islamic education consultant who tells
                            you exactly what to teach your child this week, with ready-made
                            activities and conversation starters.
                        </p>

                        {/* Benefits list */}
                        <ul className="space-y-4 mb-8">
                            {benefits.map((benefit, index) => (
                                <motion.li
                                    key={benefit}
                                    initial={{ opacity: 0, x: 20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: 0.1 * index, duration: 0.4 }}
                                    className="flex items-start gap-3"
                                >
                                    <span className="flex-shrink-0 w-6 h-6 bg-secondary/20 rounded-full flex items-center justify-center mt-0.5">
                                        <Check className="w-4 h-4 text-secondary" aria-hidden="true" />
                                    </span>
                                    <span className="text-text-dark">{benefit}</span>
                                </motion.li>
                            ))}
                        </ul>

                        <p className="text-lg text-text-secondary italic">
                            No more guessing. No more guilt. Just consistent, joyful Islamic
                            education.
                        </p>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
