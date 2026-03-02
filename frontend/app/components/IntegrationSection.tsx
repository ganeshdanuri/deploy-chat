"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { HiClipboardCheck, HiClipboardCopy, HiCheckCircle } from "react-icons/hi";
import {
    INTEGRATION_STEPS as STEPS,
    EMBED_SNIPPET,
    COMPATIBLE_TECHS,
    IntegrationStep as Step,
    INTEGRATION_ORBIT_ICONS
} from "../../lib/constants";

const FILL_DURATION = 6;   // seconds (used by GSAP tween)

// ─── Copy Button ──────────────────────────────────────────────────────────────
function CopyButton({ text }: { text: string }) {
    const [copied, setCopied] = useState(false);
    const handle = useCallback(async () => {
        try { await navigator.clipboard.writeText(text); } catch { const el = document.createElement("textarea"); el.value = text; document.body.appendChild(el); el.select(); document.execCommand("copy"); document.body.removeChild(el); }
        setCopied(true); setTimeout(() => setCopied(false), 2000);
    }, [text]);
    return (
        <button type="button" onClick={handle} className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium transition-all ${copied ? "bg-primary/10 text-primary" : "bg-muted text-foreground hover:bg-[#eaeaf5]"}`}>
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
                    <span className="table-cell w-8 select-none pr-4 text-right text-muted-foreground/40">{li + 1}</span>
                    <span className="table-cell">{tokens.map((tok, ti) => <span key={ti} style={{ color: TC[tok.type] }}>{tok.text}</span>)}</span>
                </div>
            ))}
        </pre>
    );
}

function OrbitVisual() {
    const gRef = useRef<SVGGElement>(null);
    const iconsRef = useRef<SVGGElement>(null);
    const centerRef = useRef<SVGGElement>(null);
    useEffect(() => {
        let ctx: { revert: () => void };
        (async () => {
            const { gsap } = await import("gsap");
            ctx = gsap.context(() => {
                if (gRef.current) gsap.to(gRef.current, { rotation: 360, duration: 30, ease: "none", repeat: -1, transformOrigin: "200 200" });
                if (iconsRef.current) {
                    const icons = iconsRef.current.querySelectorAll(".icon-wrap");
                    gsap.to(icons, { rotation: -360, duration: 30, ease: "none", repeat: -1, transformOrigin: "50% 50%" });
                }
                if (centerRef.current) gsap.to(centerRef.current, { scale: 1.06, duration: 2.2, ease: "sine.inOut", repeat: -1, yoyo: true, transformOrigin: "200 200" });
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
                    {INTEGRATION_ORBIT_ICONS.map((icon, i) => {
                        const angle = (i / INTEGRATION_ORBIT_ICONS.length) * 2 * Math.PI - Math.PI / 2;
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
    useEffect(() => {
        let ctx: { revert: () => void };
        (async () => {
            const { gsap } = await import("gsap");
            if (!ref.current) return;
            ctx = gsap.context(() => { gsap.to(ref.current, { y: -6, duration: 3, ease: "sine.inOut", yoyo: true, repeat: -1 }); });
        })();
        return () => ctx?.revert();
    }, []);
    return (
        <div ref={ref} className="w-full max-w-[440px] overflow-hidden bg-white"
            style={{ boxShadow: "0 28px 72px rgba(30,30,80,0.14), 0 0 0 1px rgba(60,70,220,0.07)" }}>
            <div className="flex items-center justify-between bg-muted px-5 py-3 border-b border-[#ebebf5]">
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
            <div className="bg-muted px-5 py-2.5 font-mono text-[10px] leading-5 text-muted-foreground/60 border-b border-[#f0f0f6]">
                <div>{"<!DOCTYPE html>"}</div>
                <div>{'<html lang="en"><head>'}</div>
                <div className="pl-4 italic text-muted-foreground/40">{"<!-- ↓ paste snippet ↓ -->"}</div>
            </div>
            <div className="relative px-5 py-4 border-l-[3px] border-primary bg-primary/[0.03]">
                <div className="absolute right-3 top-3"><CopyButton text={EMBED_SNIPPET} /></div>
                <CodeBlock code={EMBED_SNIPPET} />
            </div>
            <div className="bg-muted px-5 py-2.5 font-mono text-[10px] text-muted-foreground/60 border-t border-[#f0f0f6]">
                {"</head><body>...</body></html>"}
            </div>
            <div className="flex items-center justify-between bg-muted px-5 py-2.5 border-t border-[#ebebf5]">
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
    useEffect(() => {
        let ctx: { revert: () => void };
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
            <div className="flex items-center gap-2 bg-muted px-5 py-3 border-b border-[#ebebf5]">
                <div className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
                <div className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
                <div className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
                <span className="ml-3 text-xs font-mono text-muted-foreground">agent-dashboard</span>
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
                            <div className="h-2 w-24 bg-border" />
                            <div className="h-1.5 w-16 bg-[#f0f0f8]" />
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
    useEffect(() => {
        let ctx: { revert: () => void };
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
            <div className="flex items-center gap-2 bg-muted px-5 py-3 border-b border-[#ebebf5]">
                <div className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
                <div className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
                <div className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
                <span className="ml-3 text-xs font-mono text-muted-foreground">brand-settings</span>
            </div>
            <div className="p-5 space-y-4">
                {/* Color swatches */}
                <div className="flex gap-3">
                    {["#3c46dc", "#201f32", "#10b981", "#f59e0b"].map((c, i) => (
                        <div key={i} className="flex flex-col items-center gap-1.5">
                            <div className="h-10 w-10 border border-[#ebebf5]" style={{ backgroundColor: c }} />
                            <span className="text-[9px] font-mono text-muted-foreground">{c}</span>
                        </div>
                    ))}
                </div>
                {/* Mock form fields */}
                <div className="space-y-2">
                    <div className="h-2 w-16 bg-border" />
                    <div className="h-8 w-full bg-[#f8f8fc] border border-[#ebebf5]" />
                </div>
                <div className="space-y-2">
                    <div className="h-2 w-20 bg-border" />
                    <div className="h-8 w-full bg-[#f8f8fc] border border-[#ebebf5]" />
                </div>
                <div className="h-8 w-24 bg-primary flex items-center justify-center">
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
        // Measure on mount + after a small delay for layout settle
        measure();
        const timer = setTimeout(measure, 300);
        window.addEventListener("resize", measure);
        return () => {
            clearTimeout(timer);
            window.removeEventListener("resize", measure);
        };
    }, [measure]);

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
                        stroke={isActive ? "#3c46dc" : isDone ? "#c0c0d8" : "#dddde8"}
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
    const fillTweenRef = useRef<{ kill: () => void } | null>(null);    // GSAP tween for the fill bar
    const fillBarRef = useRef<HTMLDivElement>(null);   // DOM element for the fill bar
    const progressTextRef = useRef<HTMLSpanElement>(null);   // progress % text
    const badgeRef = useRef<HTMLDivElement>(null);
    const headingRef = useRef<HTMLHeadingElement>(null);
    const subRef = useRef<HTMLParagraphElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);

    // For connecting lines
    const sectionContainerRef = useRef<HTMLDivElement>(null);
    const buttonRefs = useRef<(HTMLButtonElement | null)[]>([]);
    const contentPanelRef = useRef<HTMLDivElement>(null);

    // ── GSAP-powered fill animation (no yoyo, no reverse) ──
    const startFill = useCallback(async (idx: number) => {
        const { gsap } = await import("gsap");

        // Kill previous tween
        if (fillTweenRef.current) {
            fillTweenRef.current.kill();
            fillTweenRef.current = null;
        }

        // Instantly reset bar to 0% (no transition / no reverse animation)
        if (fillBarRef.current) {
            gsap.set(fillBarRef.current, { width: "0%" });
        }
        if (progressTextRef.current) {
            progressTextRef.current.textContent = "0%";
        }

        setActiveStep(idx);

        // Wait one frame for React to flush
        requestAnimationFrame(() => {
            const obj = { progress: 0 };

            fillTweenRef.current = gsap.to(obj, {
                progress: 100,
                duration: FILL_DURATION,
                ease: "none",
                repeat: 0,           // NO repeat on this tween
                yoyo: false,         // NO reverse
                onUpdate: () => {
                    const p = Math.round(obj.progress);
                    if (fillBarRef.current) {
                        fillBarRef.current.style.width = `${p}%`;
                    }
                    if (progressTextRef.current) {
                        progressTextRef.current.textContent = `${p}%`;
                    }
                },
                onComplete: () => {
                    fillTweenRef.current = null;
                    const next = (idx + 1) % STEPS.length;
                    // Small delay before next step
                    setTimeout(() => startFill(next), 150);
                },
            });
        });
    }, []);

    useEffect(() => {
        startFill(0);
        return () => {
            if (fillTweenRef.current) fillTweenRef.current.kill();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

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
                    { opacity: 0 },
                    { opacity: 1, duration: 0.4, ease: "power2.out" }
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
                            <svg className="h-3.5 w-3.5 text-primary" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M3 5a2 2 0 012-2h10a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2V5zm3 1h8v8H6V6z" clipRule="evenodd" />
                            </svg>
                            <span className="text-xs font-semibold text-foreground tracking-wide">How it Works</span>
                        </div>
                        <span className="text-[#b0b0c0] text-sm select-none">〉〉</span>
                    </div>

                    <h2 ref={headingRef} id="integration-heading"
                        className="text-[44px] font-bold leading-tight tracking-tight text-secondary mb-4"
                        style={{ opacity: 0 }}>
                        Launch Your AI<br />Agent in minutes
                    </h2>

                    <p ref={subRef} className="text-lg text-[#6a6a7a] leading-relaxed mb-0 max-w-lg mx-auto" style={{ opacity: 0 }}>
                        Powerful automation, built without<br />technical overhead for your team.
                    </p>
                </div>
            </div>

            {/* ── TABS + CONTENT — single relative container for SVG line overlay ── */}
            <div ref={sectionContainerRef} className="relative mt-12">

                {/* SVG connecting lines overlay */}
                <ConnectingLines
                    containerRef={sectionContainerRef}
                    buttonRefs={buttonRefs}
                    panelRef={contentPanelRef}
                    activeStep={activeStep}
                />

                {/* Tabs row */}
                <div className="flex items-center justify-center gap-6 py-4 px-6 relative z-[2]">
                    {STEPS.map((step, idx) => {
                        const isActive = activeStep === idx;
                        const isDone = idx < activeStep;
                        const stepNum = idx + 1;
                        return (
                            <div key={step.id} className="relative flex flex-col items-center">
                                <button
                                    ref={(el) => { buttonRefs.current[idx] = el; }}
                                    onClick={() => startFill(idx)}
                                    className={`inline-flex items-center gap-2 px-5 py-2.5 select-none focus:outline-none transition-all border ${isActive
                                        ? "bg-secondary text-white border-secondary"
                                        : isDone
                                            ? "bg-transparent text-[#8888b0] border-[#c0c0d8] hover:text-[#6868a0] hover:border-[#a0a0b8]"
                                            : "bg-transparent text-[#a8a8c0] border-[#dddde8] hover:text-[#6868a0] hover:border-[#c0c0d8]"
                                        }`}
                                >
                                    <span className={`text-sm font-bold ${isActive ? "text-white" : isDone ? "text-primary" : "text-[#c0c0d0]"
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
                <div ref={contentPanelRef} className="relative z-[2] flex flex-col lg:flex-row border border-[#dddde8] mt-16" style={{ height: 480, minHeight: 480 }}>

                    {/* ── LEFT: White panel with background progress fill ── */}
                    <div className="relative overflow-hidden lg:w-[38%] flex flex-col justify-between p-10 lg:p-12 bg-white border-r border-[#dddde8]">

                        {/* Background progress fill — driven by GSAP, no CSS transition (prevents reverse) */}
                        <div
                            ref={fillBarRef}
                            className="absolute inset-0 z-0 pointer-events-none"
                            style={{
                                background: "linear-gradient(135deg, #f0f0fa 0%, #e8e8f5 100%)",
                                width: "0%",
                            }}
                        />

                        {/* Step content */}
                        <div ref={contentRef} className="relative z-10 flex flex-col h-full justify-between">
                            <div>
                                {/* Step number indicator */}
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="flex items-center justify-center w-10 h-10 bg-primary text-white">
                                        <Icon className="w-5 h-5" />
                                    </div>
                                    <span className="text-xs font-bold uppercase tracking-widest text-primary">Step {currentStep.id}</span>
                                </div>
                                <h3 className="text-[28px] font-bold leading-snug text-secondary mb-6">
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
                                            <span key={t} className="bg-muted px-2 py-0.5 text-xs text-foreground border border-border">
                                                {t}
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Progress percentage indicator */}
                        <div className="absolute bottom-4 right-4 z-10">
                            <span ref={progressTextRef} className="text-[10px] font-mono font-bold text-primary/40">
                                0%
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
            </div>
        </section>
    );
}