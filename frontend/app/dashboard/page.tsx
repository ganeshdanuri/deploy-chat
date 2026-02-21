"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
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
import { DashboardSkeleton } from "@/app/components/ui";

// ─── Types ────────────────────────────────────────────────────────────────────

interface OnboardingStep {
  id: number;
  name: string;
  description: string;
  icon: React.ElementType;
  href: string;
  color: string;
  bgColor: string;
  borderColor: string;
  gradientFrom: string;
  btnText: string;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const ONBOARDING_STEPS: OnboardingStep[] = [
  {
    id: 1,
    name: "Upload Documents",
    description: "Connect your knowledge base. Upload PDFs, CSVs, or text files for your AI to learn from.",
    icon: HiDocumentText,
    href: "/dashboard/documents",
    color: "text-indigo-600",
    bgColor: "bg-indigo-50",
    borderColor: "border-indigo-100",
    gradientFrom: "from-indigo-500 to-indigo-600",
    btnText: "Add Documents",
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
    gradientFrom: "from-emerald-500 to-emerald-600",
    btnText: "Setup Datasets",
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
    gradientFrom: "from-amber-400 to-amber-500",
    btnText: "Create Assistant",
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
    gradientFrom: "from-purple-500 to-purple-600",
    btnText: "Try Playground",
  },
];

// ─── Component ────────────────────────────────────────────────────────────────

export default function DashboardOverview() {
  const dispatch = useAppDispatch();
  const { items: chatbots } = useAppSelector((state) => state.chatbots);
  const { items: datasets } = useAppSelector((state) => state.datasets);
  const { items: documents } = useAppSelector((state) => state.documents);
  const { message_count, token_count } = useAppSelector((state) => state.usage);

  const hasData = chatbots.length > 0 || datasets.length > 0 || documents.length > 0;
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  const containerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  const loadData = useCallback(
    async (showNotification = false) => {
      setIsRefreshing(true);
      try {
        await Promise.all([
          dispatch(fetchChatbots()),
          dispatch(fetchDatasets()),
          dispatch(fetchDocuments()),
          dispatch(fetchUsageStats()),
        ]);
        if (showNotification) showToast.success("Dashboard data refreshed");
      } catch {
        if (showNotification) showToast.error("Failed to refresh dashboard data");
      } finally {
        setTimeout(() => {
          setIsRefreshing(false);
          setIsInitialLoading(false);
        }, 600);
      }
    },
    [dispatch]
  );

  useEffect(() => {
    loadData();
  }, [loadData]);

  useGSAP(
    () => {
      if (!hasData) {
        const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
        tl.from(".hero-content", { y: 30, opacity: 0, duration: 0.8 })
          .from(".step-card", { y: 40, opacity: 0, stagger: 0.15, duration: 0.8 }, "-=0.4")
          .from(".flow-line", { scaleX: 0, opacity: 0, duration: 1, transformOrigin: "left center" }, "-=0.2");
      }
    },
    { scope: containerRef, dependencies: [hasData] }
  );

  return (
    <div ref={containerRef} className="min-h-[80vh] flex flex-col items-center justify-center py-10 px-4">
      {isInitialLoading ? (
        <DashboardSkeleton />
      ) : hasData ? (
        <DashboardSummary
          chatbots={chatbots}
          datasets={datasets}
          documents={documents}
          message_count={message_count}
          token_count={token_count}
          isRefreshing={isRefreshing}
          onRefresh={() => loadData(true)}
        />
      ) : (
        <OnboardingView cardsRef={cardsRef} />
      )}
    </div>
  );
}

// ─── Sub-components ───────────────────────────────────────────────────────────

interface DashboardSummaryProps {
  chatbots: any[];
  datasets: any[];
  documents: any[];
  message_count: number;
  token_count: number;
  isRefreshing: boolean;
  onRefresh: () => void;
}

function DashboardSummary({
  chatbots,
  datasets,
  message_count,
  token_count,
  isRefreshing,
  onRefresh,
}: DashboardSummaryProps) {
  return (
    <div className="w-full max-w-7xl animate-fade-in-up">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-6 mb-8">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Dashboard Overview</h1>
            <button
              onClick={onRefresh}
              disabled={isRefreshing}
              className={`p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-indigo-600 transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-1 ${isRefreshing ? "animate-spin text-indigo-600" : ""
                }`}
              title="Refresh Dashboard Data"
            >
              <HiRefresh className="w-5 h-5" />
            </button>
          </div>
          <p className="text-sm text-slate-500 mt-1 font-medium">
            Platform performance and activity summary for{" "}
            <span className="text-indigo-600 font-semibold">Workspace A</span>
          </p>
        </div>
        <div className="flex gap-2">
          <button className="px-4 py-2 bg-white border border-slate-200 text-slate-700 text-sm font-medium rounded-lg shadow-sm hover:bg-slate-50 transition-all flex items-center gap-2">
            <HiDocumentText className="w-4 h-4 text-slate-400" />
            View Reports
          </button>
          <button className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg shadow-sm shadow-indigo-200 hover:bg-indigo-700 hover:shadow-md transition-all flex items-center gap-2">
            <HiPlus className="w-4 h-4" />
            New Project
          </button>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <MetricCard
          icon={HiChatAlt2}
          label="Total Messages"
          value={message_count.toLocaleString()}
          trend="+12.5% this week"
          accentClass="text-indigo-600"
          accentBg="bg-indigo-50"
          ringClass="ring-indigo-100"
          trendPositive
        />
        <MetricCard
          icon={HiDatabase}
          label="Active Datasets"
          value={String(datasets.length)}
          trend="Total Collections"
          accentClass="text-emerald-600"
          accentBg="bg-emerald-50"
          ringClass="ring-emerald-100"
          trendPositive={false}
          trendNeutral
        />
        <MetricCard
          icon={HiSparkles}
          label="AI Tokens Used"
          value={token_count >= 1000 ? `${(token_count / 1000).toFixed(1)}K` : String(token_count)}
          trend="Across all chatbots"
          accentClass="text-amber-600"
          accentBg="bg-amber-50"
          ringClass="ring-amber-100"
          trendPositive={false}
          trendNeutral
        />
      </div>

      {/* Content Area */}
      <div className="flex flex-col lg:grid lg:grid-cols-3 gap-6 mt-8">
        <QuickActionsPanel />
        <RecentActivityPanel />
      </div>
    </div>
  );
}

// ─── Metric Card ──────────────────────────────────────────────────────────────

interface MetricCardProps {
  icon: React.ElementType;
  label: string;
  value: string;
  trend: string;
  accentClass: string;
  accentBg: string;
  ringClass: string;
  trendPositive: boolean;
  trendNeutral?: boolean;
}

function MetricCard({ icon: Icon, label, value, trend, accentClass, accentBg, ringClass, trendPositive, trendNeutral }: MetricCardProps) {
  return (
    <div className="p-6 bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow group cursor-pointer relative overflow-hidden">
      <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
        <Icon className={`w-24 h-24 ${accentClass} transform translate-x-4 -translate-y-4`} />
      </div>
      <div className={`flex items-center gap-3 mb-4 relative z-10`}>
        <div className={`p-2.5 ${accentBg} ${accentClass} rounded-lg ring-1 ${ringClass}`}>
          <Icon className="w-5 h-5" />
        </div>
        <span className="text-sm font-semibold text-slate-600">{label}</span>
      </div>
      <div className="text-3xl font-bold text-slate-900 mb-1 relative z-10 font-mono">{value}</div>
      <div className={`flex items-center gap-1.5 text-xs font-bold w-fit px-2 py-0.5 rounded-full relative z-10 ${trendNeutral ? "text-slate-500 bg-slate-50" : "text-emerald-600 bg-emerald-50"
        }`}>
        {trendPositive && <HiTrendingUp className="w-3.5 h-3.5" />}
        <span className={trendPositive ? "font-mono" : ""}>{trend}</span>
      </div>
    </div>
  );
}

// ─── Quick Actions Panel ──────────────────────────────────────────────────────

const QUICK_ACTIONS = [
  {
    label: "New Chatbot",
    description: "Deploy a new AI assistant",
    icon: HiChatAlt2,
    hoverBorder: "hover:border-indigo-400 hover:bg-indigo-50/50",
    iconBg: "bg-indigo-50 text-indigo-600",
    hoverText: "group-hover:text-indigo-700",
  },
  {
    label: "Add Knowledge Source",
    description: "Upload PDF, CSV or scrape URL",
    icon: HiDatabase,
    hoverBorder: "hover:border-emerald-400 hover:bg-emerald-50/50",
    iconBg: "bg-emerald-50 text-emerald-600",
    hoverText: "group-hover:text-emerald-700",
  },
  {
    label: "Playground",
    description: "Test your prompts immediately",
    icon: HiSparkles,
    hoverBorder: "hover:border-amber-400 hover:bg-amber-50/50",
    iconBg: "bg-amber-50 text-amber-600",
    hoverText: "group-hover:text-amber-700",
  },
];

function QuickActionsPanel() {
  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 lg:col-span-1 h-full flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-base font-bold text-slate-800">Quick Actions</h3>
        <button className="text-xs text-indigo-600 font-medium hover:underline">View All</button>
      </div>
      <div className="space-y-3 flex-1">
        {QUICK_ACTIONS.map((action) => (
          <button
            key={action.label}
            className={`w-full flex items-center gap-4 p-3 rounded-xl border border-dashed border-slate-300 ${action.hoverBorder} transition-all group text-left`}
          >
            <div className={`w-10 h-10 rounded-lg ${action.iconBg} flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm`}>
              <action.icon className="w-5 h-5" />
            </div>
            <div>
              <h4 className={`text-sm font-semibold text-slate-900 ${action.hoverText}`}>{action.label}</h4>
              <p className="text-xs text-slate-500 mt-0.5">{action.description}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── Recent Activity Panel ────────────────────────────────────────────────────

const ACTIVITY_ITEMS = [
  {
    color: "bg-indigo-500",
    title: "New document uploaded",
    time: "2 mins ago",
    description: <>
      <span className="font-medium text-slate-900">Courtney Henry</span> added{" "}
      <span className="font-medium text-indigo-600">Q3_Marketing_Plan.pdf</span>
    </>,
    tags: ["PDF", "12 MB"],
    hasConnector: true,
  },
  {
    color: "bg-emerald-500",
    title: "Chatbot deployed successfully",
    time: "2 hours ago",
    description: <>
      <span className="font-medium text-slate-900">Customer Support Bot</span> is now active on{" "}
      <span className="underline decoration-slate-300">production</span> environment.
    </>,
    hasConnector: true,
  },
  {
    color: "bg-amber-500",
    title: "Token usage alert",
    time: "Yesterday",
    description: <>
      You've used <span className="font-mono font-semibold">80%</span> of your monthly token limit.{" "}
      Upgrade to <span className="font-semibold text-indigo-600 cursor-pointer hover:underline">Enterprise</span> for unlimited tokens.
    </>,
    hasConnector: false,
  },
];

function RecentActivityPanel() {
  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 lg:col-span-2">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <h3 className="text-base font-bold text-slate-800">Recent Activity</h3>
          <span className="bg-indigo-100 text-indigo-700 text-xs font-bold px-2 py-0.5 rounded-full">New</span>
        </div>
        <button className="p-1.5 hover:bg-slate-100 rounded text-slate-400 hover:text-slate-600">
          <HiDotsVertical className="w-4 h-4" />
        </button>
      </div>
      <div className="space-y-0 divide-y divide-slate-100">
        {ACTIVITY_ITEMS.map((item, idx) => (
          <div key={idx} className="flex gap-4 py-4 group hover:bg-slate-50 transition-colors -mx-4 px-4 rounded-lg cursor-pointer">
            <div className="relative mt-1">
              <div className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center border border-slate-200 shadow-sm z-10 relative">
                <div className={`w-2.5 h-2.5 ${item.color} rounded-full`} />
              </div>
              {item.hasConnector && (
                <div className="absolute top-9 left-1/2 -translate-x-1/2 w-0.5 h-full bg-slate-200 -z-0" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                <p className="text-sm font-semibold text-slate-900 truncate">{item.title}</p>
                <span className="text-[10px] sm:text-xs text-slate-500 font-medium whitespace-nowrap font-mono italic">{item.time}</span>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 mt-0.5 leading-relaxed">
                {item.description}
              </p>
              {item.tags && (
                <div className="mt-2 flex gap-2">
                  {item.tags.map((tag) => (
                    <span key={tag} className="text-[10px] uppercase font-bold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200 font-mono">
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Onboarding View ──────────────────────────────────────────────────────────

function OnboardingView({ cardsRef }: { cardsRef: React.RefObject<HTMLDivElement | null> }) {
  return (
    <div className="w-full max-w-6xl mx-auto flex flex-col items-center">
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

      <div ref={cardsRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full px-4 relative">
        {/* Flow Lines */}
        <div className="hidden lg:block absolute top-[68px] left-[15%] right-[15%] h-[2px] z-0 overflow-hidden">
          <div className="flow-line w-full h-full bg-slate-200 relative">
            <div className="absolute top-0 left-0 h-full w-[40%] bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.5)] animate-shimmer" />
          </div>
        </div>

        {ONBOARDING_STEPS.map((step) => (
          <div key={step.id} className="step-card group relative z-10">
            <div className="bg-white p-6 md:p-8 rounded-[2rem] border border-slate-200 shadow-sm hover:shadow-2xl hover:border-indigo-100 transition-all duration-500 flex flex-col h-full relative overflow-hidden">
              <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${step.gradientFrom} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
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
                className="flex items-center justify-between w-full px-4 py-2.5 rounded-xl bg-slate-50 text-slate-600 border border-slate-200 text-[13px] font-bold transition-all duration-300 group/btn hover:bg-slate-100"
              >
                <span>{step.btnText}</span>
                <HiArrowRight className="w-4 h-4 transform group-hover/btn:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        ))}
      </div>

      <div className="hero-content mt-16 text-center">
        <p className="text-[13px] text-slate-400">
          New to Deploy Mind?{" "}
          <a href="#" className="font-bold text-indigo-500 hover:underline">Watch a 2-minute intro</a>{" "}
          or{" "}
          <a href="#" className="font-bold text-indigo-500 hover:underline">read documentation</a>
        </p>
      </div>
    </div>
  );
}