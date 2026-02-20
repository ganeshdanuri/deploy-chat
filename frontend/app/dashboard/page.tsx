"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/lib/store/store";
import { fetchChatbots } from "@/lib/store/slices/chatbotsSlice";
import { fetchDatasets } from "@/lib/store/slices/datasetsSlice";
import { fetchDocuments } from "@/lib/store/slices/documentsSlice";
import { fetchUsageStats } from "@/lib/store/slices/usageSlice";
import Link from "next/link";
import {
  HiChatAlt2,
  HiDatabase,
  HiSparkles,
  HiTrendingUp,
  HiPlus,
  HiDocumentText,
  HiDotsVertical,
  HiArrowRight,
  HiLightningBolt,
  HiRefresh,
} from "react-icons/hi";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import showToast from "@/lib/toast";

export default function DashboardOverview() {
  const dispatch = useDispatch<AppDispatch>();
  const { items: chatbots } = useSelector((state: RootState) => state.chatbots);
  const { items: datasets } = useSelector((state: RootState) => state.datasets);
  const { items: documents } = useSelector((state: RootState) => state.documents);
  const { message_count, token_count } = useSelector((state: RootState) => state.usage);

  const hasData = chatbots.length > 0 || datasets.length > 0 || documents.length > 0;

  const [isRefreshing, setIsRefreshing] = useState(false);

  // 1. Centralized generic data fetching function
  const loadData = useCallback(async (showNotification = false) => {
    setIsRefreshing(true);
    try {
      // Dispatch all fetches in parallel
      await Promise.all([
        dispatch(fetchChatbots()),
        dispatch(fetchDatasets()),
        dispatch(fetchDocuments()),
        dispatch(fetchUsageStats())
      ]);
      if (showNotification) {
        showToast.success("Dashboard data refreshed");
      }
    } catch (error) {
      console.error("Failed to refresh dashboard data", error);
      if (showNotification) {
        showToast.error("Failed to refresh dashboard data");
      }
    } finally {
      // Ensure spinner shows for at least a brief moment for UX
      setTimeout(() => setIsRefreshing(false), 600);
    }
  }, [dispatch]);

  // 2. Fetch on mount (and logically on navigation back to this page)
  useEffect(() => {
    loadData();
  }, [loadData]);

  const containerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  const steps = [
    {
      id: 1,
      name: "Upload Documents",
      description: "Connect your knowledge base. Upload PDFs, CSVs, or text files for your AI to learn from.",
      icon: HiDocumentText,
      href: "/dashboard/documents",
      color: "text-indigo-600",
      bgColor: "bg-indigo-50",
      borderColor: "border-indigo-100",
      btnText: "Add Documents"
    },
    {
      id: 2,
      name: "Create Datasets",
      description: "Organize nodes into logical groups to help your chatbot retrieve precise information.",
      icon: HiDatabase,
      href: "/dashboard/datasets",
      color: "text-emerald-600",
      bgColor: "bg-emerald-50",
      borderColor: "border-emerald-100",
      btnText: "Setup Datasets"
    },
    {
      id: 3,
      name: "Build Chatbots",
      description: "Define how your AI speaks and which datasets it should prioritize for better context.",
      icon: HiChatAlt2,
      href: "/dashboard/chatbots",
      color: "text-amber-600",
      bgColor: "bg-amber-50",
      borderColor: "border-amber-100",
      btnText: "Create Assistant"
    },
    {
      id: 4,
      name: "Test & Launch",
      description: "Perfect your responses in the playground before deploying to your users.",
      icon: HiSparkles,
      href: "/dashboard/playground",
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      borderColor: "border-purple-100",
      btnText: "Try Playground"
    }
  ];

  useGSAP(() => {
    if (!hasData) {
      // Entry animations for content
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      tl.from(".hero-content", {
        y: 30,
        opacity: 0,
        duration: 0.8,
      })
        .from(".step-card", {
          y: 40,
          opacity: 0,
          stagger: 0.15,
          duration: 0.8,
        }, "-=0.4")
        .from(".flow-line", {
          scaleX: 0,
          opacity: 0,
          duration: 1,
          transformOrigin: "left center",
        }, "-=0.2");
    }
  }, { scope: containerRef, dependencies: [hasData] });

  return (
    <div ref={containerRef} className="min-h-[80vh] flex flex-col items-center justify-center py-10 px-4">
      {/* Header Section - Only show when there is data */}
      {hasData ? (
        <div className="w-full max-w-7xl animate-fade-in-up">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-6 mb-8">
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Dashboard Overview</h1>
                <button
                  onClick={() => loadData(true)}
                  disabled={isRefreshing}
                  className={`p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-indigo-600 transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-1 ${isRefreshing ? 'animate-spin text-indigo-600' : ''}`}
                  title="Refresh Dashboard Data"
                >
                  <HiRefresh className="w-5 h-5" />
                </button>
              </div>
              <p className="text-sm text-slate-500 mt-1 font-medium">Platform performance and activity summary for <span className="text-indigo-600 font-semibold">Workspace A</span></p>
            </div>
            <div className="flex gap-2">
              <button className="px-4 py-2 bg-white border border-slate-200 text-slate-700 text-sm font-semibold rounded-lg shadow-sm hover:bg-slate-50 transition-all flex items-center gap-2">
                <HiDocumentText className="w-4 h-4 text-slate-400" />
                View Reports
              </button>
              <button className="px-4 py-2 bg-indigo-600 text-white text-sm font-semibold rounded-lg shadow-sm shadow-indigo-200 hover:bg-indigo-700 hover:shadow-md transition-all flex items-center gap-2">
                <HiPlus className="w-4 h-4" />
                New Project
              </button>
            </div>
          </div>

          {/* Key Metrics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Metric 1 */}
            <div className="p-6 bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow group cursor-pointer relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <HiChatAlt2 className="w-24 h-24 text-indigo-600 transform translate-x-4 -translate-y-4" />
              </div>
              <div className="flex items-center gap-3 mb-4 relative z-10">
                <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-lg ring-1 ring-indigo-100">
                  <HiChatAlt2 className="w-5 h-5" />
                </div>
                <span className="text-sm font-semibold text-slate-600">Total Messages</span>
              </div>
              <div className="text-3xl font-bold text-slate-900 mb-1 relative z-10 font-mono">{message_count.toLocaleString()}</div>
              <div className="flex items-center gap-1.5 text-xs text-emerald-600 font-bold bg-emerald-50 w-fit px-2 py-0.5 rounded-full relative z-10">
                <HiTrendingUp className="w-3.5 h-3.5" />
                <span className="font-mono">+12.5%</span> this week
              </div>
            </div>

            {/* Metric 2 */}
            <div className="p-6 bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow group cursor-pointer relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <HiDatabase className="w-24 h-24 text-emerald-600 transform translate-x-4 -translate-y-4" />
              </div>
              <div className="flex items-center gap-3 mb-4 relative z-10">
                <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-lg ring-1 ring-emerald-100">
                  <HiDatabase className="w-5 h-5" />
                </div>
                <span className="text-sm font-semibold text-slate-600">Active Datasets</span>
              </div>
              <div className="text-3xl font-bold text-slate-900 mb-1 relative z-10 font-mono">{datasets.length}</div>
              <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium bg-slate-50 w-fit px-2 py-0.5 rounded-full relative z-10">
                <span>Total Collections</span>
              </div>
            </div>

            {/* Metric 3 */}
            <div className="p-6 bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow group cursor-pointer relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <HiSparkles className="w-24 h-24 text-amber-500 transform translate-x-4 -translate-y-4" />
              </div>
              <div className="flex items-center gap-3 mb-4 relative z-10">
                <div className="p-2.5 bg-amber-50 text-amber-600 rounded-lg ring-1 ring-amber-100">
                  <HiSparkles className="w-5 h-5" />
                </div>
                <span className="text-sm font-semibold text-slate-600">AI Tokens Used</span>
              </div>
              <div className="text-3xl font-bold text-slate-900 mb-1 relative z-10 font-mono">{token_count >= 1000 ? (token_count / 1000).toFixed(1) + 'K' : token_count}</div>
              <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium bg-slate-50 w-fit px-2 py-0.5 rounded-full relative z-10">
                <span>Across all chatbots</span>
              </div>
            </div>
          </div>

          {/* Main Content Areas */}
          <div className="flex flex-col lg:grid lg:grid-cols-3 gap-6 mt-8">

            {/* Quick Actions Panel */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 lg:col-span-1 h-full flex flex-col">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-base font-bold text-slate-800">Quick Actions</h3>
                <button className="text-xs text-indigo-600 font-semibold hover:underline">View All</button>
              </div>

              <div className="space-y-3 flex-1">
                <button className="w-full flex items-center gap-4 p-3 rounded-xl border border-dashed border-slate-300 hover:border-indigo-400 hover:bg-indigo-50/50 transition-all group text-left">
                  <div className="w-10 h-10 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600 group-hover:scale-110 transition-transform shadow-sm">
                    <HiChatAlt2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-slate-900 group-hover:text-indigo-700">New Chatbot</h4>
                    <p className="text-xs text-slate-500 mt-0.5">Deploy a new AI assistant</p>
                  </div>
                </button>

                <button className="w-full flex items-center gap-4 p-3 rounded-xl border border-dashed border-slate-300 hover:border-emerald-400 hover:bg-emerald-50/50 transition-all group text-left">
                  <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600 group-hover:scale-110 transition-transform shadow-sm">
                    <HiDatabase className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-slate-900 group-hover:text-emerald-700">Add Knowledge Source</h4>
                    <p className="text-xs text-slate-500 mt-0.5">Upload PDF, CSV or scrape URL</p>
                  </div>
                </button>

                <button className="w-full flex items-center gap-4 p-3 rounded-xl border border-dashed border-slate-300 hover:border-amber-400 hover:bg-amber-50/50 transition-all group text-left">
                  <div className="w-10 h-10 rounded-lg bg-amber-50 flex items-center justify-center text-amber-600 group-hover:scale-110 transition-transform shadow-sm">
                    <HiSparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-slate-900 group-hover:text-amber-700">Playground</h4>
                    <p className="text-xs text-slate-500 mt-0.5">Test your prompts immediately</p>
                  </div>
                </button>
              </div>
            </div>

            {/* Recent Activity / Tasks - Taking up 2 columns */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 lg:col-span-2">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <h3 className="text-base font-bold text-slate-800">Recent Activity</h3>
                  <span className="bg-indigo-100 text-indigo-700 text-xs font-bold px-2 py-0.5 rounded-full">New</span>
                </div>
                <div className="flex gap-2">
                  <button className="p-1.5 hover:bg-slate-100 rounded text-slate-400 hover:text-slate-600">
                    <HiDotsVertical className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="space-y-0 divide-y divide-slate-100">
                {/* Activity Item 1 */}
                <div className="flex gap-4 py-4 group hover:bg-slate-50 transition-colors -mx-4 px-4 rounded-lg cursor-pointer">
                  <div className="relative mt-1">
                    <div className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center border border-slate-200 shadow-sm z-10 relative">
                      <div className="w-2.5 h-2.5 bg-indigo-500 rounded-full"></div>
                    </div>
                    <div className="absolute top-9 left-1/2 -translate-x-1/2 w-0.5 h-full bg-slate-200 -z-0"></div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                      <p className="text-sm font-semibold text-slate-900 truncate">New document uploaded</p>
                      <span className="text-[10px] sm:text-xs text-slate-500 font-medium whitespace-nowrap font-mono italic">2 mins ago</span>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-600 mt-0.5 leading-relaxed">
                      <span className="font-medium text-slate-900">Courtney Henry</span> added <span className="font-medium text-indigo-600">Q3_Marketing_Plan.pdf</span>
                    </p>
                    <div className="mt-2 flex gap-2">
                      <span className="text-[10px] uppercase font-bold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200 font-mono">PDF</span>
                      <span className="text-[10px] uppercase font-bold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200 font-mono">12 MB</span>
                    </div>
                  </div>
                </div>

                {/* Activity Item 2 */}
                <div className="flex gap-4 py-4 group hover:bg-slate-50 transition-colors -mx-4 px-4 rounded-lg cursor-pointer">
                  <div className="relative mt-1">
                    <div className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center border border-slate-200 shadow-sm z-10 relative">
                      <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full"></div>
                    </div>
                    <div className="absolute top-9 left-1/2 -translate-x-1/2 w-0.5 h-full bg-slate-200 -z-0"></div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-semibold text-slate-900">Chatbot deployed successfully</p>
                      <span className="text-xs text-slate-500 font-medium whitespace-nowrap font-mono">2 hours ago</span>
                    </div>
                    <p className="text-sm text-slate-600 mt-0.5">
                      <span className="font-medium text-slate-900">Customer Support Bot</span> is now active on <span className="underline decoration-slate-300">production</span> environment.
                    </p>
                  </div>
                </div>

                {/* Activity Item 3 */}
                <div className="flex gap-4 py-4 group hover:bg-slate-50 transition-colors -mx-4 px-4 rounded-lg cursor-pointer">
                  <div className="relative mt-1">
                    <div className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center border border-slate-200 shadow-sm z-10 relative">
                      <div className="w-2.5 h-2.5 bg-amber-500 rounded-full"></div>
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-semibold text-slate-900">Token usage alert</p>
                      <span className="text-xs text-slate-500 font-medium whitespace-nowrap font-mono">Yesterday</span>
                    </div>
                    <p className="text-sm text-slate-600 mt-0.5">
                      You've used <span className="font-mono font-semibold">80%</span> of your monthly token limit. Upgrade to <span className="font-semibold text-indigo-600 cursor-pointer hover:underline">Enterprise</span> for unlimited tokens.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Focused Onboarding / Empty State */
        <div className="w-full max-w-6xl mx-auto flex flex-col items-center">

          {/* Refined Hero Section */}
          <div className="hero-content text-center mb-16 px-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-[10px] font-bold border border-indigo-100 mb-6 uppercase tracking-widest">
              <HiLightningBolt className="w-3 h-3" />
              <span>Getting Started</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 mb-4 tracking-tight">
              Build your AI assistant in 4 simple steps
            </h2>
            <p className="text-base text-slate-500 max-w-xl mx-auto leading-relaxed">
              Connect your data, organize your knowledge, and deploy a chatbot that actually understands your business.
            </p>
          </div>

          {/* Steps Grid - Pure Focus */}
          <div ref={cardsRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full px-4 relative">

            {/* Minimal Animated Flow Lines */}
            <div className="hidden lg:block absolute top-[68px] left-[15%] right-[15%] h-[2px] z-0 overflow-hidden">
              <div className="flow-line w-full h-full bg-slate-200 relative">
                <div className="absolute top-0 left-0 h-full w-[40%] bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.5)] animate-shimmer"></div>
              </div>
            </div>

            {steps.map((step) => (
              <div key={step.id} className="step-card group relative z-10">
                <div className="bg-white p-6 md:p-8 rounded-[2rem] border border-slate-200 shadow-sm hover:shadow-2xl hover:border-indigo-100 transition-all duration-500 flex flex-col h-full bg-white relative overflow-hidden">

                  {/* Subtle Background Glow on Hover */}
                  <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${step.id === 1 ? 'from-indigo-500 to-indigo-600' : step.id === 2 ? 'from-emerald-500 to-emerald-600' : step.id === 3 ? 'from-amber-400 to-amber-500' : 'from-purple-500 to-purple-600'} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>

                  <div className={`w-12 h-12 ${step.bgColor} ${step.color} rounded-xl flex items-center justify-center mb-6 shadow-sm ring-1 ring-inset ${step.borderColor} group-hover:scale-110 group-hover:rotate-3 transition-all duration-500`}>
                    <step.icon className="w-6 h-6" />
                  </div>

                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 font-mono">Step 0{step.id}</span>
                  </div>

                  <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-indigo-600 transition-colors">
                    {step.name}
                  </h3>

                  <p className="text-slate-500 text-xs md:text-sm leading-relaxed mb-8 flex-1">
                    {step.description}
                  </p>

                  <Link
                    href={step.href}
                    className={`flex items-center justify-between w-full px-4 py-2.5 rounded-xl bg-slate-50 text-slate-600 border border-slate-200 hover:${step.bgColor} hover:${step.color} hover:border-${step.color.split('-')[1]}-200 text-[13px] font-bold transition-all duration-300 group/btn`}
                  >
                    <span>{step.btnText}</span>
                    <HiArrowRight className="w-4 h-4 transform group-hover/btn:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {/* Simple CTA Help */}
          <div className="hero-content mt-16 text-center">
            <p className="text-[13px] text-slate-400">
              New to Deploy Mind? <a href="#" className="font-bold text-indigo-500 hover:underline">Watch a 2-minute intro</a> or <a href="#" className="font-bold text-indigo-500 hover:underline">read documentation</a>
            </p>
          </div>
        </div>
      )}
    </div>
  );
}