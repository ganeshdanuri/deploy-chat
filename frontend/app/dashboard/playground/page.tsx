"use client";
import {
    Bot,
    MessagesSquare,
    RefreshCw,
    Send,
    Settings2,
    Sparkles,
    Thermometer,
    User,
    Zap,
} from "lucide-react";


import { useEffect, useRef, useState } from "react";

import { useSearchParams, useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { fetchChatbots } from "@/lib/store/slices/chatbotsSlice";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import api from "@/lib/api";
import showToast from "@/lib/toast";
import type { ChatMessage, Chatbot } from "@/lib/types";
import { PlaygroundConfigSkeleton } from "@/app/components/ui";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { ENDPOINTS } from "@/lib/endpoints";
import { STATUS, ROLES } from "@/lib/constants";

// ─── Constants ────────────────────────────────────────────────────────────────

const INITIAL_MESSAGES: ChatMessage[] = [
    { id: 1, text: "Hello! I'm your AI assistant. How can I help you today? ", isBot: true },
];

// ─── Main Component ───────────────────────────────────────────────────────────

export default function PlaygroundPage() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const chatbotId = searchParams.get("chatbotId");
    const dispatch = useAppDispatch();

    const { items: chatbots, status } = useAppSelector((state) => state.chatbots);
    const chatbot = chatbots.find((b) => b.id === chatbotId);

    const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES);
    const [input, setInput] = useState("");
    const [temperature, setTemperature] = useState(0.7);

    useEffect(() => {
        if (status === STATUS.ACTIVE || status === "idle") dispatch(fetchChatbots());
    }, [status, dispatch]);

    useEffect(() => {
        if (chatbot && chatbot.temperature !== undefined && chatbot.temperature !== temperature) {
            queueMicrotask(() => setTemperature(chatbot.temperature!));
        }
    }, [chatbot, temperature]);

    const handleSend = async () => {
        if (!input.trim() || !chatbotId) return;

        const userMessage = input;
        setInput("");
        const chatHistory = messages
            .filter(m => !m.isThinking && m.id !== 1) // Exclude"Thinking..." and initial greeting
            .map(m => ({
                role: m.isBot ? ROLES.ASSISTANT : ROLES.USER,
                content: m.text
            }));

        setMessages((prev) => [
            ...prev,
            { id: Date.now(), text: userMessage, isBot: false },
            { id: Date.now() + 1, text: "Thinking...", isBot: true, isThinking: true },
        ]);

        try {
            const response = await api.post(ENDPOINTS.CHATBOTS.CHAT(chatbotId), {
                message: userMessage,
                history: chatHistory
            });
            setMessages((prev) => [
                ...prev.filter((m) => !m.isThinking),
                { id: Date.now() + 2, text: response.data.response, isBot: true },
            ]);
        } catch (error: unknown) {
            console.error("Failed to get AI response.");
            const err = error as { response?: { status?: number, data?: { detail?: string } }; message?: string };
            const isUsageError = err.response?.status === 403;
            const errorMessage = isUsageError
                ? err.response?.data?.detail ||"Usage limit reached."
                : (err.response?.data?.detail || err.message ||"Something went wrong. Please try again later.");

            setMessages((prev) => [
                ...prev.filter((m) => !m.isThinking),
                { id: Date.now() + 2, text: errorMessage, isBot: true },
            ]);

            if (isUsageError) {
                showToast.warning(errorMessage);
            } else {
                showToast.error("Failed to get AI response. Please try again.");
            }
        }
    };

    const handleChatbotChange = (id: string) => {
        router.push(`/dashboard/playground?chatbotId=${id}`);
    };

    const handleResetChat = () => {
        setMessages([{ id: Date.now(), text: "Chat cleared. How can I help you?", isBot: true }]);
        showToast.info("Chat history cleared");
    };

    return (
        <div className="h-[calc(100vh-8rem)] flex gap-4 animate-fade-in-up">
            {/* Left: Config panel */}
            {status === "loading" ? (
                <PlaygroundConfigSkeleton />
            ) : (
                <ConfigPanel
                    chatbots={chatbots}
                    chatbotId={chatbotId}
                    chatbot={chatbot}
                    temperature={temperature}
                    onChatbotChange={handleChatbotChange}
                    onTemperatureChange={setTemperature}
                />
            )}

            {/* Right: Chat */}
            <div className="flex-1 flex flex-col rounded-2xl overflow-hidden border border-border bg-background">
                <ChatHeader chatbot={chatbot} onReset={handleResetChat} />

                {chatbotId ? (
                    <ChatMessages messages={messages} chatbot={chatbot} />
                ) : (
                    <NoChatbotSelected chatbots={chatbots} onSelect={handleChatbotChange} />
                )}

                {chatbotId && (
                    <ChatInput
                        input={input}
                        chatbotName={chatbot?.name ?? "AI"}
                        onChange={setInput}
                        onSend={handleSend}
                    />
                )}
            </div>
        </div>
    );
}

