/* eslint-disable @typescript-eslint/no-explicit-any */
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
  HiDotsVertical,
  HiArrowRight,
  HiLightningBolt,
  HiRefresh,
  HiCreditCard,
} from "react-icons/hi";
import { Tooltip } from "@/app/components/ui";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import showToast from "@/lib/toast";
import { DashboardSkeleton } from "@/app/components/ui";
import api from "@/lib/api";
import { ENDPOINTS } from "@/lib/endpoints";
import {
  QUICK_ACTIONS,
  ONBOARDING_STEPS,
} from "@/lib/constants";

// ─── Types ────────────────────────────────────────────────────────────────────


// ─── Component ────────────────────────────────────────────────────────────────

export default function DashboardOverview() {
  const dispatch = useAppDispatch();
  const { items: chatbots } = useAppSelector((state) => state.chatbots);
  const { items: datasets } = useAppSelector((state) => state.datasets);
  const { items: documents } = useAppSelector((state) => state.documents);
  const { message_count, token_count } = useAppSelector((state) => state.usage);
  const { data: userData } = useAppSelector((state) => state.user);

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
    <div ref={containerRef} className="min-h-[80vh] flex flex-col items-center justify-center px-4">
      {isInitialLoading ? (
        <DashboardSkeleton />
      ) : hasData ? (
        <DashboardSummary
          datasets={datasets}
          documents={documents}
          message_count={message_count}
          token_count={token_count}
          userData={userData}
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
  datasets: any[];
  documents: any[];
  message_count: number;
  token_count: number;
  userData: any;
  isRefreshing: boolean;
  onRefresh: () => void;
}

function DashboardSummary({
  datasets,
  message_count,
  token_count,
  userData,
  isRefreshing,
  onRefresh,
}: DashboardSummaryProps) {
  const limit = userData?.billing?.monthly_limit || 100;
  const usagePercentage = Math.min((message_count / limit) * 100, 100);

  return (
    <div className="w-full max-w-[1400px] animate-fade-in-up">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 mb-8">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-[#201f32] tracking-tight">Dashboard Overview</h1>
            <Tooltip content="Refresh Dashboard Data">
              <button
                onClick={onRefresh}
                disabled={isRefreshing}
                className={`p-1.5 hover:bg-[#f3f3f9] text-[#a1a1a1] hover:text-[#262ef2] transition-all focus:outline-none ${isRefreshing ? "animate-spin text-[#262ef2]" : ""
                  }`}
              >
                <HiRefresh className="w-5 h-5" />
              </button>
            </Tooltip>
            <span className="bg-[#262ef2]/5 text-[#262ef2] text-[10px] font-bold px-2.5 py-1 border border-[#262ef2]/10 uppercase tracking-widest">
              {(userData?.billing?.current_plan || 'free').toUpperCase()} plan
            </span>
          </div>
          <p className="text-sm text-[#5a5a6a] mt-2 font-medium">
            Platform performance and activity summary for{" "}
            <span className="text-[#201f32] font-semibold">Workspace A</span>
          </p>
        </div>
        <div className="flex gap-2">
          <button
            disabled
            className="px-5 py-2.5 bg-[#201f32] text-white/50 text-sm font-medium shadow-sm opacity-60 cursor-not-allowed flex items-center gap-2"
          >
            <HiCreditCard className="w-4 h-4 text-white/50" />
            Billing & Plans
          </button>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <MetricCard
          icon={HiChatAlt2}
          label="Message Usage"
          value={`${message_count.toLocaleString()} / ${limit.toLocaleString()}`}
          trend={`${usagePercentage.toFixed(1)}% of limit used`}
          accentClass="text-[#262ef2]"
          accentBg="bg-[#262ef2]/5"
          ringClass="ring-[#262ef2]/10"
          trendPositive={usagePercentage < 80}
          href={"#"}
          onClick={(e: any) => e.preventDefault()}
          isDisabled={true}
          details={
            <div className="mt-4 h-1.5 w-full bg-[#f3f3f9] rounded-sm overflow-hidden">
              <div
                className={`h-full transition-all duration-1000 ${usagePercentage > 90 ? 'bg-red-500' : 'bg-[#262ef2]'}`}
                style={{ width: `${usagePercentage}%` }}
              />
            </div>
          }
        />
        <MetricCard
          icon={HiDatabase}
          label="Knowledge Bases"
          value={String(datasets.length)}
          trend="Active Collections"
          accentClass="text-[#10b981]"
          accentBg="bg-[#10b981]/5"
          ringClass="ring-[#10b981]/10"
          trendPositive={false}
          trendNeutral
          href="/dashboard/datasets"
        />
        <MetricCard
          icon={HiSparkles}
          label="AI Tokens Used"
          value={token_count >= 1000 ? `${(token_count / 1000).toFixed(1)}K` : String(token_count)}
          trend="Across all chatbots"
          accentClass="text-[#f59e0b]"
          accentBg="bg-[#f59e0b]/5"
          ringClass="ring-[#f59e0b]/10"
          trendPositive={false}
          trendNeutral
          href={"#"}
          onClick={(e: any) => e.preventDefault()}
          isDisabled={true}
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
  href: string;
  isLocked?: boolean;
  isDisabled?: boolean;
  onClick?: (e: any) => void;
  details?: React.ReactNode;
}

function MetricCard({ icon: Icon, label, value, trend, accentClass, accentBg, ringClass, trendPositive, trendNeutral, href, isLocked, isDisabled, onClick, details }: MetricCardProps) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={`dash-card p-6 bg-white border border-[#e3e2e5] shadow-sm group relative overflow-hidden block ${isDisabled ? "opacity-75 cursor-default" : "cursor-pointer"}`}
    >
      <div className="absolute top-0 right-0 p-4 opacity-[0.06] group-hover:opacity-[0.12] transition-opacity">
        <Icon className={`w-24 h-24 ${accentClass} transform translate-x-4 -translate-y-4`} />
      </div>
      <div className={`flex items-center gap-3 mb-5 relative z-10`}>
        <div className={`p-2.5 ${accentBg} ${accentClass} ring-1 ${ringClass}`}>
          <Icon className="w-5 h-5" />
        </div>
        <div className="flex flex-1 items-center justify-between">
          <span className="text-sm font-semibold text-[#5a5a6a]">{label}</span>
          {(isLocked || isDisabled) && (
            <div className="flex items-center gap-1 text-[10px] font-bold text-[#f59e0b] bg-[#f59e0b]/5 px-2 py-0.5 border border-[#f59e0b]/10">
              <HiLightningBolt className="w-3 h-3" />
              PRO
            </div>
          )}
        </div>
      </div>
      <div className="text-3xl font-bold text-[#201f32] mb-1.5 relative z-10 font-mono">{value}</div>
      <div className={`flex items-center gap-1.5 text-xs font-bold w-fit px-2 py-0.5 relative z-10 mt-1 ${trendNeutral ? "text-[#a1a1a1] bg-[#f3f3f9]" : "text-[#10b981] bg-[#10b981]/5"
        }`}>
        {trendPositive && <HiTrendingUp className="w-3.5 h-3.5" />}
        <span className={trendPositive ? "font-mono" : ""}>{trend}</span>
      </div>
      {details && <div className="relative z-10 mt-1">{details}</div>}
    </Link>
  );
}

// ─── Quick Actions Panel ──────────────────────────────────────────────────────


function QuickActionsPanel() {
  return (
    <div className="dash-card bg-white border border-[#e3e2e5] shadow-sm lg:col-span-1 h-full flex flex-col overflow-hidden">
      <div data-slot="card-header-attached" className="flex items-center justify-between px-6 py-5 border-b border-[#e3e2e5] bg-[#f9f9fc]">
        <h3 className="text-sm font-bold text-[#201f32] uppercase tracking-wide">Knowledge Base</h3>
        <Link href="/dashboard/datasets" className="text-xs text-[#262ef2] font-semibold hover:underline">Manage →</Link>
      </div>
      <div className="p-5 space-y-3 flex-1">
        {QUICK_ACTIONS.map((action) => (
          <Link
            key={action.label}
            href={action.href}
            className={`w-full flex items-center gap-4 p-3.5 border border-dashed border-[#e3e2e5] ${action.hoverBorder} transition-all group text-left block hover:bg-[#f9f9fc]`}
          >
            <div className={`w-10 h-10 ${action.iconBg} flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm`}>
              <action.icon className="w-5 h-5" />
            </div>
            <div>
              <h4 className={`text-sm font-semibold text-[#201f32] ${action.hoverText}`}>{action.label}</h4>
              <p className="text-xs text-[#a1a1a1] mt-0.5">{action.description}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

// ─── Recent Activity Panel ────────────────────────────────────────────────────

function RecentActivityPanel() {
  const [activities, setActivities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const res = await api.get(ENDPOINTS.USERS.RECENT_ACTIVITY);
        setActivities(res.data);
      } catch {
        showToast.error("Failed to fetch recent activities.");
      } finally {
        setLoading(false);
      }
    };
    fetchActivities();
  }, []);

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'document_added': return 'bg-[#262ef2]';
      case 'dataset_created': return 'bg-[#10b981]';
      case 'chatbot_created': return 'bg-[#0ea5e9]';
      case 'message_limit_warning': return 'bg-[#f59e0b]';
      default: return 'bg-[#a1a1a1]';
    }
  };

  const getActivityTitle = (type: string) => {
    switch (type) {
      case 'document_added': return 'New source file uploaded';
      case 'dataset_created': return 'New knowledge base created';
      case 'chatbot_created': return 'AI assistant deployed';
      case 'message_limit_warning': return 'Usage limit alert';
      default: return 'Activity';
    }
  };

  return (
    <div className="dash-card bg-white border border-[#e3e2e5] shadow-sm lg:col-span-2 overflow-hidden">
      <div data-slot="card-header-attached" className="flex items-center justify-between px-6 py-5 border-b border-[#e3e2e5] bg-[#f9f9fc]">
        <div className="flex items-center gap-3">
          <h3 className="text-sm font-bold text-[#201f32] uppercase tracking-wide">Recent Activity</h3>
          <span className="bg-[#262ef2]/10 text-[#262ef2] text-[10px] font-bold px-2 py-0.5">New</span>
        </div>
        <button className="p-1.5 hover:bg-white/80 text-[#a1a1a1] hover:text-[#4d5564] transition-colors">
          <HiDotsVertical className="w-4 h-4" />
        </button>
      </div>
      <div className="px-6 divide-y divide-[#f3f3f9]">
        {loading ? (
          <div className="space-y-4 py-5">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex gap-4 py-3">
                <div className="w-9 h-9 rounded-full bg-[#f3f3f9] flex items-center justify-center border border-[#e3e2e5] shadow-sm shrink-0">
                  <div className="w-2.5 h-2.5 bg-[#e3e2e5] rounded-full" />
                </div>
                <div className="flex-1 space-y-2">
                  <div className="flex justify-between">
                    <div className="h-3 w-32 bg-slate-100 rounded-full overflow-hidden relative">
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/60 to-transparent animate-shimmer" />
                    </div>
                    <div className="h-2 w-16 bg-slate-50 rounded-full overflow-hidden relative">
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/60 to-transparent animate-shimmer" />
                    </div>
                  </div>
                  <div className="h-2.5 w-full bg-slate-50 rounded-full overflow-hidden relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/60 to-transparent animate-shimmer" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : activities.length === 0 ? (
          <div className="text-center py-12 text-[#a1a1a1] text-sm">No recent activity</div>
        ) : (
          activities.map((item, idx) => (
            <div key={item.id} className="flex gap-4 py-4 group hover:bg-[#f9f9fc] transition-colors -mx-6 px-6 cursor-pointer">
              <div className="relative mt-1">
                <div className="w-9 h-9 bg-[#f3f3f9] flex items-center justify-center border border-[#e3e2e5] shadow-sm z-10 relative">
                  <div className={`w-2.5 h-2.5 ${getActivityColor(item.activity_type)}`} />
                </div>
                {idx < activities.length - 1 && (
                  <div className="absolute top-9 left-1/2 -translate-x-1/2 w-0.5 h-full bg-[#e3e2e5] -z-0" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <p className="text-sm font-semibold text-[#201f32] truncate">{getActivityTitle(item.activity_type)}</p>
                  <span className="text-[10px] sm:text-xs text-[#a1a1a1] font-medium whitespace-nowrap font-mono">
                    {new Date(item.created_at).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-[#4d5564] mt-0.5 leading-relaxed">
                  {item.details}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

// ─── Onboarding View ──────────────────────────────────────────────────────────

function OnboardingView({ cardsRef }: { cardsRef: React.RefObject<HTMLDivElement | null> }) {
  return (
    <div className="w-full max-w-[1400px] mx-auto flex flex-col items-center">
      <div className="hero-content text-center mb-16 px-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#262ef2]/5 text-[#262ef2] text-[10px] font-bold border border-[#262ef2]/10 mb-6 uppercase tracking-widest">
          <HiLightningBolt className="w-3 h-3" />
          <span>Getting Started</span>
        </div>
        <h2 className="text-2xl md:text-3xl font-extrabold text-[#201f32] mb-4 tracking-tight">
          Build your AI assistant in 4 simple steps
        </h2>
        <p className="text-base text-[#5a5a6a] max-w-xl mx-auto leading-relaxed">
          Connect your data, organize your knowledge, and deploy a chatbot that actually understands your business.
        </p>
      </div>

      <div ref={cardsRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full px-4 relative">
        {/* Flow Lines */}
        <div className="hidden lg:block absolute top-[68px] left-[15%] right-[15%] h-[2px] z-0 overflow-hidden">
          <div className="flow-line w-full h-full bg-[#e3e2e5] relative">
            <div className="absolute top-0 left-0 h-full w-[40%] bg-[#262ef2] shadow-[0_0_10px_rgba(38,46,242,0.5)] animate-shimmer" />
          </div>
        </div>

        {ONBOARDING_STEPS.map((step) => (
          <div key={step.id} className="step-card group relative z-10">
            <div className="bg-white p-6 md:p-8 border border-[#e3e2e5] rounded-sm shadow-sm hover:shadow-2xl hover:border-[#262ef2]/20 transition-all duration-500 flex flex-col h-full relative overflow-hidden">
              <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${step.gradientFrom} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
              <div className={`w-12 h-12 ${step.bgColor} ${step.color} flex items-center justify-center mb-6 shadow-sm ring-1 ring-inset ${step.borderColor} group-hover:scale-110 transition-all duration-500`}>
                <step.icon className="w-6 h-6" />
              </div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#a1a1a1] font-mono">Step 0{step.id}</span>
              </div>
              <h3 className="text-lg font-bold text-[#201f32] mb-2 group-hover:text-[#262ef2] transition-colors">
                {step.name}
              </h3>
              <p className="text-[#5a5a6a] text-xs md:text-sm leading-relaxed mb-8 flex-1">
                {step.description}
              </p>
              <Link
                href={step.href}
                className="flex items-center justify-between w-full px-5 py-2.5 bg-[#201f32] text-white border border-[#201f32] text-[13px] font-medium transition-all duration-300 group/btn shadow-sm hover:shadow-md"
              >
                <span>{step.btnText}</span>
                <HiArrowRight className="w-4 h-4 transform group-hover/btn:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        ))}
      </div>

      <div className="hero-content mt-16 text-center">
        <p className="text-[13px] text-[#a1a1a1]">
          New to Deploy Chat?{" "}
          <Link href="/dashboard/help" className="font-bold text-[#262ef2] hover:underline">Watch a 2-minute intro</Link>{" "}
          or{" "}
          <Link href="/dashboard/help" className="font-bold text-[#262ef2] hover:underline">read documentation</Link>
        </p>
      </div>
    </div>
  );
}