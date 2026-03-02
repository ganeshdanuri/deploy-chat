"use client";

import { useEffect, useRef, useState } from "react";
import { HiCheck } from "react-icons/hi";
import {
  HERO_CHECKMARKS,
  HERO_CHAT_CONVERSATIONS,
  HERO_NODES_DATA,
  HERO_RING_DEFS,
  PAGE_CONTENT
} from "../../lib/constants";

// ── Animated Chat Widget (center of hero visual) ───────────────────────────
function ChatWidgetVisual() {
  const widgetRef = useRef<HTMLDivElement>(null);
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

  // Floating animation via GSAP
  useEffect(() => {
    let ctx: { revert: () => void };
    (async () => {
      const { gsap } = await import("gsap");
      if (!widgetRef.current) return;
      ctx = gsap.context(() => {
        gsap.to(widgetRef.current, { y: -8, duration: 3, ease: "sine.inOut", yoyo: true, repeat: -1 });
      });
    })();
    return () => ctx?.revert();
  }, []);

  return (
    <div ref={widgetRef} className="w-[360px] bg-white overflow-hidden"
      style={{ boxShadow: "0 24px 80px rgba(30,30,80,0.18), 0 0 0 1px rgba(60,70,220,0.08)" }}>
      {/* Header */}
      <div className="bg-secondary px-4 py-3 flex items-center gap-2.5">
        <div className="w-7 h-7 bg-primary flex items-center justify-center">
          <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
          </svg>
        </div>
        <div className="flex-1">
          <div className="text-[11px] font-semibold text-white leading-none">AI Assistant</div>
          <div className="text-[9px] text-green-400 mt-0.5 flex items-center gap-1">
            <span className="w-1 h-1 rounded-full bg-green-400 inline-block" />
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
      <div className="px-4 py-4 space-y-3 min-h-[220px] bg-[#fafafe]">
        {/* Welcome message */}
        <div className="flex gap-2">
          <div className="w-5 h-5 bg-primary flex-shrink-0 flex items-center justify-center mt-0.5">
            <svg viewBox="0 0 24 24" className="w-3 h-3" fill="none" stroke="white" strokeWidth="2">
              <path d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <div className="bg-[#f0f0f6] px-3 py-2 text-[11px] text-[#4a4a66] leading-relaxed max-w-[240px]">
            Hi! I&apos;m trained on your docs. Ask me anything.
          </div>
        </div>

        {/* User question (typing) */}
        {questionText && (
          <div className="flex justify-end">
            <div className="bg-primary px-3 py-2 text-[11px] text-white leading-relaxed max-w-[220px]">
              {questionText}
              {phase === "typing-q" && <span className="inline-block w-[2px] h-[10px] bg-white/70 ml-0.5 animate-pulse" />}
            </div>
          </div>
        )}

        {/* AI answer (typing) */}
        {answerText && (
          <div className="flex gap-2">
            <div className="w-5 h-5 bg-primary flex-shrink-0 flex items-center justify-center mt-0.5">
              <svg viewBox="0 0 24 24" className="w-3 h-3" fill="none" stroke="white" strokeWidth="2">
                <path d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div className="bg-[#f0f0f6] px-3 py-2 text-[11px] text-[#4a4a66] leading-relaxed max-w-[240px]">
              {answerText}
              {phase === "typing-a" && <span className="inline-block w-[2px] h-[10px] bg-primary/60 ml-0.5 animate-pulse" />}
            </div>
          </div>
        )}

        {/* Thinking indicator */}
        {phase === "pause" && (
          <div className="flex gap-2">
            <div className="w-5 h-5 bg-primary flex-shrink-0 flex items-center justify-center mt-0.5">
              <svg viewBox="0 0 24 24" className="w-3 h-3" fill="none" stroke="white" strokeWidth="2">
                <path d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div className="bg-[#f0f0f6] px-2.5 py-1.5 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-primary/40 animate-bounce" style={{ animationDelay: "0ms" }} />
              <span className="w-1.5 h-1.5 rounded-full bg-primary/40 animate-bounce" style={{ animationDelay: "150ms" }} />
              <span className="w-1.5 h-1.5 rounded-full bg-primary/40 animate-bounce" style={{ animationDelay: "300ms" }} />
            </div>
          </div>
        )}
      </div>

      {/* Input bar */}
      <div className="px-3 py-2 border-t border-[#ebebf5] bg-white flex items-center gap-2">
        <div className="flex-1 h-7 bg-[#f5f5fa] border border-border px-2 flex items-center">
          <span className="text-[9px] text-muted-foreground">Ask a question...</span>
        </div>
        <div className="w-6 h-6 bg-primary flex items-center justify-center">
          <svg viewBox="0 0 24 24" className="w-3 h-3" fill="none" stroke="white" strokeWidth="2.5">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </div>
      </div>
    </div>
  );
}

