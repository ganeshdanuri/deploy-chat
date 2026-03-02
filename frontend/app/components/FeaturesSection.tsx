"use client";

import { PLATFORM_FEATURES as features, PAGE_CONTENT } from "../../lib/constants";

export default function FeaturesSection() {
  return (
    <section id="features" className="relative py-24 bg-white overflow-hidden">

      <div className="mx-auto max-w-[1400px] px-10">

        {/* ── Section Header ── */}
        <div className="mb-14 text-center">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-8 h-[2px] bg-[#3c46dc]" />
            <span className="text-xs font-semibold text-[#4a4a5a] tracking-wide uppercase">
              {PAGE_CONTENT.features.badge}
            </span>
            <div className="w-8 h-[2px] bg-[#3c46dc]" />
          </div>
          <h2 className="text-[40px] md:text-[44px] font-semibold text-[#201f32] mb-6 leading-tight tracking-tight">
            {PAGE_CONTENT.features.headlineWait}{" "}
            <span className="text-[#3c46dc]">{PAGE_CONTENT.features.headlineHighlight}</span>
          </h2>
          <p className="text-lg text-[#5a5a6a] max-w-xl mx-auto leading-relaxed">
            {PAGE_CONTENT.features.subtitle}
          </p>
        </div>

        {/* ── Features Grid — 3-column, clean ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-[#e8e8f0]">
          {features.map((feature) => (
            <div
              key={feature.id}
              className="group relative bg-white p-10 transition-colors duration-200 hover:bg-[#fafaff]"
            >
              {/* Icon */}
              <div
                className="w-11 h-11 flex items-center justify-center mb-6 transition-transform duration-200 group-hover:scale-105"
                style={{ backgroundColor: `${feature.color}0a`, color: feature.color }}
              >
                <feature.icon className="h-5 w-5" />
              </div>

              {/* Title */}
              <h3 className="text-lg font-semibold text-[#201f32] mb-3">
                {feature.title}
              </h3>

              {/* Description */}
              <p className="text-[15px] text-[#5a5a6a] leading-relaxed">
                {feature.description}
              </p>

              {/* Subtle bottom accent on hover */}
              <div
                className="absolute bottom-0 left-0 h-[2px] w-0 group-hover:w-full transition-all duration-300"
                style={{ backgroundColor: feature.color }}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
