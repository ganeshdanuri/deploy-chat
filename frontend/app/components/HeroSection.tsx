"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { FolderOpen, Paintbrush, Code2 } from "lucide-react";

const CONVERSATIONS = [
  {
    q: "How do I embed the widget on a Next.js site? ",
    a: "Add this to your root layout — that's it.",
    code: '<Script src="https://cdn.deploychat.in/w.js" />',
  },
  {
    q: "What data sources can I connect? ",
    a: "PDFs, websites, Notion, Google Drive, CSV, and your API.",
    code: null,
  },
  {
    q: "Will it use my data to train base models? ",
    a: "Never. Your content stays private and encrypted at rest.",
    code: null,
  },
];

function ChatWidget() {
  const [convoIdx, setConvoIdx] = useState(0);
  const [qText, setQText] = useState("");
  const [aText, setAText] = useState("");
  const [phase, setPhase] = useState<"q" |"pause" |"a" |"hold" |"reset">("q");

  useEffect(() => {
    const convo = CONVERSATIONS[convoIdx];
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
        t = setTimeout(() => setPhase("reset"), 200);
        break;
      case "reset":
        setQText("");
        setAText("");
        setConvoIdx((i) => (i + 1) % CONVERSATIONS.length);
        setPhase("q");
        break;
    }
    return () => clearTimeout(t);
  }, [phase, qText, aText, convoIdx]);

  const convo = CONVERSATIONS[convoIdx];

  return (
    <div className="w-full bg-muted rounded-xl p-4">
      <div className="bg-background rounded-xl border border-border overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 border-b border-border">
          <div className="flex items-center gap-2.5">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold"
              style={{ background: "#1D2020", color: "#D4FB5F" }}
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
          <span className="text-lg text-muted-foreground">×</span>
        </div>

        <div className="px-4 py-5 flex flex-col gap-2.5 h-[320px] overflow-hidden">
          <div className="self-start max-w-[85%] bg-muted text-foreground px-3 py-2 rounded-xl rounded-tl-sm text-[13px] leading-relaxed">
            Hi! I&apos;m trained on your docs. Ask me anything.
          </div>

          {qText && (
            <div className="self-end max-w-[85%] bg-foreground text-background px-3 py-2 rounded-xl rounded-tr-sm text-[13px] leading-relaxed">
              {qText}
              {phase === "q" && (
                <span className="inline-block w-[2px] h-[12px] bg-background/60 ml-0.5 align-middle animate-pulse" />
              )}
            </div>
          )}

          {aText && (
            <div className="self-start max-w-[90%] bg-muted text-foreground px-3 py-2 rounded-xl rounded-tl-sm text-[13px] leading-relaxed">
              {aText}
              {phase === "a" && (
                <span className="inline-block w-[2px] h-[12px] bg-foreground/60 ml-0.5 align-middle animate-pulse" />
              )}
              {phase !== "a" && convo.code && aText === convo.a && (
                <div className="mt-2 bg-foreground text-background rounded-md px-2.5 py-2 font-mono text-[11px] leading-relaxed overflow-x-auto">
                  {convo.code}
                </div>
              )}
            </div>
          )}

          {phase === "pause" && (
            <div className="self-start flex gap-1 px-3 py-2">
              <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground" />
              <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground opacity-60" />
              <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground opacity-30" />
            </div>
          )}
        </div>

        <div className="px-3 py-2.5 border-t border-border flex items-center gap-2">
          <div className="flex-1 text-[12px] text-muted-foreground px-3 py-1.5 bg-muted rounded-full">
            Ask a question…
          </div>
          <button
            aria-label="Send message"
            className="w-7 h-7 rounded-full bg-foreground text-background flex items-center justify-center text-sm focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
          >
            ↑
          </button>
        </div>
      </div>

      <div className="flex gap-1.5 mt-4 flex-wrap">
        {["PDF","Notion","Website crawl","API","CSV"].map((s) => (
          <span
            key={s}
            className="text-[11px] px-2.5 py-1 bg-background border border-border rounded-full text-muted-foreground"
>
            {s}
          </span>
        ))}
      </div>
    </div>
  );
}

