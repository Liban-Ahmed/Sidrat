import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["600", "700"],
});

export const metadata: Metadata = {
  title: "Sidrat - Islamic Curriculum for Muslim Parents",
  description: "Get a personalized Islamic curriculum delivered weekly. Age-appropriate lessons, activities, and conversation starters for ages 2-14.",
  keywords: "Islamic education, Muslim parenting, Islamic curriculum, Muslim children, Quran lessons",
  authors: [{ name: "Sidrat" }],
  openGraph: {
    title: "Sidrat - Islamic Curriculum for Muslim Parents",
    description: "Raise confident Muslim children with personalized weekly lessons",
    type: "website",
    locale: "en_US",
    siteName: "Sidrat",
  },
  twitter: {
    card: "summary_large_image",
    title: "Sidrat - Islamic Curriculum for Muslim Parents",
    description: "Raise confident Muslim children with personalized weekly lessons",
  },
  robots: {
    index: true,
    follow: true,
  },
  metadataBase: new URL('https://sidratapp.com'),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${poppins.variable} antialiased bg-background text-text-dark`}
      >
        <a href="#main-content" className="skip-link">
          Skip to main content
        </a>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
