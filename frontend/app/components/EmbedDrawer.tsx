"use client";
import { Check, Code, Copy, Cpu, Globe, Palette } from "lucide-react";


import { useState } from "react";
import { Button } from "@/components/ui/button";
import Drawer from "@/app/components/Drawer";

import showToast from "@/lib/toast";
import type { Chatbot } from "@/lib/types";
import { PRESET_COLORS } from "@/lib/constants";

interface EmbedDrawerProps {
    isOpen: boolean;
    onClose: () => void;
    chatbot: Chatbot;
}

type Position ="bottom-right" |"bottom-left";

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
            icon={Code}
            size="3xl"
            footer={
                <Button
                    onClick={onClose}
                    variant="outline"
                    className="font-medium bg-background h-10 px-8 border border-border text-muted-foreground transition-all hover:bg-muted"
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
                                <span className="w-5 h-5 bg-muted text-primary text-[10px] font-medium flex items-center justify-center">1</span>
                                <h3 className="text-sm font-medium text-foreground flex items-center gap-1.5">
                                    <Cpu className="w-4 h-4 text-muted-foreground" />
                                    Embed Token
                                </h3>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="flex-1 min-w-0 px-3 py-2 bg-muted border border-border font-mono text-[10px] text-muted-foreground truncate">
                                    {chatbot.embed_token}
                                </div>
                                <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={copyToken}
                                    className="bg-background border border-border text-muted-foreground hover:border-primary/50 transition-all h-8 w-8 p-0"
>
                                    {copiedToken ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                                </Button>
                            </div>
                        </section>

                        <section>
                            <div className="flex items-center gap-2 mb-3">
                                <span className="w-5 h-5 bg-muted text-primary text-[10px] font-medium flex items-center justify-center">2</span>
                                <h3 className="text-sm font-medium text-foreground flex items-center gap-1.5">
                                    <Palette className="w-4 h-4 text-muted-foreground" />
                                    Customise
                                </h3>
                            </div>
                            <div className="space-y-4">
                                <div>
                                    <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider mb-2">Brand Color</p>
                                    <div className="flex items-center gap-2 flex-wrap">
                                        {PRESET_COLORS.map((c) => (
                                            <button
                                                key={c.value}
                                                onClick={() => { setColor(c.value); setCustomColor(""); }}
                                                className="w-6 h-6 border-2 transition-transform hover:scale-110"
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
                                    <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider mb-2">Position</p>
                                    <div className="flex gap-2">
                                        {(["bottom-right","bottom-left"] as const).map((pos) => (
                                            <button
                                                key={pos}
                                                onClick={() => setPosition(pos)}
                                                className={`px-3 py-1.5 text-[10px] font-medium border transition-all ${position === pos ? "bg-muted border-border text-primary" : "bg-background border-border text-muted-foreground"}`}
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
                                <span className="w-5 h-5 bg-muted text-primary text-[10px] font-medium flex items-center justify-center">3</span>
                                <h3 className="text-sm font-medium text-foreground flex items-center gap-1.5">
                                    <Globe className="w-4 h-4 text-muted-foreground" />
                                    Preview
                                </h3>
                            </div>
                            <div className="relative h-48 rounded-xl bg-muted border border-border overflow-hidden shadow-inner font-sans">
                                <div className="h-7 bg-background border-b border-border flex items-center gap-1.5 px-3">
                                    <span className="w-2 h-2 rounded-full bg-red-400" />
                                    <span className="w-2 h-2 rounded-full bg-amber-400" />
                                    <span className="w-2 h-2 rounded-full bg-green-400" />
                                </div>
                                <div className="absolute bottom-3 right-3 flex flex-col items-end gap-1.5"
                                    style={{ left: position === "bottom-left" ? "12px" : "auto", right: position === "bottom-right" ? "12px" : "auto" }}>
                                    <div className="px-2 py-1.5 text-background text-[8px] font-medium shadow-md"
                                        style={{ background: activeColor }}>
                                        👋 Hi! I&apos;m {chatbot.name}
                                    </div>
                                    <div className="w-8 h-8 flex items-center justify-center shadow-lg"
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

                <section className="pt-4 border-t border-border">
                    <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                            <span className="w-5 h-5 bg-muted text-primary text-[10px] font-medium flex items-center justify-center">4</span>
                            <h3 className="text-sm font-medium text-foreground">Embed Code</h3>
                        </div>
                        <Button
                            size="sm"
                            onClick={copySnippet}
                            variant="secondary"
                            className={`text-xs font-medium transition-all ${copiedSnippet ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border-none" : "bg-muted text-primary hover:bg-muted border-none"}`}
>
                            {copiedSnippet ? <Check className="w-3.5 h-3.5 mr-2" /> : <Copy className="w-3.5 h-3.5 mr-2" />}
                            {copiedSnippet ? "Copied!" : "Copy Code"}
                        </Button>
                    </div>
                    <div className="bg-foreground overflow-hidden border border-border">
                        <pre className="px-4 py-4 text-[10px] text-emerald-300 font-mono overflow-x-auto whitespace-pre-wrap break-all">
                            <code>{snippet}</code>
                        </pre>
                    </div>
                </section>
            </div>
        </Drawer>
    );
}
