"use client";

import { Plus, RefreshCw, Search, Sparkles } from "lucide-react";
/* eslint-disable @typescript-eslint/no-explicit-any */

import { useEffect, useState } from "react";

import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { fetchChatbots } from "@/lib/store/slices/chatbotsSlice";
import AgentFormDrawer from "@/app/components/AgentFormDrawer";
import { AgentCard } from "./components/AgentCard";
import { Button } from "@/components/ui/button";
import { PageHeader, ChatbotCardSkeleton, Input } from "@/app/components/ui";
import type { Chatbot } from "@/lib/types";

export default function AgentsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editBot, setEditBot] = useState<Chatbot | null>(null);
  const [filterValue, setFilterValue] = useState("");

  const dispatch = useAppDispatch();
  const { items: chatbots, status } = useAppSelector((state) => state.chatbots);
  const isLoading = status === "loading";

  useEffect(() => {
    if (status === "idle") dispatch(fetchChatbots());
  }, [dispatch, status]);

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
        <AgentFormDrawer
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
            className="border border-dashed border-border rounded-2xl p-5 flex flex-col items-center justify-center gap-2 min-h-[220px] text-muted-foreground hover:border-border-medium hover:bg-muted/50 hover:text-foreground transition-colors"
>
            <div className="w-10 h-10 rounded-md bg-muted flex items-center justify-center">
              <Plus className="w-5 h-5" />
            </div>
            <span className="text-sm font-medium">New agent</span>
          </button>
        </div>
      </div>

      <AgentFormDrawer
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

