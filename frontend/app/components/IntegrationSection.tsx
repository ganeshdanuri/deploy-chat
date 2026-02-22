"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { theme } from "../theme";
import {
    HiClipboardCheck,
    HiClipboardCopy,
    HiCheckCircle,
    HiCode,
} from "react-icons/hi";
import {
    INTEGRATION_STEPS as STEPS,
    EMBED_SNIPPET,
    COMPATIBLE_TECHS,
    IntegrationStep as Step,
} from "../../lib/constants";

// ─── Copy Button ──────────────────────────────────────────────────────────────

function CopyButton({ text }: { text: string }) {
    const [copied, setCopied] = useState(false);

    const handleCopy = useCallback(async () => {
        try {
            await navigator.clipboard.writeText(text);
        } catch {
            const el = document.createElement("textarea");
            el.value = text;
            document.body.appendChild(el);
            el.select();
            document.execCommand("copy");
            document.body.removeChild(el);
        }
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    }, [text]);

    return (
        <button
            type="button"
            onClick={handleCopy}
            aria-label={copied ? "Copied to clipboard" : "Copy embed snippet"}
            className={`
        flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold
        border transition-all duration-200
        focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2
        ${copied
                    ? "border-slate-200 bg-blue-50"
                    : "border-slate-200 bg-white text-slate-600"
                }
      `}
            style={{
                ...(copied
                    ? { color: theme.colors.primary.main, borderColor: theme.colors.primary.lightest }
                    : {}),
                outline: undefined,
            }}
        >
            {copied ? (
                <>
                    <HiClipboardCheck className="h-3.5 w-3.5" aria-hidden="true" />
                    Copied!
                </>
            ) : (
                <>
                    <HiClipboardCopy className="h-3.5 w-3.5" aria-hidden="true" />
                    Copy snippet
                </>
            )}
        </button>
    );
}

// ─── Syntax Tokens ────────────────────────────────────────────────────────────

type Token = { type: "tag" | "attr" | "string" | "plain"; text: string };

const TOKEN_COLORS: Record<Token["type"], string> = {
    tag: theme.colors.primary.main,
    attr: "#0369a1", // sky-700
    string: "#059669", // emerald-600
    plain: "#475569", // slate-600
};

function tokenize(code: string): Token[][] {
    return code.split("\n").map((line) => {
        const tokens: Token[] = [];
        const regex = /(<\/?\w[\w.-]*>?|\/?>|[\w-]+=|"[^"]*"|'[^']*'|[\w-]+)/g;
        let lastIndex = 0;
        let match: RegExpExecArray | null;

        while ((match = regex.exec(line)) !== null) {
            if (match.index > lastIndex)
                tokens.push({ type: "plain", text: line.slice(lastIndex, match.index) });
            const t = match[0];
            if (t.startsWith("<") || t === "/>" || t === ">")
                tokens.push({ type: "tag", text: t });
            else if (t.endsWith("="))
                tokens.push({ type: "attr", text: t });
            else if (t.startsWith('"') || t.startsWith("'"))
                tokens.push({ type: "string", text: t });
            else
                tokens.push({ type: "plain", text: t });
            lastIndex = match.index + t.length;
        }

        if (lastIndex < line.length)
            tokens.push({ type: "plain", text: line.slice(lastIndex) });

        return tokens;
    });
}

function CodeBlock({ code }: { code: string }) {
    const lines = tokenize(code);
    return (
        <pre className="overflow-x-auto font-mono text-xs leading-6" aria-label="Embed snippet">
            {lines.map((tokens, li) => (
                <div key={li} className="table-row">
                    <span
                        className="table-cell w-8 select-none pr-5 text-right text-slate-300"
                        aria-hidden="true"
                    >
                        {li + 1}
                    </span>
                    <span className="table-cell">
                        {tokens.map((tok, ti) => (
                            <span key={ti} style={{ color: TOKEN_COLORS[tok.type] }}>
                                {tok.text}
                            </span>
                        ))}
                    </span>
                </div>
            ))}
        </pre>
    );
}

// ─── Step Row ─────────────────────────────────────────────────────────────────