// ─── Config Panel ─────────────────────────────────────────────────────────────

interface ConfigPanelProps {
    chatbots: Chatbot[];
    chatbotId: string | null;
    chatbot: Chatbot | undefined;
    temperature: number;
    onChatbotChange: (id: string) => void;
    onTemperatureChange: (val: number) => void;
}

function ConfigPanel({ chatbots, chatbotId, chatbot, temperature, onChatbotChange, onTemperatureChange }: ConfigPanelProps) {
    const tempLabel = temperature <= 0.3 ? "Precise" : temperature <= 0.6 ? "Balanced" : "Creative";
    const tempColor =
        temperature <= 0.3
            ? "var(--accent-green)"
            : temperature <= 0.6
            ? "var(--brand)"
            : "var(--accent-gold)";

    return (
        <div className="w-[264px] shrink-0 flex flex-col gap-3 h-full">
            {/* Header */}
            <div className="bg-background border border-border rounded-2xl px-4 py-3.5 flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-muted flex items-center justify-center">
                    <Settings2 className="w-3.5 h-3.5 text-muted-foreground" />
                </div>
                <div>
                    <p className="text-[13px] font-semibold text-foreground leading-none">Playground</p>
                    <p className="text-[11px] text-muted-foreground mt-0.5 font-mono">Configure &amp; test</p>
                </div>
            </div>

            {/* Agent selector */}
            <div className="bg-background border border-border rounded-2xl p-4 space-y-3">
                <p className="text-[11px] font-semibold text-muted-foreground tracking-normal">Agent</p>
                <Select
                    value={chatbotId || ""}
                    onValueChange={(v) => { if (v) onChatbotChange(v); }}
                >
                    <SelectTrigger className="w-full h-9 bg-muted border-transparent text-[13px] font-medium rounded-xl shadow-none focus:ring-0 hover:bg-muted/80 transition-colors">
                        <SelectValue placeholder="Choose an agent…" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl border border-border bg-background p-1 shadow-lg">
                        {chatbots.map((bot) => (
                            <SelectItem
                                key={bot.id}
                                value={bot.id}
                                className="rounded-lg text-[13px] font-medium cursor-pointer"
                            >
                                {bot.name}
                            </SelectItem>
                        ))}
                        {chatbots.length === 0 && (
                            <div className="px-3 py-4 text-center text-xs text-muted-foreground">
                                No agents found
                            </div>
                        )}
                    </SelectContent>
                </Select>

                {chatbot && (
                    <div className="pt-1 space-y-2 border-t border-border">
                        <div className="flex items-center justify-between pt-2">
                            <span className="text-[11px] text-muted-foreground font-mono">Status</span>
                            <span className="flex items-center gap-1.5 text-[11px] font-semibold" style={{ color: "var(--accent-green)" }}>
                                <span className="w-1.5 h-1.5 rounded-full bg-current" />
                                Live
                            </span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-[11px] text-muted-foreground font-mono">Context</span>
                            <span className="text-[10px] font-semibold text-foreground bg-muted px-2 py-0.5 rounded-lg border border-border">
                                Documents
                            </span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-[11px] text-muted-foreground font-mono">Model</span>
                            <span className="text-[10px] font-semibold text-foreground bg-muted px-2 py-0.5 rounded-lg border border-border">
                                Gemini 2.5
                            </span>
                        </div>
                    </div>
                )}
            </div>

            {/* Temperature */}
            <div className="bg-background border border-border rounded-2xl p-4 space-y-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                        <Thermometer className="w-3.5 h-3.5 text-muted-foreground" />
                        <p className="text-[11px] font-semibold text-muted-foreground tracking-normal">Temperature</p>
                    </div>
                    <span
                        className="text-[10px] font-semibold px-2 py-0.5 rounded-full border"
                        style={{ color: tempColor, borderColor: tempColor + "40", background: tempColor + "15" }}
                    >
                        {tempLabel}
                    </span>
                </div>

                <div className="space-y-3">
                    <div className="flex items-center justify-between">
                        <span className="text-[11px] text-muted-foreground font-mono">0.0</span>
                        <span className="text-[26px] font-semibold tabular-nums tracking-tight" style={{ color: tempColor }}>
                            {temperature.toFixed(1)}
                        </span>
                        <span className="text-[11px] text-muted-foreground font-mono">1.0</span>
                    </div>
                    <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.1"
                        value={temperature}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => onTemperatureChange(parseFloat(e.target.value))}
                        className="w-full h-1.5 rounded-full appearance-none cursor-pointer bg-muted"
                        style={{ accentColor: tempColor }}
                    />
                    <div className="flex justify-between text-[9px] font-medium text-muted-foreground tracking-wide">
                        <span>Precise</span>
                        <span>Balanced</span>
                        <span>Creative</span>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <div className="mt-auto bg-background border border-border rounded-2xl px-4 py-3 flex items-center gap-2">
                <Zap className="w-3.5 h-3.5 shrink-0" style={{ color: "var(--brand)" }} />
                <p className="text-[11px] text-muted-foreground leading-tight">
                    Powered by <span className="font-semibold text-foreground">Deploy Chat</span>
                </p>
            </div>
        </div>
    );
}

