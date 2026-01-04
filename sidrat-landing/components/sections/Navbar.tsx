"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { Menu, X, ChevronRight } from "lucide-react";

const navLinks = [
    { name: "Features", href: "#features" },
    { name: "How It Works", href: "#how-it-works" },
    { name: "Pricing", href: "#pricing" },
];

export function Navbar() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // Prevent body scroll when mobile menu is open
    useEffect(() => {
        if (isMobileMenuOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }
        return () => {
            document.body.style.overflow = "unset";
        };
    }, [isMobileMenuOpen]);

    const scrollToSection = (href: string) => {
        setIsMobileMenuOpen(false);
        const element = document.querySelector(href);
        if (element) {
            element.scrollIntoView({ behavior: "smooth" });
        }
    };

    return (
        <>
            <motion.header
                initial={{ y: -100 }}
                animate={{ y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${isScrolled
                    ? "py-4"
                    : "py-6 lg:py-8"
                    }`}
            >
                {/* Glassmorphism background */}
                <div
                    className={`absolute inset-0 transition-all duration-500 ${isScrolled
                        ? "bg-white/80 backdrop-blur-xl shadow-lg border-b border-gray-100/50"
                        : "bg-transparent"
                        }`}
                />

                <nav className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between">
                        {/* Logo */}
                        <motion.a
                            href="#"
                            className="flex items-center gap-4 group"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            <div className="relative">
                                {/* Logo glow effect */}
                                <div className="absolute inset-0 bg-gradient-to-br from-primary/30 to-secondary/30 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                <div className="relative w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 rounded-2xl overflow-hidden shadow-lg group-hover:shadow-xl transition-shadow duration-300 ring-2 ring-white/50">
                                    <Image
                                        src="/Logo.svg"
                                        alt="Sidrat Logo"
                                        fill
                                        className="object-cover"
                                        priority
                                    />
                                </div>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-2xl sm:text-3xl lg:text-4xl font-bold font-heading bg-gradient-to-r from-primary via-secondary to-primary bg-[length:200%_100%] bg-clip-text text-transparent group-hover:animate-gradient-x transition-all duration-300">
                                    Sidrat
                                </span>
                                <span className={`text-xs sm:text-sm font-medium tracking-wider uppercase transition-colors duration-300 ${isScrolled ? "text-text-secondary" : "text-text-secondary/80"
                                    }`}>
                                    Islamic Learning
                                </span>
                            </div>
                        </motion.a>

                        {/* Desktop Navigation */}
                        <div className="hidden md:flex items-center gap-2 lg:gap-4">
                            {navLinks.map((link, index) => (
                                <motion.button
                                    key={link.name}
                                    initial={{ opacity: 0, y: -20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.1 * index, duration: 0.5 }}
                                    onClick={() => scrollToSection(link.href)}
                                    className={`relative px-5 py-3 text-base lg:text-lg font-medium transition-colors duration-300 rounded-xl group ${isScrolled
                                        ? "text-text-dark hover:text-primary"
                                        : "text-text-dark hover:text-primary"
                                        }`}
                                >
                                    {link.name}
                                    {/* Hover underline effect */}
                                    <span className="absolute bottom-2 left-5 right-5 h-0.5 bg-gradient-to-r from-primary to-secondary rounded-full scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
                                </motion.button>
                            ))}
                        </div>

                        {/* CTA Button - Desktop */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.4, duration: 0.5 }}
                            className="hidden md:block"
                        >
                            <button
                                onClick={() => scrollToSection("#signup")}
                                className="group relative px-8 py-3.5 rounded-full font-semibold text-base lg:text-lg overflow-hidden transition-all duration-300 shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30"
                            >
                                {/* Button background */}
                                <div className="absolute inset-0 bg-gradient-to-r from-primary to-secondary transition-all duration-300" />
                                {/* Shine effect */}
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                                {/* Button content */}
                                <span className="relative flex items-center gap-2 text-white">
                                    Join Waitlist
                                    <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                                </span>
                            </button>
                        </motion.div>

                        {/* Mobile Menu Button */}
                        <motion.button
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.3 }}
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className={`md:hidden relative p-3 rounded-xl transition-all duration-300 ${isScrolled
                                ? "bg-gray-100 hover:bg-gray-200"
                                : "bg-white/10 hover:bg-white/20 backdrop-blur-sm"
                                }`}
                            aria-label="Toggle menu"
                        >
                            <AnimatePresence mode="wait">
                                {isMobileMenuOpen ? (
                                    <motion.div
                                        key="close"
                                        initial={{ rotate: -90, opacity: 0 }}
                                        animate={{ rotate: 0, opacity: 1 }}
                                        exit={{ rotate: 90, opacity: 0 }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        <X className="w-7 h-7 text-text-dark" />
                                    </motion.div>
                                ) : (
                                    <motion.div
                                        key="menu"
                                        initial={{ rotate: 90, opacity: 0 }}
                                        animate={{ rotate: 0, opacity: 1 }}
                                        exit={{ rotate: -90, opacity: 0 }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        <Menu className="w-7 h-7 text-text-dark" />
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.button>
                    </div>
                </nav>
            </motion.header>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
                        />

                        {/* Mobile Menu Panel */}
                        <motion.div
                            initial={{ x: "100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "100%" }}
                            transition={{ type: "spring", damping: 25, stiffness: 200 }}
                            className="fixed top-0 right-0 bottom-0 w-[85%] max-w-sm bg-white z-50 md:hidden shadow-2xl"
                        >
                            {/* Decorative gradient */}
                            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-secondary to-accent" />

                            <div className="flex flex-col h-full">
                                {/* Header */}
                                <div className="flex items-center justify-between p-6 border-b border-gray-100">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-xl overflow-hidden shadow-md">
                                            <Image
                                                src="/Logo.svg"
                                                alt="Sidrat Logo"
                                                width={40}
                                                height={40}
                                                className="object-cover"
                                            />
                                        </div>
                                        <span className="text-xl font-bold font-heading bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                                            Sidrat
                                        </span>
                                    </div>
                                    <button
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className="p-2 rounded-xl bg-gray-100 hover:bg-gray-200 transition-colors"
                                    >
                                        <X className="w-5 h-5 text-text-dark" />
                                    </button>
                                </div>

                                {/* Navigation Links */}
                                <div className="flex-1 px-6 py-8">
                                    <nav className="space-y-2">
                                        {navLinks.map((link, index) => (
                                            <motion.button
                                                key={link.name}
                                                initial={{ opacity: 0, x: 20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: 0.1 * index }}
                                                onClick={() => scrollToSection(link.href)}
                                                className="w-full flex items-center justify-between p-4 rounded-2xl text-left text-lg font-medium text-text-dark hover:bg-gradient-to-r hover:from-primary/5 hover:to-secondary/5 transition-all duration-300 group"
                                            >
                                                <span>{link.name}</span>
                                                <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-primary group-hover:translate-x-1 transition-all duration-300" />
                                            </motion.button>
                                        ))}
                                    </nav>
                                </div>

                                {/* CTA Section */}
                                <div className="p-6 border-t border-gray-100">
                                    <motion.button
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.4 }}
                                        onClick={() => scrollToSection("#signup")}
                                        className="w-full py-4 px-6 bg-gradient-to-r from-primary to-secondary rounded-2xl text-white font-semibold text-lg shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 hover:-translate-y-0.5 transition-all duration-300"
                                    >
                                        Join the Waitlist
                                    </motion.button>
                                    <p className="text-center text-sm text-text-secondary mt-4">
                                        Be first to know when we launch! 🚀
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
}
