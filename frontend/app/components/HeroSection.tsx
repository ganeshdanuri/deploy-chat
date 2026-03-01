"use client";

import { useEffect, useRef, useState } from "react";
import { HiArrowRight, HiCheck } from "react-icons/hi";
import { HERO_CHECKMARKS, SOCIAL_LINKS } from "../../lib/constants";

// ── Dot-matrix network canvas ──────────────────────────────────────────────
function AgentNetworkCanvas() {
  const canvasRef = useRef(null);
  const animRef = useRef(null);
  const timeRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    function resize() {
      canvas.width = canvas.offsetWidth * window.devicePixelRatio;
      canvas.height = canvas.offsetHeight * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    }
    resize();
    window.addEventListener("resize", resize);

    const W = () => canvas.offsetWidth;
    const H = () => canvas.offsetHeight;

    // Dot-matrix field parameters
    const DOT_GAP = 14;
    const DOT_R = 1.1;

    // Tree-like node positions (relative 0-1)
    const nodes = [
      { rx: 0.52, ry: 0.48, label: null, main: true },   // center
      { rx: 0.75, ry: 0.28, label: "Analyze findings" },   // top right
      { rx: 0.26, ry: 0.50, label: "Research sources" },   // left
      { rx: 0.80, ry: 0.52, label: "Generate report" },    // right
      { rx: 0.57, ry: 0.72, label: "Deliver output" },     // bottom
    ];

    // Branch lines from center to each satellite
    const edges = [1, 2, 3, 4].map(i => ({ from: 0, to: i }));

    function drawDotField(t) {
      const w = W(), h = H();
      const cols = Math.ceil(w / DOT_GAP);
      const rows = Math.ceil(h / DOT_GAP);

      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          const px = col * DOT_GAP + DOT_GAP / 2;
          const py = row * DOT_GAP + DOT_GAP / 2;

          // Determine if this dot is near any branch line
          let nearLine = false;
          let nearCenter = false;

          // Distance to center node
          const cx = nodes[0].rx * w;
          const cy = nodes[0].ry * h;
          const dc = Math.sqrt((px - cx) ** 2 + (py - cy) ** 2);
          if (dc < w * 0.18) nearCenter = true;

          // Distance to each edge (line segment)
          for (const edge of edges) {
            const a = nodes[edge.from];
            const b = nodes[edge.to];
            const ax = a.rx * w, ay = a.ry * h;
            const bx = b.rx * w, by = b.ry * h;
            const dx = bx - ax, dy = by - ay;
            const len2 = dx * dx + dy * dy;
            let t2 = ((px - ax) * dx + (py - ay) * dy) / len2;
            t2 = Math.max(0, Math.min(1, t2));
            const nx = ax + t2 * dx;
            const ny = ay + t2 * dy;
            const dist = Math.sqrt((px - nx) ** 2 + (py - ny) ** 2);
            if (dist < w * 0.12 + Math.sin(t * 0.5 + col * 0.3) * 4) {
              nearLine = true;
            }
          }

          if (!nearLine && !nearCenter) continue;

          // Pulse animation along lines
          const pulse = (Math.sin(t * 1.2 + col * 0.2 + row * 0.15) + 1) / 2;
          const alpha = (nearCenter ? 0.18 : 0.10) + pulse * 0.12;

          ctx.fillStyle = `rgba(50, 60, 220, ${alpha})`;
          ctx.beginPath();
          ctx.arc(px, py, DOT_R * (0.8 + pulse * 0.4), 0, Math.PI * 2);
          ctx.fill();
        }
      }
    }

    function drawEdges(t) {
      const w = W(), h = H();
      for (const edge of edges) {
        const a = nodes[edge.from];
        const b = nodes[edge.to];
        const ax = a.rx * w, ay = a.ry * h;
        const bx = b.rx * w, by = b.ry * h;

        // Animated dash
        ctx.save();
        ctx.strokeStyle = "rgba(80, 90, 230, 0.25)";
        ctx.lineWidth = 1.5;
        ctx.setLineDash([6, 6]);
        ctx.lineDashOffset = -t * 8;
        ctx.beginPath();
        ctx.moveTo(ax, ay);
        ctx.lineTo(bx, by);
        ctx.stroke();
        ctx.restore();
      }
    }

    function drawCenterNode() {
      const w = W(), h = H();
      const cx = nodes[0].rx * w;
      const cy = nodes[0].ry * h;
      const r = 34;

      // Outer ring
      ctx.save();
      ctx.beginPath();
      ctx.arc(cx, cy, r + 8, 0, Math.PI * 2);
      ctx.strokeStyle = "rgba(80, 90, 230, 0.15)";
      ctx.lineWidth = 2;
      ctx.stroke();

      // White circle
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.fillStyle = "white";
      ctx.shadowColor = "rgba(60, 70, 220, 0.25)";
      ctx.shadowBlur = 20;
      ctx.fill();
      ctx.restore();

      // "R" logo text
      ctx.save();
      ctx.fillStyle = "#3c46dc";
      ctx.font = "bold 22px sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("R", cx, cy);
      ctx.restore();
    }

    function draw(timestamp) {
      const t = timestamp / 1000;
      timeRef.current = t;
      const w = W(), h = H();
      ctx.clearRect(0, 0, w, h);

      drawDotField(t);
      drawEdges(t);
      drawCenterNode();

      animRef.current = requestAnimationFrame(draw);
    }

    animRef.current = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener("resize", resize);
    };
  }, []);

  // Floating pill labels
  const pills = [
    { label: "Analyze findings", style: { top: "18%", left: "62%" } },
    { label: "Research sources", style: { top: "45%", left: "8%" } },
    { label: "Generate report", style: { top: "45%", left: "72%" } },
    { label: "Deliver output", style: { top: "67%", left: "56%" } },
  ];

  return (
    <div className="relative w-full h-full">
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
      {pills.map((p, i) => (
        <div
          key={i}
          className="absolute pointer-events-none"
          style={{ ...p.style, animation: `floatY ${2.8 + i * 0.4}s ease-in-out infinite alternate` }}
        >
          <div
            className="rounded-full px-4 py-2 text-sm font-medium text-white shadow-lg"
            style={{ background: "rgba(60, 70, 220, 0.85)", backdropFilter: "blur(6px)", whiteSpace: "nowrap" }}
          >
            {p.label}
          </div>
        </div>
      ))}
      <style>{`
        @keyframes floatY {
          from { transform: translateY(0px); }
          to   { transform: translateY(-10px); }
        }
      `}</style>
    </div>
  );
}

