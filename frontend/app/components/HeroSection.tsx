"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, Check } from "lucide-react";
import { usePrefersReducedMotion } from "@/lib/hooks/usePrefersReducedMotion";
import { openRegister } from "@/lib/openRegister";

type Msg = { role: "user" | "agent"; text: string; code?: string | null };

const GREETING = "Hi! I'm trained on your docs. Ask me anything.";

/* A scripted demo, not a live agent. Keyword-matched so typed questions land
   somewhere sensible, with a fallback that admits what it is rather than
   bluffing. */
const DEMO_QA = [
  {
    chip: "How do I embed it?",
    q: "How do I embed the widget on a Next.js site? ",
    a: "Add this to your root layout — that's it.",
    code: '<Script src="https://cdn.deploychat.in/w.js" />',
    keywords: ["embed", "next", "install", "script", "add", "site", "code"],
  },
  {
    chip: "What can it read?",
    q: "What data sources can I connect? ",
    a: "PDFs, websites, Notion, Google Drive, CSV, and your own API.",
    code: null,
    keywords: ["source", "data", "connect", "pdf", "notion", "drive", "csv", "crawl", "read"],
  },
  {
    chip: "Do you train on my data?",
    q: "Will it use my data to train base models? ",
    a: "Never. Your content stays private and encrypted at rest and in transit.",
    code: null,
    keywords: ["train", "privacy", "private", "secure", "encrypt", "gdpr", "model", "safe"],
  },
  {
    chip: "How long is setup?",
    q: "How long does setup take? ",
    a: "Connect a source, wait for indexing, paste one line. Usually under an hour.",
    code: null,
    keywords: ["long", "setup", "time", "quick", "fast", "start", "take"],
  },
];

const FALLBACK =
  "I'm a scripted demo, so I only know a handful of answers — try one of the suggestions below. An agent trained on your own content would handle anything in it.";

function answerFor(text: string): Msg {
  const q = text.toLowerCase();
  let best: (typeof DEMO_QA)[number] | null = null;
  let bestScore = 0;
  for (const item of DEMO_QA) {
    const score = item.keywords.filter((k) => q.includes(k)).length;
    if (score > bestScore) {
      bestScore = score;
      best = item;
    }
  }
  return best
    ? { role: "agent", text: best.a, code: best.code }
    : { role: "agent", text: FALLBACK, code: null };
}

