"use client";

import React from "react";
import { motion } from "framer-motion";
import { BookOpen, CheckCircle2 } from "lucide-react";
import { ParallaxSection, MagneticButton, AnimatedGradientText } from "@/components/effects";

export function Hero() {
    return (
        <section className="relative min-h-screen flex items-center overflow-hidden bg-gradient-to-b from-gray-50 via-white to-gray-50/50 pt-24 pb-16 sm:pt-28 sm:pb-20 md:py-0">
            {/* Animated background orbs with parallax - Fixed z-index */}
            <div className="absolute inset-0 z-0">
                <ParallaxSection offset={-20}>
                    <div className="absolute inset-0">
                        <div className="absolute top-20 right-4 sm:right-20 w-48 sm:w-96 h-48 sm:h-96 bg-primary/5 rounded-full blur-3xl animate-pulse-slow" />
                        <div className="absolute bottom-20 left-4 sm:left-20 w-40 sm:w-80 h-40 sm:h-80 bg-secondary/5 rounded-full blur-3xl animate-pulse-slower" />
                        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[300px] sm:w-[600px] h-[300px] sm:h-[600px] bg-gradient-to-r from-primary/5 via-transparent to-secondary/5 rounded-full blur-3xl" />
                        <div className="absolute top-1/4 right-1/3 w-32 sm:w-64 h-32 sm:h-64 bg-accent/5 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '1s' }} />
                    </div>
                </ParallaxSection>
            </div>

            <div className="container mx-auto px-4 sm:px-6 md:px-8 lg:px-20 xl:px-40 max-w-[1400px] relative z-10">
                <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 xl:gap-32 items-center">
                    {/* Left: Text Content */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="space-y-8 lg:space-y-10 text-center lg:text-left"
                    >
                        {/* Badge/Pill */}
                        <div className="inline-flex items-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 rounded-full bg-gradient-to-r from-primary/10 to-secondary/10 border border-primary/20">
                            <span className="relative flex h-2.5 sm:h-3 w-2.5 sm:w-3 flex-shrink-0">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-full w-full bg-primary"></span>
                            </span>
                            <span className="text-xs sm:text-sm font-medium text-primary">
                                Launching Dec 2026 • 150+ families
                            </span>
                        </div>

                        {/* Headline - Responsive and HUGE with animated gradient */}
                        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold font-heading leading-[1.15] tracking-tight">
                            They learn in the app.
                            <AnimatedGradientText className="block mt-1 sm:mt-2 pb-1 sm:pb-2">
                                You bring it to life.
                            </AnimatedGradientText>
                        </h1>

                        {/* Subheadline - Better spacing */}
                        <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-text-secondary leading-relaxed max-w-2xl mx-auto lg:mx-0">
                            Sidrat combines Duolingo-style daily lessons with weekly family activities—so your 5-7 year old builds Islamic foundations while you stay connected to their growth.
                        </p>

                        {/* Hybrid model visual */}
                        <div className="flex flex-col xs:flex-row flex-wrap items-center justify-center lg:justify-start gap-2 sm:gap-3">
                            <div className="flex items-center gap-2 px-3 sm:px-4 py-2 rounded-full bg-primary/10 border border-primary/20">
                                <BookOpen className="w-3.5 sm:w-4 h-3.5 sm:h-4 text-primary flex-shrink-0" />
                                <span className="text-xs sm:text-sm font-medium text-primary whitespace-nowrap">5 min/day in app</span>
                            </div>
                            <span className="text-xl sm:text-2xl text-text-secondary">+</span>
                            <div className="flex items-center gap-2 px-3 sm:px-4 py-2 rounded-full bg-secondary/10 border border-secondary/20">
                                <CheckCircle2 className="w-3.5 sm:w-4 h-3.5 sm:h-4 text-secondary flex-shrink-0" />
                                <span className="text-xs sm:text-sm font-medium text-secondary whitespace-nowrap">15 min/week together</span>
                            </div>
                        </div>

                        {/* CTA with magnetic buttons */}
                        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-stretch sm:items-center justify-center lg:justify-start w-full sm:w-auto">
                            <MagneticButton strength={0.3}>
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' })}
                                    className="group relative w-full sm:w-auto px-6 sm:px-8 md:px-10 py-3.5 sm:py-4 md:py-5 text-sm sm:text-base md:text-lg font-semibold rounded-xl sm:rounded-2xl bg-gradient-to-r from-primary to-primary/90 text-white shadow-primary hover:shadow-glow transition-all duration-300"
                                >
                                    <span className="relative z-10 flex items-center justify-center gap-3">
                                        Get Early Access
                                        <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                        </svg>
                                    </span>
                                </motion.button>
                            </MagneticButton>

                            <MagneticButton strength={0.2}>
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })}
                                    className="w-full sm:w-auto px-6 sm:px-8 md:px-10 py-3.5 sm:py-4 md:py-5 text-sm sm:text-base md:text-lg font-semibold rounded-xl sm:rounded-2xl border-2 border-text-dark/20 text-text-dark hover:border-primary hover:text-primary hover:bg-primary/5 transition-all duration-300"
                                >
                                    See How It Works
                                </motion.button>
                            </MagneticButton>
                        </div>

                        {/* Social Proof - Enhanced */}
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4, duration: 0.6 }}
                            className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 sm:gap-8 pt-6 sm:pt-8"
                        >
                            {/* Avatar stack */}
                            <div className="flex -space-x-3 sm:-space-x-4">
                                {[1, 2, 3, 4].map(i => (
                                    <div key={i} className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border-3 sm:border-4 border-white bg-gradient-to-br from-primary to-secondary" />
                                ))}
                            </div>
                            <div className="text-center sm:text-left">
                                <div className="flex items-center justify-center sm:justify-start gap-1 sm:gap-2 mb-1">
                                    {[1, 2, 3, 4, 5].map(i => (
                                        <svg key={i} className="w-4 h-4 sm:w-5 sm:h-5 text-accent" fill="currentColor" viewBox="0 0 20 20">
                                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                        </svg>
                                    ))}
                                </div>
                                <p className="text-sm sm:text-base text-text-secondary">
                                    <span className="font-semibold text-text-dark">150+ Muslim families</span> already on the waitlist
                                </p>
                            </div>
                        </motion.div>
                    </motion.div>

                    {/* Right: Premium Illustration/3D Element */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="relative mt-12 lg:mt-0 z-20"
                    >
                        {/* Floating card with glass morphism */}
                        <div className="relative bg-white/70 backdrop-blur-xl rounded-[32px] sm:rounded-[40px] p-8 sm:p-10 md:p-12 shadow-large border border-white/50 max-w-md mx-auto">
                            {/* Phone mockup or illustration */}
                            <div className="aspect-[9/16] bg-gradient-to-br from-primary/10 to-secondary/10 rounded-[24px] sm:rounded-[32px] p-6 sm:p-8 relative overflow-hidden">
                                {/* Animated elements inside */}
                                <div className="absolute inset-0 bg-gradient-to-tr from-primary/5 via-transparent to-accent/5" />

                                {/* Content preview */}
                                <div className="relative space-y-4 sm:space-y-6">
                                    <div className="h-3 sm:h-4 bg-white/50 rounded-full w-3/4 animate-pulse" />
                                    <div className="h-3 sm:h-4 bg-white/50 rounded-full w-1/2 animate-pulse" style={{ animationDelay: '0.2s' }} />
                                    <div className="h-24 sm:h-32 bg-white/50 rounded-2xl animate-pulse" style={{ animationDelay: '0.4s' }} />
                                    <div className="h-3 sm:h-4 bg-white/50 rounded-full w-2/3 animate-pulse" style={{ animationDelay: '0.6s' }} />
                                </div>
                            </div>
                        </div>

                        {/* Floating badges/stats - Fixed positioning */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.6, duration: 0.6 }}
                            className="absolute -top-8 -left-6 sm:-top-10 sm:-left-8 bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-large border border-gray-100 animate-float z-30"
                        >
                            <div className="flex items-center gap-2 sm:gap-3">
                                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-gradient-to-br from-accent to-accent/80 flex items-center justify-center">
                                    <BookOpen className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                                </div>
                                <div>
                                    <div className="text-xl sm:text-2xl font-bold text-text-dark">5 min/day</div>
                                    <div className="text-xs sm:text-sm text-text-secondary">In-App Lessons</div>
                                </div>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.8, duration: 0.6 }}
                            className="absolute -bottom-6 -right-4 sm:-bottom-8 sm:-right-8 bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-large border border-gray-100 animate-float z-30"
                            style={{ animationDelay: '0.5s' }}
                        >
                            <div className="flex items-center gap-2 sm:gap-3">
                                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-gradient-to-br from-secondary to-secondary/80 flex items-center justify-center">
                                    <CheckCircle2 className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                                </div>
                                <div>
                                    <div className="text-xl sm:text-2xl font-bold text-text-dark">Ages 5-7</div>
                                    <div className="text-xs sm:text-sm text-text-secondary">Family Activity/Week</div>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                </div>
            </div>

            {/* Scroll indicator */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1, duration: 0.6 }}
                className="absolute bottom-8 sm:bottom-12 left-1/2 -translate-x-1/2 animate-bounce hidden sm:block"
            >
                <svg className="w-6 h-6 text-text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
            </motion.div>
        </section>
    );
}

