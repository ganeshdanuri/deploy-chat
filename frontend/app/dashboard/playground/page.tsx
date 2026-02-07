"use client";

import { useState, useEffect } from "react";
import { HiSparkles, HiPaperAirplane, HiRefresh, HiCog, HiUser, HiChatAlt2, HiLightningBolt } from "react-icons/hi";
import { useSearchParams } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "@/lib/store/store";
import { fetchChatbots } from "@/lib/store/slices/chatbotsSlice";

interface Message {
    id: number;
    text: string;
    isBot: boolean;
    isThinking?: boolean;
}

export default function PlaygroundPage() {
    const searchParams = useSearchParams();
    const chatbotId = searchParams.get("chatbotId");
    const dispatch = useDispatch<AppDispatch>();

    const { items: chatbots, status } = useSelector((state: RootState) => state.chatbots);
    const chatbot = chatbots.find(b => b.id === chatbotId);

    const [messages, setMessages] = useState<Message[]>([
        { id: 1, text: "Hello! I'm your AI assistant. How can I help you today?", isBot: true },
    ]);
    const [input, setInput] = useState("");

    useEffect(() => {
        if (status === 'idle') {
            dispatch(fetchChatbots());
        }
    }, [status, dispatch]);

    const handleSend = () => {
        if (!input.trim()) return;
        setMessages([...messages, { id: Date.now(), text: input, isBot: false }]);
        setInput("");

        // Simulate thinking state
        setTimeout(() => {
            setMessages(prev => [...prev, { id: Date.now() + 1, text: "Thinking...", isBot: true, isThinking: true }]);

            // Simulate response
            setTimeout(() => {
                setMessages(prev => {
                    const newMsgs = prev.filter(m => !m.isThinking);
                    return [...newMsgs, { id: Date.now() + 2, text: chatbot ? `I'm analyzing your request as ${chatbot.name}. This is a simulated response based on the knowledge provided in your datasets.` : "I can certainly help with that. Could you specify which dataset you are referring to?", isBot: true }];
                });
            }, 1000);
        }, 500);
    };

    return (
        <div className="h-[calc(100vh-8rem)] flex gap-6 animate-fade-in-up">
            {/* Main Chat Area */}
            <div className="flex-1 flex flex-col bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden relative">
                {/* Chat Header */}
                <div className="p-4 border-b border-slate-200 flex justify-between items-center bg-white z-10 sticky top-0">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 border border-indigo-200 shadow-sm">
                            <HiSparkles className="w-5 h-5" />
                        </div>
                        <div>
                            <h2 className="text-sm font-bold text-slate-900">{chatbot ? chatbot.name : "Playground"}</h2>
                            <div className="flex items-center gap-1.5">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                                <span className="text-xs text-slate-500 font-medium">
                                    {chatbot ? "Active and Ready" : "Select a chatbot to start"}
                                </span>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setMessages([{ id: 1, text: "Messages cleared. How can I help you today?", isBot: true }])}
                            className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-slate-50 rounded-lg transition-all" title="Reset Chat"
                        >
                            <HiRefresh className="w-5 h-5" />
                        </button>
                        <button className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-slate-50 rounded-lg transition-all" title="Settings">
                            <HiCog className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {/* Messages Area */}
                <div className="flex-1 p-6 bg-slate-50/50 space-y-6 overflow-y-auto scroll-smooth">
                    {messages.map((msg: any) => (
                        <div key={msg.id} className={`flex gap-4 ${!msg.isBot ? "flex-row-reverse" : ""}`}>
                            {/* Avatar */}
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 border shadow-sm ${msg.isBot ? "bg-white border-slate-200 text-indigo-600" : "bg-indigo-600 border-indigo-700 text-white"}`}>
                                {msg.isBot ? <HiChatAlt2 className="w-4 h-4" /> : <HiUser className="w-4 h-4" />}
                            </div>

                            {/* Message Bubble */}
                            <div className={`max-w-[75%] space-y-1 ${!msg.isBot ? "items-end flex flex-col" : ""}`}>
                                <div className={`px-5 py-3.5 rounded-2xl text-sm leading-relaxed shadow-sm ${msg.isBot
                                    ? "bg-white border border-slate-200 text-slate-700 rounded-tl-none"
                                    : "bg-indigo-600 text-white rounded-tr-none"
                                    }`}>
                                    {msg.isThinking ? (
                                        <div className="flex gap-1.5 py-1">
                                            <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce delay-0"></div>
                                            <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce delay-100"></div>
                                            <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce delay-200"></div>
                                        </div>
                                    ) : (
                                        msg.text
                                    )}
                                </div>
                                {!msg.isThinking && (
                                    <span className="text-[10px] text-slate-400 font-mono font-medium px-1">
                                        {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                )}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Input Area */}
                <div className="p-4 bg-white border-t border-slate-200">
                    <div className="relative flex items-end gap-2 max-w-4xl mx-auto border border-slate-300 rounded-xl px-4 py-3 bg-white shadow-sm focus-within:ring-2 focus-within:ring-indigo-500/20 focus-within:border-indigo-500 transition-all">
                        <button className="p-2 -ml-2 text-slate-400 hover:text-indigo-600 rounded-lg transition-colors">
                            <HiLightningBolt className="w-5 h-5" />
                        </button>
                        <textarea
                            className="w-full max-h-32 bg-transparent border-none focus:ring-0 p-2 text-sm text-slate-700 placeholder:text-slate-400 resize-none leading-normal"
                            placeholder={chatbot ? `Message ${chatbot.name}...` : "Type your message here... (Enter to send)"}
                            rows={1}
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
                            disabled={!input.trim()}
                            className="p-2 -mr-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                        >
                            <HiPaperAirplane className="w-4 h-4 transform rotate-90" />
                        </button>
                    </div>
                    <div className="text-center mt-2">
                        <p className="text-[10px] text-slate-400">AI can make mistakes. Verify important information.</p>
                    </div>
                </div>
            </div>

            {/* Settings Sidebar (Configuration) */}
            <div className="w-80 bg-white rounded-2xl border border-slate-200 shadow-sm p-5 hidden xl:flex flex-col h-full overflow-y-auto">
                <h3 className="text-sm font-bold text-slate-900 mb-6 flex items-center gap-2">
                    <HiCog className="w-4 h-4 text-slate-500" />
                    Configuration
                </h3>

                <div className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-xs font-semibold text-slate-700">Model</label>
                        <select className="w-full text-sm border-slate-200 rounded-lg focus:ring-indigo-500 bg-slate-50">
                            <option>GPT-4 Turbo</option>
                            <option>GPT-3.5 Turbo</option>
                            <option>Claude 3 Sonnet</option>
                        </select>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-semibold text-slate-700">Persona / System Prompt</label>
                        <textarea
                            className="w-full text-sm border-slate-200 rounded-lg focus:ring-indigo-500 bg-slate-50 h-32 p-3"
                            defaultValue="You are a helpful customer support agent for Docking AI. Be polite, concise, and professional."
                        />
                    </div>

                    <div className="space-y-4 pt-4 border-t border-slate-200">
                        <div className="flex items-center justify-between">
                            <label className="text-xs font-semibold text-slate-700">Temperature</label>
                            <span className="text-xs font-mono bg-slate-100 px-1.5 py-0.5 rounded text-slate-600">0.7</span>
                        </div>
                        <input type="range" min="0" max="1" step="0.1" defaultValue="0.7" className="w-full accent-indigo-600 h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer" />
                    </div>

                    {chatbot && (
                        <div className="space-y-4 pt-4 border-t border-slate-200">
                            <label className="text-xs font-semibold text-slate-700">Information</label>
                            <div className="text-xs text-slate-500 space-y-2">
                                <p><span className="font-bold">ID:</span> {chatbot.id}</p>
                                <p><span className="font-bold">Created:</span> {new Date(chatbot.created_at).toLocaleDateString()}</p>
                            </div>
                        </div>
                    )}
                </div>

                <div className="mt-auto pt-6">
                    <button className="w-full py-2 bg-slate-900 text-white text-xs font-bold uppercase tracking-wider rounded-lg shadow-md hover:bg-slate-800 transition-all">
                        Save Configuration
                    </button>
                </div>
            </div>
        </div>
    );
}
