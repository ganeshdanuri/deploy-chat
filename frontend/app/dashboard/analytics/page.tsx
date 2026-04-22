"use client";

import { ArrowDown, ArrowRight, ArrowUp, Lock } from "lucide-react";
/* eslint-disable @typescript-eslint/no-explicit-any */

import { useEffect, useState } from "react";
import Link from "next/link";

import { useAppSelector } from "@/lib/store/hooks";
import { PLANS } from "@/lib/constants";
import { AnalyticsSkeleton } from "@/app/components/ui";
import { Button } from "@/components/ui/button";
import { BarChart } from "@/app/components/charts/BarChart";
import { BarList } from "@/app/components/charts/BarList";

type Range ="7d" |"30d" |"90d";

export default function AnalyticsPage() {
  const [loading, setLoading] = useState(true);
  const [range, setRange] = useState<Range>("7d");
  const { data: userData } = useAppSelector((state) => state.user);
  const { items: chatbots } = useAppSelector((state) => state.chatbots);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 300);
    return () => clearTimeout(timer);
  }, []);

  const isFreePlan =
    !userData?.billing?.current_plan ||
    userData?.billing?.current_plan.toLowerCase() === PLANS.FREE ||
    userData?.billing?.current_plan.toLowerCase() === PLANS.TRIAL;

  if (loading) return <AnalyticsSkeleton />;

  if (isFreePlan) {
    return (
      <div className="w-full max-w-2xl mx-auto py-12 text-center">
        <div className="w-14 h-14 rounded-full bg-muted flex items-center justify-center mx-auto mb-5">
          <Lock className="w-6 h-6 text-muted-foreground" />
        </div>
        <div
          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium mb-4"
          style={{ background: "var(--brand-bg)", color: "var(--brand)" }}
>
          Pro feature
        </div>
        <h1 className="text-2xl font-medium tracking-tight mb-2">
          Unlock detailed analytics
        </h1>
        <p className="text-muted-foreground max-w-md mx-auto mb-6 leading-relaxed">
          See resolution rates, response times, knowledge gaps, and per-agent
          breakdowns. Available on Professional and Enterprise plans.
        </p>
        <Button disabled className="opacity-50 cursor-not-allowed">
          Upgrade to Pro
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in-up">
      {/* Header */}
      <section>
        <div className="flex items-center gap-2 text-xs text-muted-foreground font-mono tracking-normal mb-3">
          <span>Analytics</span>
          <span className="w-1 h-1 rounded-full bg-border-medium" />
          <span>Last {range === "7d" ? "7 days" : range === "30d" ? "30 days" : "90 days"}</span>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <h1 className="text-4xl sm:text-[42px] font-medium tracking-[-0.025em] text-foreground leading-[1.02]">
            Performance
          </h1>
          <div className="flex bg-muted p-0.5 rounded-md text-xs font-medium font-mono">
            {[
              { id: "7d", label: "7d" },
              { id: "30d", label: "30d" },
              { id: "90d", label: "90d" },
            ].map((r) => (
              <button
                key={r.id}
                onClick={() => setRange(r.id as Range)}
                className={`px-3 py-1.5 rounded transition-colors ${
                  range === r.id
                    ? "bg-background text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
>
                {r.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Big-number metrics */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <HeroStat label="Conversations" value="0" delta="No data yet" neutral />
        <HeroStat label="Resolution rate" value="—" delta="No data yet" neutral />
        <HeroStat label="Avg response" value="—" delta="No data yet" neutral />
        <HeroStat label="Unique users" value="0" delta="No data yet" neutral />
      </section>

      {/* Hero bar chart */}
      <section className="bg-background border border-border rounded-xl overflow-hidden">
        <div className="flex items-center justify-between px-6 pt-5 pb-1">
          <div>
            <div className="text-xs text-muted-foreground font-mono tracking-normal mb-1">
              Conversation volume
            </div>
            <div className="text-[28px] font-medium tracking-tight tabular-nums">
              0
              <span className="text-sm text-muted-foreground font-normal ml-2">
                messages · {range === "7d" ? "7 days" : range === "30d" ? "30 days" : "90 days"}
              </span>
            </div>
          </div>
        </div>
        <div className="px-4 sm:px-6 pb-6 pt-4">
          <BarChart
            data={[]}
            height={260}
            emptyLabel="No conversations yet"
            color="var(--brand)"
          />
        </div>
      </section>

      {/* Per-agent performance */}
      <section className="bg-background border border-border rounded-xl overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <div>
            <h3 className="text-[13px] font-medium text-foreground">By agent</h3>
            <p className="text-xs text-muted-foreground mt-0.5 font-mono">
              {chatbots.length} {chatbots.length === 1 ? "agent" : "agents"} tracked
            </p>
          </div>
          <Link
            href="/dashboard/agents"
            className="text-xs text-muted-foreground hover:text-foreground transition-colors"
>
            View all →
          </Link>
        </div>
        {chatbots.length === 0 ? (
          <div className="py-12 text-center text-sm text-muted-foreground">
            No agents yet.{""}
            <Link href="/dashboard/agents" className="underline text-foreground">
              Create one
            </Link>
          </div>
        ) : (
          <div className="px-5 py-2">
            <BarList
              items={chatbots.slice(0, 10).map((bot: any) => ({
                label: bot.name,
                value: 0,
                subtitle: "No data yet",
                active: false,
              }))}
              color="var(--agent)"
              max={100}
              valueFormat={() =>"—"}
            />
          </div>
        )}
      </section>

      {/* Knowledge gaps */}
      <section className="bg-background border border-border rounded-xl overflow-hidden">
        <div className="px-5 py-4 border-b border-border">
          <h3 className="text-[13px] font-medium text-foreground">Knowledge gaps</h3>
          <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
            Questions your agents couldn&apos;t answer well. Add these topics to your knowledge base.
          </p>
        </div>
        <div className="py-12 px-5 text-center text-sm text-muted-foreground">
          <div>No gaps detected yet</div>
          <div className="text-xs text-muted-foreground/70 mt-1">
            Data will appear as your agents receive questions
          </div>
        </div>
      </section>
    </div>
  );
}

// ─── HERO STAT ───────────────────────────────────────────────────────────────

function HeroStat({
  label,
  value,
  delta,
  positive,
  neutral,
}: {
  label: string;
  value: string;
  delta: string;
  positive?: boolean;
  neutral?: boolean;
}) {
  const color = positive
    ? "var(--accent-green)"
    : neutral
    ? "var(--muted-foreground)"
    : "var(--destructive)";
  return (
    <div className="bg-background border border-border rounded-xl p-5 flex flex-col gap-4">
      <div className="text-xs text-muted-foreground font-mono tracking-normal">
        {label}
      </div>
      <div className="text-[40px] font-medium tracking-[-0.02em] tabular-nums leading-[1] text-foreground">
        {value}
      </div>
      <div className="text-xs font-mono flex items-center gap-1" style={{ color }}>
        {positive && <ArrowUp className="w-3 h-3" />}
        {!positive && !neutral && <ArrowDown className="w-3 h-3" />}
        <span>{delta}</span>
      </div>
    </div>
  );
}
