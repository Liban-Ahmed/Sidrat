"use client";

import React from "react";
import { motion } from "framer-motion";
import { FileEdit, Smartphone, Sparkles, ArrowRight, ArrowDown } from "lucide-react";
import { Button } from "@/components/ui/Button";

const steps = [
    {
        number: 1,
        icon: <FileEdit className="w-8 h-8" />,
        title: "Tell Us About Your Kids",
        description:
            "Quick quiz: How many children? What ages? What are your priorities? (Islamic manners? Quran? Prophets' stories?)",
    },
    {
        number: 2,
        icon: <Smartphone className="w-8 h-8" />,
        title: "Get Your Weekly Plan",
        description:
            "Every Sunday, receive a personalized lesson plan for each child. Exactly what to teach, how to teach it, and fun activities to try.",
    },
    {
        number: 3,
        icon: <Sparkles className="w-8 h-8" />,
        title: "Watch Them Grow",
        description:
            "Your 6-year-old asks deep questions about Allah. Your 10-year-old teaches younger siblings. You feel confident as an Islamic educator.",
    },
];

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.2,
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

export function HowItWorks() {
    return (
        <section className="py-16 md:py-24 bg-background">
            <div className="container mx-auto max-w-container px-5 md:px-8 lg:px-12">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="text-center mb-12 md:mb-16"
                >
                    <h2 className="font-heading font-semibold text-h2-mobile md:text-h2-desktop text-text-dark">
                        Getting started is simple
                    </h2>
                </motion.div>

                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                    className="flex flex-col lg:flex-row items-stretch justify-center gap-6 md:gap-4 lg:gap-0"
                >
                    {steps.map((step, index) => (
                        <React.Fragment key={step.number}>
                            <motion.div
                                variants={itemVariants}
                                className="flex-1 max-w-sm mx-auto lg:mx-0"
                            >
                                <div className="bg-white rounded-xl p-8 shadow-card h-full text-center">
                                    {/* Step number */}
                                    <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-primary flex items-center justify-center">
                                        <span className="text-white font-heading font-bold text-2xl">
                                            {step.number}
                                        </span>
                                    </div>

                                    {/* Icon */}
                                    <div className="w-12 h-12 mx-auto mb-4 text-primary">
                                        {step.icon}
                                    </div>

                                    {/* Title */}
                                    <h3 className="font-heading font-semibold text-h3-mobile md:text-h3 text-text-dark mb-4">
                                        {step.title}
                                    </h3>

                                    {/* Description */}
                                    <p className="text-text-secondary leading-relaxed">
                                        {step.description}
                                    </p>
                                </div>
                            </motion.div>

                            {/* Arrow between steps */}
                            {index < steps.length - 1 && (
                                <>
                                    {/* Desktop arrow (horizontal) */}
                                    <div className="hidden lg:flex items-center justify-center px-4">
                                        <ArrowRight
                                            className="w-8 h-8 text-primary/40"
                                            aria-hidden="true"
                                        />
                                    </div>
                                    {/* Mobile arrow (vertical) */}
                                    <div className="flex lg:hidden items-center justify-center py-2">
                                        <ArrowDown
                                            className="w-8 h-8 text-primary/40"
                                            aria-hidden="true"
                                        />
                                    </div>
                                </>
                            )}
                        </React.Fragment>
                    ))}
                </motion.div>

                {/* CTA */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.5, duration: 0.5 }}
                    className="text-center mt-12 md:mt-16"
                >
                    <Button size="large" href="#waitlist">
                        Join 200+ Families on the Waitlist
                    </Button>
                </motion.div>
            </div>
        </section>
    );
}
