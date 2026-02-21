"use client";

import { theme } from "../theme";
import { HiArrowRight, HiPlay, HiCheck } from "react-icons/hi";
import { FaRobot, FaBolt } from "react-icons/fa";
import { HERO_CHECKMARKS } from "../../lib/constants";


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
      {/* Subtle Background Geometries & Thin Lines for Hero */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        {/* Geometric Shapes */}
        <div className="absolute top-[15%] left-[5%] w-32 h-32 border border-slate-300 rounded-lg opacity-25 rotate-12" />
        <div className="absolute top-[5%] right-[25%] w-24 h-24 border border-slate-300 opacity-20 rotate-45" />

        {/* Thin Lines - REMOVED TO PREVENT COLLISION WITH BUTTONS */}
      </div>

      {/* Background Decor - Subtle Gradients for Enterprise Feel */}
      <div
        className="absolute top-0 right-0 -z-10 h-[600px] w-[600px] opacity-20 blur-3xl rounded-full"
        style={{ background: `radial-gradient(circle, ${theme.colors.primary.light} 0%, transparent 70%)` }}
      />
      <div
        className="absolute bottom-0 left-0 -z-10 h-[400px] w-[400px] opacity-10 blur-3xl rounded-full"
        style={{ background: `radial-gradient(circle, ${theme.colors.accent.purple} 0%, transparent 70%)` }}
      />

      <div className="mx-auto max-w-7xl px-6 py-8 lg:py-14">
        <div className="grid gap-16 lg:grid-cols-2 lg:items-center">

          {/* Left Content - Value Proposition */}
          <div className="max-w-2xl space-y-8">
            {/* Trust Badge */}
            <div
              className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-medium border"
              style={{
                borderColor: theme.colors.neutral[200],
                backgroundColor: theme.colors.neutral[50],
                color: theme.colors.neutral[700]
              }}
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 bg-green-400"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
              </span>
              Trusted by 500+ Engineering Teams
            </div>

            {/* Headline */}
            <div className="space-y-4">
              <h1
                className="text-4xl font-bold tracking-tight leading-[1.1]"
                style={{ color: theme.colors.neutral[900] }}
              >
                Build Intelligent <br />
                <span style={{ color: theme.colors.primary.main }}>
                  Conversational AI
                </span>
              </h1>
              <p
                className="text-lg lg:text-xl leading-relaxed max-w-lg"
                style={{ color: theme.colors.neutral[600] }}
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
                className="text-sm font-medium flex items-center justify-center gap-2 px-8 py-4 rounded-xl text-white shadow-lg shadow-blue-500/20 transition-all hover:-translate-y-1 hover:shadow-xl"
                style={{ background: theme.gradients.primaryButton }}
              >
                Start Building Free
                <HiArrowRight className="text-lg" />
              </button>

              <button
                className="text-sm font-medium flex items-center justify-center gap-2 px-8 py-4 rounded-xl border transition-all hover:bg-slate-50"
                style={{
                  color: theme.colors.neutral[700],
                  borderColor: theme.colors.neutral[300]
                }}
              >
                <HiPlay className="text-lg" />
                View Demo
              </button>
            </div>

            {/* Feature Checkmarks (Mini) */}
            <div className="pt-4 flex flex-wrap gap-x-8 gap-y-3">
              {HERO_CHECKMARKS.map((item, idx) => (
                <div key={idx} className="flex items-center gap-2 text-sm text-slate-500 font-medium">
                  <HiCheck className="text-green-500 text-lg" />
                  {item}
                </div>
              ))}
            </div>
          </div>

          {/* Right Content - Visual 'App Interface' */}
          <div className="relative mx-auto w-full max-w-[500px] lg:max-w-none">
            {/* Main 'Dashboard' Card */}
            <div
              className="relative z-10 overflow-hidden rounded-2xl border shadow-2xl bg-white"
              style={{ borderColor: theme.colors.neutral[200] }}
            >
              {/* Fake Window Header */}
              <div className="border-b bg-slate-50 px-4 py-3 flex items-center gap-2">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-400/80" />
                  <div className="w-3 h-3 rounded-full bg-amber-400/80" />
                  <div className="w-3 h-3 rounded-full bg-green-400/80" />
                </div>
                <div className="ml-4 h-2 w-32 rounded-full bg-slate-200" />
              </div>

              {/* Window Content */}
              <div className="p-6 space-y-6">
                {/* Header Area */}
                <div className="flex items-center justify-between">
                  <div>
                    <div className="h-2 w-24 bg-slate-200 rounded mb-2" />
                    <div className="h-4 w-40 bg-slate-800 rounded opacity-10" />
                  </div>
                  <div
                    className="h-8 w-8 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: theme.colors.primary.lightest }}
                  >
                    <FaRobot style={{ color: theme.colors.primary.main }} />
                  </div>
                </div>

                {/* Graph Area */}
                <div className="space-y-2">
                  <div className="flex items-end gap-2 h-32 pb-2 border-b border-slate-100">
                    {[40, 65, 45, 80, 55, 90, 70].map((h, i) => (
                      <div
                        key={i}
                        className="flex-1 rounded-t-sm opacity-80"
                        style={{
                          height: `${h}%`,
                          backgroundColor: i === 5 ? theme.colors.primary.main : theme.colors.primary.lightest
                        }}
                      />
                    ))}
                  </div>
                  <div className="flex justify-between text-xs text-slate-400">
                    <span>Mon</span>
                    <span>Sun</span>
                  </div>
                </div>

                {/* List Items */}
                <div className="space-y-3">
                  {[1, 2, 3].map((_, i) => (
                    <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-slate-50 border border-slate-100">
                      <div className="h-8 w-8 rounded bg-white border border-slate-200 flex items-center justify-center">
                        <div className="h-3 w-3 rounded-full bg-slate-200" />
                      </div>
                      <div className="space-y-1.5 flex-1">
                        <div className="h-2 w-full max-w-[120px] bg-slate-300 rounded" />
                        <div className="h-2 w-3/4 max-w-[80px] bg-slate-200 rounded" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Floating Card 1: Accuracy */}
            <div
              className="absolute -right-8 -top-8 z-20 hidden lg:flex items-center gap-4 rounded-xl bg-white p-4 shadow-xl border border-slate-100 animate-bounce-slow"
              style={{ animationDuration: '3s' }}
            >
              <div
                className="flex h-12 w-12 items-center justify-center rounded-lg"
                style={{ backgroundColor: stats[0].bgColor }}
              >
                <FaBolt className="text-xl" style={{ color: stats[0].color }} />
              </div>
              <div>
                <div className="text-2xl font-bold text-slate-900">{stats[0].value}</div>
                <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{stats[0].label}</div>
              </div>
            </div>

            {/* Floating Card 2: Active Users */}
            <div
              className="absolute -left-12 bottom-12 z-20 hidden lg:flex flex-col gap-2 rounded-xl bg-white p-5 shadow-xl border border-slate-100"
            >
              <div className="flex items-center gap-3">
                <div className="flex -space-x-2">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-slate-200" />
                  ))}
                </div>
                <div className="text-sm font-bold font-mono text-slate-900">+10K</div>
              </div>
              <div className="text-xs font-medium text-slate-500">Active Developers</div>
            </div>

            {/* Decorative Elements */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -z-10 w-[140%] h-[140%] border border-slate-100/50 rounded-full opacity-50" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -z-10 w-[120%] h-[120%] border border-slate-100/50 rounded-full opacity-50" />

          </div>
        </div>
      </div>
    </section>
  );
}

