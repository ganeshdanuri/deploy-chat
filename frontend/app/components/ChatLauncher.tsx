"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowUp, MessageSquare, X } from "lucide-react";
import { usePrefersReducedMotion } from "@/lib/hooks/usePrefersReducedMotion";
import { DEMO_QA, GREETING, answerFor, type Msg } from "@/lib/demoAgent";

const THINKING_MS = 650;

/**
 * The live product, running on the marketing page.
 *
 * Geometry mirrors public/widget.js so this is what a customer actually gets:
 * a 50px launcher at 12px radius, 20px from each edge, a 370x560 panel. The
 * one deliberate divergence is that the panel is absolutely positioned rather
 * than sitting in the root's flex column, so a closed panel reserves no space
 * and the launcher stays pinned to the corner.
 */
export default function ChatLauncher() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [pending, setPending] = useState(false);
  const [input, setInput] = useState("");

  const launcherRef = useRef<HTMLButtonElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const mounted = useRef(false);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  // Move focus in on open and back to the launcher on close — but not on the
  // first run, which would steal focus from the page on load.
  useEffect(() => {
    if (!mounted.current) {
      mounted.current = true;
      return;
    }
    if (open) inputRef.current?.focus();
    else launcherRef.current?.focus();
  }, [open]);

  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages, pending, open]);

  // Answer on a delay so the indicator reads as thought rather than lag.
  useEffect(() => {
    if (!pending) return;
    const last = messages[messages.length - 1];
    if (last?.role !== "user") return;
    const t = setTimeout(() => {
      setMessages((m) => [...m, answerFor(last.text)]);
      setPending(false);
    }, reduced ? 0 : THINKING_MS);
    return () => clearTimeout(t);
  }, [pending, messages, reduced]);

  const ask = (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || pending) return;
    setMessages((m) => [...m, { role: "user", text: trimmed }]);
    setInput("");
    setPending(true);
  };

  const toggle = () => setOpen((o) => !o);

  return (
    <div className="dm-demo-root">
      <div
        id="demo-chat-panel"
        role="dialog"
        aria-label="Deploy Chat demo assistant"
        aria-hidden={!open}
        data-open={open ? "" : undefined}
        className="dm-demo-panel"
      >
        <div className="flex items-center justify-between px-4 py-3 border-b border-border shrink-0">
          <div className="flex items-center gap-2.5">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center text-[11px] font-semibold shrink-0"
              style={{ background: "var(--launcher-color, var(--blue))", color: "var(--blue-ink)" }}
            >
              DC
            </div>
            <div>
              <div className="text-[13px] font-medium leading-tight flex items-center gap-1.5">
                Deploy Chat
                <span className="text-[10px] font-medium px-1.5 py-px rounded-full bg-muted text-muted-foreground">
                  demo
                </span>
              </div>
              <div className="text-[11px] text-muted-foreground flex items-center gap-1.5 mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse-dot" />
                Online · replies instantly
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Close chat"
            className="w-7 h-7 -mr-1 rounded-md flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          >
            <X className="w-4 h-4" strokeWidth={1.75} />
          </button>
        </div>

        <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4">
          <div className="flex flex-col gap-2.5" aria-live="polite">
            <div className="self-start max-w-[88%] bg-muted text-foreground px-3 py-2 rounded-xl rounded-tl-sm text-[13px] leading-relaxed">
              {GREETING}
            </div>

            {messages.map((m, i) => (
              <div
                key={i}
                className={
                  m.role === "user"
                    ? "self-end max-w-[85%] bg-foreground text-background px-3 py-2 rounded-xl rounded-tr-sm text-[13px] leading-relaxed"
                    : "self-start max-w-[90%] bg-muted text-foreground px-3 py-2 rounded-xl rounded-tl-sm text-[13px] leading-relaxed"
                }
              >
                {m.text}
                {m.code && (
                  <div className="mt-2 bg-foreground text-background rounded-md px-2.5 py-2 font-mono text-[11px] leading-relaxed overflow-x-auto">
                    {m.code}
                  </div>
                )}
              </div>
            ))}

            {pending && (
              <div className="self-start flex gap-1 px-3 py-2">
                <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground animate-typing-dot" style={{ animationDelay: "0ms" }} />
                <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground animate-typing-dot" style={{ animationDelay: "150ms" }} />
                <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground animate-typing-dot" style={{ animationDelay: "300ms" }} />
              </div>
            )}

            {messages.length === 0 && (
              <div className="flex flex-wrap gap-1.5 mt-1">
                {DEMO_QA.map((s) => (
                  <button
                    key={s.chip}
                    type="button"
                    onClick={() => ask(s.chip)}
                    className="text-[11px] px-2.5 py-1 bg-background border border-border rounded-full text-muted-foreground hover:text-foreground hover:border-[var(--border-medium)] transition-colors"
                  >
                    {s.chip}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            ask(input);
          }}
          className="px-3 py-2.5 border-t border-border flex items-center gap-2 shrink-0"
        >
          <label htmlFor="demo-ask" className="sr-only">
            Ask the demo agent a question
          </label>
          <input
            id="demo-ask"
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask a question…"
            autoComplete="off"
            tabIndex={open ? 0 : -1}
            className="flex-1 min-w-0 text-[12px] px-3 py-1.5 bg-muted rounded-full outline-none focus-visible:ring-2 focus-visible:ring-[var(--blue)]"
          />
          <button
            type="submit"
            aria-label="Send message"
            disabled={!input.trim() || pending}
            tabIndex={open ? 0 : -1}
            className="w-7 h-7 shrink-0 rounded-full flex items-center justify-center disabled:opacity-40 transition-opacity"
            style={{ background: "var(--launcher-color, var(--blue))", color: "var(--blue-ink)" }}
          >
            <ArrowUp className="w-3.5 h-3.5" strokeWidth={2.5} />
          </button>
        </form>
      </div>

      <button
        ref={launcherRef}
        type="button"
        onClick={toggle}
        aria-expanded={open}
        aria-controls="demo-chat-panel"
        aria-label={open ? "Close chat" : "Open chat"}
        className="dm-demo-launcher"
      >
        {open ? (
          <X className="w-5 h-5" strokeWidth={2} />
        ) : (
          <MessageSquare className="w-[22px] h-[22px]" strokeWidth={1.9} />
        )}
      </button>
    </div>
  );
}
