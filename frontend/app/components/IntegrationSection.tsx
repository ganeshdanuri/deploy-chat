"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { HiClipboardCheck, HiClipboardCopy, HiCheckCircle } from "react-icons/hi";
import {
    INTEGRATION_STEPS as STEPS,
    EMBED_SNIPPET,
    COMPATIBLE_TECHS,
    IntegrationStep as Step,
    INTEGRATION_ORBIT_ICONS,
    PAGE_CONTENT
} from "../../lib/constants";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
}

const FILL_DURATION = 6;   // seconds (used by GSAP tween)

// ─── Copy Button ──────────────────────────────────────────────────────────────
function CopyButton({ text }: { text: string }) {
    const [copied, setCopied] = useState(false);
    const handle = useCallback(async () => {
        try { await navigator.clipboard.writeText(text); } catch { const el = document.createElement("textarea"); el.value = text; document.body.appendChild(el); el.select(); document.execCommand("copy"); document.body.removeChild(el); }
        setCopied(true); setTimeout(() => setCopied(false), 2000);
    }, [text]);
    return (
        <button type="button" onClick={handle} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${copied ? "bg-primary/10 text-primary" : "bg-muted text-foreground hover:bg-primary/5 hover:text-primary"}`}>
            {copied ? <><HiClipboardCheck className="h-3.5 w-3.5" />Copied!</> : <><HiClipboardCopy className="h-3.5 w-3.5" />Copy snippet</>}
        </button>
    );
}

// ─── Syntax highlight ─────────────────────────────────────────────────────────
type Token = { type: "tag" | "attr" | "string" | "plain"; text: string };
const TC: Record<Token["type"], string> = { tag: "var(--primary)", attr: "var(--secondary)", string: "var(--accent-emerald)", plain: "var(--foreground)" };
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
                    <span className="table-cell w-8 select-none pr-4 text-right text-muted-foreground/40">{li + 1}</span>
                    <span className="table-cell">{tokens.map((tok, ti) => <span key={ti} style={{ color: TC[tok.type] }}>{tok.text}</span>)}</span>
                </div>
            ))}
        </pre>
    );
}

function OrbitVisual() {
    const svgRef = useRef<SVGSVGElement>(null);
    const gRef = useRef<SVGGElement>(null);
    const iconsRef = useRef<SVGGElement>(null);
    const centerRef = useRef<SVGGElement>(null);

    // Scope to the top-level SVG so all sibling <g> refs are within the GSAP context
    useGSAP(() => {
        if (gRef.current) {
            gsap.to(gRef.current, { rotation: 360, duration: 30, ease: "none", repeat: -1, transformOrigin: "200 200" });
        }
        if (iconsRef.current) {
            const icons = iconsRef.current.querySelectorAll(".icon-wrap");
            gsap.to(icons, { rotation: -360, duration: 30, ease: "none", repeat: -1, transformOrigin: "50% 50%" });
        }
        if (centerRef.current) {
            gsap.to(centerRef.current, { scale: 1.06, duration: 2.2, ease: "sine.inOut", repeat: -1, yoyo: true, transformOrigin: "200 200" });
        }
    }, { scope: svgRef });

    const r = 140, cx = 200, cy = 200;
    return (
        <svg ref={svgRef} viewBox="0 0 400 400" className="w-full max-w-[440px]">
            <circle cx={cx} cy={cy} r={r} fill="none" stroke="rgba(0,82,255,0.10)" strokeWidth="1.5" />
            <circle cx={cx} cy={cy} r={r * 0.55} fill="none" stroke="rgba(0,82,255,0.06)" strokeWidth="1" />
            <g ref={gRef}>
                <g ref={iconsRef}>
                    {INTEGRATION_ORBIT_ICONS.map((icon, i) => {
                        const angle = (i / INTEGRATION_ORBIT_ICONS.length) * 2 * Math.PI - Math.PI / 2;
                        const ix = cx + r * Math.cos(angle);
                        const iy = cy + r * Math.sin(angle);
                        return (
                            <g key={i} className="icon-wrap" style={{ transformOrigin: `${ix}px ${iy}px` }}>
                                <circle cx={ix} cy={iy} r={17} fill="white" stroke="rgba(0,82,255,0.12)" strokeWidth="1"
                                    style={{ filter: "drop-shadow(0 2px 8px rgba(15,23,42,0.08))" }} />
                                <svg x={ix - 8.5} y={iy - 8.5} width={17} height={17} viewBox="0 0 24 24"
                                    fill="none" stroke="rgba(0,82,255,0.50)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                    <path d={icon.d} />
                                </svg>
                            </g>
                        );
                    })}
                </g>
            </g>
            <g ref={centerRef}>
                <circle cx={cx} cy={cy} r={40} fill="url(#gradient-center)" style={{ filter: "drop-shadow(0 6px 24px rgba(0,82,255,0.35))" }} />
                <defs><linearGradient id="gradient-center" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#0052FF" /><stop offset="100%" stopColor="#4D7CFF" /></linearGradient></defs>
                <svg x={cx - 13} y={cy - 13} width={26} height={26} viewBox="0 0 24 24"
                    fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
                </svg>
            </g>
        </svg>
    );
}

// ─── Code Editor Visual ───────────────────────────────────────────────────────
function CodeEditorVisual() {
    const ref = useRef<HTMLDivElement>(null);
    useGSAP(() => {
        if (!ref.current) return;
        gsap.to(ref.current, { y: -6, duration: 3, ease: "sine.inOut", yoyo: true, repeat: -1 });
    }, { scope: ref });
    return (
        <div ref={ref} className="w-full max-w-[440px] overflow-hidden bg-white rounded-2xl"
            style={{ boxShadow: "0 28px 72px rgba(15,23,42,0.12), 0 0 0 1px rgba(0,82,255,0.06)" }}>
            <div className="flex items-center justify-between bg-muted rounded-t-2xl px-5 py-3 border-b border-border">
                <div className="flex gap-1.5">
                    <div className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
                    <div className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
                    <div className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
                </div>
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <span className="font-mono">index.html</span>
                    <span className="flex items-center gap-1.5 font-medium text-primary">
                        <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />Ready to embed
                    </span>
                </div>
            </div>
            <div className="bg-muted px-5 py-2.5 font-mono text-[10px] leading-5 text-muted-foreground/60 border-b border-background">
                <div>{"<!DOCTYPE html>"}</div>
                <div>{'<html lang="en"><head>'}</div>
                <div className="pl-4 italic text-muted-foreground/40">{"<!-- ↓ paste snippet ↓ -->"}</div>
            </div>
            <div className="relative px-5 py-4 border-l-[3px] border-primary bg-primary/[0.03] overflow-x-auto max-w-full">
                <div className="absolute right-3 top-3 z-10"><CopyButton text={EMBED_SNIPPET} /></div>
                <CodeBlock code={EMBED_SNIPPET} />
            </div>
            <div className="bg-muted px-5 py-2.5 font-mono text-[10px] text-muted-foreground/60 border-t border-background">
                {"</head><body>...</body></html>"}
            </div>
            <div className="flex items-center justify-between bg-muted px-5 py-2.5 border-t border-border">
                <div className="flex gap-4 font-mono text-[10px] text-muted-foreground"><span>HTML</span><span>UTF-8</span></div>
                <div className="flex items-center gap-1.5 text-[10px] font-medium text-primary">
                    <HiCheckCircle className="h-3.5 w-3.5" />No build step required
                </div>
            </div>
        </div>
    );
}

// ─── Dashboard Visual (Step 1) ────────────────────────────────────────────────
function DashboardVisual() {
    const ref = useRef<HTMLDivElement>(null);
    useGSAP(() => {
        if (!ref.current) return;
        gsap.to(ref.current, { y: -8, duration: 3.5, ease: "sine.inOut", yoyo: true, repeat: -1 });
    }, { scope: ref });
    return (
        <div ref={ref} className="w-full max-w-[420px] bg-white overflow-hidden rounded-2xl"
            style={{ boxShadow: "0 24px 64px rgba(15,23,42,0.10), 0 0 0 1px rgba(0,82,255,0.05)" }}>
            <div className="flex items-center gap-2 bg-muted rounded-t-2xl px-5 py-3 border-b border-border">
                <div className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
                <div className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
                <div className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
                <span className="ml-3 text-xs font-mono text-muted-foreground">agent-dashboard</span>
            </div>
            <div className="p-5 space-y-4">
                <div className="flex items-end gap-1 h-20">
                    {[30, 52, 38, 68, 44, 80, 58, 74, 50, 88].map((h, i) => (
                        <div key={i} className="flex-1 rounded-t" style={{ height: `${h}%`, backgroundColor: i === 9 ? "var(--primary)" : "var(--muted)" }} />
                    ))}
                </div>
                {[1, 2, 3].map(i => (
                    <div key={i} className="flex items-center gap-3 p-3 bg-muted">
                        <div className="h-7 w-7 bg-white border border-border" />
                        <div className="flex-1 space-y-1.5">
                            <div className="h-2 w-24 bg-border" />
                            <div className="h-1.5 w-16 bg-background" />
                        </div>
                        <div className="h-5 w-12 bg-primary/15" />
                    </div>
                ))}
            </div>
        </div>
    );
}

// ─── Brand Visual (Step 3) ────────────────────────────────────────────────────
function BrandVisual() {
    const ref = useRef<HTMLDivElement>(null);
    useGSAP(() => {
        if (!ref.current) return;
        gsap.to(ref.current, { y: -6, duration: 3, ease: "sine.inOut", yoyo: true, repeat: -1 });
    }, { scope: ref });
    return (
        <div ref={ref} className="w-full max-w-[400px] bg-white overflow-hidden rounded-2xl"
            style={{ boxShadow: "0 24px 64px rgba(15,23,42,0.10), 0 0 0 1px rgba(0,82,255,0.05)" }}>
            <div className="flex items-center gap-2 bg-muted rounded-t-2xl px-5 py-3 border-b border-border">
                <div className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
                <div className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
                <div className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
                <span className="ml-3 text-xs font-mono text-muted-foreground">brand-settings</span>
            </div>
            <div className="p-5 space-y-4">
                {/* Color swatches */}
                <div className="flex gap-3">
                    {["var(--primary)", "var(--secondary)", "var(--accent-emerald)", "var(--accent-gold)"].map((c, i) => (
                        <div key={i} className="flex flex-col items-center gap-1.5">
                            <div className="h-10 w-10 border border-border" style={{ backgroundColor: c }} />
                            <span className="text-[9px] font-mono text-muted-foreground">{c}</span>
                        </div>
                    ))}
                </div>
                {/* Mock form fields */}
                <div className="space-y-2">
                    <div className="h-2 w-16 bg-border" />
                    <div className="h-8 w-full bg-muted border border-border" />
                </div>
                <div className="space-y-2">
                    <div className="h-2 w-20 bg-border" />
                    <div className="h-8 w-full bg-muted border border-border" />
                </div>
                <div className="h-8 w-24 gradient-bg rounded-lg flex items-center justify-center">
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

// ─── Connecting Lines SVG Overlay ─────────────────────────────────────────────
interface LineData {
    x: number;      // x position relative to container
    startY: number;  // top of line (bottom of button)
    endY: number;    // bottom of line (top of content panel)
}

function ConnectingLines({
    containerRef,
    buttonRefs,
    panelRef,
    activeStep,
}: {
    containerRef: React.RefObject<HTMLDivElement | null>;
    buttonRefs: React.RefObject<(HTMLButtonElement | null)[]>;
    panelRef: React.RefObject<HTMLDivElement | null>;
    activeStep: number;
}) {
    const [lines, setLines] = useState<LineData[]>([]);
    const svgRef = useRef<SVGSVGElement>(null);

    const measure = useCallback(() => {
        if (!containerRef.current || !panelRef.current || !buttonRefs.current) return;
        const containerRect = containerRef.current.getBoundingClientRect();
        const panelRect = panelRef.current.getBoundingClientRect();
        const panelTopY = panelRect.top - containerRect.top;

        const newLines: LineData[] = buttonRefs.current.map((btn) => {
            if (!btn) return { x: 0, startY: 0, endY: panelTopY };
            const btnRect = btn.getBoundingClientRect();
            return {
                x: btnRect.left + btnRect.width / 2 - containerRect.left,
                startY: btnRect.bottom - containerRect.top,
                endY: panelTopY,
            };
        });
        setLines(newLines);
    }, [containerRef, buttonRefs, panelRef]);

    useEffect(() => {
        measure();
        const observer = new ResizeObserver(measure);
        if (containerRef.current) observer.observe(containerRef.current);
        return () => observer.disconnect();
    }, [measure, containerRef]);

    // Re-measure on step change (button sizes might differ slightly)
    useEffect(() => {
        requestAnimationFrame(measure);
    }, [activeStep, measure]);

    if (lines.length === 0) return null;

    return (
        <svg
            ref={svgRef}
            className="absolute inset-0 w-full h-full pointer-events-none z-[1]"
            style={{ overflow: "visible" }}
        >
            {lines.map((line, idx) => {
                const isActive = activeStep === idx;
                const isDone = idx < activeStep;
                return (
                    <line
                        key={idx}
                        x1={line.x}
                        y1={line.startY}
                        x2={line.x}
                        y2={line.endY}
                        stroke={isActive ? "var(--primary)" : isDone ? "var(--border)" : "var(--border-medium)"}
                        strokeWidth={1}
                        opacity={isActive ? 1 : isDone ? 0.7 : 0.4}
                        style={{ transition: "stroke 0.3s, opacity 0.3s" }}
                    />
                );
            })}
        </svg>
    );
}

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function IntegrationSection() {
    const [activeStep, setActiveStep] = useState(0);
    const [progress, setProgress] = useState(0);

    const sectionRef = useRef<HTMLElement>(null);
    const headerRef = useRef<HTMLDivElement>(null);
    const cardRef = useRef<HTMLDivElement>(null);

    // For connecting lines
    const sectionContainerRef = useRef<HTMLDivElement>(null);
    const buttonRefs = useRef<(HTMLButtonElement | null)[]>([]);
    const contentPanelRef = useRef<HTMLDivElement>(null);

    const tweenRef = useRef<gsap.core.Tween | null>(null);

    const startFill = useCallback(() => {
        if (tweenRef.current) tweenRef.current.kill();
        setProgress(0);
        tweenRef.current = gsap.to({ val: 0 }, {
            val: 100,
            duration: FILL_DURATION,
            ease: "none",
            onUpdate: function () {
                setProgress(this.targets()[0].val);
            },
            onComplete: () => {
                setActiveStep((prev) => (prev + 1) % STEPS.length);
            }
        });
    }, []);

    useEffect(() => {
        startFill();
        return () => { if (tweenRef.current) tweenRef.current.kill(); };
    }, [activeStep, startFill]);

    useGSAP(() => {
        if (!headerRef.current || !cardRef.current) return;
        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: sectionRef.current,
                start: "top 75%",
            }
        });
        tl.from(headerRef.current.children, { y: 30, opacity: 0, stagger: 0.1, duration: 0.8, ease: "power3.out" })
            .from(cardRef.current, { y: 40, opacity: 0, duration: 1, ease: "power3.out" }, "-=0.4");
    }, { scope: sectionRef });

    const currentStep = STEPS[activeStep];
    const Icon = currentStep.icon;

    return (
        <section ref={sectionRef} id="integration" aria-labelledby="integration-heading"
            className="relative overflow-hidden bg-background">

            {/* ── HEADER ── */}
            <div ref={headerRef} className="relative overflow-hidden pt-16 lg:pt-24 pb-0 px-6">

                {/* Badge + heading + subtitle */}
                <div className="relative z-10 text-center">
                    <div className="mb-6 flex items-center justify-center">
                        <div className="inline-flex items-center rounded-full border border-border bg-muted/50 px-3 py-1 shadow-sm">
                            <span className="text-sm font-medium text-foreground">
                                {PAGE_CONTENT.integration.badge}
                            </span>
                        </div>
                    </div>

                    <h2 id="integration-heading"
                        className="text-3xl md:text-[3.25rem] leading-[1.15] text-foreground mb-4">
                        Launch Your AI<br />Agent in <span className="gradient-text">Minutes</span>
                    </h2>

                    <p className="text-lg text-muted-foreground leading-relaxed mb-0 max-w-lg mx-auto">
                        Powerful automation, built without<br />technical overhead for your team.
                    </p>
                </div>
            </div>

            {/* ── TABS + CONTENT — single relative container for SVG line overlay ── */}
            <div ref={sectionContainerRef} className="relative mt-8 lg:mt-12">

                {/* SVG connecting lines overlay */}
                <ConnectingLines
                    containerRef={sectionContainerRef}
                    buttonRefs={buttonRefs}
                    panelRef={contentPanelRef}
                    activeStep={activeStep}
                />

                {/* Tabs row */}
                <div className="flex items-center justify-center gap-4 lg:gap-6 py-4 px-6 relative z-[2]">
                    {STEPS.map((step, idx) => {
                        const isActive = activeStep === idx;
                        const isDone = idx < activeStep;
                        const stepNum = idx + 1;
                        return (
                            <div key={step.id} className="relative flex flex-col items-center">
                                <button
                                    ref={(el) => { buttonRefs.current[idx] = el; }}
                                    onClick={() => setActiveStep(idx)}
                                    className={`inline-flex items-center justify-center sm:gap-2 w-10 h-10 sm:w-auto sm:h-auto sm:px-5 sm:py-2.5 rounded-full sm:rounded-xl select-none focus:outline-none transition-all duration-200 active:scale-[0.98] border ${isActive
                                        ? "gradient-bg text-white border-transparent shadow-md"
                                        : isDone
                                            ? "bg-white text-muted-foreground border-border hover:text-foreground hover:border-primary/20"
                                            : "bg-white text-muted-foreground border-border hover:text-foreground hover:border-primary/20"
                                        }`}
                                >
                                    <span className={`text-sm font-bold ${isActive ? "text-white" : isDone ? "text-primary" : "text-muted-foreground"
                                        }`}>
                                        {stepNum}
                                    </span>
                                    <span className={`text-sm ${isActive ? "font-semibold" : "font-medium"
                                        } transition-colors hidden sm:inline`}>
                                        {step.title}
                                    </span>
                                </button>
                            </div>
                        );
                    })}
                </div>

                {/* ── CONTENT PANEL: Info left + Visual right ── */}
                <div ref={cardRef} className="relative z-[2] flex flex-col lg:flex-row border border-border rounded-2xl overflow-hidden mt-8 lg:mt-16 mb-16 lg:mb-24 mx-4 lg:mx-10 lg:h-[480px] lg:min-h-[480px] bg-white lg:bg-transparent shadow-lg" style={{ boxShadow: 'var(--shadow-lg)' }}>

                    {/* ── LEFT: White panel with background progress fill ── */}
                    <div ref={contentPanelRef} className="relative overflow-hidden lg:w-[38%] flex flex-col justify-between p-8 lg:p-12 bg-white border-b lg:border-b-0 lg:border-r border-border min-h-[320px] lg:min-h-0">

                        {/* Background progress fill */}
                        <div
                            className="absolute left-0 bottom-0 top-0 bg-primary/[0.03] border-r border-primary/10 transition-none z-0"
                            style={{ width: `${progress}%` }}
                        />

                        {/* Current step content */}
                        <div className="relative z-10 flex flex-col h-full justify-between">
                            <div>
                                {/* Step number indicator */}
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="flex items-center justify-center w-10 h-10 gradient-bg rounded-xl text-white">
                                        <Icon className="w-5 h-5" />
                                    </div>
                                    <span className="text-xs font-bold uppercase tracking-widest text-primary">Step {currentStep.id}</span>
                                </div>
                                <h3 className="text-[28px] font-bold leading-snug text-foreground mb-6">
                                    {currentStep.title}
                                </h3>
                            </div>
                            <div>
                                <p className="text-[14px] leading-relaxed text-foreground mb-6">
                                    {currentStep.description}
                                </p>
                                {COMPATIBLE_TECHS && (
                                    <div className="flex flex-wrap items-center gap-1.5">
                                        {COMPATIBLE_TECHS.map((t: string) => (
                                            <span key={t} className="bg-muted rounded-md px-2 py-0.5 text-xs text-foreground border border-border">
                                                {t}
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Progress Label */}
                        <div className="relative z-10 mt-8 flex items-center justify-between border-t border-border pt-6">
                            <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Auto-progress</span>
                            <span className="font-mono text-[10px] font-bold text-primary">0{activeStep + 1} / 04</span>
                        </div>
                    </div>

                    {/* ── RIGHT: Visual panel ── */}
                    <div className="relative flex items-center justify-center lg:flex-1 px-10 py-12 lg:py-0 overflow-hidden"
                        style={{ background: "linear-gradient(160deg, #FFFFFF 0%, var(--muted) 100%)" }}>
                        {/* Dot grid */}
                        <div className="absolute inset-0 pointer-events-none"
                            style={{ backgroundImage: "radial-gradient(circle, rgba(0,82,255,0.04) 1px, transparent 1px)", backgroundSize: "22px 22px" }} />
                        {/* Glow */}
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                            <div className="w-80 h-80 rounded-full"
                                style={{ background: "radial-gradient(circle, rgba(0,82,255,0.05) 0%, transparent 70%)" }} />
                        </div>

                        <div className="relative w-full flex justify-center">
                            <StepVisual step={currentStep} />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}