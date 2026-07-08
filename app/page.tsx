import Hero from "@/components/landing/Hero";
import Navbar from "@/components/landing/Navbar";

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-[#0A0A0F] text-[#F8F8FF]">
      <Navbar />
      <Hero />
    </main>
  );
}
