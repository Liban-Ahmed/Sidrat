"use client";

import React from "react";
import { Logo } from "@/components/icons/Logo";
import { Twitter, Instagram, Mail } from "lucide-react";

const productLinks = [
    { label: "How It Works", href: "#how-it-works" },
    { label: "Pricing", href: "#waitlist" },
    { label: "FAQ", href: "#faq" },
];

const companyLinks = [
    { label: "About", href: "#" },
    { label: "Contact", href: "#" },
    { label: "Privacy Policy", href: "#" },
    { label: "Terms of Service", href: "#" },
];

const socialLinks = [
    { icon: <Twitter className="w-5 h-5" />, label: "Twitter", href: "#" },
    { icon: <Instagram className="w-5 h-5" />, label: "Instagram", href: "#" },
    { icon: <Mail className="w-5 h-5" />, label: "Email", href: "mailto:hello@sidrat.app" },
];

export function Footer() {
    return (
        <footer className="bg-text-dark text-background py-12 md:py-16">
            <div className="container mx-auto max-w-container px-5 md:px-8 lg:px-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 mb-12">
                    {/* Column 1: Logo & Tagline */}
                    <div className="col-span-1 md:col-span-2 lg:col-span-1">
                        <Logo className="text-white mb-4" />
                        <p className="text-gray-400 leading-relaxed">
                            Your Islamic curriculum guide for confident parenting
                        </p>
                    </div>

                    {/* Column 2: Product */}
                    <div>
                        <h4 className="font-heading font-semibold text-white mb-4">
                            Product
                        </h4>
                        <ul className="space-y-3">
                            {productLinks.map((link) => (
                                <li key={link.label}>
                                    <a
                                        href={link.href}
                                        className="text-gray-400 hover:text-primary transition-colors duration-200"
                                    >
                                        {link.label}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Column 3: Company */}
                    <div>
                        <h4 className="font-heading font-semibold text-white mb-4">
                            Company
                        </h4>
                        <ul className="space-y-3">
                            {companyLinks.map((link) => (
                                <li key={link.label}>
                                    <a
                                        href={link.href}
                                        className="text-gray-400 hover:text-primary transition-colors duration-200"
                                    >
                                        {link.label}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Column 4: Connect */}
                    <div>
                        <h4 className="font-heading font-semibold text-white mb-4">
                            Connect
                        </h4>
                        <div className="flex gap-4">
                            {socialLinks.map((link) => (
                                <a
                                    key={link.label}
                                    href={link.href}
                                    aria-label={link.label}
                                    className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-gray-400 hover:bg-primary hover:text-white transition-all duration-200"
                                >
                                    {link.icon}
                                </a>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="pt-8 border-t border-white/10">
                    <p className="text-center text-gray-400 text-sm">
                        © 2024 Sidrat. Built with{" "}
                        <span className="text-red-400" aria-label="love">
                            ❤️
                        </span>{" "}
                        for Muslim parents raising the next generation.
                    </p>
                </div>
            </div>
        </footer>
    );
}
