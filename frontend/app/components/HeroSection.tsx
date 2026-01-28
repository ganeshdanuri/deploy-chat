"use client";

import { theme } from "../theme";
import { HiTrendingUp, HiArrowRight } from "react-icons/hi";
import { FaRobot } from "react-icons/fa";

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
    <section className="mx-auto max-w-7xl px-6 py-8 lg:py-12">
      <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
        {/* Left Side - Content */}
        <div className="flex flex-col justify-center space-y-6">
          {/* Growth Badge */}
          <div className="flex items-center gap-3">
            <div
              className="flex h-12 w-12 items-center justify-center rounded-xl border-2 shrink-0"
              style={{ borderColor: theme.colors.primary.main, color: theme.colors.primary.main }}
            >
              <HiTrendingUp className="h-7 w-7" />
            </div>
            <div>
              <h3
                className="text-lg lg:text-xl font-semibold"
                style={{ color: theme.colors.neutral[900] }}
              >
                AI Powered
              </h3>
              <p className="text-sm lg:text-base" style={{ color: theme.colors.neutral[600] }}>
                <span className="font-semibold">Next-Gen</span> Chatbot Platform
              </p>
            </div>
          </div>

          {/* Main Heading */}
          <h1
            className="text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight"
            style={{ color: theme.colors.neutral[900] }}
          >
            AI Chatbots
          </h1>

          {/* Features Grid */}
          <div className="grid gap-6 sm:grid-cols-2 pt-2">
            {features.map((feature) => (
              <div key={feature.id} className="space-y-2">
                <h3
                  className="text-lg lg:text-xl font-semibold"
                  style={{ color: theme.colors.neutral[900] }}
                >
                  {feature.title}
                </h3>
                <p
                  className="text-sm leading-relaxed"
                  style={{ color: theme.colors.neutral[600] }}
                >
                  {feature.description}
                </p>
              </div>
            ))}
            <button
                  onClick={onGetStarted}
                  className="flex items-center gap-2 text-sm font-medium transition-all hover:gap-3 pt-1"
                  style={{ color: theme.colors.neutral[900] }}
                >
                  Get Started
                  <HiArrowRight className="text-lg" />
                </button>
          </div>
        </div>

        {/* Right Side - Stats & Visual */}
        <div className="relative flex items-center justify-center min-h-[400px] lg:min-h-[500px]">
          <div className="relative w-full h-full max-w-lg aspect-square">
            {/* Green Circle - 98% */}
            <div
              className="absolute left-0 top-0 flex h-40 w-40 sm:h-48 sm:w-48 lg:h-56 lg:w-56 flex-col items-center justify-center rounded-full shadow-lg"
              style={{ backgroundColor: stats[0].bgColor }}
            >
              <div
                className="text-4xl sm:text-5xl lg:text-6xl font-bold"
                style={{ color: stats[0].color }}
              >
                {stats[0].value}
              </div>
              <div
                className="mt-2 text-center text-xs sm:text-sm font-medium"
                style={{ color: theme.colors.neutral[900] }}
              >
                {stats[0].label.split(" ")[0]}
                <br />
                {stats[0].label.split(" ")[1]}
              </div>
            </div>

            {/* Yellow Circle - Phone Mockup */}
            <div
              className="absolute bottom-0 left-8 sm:left-12 flex h-52 w-52 sm:h-60 sm:w-60 lg:h-64 lg:w-64 items-center justify-center rounded-full shadow-lg"
              style={{ backgroundColor: stats[1].bgColor }}
            >
              <div
                className="relative h-40 w-24 sm:h-44 sm:w-26 lg:h-48 lg:w-28 overflow-hidden rounded-3xl bg-white"
                style={{ boxShadow: theme.shadows.xl }}
              >
                <div className="p-2 sm:p-3">
                  {/* Phone Header */}
                  <div className="mb-2 flex items-center gap-2">
                    <div
                      className="h-6 w-6 sm:h-7 sm:w-7 lg:h-8 lg:w-8 rounded-full shrink-0"
                      style={{ backgroundColor: theme.colors.primary.main }}
                    />
                    <div
                      className="h-4 w-10 sm:h-5 sm:w-12 rounded-full"
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
                          className="h-3 w-3 sm:h-4 sm:w-4 rounded-full"
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
              className="absolute right-0 top-4 sm:top-6 lg:top-8 flex h-56 w-56 sm:h-64 sm:w-64 lg:h-72 lg:w-72 items-center justify-center overflow-hidden rounded-full shadow-lg"
            >
              <img
                src="/chat.jpg"
                alt="Profile"
                className="h-48 w-48 sm:h-56 sm:w-56 lg:h-64 lg:w-64 rounded-full object-cover"
              />
            </div>

            {/* White Circle - 10K+ */}
            <div
              className="absolute bottom-2 right-4 sm:bottom-4 sm:right-6 lg:right-0 flex h-32 w-32 sm:h-36 sm:w-36 lg:h-40 lg:w-40 flex-col items-center justify-center rounded-full bg-white shadow-xl"
            >
              <div
                className="text-3xl sm:text-4xl lg:text-5xl font-bold"
                style={{ color: theme.colors.neutral[900] }}
              >
                {stats[2].value}
              </div>
              <div
                className="mt-1 text-center text-xs sm:text-sm font-medium"
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
