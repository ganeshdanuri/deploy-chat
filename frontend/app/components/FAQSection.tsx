"use client";

import { useState, useEffect, useRef } from "react";
import { HiPlus, HiMinus, HiQuestionMarkCircle } from "react-icons/hi";

// ── dot-matrix decorative figure (ASCII art blob like screenshot) ──────────
const DOT_ART = `
        . : : : : . .
      . : : : : : : : .
    . : : [::::::] : : : .
   . : : [::::::::] : : : .
  . : : [::::::::::] : : .
  . : : [:::::[::]:] : : .
  . : : [:::::[::]:] : : .
   . : : [::::::::::] : : .
    . : : : : : : : : : .
      . . : : : : : . .
        . . . . . . .
         . . . . . .
          . . . . .
           . . . .
            . . .
             . .
              .
`.trim();

// Realistic ASCII-art humanoid figure matching the screenshot
const ASCII_FIGURE = `
         1 1 1 1 1 1 1
        1 1 1 1 1 1 1 1
       1 1 [::::::] 1 1 1
      1 1 [::::::::] 1 1 1
     1 1 [::::::::::] 1 1
     1 1 1 [::::::] 1 1 1
      1 1 1 [::::] 1 1 1
       1 1 [::::::] 1 1
        1 1 1 1 1 1 1
         1 1 1 1 1 1
          1 1 1 1 1
           1 1 1 1
            1 1 1
             1 1
              1
`.trim();

// Generate dot-matrix grid art that looks like the screenshot
function DotMatrixFigure() {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        const W = canvas.width;
        const H = canvas.height;
        ctx.clearRect(0, 0, W, H);

        const dotSize = 2.5;
        const gap = 8;
        const cols = Math.floor(W / gap);
        const rows = Math.floor(H / gap);

        // Define a humanoid silhouette using a parametric approach
        function inSilhouette(x, y) {
            const cx = cols / 2;
            const cy = rows / 2;
            const nx = (x - cx) / (cols * 0.25);
            const ny = (y - cy) / (rows * 0.38);

            // Head
            if (Math.sqrt(Math.pow(nx, 2) + Math.pow(ny + 0.55, 2)) < 0.22) return true;
            // Neck
            if (Math.abs(nx) < 0.08 && ny > -0.33 && ny < -0.22) return true;
            // Torso
            if (Math.abs(nx) < 0.35 && ny > -0.22 && ny < 0.3) {
                const taper = 0.35 - Math.abs(ny - 0.04) * 0.15;
                if (Math.abs(nx) < taper) return true;
            }
            // Left arm
            if (nx > 0.28 && nx < 0.55 && ny > -0.2 && ny < 0.32) {
                const armTaper = 0.18 - (ny - 0.05) * 0.1;
                if (Math.abs(nx - 0.38) < armTaper + 0.05) return true;
            }
            // Right arm
            if (nx < -0.28 && nx > -0.55 && ny > -0.2 && ny < 0.32) {
                const armTaper = 0.18 - (ny - 0.05) * 0.1;
                if (Math.abs(nx + 0.38) < armTaper + 0.05) return true;
            }
            // Left leg
            if (nx > 0.05 && nx < 0.32 && ny > 0.28 && ny < 0.85) {
                const legTaper = 0.17 - (ny - 0.3) * 0.06;
                if (Math.abs(nx - 0.18) < legTaper + 0.04) return true;
            }
            // Right leg
            if (nx < -0.05 && nx > -0.32 && ny > 0.28 && ny < 0.85) {
                const legTaper = 0.17 - (ny - 0.3) * 0.06;
                if (Math.abs(nx + 0.18) < legTaper + 0.04) return true;
            }
            return false;
        }

        for (let row = 0; row < rows; row++) {
            for (let col = 0; col < cols; col++) {
                if (inSilhouette(col, row)) {
                    const px = col * gap + gap / 2;
                    const py = row * gap + gap / 2;

                    // vary opacity slightly for texture
                    const alpha = 0.35 + Math.random() * 0.45;
                    ctx.fillStyle = `rgba(38, 46, 242, ${alpha})`;
                    ctx.beginPath();
                    ctx.arc(px, py, dotSize * (0.7 + Math.random() * 0.5), 0, Math.PI * 2);
                    ctx.fill();
                }
            }
        }
    }, []);

    return (
        <canvas
            ref={canvasRef}
            width={280}
            height={340}
            className="opacity-80"
            style={{ imageRendering: "pixelated" }}
        />
    );
}

// Default FAQs — replace with your FAQS import
const DEFAULT_FAQS = [
    { question: "What is an AI agent?", answer: "An AI agent is a system that can plan, decide, and execute tasks on its own. It completes multi-step work end-to-end with minimal human input." },
    { question: "Do I need coding skills?", answer: "No coding skills are required. Our platform is designed for non-technical users to build and deploy AI agents through a simple visual interface." },
    { question: "How accurate are the agents?", answer: "Our agents achieve high accuracy by combining large language models with structured workflows and human-in-the-loop checkpoints for critical decisions." },
    { question: "Can I integrate my existing tools?", answer: "Yes. We support integrations with popular tools like Slack, Notion, Google Workspace, HubSpot, and more via native connectors and Zapier." },
    { question: "Is my data safe?", answer: "Absolutely. All data is encrypted in transit and at rest. We are SOC 2 Type II compliant and never train on your data." },
    { question: "Can I create multiple agents?", answer: "Yes. Depending on your plan, you can create and run multiple agents simultaneously across different workflows." },
    { question: "Does it work for teams?", answer: "Yes. Our Team and Enterprise plans include shared workspaces, role-based access controls, and audit logs." },
    { question: "What can agents automate?", answer: "Agents can automate research, data entry, outreach, report generation, customer support triage, scheduling, and much more." },
    { question: "How fast can I get started?", answer: "You can have your first agent running in under 10 minutes. We provide pre-built templates for the most common use cases." },
    { question: "Do agents replace my team?", answer: "No. Agents augment your team by handling repetitive tasks, freeing people to focus on higher-value, creative, and strategic work." },
];

