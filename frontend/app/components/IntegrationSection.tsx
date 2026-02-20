"use client";

import { theme } from "../theme";
import { HiLightningBolt, HiDatabase, HiColorSwatch, HiCode } from "react-icons/hi";

const steps = [
    {
        id: "01",
        title: "Connect Your Data",
        description: "Upload PDFs, crawl your website, or connect to Notion and Google Drive. We'll sync your knowledge base automatically.",
        icon: HiDatabase,
        color: theme.colors.accent.blue,
    },
    {
        id: "02",
        title: "Train Your AI",
        description: "Our advanced RAG engine processes your data. Test and refine responses in our intuitive playground environment.",
        icon: HiLightningBolt,
        color: theme.colors.accent.yellow,
    },
    {
        id: "03",
        title: "Branding & Style",
        description: "Customize colors, logos, and chat behavior to match your brand identity perfectly. No 'Powered by' watermarks.",
        icon: HiColorSwatch,
        color: theme.colors.accent.purple,
    },
    {
        id: "04",
        title: "One-line Embed",
        description: "Copy and paste a single line of script into your website header. Works with React, Next.js, WordPress, and more.",
        icon: HiCode,
        color: theme.colors.accent.green,
    },
];

export default function IntegrationSection() {
    return (
        <section id="integration" className="py-24 bg-transparent overflow-hidden">
            <div className="max-w-7xl mx-auto px-6">
                <div className="text-center max-w-3xl mx-auto mb-20">
                    <h2
                        className="text-sm font-bold tracking-widest uppercase mb-3"
                        style={{ color: theme.colors.primary.main }}
                    >
                        Seamless Integration
                    </h2>
                    <h3
                        className="text-4xl md:text-5xl font-bold mb-6"
                        style={{ color: theme.colors.neutral[900] }}
                    >
                        From Knowledge to Live Chat <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
                            in 4 Simple Steps
                        </span>
                    </h3>
                    <p
                        className="text-lg"
                        style={{ color: theme.colors.neutral[600] }}
                    >
                        Deploy Mind makes it incredibly easy to deploy a custom AI chatbot that actually knows your business.
                        No complex setup, no coding required.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
                    {/* Connecting Line (Desktop) */}
                    <div className="hidden lg:block absolute top-1/2 left-0 w-full h-0.5 -translate-y-1/2 px-12 -z-10">
                        <div className="w-full h-full border-t border-dashed border-slate-200" />
                    </div>

                    {steps.map((step) => (
                        <div
                            key={step.id}
                            className="group relative bg-white p-8 rounded-2xl border transition-all hover:shadow-xl hover:-translate-y-1"
                            style={{ borderColor: theme.colors.neutral[200] }}
                        >
                            <div
                                className="w-16 h-16 rounded-xl flex items-center justify-center mb-6 shadow-sm group-hover:scale-110 transition-transform"
                                style={{ backgroundColor: `${step.color}15` }}
                            >
                                <step.icon className="text-3xl" style={{ color: step.color }} />
                            </div>

                            <div
                                className="text-xs font-bold font-mono mb-2"
                                style={{ color: step.color }}
                            >
                                STEP {step.id}
                            </div>

                            <h4
                                className="text-xl font-bold mb-3"
                                style={{ color: theme.colors.neutral[900] }}
                            >
                                {step.title}
                            </h4>

                            <p
                                className="text-sm leading-relaxed"
                                style={{ color: theme.colors.neutral[600] }}
                            >
                                {step.description}
                            </p>
                        </div>
                    ))}
                </div>

                {/* Code Snippet Visual */}
                <div className="mt-20 max-w-4xl mx-auto">
                    <div className="rounded-2xl overflow-hidden border shadow-2xl" style={{ borderColor: theme.colors.neutral[200] }}>
                        <div className="bg-slate-900 px-4 py-3 flex items-center justify-between">
                            <div className="flex gap-1.5">
                                <div className="w-3 h-3 rounded-full bg-red-400" />
                                <div className="w-3 h-3 rounded-full bg-amber-400" />
                                <div className="w-3 h-3 rounded-full bg-green-400" />
                            </div>
                            <div className="text-xs font-mono text-slate-400">index.html</div>
                            <div className="w-12" />
                        </div>
                        <div className="bg-slate-950 p-6 sm:p-8 font-mono text-sm leading-relaxed overflow-x-auto">
                            <div className="flex gap-4">
                                <span className="text-slate-600 select-none">1</span>
                                <span className="text-slate-300">{"<html>"}</span>
                            </div>
                            <div className="flex gap-4">
                                <span className="text-slate-600 select-none">2</span>
                                <span className="text-slate-300">{"  <head>"}</span>
                            </div>
                            <div className="flex gap-4">
                                <span className="text-slate-600 select-none">3</span>
                                <span className="text-blue-400 font-bold italic">{"    <!-- Add Deploy Mind AI -->"}</span>
                            </div>
                            <div className="flex gap-4">
                                <span className="text-slate-600 select-none">4</span>
                                <span className="text-slate-300">{"    <script "}
                                    <span className="text-purple-400">src</span>
                                    <span>=</span>
                                    <span className="text-green-400">"https://cdn.deploymind.ai/widget.js"</span>
                                    <span>{" async></script>"}</span>
                                </span>
                            </div>
                            <div className="flex gap-4">
                                <span className="text-slate-600 select-none">5</span>
                                <span className="text-slate-300">{"    <script>"}</span>
                            </div>
                            <div className="flex gap-4">
                                <span className="text-slate-600 select-none">6</span>
                                <span className="text-slate-300">{"      window.DeployMind.init({ "}
                                    <span className="text-purple-400">id</span>
                                    <span>: </span>
                                    <span className="text-green-400">"YOUR_CHATBOT_ID"</span>
                                    <span>{" });"}</span>
                                </span>
                            </div>
                            <div className="flex gap-4">
                                <span className="text-slate-600 select-none">7</span>
                                <span className="text-slate-300">{"    </script>"}</span>
                            </div>
                            <div className="flex gap-4">
                                <span className="text-slate-600 select-none">8</span>
                                <span className="text-slate-300">{"  </head>"}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
