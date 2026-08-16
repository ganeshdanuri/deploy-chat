"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowRight, Bot, RefreshCw } from "lucide-react";

import { useAppDispatch } from "@/lib/store/hooks";
import { resumeChatbot } from "@/lib/store/slices/chatbotsSlice";
import showToast from "@/lib/toast";
import { STATUS } from "@/lib/constants";
import type { Chatbot } from "@/lib/types";

interface AgentCardProps {
  bot: Chatbot & Record<string, unknown>;
}

export function AgentCard({ bot }: AgentCardProps) {
  const dispatch = useAppDispatch();
  const [isRetrying, setIsRetrying] = useState(false);

  const status = ((bot.status as string) || STATUS.ACTIVE).toLowerCase();
  const hasFailed = status === STATUS.FAILED;

  const statusColor =
    status === STATUS.CREATING
      ? "var(--accent-gold)"
      : hasFailed
      ? "var(--destructive)"
      : "var(--accent-green)";

  const statusLabel =
    status === STATUS.CREATING ? "Training" : hasFailed ? "Failed" : "Live";

  // The card is one big <Link>, so the inline action has to opt out of it.
  const handleRetry = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsRetrying(true);
    try {
      await dispatch(resumeChatbot(bot.id)).unwrap();
      showToast.success(`Retraining "${bot.name}"`);
    } catch (err) {
      showToast.error(
        err instanceof Error ? err.message : "Couldn't restart training"
      );
    } finally {
      setIsRetrying(false);
    }
  };

  return (
    <Link
      href={`/dashboard/agents/${bot.id}`}
      className="group bg-background border border-border rounded-2xl p-5 flex flex-col gap-3 min-h-[220px]
                 transition-all duration-200 hover:border-border-medium hover:shadow-md
                 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2
                 focus-visible:ring-foreground/20"
    >
      <div className="flex items-center justify-between gap-2">
        <div
          className="w-9 h-9 rounded-md flex items-center justify-center shrink-0"
          style={{ background: "var(--agent-bg)", color: "var(--agent)" }}
        >
          <Bot className="w-4 h-4" />
        </div>
        <span
          className="text-[11px] font-medium flex items-center gap-1.5"
          style={{ color: statusColor }}
        >
          <span className="w-1.5 h-1.5 rounded-full" style={{ background: statusColor }} />
          {statusLabel}
        </span>
      </div>

      <div>
        <h3 className="text-[15px] font-medium text-foreground truncate">{bot.name}</h3>
        <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2 leading-relaxed">
          {(bot.welcome_message as string) || "No welcome message set"}
        </p>
      </div>

      <div className="mt-auto flex items-center justify-between pt-3 border-t border-border text-xs">
        <span className="text-muted-foreground tabular-nums">
          {(bot.chunk_count as number) ?? 0} chunks
        </span>

        {hasFailed ? (
          // A dead "Failed" label leaves the user nowhere. Offer the fix here.
          <button
            onClick={handleRetry}
            disabled={isRetrying}
            className="flex items-center gap-1.5 font-medium rounded-md px-2 py-1 -mr-1
                       text-destructive hover:bg-destructive/10 transition-colors
                       disabled:opacity-60 disabled:cursor-not-allowed"
          >
            <RefreshCw className={`w-3 h-3 ${isRetrying ? "animate-spin" : ""}`} />
            {isRetrying ? "Retrying…" : "Retry training"}
          </button>
        ) : (
          <span className="flex items-center gap-1 text-muted-foreground group-hover:text-foreground font-medium transition-colors">
            Open
            <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
          </span>
        )}
      </div>
    </Link>
  );
}