function ChatWidget() {
  const rootRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const reduced = usePrefersReducedMotion();

  const [onScreen, setOnScreen] = useState(false);
  const [live, setLive] = useState(false);

  // Idle autoplay
  const [convoIdx, setConvoIdx] = useState(0);
  const [qText, setQText] = useState("");
  const [aText, setAText] = useState("");
  const [phase, setPhase] = useState<"q" | "pause" | "a" | "hold">("q");
  const autoplay = onScreen && !reduced && !live;

  // Live conversation
  const [messages, setMessages] = useState<Msg[]>([]);
  const [pending, setPending] = useState(false);
  const [input, setInput] = useState("");

  /* The typewriter re-renders every 20-40ms. Left ungated it keeps doing that
     for the whole session, including while scrolled far past the hero. */
  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => setOnScreen(entry.isIntersecting),
      { threshold: 0.2 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!autoplay) return;
    const convo = DEMO_QA[convoIdx];
    let t: ReturnType<typeof setTimeout>;
    switch (phase) {
      case "q":
        if (qText.length < convo.q.length) {
          t = setTimeout(() => setQText(convo.q.slice(0, qText.length + 1)), 40);
        } else {
          t = setTimeout(() => setPhase("pause"), 500);
        }
        break;
      case "pause":
        t = setTimeout(() => setPhase("a"), 600);
        break;
      case "a":
        if (aText.length < convo.a.length) {
          t = setTimeout(() => setAText(convo.a.slice(0, aText.length + 1)), 20);
        } else {
          t = setTimeout(() => setPhase("hold"), 3200);
        }
        break;
      case "hold":
        // Reset lives inside the timeout, not the effect body — advancing the
        // conversation synchronously on render is what tripped the lint rule.
        t = setTimeout(() => {
          setQText("");
          setAText("");
          setConvoIdx((i) => (i + 1) % DEMO_QA.length);
          setPhase("q");
        }, 200);
        break;
    }
    return () => clearTimeout(t);
  }, [autoplay, phase, qText, aText, convoIdx]);

  // Keep the newest message in view.
  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages, pending]);

  // Answer on a delay so the typing indicator reads as thought, not lag.
  useEffect(() => {
    if (!pending) return;
    const last = messages[messages.length - 1];
    if (last?.role !== "user") return;
    const t = setTimeout(() => {
      setMessages((m) => [...m, answerFor(last.text)]);
      setPending(false);
    }, 650);
    return () => clearTimeout(t);
  }, [pending, messages]);

  const ask = (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || pending) return;
    setLive(true);
    setMessages((m) => [...m, { role: "user", text: trimmed }]);
    setInput("");
    setPending(true);
  };

  const convo = DEMO_QA[convoIdx];
  const shownQ = reduced ? convo.q : qText;
  const shownA = reduced ? convo.a : aText;
  const showCode = reduced
    ? Boolean(convo.code)
    : phase !== "a" && Boolean(convo.code) && aText === convo.a;

  return (
    <div ref={rootRef} className="w-full bg-muted rounded-xl p-4">
      <div className="bg-background rounded-xl border border-border overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 border-b border-border">
          <div className="flex items-center gap-2.5">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold"
              style={{ background: "var(--blue)", color: "var(--blue-ink)" }}
            >
              AI
            </div>
            <div>
              <div className="text-[13px] font-medium leading-tight">Acme Support</div>
              <div className="text-[11px] text-muted-foreground flex items-center gap-1.5 mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse-dot" />
                Online · replies instantly
              </div>
            </div>
          </div>
          <span aria-hidden="true" className="text-lg text-muted-foreground/60">
            ×
          </span>
        </div>

        <div ref={scrollRef} className="h-[320px] overflow-y-auto px-4 py-5">
          <div
            className="flex flex-col gap-2.5 min-h-full justify-end"
            aria-live="polite"
          >
            <div className="self-start max-w-[85%] bg-muted text-foreground px-3 py-2 rounded-xl rounded-tl-sm text-[13px] leading-relaxed">
              {GREETING}
            </div>

            {live ? (
              messages.map((m, i) => (
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
              ))
            ) : (
              <>
                {shownQ && (
                  <div className="self-end max-w-[85%] bg-foreground text-background px-3 py-2 rounded-xl rounded-tr-sm text-[13px] leading-relaxed">
                    {shownQ}
                    {autoplay && phase === "q" && (
                      <span className="inline-block w-[2px] h-[12px] bg-background/60 ml-0.5 align-middle animate-pulse" />
                    )}
                  </div>
                )}
                {shownA && (
                  <div className="self-start max-w-[90%] bg-muted text-foreground px-3 py-2 rounded-xl rounded-tl-sm text-[13px] leading-relaxed">
                    {shownA}
                    {autoplay && phase === "a" && (
                      <span className="inline-block w-[2px] h-[12px] bg-foreground/60 ml-0.5 align-middle animate-pulse" />
                    )}
                    {showCode && (
                      <div className="mt-2 bg-foreground text-background rounded-md px-2.5 py-2 font-mono text-[11px] leading-relaxed overflow-x-auto">
                        {convo.code}
                      </div>
                    )}
                  </div>
                )}
              </>
            )}

            {(pending || (autoplay && phase === "pause")) && (
              <div className="self-start flex gap-1 px-3 py-2">
                <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground animate-typing-dot" style={{ animationDelay: "0ms" }} />
                <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground animate-typing-dot" style={{ animationDelay: "150ms" }} />
                <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground animate-typing-dot" style={{ animationDelay: "300ms" }} />
              </div>
            )}
          </div>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            ask(input);
          }}
          className="px-3 py-2.5 border-t border-border flex items-center gap-2"
        >
          <label htmlFor="demo-ask" className="sr-only">
            Ask the demo agent a question
          </label>
          <input
            id="demo-ask"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask a question…"
            autoComplete="off"
            className="flex-1 min-w-0 text-[12px] px-3 py-1.5 bg-muted rounded-full outline-none focus-visible:ring-2 focus-visible:ring-[var(--blue)]"
          />
          <button
            type="submit"
            aria-label="Send message"
            disabled={!input.trim() || pending}
            className="w-7 h-7 shrink-0 rounded-full bg-foreground text-background flex items-center justify-center text-sm disabled:opacity-40 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
          >
            ↑
          </button>
        </form>
      </div>

      <div className="flex gap-1.5 mt-4 flex-wrap">
        {DEMO_QA.map((s) => (
          <button
            key={s.chip}
            type="button"
            onClick={() => ask(s.q)}
            className="text-[11px] px-2.5 py-1 bg-background border border-border rounded-full text-muted-foreground hover:text-foreground hover:border-[var(--border-medium)] transition-colors"
          >
            {s.chip}
          </button>
        ))}
      </div>
    </div>
  );
}

