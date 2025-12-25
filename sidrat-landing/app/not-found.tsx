import Link from "next/link";
import { motion } from "framer-motion";
import { Home, ArrowLeft, Search } from "lucide-react";

export default function NotFound() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-white px-6 relative overflow-hidden">
            {/* Background decorations */}
            <div className="absolute inset-0">
                <div className="absolute top-1/4 left-10 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
                <div className="absolute bottom-1/4 right-10 w-80 h-80 bg-secondary/5 rounded-full blur-3xl" />
            </div>

            <div className="text-center max-w-lg relative z-10">
                {/* 404 Number */}
                <div className="relative mb-8">
                    <span className="text-[150px] sm:text-[200px] font-bold font-heading bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent leading-none">
                        404
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-secondary/20 to-accent/20 blur-3xl -z-10" />
                </div>

                {/* Search Icon */}
                <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-primary/10 to-secondary/10 border border-primary/20 flex items-center justify-center">
                    <Search className="w-8 h-8 text-primary" />
                </div>

                <h1 className="text-3xl sm:text-4xl font-bold text-text-dark mb-4 font-heading">
                    Page Not Found
                </h1>

                <p className="text-lg text-text-secondary mb-8 leading-relaxed">
                    The page you are looking for does not exist or has been moved. 
                    Let us help you find your way back.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link
                        href="/"
                        className="group inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl bg-gradient-to-r from-primary to-secondary text-white font-semibold shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 hover:-translate-y-0.5 transition-all duration-300"
                    >
                        <Home className="w-5 h-5" />
                        Go to Homepage
                    </Link>

                    <button
                        onClick={() => window.history.back()}
                        className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl bg-gray-100 hover:bg-gray-200 text-text-dark font-semibold transition-all duration-300"
                    >
                        <ArrowLeft className="w-5 h-5" />
                        Go Back
                    </button>
                </div>

                {/* Helpful links */}
                <div className="mt-12 pt-8 border-t border-gray-200">
                    <p className="text-sm text-text-secondary mb-4">
                        Or check out these pages:
                    </p>
                    <div className="flex flex-wrap items-center justify-center gap-4">
                        <Link
                            href="/#features"
                            className="text-primary hover:text-primary/80 font-medium transition-colors"
                        >
                            Features
                        </Link>
                        <span className="text-gray-300">|</span>
                        <Link
                            href="/#how-it-works"
                            className="text-primary hover:text-primary/80 font-medium transition-colors"
                        >
                            How It Works
                        </Link>
                        <span className="text-gray-300">|</span>
                        <Link
                            href="/#pricing"
                            className="text-primary hover:text-primary/80 font-medium transition-colors"
                        >
                            Pricing
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
