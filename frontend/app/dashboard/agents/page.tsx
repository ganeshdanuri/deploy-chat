"use client";

import { ArrowRight, MessagesSquare, Plus, RefreshCw, Search, Sparkles } from "lucide-react";
/* eslint-disable @typescript-eslint/no-explicit-any */

import { useEffect, useState } from "react";
import Link from "next/link";

import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { fetchChatbots } from "@/lib/store/slices/chatbotsSlice";
import CreateAIAssistantDrawer from "@/app/components/CreateAIAssistantDrawer";
import { Button } from "@/components/ui/button";
import { PageHeader, ChatbotCardSkeleton, Input } from "@/app/components/ui";
import type { Chatbot } from "@/lib/types";
import { STATUS } from "@/lib/constants";

export default function AgentsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editBot, setEditBot] = useState<Chatbot | null>(null);
  const [filterValue, setFilterValue] = useState("");

  const dispatch = useAppDispatch();
  const { items: chatbots, status } = useAppSelector((state) => state.chatbots);
  const isLoading = status === "loading";

  useEffect(() => {
    dispatch(fetchChatbots());
  }, [dispatch]);

  const filtered = chatbots.filter((bot) =>
    bot.name.toLowerCase().includes(filterValue.toLowerCase())
  );

  if (isLoading && chatbots.length === 0) {
    return (
      <div className="space-y-6">
        <PageHeader title="Agents" description="Your AI assistants." />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <ChatbotCardSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  if (chatbots.length === 0) {
    return (
      <>
        <div className="w-full max-w-2xl mx-auto py-12 text-center">
          <div
            className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-5"
            style={{ background: "var(--agent-bg)", color: "var(--agent)" }}
>
            <Sparkles className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-medium tracking-tight mb-2">
            Create your first agent
          </h1>
          <p className="text-muted-foreground max-w-sm mx-auto mb-6 leading-relaxed">
            Agents are AI assistants trained on your knowledge. Give one a name and
            a persona, and it&apos;s live in minutes.
          </p>
          <Button onClick={() => setIsModalOpen(true)}>
            <Plus className="w-4 h-4 mr-1.5" />
            New agent
          </Button>
        </div>
        <CreateAIAssistantDrawer
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setEditBot(null);
          }}
          editBot={editBot}
        />
      </>
    );
  }

  return (
    <>
      <div className="space-y-6 animate-fade-in-up">
        <PageHeader
          title="Agents"
          description={`${chatbots.length} ${
            chatbots.length === 1 ? "agent" : "agents"
          } · click any to configure, deploy, or monitor.`}
          actions={
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => dispatch(fetchChatbots())}
                disabled={isLoading}
>
                <RefreshCw
                  className={`w-4 h-4 mr-1.5 ${isLoading ? "animate-spin" : ""}`}
                />
                Refresh
              </Button>
              <Button
                size="sm"
                onClick={() => {
                  setEditBot(null);
                  setIsModalOpen(true);
                }}
>
                <Plus className="w-4 h-4 mr-1.5" />
                New agent
              </Button>
            </div>
          }
        />

        <Input
          isClearable
          className="max-w-xs"
          placeholder="Search agents..."
          startContent={<Search className="w-4 h-4 text-muted-foreground" />}
          value={filterValue}
          onClear={() => setFilterValue("")}
          onValueChange={setFilterValue}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {filtered.map((bot: any) => (
            <AgentCard key={bot.id} bot={bot} />
          ))}
          <button
            onClick={() => setIsModalOpen(true)}
            className="border border-dashed border-border rounded-xl p-5 flex flex-col items-center justify-center gap-2 min-h-[180px] text-muted-foreground hover:border-border-medium hover:bg-muted/50 hover:text-foreground transition-colors"
>
            <div className="w-10 h-10 rounded-md bg-muted flex items-center justify-center">
              <Plus className="w-5 h-5" />
            </div>
            <span className="text-sm font-medium">New agent</span>
          </button>
        </div>
      </div>

      <CreateAIAssistantDrawer
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditBot(null);
        }}
        editBot={editBot}
      />
    </>
  );
}

function AgentCard({ bot }: { bot: any }) {
  const status = (bot.status || STATUS.ACTIVE).toLowerCase();
  const statusColor =
    status === STATUS.CREATING ? "var(--accent-gold)" :
    status === STATUS.FAILED ? "var(--destructive)" :
"var(--accent-green)";
  const statusLabel =
    status === STATUS.CREATING ? "Training" :
    status === STATUS.FAILED ? "Failed" :
"Live";

  return (
    <Link
      href={`/dashboard/agents/${bot.id}`}
      className="bg-background border border-border rounded-xl p-5 flex flex-col gap-3 hover:border-border-medium transition-colors min-h-[180px]"
>
      <div className="flex items-start justify-between gap-2">
        <div
          className="w-9 h-9 rounded-md flex items-center justify-center shrink-0"
          style={{ background: "var(--agent-bg)", color: "var(--agent)" }}
>
          <MessagesSquare className="w-4 h-4" />
        </div>
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
      <div>
        <h3 className="text-[15px] font-medium text-foreground truncate">
          {bot.name}
        </h3>
        <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2 leading-relaxed">
          {bot.welcome_message ||"No welcome message set"}
        </p>
      </div>
      <div className="mt-auto flex items-center justify-between pt-3 border-t border-border text-xs">
        <span className="text-muted-foreground tabular-nums">
          {bot.chunk_count ?? 0} chunks
        </span>
        <span className="flex items-center gap-1 text-foreground font-medium">
          Configure <ArrowRight className="w-3 h-3" />
        </span>
      </div>
    </Link>
  );
}
