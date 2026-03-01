"use client";

import { theme } from "../theme";
import { HiArrowRight, HiPlay, HiCheck } from "react-icons/hi";
import { FaRobot, FaBolt, FaTwitter } from "react-icons/fa";
import { HERO_CHECKMARKS, SOCIAL_LINKS } from "../../lib/constants";


interface Stat {
  id: number;
  value: string;
  label: string;
  color: string;
  bgColor: string;
}

interface HeroSectionProps {
  stats: Stat[];
  onGetStarted: () => void;
}

export default function HeroSection({ stats, onGetStarted }: HeroSectionProps) {
  return (
    <section className="relative overflow-hidden bg-transparent pt-10">
      {/* Background Decor - Subtle Gradients for Enterprise Feel */}
      <div
        className="absolute top-0 right-0 -z-10 h-[600px] w-[600px] opacity-20 blur-3xl rounded-full"
        style={{ background: `radial-gradient(circle, #262ef2 0%, transparent 70%)` }}
      />
      <div
        className="absolute bottom-0 left-0 -z-10 h-[400px] w-[400px] opacity-10 blur-3xl rounded-full"
        style={{ background: `radial-gradient(circle, #201f32 0%, transparent 70%)` }}
      />

      <div className="mx-auto max-w-7xl px-6 py-8 lg:py-14">
        <div className="grid gap-16 lg:grid-cols-2 lg:items-center">

          {/* Left Content - Value Proposition */}
          <div className="max-w-2xl space-y-8">
            <div className="flex flex-wrap items-center gap-3">
              {/* Trust Badge */}
              <div
                className="inline-flex items-center gap-2 rounded-lg px-4 py-1.5 text-sm font-normal bg-[#f3f3f9] text-[#201f32]"
              >
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 bg-green-400"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                </span>
                Trusted by 500+ Engineering Teams
              </div>

              {/* Twitter Badge */}
              <a
                href={SOCIAL_LINKS.twitter}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-lg px-4 py-1.5 text-sm font-normal bg-[#201f32]/5 text-[#201f32] hover:bg-[#201f32]/10 transition-colors"
              >
                <FaTwitter size={14} className="text-[#201f32]" />
                Follow for updates
              </a>
            </div>

            {/* Headline */}
            <div className="space-y-4">
              <h1
                className="text-[44px] font-semibold tracking-tight leading-[1.1] text-[#201f32]"
              >
                Build Intelligent <br />
                <span className="text-[#262ef2]">
                  Conversational AI
                </span>
              </h1>
              <p
                className="text-lg lg:text-xl leading-relaxed max-w-lg text-[#4d5564]"
              >
                Deploy enterprise-grade chatbots in minutes, not months.
                Train on your data, integrate seamlessly, and automate support
                with 98% accuracy.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={onGetStarted}
                className="text-sm font-medium flex items-center justify-center gap-2 px-8 py-4 rounded-lg text-white shadow-lg shadow-[#201f32]/20 transition-all hover:-translate-y-1 hover:shadow-xl bg-[#201f32]"
              >
                Start Building Free
                <HiArrowRight className="text-lg" />
              </button>

            </div>

            {/* Feature Checkmarks (Mini) */}
            <div className="pt-4 flex flex-wrap gap-x-8 gap-y-3">
              {HERO_CHECKMARKS.map((item, idx) => (
                <div key={idx} className="flex items-center gap-2 text-sm text-[#4d5564] font-normal">
                  <HiCheck className="text-emerald-500 text-lg" />
                  {item}
                </div>
              ))}
            </div>
          </div>

          {/* Right Content - Visual 'App Interface' */}
          <div className="relative mx-auto w-full max-w-[500px] lg:max-w-none">
            {/* Main 'Dashboard' Card */}
            <div
              className="relative z-10 overflow-hidden rounded-xl shadow-2xl bg-white"
            >
              {/* Fake Window Header */}
              <div className="bg-[#f3f3f9] px-4 py-3 flex items-center gap-2">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-400/80" />
                  <div className="w-3 h-3 rounded-full bg-amber-400/80" />
                  <div className="w-3 h-3 rounded-full bg-emerald-400/80" />
                </div>
                <div className="ml-4 h-2 w-32 rounded-full bg-[#e3e3e3]" />
              </div>

              {/* Window Content */}
              <div className="p-6 space-y-6">
                {/* Header Area */}
                <div className="flex items-center justify-between">
                  <div>
                    <div className="h-2 w-24 bg-[#f3f3f9] rounded mb-2" />
                    <div className="h-4 w-40 bg-[#201f32] rounded opacity-10" />
                  </div>
                  <div
                    className="h-8 w-8 rounded-lg flex items-center justify-center bg-[#262ef2]/5"
                  >
                    <FaRobot className="text-[#262ef2]" />
                  </div>
                </div>

                {/* Graph Area */}
                <div className="space-y-2">
                  <div className="flex items-end gap-2 h-32 pb-2">
                    {[40, 65, 45, 80, 55, 90, 70].map((h, i) => (
                      <div
                        key={i}
                        className="flex-1 rounded-t-sm opacity-80"
                        style={{
                          height: `${h}%`,
                          backgroundColor: i === 5 ? "#262ef2" : "#f3f3f9"
                        }}
                      />
                    ))}
                  </div>
                  <div className="flex justify-between text-xs text-[#a1a1a1]">
                    <span>Mon</span>
                    <span>Sun</span>
                  </div>
                </div>

                {/* List Items */}
                <div className="space-y-3">
                  {[1, 2, 3].map((_, i) => (
                    <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-[#f3f3f9]">
                      <div className="h-8 w-8 rounded bg-white flex items-center justify-center">
                        <div className="h-3 w-3 rounded-full bg-[#e3e3e3]" />
                      </div>
                      <div className="space-y-1.5 flex-1">
                        <div className="h-2 w-full max-w-[120px] bg-[#e3e3e3] rounded" />
                        <div className="h-2 w-3/4 max-w-[80px] bg-[#f3f3f9] rounded" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Floating Card 1: Accuracy */}
            <div
              className="absolute -right-8 -top-8 z-20 hidden lg:flex items-center gap-4 rounded-lg bg-white p-4 shadow-xl animate-bounce-slow"
              style={{ animationDuration: '3s' }}
            >
              <div
                className="flex h-12 w-12 items-center justify-center rounded-lg bg-[#262ef2]/5"
              >
                <FaBolt className="text-xl text-[#262ef2]" />
              </div>
              <div>
                <div className="text-2xl font-semibold text-[#201f32]">{stats[0].value}</div>
                <div className="text-xs font-medium text-[#a1a1a1] uppercase tracking-wider">{stats[0].label}</div>
              </div>
            </div>

            {/* Floating Card 2: Active Users */}
            <div
              className="absolute -left-12 bottom-12 z-20 hidden lg:flex flex-col gap-2 rounded-lg bg-white p-5 shadow-xl"
            >
              <div className="flex items-center gap-3">
                <div className="flex -space-x-2">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-[#f3f3f9]" />
                  ))}
                </div>
                <div className="text-sm font-semibold font-mono text-[#201f32]">+10K</div>
              </div>
              <div className="text-xs font-normal text-[#a1a1a1]">Active Developers</div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}