// ─── Chat Header ──────────────────────────────────────────────────────────────

function ChatHeader({ chatbot, onReset }: { chatbot: Chatbot | undefined; onReset: () => void }) {
    return (
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-border bg-background shrink-0">
            <div className="flex items-center gap-3">
                <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center text-[12px] font-bold shrink-0"
                    style={
                        chatbot
                            ? { background: "var(--agent-bg)", color: "var(--agent)" }
                            : { background: "var(--muted)", color: "var(--muted-foreground)" }
                    }
                >
                    {chatbot ? chatbot.name.slice(0, 2).toUpperCase() : <Bot className="w-4 h-4" />}
                </div>
                <div>
                    <p className="text-[14px] font-semibold text-foreground leading-none">
                        {chatbot ? chatbot.name : "No agent selected"}
                    </p>
                    <div className="flex items-center gap-1.5 mt-1">
                        <span
                            className="w-1.5 h-1.5 rounded-full"
                            style={{ background: chatbot ? "var(--accent-green)" : "var(--muted-foreground)" }}
                        />
                        <span className="text-[11px] text-muted-foreground">
                            {chatbot ? "Online · Gemini 2.5 Flash" : "Select an agent to start"}
                        </span>
                    </div>
                </div>
            </div>
            <button
                onClick={onReset}
                className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                title="Clear chat"
            >
                <RefreshCw className="w-4 h-4" />
            </button>
        </div>
    );
}

// ─── Chat Messages ────────────────────────────────────────────────────────────

