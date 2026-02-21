"use client";

import { useState } from "react";
import { Button } from "@heroui/react";
import Drawer from "@/app/components/Drawer";
import {
    HiCode,
    HiClipboardCopy,
    HiCheck,
    HiExternalLink,
    HiColorSwatch,
    HiChip,
    HiGlobe,
} from "react-icons/hi";
import showToast from "@/lib/toast";
import type { Chatbot } from "@/lib/types";

// ─── Types ─────────────────────────────────────────────────────────────────────

interface EmbedDrawerProps {
    isOpen: boolean;
    onClose: () => void;
    chatbot: Chatbot;
}

type Position = "bottom-right" | "bottom-left";

// ─── Helpers ───────────────────────────────────────────────────────────────────

const PRESET_COLORS = [
    { label: "Indigo", value: "#4f46e5" },
    { label: "Violet", value: "#7c3aed" },
    { label: "Rose", value: "#e11d48" },
    { label: "Sky", value: "#0284c7" },
    { label: "Teal", value: "#0d9488" },
    { label: "Amber", value: "#d97706" },
    { label: "Slate", value: "#334155" },
];

function buildSnippet(token: string, color: string, position: Position, apiBase: string) {
    return `<script
  src="${apiBase}/widget.js"
  data-token="${token}"
  data-api="http://localhost:8000"
  data-color="${color}"
  data-position="${position}"
  defer
></script>`;
}

// ─── Component ─────────────────────────────────────────────────────────────────

