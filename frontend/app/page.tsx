"use client";

import Navbar from "./components/Navbar";
import HeroSection from "./components/HeroSection";
import FeaturesSection from "./components/FeaturesSection";
import ConnectorsSection from "./components/ConnectorsSection";
import PricingSection from "./components/PricingSection";
import FAQSection from "./components/FAQSection";
import CTASection from "./components/CTASection";
import Footer from "./components/Footer";

export default function LandingPage() {
  const handleGetStarted = () =>
    window.open("/login?register=true","_blank","noopener,noreferrer");

  return (
    <main className="min-h-screen bg-background text-foreground">
      <Navbar />
      <HeroSection onGetStarted={handleGetStarted} />
      <FeaturesSection />
      <ConnectorsSection />
      <PricingSection />
      <FAQSection />
      <CTASection onGetStarted={handleGetStarted} />
      <Footer />
    </main>
  );
}
