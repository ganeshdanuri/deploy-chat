"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
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
import { PRESET_COLORS } from "@/lib/constants";

interface EmbedDrawerProps {
    isOpen: boolean;
    onClose: () => void;
    chatbot: Chatbot;
}

type Position = "bottom-right" | "bottom-left";

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
        if (typeof navigator !== "undefined" && navigator.clipboard) {
            navigator.clipboard.writeText(snippet).then(() => {
                setCopiedSnippet(true);
                showToast.success("Embed code copied!");
                setTimeout(() => setCopiedSnippet(false), 2000);
            });
        }
    }

    function copyToken() {
        if (typeof navigator !== "undefined" && navigator.clipboard) {
            navigator.clipboard.writeText(chatbot.embed_token).then(() => {
                setCopiedToken(true);
                showToast.success("Embed token copied!");
                setTimeout(() => setCopiedToken(false), 2000);
            });
        }
    }

    return (
        <Drawer
            isOpen={isOpen}
            onClose={onClose}
            title="Embed on Website"
            subtitle={`Paste the code snippet below into your site's HTML to add ${chatbot.name}`}
            icon={HiCode}
            size="3xl"
            footer={
                <Button
                    onClick={onClose}
                    variant="outline"
                    className="font-medium bg-white rounded-lg h-10 px-8 border border-slate-100 text-slate-600 shadow-sm transition-all hover:bg-slate-50"
                >
                    Close
                </Button>
            }
        >
            <div className="space-y-7 animate-fade-in">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-7">
                        <section>
                            <div className="flex items-center gap-2 mb-3">
                                <span className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-700 text-[10px] font-bold flex items-center justify-center">1</span>
                                <h3 className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
                                    <HiChip className="w-4 h-4 text-slate-400" />
                                    Embed Token
                                </h3>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="flex-1 min-w-0 px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 font-mono text-[10px] text-slate-600 truncate">
                                    {chatbot.embed_token}
                                </div>
                                <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={copyToken}
                                    className="bg-white border border-slate-200 text-slate-500 rounded-lg hover:border-indigo-300 transition-all h-8 w-8 p-0"
                                >
                                    {copiedToken ? <HiCheck className="w-4 h-4 text-green-500" /> : <HiClipboardCopy className="w-4 h-4" />}
                                </Button>
                            </div>
                        </section>

                        <section>
                            <div className="flex items-center gap-2 mb-3">
                                <span className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-700 text-[10px] font-bold flex items-center justify-center">2</span>
                                <h3 className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
                                    <HiColorSwatch className="w-4 h-4 text-slate-400" />
                                    Customise
                                </h3>
                            </div>
                            <div className="space-y-4">
                                <div>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Brand Color</p>
                                    <div className="flex items-center gap-2 flex-wrap">
                                        {PRESET_COLORS.map((c) => (
                                            <button
                                                key={c.value}
                                                onClick={() => { setColor(c.value); setCustomColor(""); }}
                                                className="w-6 h-6 rounded-full border-2 transition-transform hover:scale-110"
                                                style={{
                                                    background: c.value,
                                                    borderColor: (customColor === "" && color === c.value) ? "#fff" : "transparent",
                                                    boxShadow: (customColor === "" && color === c.value) ? `0 0 0 2px ${c.value}` : "none",
                                                }}
                                            />
                                        ))}
                                    </div>
                                </div>
                                <div>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Position</p>
                                    <div className="flex gap-2">
                                        {(["bottom-right", "bottom-left"] as const).map((pos) => (
                                            <button
                                                key={pos}
                                                onClick={() => setPosition(pos)}
                                                className={`px-3 py-1.5 rounded-lg text-[10px] font-bold border transition-all ${position === pos ? "bg-indigo-50 border-indigo-300 text-indigo-700" : "bg-white border-slate-200 text-slate-500"}`}
                                            >
                                                {pos === "bottom-right" ? "↘ Right" : "↙ Left"}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </section>
                    </div>

                    <div className="space-y-7">
                        <section>
                            <div className="flex items-center gap-2 mb-3">
                                <span className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-700 text-[10px] font-bold flex items-center justify-center">3</span>
                                <h3 className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
                                    <HiGlobe className="w-4 h-4 text-slate-400" />
                                    Preview
                                </h3>
                            </div>
                            <div className="relative h-48 rounded-xl bg-slate-50 border border-slate-200 overflow-hidden shadow-inner font-sans">
                                <div className="h-7 bg-white border-b border-slate-200 flex items-center gap-1.5 px-3">
                                    <span className="w-2 h-2 rounded-full bg-red-400" />
                                    <span className="w-2 h-2 rounded-full bg-amber-400" />
                                    <span className="w-2 h-2 rounded-full bg-green-400" />
                                </div>
                                <div className="absolute bottom-3 right-3 flex flex-col items-end gap-1.5"
                                    style={{ left: position === "bottom-left" ? "12px" : "auto", right: position === "bottom-right" ? "12px" : "auto" }}>
                                    <div className="px-2 py-1.5 rounded-lg text-white text-[8px] font-bold shadow-md"
                                        style={{ background: activeColor }}>
                                        👋 Hi! I&apos;m {chatbot.name}
                                    </div>
                                    <div className="w-8 h-8 rounded-full flex items-center justify-center shadow-lg"
                                        style={{ background: activeColor }}>
                                        <svg className="w-4 h-4 fill-white" viewBox="0 0 24 24">
                                            <path d="M20 2H4a2 2 0 00-2 2v18l4-4h14a2 2 0 002-2V4a2 2 0 00-2-2zm-2 10H6v-2h12v2zm0-4H6V6h12v2z" />
                                        </svg>
                                    </div>
                                </div>
                            </div>
                        </section>
                    </div>
                </div>

                <section className="pt-4 border-t border-slate-100">
                    <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                            <span className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-700 text-[10px] font-bold flex items-center justify-center">4</span>
                            <h3 className="text-sm font-bold text-slate-800">Embed Code</h3>
                        </div>
                        <Button
                            size="sm"
                            onClick={copySnippet}
                            variant="secondary"
                            className={`text-xs font-bold rounded-lg transition-all ${copiedSnippet ? "bg-green-50 text-green-700 hover:bg-green-100" : "bg-indigo-50 text-indigo-700 hover:bg-indigo-100"}`}
                        >
                            {copiedSnippet ? <HiCheck className="w-3.5 h-3.5 mr-2" /> : <HiClipboardCopy className="w-3.5 h-3.5 mr-2" />}
                            {copiedSnippet ? "Copied!" : "Copy Code"}
                        </Button>
                    </div>
                    <div className="rounded-xl bg-slate-900 overflow-hidden">
                        <pre className="px-4 py-4 text-[10px] text-emerald-300 font-mono overflow-x-auto whitespace-pre-wrap break-all">
                            <code>{snippet}</code>
                        </pre>
                    </div>
                </section>
            </div>
        </Drawer>
    );
}
