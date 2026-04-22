import Link from "next/link";
import { ArrowRight, Bot } from "lucide-react";
import { STATUS } from "@/lib/constants";
import type { Chatbot } from "@/lib/types";

interface AgentCardProps {
  bot: Chatbot & Record<string, unknown>;
}

export function AgentCard({ bot }: AgentCardProps) {
  const status = ((bot.status as string) || STATUS.ACTIVE).toLowerCase();

  const statusColor =
    status === STATUS.CREATING
      ? "var(--accent-gold)"
      : status === STATUS.FAILED
      ? "var(--destructive)"
      : "var(--accent-green)";

  const statusLabel =
    status === STATUS.CREATING ? "Training" : status === STATUS.FAILED ? "Failed" : "Live";

  return (
    <Link
      href={`/dashboard/agents/${bot.id}`}
      className="bg-background border border-border rounded-2xl p-5 flex flex-col gap-3 hover:border-border-medium transition-colors min-h-[220px]"
    >
      <div className="flex items-center justify-between gap-2">
        <div
          className="w-9 h-9 rounded-md flex items-center justify-center shrink-0"
          style={{ background: "var(--agent-bg)", color: "var(--agent)" }}
        >
          <Bot className="w-4 h-4" />
        </div>
        <span className="text-[11px] font-medium flex items-center gap-1.5" style={{ color: statusColor }}>
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
        <span className="flex items-center gap-1 text-foreground font-medium">
          Open
          <ArrowRight className="w-3 h-3" />
        </span>
      </div>
    </Link>
  );
}
