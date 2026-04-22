import { useEffect } from "react";

export type ShortcutHandler = {
  key: string;
  meta?: boolean;
  ctrl?: boolean;
  shift?: boolean;
  description: string;
  action: () => void;
};

export const SHORTCUTS: Omit<ShortcutHandler, "action">[] = [
  { key: "k",   meta: true,  description: "Focus search" },
  { key: "k",   ctrl: true,  description: "Focus search" },
  { key: "n",   meta: true,  description: "New agent" },
  { key: "n",   ctrl: true,  description: "New agent" },
  { key: "?",                description: "Show keyboard shortcuts" },
];

export function useKeyboardShortcuts(handlers: ShortcutHandler[]) {
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      // Don't fire inside inputs/textareas
      const tag = (e.target as HTMLElement).tagName;
      if (["INPUT", "TEXTAREA", "SELECT"].includes(tag) && e.key !== "Escape") return;

      for (const h of handlers) {
        const metaMatch  = h.meta  ? (e.metaKey || e.ctrlKey) : !e.metaKey;
        const ctrlMatch  = h.ctrl  ? e.ctrlKey  : true;
        const shiftMatch = h.shift ? e.shiftKey : !e.shiftKey;
        const keyMatch   = e.key.toLowerCase() === h.key.toLowerCase();

        if (keyMatch && metaMatch && shiftMatch) {
          if (h.meta || h.ctrl) e.preventDefault();
          h.action();
          return;
        }
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [handlers]);
}
