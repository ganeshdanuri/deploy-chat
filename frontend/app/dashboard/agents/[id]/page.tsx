"use client";

import { ArrowLeft, Check, Code, Copy, ExternalLink, MessagesSquare, Pencil, RefreshCw, Sparkles, Trash2 } from "lucide-react";
/* eslint-disable @typescript-eslint/no-explicit-any */

import { useEffect, useState, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { fetchChatbots, deleteChatbot } from "@/lib/store/slices/chatbotsSlice";
import api from "@/lib/api";
import { ENDPOINTS } from "@/lib/endpoints";
import showToast from "@/lib/toast";
import { Button } from "@/components/ui/button";
import { BarChart } from "@/app/components/charts/BarChart";
import {
  DeleteConfirmationModal,
} from "@/app/components/ui";
import AgentFormDrawer from "@/app/components/AgentFormDrawer";
import { STATUS } from "@/lib/constants";
import type { Chatbot } from "@/lib/types";

type Tab ="overview" |"knowledge" |"configure" |"deploy" |"monitor";

const TABS: { id: Tab; label: string }[] = [
  { id: "overview", label: "Overview" },
  { id: "knowledge", label: "Knowledge" },
  { id: "configure", label: "Configure" },
  { id: "deploy", label: "Deploy" },
  { id: "monitor", label: "Monitor" },
];

export default function AgentDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { items: chatbots } = useAppSelector((state) => state.chatbots);
  const bot = chatbots.find((b) => b.id === id);

  const [activeTab, setActiveTab] = useState<Tab>("overview");
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (chatbots.length === 0) dispatch(fetchChatbots());
  }, [dispatch, chatbots.length]);

  if (!bot) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <div className="w-14 h-14 rounded-full bg-muted flex items-center justify-center mb-5">
          <MessagesSquare className="w-6 h-6 text-muted-foreground" />
        </div>
        <h2 className="text-lg font-medium">Agent not found</h2>
        <p className="text-sm text-muted-foreground mt-1 mb-5">
          The agent you&apos;re looking for doesn&apos;t exist or was removed.
        </p>
        <Button variant="outline" asChild>
          <Link href="/dashboard/agents">
            <ArrowLeft className="w-4 h-4 mr-1.5" /> Back to agents
          </Link>
        </Button>
      </div>
    );
  }

  const status = ((bot as any).status || STATUS.ACTIVE).toLowerCase();
  const statusColor =
    status === STATUS.CREATING ? "var(--accent-gold)" :
    status === STATUS.FAILED ? "var(--destructive)" :
"var(--accent-green)";
  const statusLabel =
    status === STATUS.CREATING ? "Training" :
    status === STATUS.FAILED ? "Failed" :
