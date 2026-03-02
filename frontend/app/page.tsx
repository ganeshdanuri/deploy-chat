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



export default function LandingPage() {

  return (
    <main
      className="min-h-screen relative z-10 overflow-hidden"
      style={{ background: "transparent" }}
    >
      {/* First Screen */}
      <div className="min-h-screen flex flex-col">
        <Navbar />

        {/* Hero Section */}
        <div className="flex-1 flex flex-col pt-16">
          <HeroSection
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
