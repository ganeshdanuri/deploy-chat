"use client";

import { useState } from "react";
import Navbar from "./components/Navbar";
import LoginModal from "./components/LoginModal";
import FeaturesSection from "./components/FeaturesSection";
import HeroSection from "./components/HeroSection";
import Banner from "./components/Banner";
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
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  
  return (
    <main 
      className="min-h-screen"
      style={{ background: "white" }}
    >
      {/* First Screen - 100vh */}
      <div className="h-screen flex flex-col">
        <Navbar />

        {/* Hero Section and Companies Section - flex grow to fill space */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Hero Section */}
          <HeroSection 
            features={features} 
            stats={stats} 
            onGetStarted={() => setIsLoginModalOpen(true)} 
          />
        </div>

        {/* Banner - at the bottom of 100vh */}
         <Banner 
          stats={stats} 
          onStartNow={() => setIsLoginModalOpen(true)} 
        />
      </div>

      {/* Features Section - appears after scrolling */}
      <FeaturesSection />

      <LoginModal 
        isOpen={isLoginModalOpen} 
        onClose={() => setIsLoginModalOpen(false)} 
      />
    </main>
  );
}
