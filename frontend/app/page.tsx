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

const stats = [
  {
    id: 1,
    value: "98%",
    label: "Accuracy Rate",
    color: theme.colors.accent.green,
    bgColor: theme.colors.accent.greenLight,
  },
  {
    id: 2,
    value: "24/7",
    label: "Always Available",
    color: theme.colors.accent.yellow,
    bgColor: theme.colors.accent.yellowLight,
  },
  {
    id: 3,
    value: "10K+",
    label: "Active Users",
    color: theme.colors.accent.purple,
    bgColor: theme.colors.accent.purpleLight,
  },
];

const features = [
  {
    id: 1,
    title: "Easy Integration",
    description: "Add AI chatbots to your website in minutes with our simple embed code and comprehensive documentation.",
    icon: "⚡",
  },
  {
    id: 2,
    title: "Smart AI Responses",
    description: "Train chatbots on your own content and provide accurate, contextual answers to customer queries instantly.",
    icon: "🎯",
  },
];

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
            features={features}
            stats={stats}
            onGetStarted={() => window.open('/login?register=true', '_blank', 'noopener,noreferrer')}
          />
        </div>

        {/* Banner Section */}
        <div className="pb-10">
          <Banner
            stats={stats}
            onStartNow={() => window.open('/login?register=true', '_blank', 'noopener,noreferrer')}
          />
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