// ── Typing animation for the blue line ────────────────────────────────────
function TypingText({ text }: { text: string }) {
  const [displayed, setDisplayed] = useState("");
  const [showCursor, setShowCursor] = useState(true);

  useEffect(() => {
    let i = 0;
    const iv = setInterval(() => {
      setDisplayed(text.slice(0, i + 1));
      i++;
      if (i >= text.length) clearInterval(iv);
    }, 60);
    const cursorIv = setInterval(() => setShowCursor(c => !c), 530);
    return () => { clearInterval(iv); clearInterval(cursorIv); };
  }, [text]);

  return (
    <span className="text-[#3c46dc]">
      {displayed}
      <span className="inline-block w-[3px] h-[0.85em] bg-[#3c46dc] ml-0.5 align-middle"
        style={{ opacity: showCursor ? 1 : 0, transition: "opacity 0.1s" }} />
    </span>
  );
}

// ── Hero Section ───────────────────────────────────────────────────────────
interface Stat { id: number; value: string; label: string; color: string; bgColor: string; }
interface HeroSectionProps { stats: Stat[]; onGetStarted: () => void; }

export default function HeroSection({ stats, onGetStarted }: HeroSectionProps) {
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

      {/* Vertical divider */}
      <div className="absolute inset-y-0 left-1/2 w-px bg-[#dddde8] hidden lg:block" style={{ transform: "translateX(-50%)" }} />

      <div className="relative mx-auto max-w-[1400px] h-full grid lg:grid-cols-2 min-h-[calc(100vh-72px)]">

        {/* ── LEFT ── */}
        <div className="flex flex-col justify-center px-10 lg:px-16 py-20">

          {/* Release badge */}
          <div className="mb-8">
            <a
              href="#"
              className="inline-flex items-center gap-2 text-sm text-[#4a4a5a] border border-[#dddde8] rounded px-3 py-1.5 bg-white/60 hover:bg-white transition-colors"
            >
              Latest Release: Agent Core v3.1
              <span className="text-[#3c46dc] text-base">›</span>
            </a>
          </div>

          {/* Headline */}
          <h1 className="text-[52px] lg:text-[60px] font-bold leading-[1.08] tracking-tight text-[#1a1a2e] mb-6">
            Build AI Agents That
            <br />
            <TypingText text="Run Your Business" />
            <br />
            Fully on Autopilot
          </h1>

          {/* Subtitle */}
          <p className="text-lg text-[#5a5a6a] leading-relaxed max-w-[480px] mb-10">
            A reliable agent infrastructure that handles research, analysis,
            communication, and task execution with zero supervision.
          </p>

          {/* CTA */}
          <div>
            <button
              onClick={onGetStarted}
              className="inline-flex items-center gap-3 bg-[#1a1a2e] text-white text-base font-semibold px-7 py-4 rounded-lg hover:bg-[#2a2a40] transition-all hover:-translate-y-0.5 hover:shadow-xl active:translate-y-0"
            >
              Build Your Agent
              <span className="text-[#3c46dc] text-lg">⇒</span>
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

        {/* ── RIGHT: Network canvas ── */}
        <div className="relative hidden lg:block">
          <AgentNetworkCanvas />
        </div>

      </div>
    </section>
  );
}