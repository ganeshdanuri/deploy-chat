"use client";

import { PLATFORM_FEATURES as features, PAGE_CONTENT } from "../../lib/constants";

export default function FeaturesSection() {
  return (
    <section id="features" className="relative py-16 lg:py-24 bg-white overflow-hidden">

      {/* Subtle radial glow */}
      <div className="radial-glow w-[500px] h-[500px] -top-[150px] -left-[100px] bg-primary/[0.03]" />

      <div className="mx-auto max-w-6xl px-6 lg:px-10">

        {/* ── Section Header ── */}
        <div className="mb-10 text-center">
          {/* Section label badge */}
          <div className="flex items-center justify-center mb-6">
            <div className="inline-flex items-center rounded-full border border-border bg-muted/50 px-3 py-1 shadow-sm">
              <span className="text-sm font-medium text-foreground">
                {PAGE_CONTENT.features.badge}
              </span>
            </div>
          </div>

          <h2 className="text-3xl md:text-[3.25rem] leading-[1.15] text-foreground mb-6">
            {PAGE_CONTENT.features.headlineWait}{" "}
            <span className="gradient-text">{PAGE_CONTENT.features.headlineHighlight}</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto leading-relaxed">
            {PAGE_CONTENT.features.subtitle}
          </p>
        </div>

        {/* ── Features Grid — 3-column with elevated cards ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature) => (
            <div
              key={feature.id}
              className="group relative bg-white rounded-2xl border border-border p-8 lg:p-10 transition-all duration-300 hover:-translate-y-1 hover:bg-gradient-to-br hover:from-primary/[0.02] hover:to-transparent"
              style={{ boxShadow: 'var(--shadow-md)' }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.boxShadow = 'var(--shadow-xl)';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.boxShadow = 'var(--shadow-md)';
              }}
            >
              {/* Icon — gradient background */}
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center mb-6 gradient-bg transition-transform duration-200 group-hover:scale-110"
              >
                <feature.icon className="h-5 w-5 text-white" />
              </div>

              {/* Title */}
              <h3 className="text-lg font-semibold tracking-tight text-foreground mb-3">
                {feature.title}
              </h3>

              {/* Description */}
              <p className="text-[15px] text-muted-foreground leading-relaxed">
                {feature.description}
              </p>

              {/* Subtle bottom accent on hover */}
              <div
                className="absolute bottom-0 left-4 right-4 h-[2px] rounded-full origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300 gradient-bg"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
