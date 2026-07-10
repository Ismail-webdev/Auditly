import Footer from "@/components/landing/Footer";
import FooterCTA from "@/components/landing/FooterCTA";
import Hero from "@/components/landing/Hero";
import HowItWorks from "@/components/landing/HowItWorks";
import Navbar from "@/components/landing/Navbar";
import Pricing from "@/components/landing/Pricing";
import WhatWeCheck from "@/components/landing/WhatWeCheck";

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-[#0A0A0F] text-[#F8F8FF]">
      <Navbar />
      <Hero />
      <HowItWorks />
      <WhatWeCheck />
      <Pricing />
      <FooterCTA />
      <Footer />
    </main>
  );
}
