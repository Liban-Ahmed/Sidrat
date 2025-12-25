"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Twitter, Instagram, Mail, Heart } from "lucide-react";

const productLinks = [
    { label: "Features", href: "#features" },
    { label: "How It Works", href: "#how-it-works" },
    { label: "Pricing", href: "#pricing" },
];

const companyLinks = [
    { label: "About Us", href: "#" },
    { label: "Contact", href: "#" },
    { label: "Privacy Policy", href: "#" },
    { label: "Terms of Service", href: "#" },
];

const socialLinks = [
    { name: 'Twitter', icon: Twitter, href: 'https://x.com/SidratApp' },
    { name: 'Instagram', icon: Instagram, href: 'https://www.instagram.com/sidratapp/' },
    { name: 'Email', icon: Mail, href: 'mailto:hello@sidrat.app' }
];

export function Footer() {
    const scrollToSection = (href: string) => {
        const element = document.querySelector(href);
        if (element) {
            element.scrollIntoView({ behavior: "smooth" });
        }
    };

    return (
        <footer className="relative bg-gradient-to-br from-gray-900 via-gray-900 to-gray-800 text-white overflow-hidden">
            {/* Background decorations */}
            <div className="absolute inset-0">
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
                <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-secondary/10 rounded-full blur-3xl" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-primary/5 via-transparent to-secondary/5 rounded-full blur-3xl" />
            </div>

            {/* Main Footer Content */}
            <div className="relative container mx-auto px-6 sm:px-8 md:px-12 lg:px-20 xl:px-40 max-w-[1400px] pt-16 md:pt-20 pb-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8 mb-16">
                    {/* Brand Column */}
                    <div className="lg:col-span-5 space-y-6">
                        <motion.a
                            href="#"
                            className="flex items-center gap-4 group"
                            whileHover={{ scale: 1.02 }}
                        >
                            <div className="relative">
                                <div className="absolute inset-0 bg-gradient-to-br from-primary/30 to-secondary/30 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                <div className="relative w-14 h-14 rounded-2xl overflow-hidden shadow-lg ring-2 ring-white/20">
                                    <Image
                                        src="/Logo.svg"
                                        alt="Sidrat Logo"
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                            </div>
                            <div>
                                <span className="text-2xl sm:text-3xl font-bold font-heading bg-gradient-to-r from-white via-gray-200 to-white bg-clip-text text-transparent">
                                    Sidrat
                                </span>
                                <span className="block text-sm text-gray-400 font-medium tracking-wider uppercase">
                                    Islamic Learning
                                </span>
                            </div>
                        </motion.a>

                        <p className="text-lg text-gray-400 leading-relaxed max-w-md">
                            Your personal Islamic curriculum guide. Empowering Muslim parents to raise confident, knowledgeable children with faith-centered education.
                        </p>

                        {/* Social Links */}
                        <div className="flex gap-3 pt-2">
                            {socialLinks.map((social) => (
                                <motion.a
                                    key={social.name}
                                    href={social.href}
                                    whileHover={{ scale: 1.1, y: -2 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="w-12 h-12 rounded-xl bg-white/5 hover:bg-gradient-to-br hover:from-primary/20 hover:to-secondary/20 border border-white/10 hover:border-primary/30 flex items-center justify-center transition-all duration-300 group"
                                    aria-label={social.name}
                                >
                                    <social.icon className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" strokeWidth={2} />
                                </motion.a>
                            ))}
                        </div>
                    </div>

                    {/* Links Columns */}
                    <div className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-8">
                        {/* Product Links */}
                        <div>
                            <h3 className="text-sm font-bold uppercase tracking-wider text-white mb-6 flex items-center gap-2">
                                <div className="w-8 h-0.5 bg-gradient-to-r from-primary to-transparent" />
                                Product
                            </h3>
                            <ul className="space-y-4">
                                {productLinks.map((link) => (
                                    <li key={link.label}>
                                        <button
                                            onClick={() => scrollToSection(link.href)}
                                            className="text-gray-400 hover:text-white transition-colors duration-300 text-base hover:translate-x-1 inline-block"
                                        >
                                            {link.label}
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Company Links */}
                        <div>
                            <h3 className="text-sm font-bold uppercase tracking-wider text-white mb-6 flex items-center gap-2">
                                <div className="w-8 h-0.5 bg-gradient-to-r from-secondary to-transparent" />
                                Company
                            </h3>
                            <ul className="space-y-4">
                                {companyLinks.map((link) => (
                                    <li key={link.label}>
                                        <a
                                            href={link.href}
                                            className="text-gray-400 hover:text-white transition-colors duration-300 text-base hover:translate-x-1 inline-block"
                                        >
                                            {link.label}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Contact */}
                        <div className="col-span-2 sm:col-span-1">
                            <h3 className="text-sm font-bold uppercase tracking-wider text-white mb-6 flex items-center gap-2">
                                <div className="w-8 h-0.5 bg-gradient-to-r from-accent to-transparent" />
                                Contact
                            </h3>
                            <div className="space-y-4">
                                <a
                                    href="mailto:hello@sidrat.app"
                                    className="flex items-center gap-3 text-gray-400 hover:text-white transition-colors group"
                                >
                                    <div className="w-10 h-10 rounded-lg bg-white/5 group-hover:bg-primary/20 flex items-center justify-center transition-colors">
                                        <Mail className="w-4 h-4" />
                                    </div>
                                    <span className="text-base">hello@sidrat.app</span>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Divider */}
                <div className="h-px bg-gradient-to-r from-transparent via-white/20 to-transparent mb-8" />

                {/* Bottom Bar */}
                <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                    <p className="text-gray-400 text-sm sm:text-base flex items-center gap-2 flex-wrap justify-center">
                        © 2025 Sidrat. Built with
                        <Heart className="w-4 h-4 text-red-500 animate-pulse" fill="currentColor" />
                        for Muslim families worldwide.
                    </p>

                    <div className="flex items-center gap-2">
                        <div className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse" />
                        <span className="text-gray-400 text-sm">All systems operational</span>
                    </div>
                </div>
            </div>
        </footer>
    );
}

