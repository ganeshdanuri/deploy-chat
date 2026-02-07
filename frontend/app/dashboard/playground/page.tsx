"use client";

import { useState, useEffect } from "react";
import { HiSparkles, HiPaperAirplane, HiRefresh, HiCog, HiUser, HiChatAlt2, HiLightningBolt, HiChevronDown } from "react-icons/hi";
import { useSearchParams, useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "@/lib/store/store";
import { fetchChatbots } from "@/lib/store/slices/chatbotsSlice";
import api from "@/lib/api";

interface Message {
    id: number;
    text: string;
    isBot: boolean;
    isThinking?: boolean;
}

export default function PlaygroundPage() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const chatbotId = searchParams.get("chatbotId");
    const dispatch = useDispatch<AppDispatch>();

    const { items: chatbots, status } = useSelector((state: RootState) => state.chatbots);
    const chatbot = chatbots.find(b => b.id === chatbotId);

    const [messages, setMessages] = useState<Message[]>([
        { id: 1, text: "Hello! I'm your AI assistant. How can I help you today?", isBot: true },
    ]);
    const [input, setInput] = useState("");
    const [temperature, setTemperature] = useState(0.7);

    useEffect(() => {
        if (status === 'idle') {
            dispatch(fetchChatbots());
        }
    }, [status, dispatch]);

    useEffect(() => {
        if (chatbot) {
            setTemperature(chatbot.temperature || 0.7);
        }
    }, [chatbot]);

    const handleSend = async () => {
        if (!input.trim() || !chatbotId) return;
        const userMessage = input;
        setMessages(prev => [...prev, { id: Date.now(), text: userMessage, isBot: false }]);
        setInput("");

        // Thinking state
        setMessages(prev => [...prev, { id: Date.now() + 1, text: "Thinking...", isBot: true, isThinking: true }]);

        try {
            const response = await api.post(`/api/chatbots/${chatbotId}/chat`, null, {
                params: { message: userMessage }
            });

            setMessages(prev => {
                const newMsgs = prev.filter(m => !m.isThinking);
                return [...newMsgs, { id: Date.now() + 2, text: response.data.response, isBot: true }];
            });
        } catch (error: any) {
            setMessages(prev => {
                const newMsgs = prev.filter(m => !m.isThinking);
                const errorMessage = error.response?.status === 403
                    ? error.response.data.detail
                    : "Something went wrong. Please try again later.";
                return [...newMsgs, { id: Date.now() + 2, text: errorMessage, isBot: true }];
            });
        }
    };

    const handleChatbotChange = (id: string) => {
        router.push(`/dashboard/playground?chatbotId=${id}`);
    };

    return (
        <div className="h-[calc(100vh-8rem)] flex gap-6 animate-fade-in-up">
            {/* Settings Sidebar (Left Side Now) */}
            <div className="w-80 bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col h-full overflow-y-auto">
                <div className="flex items-center gap-2 mb-8">
                    <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600">
                        <HiCog className="w-5 h-5" />
                    </div>
                    <h3 className="text-lg font-bold text-slate-900">Configuration</h3>
                </div>

                <div className="space-y-8 flex-1">
                    {/* Chatbot Selection */}
                    <div className="space-y-3">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                            Select Chatbot
                        </label>
                        <div className="relative group">
                            <select
                                value={chatbotId || ""}
                                onChange={(e) => handleChatbotChange(e.target.value)}
                                className="w-full pl-4 pr-10 py-3 text-sm font-semibold bg-slate-50/50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 appearance-none transition-all cursor-pointer group-hover:bg-white"
                            >
                                <option value="" disabled>Select a chatbot...</option>
                                {chatbots.map(bot => (
                                    <option key={bot.id} value={bot.id}>{bot.name}</option>
                                ))}
                            </select>
                            <HiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none group-hover:text-indigo-500 transition-colors" />
                        </div>
                    </div>

                    {/* Persona (Read-only) */}
                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Persona / Prompt</label>
                            <span className="text-[10px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full font-bold">Locked</span>
                        </div>
                        <textarea
                            readOnly
                            className="w-full text-sm border-slate-200 rounded-xl bg-slate-50/70 h-32 p-4 text-slate-600 italic resize-none focus:ring-0 leading-relaxed border-dashed"
                            value={chatbot?.system_prompt || (chatbot ? `You are ${chatbot.name}, a helpful AI assistant. Be polite, concise, and professional.` : "You are a helpful AI assistant.")}
                        />
                        <p className="text-[10px] text-slate-400 leading-relaxed italic">
                            * Persona is locked in playground. Edit in Chatbot Settings to change behavior.
                        </p>
                    </div>

                    {/* Temperature Slider */}
                    <div className="space-y-5 pt-8 border-t border-slate-100">
                        <div className="flex items-center justify-between">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Creativity (Temp)</label>
                            <span className="text-sm font-mono font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-lg border border-indigo-100">{temperature}</span>
                        </div>
                        <div className="relative pt-1">
                            <input
                                type="range"
                                min="0"
                                max="1"
                                step="0.1"
                                value={temperature}
                                onChange={(e) => setTemperature(parseFloat(e.target.value))}
                                className="w-full accent-indigo-600 h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer hover:bg-slate-200 transition-colors"
                            />
                            <div className="flex justify-between text-[10px] font-bold text-slate-400 mt-2 uppercase tracking-tighter">
                                <span>Precise</span>
                                <span>Balanced</span>
                                <span>Creative</span>
                            </div>
                        </div>
                    </div>

                    {/* Meta Info */}
                    {chatbot && (
                        <div className="space-y-4 pt-8 border-t border-slate-100">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Model Stats</label>
                            <div className="p-4 bg-slate-50/50 rounded-xl border border-slate-100 space-y-2.5">
                                <div className="flex justify-between">
                                    <span className="text-[10px] font-bold text-slate-400 uppercase">Provider</span>
                                    <span className="text-[10px] font-bold text-slate-700 bg-white px-2 py-0.5 rounded border">GEMINI-1.5-FLASH</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-[10px] font-bold text-slate-400 uppercase">Knowledge</span>
                                    <span className="text-[10px] font-bold text-indigo-600">Document Context</span>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Main Chat Area (Right Side Now) */}
            <div className="flex-1 flex flex-col bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden relative">
                {/* Chat Header */}
                <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-white/80 backdrop-blur-md z-10 sticky top-0">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 p-[1px] shadow-lg shadow-indigo-100">
                            <div className="w-full h-full bg-white rounded-[15px] flex items-center justify-center text-indigo-600">
                                <HiSparkles className="w-6 h-6" />
                            </div>
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-slate-900 tracking-tight">{chatbot ? chatbot.name : "Select a Chatbot"}</h2>
                            <div className="flex items-center gap-1.5">
                                <span className={`w-2 h-2 rounded-full ${chatbot ? 'bg-emerald-500 animate-pulse' : 'bg-slate-300'}`}></span>
                                <span className="text-[11px] text-slate-500 font-bold uppercase tracking-wider">
                                    {chatbot ? "Online • Intelligent Mode" : "Select from left to start"}
                                </span>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setMessages([{ id: Date.now(), text: "Chat history cleared. How can I help you?", isBot: true }])}
                            className="p-2.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all" title="Reset Chat"
                        >
                            <HiRefresh className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {/* Messages Area */}
                <div className="flex-1 p-8 bg-slate-50/30 space-y-8 overflow-y-auto scroll-smooth">
                    {messages.map((msg) => (
                        <div key={msg.id} className={`flex gap-4 ${!msg.isBot ? "flex-row-reverse" : ""}`}>
                            {/* Avatar */}
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border shadow-sm transition-transform hover:scale-105 ${msg.isBot ? "bg-white border-slate-200 text-indigo-600" : "bg-indigo-600 border-indigo-700 text-white"}`}>
                                {msg.isBot ? <HiChatAlt2 className="w-5 h-5" /> : <HiUser className="w-5 h-5" />}
                            </div>

                            {/* Message Bubble */}
                            <div className={`max-w-[75%] space-y-2 ${!msg.isBot ? "items-end flex flex-col" : ""}`}>
                                <div className={`px-6 py-4 rounded-3xl text-[14px] leading-relaxed shadow-sm transition-all ${msg.isBot
                                    ? "bg-white border border-slate-200 text-slate-700 rounded-tl-none font-medium"
                                    : "bg-indigo-600 text-white rounded-tr-none font-semibold"
                                    }`}>
                                    {msg.isThinking ? (
                                        <div className="flex gap-2 py-2">
                                            <div className="w-2 h-2 bg-indigo-200 rounded-full animate-bounce"></div>
                                            <div className="w-2 h-2 bg-indigo-300 rounded-full animate-bounce [animation-delay:-.3s]"></div>
                                            <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce [animation-delay:-.5s]"></div>
                                        </div>
                                    ) : (
                                        msg.text
                                    )}
                                </div>
                                {!msg.isThinking && (
                                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest px-1">
                                        {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                )}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Input Area */}
                <div className="p-6 bg-white border-t border-slate-100 backdrop-blur-sm">
                    <div className="relative flex items-end gap-3 max-w-5xl mx-auto border-2 border-slate-100 rounded-[24px] px-6 py-4 bg-slate-50/50 hover:bg-white hover:border-indigo-100 focus-within:bg-white focus-within:border-indigo-600/30 focus-within:ring-4 focus-within:ring-indigo-600/5 transition-all">
                        <textarea
                            className="w-full max-h-40 bg-transparent border-none focus:ring-0 p-1 text-[15px] font-medium text-slate-700 placeholder:text-slate-400 resize-none leading-relaxed"
                            placeholder={chatbot ? `Ask ${chatbot.name} anything...` : "Select a chatbot from the sidebar to start chatting..."}
                            rows={1}
                            disabled={!chatbotId}
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && !e.shiftKey) {
                                    e.preventDefault();
                                    handleSend();
                                }
                            }}
                        />
                        <button
                            onClick={handleSend}
                            disabled={!input.trim() || !chatbotId}
                            className="bg-indigo-600 text-white p-3 rounded-2xl hover:bg-indigo-700 shadow-lg shadow-indigo-200 disabled:opacity-30 disabled:grayscale transition-all hover:scale-105 active:scale-95"
                        >
                            <HiPaperAirplane className="w-6 h-6 transform rotate-90" />
                        </button>
                    </div>
                    <div className="text-center mt-3">
                        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-tighter">
                            Powered by Gemini 1.5 Flash • Context: Documents
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
