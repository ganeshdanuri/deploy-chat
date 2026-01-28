"use client";

import { theme } from "../theme";

interface Feature {
  id: number;
  title: string;
  description: string;
  icon: string;
}

interface Stat {
  id: number;
  value: string;
  label: string;
  color: string;
  bgColor: string;
}

interface HeroSectionProps {
  features: Feature[];
  stats: Stat[];
  onGetStarted: () => void;
}

export default function HeroSection({ features, stats, onGetStarted }: HeroSectionProps) {
  return (
    <section className="mx-auto max-w-7xl px-6 py-16">
      <div className="grid gap-8 lg:grid-cols-2">
        {/* Left Side - Content */}
        <div className="flex flex-col justify-center">
          {/* Growth Badge */}
          <div className="mb-8 flex items-center gap-3">
            <div
              className="flex h-12 w-12 items-center justify-center rounded-xl border-2"
              style={{ borderColor: theme.colors.neutral[900] }}
            >
              <svg
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                />
              </svg>
            </div>
            <div>
              <h3
                className="text-xl font-semibold"
                style={{ color: theme.colors.neutral[900] }}
              >
                AI Powered
              </h3>
              <p style={{ color: theme.colors.neutral[600] }}>
                <span className="font-semibold">Next-Gen</span> Chatbot Platform
              </p>
            </div>
          </div>

          {/* Main Heading */}
          <h1
            className="mb-8 text-7xl font-bold leading-none"
            style={{ color: theme.colors.neutral[900] }}
          >
            AI Chatbots~
          </h1>

          {/* Features Grid */}
          <div className="mb-8 grid gap-6 sm:grid-cols-2">
            {features.map((feature) => (
              <div key={feature.id}>
                <h3
                  className="mb-2 text-xl font-semibold"
                  style={{ color: theme.colors.neutral[900] }}
                >
                  {feature.title}
                </h3>
                <p
                  className="mb-4 text-sm leading-relaxed"
                  style={{ color: theme.colors.neutral[600] }}
                >
                  {feature.description}
                </p>
                <button
                  onClick={onGetStarted}
                  className="flex items-center gap-2 text-sm font-medium transition-all hover:gap-3"
                  style={{ color: theme.colors.neutral[900] }}
                >
                  Get Started
                  <span>→</span>
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Right Side - Stats & Visual */}
        <div className="relative flex items-center justify-center">
          <div className="relative w-full max-w-md">
            {/* Green Circle - 98% */}
            <div
              className="absolute left-0 top-0 flex h-56 w-56 flex-col items-center justify-center rounded-full"
              style={{ backgroundColor: stats[0].bgColor }}
            >
              <div
                className="text-6xl font-bold"
                style={{ color: stats[0].color }}
              >
                {stats[0].value}
              </div>
              <div
                className="mt-2 text-center text-sm font-medium"
                style={{ color: theme.colors.neutral[900] }}
              >
                {stats[0].label.split(" ")[0]}
                <br />
                {stats[0].label.split(" ")[1]}
              </div>
            </div>

            {/* Yellow Circle - Phone Mockup */}
            <div
              className="absolute bottom-0 left-0 flex h-64 w-64 items-center justify-center rounded-full"
              style={{ backgroundColor: stats[1].bgColor }}
            >
              <div
                className="relative h-48 w-28 overflow-hidden rounded-3xl bg-white"
                style={{ boxShadow: theme.shadows.xl }}
              >
                <div className="p-3">
                  {/* Phone Header */}
                  <div className="mb-2 flex items-center gap-2">
                    <div
                      className="h-8 w-8 rounded-full"
                      style={{ backgroundColor: theme.colors.primary.main }}
                    />
                    <div
                      className="h-5 w-12 rounded-full"
                      style={{ backgroundColor: stats[0].color }}
                    />
                  </div>

                  {/* Phone Content */}
                  <div className="mb-2">
                    <div
                      className="mb-1 text-xs font-semibold"
                      style={{ color: theme.colors.neutral[900] }}
                    >
                      Today
                    </div>
                    <div
                      className="text-xs font-medium"
                      style={{ color: theme.colors.neutral[900] }}
                    >
                      Active Chats (12)
                    </div>
                    <div
                      className="text-xs"
                      style={{ color: theme.colors.neutral[500] }}
                    >
                      ~
                    </div>
                  </div>

                  <div
                    className="mb-1 text-xs font-medium"
                    style={{ color: theme.colors.neutral[600] }}
                  >
                    Recent —
                  </div>

                  <div
                    className="rounded-lg p-2"
                    style={{ backgroundColor: theme.colors.neutral[100] }}
                  >
                    <div
                      className="text-xs font-medium"
                      style={{ color: theme.colors.neutral[900] }}
                    >
                      Customer Support
                    </div>
                    <div
                      className="text-xs"
                      style={{ color: theme.colors.neutral[500] }}
                    >
                      Live now - 24/7
                    </div>
                    <div className="mt-2 flex gap-1">
                      {[1, 2, 3].map((i) => (
                        <div
                          key={i}
                          className="h-4 w-4 rounded-full"
                          style={{
                            backgroundColor:
                              i === 1
                                ? stats[0].color
                                : i === 2
                                ? theme.colors.primary.main
                                : stats[2].color,
                          }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Purple Circle - Profile */}
            <div
              className="absolute right-0 top-8 flex h-72 w-72 items-center justify-center overflow-hidden rounded-full"
              style={{ backgroundColor: stats[2].bgColor }}
            >
              <img
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop"
                alt="Profile"
                className="h-64 w-64 rounded-full object-cover"
                style={{ filter: "grayscale(100%)" }}
              />
              
              {/* Stamp Badge */}
              <div
                className="absolute right-4 top-4 flex h-16 w-16 items-center justify-center rounded-full border-4 border-dashed"
                style={{
                  backgroundColor: stats[1].bgColor,
                  borderColor: stats[1].color,
                }}
              >
                <div className="text-center text-xs font-bold">
                  <div>AI</div>
                  <div>Chat</div>
                </div>
              </div>
            </div>

            {/* White Circle - 10K+ */}
            <div
              className="absolute bottom-4 right-0 flex h-40 w-40 flex-col items-center justify-center rounded-full bg-white"
              style={{ boxShadow: theme.shadows.xl }}
            >
              <div
                className="text-5xl font-bold"
                style={{ color: theme.colors.neutral[900] }}
              >
                {stats[2].value}
              </div>
              <div
                className="mt-1 text-center text-sm font-medium"
                style={{ color: theme.colors.neutral[900] }}
              >
                {stats[2].label.split(" ")[0]}
                <br />
                {stats[2].label.split(" ")[1]}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
