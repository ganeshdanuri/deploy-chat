"use client";

import { theme } from "../theme";
import { HiLightningBolt, HiGlobe, HiChartBar, HiUserGroup } from "react-icons/hi";
import { FaBrain, FaRobot } from "react-icons/fa";
import { MdIntegrationInstructions, MdSupportAgent } from "react-icons/md";

const features = [
  {
    id: 1,
    title: "Easy Integration",
    description: "Add AI chatbots to your website with just a few lines of code. No complex setup required.",
    icon: MdIntegrationInstructions,
    color: theme.colors.primary.main,
  },
  {
    id: 2,
    title: "Custom Training",
    description: "Train your chatbot on your own content, documentation, and knowledge base for accurate responses.",
    icon: FaBrain,
    color: theme.colors.accent.purple,
  },
  {
    id: 3,
    title: "24/7 Support",
    description: "Your AI chatbot works around the clock to provide instant answers to your customers' questions.",
    icon: HiGlobe,
    color: theme.colors.accent.green,
  },
  {
    id: 4,
    title: "Analytics Dashboard",
    description: "Track conversations, user satisfaction, and chatbot performance with detailed analytics.",
    icon: HiChartBar,
    color: theme.colors.accent.blue,
  },
  {
    id: 5,
    title: "Multi-language",
    description: "Support customers in multiple languages with AI-powered translation and understanding.",
    icon: HiUserGroup,
    color: theme.colors.accent.yellow,
  },
  {
    id: 6,
    title: "Seamless Handoff",
    description: "Smoothly transfer complex queries to human agents when needed with context preservation.",
    icon: MdSupportAgent,
    color: theme.colors.accent.teal,
  },
];

export default function FeaturesSection() {
  return (
    <section id="features" className="mx-auto max-w-7xl px-6 py-24">
      {/* Section Header */}
      <div className="mb-16 text-center">
        <h2 
          className="mb-4 text-5xl font-bold"
          style={{ color: theme.colors.neutral[900] }}
        >
          Powerful Features
        </h2>
        <p 
          className="mx-auto max-w-2xl text-lg font-medium"
          style={{ color: theme.colors.neutral[600] }}
        >
          Everything you need to create intelligent, responsive AI chatbots that delight your customers
        </p>
      </div>

      {/* Features Grid */}
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {features.map((feature) => (
          <div
            key={feature.id}
            className="group relative overflow-hidden rounded-2xl p-10 transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl border-2"
            style={{ 
              border: `1px solid ${theme.colors.neutral[400]}`,
            }}
          >
            {/* Icon Badge */}
            <div 
              className="mb-6 flex h-16 w-16 items-center justify-center rounded-xl transition-all duration-500 group-hover:scale-110 group-hover:rotate-3"
              style={{ 
                backgroundColor: theme.colors.neutral[50],
                color: feature.color
              }}
            >
              <feature.icon className="h-8 w-8" />
            </div>

            {/* Feature Content */}
            <div>
              <h3 
                className="mb-3 text-xl font-bold"
                style={{ color: theme.colors.neutral[900] }}
              >
                {feature.title}
              </h3>
              <p 
                className="mb-6 text-sm leading-relaxed"
                style={{ color: theme.colors.neutral[600] }}
              >
                {feature.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