function StepRow({ step, active }: { step: Step; active: boolean }) {
    const Icon = step.icon;
    return (
        <div
            className={`
        relative flex gap-5 rounded-xl border p-8 transition-all duration-300
        ${active
                    ? "bg-white shadow-md"
                    : "border-transparent hover:border-slate-100 hover:bg-white/60"
                }
      `}
            style={active ? { borderColor: `${theme.colors.primary.main}20`, boxShadow: `0 4px 6px -1px ${theme.colors.primary.main}15` } : {}}
        >
            {/* Active indicator rule */}
            {active && (
                <div
                    className="absolute left-0 top-1/2 h-8 w-0.5 -translate-y-1/2 rounded-r"
                    style={{ backgroundColor: theme.colors.primary.main }}
                    aria-hidden="true"
                />
            )}

            {/* Icon */}
            <div
                className={`
          mt-0.5 flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-lg border
          transition-all duration-300
          ${active
                        ? ""
                        : "border-slate-100 bg-white text-slate-400"
                    }
        `}
                style={active ? { borderColor: `${theme.colors.primary.main}20`, backgroundColor: `${theme.colors.primary.main}10`, color: theme.colors.primary.main } : {}}
            >
                <Icon className="h-5 w-5" />
            </div>

            {/* Text */}
            <div className="min-w-0">
                <div
                    className={`mb-1 text-[10px] font-bold uppercase tracking-widest ${active ? "" : "text-slate-400"
                        }`}
                    style={active ? { color: theme.colors.primary.main } : {}}
                >
                    Step {step.id}
                </div>
                <h3
                    className={`mb-1 text-base font-semibold leading-snug ${active ? "text-slate-900" : "text-slate-400"
                        }`}
                >
                    {step.title}
                </h3>
                <p
                    className={`text-sm leading-relaxed ${active ? "text-slate-500" : "text-slate-400"
                        }`}
                >
                    {step.description}
                </p>
            </div>
        </div>
    );
}

// ─── Main ─────────────────────────────────────────────────────────────────────