export default function HeroSection({ onGetStarted }: { onGetStarted: () => void }) {
  return (
    <section className="relative overflow-hidden" style={{ minHeight: "calc(100vh - 64px)" }}>
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

      <div className="relative h-full max-w-[1200px] mx-auto px-4 sm:px-6 lg:max-w-full lg:px-12 flex flex-col" style={{ minHeight: "calc(100vh - 64px)" }}>
        <div className="flex-1 grid lg:grid-cols-[1.1fr_1fr] gap-10 lg:gap-14 items-center py-12 sm:py-16">
          <div>
            <div className="announce-pill mb-6">
              <span className="tag">New</span>
              Open source · v2.0 released
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-[64px] leading-[1.03] font-semibold tracking-[-0.03em] mb-5">
              Ship an{" "}
              <span className="hl-marker">AI agent</span>
              <br />
              trained on your data.
            </h1>

            <p className="text-base sm:text-lg text-muted-foreground max-w-xl leading-relaxed mb-6">
              Train an AI agent on your content, customize the look, and embed a
              production-grade chatbot on your site with a single line of code.
            </p>

            {/* Feature highlights */}
            <div className="flex flex-col gap-3 mb-8">
              {[
                {
                  icon: <FolderOpen size={16} />,
                  title: "Train on your knowledge",
                  desc: "Feed it your docs, PDFs, Notion pages, websites, and APIs — your agent learns your business inside out.",
                },
                {
                  icon: <Paintbrush size={16} />,
                  title: "Customize the look",
                  desc: "Match your brand — colors, avatar, name, and welcome message. No design skills needed.",
                },
                {
                  icon: <Code2 size={16} />,
                  title: "Embed with one line",
                  desc: "Drop a single script tag and your AI chatbot is live on any website or app.",
                },
              ].map((f) => (
                <div key={f.title} className="flex items-start gap-3">
                  <span className="mt-0.5 w-8 h-8 rounded-lg bg-muted flex items-center justify-center text-muted-foreground shrink-0" aria-hidden="true">
                    {f.icon}
                  </span>
                  <div>
                    <p className="text-[14px] font-semibold text-foreground leading-snug">{f.title}</p>
                    <p className="text-[13px] text-muted-foreground leading-relaxed">{f.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap gap-2.5 mb-6">
              <Button size="lg" onClick={onGetStarted} className="btn-pill">
                Start building →
              </Button>
              <Button size="lg" variant="outline" asChild className="btn-pill">
                <a href="mailto:sales@deploymind.com">Talk to sales</a>
              </Button>
            </div>

            <div className="flex flex-wrap gap-x-7 gap-y-2 text-[13px] text-muted-foreground">
              <span>✓  No credit card</span>
              <span>✓  GDPR compliant</span>
              <span>✓  SOC 2 ready</span>
            </div>
          </div>

          <div>
            <ChatWidget />
          </div>
        </div>

        {/* Integrations strip — pinned to bottom */}
        <div className="pb-8 pt-4 border-t border-border flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <span className="text-[12px] text-muted-foreground whitespace-nowrap shrink-0 font-medium">Works with</span>
          <div className="flex flex-wrap gap-2">
            {[
              "Notion", "Google Drive", "Confluence", "Zendesk",
              "Intercom", "Slack", "GitHub", "Postgres", "REST API",
            ].map((name) => (
              <span
                key={name}
                className="text-[12px] px-3 py-1 rounded-full border border-border bg-background text-foreground font-medium"
              >
                {name}
              </span>
            ))}
            <span className="text-[12px] px-3 py-1 rounded-full border border-border bg-background text-muted-foreground">
              + more
            </span>
          </div>
        </div>

      </div>
    </section>
  );
}
