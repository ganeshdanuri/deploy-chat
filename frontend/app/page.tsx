"use client";

import Navbar from "./components/Navbar";
import FeaturesSection from "./components/FeaturesSection";
import HeroSection from "./components/HeroSection";
import Banner from "./components/Banner";
import IntegrationSection from "./components/IntegrationSection";
import PricingSection from "./components/PricingSection";
import FAQSection from "./components/FAQSection";
import CTASection from "./components/CTASection";
import Footer from "./components/Footer";

import { LANDING_STATS as stats } from "../lib/constants";


export default function LandingPage() {

  return (
    <main
      className="min-h-screen relative z-10 overflow-hidden"
      style={{ background: "transparent" }}
    >
      {/* Subtle Background Geometries & Thin Lines */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        {/* Geometric Shapes */}
        <div className="absolute top-[40%] left-[20%] w-48 h-48 border border-slate-300 rotate-45 opacity-25" />
        <div className="absolute top-[80%] left-[10%] w-56 h-56 border border-slate-300 opacity-20 rotate-12" />

        {/* Thin Lines */}
        <div className="absolute top-0 left-[15%] w-[1px] h-full bg-gradient-to-b from-transparent via-slate-300 to-transparent opacity-40" />
        <div className="absolute top-0 right-[20%] w-[1px] h-full bg-gradient-to-b from-transparent via-slate-300 to-transparent opacity-40" />
        <div className="absolute top-[30%] left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-slate-300 to-transparent opacity-40" />
        <div className="absolute top-[70%] left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-slate-300 to-transparent opacity-40" />
      </div>

      {/* First Screen */}
      <div className="min-h-screen flex flex-col">
        <Navbar />

        {/* Hero Section */}
        <div className="flex-1 flex flex-col pt-16">
          <HeroSection
            stats={stats}
            onGetStarted={() => window.open('/login?register=true', '_blank', 'noopener,noreferrer')}
          />
        </div>

        {/* Banner Section */}
        <Banner />
      </div>

      {/* Features Section */}
      <FeaturesSection />

      {/* Integration Section */}
      <IntegrationSection />

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