export default function EmbedDrawer({ isOpen, onClose, chatbot }: EmbedDrawerProps) {
    const [copiedSnippet, setCopiedSnippet] = useState(false);
    const [copiedToken, setCopiedToken] = useState(false);
    const [color, setColor] = useState(PRESET_COLORS[0].value);
    const [customColor, setCustomColor] = useState("");
    const [position, setPosition] = useState<Position>("bottom-right");

    const activeColor = customColor || color;
    const apiBase = typeof window !== "undefined" ? window.location.origin : "http://localhost:3000";
    const snippet = buildSnippet(chatbot.embed_token, activeColor, position, apiBase);

    function copySnippet() {
        navigator.clipboard.writeText(snippet).then(() => {
            setCopiedSnippet(true);
            showToast.success("Embed code copied!");
            setTimeout(() => setCopiedSnippet(false), 2000);
        });
    }

    function copyToken() {
        navigator.clipboard.writeText(chatbot.embed_token).then(() => {
            setCopiedToken(true);
            showToast.success("Embed token copied!");
            setTimeout(() => setCopiedToken(false), 2000);
        });
    }

    return (
        <Drawer
            isOpen={isOpen}
            onClose={onClose}
            title="Embed on Website"
            subtitle={`Paste the code snippet below into your site's HTML to add ${chatbot.name}`}
            icon={HiCode}
            iconColor="text-indigo-600"
            iconBgColor="bg-indigo-50"
        >
            <div className="space-y-7">
                {/* ── Step 1 — Token ─────────────────────────────────────── */}
                <section>
                    <div className="flex items-center gap-2 mb-3">
                        <span className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-700 text-[10px] font-bold flex items-center justify-center">1</span>
                        <h3 className="text-xl font-semibold text-slate-800 flex items-center gap-1.5">
                            <HiChip className="w-4 h-4 text-slate-400" />
                            Embed Token
                        </h3>
                    </div>
                    <p className="text-xs text-slate-500 mb-2.5 leading-relaxed">
                        This unique token identifies your chatbot. Keep it private — only embed it on sites you trust.
                    </p>
                    <div className="flex items-center gap-2">
                        <div className="flex-1 min-w-0 px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 font-mono text-xs text-slate-600 truncate select-all">
                            {chatbot.embed_token}
                        </div>
                        <Button
                            size="sm"
                            isIconOnly
                            onPress={copyToken}
                            className="bg-white border border-slate-200 text-slate-500 hover:text-indigo-600 hover:border-indigo-300 rounded-lg"
                        >
                            {copiedToken ? <HiCheck className="w-4 h-4 text-green-500" /> : <HiClipboardCopy className="w-4 h-4" />}
                        </Button>
                    </div>
                </section>

                {/* ── Step 2 — Customise ─────────────────────────────────── */}
                <section>
                    <div className="flex items-center gap-2 mb-3">
                        <span className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-700 text-[10px] font-bold flex items-center justify-center">2</span>
                        <h3 className="text-xl font-semibold text-slate-800 flex items-center gap-1.5">
                            <HiColorSwatch className="w-4 h-4 text-slate-400" />
                            Customise
                        </h3>
                    </div>

                    <div className="space-y-4">
                        {/* Colour picker */}
                        <div>
                            <p className="text-xs font-medium text-slate-600 mb-2">Brand Color</p>
                            <div className="flex items-center gap-2 flex-wrap">
                                {PRESET_COLORS.map((c) => (
                                    <button
                                        key={c.value}
                                        title={c.label}
                                        onClick={() => { setColor(c.value); setCustomColor(""); }}
                                        className="w-7 h-7 rounded-full border-2 transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-indigo-500"
                                        style={{
                                            background: c.value,
                                            borderColor: (customColor === "" && color === c.value) ? "#fff" : "transparent",
                                            boxShadow: (customColor === "" && color === c.value) ? `0 0 0 2px ${c.value}` : "none",
                                        }}
                                    />
                                ))}
                                {/* Custom color input */}
                                <div className="flex items-center gap-1.5 ml-1">
                                    <input
                                        type="color"
                                        value={customColor || color}
                                        onChange={(e) => setCustomColor(e.target.value)}
                                        className="w-7 h-7 rounded-full cursor-pointer border border-slate-200 p-0.5"
                                        title="Custom color"
                                    />
                                    <span className="text-[10px] text-slate-400 font-mono">{activeColor}</span>
                                </div>
                            </div>
                        </div>

                        {/* Position picker */}
                        <div>
                            <p className="text-xs font-medium text-slate-600 mb-2">Position</p>
                            <div className="flex gap-2">
                                {(["bottom-right", "bottom-left"] as const).map((pos) => (
                                    <button
                                        key={pos}
                                        onClick={() => setPosition(pos)}
                                        className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${position === pos
                                            ? "bg-indigo-50 border-indigo-300 text-indigo-700"
                                            : "bg-white border-slate-200 text-slate-500 hover:border-slate-300"
                                            }`}
                                    >
                                        {pos === "bottom-right" ? "↘ Bottom Right" : "↙ Bottom Left"}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                {/* ── Live Preview ─────────────────────────────────────────── */}
                <section>
                    <div className="flex items-center gap-2 mb-3">
                        <span className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-700 text-[10px] font-bold flex items-center justify-center">3</span>
                        <h3 className="text-xl font-semibold text-slate-800 flex items-center gap-1.5">
                            <HiGlobe className="w-4 h-4 text-slate-400" />
                            Preview
                        </h3>
                    </div>
                    <div className="relative h-44 rounded-xl bg-gradient-to-br from-slate-100 to-slate-200 border border-slate-200 overflow-hidden">
                        {/* Fake browser chrome */}
                        <div className="h-8 bg-white border-b border-slate-200 flex items-center gap-1.5 px-3">
                            <span className="w-2.5 h-2.5 rounded-full bg-red-400" />
                            <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                            <span className="w-2.5 h-2.5 rounded-full bg-green-400" />
                            <div className="ml-3 flex-1 h-4 bg-slate-100 rounded-sm" />
                        </div>
                        {/* Fake page content */}
                        <div className="p-4 space-y-2">
                            <div className="h-2 bg-slate-300 rounded w-3/4" />
                            <div className="h-2 bg-slate-300 rounded w-1/2" />
                            <div className="h-2 bg-slate-200 rounded w-5/6" />
                        </div>
                        {/* Chat bubble preview */}
                        <div
                            className="absolute bottom-3 right-3 flex flex-col items-end gap-1.5"
                            style={{ left: position === "bottom-left" ? "12px" : "auto", right: position === "bottom-right" ? "12px" : "auto" }}
                        >
                            {/* Mini chat pop */}
                            <div className="px-3 py-2 rounded-xl text-white text-[10px] font-medium shadow-md max-w-[130px] leading-snug"
                                style={{ background: activeColor }}>
                                👋 Hi! I&apos;m {chatbot.name}
                            </div>
                            {/* Bubble */}
                            <div
                                className="w-10 h-10 rounded-full flex items-center justify-center shadow-lg"
                                style={{ background: activeColor }}
                            >
                                <svg className="w-5 h-5 fill-white" viewBox="0 0 24 24">
                                    <path d="M20 2H4a2 2 0 00-2 2v18l4-4h14a2 2 0 002-2V4a2 2 0 00-2-2zm-2 10H6v-2h12v2zm0-4H6V6h12v2z" />
                                </svg>
                            </div>
                        </div>
                    </div>
                </section>

                {/* ── Step 4 — Code Snippet ─────────────────────────────────── */}
                <section>
                    <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                            <span className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-700 text-[10px] font-bold flex items-center justify-center">4</span>
                            <h3 className="text-xl font-semibold text-slate-800">Embed Code</h3>
                        </div>
                        <Button
                            size="sm"
                            onPress={copySnippet}
                            startContent={copiedSnippet ? <HiCheck className="w-3.5 h-3.5" /> : <HiClipboardCopy className="w-3.5 h-3.5" />}
                            className={`text-xs font-medium rounded-lg transition-all ${copiedSnippet
                                ? "bg-green-50 border border-green-300 text-green-700"
                                : "bg-indigo-50 border border-indigo-200 text-indigo-700 hover:bg-indigo-100"
                                }`}
                        >
                            {copiedSnippet ? "Copied!" : "Copy Code"}
                        </Button>
                    </div>
                    <div className="relative rounded-xl bg-slate-900 overflow-hidden">
                        <div className="flex items-center gap-1.5 px-4 py-2.5 border-b border-slate-700/60">
                            <span className="text-[10px] text-slate-400 font-mono">HTML</span>
                            <span className="ml-auto text-[10px] text-slate-500">Paste before &lt;/body&gt;</span>
                        </div>
                        <pre className="px-4 py-4 text-[12px] text-emerald-300 font-mono leading-relaxed overflow-x-auto whitespace-pre-wrap break-all">
                            <code>{snippet}</code>
                        </pre>
                    </div>
                </section>

                {/* ── Instructions ─────────────────────────────────────────── */}
                <section className="rounded-xl bg-amber-50 border border-amber-100 p-4 space-y-2">
                    <p className="text-xs font-semibold text-amber-800 flex items-center gap-1.5">
                        <HiExternalLink className="w-3.5 h-3.5" />
                        How to add to your website
                    </p>
                    <ol className="text-xs text-amber-700 space-y-1.5 list-decimal list-inside leading-relaxed">
                        <li>Copy the embed code above</li>
                        <li>Open your website&apos;s HTML file or CMS template</li>
                        <li>Paste the code just before the closing <code className="bg-amber-100 px-1 rounded font-mono">&lt;/body&gt;</code> tag</li>
                        <li>Save and publish your site — the chat bubble will appear!</li>
                    </ol>
                </section>
            </div>
        </Drawer>
    );
}