"Live";

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await dispatch(deleteChatbot(id)).unwrap();
      showToast.success(`Agent"${bot.name}" deleted`);
      router.push("/dashboard/agents");
    } catch (err: any) {
      showToast.error(err?.message ||"Failed to delete agent");
    } finally {
      setIsDeleting(false);
      setDeleteOpen(false);
    }
  };

  return (
    <>
      <div className="space-y-6 animate-fade-in-up">
        {/* Breadcrumb */}
        <div className="flex items-center gap-1.5 text-sm">
          <Link
            href="/dashboard/agents"
            className="text-muted-foreground hover:text-foreground transition-colors"
>
            Agents
          </Link>
          <span className="text-muted-foreground">/</span>
          <span className="text-foreground font-medium">{bot.name}</span>
        </div>

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div
              className="w-12 h-12 rounded-lg flex items-center justify-center shrink-0"
              style={{ background: "var(--agent-bg)", color: "var(--agent)" }}
>
              <MessagesSquare className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <h1 className="text-2xl font-medium tracking-tight">{bot.name}</h1>
                <span
                  className="text-[11px] font-medium flex items-center gap-1.5"
                  style={{ color: statusColor }}
>
                  <span
                    className="w-1.5 h-1.5 rounded-full"
                    style={{ background: statusColor }}
                  />
                  {statusLabel}
                </span>
              </div>
              <p className="text-sm text-muted-foreground mt-0.5">
                {(bot as any).chunk_count ?? 0} chunks · Created{""}
                {new Date(bot.created_at).toLocaleDateString()}
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" asChild>
              <Link href={`/dashboard/playground?chatbotId=${bot.id}`}>
                <Sparkles className="w-4 h-4 mr-1.5" />
                Test
              </Link>
            </Button>
            <Button size="sm" onClick={() => setActiveTab("deploy")}>
              <Code className="w-4 h-4 mr-1.5" />
              Deploy
            </Button>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-border">
          <div className="flex gap-1 overflow-x-auto -mb-px">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                  activeTab === tab.id
                    ? "border-foreground text-foreground"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
>
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tab content */}
        <div className="animate-fade-in">
          {activeTab === "overview" && <OverviewTab bot={bot as any} onEdit={() => setEditOpen(true)} onDelete={() => setDeleteOpen(true)} />}
          {activeTab === "knowledge" && <KnowledgeTab bot={bot as any} />}
          {activeTab === "configure" && <ConfigureTab bot={bot as any} onEdit={() => setEditOpen(true)} />}
          {activeTab === "deploy" && <DeployTab bot={bot as any} />}
          {activeTab === "monitor" && <MonitorTab bot={bot as any} />}
        </div>
      </div>

      <AgentFormDrawer
        isOpen={editOpen}
        onClose={() => setEditOpen(false)}
        editBot={bot as any}
      />

      <DeleteConfirmationModal
        isOpen={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        onConfirm={handleDelete}
        isLoading={isDeleting}
        title="Delete this agent? "
        description="This will permanently remove the agent and all its chat history."
        itemName={bot.name}
      />
    </>
  );
}

// ─── OVERVIEW TAB ────────────────────────────────────────────────────────────

function OverviewTab({
  bot,
  onEdit,
  onDelete,
}: {
  bot: Chatbot;
  onEdit: () => void;
  onDelete: () => void;
}) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1.5fr_1fr] gap-4">
      <div className="space-y-4">
        <InfoCard title="Welcome message" action={<Button size="xs" variant="ghost" onClick={onEdit}><Pencil className="w-3 h-3" /></Button>}>
          <p className="text-sm text-foreground leading-relaxed">
            &quot;{(bot as any).welcome_message ||"Hi! How can I help you today? "}&quot;
          </p>
        </InfoCard>

        <InfoCard title="Persona / system prompt">
          <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap">
            {(bot as any).system_prompt ||"No custom persona set. Using default."}
          </p>
        </InfoCard>
      </div>

      <div className="space-y-4">
        <InfoCard title="Health">
          <div className="space-y-2.5 text-sm">
            <Row label="Status" value="Operational" valueColor="var(--accent-green)" />
            <Row label="Model" value={(bot as any).model ||"gpt-4o-mini"} />
            <Row label="Temperature" value={String((bot as any).temperature ?? 0.7)} />
            <Row label="Chunks" value={String((bot as any).chunk_count ?? 0)} />
          </div>
        </InfoCard>

        <InfoCard title="Danger zone">
          <Button
            variant="outline"
            size="sm"
            onClick={onDelete}
            className="w-full border-destructive/30 text-destructive hover:bg-destructive/5 hover:text-destructive"
>
            <Trash2 className="w-3.5 h-3.5 mr-1.5" />
            Delete this agent
          </Button>
        </InfoCard>
      </div>
    </div>
  );
}

// ─── KNOWLEDGE TAB ───────────────────────────────────────────────────────────

