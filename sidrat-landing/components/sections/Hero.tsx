"use client";

import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { Users } from "lucide-react";

export function Hero() {
    return (
        <section className="relative bg-background overflow-hidden py-16 md:py-24 lg:py-32">
            {/* Background accent circle */}
            <div
                className="absolute top-1/2 right-0 transform translate-x-1/3 -translate-y-1/2 w-[500px] md:w-[700px] h-[500px] md:h-[700px] rounded-full bg-primary/5 blur-3xl pointer-events-none"
                aria-hidden="true"
            />

            <div className="container mx-auto max-w-container px-5 md:px-8 lg:px-12">
                <div className="flex flex-col-reverse lg:flex-row items-center gap-12 lg:gap-16">
                    {/* Text Content */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6 }}
                        className="flex-1 text-center lg:text-left"
                    >
                        <h1 className="font-heading font-bold text-h1-mobile md:text-h2-desktop lg:text-h1-desktop text-text-dark mb-6 leading-tight">
                            Raise confident Muslim children—without the overwhelm
                        </h1>
                        <p className="text-lg md:text-xl text-text-secondary mb-8 max-w-xl mx-auto lg:mx-0 leading-relaxed">
                            Get a personalized Islamic curriculum delivered weekly.
                            Age-appropriate lessons, activities, and conversation starters for
                            ages 2-14.
                        </p>

                        <div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start mb-8">
                            <Button size="large" href="#waitlist" className="w-full sm:w-auto">
                                Get Early Access →
                            </Button>
                        </div>

                        {/* Social Proof */}
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3, duration: 0.5 }}
                            className="flex items-center gap-2 justify-center lg:justify-start text-text-secondary"
                        >
                            <Users className="w-5 h-5 text-primary" aria-hidden="true" />
                            <span className="text-sm font-medium">
                                Trusted by 150+ Muslim families
                            </span>
                        </motion.div>
                    </motion.div>

                    {/* Hero Illustration Placeholder */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="flex-1 flex justify-center lg:justify-end"
                    >
                        <div className="relative w-[300px] h-[300px] md:w-[400px] md:h-[400px] lg:w-[500px] lg:h-[500px]">
                            {/* Inline SVG asset (replace the placeholder) */}
                            <div className="absolute inset-0 rounded-3xl overflow-hidden border-2 border-primary/20 bg-gradient-to-br from-primary/10 to-secondary/10">
                                <img
                                    src="/undraw_fatherhood_eldm.svg"
                                    alt="Muslim parent teaching child illustration"
                                    className="w-full h-full object-cover"
                                />
                            </div>

                            {/* Decorative elements */}
                            <div
                                className="absolute -top-4 -left-4 w-20 h-20 bg-accent/20 rounded-full blur-xl"
                                aria-hidden="true"
                            />
                            <div
                                className="absolute -bottom-4 -right-4 w-32 h-32 bg-secondary/20 rounded-full blur-xl"
                                aria-hidden="true"
                            />
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
