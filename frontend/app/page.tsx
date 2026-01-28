"use client";

import { useState } from "react";
import Navbar from "./components/Navbar";
import LoginModal from "./components/LoginModal";
import FeaturesSection from "./components/FeaturesSection";
import HeroSection from "./components/HeroSection";
import Banner from "./components/Banner";
import CompaniesSection from "./components/CompaniesSection";
import { theme } from "./theme";

const stats = [
  {
    id: 1,
    value: "98%",
    label: "Accuracy Rate",
    color: "#10b981",
    bgColor: "#d1fae5",
  },
  {
    id: 2,
    value: "24/7",
    label: "Always Available",
    color: "#fbbf24",
    bgColor: "#fef3c7",
  },
  {
    id: 3,
    value: "10K+",
    label: "Active Users",
    color: "#8b5cf6",
    bgColor: "#ede9fe",
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

const companies = [
  { name: "Company A", logo: "BRAND A" },
  { name: "Company B", logo: "BRAND B" },
  { name: "Company C", logo: "BRAND C" },
  { name: "Company D", logo: "BRAND D" },
  { name: "Company E", logo: "BRAND E" },
];

export default function LandingPage() {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  
  return (
    <main 
      className="min-h-screen"
      style={{ background: theme.gradients.page }}
    >
      <Navbar />

      {/* Hero Section */}
      <HeroSection 
        features={features} 
        stats={stats} 
        onGetStarted={() => setIsLoginModalOpen(true)} 
      />

      {/* Companies Section */}
      <div className="mx-auto max-w-7xl px-6">
        <CompaniesSection companies={companies} />
      </div>

      {/* Banner */}
      <Banner 
        stats={stats} 
        onStartNow={() => setIsLoginModalOpen(true)} 
      />

      {/* Features Section */}
      <FeaturesSection />

      <LoginModal 
        isOpen={isLoginModalOpen} 
        onClose={() => setIsLoginModalOpen(false)} 
      />
    </main>
  );
}
