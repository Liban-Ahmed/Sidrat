import { Hero } from "@/components/sections/Hero";
import { Problem } from "@/components/sections/Problem";
import { Solution } from "@/components/sections/Solution";
import { Features } from "@/components/sections/Features";
import { HowItWorks } from "@/components/sections/HowItWorks";
import { Pricing } from "@/components/sections/Pricing";
import { Footer } from "@/components/sections/Footer";

export default function Home() {
  return (
    <>
      <main id="main-content">
        <Hero />
        <Problem />
        <Solution />
        <Features />
        <HowItWorks />
        <Pricing />
      </main>
      <Footer />
    </>
  );
}