export default function FAQSection({ faqs = DEFAULT_FAQS }) {
    const [openIndex, setOpenIndex] = useState(0);

    return (
        <section
            id="faq"
            aria-labelledby="faq-heading"
            className="relative overflow-hidden py-0"
        >
            {/* Subtle dot grid background */}
            <div
                className="absolute inset-0 pointer-events-none"
            />

            <div className="relative mx-auto max-w-7xl flex min-h-[700px]">
                {/* ── LEFT PANEL ── */}
                <div
                    className="relative flex flex-col justify-between px-10 py-14"
                    style={{
                        width: "42%",
                        borderRight: "1px solid #e2e2dc",
                    }}
                >
                    {/* Corner decorations */}
                    <span className="absolute top-4 left-4 text-[#b0b0a8] text-xs tracking-widest select-none">〈〈</span>
                    <span className="absolute top-4 right-4 text-[#b0b0a8] text-xs tracking-widest select-none">〉〉</span>
                    <span className="absolute bottom-4 left-4 text-[#b0b0a8] text-xs tracking-widest select-none">○</span>
                    <span className="absolute bottom-4 right-4 text-[#b0b0a8] text-xs tracking-widest select-none">○</span>

                    <div>
                        {/* FAQ badge */}
                        <div className="flex items-center gap-2 mb-6">
                            <span className="text-[#b0b0a8] text-sm select-none">〈〈</span>
                            <div className="flex items-center gap-1.5 bg-white border border-[#e2e2dc] rounded-full px-3 py-1">
                                <div className="w-4 h-4 rounded-full border-2 border-[#4040e0] flex items-center justify-center">
                                    <span className="text-[#4040e0] text-[8px] font-bold">?</span>
                                </div>
                                <span className="text-xs font-medium text-[#4a4a4a] tracking-wide">FAQ</span>
                            </div>
                            <span className="text-[#b0b0a8] text-sm select-none">〉〉</span>
                        </div>

                        {/* Heading */}
                        <h2
                            id="faq-heading"
                            className="text-[42px] font-semibold leading-tight tracking-tight text-[#1a1a2e] mb-4"
                        >
                            Frequently Asked Questions
                        </h2>

                        <p className="text-[15px] text-[#888880] leading-relaxed">
                            Everything you need to know before getting started.
                        </p>
                    </div>

                    {/* Dot-matrix figure */}
                    <div className="flex justify-center items-end mt-8 mb-4">
                        <DotMatrixFigure />
                    </div>
                </div>

                {/* ── RIGHT PANEL ── */}
                <div className="flex-1 py-6">
                    <dl>
                        {faqs.map((faq, i) => {
                            const isOpen = openIndex === i;
                            const isLast = i === faqs.length - 1;
                            return (
                                <div
                                    key={i}
                                    style={{
                                        borderBottom: isLast ? "none" : "1px solid #e2e2dc",
                                    }}
                                >
                                    <dt>
                                        <button
                                            type="button"
                                            onClick={() => setOpenIndex(isOpen ? null : i)}
                                            aria-expanded={isOpen}
                                            aria-controls={`faq-answer-${i}`}
                                            className="flex w-full items-center justify-between gap-4 text-left px-8 py-5 hover:bg-white/40 transition-colors duration-150"
                                        >
                                            <span
                                                className={`text-[17px] font-medium leading-snug transition-colors duration-200 ${isOpen ? "text-[#1a1a2e]" : "text-[#1a1a2e]"
                                                    }`}
                                            >
                                                {faq.question}
                                            </span>
                                            <span
                                                className="flex-shrink-0 w-5 h-5 flex items-center justify-center text-[#888880]"
                                                aria-hidden="true"
                                            >
                                                {isOpen ? (
                                                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                                                        <path d="M2 7h10" stroke="#888880" strokeWidth="1.5" strokeLinecap="round" />
                                                    </svg>
                                                ) : (
                                                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                                                        <path d="M7 2v10M2 7h10" stroke="#888880" strokeWidth="1.5" strokeLinecap="round" />
                                                    </svg>
                                                )}
                                            </span>
                                        </button>
                                    </dt>
                                    <dd
                                        id={`faq-answer-${i}`}
                                        role="region"
                                        aria-hidden={!isOpen}
                                        className={`grid transition-all duration-300 ease-in-out ${isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                                            }`}
                                    >
                                        <div className="overflow-hidden">
                                            <p className="px-8 pb-5 text-[15px] leading-relaxed text-[#5a5a5a]">
                                                {faq.answer}
                                            </p>
                                        </div>
                                    </dd>
                                </div>
                            );
                        })}
                    </dl>
                </div>
            </div>
        </section>
    );
}