// ── Full Hero Visual — Chat widget + static nodes + animated ring arcs ───────

function HeroVisual() {
  const containerRef = useRef<HTMLDivElement>(null);
  const arcRefs = useRef<(SVGCircleElement | null)[]>([]);

  const cx = 370, cy = 370;

  useEffect(() => {
    let ctx: { revert: () => void };
    (async () => {
      const { gsap } = await import("gsap");
      ctx = gsap.context(() => {
        // Animate each blue arc sweeping around its ring
        HERO_RING_DEFS.forEach((ring, i) => {
          const circ = 2 * Math.PI * ring.radius;
          if (arcRefs.current[i]) {
            gsap.to(arcRefs.current[i], {
              strokeDashoffset: -circ * ring.direction,
              duration: ring.duration,
              ease: "none",
              repeat: -1,
            });
          }
        });
      });
    })();
    return () => ctx?.revert();
  }, []);

  return (
    <div ref={containerRef} className="relative w-full h-full flex items-center justify-center">
      {/* Background effects */}
      <div className="absolute inset-0 pointer-events-none"
        style={{ backgroundImage: "radial-gradient(circle, rgba(80,90,200,0.04) 1px, transparent 1px)", backgroundSize: "24px 24px" }} />
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-[720px] h-[720px] rounded-full"
          style={{ background: "radial-gradient(circle, rgba(60,70,220,0.06) 0%, transparent 70%)" }} />
      </div>

      {/* SVG layer */}
      <svg viewBox="0 0 740 740" className="absolute w-full max-w-[720px] z-0"
        style={{ top: "50%", left: "50%", transform: "translate(-50%, -50%)" }}>

        {/* ── Base rings (always visible, light) ── */}
        {HERO_RING_DEFS.map((ring, i) => (
          <circle key={`base-${i}`} cx={cx} cy={cy} r={ring.radius}
            fill="none" stroke="rgba(60,70,180,0.06)" strokeWidth="1" />
        ))}

        {/* ── Animated blue arcs sweeping around each ring ── */}
        {HERO_RING_DEFS.map((ring, i) => {
          const circ = 2 * Math.PI * ring.radius;
          const arcLen = circ * ring.arcFraction;
          const gapLen = circ - arcLen;
          return (
            <circle
              key={`arc-${i}`}
              ref={el => { arcRefs.current[i] = el; }}
              cx={cx} cy={cy} r={ring.radius}
              fill="none"
              stroke="rgba(60,100,220,0.3)"
              strokeWidth="2"
              strokeLinecap="round"
              strokeDasharray={`${arcLen} ${gapLen}`}
              strokeDashoffset="0"
            />
          );
        })}

        {/* ── Connection lines from static nodes to center ── */}
        {HERO_NODES_DATA.map((node, i) => {
          const rad = (node.angle * Math.PI) / 180;
          const nx = cx + node.radius * Math.cos(rad);
          const ny = cy + node.radius * Math.sin(rad);
          return (
            <line key={`line-${i}`}
              x1={nx} y1={ny} x2={cx} y2={cy}
              stroke={node.src.color} strokeWidth="0.8"
              strokeDasharray="4 6" opacity="0.2"
            />
          );
        })}

        {/* ── Static data source nodes ── */}
        {HERO_NODES_DATA.map((node, i) => {
          const rad = (node.angle * Math.PI) / 180;
          const nx = cx + node.radius * Math.cos(rad);
          const ny = cy + node.radius * Math.sin(rad);
          return (
            <g key={i} transform={`translate(${nx}, ${ny})`}>
              <circle r={26} fill="white" stroke={node.src.color} strokeWidth="1.5" opacity="0.95"
                style={{ filter: "drop-shadow(0 4px 14px rgba(30,30,80,0.12))" }} />
              <svg x={-11} y={-15} width={22} height={22} viewBox="0 0 24 24"
                fill="none" stroke={node.src.color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d={node.src.icon} />
              </svg>
              <text x={0} y={17} textAnchor="middle" fill={node.src.color} fontSize="8" fontWeight="700"
                style={{ fontFamily: "system-ui, sans-serif" }}>
                {node.src.label}
              </text>
            </g>
          );
        })}
      </svg>

      {/* Central chat widget (HTML, overlaid on SVG) */}
      <div className="relative z-10">
        <ChatWidgetVisual />
      </div>
    </div>
  );
}

// ── Typing animation — cycles through phrases ─────────────────────────────
const TYPING_PHRASES = [
  "Answers Your Customers",
  "Learns From Your Docs",
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
    <span className="text-primary">
      {displayed}
      <span className="inline-block w-[3px] h-[0.85em] bg-primary ml-0.5 align-middle"
        style={{ opacity: showCursor ? 1 : 0, transition: "opacity 0.1s" }} />
    </span>
  );
}

