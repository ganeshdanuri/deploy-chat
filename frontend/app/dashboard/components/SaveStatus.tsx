"use client";

import { useEffect, useState } from "react";
import { Check, Loader2, AlertCircle, Clock } from "lucide-react";

export type SaveState = "idle" | "saving" | "saved" | "error";

interface SaveStatusProps {
  state: SaveState;
  /** Seconds since last save — shown when state is "saved". If undefined, shows "Saved" */
  savedAt?: Date | null;
  className?: string;
}

function timeAgo(date: Date): string {
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
  if (seconds < 5) return "just now";
  if (seconds < 60) return `${seconds}s ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes === 1) return "1 min ago";
  return `${minutes} mins ago`;
}

export function SaveStatus({ state, savedAt, className = "" }: SaveStatusProps) {
  const [, forceUpdate] = useState(0);

  // Re-render every 15s so "X mins ago" stays fresh
  useEffect(() => {
    if (state !== "saved" || !savedAt) return;
    const t = setInterval(() => forceUpdate((n) => n + 1), 15_000);
    return () => clearInterval(t);
  }, [state, savedAt]);

  if (state === "idle") return null;

  return (
    <span
      className={`inline-flex items-center gap-1.5 text-[12px] font-medium transition-opacity duration-300 ${className} ${
        state === "saving"
          ? "text-muted-foreground"
          : state === "saved"
          ? "text-[var(--accent-green)]"
          : "text-destructive"
      }`}
    >
      {state === "saving" && <Loader2 className="w-3 h-3 animate-spin" />}
      {state === "saved" && <Check className="w-3 h-3" strokeWidth={2.5} />}
      {state === "error" && <AlertCircle className="w-3 h-3" />}
      {state === "saving" && "Saving…"}
      {state === "saved" && (savedAt ? `Saved ${timeAgo(savedAt)}` : "Saved")}
      {state === "error" && "Save failed"}
    </span>
  );
}

/**
 * Hook that manages save state lifecycle.
 * After a successful save, stays "saved" for `holdMs` then returns to "idle".
 */
export function useSaveStatus(holdMs = 4000) {
  const [state, setState] = useState<SaveState>("idle");
  const [savedAt, setSavedAt] = useState<Date | null>(null);

  function setSaving() {
    setState("saving");
  }

  function setSaved() {
    const now = new Date();
    setSavedAt(now);
    setState("saved");
  }

  function setError() {
    setState("error");
  }

  function reset() {
    setState("idle");
  }

  // Auto-transition saved → idle after holdMs
  useEffect(() => {
    if (state !== "saved") return;
    const t = setTimeout(() => setState("idle"), holdMs);
    return () => clearTimeout(t);
  }, [state, holdMs]);

  return { state, savedAt, setSaving, setSaved, setError, reset };
}
