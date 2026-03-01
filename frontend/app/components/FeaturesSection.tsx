"use client";

import { theme } from "../theme";
import { PLATFORM_FEATURES as features } from "../../lib/constants";



export default function FeaturesSection() {
  return (
    <section id="features" className="relative py-20 bg-transparent overflow-hidden">
      {/* Background Gradients */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-purple-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
      </div>

      <div className="mx-auto max-w-7xl px-6">
        {/* Section Header */}
        <div className="mb-16 text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center justify-center px-3 py-1 mb-4 rounded-lg bg-[#262ef2]/10 text-[#262ef2] text-xs font-semibold tracking-widest uppercase">
            Powerful Features
          </div>
          <h2
            className="text-[44px] font-semibold mb-6 tracking-tight leading-tight"
            style={{ color: "#000000" }}
          >
            Everything you need to build <br className="hidden md:block" />
            <span style={{ color: theme.colors.primary.main }}>
              Intelligent Chatbots
            </span>
          </h2>
          <p
            className="text-lg leading-relaxed"
            style={{ color: theme.colors.neutral[600] }}
          >
            A complete suite of tools designed for developers and businesses to create, deploy, and manage AI conversational agents.
          </p>
        </div>

        {/* Features Grid - Bento Style */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature) => (
            <div
              key={feature.id}
              className={`group relative overflow-hidden rounded-xl p-8 transition-all duration-300 hover:shadow-xl bg-[#f3f3f9] hover:bg-white ${feature.span}`}
            >
              {/* Hover Gradient Background */}
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-5 transition-opacity duration-300"
                style={{ backgroundColor: feature.color }}
              />

              <div className="relative z-10 h-full flex flex-col">
                <div className="flex items-start justify-between mb-6">
                  <div
                    className="flex h-12 w-12 items-center justify-center rounded-lg shadow-sm transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-3"
                    style={{
                      backgroundColor: `${feature.color}15`,
                      color: feature.color
                    }}
                  >
                    <feature.icon className="h-6 w-6" />
                  </div>
                  {/* Subtle arrow that appears on hover */}
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 -translate-x-2 group-hover:translate-x-0">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={feature.color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="7" y1="17" x2="17" y2="7"></line><polyline points="7 7 17 7 17 17"></polyline></svg>
                  </div>
                </div>

                <h3
                  className="text-xl font-medium mb-3"
                  style={{ color: "#000000" }}
                >
                  {feature.title}
                </h3>
                <p
                  className="text-base leading-relaxed flex-grow"
                  style={{ color: theme.colors.neutral[600] }}
                >
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
