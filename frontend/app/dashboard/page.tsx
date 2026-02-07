"use client";

import { useState } from "react";
import Link from "next/link";
import { HiChatAlt2, HiDatabase, HiSparkles, HiTrendingUp, HiGlobeAlt, HiPlus, HiDocumentText, HiDotsVertical, HiArrowRight } from "react-icons/hi";

export default function DashboardOverview() {
  const [hasData, setHasData] = useState(false);

  return (
    <div className="space-y-8 animate-fade-in-up">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Dashboard Overview</h1>
          <p className="text-sm text-slate-500 mt-1 font-medium">Platform performance and activity summary for <span className="text-indigo-600 font-semibold">Workspace A</span></p>
        </div>
        {!hasData && (
          <div className="flex gap-2">
            <button
              onClick={() => setHasData(true)}
              className="px-4 py-2 bg-white border border-slate-200 text-slate-700 text-sm font-semibold rounded-lg shadow-sm hover:bg-slate-50 transition-all flex items-center gap-2"
            >
              Simulate Active State
            </button>
          </div>
        )}
        {hasData && (
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
        )}
      </div>

      {!hasData ? (
        /* Onboarding / Empty State */
        <div className="py-12">
          <div className="max-w-4xl mx-auto text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Welcome to Docking AI!</h2>
            <p className="text-lg text-slate-600">
              Let's get your first chatbot up and running. Follow these simple steps to build, test, and use your AI assistant.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Step 1 */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all group relative">
              <div className="absolute -top-3 left-6 px-3 py-1 bg-indigo-600 text-white text-xs font-bold rounded-full">Step 1</div>
              <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600 mb-4 group-hover:scale-110 transition-transform">
                <HiDocumentText className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Upload Documents</h3>
              <p className="text-sm text-slate-600 mb-6">
                Connect your data by uploading PDFs, CSVs, or text files. This forms the knowledge base for your AI.
              </p>
              <Link
                href="/dashboard/documents"
                className="inline-flex items-center gap-2 text-sm font-bold text-indigo-600 hover:text-indigo-700 group-hover:gap-3 transition-all"
              >
                Go to Documents <HiArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Step 2 */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all group relative">
              <div className="absolute -top-3 left-6 px-3 py-1 bg-emerald-600 text-white text-xs font-bold rounded-full">Step 2</div>
              <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600 mb-4 group-hover:scale-110 transition-transform">
                <HiDatabase className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Create Datasets</h3>
              <p className="text-sm text-slate-600 mb-6">
                Organize your documents into logical datasets that your chatbots can use for grounding answers.
              </p>
              <Link
                href="/dashboard/datasets"
                className="inline-flex items-center gap-2 text-sm font-bold text-emerald-600 hover:text-emerald-700 group-hover:gap-3 transition-all"
              >
                Go to Datasets <HiArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Step 3 */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all group relative">
              <div className="absolute -top-3 left-6 px-3 py-1 bg-amber-500 text-white text-xs font-bold rounded-full">Step 3</div>
              <div className="w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center text-amber-600 mb-4 group-hover:scale-110 transition-transform">
                <HiChatAlt2 className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Build Chatbots</h3>
              <p className="text-sm text-slate-600 mb-6">
                Create multiple AI assistants customized for specific use cases using your curated datasets.
              </p>
              <Link
                href="/dashboard/chatbots"
                className="inline-flex items-center gap-2 text-sm font-bold text-amber-600 hover:text-amber-700 group-hover:gap-3 transition-all"
              >
                Go to Chatbots <HiArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Step 4 */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all group relative">
              <div className="absolute -top-3 left-6 px-3 py-1 bg-purple-600 text-white text-xs font-bold rounded-full">Step 4</div>
              <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center text-purple-600 mb-4 group-hover:scale-110 transition-transform">
                <HiSparkles className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Test Chatbot</h3>
              <p className="text-sm text-slate-600 mb-6">
                Use the playground to interact with your chatbot, refine its personality, and test its accuracy.
              </p>
              <Link
                href="/dashboard/playground"
                className="inline-flex items-center gap-2 text-sm font-bold text-purple-600 hover:text-purple-700 group-hover:gap-3 transition-all"
              >
                Try Playground <HiArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      ) : (
        <>
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
                <span className="text-sm font-semibold text-slate-600">Total Conversations</span>
              </div>
              <div className="text-3xl font-bold text-slate-900 mb-1 relative z-10">1,248</div>
              <div className="flex items-center gap-1.5 text-xs text-emerald-600 font-bold bg-emerald-50 w-fit px-2 py-0.5 rounded-full relative z-10">
                <HiTrendingUp className="w-3.5 h-3.5" />
                <span>+12.5% this week</span>
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
              <div className="text-3xl font-bold text-slate-900 mb-1 relative z-10">12</div>
              <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium bg-slate-50 w-fit px-2 py-0.5 rounded-full relative z-10">
                <span>Across 4 workspaces</span>
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
              <div className="text-3xl font-bold text-slate-900 mb-1 relative z-10">842K</div>
              <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium bg-slate-50 w-fit px-2 py-0.5 rounded-full relative z-10">
                <span>Reset in 14 days</span>
              </div>
            </div>
          </div>

          {/* Main Content Areas */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

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
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-semibold text-slate-900">New document uploaded</p>
                      <span className="text-xs text-slate-500 font-medium whitespace-nowrap">2 mins ago</span>
                    </div>
                    <p className="text-sm text-slate-600 mt-0.5">
                      <span className="font-medium text-slate-900">Courtney Henry</span> added <span className="font-medium text-indigo-600">Q3_Marketing_Plan.pdf</span> to Marketing Dataset.
                    </p>
                    <div className="mt-2 flex gap-2">
                      <span className="text-[10px] uppercase font-bold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">PDF</span>
                      <span className="text-[10px] uppercase font-bold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">12 MB</span>
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
                      <span className="text-xs text-slate-500 font-medium whitespace-nowrap">2 hours ago</span>
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
                      <span className="text-xs text-slate-500 font-medium whitespace-nowrap">Yesterday</span>
                    </div>
                    <p className="text-sm text-slate-600 mt-0.5">
                      You've used 80% of your montly token limit. Upgrade to <span className="font-semibold text-indigo-600 cursor-pointer hover:underline">Enterprise</span> for unlimited tokens.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}