"use client";

import { useState, useEffect } from "react";
import {
    HiSparkles, HiPaperAirplane, HiRefresh, HiCog,
    HiUser, HiChatAlt2,
} from "react-icons/hi";
import { useSearchParams, useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { fetchChatbots } from "@/lib/store/slices/chatbotsSlice";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import api from "@/lib/api";
import showToast from "@/lib/toast";
import type { ChatMessage, Chatbot } from "@/lib/types";
import { PlaygroundConfigSkeleton } from "@/app/components/ui";
import { Select, SelectItem } from "@heroui/react";
import { ENDPOINTS } from "@/lib/endpoints";
import { STATUS, ROLES } from "@/lib/constants";

// ─── Constants ────────────────────────────────────────────────────────────────

const INITIAL_MESSAGES: ChatMessage[] = [
    { id: 1, text: "Hello! I'm your AI assistant. How can I help you today?", isBot: true },
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
            .filter(m => !m.isThinking && m.id !== 1) // Exclude "Thinking..." and initial greeting
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
            console.error(error);
            const err = error as { response?: { status?: number, data?: { detail?: string } }; message?: string };
            const isUsageError = err.response?.status === 403;
            const errorMessage = isUsageError
                ? err.response?.data?.detail || "Usage limit reached."
                : (err.response?.data?.detail || err.message || "Something went wrong. Please try again later.");

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
        setMessages([{ id: Date.now(), text: "Chat history cleared. How can I help you?", isBot: true }]);
        showToast.info("Chat history cleared");
    };

    return (
        <div className="h-[calc(100vh-8rem)] flex gap-6 animate-fade-in-up">
            {/* Configuration Sidebar — shows skeleton while chatbots are fetching */}
            {status === "loading" ? (
                <PlaygroundConfigSkeleton />
            ) : (
                <ConfigurationPanel
                    chatbots={chatbots}
                    chatbotId={chatbotId}
                    chatbot={chatbot}
                    temperature={temperature}
                    onChatbotChange={handleChatbotChange}
                    onTemperatureChange={setTemperature}
                />
            )}

            {/* Main Chat Area */}
            <div className="flex-1 flex flex-col bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden relative">
                <ChatHeader chatbot={chatbot} onReset={handleResetChat} />

                {chatbotId ? (
                    <ChatMessages messages={messages} />
                ) : (
                    <NoChatbotSelected />
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

// ─── Configuration Panel ──────────────────────────────────────────────────────

interface ConfigurationPanelProps {
    chatbots: Chatbot[];
    chatbotId: string | null;
    chatbot: Chatbot | undefined;
    temperature: number;
    onChatbotChange: (id: string) => void;
    onTemperatureChange: (val: number) => void;
}

function ConfigurationPanel({
    chatbots,
    chatbotId,
    chatbot,
    temperature,
    onChatbotChange,
    onTemperatureChange,
}: ConfigurationPanelProps) {
    return (
        <div className="w-80 bg-white rounded-lg border border-slate-200 shadow-sm p-6 flex flex-col h-full overflow-y-auto">
            <div className="flex items-center gap-2 mb-8">
                <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600">
                    <HiCog className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-slate-900">Configuration</h3>
            </div>

            <div className="space-y-8 flex-1">
                {/* Chatbot Selector */}
                <div className="space-y-3">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                        Select Chatbot
                    </label>
                    <Select
                        placeholder="Select a chatbot..."
                        selectedKeys={chatbotId ? new Set([chatbotId]) : new Set()}
                        onSelectionChange={(keys) => {
                            const selected = Array.from(keys)[0] as string;
                            if (selected) onChatbotChange(selected);
                        }}
                        aria-label="Select chatbot"
                        variant="bordered"
                        radius="lg"
                        classNames={{
                            trigger: "border-slate-200 bg-slate-50/50 hover:bg-white hover:border-indigo-300 data-[open=true]:border-indigo-500 h-11 shadow-none transition-all",
                            value: "text-sm font-medium text-slate-700",
                            selectorIcon: "text-slate-400",
                            popoverContent: "rounded-xl bg-white border border-slate-200 shadow-lg p-1",
                        }}
                    >
                        {chatbots.map((bot) => (
                            <SelectItem
                                key={bot.id}
                                classNames={{
                                    base: "rounded-lg data-[hover=true]:bg-indigo-50 data-[selected=true]:bg-indigo-100 data-[selected=true]:text-indigo-900",
                                    title: "text-sm font-medium",
                                }}
                            >
                                {bot.name}
                            </SelectItem>
                        ))}
                    </Select>
                </div>

                {/* Model Stats */}
                {chatbot && (
                    <div className="space-y-4">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Model Stats</label>
                        <div className="p-4 bg-slate-50/50 rounded-lg border border-slate-100 space-y-2.5">
                            <div className="flex justify-between">
                                <span className="text-[10px] font-bold text-slate-400 uppercase">Provider</span>
                                <span className="text-[10px] font-bold text-slate-700 bg-white px-2 py-0.5 rounded border uppercase tracking-wider">
                                    Gemini 2.5 Flash
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-[10px] font-bold text-slate-400 uppercase">Knowledge</span>
                                <span className="text-[10px] font-bold text-indigo-600">Document Context</span>
                            </div>
                        </div>
                    </div>
                )}

                {/* Temperature Slider */}
                <div className="space-y-5 pt-8 border-t border-slate-100">
                    <div className="flex items-center justify-between">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Creativity (Temp)</label>
                        <span className="text-sm font-mono font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-lg border border-indigo-100">
                            {temperature}
                        </span>
                    </div>
                    <div className="relative pt-1">
                        <input
                            type="range"
                            min="0"
                            max="1"
                            step="0.1"
                            value={temperature}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => onTemperatureChange(parseFloat(e.target.value))}
                            className="w-full accent-indigo-600 h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer hover:bg-slate-200 transition-colors"
                        />
                        <div className="flex justify-between text-[10px] font-bold text-slate-400 mt-2 uppercase tracking-tighter">
                            <span>Precise</span>
                            <span>Balanced</span>
                            <span>Creative</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

// ─── Chat Header ──────────────────────────────────────────────────────────────

function ChatHeader({ chatbot, onReset }: { chatbot: Chatbot | undefined; onReset: () => void }) {
    return (
        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-white/80 backdrop-blur-md z-10 sticky top-0">
            <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 p-[1px] shadow-lg shadow-indigo-100">
                    <div className="w-full h-full bg-white rounded-md flex items-center justify-center text-indigo-600">
                        <HiSparkles className="w-6 h-6" />
                    </div>
                </div>
                <div>
                    <h2 className="text-lg font-bold text-slate-900 tracking-tight">
                        {chatbot ? chatbot.name : "Select a Chatbot"}
                    </h2>
                    <div className="flex items-center gap-1.5">
                        <span className={`w-2 h-2 rounded-full ${chatbot ? "bg-emerald-500 animate-pulse" : "bg-slate-300"}`} />
                        <span className="text-[11px] text-slate-500 font-bold uppercase tracking-wider">
                            {chatbot ? "Online • Intelligent Mode" : "Select from left to start"}
                        </span>
                    </div>
                </div>
            </div>
            <button
                onClick={onReset}
                className="p-2.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
                title="Reset Chat"
            >
                <HiRefresh className="w-5 h-5" />
            </button>
        </div>
    );
}

// ─── Chat Messages ────────────────────────────────────────────────────────────

function ChatMessages({ messages }: { messages: ChatMessage[] }) {
    return (
        <div className="flex-1 p-6 bg-slate-50/30 space-y-4 overflow-y-auto scroll-smooth">
            {messages.map((msg) => (
                <MessageBubble key={msg.id} message={msg} />
            ))}
        </div>
    );
}

function MessageBubble({ message: msg }: { message: ChatMessage }) {
    return (
        <div className={`flex gap-3 ${!msg.isBot ? "flex-row-reverse" : ""}`}>
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 border shadow-sm transition-transform hover:scale-105 ${msg.isBot ? "bg-white border-slate-200 text-indigo-600" : "bg-indigo-600 border-indigo-700 text-white"
                }`}>
                {msg.isBot ? <HiChatAlt2 className="w-5 h-5" /> : <HiUser className="w-5 h-5" />}
            </div>

            <div className={`max-w-[75%] space-y-2 ${!msg.isBot ? "items-end flex flex-col" : ""}`}>
                <div className={`px-4 py-2.5 rounded-lg text-[14px] leading-relaxed shadow-sm transition-all ${msg.isBot
                    ? "bg-white border border-slate-200 text-slate-700 rounded-tl-none font-medium"
                    : "bg-indigo-600 text-white rounded-tr-none font-medium"
                    }`}>
                    {msg.isThinking ? (
                        <div className="flex gap-2 py-2">
                            <div className="w-2 h-2 bg-indigo-200 rounded-full animate-bounce" />
                            <div className="w-2 h-2 bg-indigo-300 rounded-full animate-bounce [animation-delay:-.3s]" />
                            <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce [animation-delay:-.5s]" />
                        </div>
                    ) : (
                        <div className={`prose prose-sm max-w-none ${msg.isBot ? "prose-slate" : "prose-invert"}`}>
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
                                            <code className="bg-slate-100 dark:bg-slate-800 px-1 rounded text-pink-600 font-mono text-[13px]" {...props}>
                                                {children}
                                            </code>
                                        ) : (
                                            <pre className="bg-slate-900 text-slate-100 p-4 rounded-xl overflow-x-auto my-4 font-mono text-[13px]">
                                                <code className={className} {...props}>{children}</code>
                                            </pre>
                                        );
                                    },
                                    a: ({ href, children }) => (
                                        <a href={href} target="_blank" rel="noopener noreferrer" className="text-indigo-400 hover:underline">
                                            {children}
                                        </a>
                                    ),
                                    h1: ({ children }) => <h1 className="text-xl font-bold mb-2">{children}</h1>,
                                    h2: ({ children }) => <h2 className="text-lg font-bold mb-2">{children}</h2>,
                                    h3: ({ children }) => <h3 className="text-base font-bold mb-2">{children}</h3>,
                                }}
                            >
                                {msg.text}
                            </ReactMarkdown>
                        </div>
                    )}
                </div>
                {!msg.isThinking && (
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest px-1">
                        {new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </span>
                )}
            </div>
        </div>
    );
}

// ─── No Chatbot Selected ──────────────────────────────────────────────────────

function NoChatbotSelected() {
    return (
        <div className="flex-1 flex items-center justify-center bg-slate-50/30">
            <div className="text-center max-w-md px-8">
                <div className="w-20 h-20 bg-indigo-50 rounded-lg flex items-center justify-center mx-auto mb-6 border border-indigo-100">
                    <HiChatAlt2 className="w-10 h-10 text-indigo-400" />
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-2">Select a Chatbot</h3>
                <p className="text-sm text-slate-500 leading-relaxed">
                    Choose a chatbot from the configuration panel on the left to start testing your AI assistant.
                </p>
            </div>
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
    return (
        <div className="p-4 bg-white border-t border-slate-100 backdrop-blur-sm">
            <div className="relative flex items-center gap-3 max-w-5xl mx-auto border border-slate-200 rounded-lg px-4 py-2 bg-slate-50/50 hover:bg-white hover:border-slate-300 transition-all">
                <textarea
                    className="flex-1 max-h-40 bg-transparent border-none focus:outline-none focus:ring-0 p-2 text-[14px] font-medium text-slate-700 placeholder:text-slate-400 resize-none leading-relaxed"
                    placeholder={`Ask ${chatbotName} anything...`}
                    rows={1}
                    value={input}
                    onChange={(e) => onChange(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                            e.preventDefault();
                            onSend();
                        }
                    }}
                />
                <button
                    onClick={onSend}
                    disabled={!input.trim()}
                    className="bg-indigo-600 text-white p-2.5 rounded-lg hover:bg-indigo-700 shadow-md shadow-indigo-200 disabled:opacity-30 disabled:cursor-not-allowed transition-all hover:scale-105 active:scale-95 shrink-0"
                >
                    <HiPaperAirplane className="w-5 h-5 transform rotate-90" />
                </button>
            </div>
            <div className="text-center mt-2.5">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                    Powered by Gemini 2.5 Flash • Context: Documents
                </p>
            </div>
        </div>
    );
}