export default function IntegrationSection() {
    const stepsRef = useRef<HTMLDivElement>(null);
    const [activeStep, setActiveStep] = useState(0);

    useEffect(() => {
        const container = stepsRef.current;
        if (!container) return;

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting)
                        setActiveStep(Number((entry.target as HTMLElement).dataset.index));
                });
            },
            { rootMargin: "-38% 0px -38% 0px", threshold: 0 }
        );

        container.querySelectorAll("[data-index]").forEach((el) => observer.observe(el));
        return () => observer.disconnect();
    }, []);

    return (
        <section
            id="integration"
            aria-labelledby="integration-heading"
            className="relative overflow-hidden bg-slate-50 py-20 sm:py-24"
        >
            {/* Decorative blob — mirrors pricing section */}
            <div
                className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
                aria-hidden="true"
            >
                <div
                    className="relative left-[calc(50%+11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] opacity-10 sm:w-[72.1875rem]"
                    style={{
                        background: `linear-gradient(to top right, ${theme.colors.primary.main}, ${theme.colors.accent.purple})`,
                        clipPath:
                            "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
                    }}
                />
            </div>

            <div className="relative mx-auto max-w-7xl px-6 lg:px-8">

                {/* Section header — same structure as pricing */}
                <div className="mx-auto mb-16 max-w-2xl text-center">
                    <div
                        className="mb-4 inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-bold uppercase tracking-widest"
                        style={{ borderColor: `${theme.colors.primary.main}20`, backgroundColor: `${theme.colors.primary.main}10`, color: theme.colors.primary.main }}
                    >
                        <HiCode className="h-3.5 w-3.5" aria-hidden="true" />
                        Integration
                    </div>
                    <h2
                        id="integration-heading"
                        className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl"
                    >
                        Live on your site in{" "}
                        <span style={{ color: theme.colors.primary.main }}>four steps</span>
                    </h2>
                    <p className="mt-4 text-lg leading-relaxed text-slate-600">
                        No SDK to install. No build step. Paste one HTML snippet and your AI support widget is live instantly.
                    </p>
                </div>

                {/* Two-column body */}
                <div className="flex flex-col gap-10 lg:flex-row lg:items-start lg:gap-16">

                    {/* Left: Steps */}
                    <div ref={stepsRef} className="flex flex-col gap-2 lg:w-[44%]">
                        {STEPS.map((step, idx) => (
                            <div key={step.id} data-index={idx}>
                                <StepRow step={step} active={activeStep === idx} />
                            </div>
                        ))}
                    </div>

                    {/* Right: Sticky code editor */}
                    <div className="lg:w-[56%]">
                        <div className="lg:sticky lg:top-28">

                            {/* Editor card — same rounded-2xl / border / shadow-xl treatment as pricing */}
                            <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl shadow-slate-200/50">

                                {/* Title bar */}
                                <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50 px-5 py-3">
                                    <div className="flex items-center gap-1.5">
                                        <div className="h-2.5 w-2.5 rounded-full bg-slate-200" aria-hidden="true" />
                                        <div className="h-2.5 w-2.5 rounded-full bg-slate-200" aria-hidden="true" />
                                        <div className="h-2.5 w-2.5 rounded-full bg-slate-200" aria-hidden="true" />
                                    </div>
                                    <div className="flex items-center gap-3 text-xs text-slate-400">
                                        <span className="font-mono">index.html</span>
                                        <span className="h-3 w-px bg-slate-200" aria-hidden="true" />
                                        <span className="flex items-center gap-1.5 font-semibold" style={{ color: theme.colors.primary.main }}>
                                            <span
                                                className="h-1.5 w-1.5 rounded-full"
                                                style={{ backgroundColor: theme.colors.primary.main }}
                                                aria-hidden="true"
                                            />
                                            Ready to embed
                                        </span>
                                    </div>
                                </div>

                                {/* Dimmed context — above snippet */}
                                <div className="border-b border-slate-100 bg-slate-50/80 px-5 py-3 font-mono text-xs leading-6 text-slate-300">
                                    <div>{"<head>"}</div>
                                    <div className="pl-4">{'<meta charset="UTF-8" />'}</div>
                                    <div className="pl-4">{"<title>Your Website</title>"}</div>
                                    <div className="pl-4 pt-0.5 italic">
                                        {"<!-- ↓ paste your DeployChat widget ↓ -->"}
                                    </div>
                                </div>

                                {/* Highlighted snippet */}
                                <div className="relative px-5 py-5" style={{ borderLeft: `2px solid ${theme.colors.primary.main}`, backgroundColor: `${theme.colors.primary.main}0a` }}>
                                    <div className="absolute right-4 top-4">
                                        <CopyButton text={EMBED_SNIPPET} />
                                    </div>
                                    <CodeBlock code={EMBED_SNIPPET} />
                                </div>

                                {/* Dimmed context — below snippet */}
                                <div className="border-t border-slate-100 bg-slate-50/80 px-5 py-3 font-mono text-xs leading-6 text-slate-300">
                                    <div>{"</head>"}</div>
                                    <div>{"<body>..."}</div>
                                </div>

                                {/* Footer status bar */}
                                <div className="flex items-center justify-between border-t border-slate-100 bg-slate-50 px-5 py-3">
                                    <div className="flex items-center gap-4 font-mono text-[10px] text-slate-400">
                                        <span>HTML</span>
                                        <span>UTF-8</span>
                                        <span>Ln 4, Col 1</span>
                                    </div>
                                    <div className="flex items-center gap-1.5 text-[10px] font-semibold" style={{ color: theme.colors.primary.main }}>
                                        <HiCheckCircle className="h-3.5 w-3.5" aria-hidden="true" />
                                        No build step required
                                    </div>
                                </div>
                            </div>

                            {/* Compatibility chips */}
                            <div className="mt-5 flex flex-wrap items-center gap-2 px-1">
                                <span className="text-xs text-slate-400">Works with:</span>
                                {COMPATIBLE_TECHS.map((tech) => (
                                    <span
                                        key={tech}
                                        className="rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs font-medium text-slate-600 shadow-sm"
                                    >
                                        {tech}
                                    </span>
                                ))}
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}