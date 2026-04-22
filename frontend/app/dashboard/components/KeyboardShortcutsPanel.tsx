"use client";

import { useEffect } from "react";
import { X } from "lucide-react";

const isMac = typeof navigator !== "undefined" && /Mac|iPhone|iPad/.test(navigator.platform);
const Mod = isMac ? "⌘" : "Ctrl";

const GROUPS = [
  {
    label: "Navigation",
    items: [
      { keys: [`${Mod}`, "K"],  description: "Focus search" },
      { keys: [`${Mod}`, "N"],  description: "New agent" },
    ],
  },
  {
    label: "General",
    items: [
      { keys: ["?"],            description: "Show this panel" },
      { keys: ["Esc"],          description: "Close / cancel" },
    ],
  },
];

interface Props {
  open: boolean;
  onClose: () => void;
}

export function KeyboardShortcutsPanel({ open, onClose }: Props) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-foreground/20 backdrop-blur-sm" aria-hidden />

      {/* Panel */}
      <div
        className="relative z-10 w-full max-w-sm bg-background border border-border rounded-2xl shadow-lg p-5 animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <p className="text-[13px] font-semibold text-foreground">Keyboard shortcuts</p>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex flex-col gap-4">
          {GROUPS.map((g) => (
            <div key={g.label}>
              <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                {g.label}
              </p>
              <div className="flex flex-col gap-1.5">
                {g.items.map((item) => (
                  <div key={item.description} className="flex items-center justify-between">
                    <span className="text-[13px] text-foreground">{item.description}</span>
                    <div className="flex items-center gap-1">
                      {item.keys.map((k) => (
                        <kbd
                          key={k}
                          className="inline-flex items-center justify-center min-w-[26px] h-[22px] px-1.5 rounded-md border border-border bg-muted text-[11px] font-medium text-muted-foreground"
                        >
                          {k}
                        </kbd>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <p className="mt-4 text-[11px] text-muted-foreground text-center">
          Press <kbd className="inline px-1 py-0.5 rounded border border-border bg-muted text-[10px]">?</kbd> anytime to open this panel
        </p>
      </div>
    </div>
  );
}
