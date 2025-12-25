"use client";

import React from "react";
import { motion } from "framer-motion";
import { Check, Gift } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { EmailForm } from "@/components/ui/EmailForm";

const included = [
    "Lifetime access to Sidrat",
    "All future updates free",
    "Priority support",
    "Founding member badge",
    "Early feature requests",
];

export function Pricing() {
    return (
        <section id="waitlist" className="py-16 md:py-24 bg-white scroll-mt-8">
            <div className="container mx-auto max-w-container px-5 md:px-8 lg:px-12">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="text-center mb-12"
                >
                    <h2 className="font-heading font-semibold text-h2-mobile md:text-h2-desktop text-text-dark mb-4">
                        Join the founding members
                    </h2>
                    <p className="text-lg text-text-secondary">
                        Be among the first 200 families to get Sidrat
                    </p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="max-w-lg mx-auto"
                >
                    <Card variant="accent" className="p-8 md:p-12">
                        {/* Early Access Badge */}
                        <div className="flex justify-center mb-6">
                            <span className="inline-block bg-accent text-white text-sm font-heading font-semibold px-4 py-2 rounded-full">
                                EARLY ACCESS OFFER
                            </span>
                        </div>

                        {/* Pricing */}
                        <div className="text-center mb-8">
                            <p className="text-text-secondary line-through text-lg">
                                Regular Price: $12/month
                            </p>
                            <div className="mt-2">
                                <span className="text-5xl font-heading font-bold text-primary">
                                    $99
                                </span>
                                <span className="text-xl text-text-dark">/year</span>
                            </div>
                            <p className="text-secondary font-semibold mt-2">(Save $45!)</p>
                        </div>

                        {/* What's Included */}
                        <div className="mb-8">
                            <h3 className="font-heading font-semibold text-lg text-text-dark mb-4 text-center">
                                What&apos;s Included:
                            </h3>
                            <ul className="space-y-3">
                                {included.map((item) => (
                                    <li key={item} className="flex items-center gap-3">
                                        <span className="flex-shrink-0 w-5 h-5 bg-secondary/20 rounded-full flex items-center justify-center">
                                            <Check className="w-3 h-3 text-secondary" aria-hidden="true" />
                                        </span>
                                        <span className="text-text-dark">{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Bonus */}
                        <div className="bg-accent/10 rounded-lg p-4 mb-8">
                            <div className="flex items-center gap-3">
                                <Gift className="w-6 h-6 text-accent flex-shrink-0" aria-hidden="true" />
                                <div>
                                    <p className="font-semibold text-text-dark">
                                        Free curriculum planning guide
                                    </p>
                                    <p className="text-sm text-text-secondary">
                                        (PDF, $29 value)
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Email Form */}
                        <EmailForm
                            buttonText="Join the Waitlist →"
                            placeholder="Enter your email"
                        />

                        {/* Urgency */}
                        <p className="text-center text-sm text-text-secondary mt-6">
                            <span className="font-semibold">Launching December 2024</span> •
                            Limited to 200 founding members
                        </p>
                    </Card>
                </motion.div>
            </div>
        </section>
    );
}