// ── Hero Section ───────────────────────────────────────────────────────────
interface HeroSectionProps { onGetStarted: () => void; }

export default function HeroSection({ onGetStarted }: HeroSectionProps) {
  return (
    <section className="relative overflow-hidden bg-[#f0f0f6]" style={{ minHeight: "calc(100vh - 72px)" }}>

      {/* Corner circles */}
      {[
        "top-3 left-3", "top-3 right-3",
        "bottom-3 left-3", "bottom-3 right-3",
      ].map((pos) => (
        <span
          key={pos}
          className={`absolute ${pos} w-3 h-3 rounded-full border border-[#c8c8d0] bg-transparent`}
        />
      ))}

      <div className="relative mx-auto max-w-[1400px] h-full grid lg:grid-cols-2 min-h-[calc(100vh-72px)]">

        {/* ── LEFT ── */}
        <div className="flex flex-col justify-center px-10 py-20">

          {/* Release badge */}
          <div className="mb-8">
            <a
              href="#"
              className="inline-flex items-center gap-2 text-sm text-foreground border border-[#dddde8] rounded px-3 py-1.5 bg-white/60 hover:bg-white transition-colors"
            >
              {PAGE_CONTENT.hero.badge}
              <span className="text-primary text-base">›</span>
            </a>
          </div>

          {/* Headline */}
          <h1 className="text-[44px] lg:text-[52px] font-semibold leading-[1.08] tracking-tight text-secondary mb-6">
            {PAGE_CONTENT.hero.headlineStart}
            <br />
            <span className="inline-block" style={{ minHeight: "1.15em" }}>
              <TypingCycle />
            </span>
            <br />
            {PAGE_CONTENT.hero.headlineEnd}
          </h1>

          {/* Subtitle */}
          <p className="text-lg text-muted-foreground leading-relaxed max-w-[480px] mb-10">
            {PAGE_CONTENT.hero.subtitle}
          </p>

          {/* CTA */}
          <div>
            <button
              onClick={onGetStarted}
              className="inline-flex items-center gap-3 bg-secondary text-white text-base font-semibold px-7 py-4 rounded-lg hover:bg-[#2a2a40] transition-all hover:-translate-y-0.5 hover:shadow-xl active:translate-y-0"
            >
              {PAGE_CONTENT.hero.ctaStandard}
              <span className="text-primary text-lg">⇒</span>
            </button>
          </div>

          {/* Checkmarks */}
          {HERO_CHECKMARKS && (
            <div className="mt-10 flex flex-wrap gap-x-6 gap-y-3">
              {HERO_CHECKMARKS.map((item: string, idx: number) => (
                <div key={idx} className="flex items-center gap-2 text-sm text-[#6a6a7a]">
                  <HiCheck className="text-emerald-500 flex-shrink-0" />
                  {item}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ── RIGHT: Hero Visual ── */}
        <div className="relative hidden lg:flex items-center justify-center py-6 overflow-hidden">
          <HeroVisual />
        </div>

      </div>
    </section>
  );
}