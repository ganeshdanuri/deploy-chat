"use client";

import { Suspense } from "react";
import Navbar from "./components/Navbar";
import FeaturesSection from "./components/FeaturesSection";
import HeroSection from "./components/HeroSection";
import Banner from "./components/Banner";
import IntegrationSection from "./components/IntegrationSection";
import PricingSection from "./components/PricingSection";
import TestimonialsSection from "./components/TestimonialsSection";
import FAQSection from "./components/FAQSection";
import CTASection from "./components/CTASection";
import Footer from "./components/Footer";
import { theme } from "./theme";

import { LANDING_STATS as stats } from "../lib/constants";


export default function LandingPage() {

  return (
    <main
      className="min-h-screen relative z-10"
      style={{ background: "transparent" }}
    >
      {/* First Screen */}
      <div className="min-h-screen flex flex-col">
        <Navbar />

        {/* Hero Section */}
        <div className="flex-1 flex flex-col pt-20">
          <HeroSection
            stats={stats}
            onGetStarted={() => window.open('/login?register=true', '_blank', 'noopener,noreferrer')}
          />
        </div>

        {/* Banner Section */}
        <div className="pb-10">
          <Banner />
        </div>
      </div>

      {/* Features Section */}
      <FeaturesSection />

      {/* Integration Section */}
      <IntegrationSection />

      {/* Social Proof */}
      <TestimonialsSection />

      {/* Pricing Section */}
      <PricingSection />

      {/* FAQ Section */}
      <FAQSection />

      {/* Call to Action */}
      <CTASection onGetStarted={() => window.open('/login?register=true', '_blank', 'noopener,noreferrer')} />

      {/* Footer */}
      <Footer />


    </main>
  );
}
