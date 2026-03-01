"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { HiClipboardCheck, HiClipboardCopy, HiCheckCircle } from "react-icons/hi";
import {
    INTEGRATION_STEPS as STEPS,
    EMBED_SNIPPET,
    COMPATIBLE_TECHS,
    IntegrationStep as Step,
} from "../../lib/constants";

const FILL_DURATION = 3800;

// ─── Copy Button ──────────────────────────────────────────────────────────────
function CopyButton({ text }: { text: string }) {
    const [copied, setCopied] = useState(false);
    const handle = useCallback(async () => {
        try { await navigator.clipboard.writeText(text); } catch { const el = document.createElement("textarea"); el.value = text; document.body.appendChild(el); el.select(); document.execCommand("copy"); document.body.removeChild(el); }
        setCopied(true); setTimeout(() => setCopied(false), 2000);
    }, [text]);
    return (
        <button type="button" onClick={handle} className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium transition-all ${copied ? "bg-[#262ef2]/10 text-[#262ef2]" : "bg-[#f3f3f9] text-[#4d5564] hover:bg-[#eaeaf5]"}`}>
            {copied ? <><HiClipboardCheck className="h-3.5 w-3.5" />Copied!</> : <><HiClipboardCopy className="h-3.5 w-3.5" />Copy snippet</>}
        </button>
    );
}

// ─── Syntax highlight ─────────────────────────────────────────────────────────
type Token = { type: "tag" | "attr" | "string" | "plain"; text: string };
const TC: Record<Token["type"], string> = { tag: "#262ef2", attr: "#201f32", string: "#10b981", plain: "#4d5564" };
function tokenize(code: string): Token[][] {
    return code.split("\n").map(line => {
        const tokens: Token[] = []; const re = /(< \/?\w[\w.-]*>?|\/?>|[\w-]+=|"[^"]*"|'[^']*'|[\w-]+)/g;
        let li = 0, m: RegExpExecArray | null;
        while ((m = re.exec(line)) !== null) {
            if (m.index > li) tokens.push({ type: "plain", text: line.slice(li, m.index) });
            const t = m[0];
            if (t.startsWith("<") || t === "/>" || t === ">") tokens.push({ type: "tag", text: t });
            else if (t.endsWith("=")) tokens.push({ type: "attr", text: t });
            else if (t.startsWith('"') || t.startsWith("'")) tokens.push({ type: "string", text: t });
            else tokens.push({ type: "plain", text: t });
            li = m.index + t.length;
        }
        if (li < line.length) tokens.push({ type: "plain", text: line.slice(li) });
        return tokens;
    });
}
function CodeBlock({ code }: { code: string }) {
    return (
        <pre className="overflow-x-auto font-mono text-[10px] leading-5">
            {tokenize(code).map((tokens, li) => (
                <div key={li} className="table-row">
                    <span className="table-cell w-8 select-none pr-4 text-right text-[#a1a1a1]/40">{li + 1}</span>
                    <span className="table-cell">{tokens.map((tok, ti) => <span key={ti} style={{ color: TC[tok.type] }}>{tok.text}</span>)}</span>
                </div>
            ))}
        </pre>
    );
}

// ─── Orbit Visual (Step 2) ────────────────────────────────────────────────────
const ORBIT_ICONS = [
    { d: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" },
    { d: "M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" },
    { d: "M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" },
    { d: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" },
    { d: "M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4" },
    { d: "M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" },
    { d: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" },
    { d: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" },
];

function OrbitVisual() {
    const gRef = useRef<SVGGElement>(null);
    const iconsRef = useRef<SVGGElement>(null);
    const centerRef = useRef<SVGGElement>(null);
    useEffect(() => {
        let ctx: any;
        (async () => {
            const { gsap } = await import("gsap");
            ctx = gsap.context(() => {
                if (gRef.current) gsap.to(gRef.current, { rotation: 360, duration: 30, ease: "none", repeat: -1, transformOrigin: "200 200" });
                if (iconsRef.current) {
                    const icons = iconsRef.current.querySelectorAll(".icon-wrap");
                    gsap.to(icons, { rotation: -360, duration: 30, ease: "none", repeat: -1, transformOrigin: "50% 50%" });
                }
                if (centerRef.current) gsap.to(centerRef.current, { scale: 1.06, duration: 2.2, ease: "sine.inOut", yoyo: true, repeat: -1, transformOrigin: "200 200" });
            });
        })();
        return () => ctx?.revert();
    }, []);

    const r = 140, cx = 200, cy = 200;
    return (
        <svg viewBox="0 0 400 400" className="w-full max-w-[440px]">
            <circle cx={cx} cy={cy} r={r} fill="none" stroke="rgba(60,70,180,0.10)" strokeWidth="1.5" />
            <circle cx={cx} cy={cy} r={r * 0.55} fill="none" stroke="rgba(60,70,180,0.06)" strokeWidth="1" />
            <g ref={gRef}>
                <g ref={iconsRef}>
                    {ORBIT_ICONS.map((icon, i) => {
                        const angle = (i / ORBIT_ICONS.length) * 2 * Math.PI - Math.PI / 2;
                        const ix = cx + r * Math.cos(angle);
                        const iy = cy + r * Math.sin(angle);
                        return (
                            <g key={i} className="icon-wrap" style={{ transformOrigin: `${ix}px ${iy}px` }}>
                                <circle cx={ix} cy={iy} r={17} fill="white" stroke="rgba(60,70,180,0.12)" strokeWidth="1"
                                    style={{ filter: "drop-shadow(0 2px 8px rgba(30,30,80,0.08))" }} />
                                <svg x={ix - 8.5} y={iy - 8.5} width={17} height={17} viewBox="0 0 24 24"
                                    fill="none" stroke="rgba(50,60,160,0.50)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                    <path d={icon.d} />
                                </svg>
                            </g>
                        );
                    })}
                </g>
            </g>
            <g ref={centerRef}>
                <circle cx={cx} cy={cy} r={40} fill="#3c46dc" style={{ filter: "drop-shadow(0 6px 24px rgba(60,70,220,0.40))" }} />
                <text x={cx} y={cy + 1} textAnchor="middle" dominantBaseline="middle"
                    fill="white" fontSize="22" fontWeight="bold" style={{ fontFamily: "sans-serif" }}>R</text>
            </g>
        </svg>
    );
}

// ─── Code Editor Visual ───────────────────────────────────────────────────────
function CodeEditorVisual() {
    const ref = useRef<HTMLDivElement>(null);
    useEffect(() => {
        let ctx: any;
        (async () => {
            const { gsap } = await import("gsap");
            if (!ref.current) return;
            ctx = gsap.context(() => { gsap.to(ref.current, { y: -10, duration: 3, ease: "sine.inOut", yoyo: true, repeat: -1 }); });
        })();
        return () => ctx?.revert();
    }, []);
    return (
        <div ref={ref} className="w-full max-w-[440px] overflow-hidden bg-white"
            style={{ boxShadow: "0 28px 72px rgba(30,30,80,0.14), 0 0 0 1px rgba(60,70,220,0.07)" }}>
            <div className="flex items-center justify-between bg-[#f3f3f9] px-5 py-3 border-b border-[#ebebf5]">
                <div className="flex gap-1.5">
                    <div className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
                    <div className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
                    <div className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
                </div>
                <div className="flex items-center gap-3 text-xs text-[#a1a1a1]">
                    <span className="font-mono">index.html</span>
                    <span className="flex items-center gap-1.5 font-medium text-[#262ef2]">
                        <span className="h-1.5 w-1.5 rounded-full bg-[#262ef2] animate-pulse" />Ready to embed
                    </span>
                </div>
            </div>
            <div className="bg-[#f9f9fc] px-5 py-2.5 font-mono text-[10px] leading-5 text-[#a1a1a1]/60 border-b border-[#f0f0f6]">
                <div>{"<!DOCTYPE html>"}</div>
                <div>{'<html lang="en"><head>'}</div>
                <div className="pl-4 italic text-[#a1a1a1]/40">{"<!-- ↓ paste snippet ↓ -->"}</div>
            </div>
            <div className="relative px-5 py-4 border-l-[3px] border-[#262ef2] bg-[#262ef2]/[0.03]">
                <div className="absolute right-3 top-3"><CopyButton text={EMBED_SNIPPET} /></div>
                <CodeBlock code={EMBED_SNIPPET} />
            </div>
            <div className="bg-[#f9f9fc] px-5 py-2.5 font-mono text-[10px] text-[#a1a1a1]/60 border-t border-[#f0f0f6]">
                {"</head><body>...</body></html>"}
            </div>
            <div className="flex items-center justify-between bg-[#f3f3f9] px-5 py-2.5 border-t border-[#ebebf5]">
                <div className="flex gap-4 font-mono text-[10px] text-[#a1a1a1]"><span>HTML</span><span>UTF-8</span></div>
                <div className="flex items-center gap-1.5 text-[10px] font-medium text-[#262ef2]">
                    <HiCheckCircle className="h-3.5 w-3.5" />No build step required
                </div>
            </div>
        </div>
    );
}

// ─── Dashboard Visual (Step 1) ────────────────────────────────────────────────
function DashboardVisual() {
    const ref = useRef<HTMLDivElement>(null);
    useEffect(() => {
        let ctx: any;
        (async () => {
            const { gsap } = await import("gsap");
            if (!ref.current) return;
            ctx = gsap.context(() => { gsap.to(ref.current, { y: -8, duration: 3.5, ease: "sine.inOut", yoyo: true, repeat: -1 }); });
        })();
        return () => ctx?.revert();
    }, []);
    return (
        <div ref={ref} className="w-full max-w-[420px] bg-white overflow-hidden"
            style={{ boxShadow: "0 24px 64px rgba(30,30,80,0.12), 0 0 0 1px rgba(60,70,220,0.06)" }}>
            <div className="flex items-center gap-2 bg-[#f3f3f9] px-5 py-3 border-b border-[#ebebf5]">
                <div className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
                <div className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
                <div className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
                <span className="ml-3 text-xs font-mono text-[#a1a1a1]">agent-dashboard</span>
            </div>
            <div className="p-5 space-y-4">
                <div className="flex items-end gap-1 h-20">
                    {[30, 52, 38, 68, 44, 80, 58, 74, 50, 88].map((h, i) => (
                        <div key={i} className="flex-1 rounded-t" style={{ height: `${h}%`, backgroundColor: i === 9 ? "#3c46dc" : "#eeeef8" }} />
                    ))}
                </div>
                {[1, 2, 3].map(i => (
                    <div key={i} className="flex items-center gap-3 p-3 bg-[#f8f8fc]">
                        <div className="h-7 w-7 bg-white border border-[#ebebf5]" />
                        <div className="flex-1 space-y-1.5">
                            <div className="h-2 w-24 bg-[#e8e8f0]" />
                            <div className="h-1.5 w-16 bg-[#f0f0f8]" />
                        </div>
                        <div className="h-5 w-12 bg-[#3c46dc]/15" />
                    </div>
                ))}
            </div>
        </div>
    );
}

// ─── Brand Visual (Step 3) ────────────────────────────────────────────────────
function BrandVisual() {
    const ref = useRef<HTMLDivElement>(null);
    useEffect(() => {
        let ctx: any;
        (async () => {
            const { gsap } = await import("gsap");
            if (!ref.current) return;
            ctx = gsap.context(() => { gsap.to(ref.current, { y: -6, duration: 3, ease: "sine.inOut", yoyo: true, repeat: -1 }); });
        })();
        return () => ctx?.revert();
    }, []);
    return (
        <div ref={ref} className="w-full max-w-[400px] bg-white overflow-hidden"
            style={{ boxShadow: "0 24px 64px rgba(30,30,80,0.12), 0 0 0 1px rgba(60,70,220,0.06)" }}>
            <div className="flex items-center gap-2 bg-[#f3f3f9] px-5 py-3 border-b border-[#ebebf5]">
                <div className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
                <div className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
                <div className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
                <span className="ml-3 text-xs font-mono text-[#a1a1a1]">brand-settings</span>
            </div>
            <div className="p-5 space-y-4">
                {/* Color swatches */}
                <div className="flex gap-3">
                    {["#3c46dc", "#201f32", "#10b981", "#f59e0b"].map((c, i) => (
                        <div key={i} className="flex flex-col items-center gap-1.5">
                            <div className="h-10 w-10 border border-[#ebebf5]" style={{ backgroundColor: c }} />
                            <span className="text-[9px] font-mono text-[#a1a1a1]">{c}</span>
                        </div>
                    ))}
                </div>
                {/* Mock form fields */}
                <div className="space-y-2">
                    <div className="h-2 w-16 bg-[#e8e8f0]" />
                    <div className="h-8 w-full bg-[#f8f8fc] border border-[#ebebf5]" />
                </div>
                <div className="space-y-2">
                    <div className="h-2 w-20 bg-[#e8e8f0]" />
                    <div className="h-8 w-full bg-[#f8f8fc] border border-[#ebebf5]" />
                </div>
                <div className="h-8 w-24 bg-[#3c46dc] flex items-center justify-center">
                    <span className="text-[10px] font-medium text-white">Save Theme</span>
                </div>
            </div>
        </div>
    );
}

function StepVisual({ step }: { step: Step }) {
    if (step.id === "01") return <DashboardVisual />;
    if (step.id === "02") return <OrbitVisual />;
    if (step.id === "03") return <BrandVisual />;
    return <CodeEditorVisual />;
}

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function IntegrationSection() {
    const [activeStep, setActiveStep] = useState(0);
    const [fillProgress, setFillProgress] = useState(0);
    const fillRef = useRef<ReturnType<typeof setInterval> | null>(null);
    const startRef = useRef(0);
    const badgeRef = useRef<HTMLDivElement>(null);
    const headingRef = useRef<HTMLHeadingElement>(null);
    const subRef = useRef<HTMLParagraphElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);

    const startFill = useCallback((idx: number) => {
        if (fillRef.current) clearInterval(fillRef.current);
        setFillProgress(0);
        setActiveStep(idx);
        // Use rAF to ensure state has flushed before starting the timer
        requestAnimationFrame(() => {
            startRef.current = performance.now();
            fillRef.current = setInterval(() => {
                const p = Math.min((performance.now() - startRef.current) / FILL_DURATION, 1);
                setFillProgress(p);
                if (p >= 1) {
                    clearInterval(fillRef.current!);
                    fillRef.current = null;
                    const next = (idx + 1) % STEPS.length;
                    setTimeout(() => startFill(next), 150);
                }
            }, 16);
        });
    }, []);

    useEffect(() => { startFill(0); return () => { if (fillRef.current) clearInterval(fillRef.current); }; }, []);

    useEffect(() => {
        (async () => {
            const { gsap } = await import("gsap");
            gsap.fromTo(
                [badgeRef.current, headingRef.current, subRef.current],
                { opacity: 0, y: 24 },
                { opacity: 1, y: 0, duration: 0.7, ease: "power3.out", stagger: 0.12, delay: 0.05 }
            );
        })();
    }, []);

    // Animate content on step change
    useEffect(() => {
        (async () => {
            const { gsap } = await import("gsap");
            if (contentRef.current) {
                gsap.fromTo(contentRef.current,
                    { opacity: 0, y: 16 },
                    { opacity: 1, y: 0, duration: 0.45, ease: "power2.out" }
                );
            }
        })();
    }, [activeStep]);

    const currentStep = STEPS[activeStep];
    const Icon = currentStep.icon;

    return (
        <section id="integration" aria-labelledby="integration-heading"
            className="relative overflow-hidden bg-[#f0f0f6]">

            {/* ── HEADER ── */}
            <div className="relative overflow-hidden pt-20 pb-0 px-6">

                {/* Badge + heading + subtitle */}
                <div className="relative z-10 text-center">
                    <div ref={badgeRef} className="mb-5 inline-flex items-center gap-2" style={{ opacity: 0 }}>
                        <span className="text-[#b0b0c0] text-sm select-none">〈〈</span>
                        <div className="inline-flex items-center gap-2 bg-white border border-[#e0e0ec] px-3.5 py-1.5 shadow-sm">
                            <svg className="h-3.5 w-3.5 text-[#3c46dc]" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M3 5a2 2 0 012-2h10a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2V5zm3 1h8v8H6V6z" clipRule="evenodd" />
                            </svg>
                            <span className="text-xs font-semibold text-[#4a4a5a] tracking-wide">How it Works</span>
                        </div>
                        <span className="text-[#b0b0c0] text-sm select-none">〉〉</span>
                    </div>

                    <h2 ref={headingRef} id="integration-heading"
                        className="text-[44px] font-bold leading-tight tracking-tight text-[#201f32] mb-4"
                        style={{ opacity: 0 }}>
                        Launch Your AI<br />Agent in minutes
                    </h2>

                    <p ref={subRef} className="text-lg text-[#6a6a7a] leading-relaxed mb-0 max-w-lg mx-auto" style={{ opacity: 0 }}>
                        Powerful automation, built without<br />technical overhead for your team.
                    </p>
                </div>
            </div>

            {/* ── STEP TABS ── */}
            <div className="relative mt-12">
                {/* Tabs row — no container borders */}
                <div className="flex items-center justify-center gap-6 py-4 px-6 relative">
                    {STEPS.map((step, idx) => {
                        const isActive = activeStep === idx;
                        const isDone = idx < activeStep;
                        const stepNum = idx + 1;
                        return (
                            <div key={step.id} className="relative flex flex-col items-center">
                                <button
                                    onClick={() => startFill(idx)}
                                    className={`inline-flex items-center gap-2 px-5 py-2.5 select-none focus:outline-none transition-all border ${isActive
                                            ? "bg-[#201f32] text-white border-[#201f32]"
                                            : isDone
                                                ? "bg-transparent text-[#8888b0] border-[#c0c0d8] hover:text-[#6868a0] hover:border-[#a0a0b8]"
                                                : "bg-transparent text-[#a8a8c0] border-[#dddde8] hover:text-[#6868a0] hover:border-[#c0c0d8]"
                                        }`}
                                >
                                    <span className={`text-sm font-bold ${isActive ? "text-white" : isDone ? "text-[#3c46dc]" : "text-[#c0c0d0]"
                                        }`}>
                                        {stepNum}
                                    </span>
                                    <span className={`text-sm ${isActive ? "font-semibold" : "font-medium"
                                        } transition-colors hidden sm:inline`}>
                                        {step.title}
                                    </span>
                                </button>

                                {/* Vertical connecting line — starts from bottom of this button */}
                                <div
                                    className="w-px"
                                    style={{
                                        height: 40,
                                        backgroundColor: isActive ? "#3c46dc" : isDone ? "#c0c0d8" : "#dddde8",
                                        opacity: isActive ? 1 : isDone ? 0.7 : 0.4,
                                    }}
                                />
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* ── CONTENT PANEL: Info left + Visual right ── */}
            <div className="flex flex-col lg:flex-row border border-[#dddde8]" style={{ height: 480 }}>

                {/* ── LEFT: White panel with background progress fill ── */}
                <div className="relative overflow-hidden lg:w-[38%] flex flex-col justify-between p-10 lg:p-12 bg-white border-r border-[#dddde8]">

                    {/* Background progress fill — sweeps left→right */}
                    <div
                        className="absolute inset-0 z-0 pointer-events-none"
                        style={{
                            background: "linear-gradient(135deg, #f0f0fa 0%, #e8e8f5 100%)",
                            width: `${fillProgress * 100}%`,
                            transition: "width 50ms linear",
                        }}
                    />

                    {/* Step content */}
                    <div ref={contentRef} className="relative z-10 flex flex-col h-full justify-between">
                        <div>
                            {/* Step number indicator */}
                            <div className="flex items-center gap-3 mb-6">
                                <div className="flex items-center justify-center w-10 h-10 bg-[#3c46dc] text-white">
                                    <Icon className="w-5 h-5" />
                                </div>
                                <span className="text-xs font-bold uppercase tracking-widest text-[#3c46dc]">Step {currentStep.id}</span>
                            </div>
                            <h3 className="text-[28px] font-bold leading-snug text-[#201f32] mb-6">
                                {currentStep.title}
                            </h3>
                        </div>
                        <div>
                            <p className="text-[14px] leading-relaxed text-[#4a4a66] mb-6">
                                {currentStep.description}
                            </p>
                            {COMPATIBLE_TECHS && (
                                <div className="flex flex-wrap items-center gap-1.5">
                                    {COMPATIBLE_TECHS.map((t: string) => (
                                        <span key={t} className="bg-[#f3f3f9] px-2 py-0.5 text-xs text-[#4d5564] border border-[#e8e8f0]">
                                            {t}
                                        </span>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Progress percentage indicator */}
                    <div className="absolute bottom-4 right-4 z-10">
                        <span className="text-[10px] font-mono font-bold text-[#3c46dc]/40">
                            {Math.round(fillProgress * 100)}%
                        </span>
                    </div>
                </div>

                {/* ── RIGHT: Visual panel ── */}
                <div className="relative flex items-center justify-center lg:flex-1 px-10 overflow-hidden"
                    style={{ background: "linear-gradient(160deg, #f2f2f8 0%, #ebebf5 100%)" }}>
                    {/* Dot grid */}
                    <div className="absolute inset-0 pointer-events-none"
                        style={{ backgroundImage: "radial-gradient(circle, rgba(80,90,200,0.055) 1px, transparent 1px)", backgroundSize: "22px 22px" }} />
                    {/* Glow */}
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <div className="w-80 h-80 rounded-full"
                            style={{ background: "radial-gradient(circle, rgba(60,70,220,0.06) 0%, transparent 70%)" }} />
                    </div>

                    <div className="relative w-full flex justify-center">
                        <StepVisual step={currentStep} />
                    </div>
                </div>
            </div>
        </section>
    );
}