function KnowledgeTab({ bot }: { bot: Chatbot }) {
  const { items: datasets } = useAppSelector((state) => state.datasets);
  const attached = (bot as any).dataset_ids || [];
  const attachedDatasets = datasets.filter((d: any) => attached.includes(d.id));

  return (
    <div className="space-y-4">
      <InfoCard
        title={`Connected knowledge bases (${attachedDatasets.length})`}
        action={
          <Button size="sm" variant="outline" asChild>
            <Link href="/dashboard/knowledge">Manage knowledge</Link>
          </Button>
        }
>
        {attachedDatasets.length === 0 ? (
          <div className="py-8 text-center text-sm text-muted-foreground">
            No knowledge attached yet.{""}
            <Link href="/dashboard/knowledge" className="underline text-foreground">
              Add some
            </Link>
            .
          </div>
        ) : (
          <div className="divide-y divide-border -mx-6">
            {attachedDatasets.map((ds: any) => (
              <div
                key={ds.id}
                className="flex items-center justify-between px-6 py-3"
>
                <div>
                  <div className="text-sm font-medium text-foreground">{ds.name}</div>
                  <div className="text-xs text-muted-foreground mt-0.5">
                    Collection · {new Date(ds.created_at).toLocaleDateString()}
                  </div>
                </div>
                <span className="text-[11px] font-medium" style={{ color: "var(--accent-green)" }}>
                  ● Indexed
                </span>
              </div>
            ))}
          </div>
        )}
      </InfoCard>
    </div>
  );
}

// ─── CONFIGURE TAB ───────────────────────────────────────────────────────────

function ConfigureTab({ bot, onEdit }: { bot: Chatbot; onEdit: () => void }) {
  return (
    <div className="space-y-4">
      <InfoCard title="Configuration">
        <div className="space-y-3">
          <Row label="Name" value={bot.name} />
          <Row label="Welcome message" value={(bot as any).welcome_message ||"—"} />
          <Row label="Model" value={(bot as any).model ||"gpt-4o-mini"} />
          <Row label="Temperature" value={String((bot as any).temperature ?? 0.7)} />
          <Row label="Max tokens" value={String((bot as any).max_tokens ?? 1024)} />
        </div>
        <div className="mt-5 pt-4 border-t border-border">
          <Button onClick={onEdit}>
            <Pencil className="w-3.5 h-3.5 mr-1.5" />
            Edit configuration
          </Button>
        </div>
      </InfoCard>
    </div>
  );
}

// ─── DEPLOY TAB ──────────────────────────────────────────────────────────────

const DEPLOY_COLORS = [
  { label: "Blue",   value: "#0052FF" },
  { label: "Black",  value: "#09090b" },
  { label: "Violet", value: "#7c3aed" },
  { label: "Green",  value: "#16a34a" },
  { label: "Rose",   value: "#e11d48" },
  { label: "Orange", value: "#ea580c" },
];

const RADIUS_OPTIONS = [
  { label: "Square", value: "4px"  },
  { label: "Rounded", value: "12px" },
  { label: "Pill",   value: "26px" },
];

