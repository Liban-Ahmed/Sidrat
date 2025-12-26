"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, MessageCircleQuestion } from "lucide-react";

interface FAQItem {
    question: string;
    answer: string;
}

const faqs: FAQItem[] = [
    {
        question: "What age is Sidrat designed for?",
        answer: "Sidrat is specifically designed for children ages 5-7 years old. This is the perfect age for building Islamic foundations—they're curious, eager to learn, and ready for structured lessons. We're developing additional age ranges (3-5 and 7-9) that will be free for founding members when released."
    },
    {
        question: "How much time does it require?",
        answer: "Just 5 minutes a day for app lessons (Monday-Friday) and one 15-minute family activity on the weekend. That's less than 40 minutes total per week. The app handles the daily teaching so you can focus on the meaningful family connection time."
    },
    {
        question: "What's included in the family activities?",
        answer: "Each weekend, you'll receive a guided 15-minute activity that reinforces what your child learned in the app that week. Activities include things like practicing Wudu together, reading a simplified Quran story, or doing a kindness challenge. Everything comes with clear instructions—no prep needed."
    },
    {
        question: "Is the content scholar-reviewed?",
        answer: "Yes! All content is 100% scholar-reviewed to ensure authenticity and accuracy. We work with Islamic educators to make sure the lessons are both engaging for kids and aligned with traditional Islamic teachings."
    },
    {
        question: "What if my child doesn't like it?",
        answer: "We offer a 30-day money-back guarantee, no questions asked. If Sidrat isn't the right fit for your family, we'll refund you completely. We're confident your child will love it—our beta testers' kids ask to do their lessons!"
    },
    {
        question: "Can I have multiple children on one account?",
        answer: "Absolutely! Your account includes unlimited child profiles. Each child gets their own personalized learning journey with individual progress tracking on your parent dashboard."
    },
    {
        question: "When does Sidrat launch?",
        answer: "We're launching in December 2026. Join the waitlist now to lock in the founding member price of $99/year (regular price will be $144/year) and get lifetime access to all future age ranges at no extra cost."
    },
    {
        question: "Is this a subscription?",
        answer: "No subscriptions! It's a one-time annual payment of $99. Your founding member rate is locked in forever—as long as you renew each year, you'll never pay more. And all future age ranges are included free."
    }
];

export function FAQ() {
    const [openIndex, setOpenIndex] = useState<number | null>(0);

    return (
        <section id="faq" className="py-20 sm:py-24 md:py-32 lg:py-40 bg-gradient-to-b from-white via-gray-50/50 to-white relative overflow-hidden">
            {/* Background decorations */}
            <div className="absolute inset-0">
                <div className="absolute top-1/4 left-4 sm:left-10 w-64 sm:w-96 h-64 sm:h-96 bg-primary/5 rounded-full blur-3xl" />
                <div className="absolute bottom-1/4 right-4 sm:right-10 w-48 sm:w-80 h-48 sm:h-80 bg-secondary/5 rounded-full blur-3xl" />
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
                    <div className="inline-flex items-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 rounded-full bg-gradient-to-r from-primary/10 to-secondary/10 border border-primary/20">
                        <MessageCircleQuestion className="w-3.5 sm:w-4 h-3.5 sm:h-4 text-primary" />
                        <span className="text-xs sm:text-sm font-semibold text-primary uppercase tracking-wide">FAQ</span>
                    </div>

                    <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold font-heading text-text-dark leading-tight">
                        Questions?
                        <span className="block mt-2 bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                            We&apos;ve got answers
                        </span>
                    </h2>
                </motion.div>

                {/* FAQ Items */}
                <div className="max-w-3xl mx-auto space-y-3 sm:space-y-4">
                    {faqs.map((faq, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1, duration: 0.4 }}
                        >
                            <button
                                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                                className="w-full"
                            >
                                <div className={`bg-white rounded-xl sm:rounded-2xl border transition-all duration-300 ${
                                    openIndex === index 
                                        ? 'border-primary/30 shadow-lg' 
                                        : 'border-gray-100 shadow-card hover:shadow-lg hover:border-primary/20'
                                }`}>
                                    <div className="flex items-center justify-between p-4 sm:p-6 md:p-8">
                                        <h3 className="text-base sm:text-lg md:text-xl font-semibold text-text-dark text-left pr-3 sm:pr-4">
                                            {faq.question}
                                        </h3>
                                        <motion.div
                                            animate={{ rotate: openIndex === index ? 180 : 0 }}
                                            transition={{ duration: 0.3 }}
                                            className={`flex-shrink-0 w-8 sm:w-10 h-8 sm:h-10 rounded-full flex items-center justify-center transition-colors ${
                                                openIndex === index
                                                    ? 'bg-primary text-white'
                                                    : 'bg-gray-100 text-text-secondary'
                                            }`}
                                        >
                                            <ChevronDown className="w-4 sm:w-5 h-4 sm:h-5" />
                                        </motion.div>
                                    </div>

                                    <AnimatePresence>
                                        {openIndex === index && (
                                            <motion.div
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: "auto", opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                transition={{ duration: 0.3 }}
                                                className="overflow-hidden"
                                            >
                                                <div className="px-4 sm:px-6 md:px-8 pb-4 sm:pb-6 md:pb-8">
                                                    <div className="pt-2 border-t border-gray-100">
                                                        <p className="text-sm sm:text-base md:text-lg text-text-secondary leading-relaxed pt-3 sm:pt-4">
                                                            {faq.answer}
                                                        </p>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            </button>
                        </motion.div>
                    ))}
                </div>

                {/* Still have questions? */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.5 }}
                    className="text-center mt-8 sm:mt-12"
                >
                    <p className="text-sm sm:text-base md:text-lg text-text-secondary">
                        Still have questions?{" "}
                        <a 
                            href="mailto:hello@sidrat.app" 
                            className="text-primary font-semibold hover:underline"
                        >
                            Email us at hello@sidrat.app
                        </a>
                    </p>
                </motion.div>
            </div>
        </section>
    );
}