function ChatMessages({ messages, chatbot }: { messages: ChatMessage[]; chatbot: Chatbot | undefined }) {
    const bottomRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    return (
        <div className="flex-1 overflow-y-auto px-5 py-6 space-y-5" style={{ background: "var(--muted)" }}>
            {messages.map((msg) => (
                <MessageBubble key={msg.id} message={msg} agentName={chatbot?.name} />
            ))}
            <div ref={bottomRef} />
        </div>
    );
}

function MessageBubble({ message: msg, agentName }: { message: ChatMessage; agentName?: string }) {
    const isBot = msg.isBot;
    return (
        <div className={`flex gap-3 ${!isBot ? "flex-row-reverse" : ""}`}>
            {/* Avatar */}
            <div
                className="w-7 h-7 rounded-xl flex items-center justify-center text-[10px] font-bold shrink-0 mt-1"
                style={
                    isBot
                        ? { background: "var(--agent-bg)", color: "var(--agent)" }
                        : { background: "var(--foreground)", color: "var(--background)" }
                }
            >
                {isBot
                    ? (agentName ? agentName.slice(0, 2).toUpperCase() : <Sparkles className="w-3 h-3" />)
                    : <User className="w-3 h-3" />
                }
            </div>

            {/* Content */}
            <div className={`flex flex-col gap-1 max-w-[72%] ${!isBot ? "items-end" : "items-start"}`}>
                <span className="text-[11px] font-semibold text-muted-foreground px-1">
                    {isBot ? (agentName ?? "AI") : "You"}
                </span>

                <div
                    className={`px-4 py-2.5 text-[13.5px] leading-relaxed ${
                        isBot
                            ? "bg-background border border-border text-foreground rounded-2xl rounded-tl-sm"
                            : "rounded-2xl rounded-tr-sm"
                    }`}
                    style={!isBot ? { background: "var(--foreground)", color: "var(--background)" } : undefined}
                >
                    {msg.isThinking ? (
                        <div className="flex items-center gap-1.5 py-0.5 px-1">
                            <div className="w-1.5 h-1.5 rounded-full bg-current opacity-40 animate-bounce" />
                            <div className="w-1.5 h-1.5 rounded-full bg-current opacity-60 animate-bounce [animation-delay:0.15s]" />
                            <div className="w-1.5 h-1.5 rounded-full bg-current opacity-80 animate-bounce [animation-delay:0.3s]" />
                        </div>
                    ) : (
                        <div className={`prose prose-sm max-w-none ${isBot ? "" : "prose-invert"}`}>
                            <ReactMarkdown
                                remarkPlugins={[remarkGfm]}
                                components={{
                                    p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
                                    ul: ({ children }) => <ul className="list-disc ml-4 mb-2">{children}</ul>,
                                    ol: ({ children }) => <ol className="list-decimal ml-4 mb-2">{children}</ol>,
                                    li: ({ children }) => <li className="mb-1">{children}</li>,
                                    code: ({ className, children, ...props }: React.HTMLAttributes<HTMLElement>) => {
                                        const match = /language-(\w+)/.exec(className || "");
                                        return !match ? (
                                            <code className="bg-muted px-1.5 py-0.5 rounded-md text-pink-500 font-mono text-[12px]" {...props}>
                                                {children}
                                            </code>
                                        ) : (
                                            <pre className="bg-foreground text-background p-4 rounded-xl overflow-x-auto my-3 font-mono text-[12px]">
                                                <code className={className} {...props}>{children}</code>
                                            </pre>
                                        );
                                    },
                                    a: ({ href, children }) => (
                                        <a href={href} target="_blank" rel="noopener noreferrer" className="text-primary underline underline-offset-2 hover:opacity-80">
                                            {children}
                                        </a>
                                    ),
                                    h1: ({ children }) => <h1 className="text-lg font-semibold mb-2">{children}</h1>,
                                    h2: ({ children }) => <h2 className="text-base font-semibold mb-2">{children}</h2>,
                                    h3: ({ children }) => <h3 className="text-sm font-semibold mb-2">{children}</h3>,
                                }}
                            >
                                {msg.text}
                            </ReactMarkdown>
                        </div>
                    )}
                </div>

                {!msg.isThinking && (
                    <span className="text-[10px] text-muted-foreground font-mono px-1">
                        {new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </span>
                )}
            </div>
        </div>
    );
}

// ─── No Chatbot Selected ──────────────────────────────────────────────────────

function NoChatbotSelected({ chatbots, onSelect }: { chatbots: Chatbot[]; onSelect: (id: string) => void }) {
    return (
        <div className="flex-1 flex flex-col items-center justify-center px-8" style={{ background: "var(--muted)" }}>
            <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5 border border-border bg-background"
            >
                <MessagesSquare className="w-6 h-6 text-muted-foreground" />
            </div>

            <h3 className="text-[17px] font-semibold text-foreground mb-2 tracking-tight">
                Pick an agent to begin
            </h3>
            <p className="text-sm text-muted-foreground text-center max-w-xs leading-relaxed mb-7">
                Select one of your deployed agents from the panel on the left to start a live conversation.
            </p>

            {chatbots.length > 0 && (
                <div className="flex flex-wrap gap-2 justify-center">
                    {chatbots.slice(0, 4).map((bot) => (
                        <button
                            key={bot.id}
                            onClick={() => onSelect(bot.id)}
                            className="flex items-center gap-2 px-3 py-2 bg-background border border-border rounded-xl text-[13px] font-medium text-foreground hover:border-border-medium transition-all"
                        >
                            <span
                                className="w-5 h-5 rounded-md text-[9px] font-bold flex items-center justify-center shrink-0"
                                style={{ background: "var(--agent-bg)", color: "var(--agent)" }}
                            >
                                {bot.name.slice(0, 2).toUpperCase()}
                            </span>
                            {bot.name}
                        </button>
                    ))}
                    {chatbots.length > 4 && (
                        <span className="flex items-center px-3 py-2 text-[12px] text-muted-foreground font-mono">
                            +{chatbots.length - 4} more
                        </span>
                    )}
                </div>
            )}
        </div>
    );
}

// ─── Chat Input ───────────────────────────────────────────────────────────────

interface ChatInputProps {
    input: string;
    chatbotName: string;
    onChange: (val: string) => void;
    onSend: () => void;
}

function ChatInput({ input, chatbotName, onChange, onSend }: ChatInputProps) {
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    useEffect(() => {
        const el = textareaRef.current;
        if (!el) return;
        el.style.height = "auto";
        el.style.height = Math.min(el.scrollHeight, 160) + "px";
    }, [input]);

    return (
        <div className="px-4 py-3.5 bg-background border-t border-border">
            <div className="flex items-end gap-2.5 bg-muted rounded-2xl px-4 py-3 border border-transparent focus-within:border-border-medium focus-within:bg-background transition-all">
                <textarea
                    ref={textareaRef}
                    rows={1}
                    value={input}
                    onChange={(e) => onChange(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                            e.preventDefault();
                            onSend();
                        }
                    }}
                    placeholder={`Message ${chatbotName}…`}
                    className="flex-1 bg-transparent text-[14px] text-foreground placeholder:text-muted-foreground resize-none border-none outline-none ring-0 leading-relaxed max-h-40 py-0.5"
                />
                <button
                    onClick={onSend}
                    disabled={!input.trim()}
                    className="w-8 h-8 mb-0.5 flex items-center justify-center rounded-xl shrink-0 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                    style={{ background: "var(--foreground)" }}
                >
                    <Send className="w-3.5 h-3.5 rotate-90" style={{ color: "var(--background)" }} />
                </button>
            </div>
            <div className="flex items-center justify-between mt-2 px-1">
                <span className="text-[10px] text-muted-foreground font-mono">↵ Send · ⇧↵ New line</span>
                <span className="flex items-center gap-1 text-[10px] text-muted-foreground font-mono">
                    <Zap className="w-2.5 h-2.5" />
                    Gemini 2.5 Flash
                </span>
            </div>
        </div>
    );
}

