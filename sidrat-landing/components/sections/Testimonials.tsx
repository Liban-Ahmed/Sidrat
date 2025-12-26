"use client";

import React from "react";
import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";

interface Testimonial {
    quote: string;
    author: string;
    role: string;
    highlight: string;
}

const testimonials: Testimonial[] = [
    {
        quote: "My daughter actually asks to do her Sidrat lesson every morning before school. I've never seen her this excited about learning Islamic studies.",
        author: "Fatima A.",
        role: "Mother of 2, California",
        highlight: "Kids ask to learn"
    },
    {
        quote: "The family activities are a game-changer. We practiced Wudu together and my son was so proud to show his dad what he learned.",
        author: "Sarah M.",
        role: "Mother of 3, Texas",
        highlight: "Family bonding moments"
    },
    {
        quote: "I used to feel guilty about screen time, but Sidrat is different. It's educational, Islamic, and I can see exactly what he's learning.",
        author: "Amina K.",
        role: "Mother of 1, New York",
        highlight: "No more screen guilt"
    },
    {
        quote: "Finally, an app that doesn't try to replace me—it helps me teach. The parent dashboard shows me everything without hovering over my kids.",
        author: "Nadia R.",
        role: "Mother of 2, Michigan",
        highlight: "Parents stay connected"
    }
];

export function Testimonials() {
    return (
        <section id="testimonials" className="py-20 sm:py-24 md:py-32 lg:py-40 bg-gradient-to-b from-gray-50 via-white to-gray-50 relative overflow-hidden">
            {/* Background decorations */}
            <div className="absolute inset-0">
                <div className="absolute top-1/4 right-4 sm:right-10 w-64 sm:w-96 h-64 sm:h-96 bg-accent/5 rounded-full blur-3xl" />
                <div className="absolute bottom-1/4 left-4 sm:left-10 w-48 sm:w-80 h-48 sm:h-80 bg-primary/5 rounded-full blur-3xl" />
            </div>

            <div className="container mx-auto px-4 sm:px-6 md:px-8 lg:px-20 xl:px-40 max-w-[1400px] relative z-10">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-10 sm:mb-14 md:mb-16 lg:mb-20 space-y-4 sm:space-y-6"
                >
                    <div className="inline-flex items-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 rounded-full bg-gradient-to-r from-accent/20 to-accent/10 border border-accent/30">
                        <Star className="w-3.5 sm:w-4 h-3.5 sm:h-4 text-accent fill-accent" />
                        <span className="text-xs sm:text-sm font-semibold text-accent uppercase tracking-wide">Beta Family Feedback</span>
                    </div>

                    <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold font-heading text-text-dark leading-tight">
                        What parents
                        <span className="block mt-2 bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                            are saying
                        </span>
                    </h2>

                    <p className="text-xl md:text-2xl text-text-secondary max-w-3xl mx-auto leading-relaxed">
                        Real feedback from families in our beta program
                    </p>
                </motion.div>

                {/* Testimonials grid */}
                <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
                    {testimonials.map((testimonial, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.15, duration: 0.5 }}
                            className="group"
                        >
                            <div className="h-full bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-8 md:p-10 border border-gray-100 shadow-card hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 relative">
                                {/* Quote icon */}
                                <div className="absolute top-5 sm:top-8 right-5 sm:right-8 w-10 sm:w-12 h-10 sm:h-12 rounded-xl sm:rounded-2xl bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center">
                                    <Quote className="w-5 sm:w-6 h-5 sm:h-6 text-primary" />
                                </div>

                                {/* Highlight badge */}
                                <div className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-accent/10 border border-accent/20 mb-4 sm:mb-6">
                                    <Star className="w-3.5 sm:w-4 h-3.5 sm:h-4 text-accent fill-accent" />
                                    <span className="text-xs sm:text-sm font-semibold text-accent">{testimonial.highlight}</span>
                                </div>

                                {/* Quote */}
                                <p className="text-base sm:text-lg md:text-xl text-text-dark leading-relaxed mb-5 sm:mb-8 font-medium pr-8 sm:pr-0">
                                    &ldquo;{testimonial.quote}&rdquo;
                                </p>

                                {/* Author */}
                                <div className="flex items-center gap-3 sm:gap-4">
                                    <div className="w-10 sm:w-12 h-10 sm:h-12 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center flex-shrink-0">
                                        <span className="text-base sm:text-lg font-bold text-white">
                                            {testimonial.author.charAt(0)}
                                        </span>
                                    </div>
                                    <div>
                                        <p className="font-semibold text-text-dark text-sm sm:text-base">{testimonial.author}</p>
                                        <p className="text-xs sm:text-sm text-text-secondary">{testimonial.role}</p>
                                    </div>
                                </div>

                                {/* 5 stars */}
                                <div className="flex items-center gap-0.5 sm:gap-1 mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-gray-100">
                                    {[...Array(5)].map((_, i) => (
                                        <Star key={i} className="w-4 sm:w-5 h-4 sm:h-5 text-accent fill-accent" />
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Social proof bar */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.6 }}
                    className="mt-10 sm:mt-16 text-center"
                >
                    <div className="inline-flex flex-col sm:flex-row flex-wrap items-center justify-center gap-3 sm:gap-6 md:gap-8 px-5 sm:px-8 py-4 rounded-2xl sm:rounded-full bg-white border border-gray-100 shadow-card">
                        <div className="flex items-center gap-2">
                            <div className="flex -space-x-2 sm:-space-x-3">
                                {[...Array(5)].map((_, i) => (
                                    <div 
                                        key={i} 
                                        className="w-6 sm:w-8 h-6 sm:h-8 rounded-full bg-gradient-to-br from-primary to-secondary border-2 border-white flex items-center justify-center"
                                    >
                                        <span className="text-[10px] sm:text-xs font-bold text-white">
                                            {['F', 'S', 'A', 'N', 'M'][i]}
                                        </span>
                                    </div>
                                ))}
                            </div>
                            <span className="text-xs sm:text-sm font-semibold text-text-dark ml-1 sm:ml-2">150+ families</span>
                        </div>
                        <div className="hidden sm:block h-6 w-px bg-gray-200" />
                        <div className="flex items-center gap-0.5 sm:gap-1">
                            {[...Array(5)].map((_, i) => (
                                <Star key={i} className="w-3.5 sm:w-4 h-3.5 sm:h-4 text-accent fill-accent" />
                            ))}
                            <span className="text-xs sm:text-sm font-semibold text-text-dark ml-1 sm:ml-2">4.9/5 rating</span>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