function DeployTab({ bot }: { bot: Chatbot }) {
  const [copied, setCopied] = useState<string | null>(null);
  const [widgetColor, setWidgetColor] = useState(DEPLOY_COLORS[0].value);
  const [widgetPosition, setWidgetPosition] = useState<"bottom-right" | "bottom-left">("bottom-right");
  const [widgetRadius, setWidgetRadius] = useState(RADIUS_OPTIONS[0].value);
  const [customHex, setCustomHex] = useState("");

  const baseUrl = typeof window !== "undefined" ? window.location.origin : "";
  const backendUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
  const embedCode = [
    `<script`,
    `  src="${baseUrl}/widget.js"`,
    `  data-token="${(bot as any).embed_token}"`,
    `  data-color="${widgetColor}"`,
    `  data-position="${widgetPosition}"`,
    `  data-radius="${widgetRadius}"`,
    `  data-api="${backendUrl}"`,
    `  async`,
    `></script>`,
  ].join("\n");
  const apiUrl = `${baseUrl}/api/v1/chatbots/${bot.id}/chat`;

  const copy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="space-y-4">
      <InfoCard title="Embed on your website">
        <p className="text-sm text-muted-foreground mb-5">
          Customise the widget, then paste the snippet into your site&apos;s <code className="text-xs bg-muted px-1.5 py-0.5 rounded">&lt;head&gt;</code>.
        </p>

        {/* ── Customise + live preview side-by-side ── */}
        <div className="flex flex-col sm:flex-row gap-6 mb-5 pb-5 border-b border-border">

          {/* Controls */}
          <div className="flex-1 space-y-4">

            {/* Color */}
            <div className="space-y-2">
              <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">Color</p>

              {/* Preset swatches */}
              <div className="flex gap-2 items-center flex-wrap">
                {DEPLOY_COLORS.map((c) => (
                  <button
                    key={c.value}
                    title={c.label}
                    onClick={() => { setWidgetColor(c.value); setCustomHex(""); }}
                    className="w-6 h-6 rounded-md border-2 transition-all hover:scale-110 shrink-0"
                    style={{
                      background: c.value,
                      borderColor: widgetColor === c.value && !customHex ? "#fff" : "transparent",
                      boxShadow: widgetColor === c.value && !customHex ? `0 0 0 2px ${c.value}` : "none",
                    }}
                  />
                ))}
              </div>

              {/* Divider */}
              <div className="flex items-center gap-2 pt-0.5">
                <div className="h-px flex-1 bg-border" />
                <span className="text-[10px] text-muted-foreground/60 font-medium uppercase tracking-wider shrink-0">Custom</span>
                <div className="h-px flex-1 bg-border" />
              </div>

              {/* Custom color row */}
              <div className="flex items-center gap-2">
                <label
                  className="relative w-7 h-7 rounded-md overflow-hidden border border-border cursor-pointer shrink-0 hover:scale-105 transition-transform"
                  title="Open color picker"
                >
                  <input
                    type="color"
                    value={customHex ? `#${customHex}` : widgetColor}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    onChange={(e) => {
                      const hex = e.target.value.replace("#", "");
                      setCustomHex(hex);
                      setWidgetColor(e.target.value);
                    }}
                  />
                  <span
                    className="block w-full h-full"
                    style={{ background: customHex ? `#${customHex}` : widgetColor }}
                  />
                </label>
                <div className="flex items-center gap-1 flex-1">
                  <span className="text-[12px] text-muted-foreground font-mono">#</span>
                  <input
                    type="text"
                    maxLength={6}
                    value={customHex}
                    placeholder="e.g. 7c3aed"
                    className="flex-1 h-7 text-[12px] font-mono bg-muted border border-border rounded-md px-2 outline-none focus:border-foreground/30 transition-colors"
                    onChange={(e) => {
                      const v = e.target.value.replace(/[^0-9a-fA-F]/g, "");
                      setCustomHex(v);
                      if (v.length === 6) setWidgetColor(`#${v}`);
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Shape */}
            <div className="space-y-2">
              <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">Shape</p>
              <div className="flex gap-1.5">
                {RADIUS_OPTIONS.map((r) => (
                  <button
                    key={r.value}
                    onClick={() => setWidgetRadius(r.value)}
                    className={`px-3 h-7 text-[12px] font-medium border transition-all ${
                      widgetRadius === r.value
                        ? "bg-foreground text-background border-foreground"
                        : "bg-muted text-muted-foreground border-border hover:text-foreground"
                    }`}
                    style={{ borderRadius: r.value }}
                  >
                    {r.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Position */}
            <div className="space-y-2">
              <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">Position</p>
              <div className="flex gap-1.5">
                {(["bottom-right", "bottom-left"] as const).map((pos) => (
                  <button
                    key={pos}
                    onClick={() => setWidgetPosition(pos)}
                    className={`px-3 h-7 text-[12px] font-medium rounded-md border transition-all ${
                      widgetPosition === pos
                        ? "bg-foreground text-background border-foreground"
                        : "bg-muted text-muted-foreground border-border hover:text-foreground"
                    }`}
                  >
                    {pos === "bottom-right" ? "↘ Right" : "↙ Left"}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Live browser preview */}
          <div className="space-y-2 shrink-0">
            <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">Preview</p>
            <div className="w-44 h-28 bg-muted rounded-xl overflow-hidden border border-border relative">
              {/* Browser chrome */}
              <div className="h-6 bg-background border-b border-border flex items-center gap-1.5 px-2.5">
                <span className="w-2 h-2 rounded-full bg-red-400/70" />
                <span className="w-2 h-2 rounded-full bg-amber-400/70" />
                <span className="w-2 h-2 rounded-full bg-green-400/70" />
                <div className="flex-1 h-3 bg-muted rounded-sm ml-1" />
              </div>
              {/* Page content lines */}
              <div className="px-3 pt-3 space-y-1.5">
                <div className="h-2 bg-border/60 rounded-sm w-3/4" />
                <div className="h-2 bg-border/40 rounded-sm w-1/2" />
                <div className="h-2 bg-border/40 rounded-sm w-2/3" />
              </div>
              {/* Widget bubble */}
              <div
                className={`absolute bottom-2.5 flex items-center justify-center shadow-md ${
                  widgetPosition === "bottom-right" ? "right-2.5" : "left-2.5"
                }`}
                style={{
                  width: 30,
                  height: 30,
                  background: widgetColor,
                  borderRadius: widgetRadius,
                  transition: "all 0.2s",
                }}
              >
                <svg viewBox="0 0 24 24" fill="white" style={{ width: 14, height: 14 }}>
                  <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/>
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* ── Code block ── */}
        <div
          className="rounded-md p-4 font-mono text-[12px] leading-relaxed whitespace-pre overflow-x-auto relative"
          style={{ background: "#1A1A1A", color: "#E5E5E5" }}
        >
          {embedCode}
          <button
            onClick={() => copy(embedCode, "embed")}
            className="absolute top-2 right-2 p-1.5 rounded text-xs text-white/50 hover:bg-white/10 hover:text-white transition-colors flex items-center gap-1"
          >
            {copied === "embed" ? (
              <><Check className="w-3 h-3" /> Copied</>
            ) : (
              <><Copy className="w-3 h-3" /> Copy</>
            )}
          </button>
        </div>
      </InfoCard>

      <InfoCard title="API endpoint">
        <p className="text-sm text-muted-foreground mb-4">
          Call your agent programmatically. Pass your message in the request body.
        </p>
        <div className="flex items-center gap-2 bg-muted rounded-md p-3">
          <span className="text-xs font-mono font-medium px-2 py-0.5 rounded border border-border bg-background">
            POST
          </span>
          <code className="text-xs font-mono text-foreground flex-1 truncate">{apiUrl}</code>
          <button
            onClick={() => copy(apiUrl,"api")}
            className="p-1.5 rounded hover:bg-background transition-colors text-muted-foreground hover:text-foreground"
>
            {copied === "api" ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
          </button>
        </div>
      </InfoCard>

      <InfoCard title="Preview & share">
        <p className="text-sm text-muted-foreground mb-4">
          Open a standalone test link — share with teammates before going live.
        </p>
        <Button variant="outline" size="sm" asChild>
          <Link href={`/dashboard/playground?chatbotId=${bot.id}`}>
            <ExternalLink className="w-3.5 h-3.5 mr-1.5" />
            Open in playground
          </Link>
        </Button>
      </InfoCard>
    </div>
  );
}

// ─── MONITOR TAB ─────────────────────────────────────────────────────────────

function MonitorTab({ bot }: { bot: Chatbot }) {
  const [stats, setStats] = useState<any>({ loading: true });

  useEffect(() => {
    (async () => {
      try {
        const res = await api.get(ENDPOINTS.CHATBOTS.ANALYTICS?.(bot.id) || `/chatbots/${bot.id}/analytics`);
        setStats({ ...res.data, loading: false });
      } catch {
        setStats({ loading: false, messages: 0, resolution: 0, avgResponse: "—" });
      }
    })();
  }, [bot.id]);

  return (
    <div className="space-y-6">
      {/* Big-number stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <HeroStatSmall label="Messages" value={stats.loading ? "—" : stats.messages?.toLocaleString() ?? "0"} delta="No data yet" />
        <HeroStatSmall label="Resolution" value={stats.loading ? "—" : `${stats.resolution ?? 0}%`} delta="No data yet" />
        <HeroStatSmall label="Avg response" value={stats.loading ? "—" : stats.avgResponse ||"—"} delta="No data yet" />
        <HeroStatSmall label="Unique users" value={stats.loading ? "—" : String(stats.uniqueUsers ?? 0)} delta="No data yet" />
      </div>

      {/* Messages bar chart */}
      <div className="bg-background border border-border rounded-xl overflow-hidden">
        <div className="flex items-center justify-between px-6 pt-5 pb-1">
          <div>
            <div className="text-xs text-muted-foreground font-mono tracking-normal mb-1">
              Messages per day
            </div>
            <div className="text-[22px] font-medium tracking-tight tabular-nums">
              0
              <span className="text-sm text-muted-foreground font-normal ml-2">
                last 7 days
              </span>
            </div>
          </div>
        </div>
        <div className="px-4 sm:px-6 pb-6 pt-4">
          <BarChart
            data={[]}
            height={200}
            emptyLabel="No conversations yet"
            color="var(--agent)"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        <InfoCard title="Recent conversations">
          <div className="py-8 text-center text-sm text-muted-foreground">
            <div>No conversations yet</div>
            <div className="text-xs text-muted-foreground/70 mt-1">
              Logs will appear as users chat
            </div>
          </div>
        </InfoCard>

        <InfoCard title="Knowledge gaps">
          <p className="text-xs text-muted-foreground mb-3 leading-relaxed">
            Questions your agent couldn&apos;t answer. Add these topics to your knowledge base.
          </p>
          <div className="py-6 text-center text-sm text-muted-foreground">
            <div>No gaps detected yet</div>
            <div className="text-xs text-muted-foreground/70 mt-1">
              Keep chatting to gather data
            </div>
          </div>
        </InfoCard>
      </div>
    </div>
  );
}

function HeroStatSmall({
  label,
  value,
  delta,
}: {
  label: string;
  value: string;
  delta: string;
}) {
  return (
    <div className="bg-background border border-border rounded-xl p-5 flex flex-col gap-3">
      <div className="text-xs text-muted-foreground font-mono tracking-normal">
        {label}
      </div>
      <div className="text-[32px] font-medium tracking-[-0.02em] tabular-nums leading-[1] text-foreground">
        {value}
      </div>
      <div className="text-xs font-mono text-muted-foreground">{delta}</div>
    </div>
  );
}

// ─── SHARED BITS ─────────────────────────────────────────────────────────────

function InfoCard({
  title,
  action,
  children,
}: {
  title: string;
  action?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-background border border-border rounded-xl">
      <div className="flex items-center justify-between px-6 py-4 border-b border-border">
        <h3 className="text-[13px] font-medium text-foreground">{title}</h3>
        {action}
      </div>
      <div className="p-6">{children}</div>
    </div>
  );
}

function Row({
  label,
  value,
  valueColor,
}: {
  label: string;
  value: string;
  valueColor?: string;
}) {
  return (
    <div className="flex items-center justify-between gap-4 text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span
        className="font-medium text-right truncate"
        style={{ color: valueColor ||"var(--foreground)" }}
>
        {value}
      </span>
    </div>
  );
}

function MiniStat({
  label,
  value,
  valueColor,
}: {
  label: string;
  value: string;
  valueColor?: string;
}) {
  return (
    <div className="bg-background border border-border rounded-xl p-4">
      <div className="text-[11px] font-medium text-muted-foreground tracking-normal mb-2">
        {label}
      </div>
      <div
        className="text-2xl font-medium tracking-tight tabular-nums"
        style={{ color: valueColor ||"var(--foreground)" }}
>
        {value}
      </div>
    </div>
  );
}
