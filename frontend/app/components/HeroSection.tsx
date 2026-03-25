"use client";

import { useEffect, useState } from "react";
import { HiCheck, HiArrowRight } from "react-icons/hi";
import {
  HERO_CHECKMARKS,
  HERO_CHAT_CONVERSATIONS,
  HERO_NODES_DATA,
  HERO_RING_DEFS,
  PAGE_CONTENT
} from "../../lib/constants";

// ── Animated Chat Widget (center of hero visual) ───────────────────────────
function ChatWidgetVisual() {
  const [convoIdx, setConvoIdx] = useState(0);
  const [questionText, setQuestionText] = useState("");
  const [answerText, setAnswerText] = useState("");
  const [phase, setPhase] = useState<"typing-q" | "pause" | "typing-a" | "display" | "reset">("typing-q");

  // Typing effect for question and answer
  useEffect(() => {
    const convo = HERO_CHAT_CONVERSATIONS[convoIdx];
    let timer: ReturnType<typeof setTimeout>;

    switch (phase) {
      case "typing-q":
        if (questionText.length < convo.question.length) {
          timer = setTimeout(() => setQuestionText(convo.question.slice(0, questionText.length + 1)), 50);
        } else {
          timer = setTimeout(() => setPhase("pause"), 400);
        }
        break;
      case "pause":
        timer = setTimeout(() => setPhase("typing-a"), 600);
        break;
      case "typing-a":
        if (answerText.length < convo.answer.length) {
          timer = setTimeout(() => setAnswerText(convo.answer.slice(0, answerText.length + 1)), 20);
        } else {
          timer = setTimeout(() => setPhase("display"), 3000);
        }
        break;
      case "display":
        timer = setTimeout(() => setPhase("reset"), 200);
        break;
      case "reset":
        setQuestionText("");
        setAnswerText("");
        setConvoIdx((convoIdx + 1) % HERO_CHAT_CONVERSATIONS.length);
        setPhase("typing-q");
        break;
    }

    return () => clearTimeout(timer);
  }, [phase, questionText, answerText, convoIdx]);

  return (
    <div className="w-[400px] rounded-2xl bg-white relative"
      style={{ boxShadow: "0 24px 80px rgba(15,23,42,0.16), 0 0 0 1px rgba(0,82,255,0.06)" }}>
      {/* Header */}
      <div className="gradient-bg px-4 py-3 flex items-center gap-2.5 rounded-t-2xl">
        <div className="w-7 h-7 bg-white/20 rounded-lg flex items-center justify-center">
          <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
          </svg>
        </div>
        <div className="flex-1">
          <div className="text-[11px] font-semibold text-white leading-none">AI Assistant</div>
          <div className="text-[9px] text-emerald-300 mt-0.5 flex items-center gap-1">
            <span className="w-1 h-1 rounded-full bg-emerald-300 inline-block animate-pulse-dot" />
            Online
          </div>
        </div>
        <div className="flex gap-1">
          <div className="w-1.5 h-1.5 rounded-full bg-white/30" />
          <div className="w-1.5 h-1.5 rounded-full bg-white/30" />
          <div className="w-1.5 h-1.5 rounded-full bg-white/30" />
        </div>
      </div>

      {/* Messages */}
      <div className="px-4 py-4 space-y-4 min-h-[380px] bg-muted/80">
        {/* Welcome message */}
        <div className="flex gap-2">
          <div className="w-5 h-5 rounded-xl flex-shrink-0 flex items-center justify-center mt-0.5">
            <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="var(--primary)" strokeWidth="2">
              <path d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <div className="bg-white rounded-xl rounded-tl-none px-4 py-3 text-[12px] text-foreground leading-relaxed max-w-[280px]" style={{ boxShadow: 'var(--shadow-sm)' }}>
            Hi! I&apos;m trained Agent. Ask me anything.
          </div>
        </div>

        {/* User question (typing) */}
        {questionText && (
          <div className="flex justify-end">
            <div className="gradient-bg rounded-xl rounded-tr-none px-4 py-3 text-[12px] text-white leading-relaxed max-w-[260px]">
              {questionText}
              {phase === "typing-q" && <span className="inline-block w-[2px] h-[10px] bg-white/60 ml-0.5 animate-pulse" />}
            </div>
          </div>
        )}

        {/* AI answer (typing) */}
        {answerText && (
          <div className="flex gap-2">
            <div className="w-5 h-5 rounded-xl flex-shrink-0 flex items-center justify-center mt-0.5">
              <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="var(--primary)" strokeWidth="2">
                <path d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div className="bg-white rounded-xl rounded-tl-none px-4 py-3 text-[12px] text-foreground leading-relaxed max-w-[280px]" style={{ boxShadow: 'var(--shadow-sm)' }}>
              {answerText}
              {phase === "typing-a" && <span className="inline-block w-[2px] h-[10px] bg-primary/50 ml-0.5 animate-pulse" />}
            </div>
          </div>
        )}

        {/* Thinking indicator */}
        {phase === "pause" && (
          <div className="flex gap-2">
            <div className="w-5 h-5 rounded-xl flex-shrink-0 flex items-center justify-center mt-0.5">
              <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="var(--primary)" strokeWidth="2">
                <path d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div className="bg-white rounded-lg px-2.5 py-1.5 flex items-center gap-1" style={{ boxShadow: 'var(--shadow-sm)' }}>
              <span className="w-1.5 h-1.5 rounded-full bg-primary/40 animate-bounce" style={{ animationDelay: "0ms" }} />
              <span className="w-1.5 h-1.5 rounded-full bg-primary/40 animate-bounce" style={{ animationDelay: "150ms" }} />
              <span className="w-1.5 h-1.5 rounded-full bg-primary/40 animate-bounce" style={{ animationDelay: "300ms" }} />
            </div>
          </div>
        )}
      </div>

      {/* Input bar */}
      <div className="px-3 py-2.5 border-t border-border bg-white flex items-center gap-2 rounded-b-2xl">
        <div className="flex-1 h-8 bg-muted rounded-lg border border-border px-3 flex items-center">
          <span className="text-[10px] text-muted-foreground">Ask a question...</span>
        </div>
        <div className="w-7 h-7 gradient-bg rounded-lg flex items-center justify-center">
          <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="none" stroke="white" strokeWidth="2.5">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </div>
      </div>

      {/* Floating Chat Icon */}
      <div className="absolute -bottom-[72px] right-0 w-14 h-14 gradient-bg rounded-full flex items-center justify-center shadow-lg" style={{ boxShadow: '0 8px 32px rgba(0,82,255,0.25)' }}>
        <svg viewBox="0 0 24 24" className="w-6 h-6 text-white" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
      </div>
    </div>
  );
}

