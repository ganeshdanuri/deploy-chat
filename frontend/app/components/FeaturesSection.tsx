"use client";

import { theme } from "../theme";

const features = [
  {
    id: 1,
    title: "Easy Integration",
    description: "Add AI chatbots to your website with just a few lines of code. No complex setup required.",
    icon: "⚡",
    color: "#10b981",
    bgColor: "#d1fae5",
  },
  {
    id: 2,
    title: "Custom Training",
    description: "Train your chatbot on your own content, documentation, and knowledge base for accurate responses.",
    icon: "🎯",
    color: "#6366f1",
    bgColor: "#e0e7ff",
  },
  {
    id: 3,
    title: "24/7 Support",
    description: "Your AI chatbot works around the clock to provide instant answers to your customers' questions.",
    icon: "🌐",
    color: "#fbbf24",
    bgColor: "#fef3c7",
  },
  {
    id: 4,
    title: "Analytics Dashboard",
    description: "Track conversations, user satisfaction, and chatbot performance with detailed analytics.",
    icon: "📊",
    color: "#8b5cf6",
    bgColor: "#ede9fe",
  },
  {
    id: 5,
    title: "Multi-language",
    description: "Support customers in multiple languages with AI-powered translation and understanding.",
    icon: "🗣️",
    color: "#10b981",
    bgColor: "#d1fae5",
  },
  {
    id: 6,
    title: "Seamless Handoff",
    description: "Smoothly transfer complex queries to human agents when needed with context preservation.",
    icon: "🤝",
    color: "#6366f1",
    bgColor: "#e0e7ff",
  },
];

export default function FeaturesSection() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-24">
      {/* Section Header */}
      <div className="mb-16 text-center">
        <h2 
          className="mb-4 text-5xl font-bold"
          style={{ color: theme.colors.neutral[900] }}
        >
          Powerful Features~
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
            className="group relative overflow-hidden rounded-2xl p-8 transition-all duration-300 hover:scale-105 hover:shadow-xl"
            style={{ 
              backgroundColor: 'white',
              boxShadow: theme.shadows.md 
            }}
          >
            {/* Icon Badge */}
            <div 
              className="mb-6 flex h-16 w-16 items-center justify-center rounded-xl text-3xl transition-transform duration-300 group-hover:scale-110"
              style={{ 
                backgroundColor: feature.bgColor,
                boxShadow: theme.shadows.sm 
              }}
            >
              {feature.icon}
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
              
              {/* Learn More Link */}
              <button
                className="flex items-center gap-2 text-sm font-semibold transition-all hover:gap-3"
                style={{ color: feature.color }}
              >
                Learn more
                <span>→</span>
              </button>
            </div>

            {/* Accent Border on Hover */}
            <div 
              className="absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
              style={{ 
                border: `3px solid ${feature.color}`,
                pointerEvents: 'none'
              }}
            />
          </div>
        ))}
      </div>
    </section>
  );
}
