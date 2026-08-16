"use client";

import {
  ArrowRight,
  ArrowUp,
  Code,
  MessagesSquare,
  Plus,
  Sparkles,
  Upload,
  TrendingUp,
  BookOpen,
} from "lucide-react";
/* eslint-disable @typescript-eslint/no-explicit-any */

import { useEffect, useState } from "react";
import { useAppSelector } from "@/lib/store/hooks";
import Link from "next/link";

import { DashboardSkeleton } from "@/app/components/ui";
import api from "@/lib/api";
import { ENDPOINTS } from "@/lib/endpoints";
import { Button } from "@/components/ui/button";
import showToast from "@/lib/toast";
import AgentFormDrawer from "@/app/components/AgentFormDrawer";
import { BarChart } from "@/app/components/charts/BarChart";

export default function DashboardOverview() {
  const { items: chatbots, hasLoaded: chatbotsReady } = useAppSelector((state) => state.chatbots);
  const { items: datasets, hasLoaded: datasetsReady } = useAppSelector((state) => state.datasets);
  const { items: documents, hasLoaded: documentsReady } = useAppSelector((state) => state.documents);
  const { message_count, hasLoaded: usageReady } = useAppSelector((state) => state.usage);
  const { data: userData } = useAppSelector((state) => state.user);

  const hasAgents = chatbots.length > 0;
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  // The dashboard layout already fetches all of this on mount, so we only
  // watch for it to arrive. Gate on hasLoaded, never on `status`: a background
  // refetch (uploading a file inside the create wizard, for one) flips status
  // back to "loading", and skeletoning the page would unmount the open wizard
  // out from under the user.
  const ready = chatbotsReady && datasetsReady && documentsReady && usageReady;

  if (!ready) return <DashboardSkeleton />;

  if (!hasAgents) {
    return (
      <>
        <EmptyOnboarding onCreate={() => setIsCreateOpen(true)} />
        <AgentFormDrawer
          isOpen={isCreateOpen}
          onClose={() => setIsCreateOpen(false)}
          editBot={null}
        />
      </>
    );
  }

  const firstName = userData?.profile?.username?.split(" ")[0] || "there";
  const limit = userData?.billing?.monthly_limit || 100;
  const usagePct = Math.min((message_count / limit) * 100, 100);

  return (
    <>
      <div className="w-full space-y-5">

        {/* ── Greeting ───────────────────────────────────────────── */}
        <section className="flex items-center justify-between">
          <div>
            <h1 className="text-[28px] font-semibold tracking-[-0.02em] text-foreground leading-tight">
              Good {greeting()}, {firstName} 👋
            </h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              {new Date().toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric" })}
            </p>
          </div>
          <button
            onClick={() => setIsCreateOpen(true)}
            className="hidden sm:flex items-center gap-2 px-4 py-2 text-[13px] font-semibold rounded-xl bg-foreground text-background hover:bg-foreground/90 transition-colors shrink-0"
          >
            <Plus className="w-3.5 h-3.5" />
            New agent
          </button>
        </section>

        {/* ── Stat cards ─────────────────────────────────────────── */}
        <section className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <StatCard
            label="Active agents"
            value={chatbots.length}
            display={String(chatbots.length).padStart(2, "0")}
            sub="+1 this week"
            positive
            icon={MessagesSquare}
            iconColor="var(--agent)"
            iconBg="var(--agent-bg)"
            href="/dashboard/agents"
          />
          <StatCard
            label="Messages sent"
            value={message_count}
            display={message_count.toLocaleString()}
            sub={`${usagePct.toFixed(0)}% of ${limit.toLocaleString()} used`}
            progress={usagePct}
            icon={TrendingUp}
            iconColor="var(--brand)"
            iconBg="var(--brand-bg)"
            href="/dashboard/analytics"
          />
          <StatCard
            label="Collections"
            value={datasets.length}
            display={String(datasets.length).padStart(2, "0")}
            sub={`${documents.length} ${documents.length === 1 ? "file" : "files"} indexed`}
            icon={BookOpen}
            iconColor="var(--knowledge)"
            iconBg="var(--knowledge-bg)"
            href="/dashboard/knowledge"
          />
        </section>

        {/* ── Agents + Activity ──────────────────────────────────── */}
        <section className="grid grid-cols-1 lg:grid-cols-[1.6fr_1fr] gap-3">
          <AgentsPanel
            chatbots={chatbots.slice(0, 5)}
            total={chatbots.length}
            onCreate={() => setIsCreateOpen(true)}
          />
          <ActivityPanel />
        </section>

        {/* ── Message Activity chart (bottom) ────────────────────── */}
        <section className="bg-background border border-border rounded-2xl overflow-hidden">
          <div className="flex items-center justify-between px-6 pt-5 pb-2">
            <div>
              <p className="text-[13px] font-semibold text-foreground">Message activity</p>
              <p className="text-sm text-muted-foreground mt-0.5">
                <span className="font-semibold text-foreground tabular-nums">{message_count.toLocaleString()}</span>
                {" "}messages this period
              </p>
            </div>
            <div className="flex bg-muted p-0.5 rounded-lg text-[12px] font-medium">
              <span className="px-3 py-1 rounded-md bg-background text-foreground shadow-sm">7d</span>
              <span className="px-3 py-1 text-muted-foreground cursor-pointer hover:text-foreground transition-colors">30d</span>
              <span className="px-3 py-1 text-muted-foreground cursor-pointer hover:text-foreground transition-colors">90d</span>
            </div>
          </div>
          <div className="px-4 sm:px-6 pb-6 pt-2">
            <BarChart data={[]} height={200} emptyLabel="No messages yet" color="var(--brand)" />
          </div>
        </section>

      </div>

      <AgentFormDrawer
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        editBot={null}
      />
    </>
  );
}

function greeting() {
  const h = new Date().getHours();
  if (h < 12) return "morning";
  if (h < 18) return "afternoon";
  return "evening";
}

// ─── STAT CARD ────────────────────────────────────────────────────────────────

function StatCard({
  label,
  display,
  sub,
  positive,
  progress,
  icon: Icon,
  iconColor,
  iconBg,
  href,
}: {
  label: string;
  value: number;
  display: string;
  sub: string;
  positive?: boolean;
  progress?: number;
  icon: React.ElementType;
  iconColor: string;
  iconBg: string;
  href: string;
}) {
  return (
    <Link
      href={href}
      className="bg-background border border-border rounded-2xl p-5 flex flex-col gap-4 hover:border-border-medium transition-colors group"
    >
      {/* Top row: label + icon */}
      <div className="flex items-center justify-between">
        <span className="text-[13px] font-medium text-muted-foreground">{label}</span>
        <div
          className="w-8 h-8 rounded-xl flex items-center justify-center"
          style={{ background: iconBg, color: iconColor }}
        >
          <Icon className="w-3.5 h-3.5" />
        </div>
      </div>

      {/* Big number */}
      <div className="text-[42px] font-semibold tracking-[-0.03em] tabular-nums leading-none text-foreground">
        {display}
      </div>

      {/* Progress bar (optional) */}
      {progress !== undefined && (
        <div className="h-1 bg-muted rounded-full overflow-hidden -mt-1">
          <div
            className="h-full rounded-full transition-all"
            style={{ width: `${progress}%`, background: iconColor }}
          />
        </div>
      )}

      {/* Sub-text */}
      <div className="flex items-center gap-1 text-[12px] text-muted-foreground -mt-1">
        {positive && <ArrowUp className="w-3 h-3" style={{ color: "var(--accent-green)" }} />}
        <span>{sub}</span>
      </div>
    </Link>
  );
}

// ─── AGENTS PANEL ────────────────────────────────────────────────────────────

function AgentsPanel({
  chatbots,
  total,
  onCreate,
}: {
  chatbots: any[];
  total: number;
  onCreate: () => void;
}) {
  return (
    <div className="bg-background border border-border rounded-2xl overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-border">
        <div className="flex items-center gap-2.5">
          <h3 className="text-[13px] font-semibold text-foreground">Your agents</h3>
          <span
            className="text-[11px] font-semibold px-2 py-0.5 rounded-full tabular-nums"
            style={{ background: "var(--agent-bg)", color: "var(--agent)" }}
          >
            {total}
          </span>
        </div>
        <Link
          href="/dashboard/agents"
          className="text-[12px] font-medium text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
        >
          View all <ArrowRight className="w-3 h-3" />
        </Link>
      </div>

      {/* Agent rows */}
      <div className="divide-y divide-border">
        {chatbots.map((bot: any) => {
          const status = (bot.status || "active").toLowerCase();
          const statusColor =
            status === "creating" ? "var(--accent-gold)"
            : status === "failed"  ? "var(--destructive)"
            : "var(--accent-green)";
          const statusLabel =
            status === "creating" ? "Training"
            : status === "failed"  ? "Failed"
            : "Live";
          const initials = bot.name.slice(0, 2).toUpperCase();

          return (
            <Link
              key={bot.id}
              href={`/dashboard/agents/${bot.id}`}
              className="flex items-center px-5 py-3 gap-3.5 hover:bg-muted/40 transition-colors group"
            >
              {/* Avatar */}
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center text-[11px] font-bold shrink-0"
                style={{ background: "var(--agent-bg)", color: "var(--agent)" }}
              >
                {initials}
              </div>

              {/* Name + meta */}
              <div className="flex-1 min-w-0">
                <div className="text-[13px] font-semibold text-foreground truncate">{bot.name}</div>
                <div className="text-[11px] text-muted-foreground mt-0.5">
                  {bot.system_prompt
                    ? bot.system_prompt.slice(0, 40) + (bot.system_prompt.length > 40 ? "…" : "")
                    : "No system prompt"}
                </div>
              </div>

              {/* Status */}
              <span
                className="flex items-center gap-1.5 text-[11px] font-semibold shrink-0"
                style={{ color: statusColor }}
              >
                <span className="w-1.5 h-1.5 rounded-full" style={{ background: statusColor }} />
                {statusLabel}
              </span>

              <ArrowRight className="w-3.5 h-3.5 text-border group-hover:text-muted-foreground transition-colors shrink-0" />
            </Link>
          );
        })}

        {/* New agent row */}
        <button
          onClick={onCreate}
          className="w-full flex items-center gap-3.5 px-5 py-3 hover:bg-muted/40 transition-colors text-left"
        >
          <div className="w-9 h-9 rounded-xl border border-dashed border-border flex items-center justify-center text-muted-foreground shrink-0">
            <Plus className="w-4 h-4" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-[13px] font-semibold text-foreground">New agent</div>
            <div className="text-[11px] text-muted-foreground">Deploy a new AI assistant</div>
          </div>
        </button>
      </div>
    </div>
  );
}

// ─── ACTIVITY PANEL ──────────────────────────────────────────────────────────

function ActivityPanel() {
  const [activities, setActivities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await api.get(ENDPOINTS.USERS.RECENT_ACTIVITY);
        setActivities(res.data);
      } catch {
        showToast.error("Failed to fetch recent activities.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const titleOf = (t: string) =>
    ({ document_added: "Source uploaded", dataset_created: "Collection created", chatbot_created: "Agent deployed", message_limit_warning: "Usage alert" }[t] || "Activity");

  const iconOf = (t: string) =>
    ({ document_added: Upload, dataset_created: Sparkles, chatbot_created: MessagesSquare, message_limit_warning: ArrowUp }[t] || Code);

  const colorOf = (t: string) =>
    ({
      document_added:      { color: "var(--knowledge)", bg: "var(--knowledge-bg)" },
      dataset_created:     { color: "var(--knowledge)", bg: "var(--knowledge-bg)" },
      chatbot_created:     { color: "var(--agent)",     bg: "var(--agent-bg)"     },
      message_limit_warning: { color: "var(--accent-gold)", bg: "#FFFBEB" },
    }[t] || { color: "var(--muted-foreground)", bg: "var(--muted)" });

  return (
    <div className="bg-background border border-border rounded-2xl overflow-hidden">
      <div className="px-5 py-4 border-b border-border">
        <h3 className="text-[13px] font-semibold text-foreground">Recent activity</h3>
      </div>

      <div className="px-5 py-4 space-y-4">
        {loading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex gap-3 animate-pulse">
              <div className="w-7 h-7 rounded-xl bg-muted shrink-0" />
              <div className="flex-1 space-y-1.5 pt-0.5">
                <div className="h-3 w-28 bg-muted rounded-full" />
                <div className="h-2 w-40 bg-muted rounded-full" />
              </div>
            </div>
          ))
        ) : activities.length === 0 ? (
          <div className="py-8 text-center">
            <div className="text-[13px] font-medium text-muted-foreground">Nothing yet</div>
            <div className="text-xs text-muted-foreground/60 mt-1">Activity will appear here</div>
          </div>
        ) : (
          activities.slice(0, 5).map((item, idx) => {
            const Icon = iconOf(item.activity_type);
            const { color, bg } = colorOf(item.activity_type);
            const isLast = idx === Math.min(activities.length, 5) - 1;
            return (
              <div key={item.id} className="flex gap-3 relative">
                {/* Timeline line */}
                {!isLast && (
                  <div className="absolute left-[13px] top-7 bottom-[-12px] w-px bg-border" />
                )}
                <div
                  className="w-7 h-7 rounded-xl flex items-center justify-center shrink-0 z-10"
                  style={{ background: bg, color }}
                >
                  <Icon className="w-3 h-3" />
                </div>
                <div className="flex-1 min-w-0 pt-0.5">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-[13px] font-semibold text-foreground truncate">
                      {titleOf(item.activity_type)}
                    </p>
                    <span className="text-[11px] text-muted-foreground whitespace-nowrap shrink-0">
                      {new Date(item.created_at).toLocaleDateString(undefined, { month: "short", day: "numeric" })}
                    </span>
                  </div>
                  <p className="text-[11px] text-muted-foreground mt-0.5 line-clamp-1">
                    {item.details}
                  </p>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

// ─── EMPTY STATE ─────────────────────────────────────────────────────────────

function EmptyOnboarding({ onCreate }: { onCreate: () => void }) {
  // These describe what the create wizard walks you through — they are not
  // separate destinations. Sending people off to other pages first is what
  // used to strand them.
  const steps = [
    {
      num: 1,
      title: "Name your agent",
      desc: "What it's called and how it greets people.",
      color: "var(--agent)",
      bg: "var(--agent-bg)",
    },
    {
      num: 2,
      title: "Give it something to read",
      desc: "Drop in PDFs, docs, or notes — right inside the wizard.",
      color: "var(--knowledge)",
      bg: "var(--knowledge-bg)",
    },
    {
      num: 3,
      title: "Pick where it runs",
      desc: "Keep it in testing, or lock it to your domain and embed it.",
      color: "var(--brand)",
      bg: "var(--brand-bg)",
    },
  ];

  return (
    <div className="w-full max-w-2xl mx-auto py-8 sm:py-14 text-center">
      <div
        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold mb-5 border"
        style={{ background: "var(--brand-bg)", color: "var(--brand)", borderColor: "var(--brand)" + "30" }}
      >
        Welcome to Deploy Chat
      </div>
      <h1 className="text-3xl sm:text-[34px] font-semibold tracking-[-0.025em] text-foreground mb-3 leading-tight">
        Let&apos;s ship your first AI agent.
      </h1>
      <p className="text-[15px] text-muted-foreground max-w-md mx-auto leading-relaxed mb-8">
        Three steps, all in one place. No code required.
      </p>

      <Button size="lg" onClick={onCreate} className="mb-10">
        <Plus className="w-4 h-4 mr-1.5" />
        Create your first agent
      </Button>

      <div className="flex flex-col gap-2.5 text-left">
        {steps.map((step) => (
          <div
            key={step.num}
            className="bg-background border border-border rounded-2xl p-4 flex items-center gap-4"
          >
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center text-[13px] font-bold shrink-0"
              style={{ background: step.bg, color: step.color }}
            >
              {step.num}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-[14px] font-semibold text-foreground">{step.title}</h3>
              <p className="text-[12px] text-muted-foreground mt-0.5">{step.desc}</p>
            </div>
          </div>
        ))}
      </div>

      <p className="text-[12px] text-muted-foreground mt-6">
        Already uploaded files?{" "}
        <Link href="/dashboard/knowledge" className="underline underline-offset-2 hover:text-foreground transition-colors">
          Manage your knowledge
        </Link>
      </p>
    </div>
  );
}