export default function HeroSection() {
  return (
    <section
      className="relative overflow-hidden flex flex-col"
      style={{ minHeight: "calc(100svh - 64px)" }}
    >
      {/* Dot-grid atmosphere */}
      <div
        aria-hidden
        className="absolute inset-0 bg-dot-grid pointer-events-none opacity-70"
        style={{
          maskImage:
            "radial-gradient(ellipse 70% 80% at 50% 30%, black 40%, transparent 75%)",
          WebkitMaskImage:
            "radial-gradient(ellipse 70% 80% at 50% 30%, black 40%, transparent 75%)",
        }}
      />

      <div className="relative flex-1 container-page flex flex-col">
        <div className="flex-1 grid lg:grid-cols-[1.1fr_1fr] gap-10 lg:gap-14 items-center py-16 sm:py-20">
          <div className="flex flex-col gap-0">
            {/* announce pill */}
            <div
              className="announce-pill mb-6 w-fit animate-fade-in-up"
              style={{ opacity: 0, animationDelay: "60ms" }}
            >
              <span className="tag">New</span>
              v2.0 · Notion and Drive sync
            </div>

            <h1
              className="text-4xl sm:text-5xl lg:text-[64px] leading-[1.03] font-semibold tracking-[-0.03em] mb-5 animate-fade-in-up"
              style={{ opacity: 0, animationDelay: "160ms" }}
            >
              Ship an{" "}
              <span className="hl-marker">AI agent</span>
              <br />
              trained on your data.
            </h1>

            <p
              className="text-base sm:text-lg text-muted-foreground max-w-xl leading-relaxed mb-8 animate-fade-in-up"
              style={{ opacity: 0, animationDelay: "260ms" }}
            >
              Train an AI agent on your content, customize the look, and embed a
              production-grade chatbot on your site with a single line of code.
            </p>

            <div
              className="flex flex-wrap gap-2.5 mb-8 animate-fade-in-up"
              style={{ opacity: 0, animationDelay: "340ms" }}
            >
              <Button
                size="lg"
                variant="brand"
                onClick={openRegister}
                className="btn-pill group"
              >
                Start building
                <ArrowRight
                  className="transition-transform group-hover:translate-x-0.5"
                  strokeWidth={2}
                />
              </Button>
              <Button size="lg" variant="outline" asChild className="btn-pill">
                <a href="mailto:sales@deploymind.com">Talk to sales</a>
              </Button>
            </div>

            <div
              className="flex flex-wrap gap-x-6 gap-y-2 text-[13px] text-muted-foreground animate-fade-in-up"
              style={{ opacity: 0, animationDelay: "420ms" }}
            >
              {["No credit card","GDPR compliant","SOC 2 ready"].map((t) => (
                <span key={t} className="inline-flex items-center gap-1.5">
                  <Check
                    className="w-3.5 h-3.5 shrink-0"
                    style={{ color: "var(--blue)" }}
                    strokeWidth={2.5}
                    aria-hidden="true"
                  />
                  {t}
                </span>
              ))}
            </div>
          </div>

          <div
            className="animate-fade-in-up"
            style={{ opacity: 0, animationDelay: "220ms" }}
          >
            <ChatWidget />
          </div>
        </div>

      </div>
    </section>
  );
}