// ── Full Hero Visual — Chat widget + static nodes + ring arcs ─────────────

function HeroVisual() {
  const cx = 370, cy = 370;

  return (
    <div className="relative w-full h-full flex items-center justify-center">
      {/* Background effects */}
      <div className="absolute inset-0 pointer-events-none"
        style={{ backgroundImage: "radial-gradient(circle, rgba(0,82,255,0.03) 1px, transparent 1px)", backgroundSize: "24px 24px" }} />
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-[720px] h-[720px] rounded-full"
          style={{ background: "radial-gradient(circle, rgba(0,82,255,0.05) 0%, transparent 70%)" }} />
      </div>

      {/* SVG layer */}
      <svg viewBox="0 0 740 740" className="absolute w-full max-w-[720px] z-0"
        style={{ top: "50%", left: "50%", transform: "translate(-50%, -50%)" }}>

        {/* Base rings */}
        {HERO_RING_DEFS.map((ring, i) => (
          <circle key={`base-${i}`} cx={cx} cy={cy} r={ring.radius}
            fill="none" stroke="rgba(0,82,255,0.06)" strokeWidth="1" />
        ))}

        {/* Static arcs (no animation) */}
        {HERO_RING_DEFS.map((ring, i) => {
          const circ = 2 * Math.PI * ring.radius;
          const arcLen = circ * ring.arcFraction;
          const gapLen = circ - arcLen;
          return (
            <circle
              key={`arc-${i}`}
              cx={cx} cy={cy} r={ring.radius}
              fill="none"
              stroke="var(--primary-light)"
              strokeWidth="2"
              strokeLinecap="round"
              strokeDasharray={`${arcLen} ${gapLen}`}
              strokeDashoffset="0"
            />
          );
        })}

        {/* Connection lines from nodes to center */}
        {HERO_NODES_DATA.map((node, i) => {
          const rad = (node.angle * Math.PI) / 180;
          const nx = cx + node.radius * Math.cos(rad);
          const ny = cy + node.radius * Math.sin(rad);
          return (
            <line key={`line-${i}`}
              x1={nx} y1={ny} x2={cx} y2={cy}
              stroke={node.src.color} strokeWidth="0.8"
              strokeDasharray="4 6" opacity="0.15"
            />
          );
        })}

        {/* Static data source nodes */}
        {HERO_NODES_DATA.map((node, i) => {
          const rad = (node.angle * Math.PI) / 180;
          const nx = cx + node.radius * Math.cos(rad);
          const ny = cy + node.radius * Math.sin(rad);
          return (
            <g key={i} transform={`translate(${nx}, ${ny})`}>
              <circle r={26} fill="white" stroke={node.src.color} strokeWidth="1.5" opacity="0.95"
                rx="8"
                style={{ filter: "drop-shadow(0 4px 14px rgba(15,23,42,0.10))" }} />
              <svg x={-11} y={-15} width={22} height={22} viewBox="0 0 24 24"
                fill="none" stroke={node.src.color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d={node.src.icon} />
              </svg>
              <text x={0} y={17} textAnchor="middle" fill={node.src.color} fontSize="8" fontWeight="700"
                style={{ fontFamily: "Inter, system-ui, sans-serif" }}>
                {node.src.label}
              </text>
            </g>
          );
        })}
      </svg>

      {/* Central chat widget */}
      <div className="relative z-10">
        <ChatWidgetVisual />
      </div>
    </div>
  );
}

// ── Typing animation — cycles through phrases ─────────────────────────────
const TYPING_PHRASES = [
  "Answers Your Customers",
  "Learns From Your Data",
  "Works 24/7 for You",
  "Boosts Your Conversions",
];

function TypingCycle() {
  const [phraseIdx, setPhraseIdx] = useState(0);
  const [displayed, setDisplayed] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [showCursor, setShowCursor] = useState(true);

  useEffect(() => {
    const cursorIv = setInterval(() => setShowCursor(c => !c), 530);
    return () => clearInterval(cursorIv);
  }, []);

  useEffect(() => {
    const phrase = TYPING_PHRASES[phraseIdx];
    let timer: ReturnType<typeof setTimeout>;

    if (!isDeleting) {
      if (displayed.length < phrase.length) {
        timer = setTimeout(() => {
          setDisplayed(phrase.slice(0, displayed.length + 1));
        }, 70);
      } else {
        timer = setTimeout(() => setIsDeleting(true), 2000);
      }
    } else {
      if (displayed.length > 0) {
        timer = setTimeout(() => {
          setDisplayed(displayed.slice(0, -1));
        }, 40);
      } else {
        // eslint-disable-next-line
        setIsDeleting(false);
        setPhraseIdx((phraseIdx + 1) % TYPING_PHRASES.length);
      }
    }

    return () => clearTimeout(timer);
  }, [displayed, isDeleting, phraseIdx]);

  return (
    <span className="gradient-text">
      {displayed}
      <span className="inline-block w-[3px] h-[0.85em] bg-primary ml-0.5 align-middle rounded-full"
        style={{ opacity: showCursor ? 1 : 0, transition: "opacity 0.1s" }} />
    </span>
  );
}

// ── Hero Section ───────────────────────────────────────────────────────────
interface HeroSectionProps { onGetStarted: () => void; }

export default function HeroSection({ onGetStarted }: HeroSectionProps) {
  return (
    <section className="relative" style={{ minHeight: "calc(100vh - 72px)", background: "transparent" }}>
      {/* Background glow effects */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
        <div className="radial-glow w-[600px] h-[600px] -top-[200px] -right-[200px] bg-primary/[0.04]" />
        <div className="radial-glow w-[400px] h-[400px] -bottom-[100px] -left-[100px] bg-primary/[0.03]" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 lg:px-8 h-full grid lg:grid-cols-[1.2fr_0.8fr] min-h-[calc(100vh-72px)] gap-10">

        {/* ── LEFT ── */}
        <div className="flex flex-col justify-center py-14 min-w-0">

          {/* Section label badge */}
          <div className="mb-6">
            <div className="inline-flex items-center rounded-full border border-border bg-muted/50 px-3 py-1 shadow-sm">
              <span className="text-sm font-medium text-foreground">
                {PAGE_CONTENT.hero.badge}
              </span>
            </div>
          </div>

          {/* Headline */}
          <h1 className="text-[2.5rem] leading-[1.1] sm:text-5xl lg:text-[3.5rem] xl:text-[4rem] tracking-[-0.02em] text-foreground mb-5">
            {PAGE_CONTENT.hero.headlineStart}
            <br className="hidden sm:block" />
            <span className="sm:inline-block whitespace-normal sm:whitespace-nowrap sm:pl-3 lg:pl-0" style={{ minHeight: "1.15em" }}>
              <TypingCycle />
            </span>
            <br />
            {PAGE_CONTENT.hero.headlineEnd}
          </h1>

          {/* Subtitle */}
          <p className="text-lg text-muted-foreground leading-relaxed max-w-[480px] mb-8">
            {PAGE_CONTENT.hero.subtitle}
          </p>

          {/* CTA */}
          <div className="flex flex-col sm:flex-row items-start gap-4">
            <button
              onClick={onGetStarted}
              className="group inline-flex items-center gap-3 gradient-bg text-white text-base font-medium px-8 py-3.5 rounded-xl transition-all duration-200 hover:-translate-y-0.5 hover:brightness-110 active:scale-[0.98]"
              style={{ boxShadow: 'var(--shadow-accent)' }}
            >
              {PAGE_CONTENT.hero.ctaStandard}
              <HiArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
            </button>
          </div>

          {/* Checkmarks */}
          {HERO_CHECKMARKS && (
            <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3">
              {HERO_CHECKMARKS.map((item: string, idx: number) => (
                <div key={idx} className="flex items-center gap-2 text-sm text-muted-foreground">
                  <HiCheck className="text-emerald-500 flex-shrink-0" />
                  {item}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ── RIGHT: Hero Visual ── */}
        <div className="relative hidden lg:flex items-center justify-center py-12 pb-24 lg:py-6 lg:pb-0 translate-x-4 xl:translate-x-8">
          <HeroVisual />
        </div>

      </div>
    </section>
  );
}