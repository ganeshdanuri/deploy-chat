"use client";

import { useState, useEffect } from "react";
import { HiChatAlt2, HiPlus, HiSearch, HiRefresh, HiSparkles, HiTrash, HiCog } from "react-icons/hi";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/lib/store/store";
import { fetchChatbots, deleteChatbot } from "@/lib/store/slices/chatbotsSlice";
import CreateChatbotModal from "@/app/components/CreateChatbotModal";

export default function ChatbotsPage() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const dispatch = useDispatch<AppDispatch>();
    const { items: chatbots, status, error } = useSelector((state: RootState) => state.chatbots);
    const isLoading = status === 'loading';

    useEffect(() => {
        dispatch(fetchChatbots());
    }, [dispatch]);


    const handleDelete = async (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        if (confirm("Are you sure you want to delete this chatbot?")) {
            await dispatch(deleteChatbot(id));
        }
    };

    return (
        <div className="space-y-6 animate-fade-in-up">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Chatbots</h1>
                    <p className="text-sm text-slate-500 mt-1">Manage, train and deploy your AI assistants.</p>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={() => dispatch(fetchChatbots())}
                        className="px-3 py-2 bg-white border border-slate-200 text-slate-700 text-sm font-semibold rounded-lg shadow-sm hover:bg-slate-50 transition-all flex items-center gap-2"
                    >
                        <HiRefresh className="w-4 h-4 text-slate-400" />
                        Refresh
                    </button>
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="px-4 py-2 bg-indigo-600 text-white text-sm font-semibold rounded-lg shadow-sm shadow-indigo-200 hover:bg-indigo-700 hover:shadow-md transition-all flex items-center gap-2"
                    >
                        <HiPlus className="w-4 h-4" />
                        New Chatbot
                    </button>
                </div>
            </div>

            {isLoading && chatbots.length === 0 ? (
                <div className="flex items-center justify-center py-20">
                    <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                </div>
            ) : chatbots.length === 0 ? (
                /* Empty State */
                <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border-2 border-dashed border-slate-200">
                    <div className="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 mb-4">
                        <HiSparkles className="w-8 h-8" />
                    </div>
                    <h2 className="text-xl font-bold text-slate-900 mb-2">No chatbots active</h2>
                    <p className="text-slate-500 max-w-sm text-center mb-8">
                        Once you've uploaded documents and created datasets, you can build your first AI chatbot.
                    </p>
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="px-6 py-3 bg-indigo-600 text-white text-sm font-bold rounded-xl shadow-lg shadow-indigo-200 hover:bg-indigo-700 hover:-translate-y-0.5 transition-all flex items-center gap-2"
                    >
                        <HiPlus className="w-5 h-5" />
                        Create your first chatbot
                    </button>
                </div>
            ) : (
                /* Main Content Card */
                <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden flex flex-col">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50 border-b border-slate-200 text-xs uppercase text-slate-500 font-semibold tracking-wider">
                                    <th className="px-6 py-3">Name</th>
                                    <th className="px-6 py-3">Status</th>
                                    <th className="px-6 py-3">Created At</th>
                                    <th className="px-6 py-3 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 text-sm text-slate-600">
                                {chatbots.map((bot) => (
                                    <tr key={bot.id} className="group hover:bg-slate-50/80 transition-colors cursor-pointer">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-indigo-50 to-slate-100 border border-slate-200 flex items-center justify-center text-indigo-600 shadow-sm">
                                                    <HiChatAlt2 className="w-5 h-5" />
                                                </div>
                                                <div>
                                                    <div className="font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors">{bot.name}</div>
                                                    <div className="text-xs text-slate-500">AI Assistant</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-100">
                                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                                                Active
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 font-mono text-xs text-slate-500">
                                            {new Date(bot.created_at).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button
                                                    onClick={() => window.location.href = `/dashboard/playground?chatbotId=${bot.id}`}
                                                    className="px-3 py-1.5 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-600 hover:text-white transition-all text-xs font-bold flex items-center gap-1.5 shadow-sm border border-indigo-100"
                                                >
                                                    <HiSparkles className="w-3.5 h-3.5" />
                                                    Test
                                                </button>
                                                <button className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-white border border-transparent hover:border-slate-200 rounded-lg shadow-sm transition-all" title="Settings">
                                                    <HiCog className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={(e) => handleDelete(bot.id, e)}
                                                    className="p-2 text-slate-400 hover:text-red-500 hover:bg-white border border-transparent hover:border-slate-200 rounded-lg shadow-sm transition-all"
                                                    title="Delete"
                                                >
                                                    <HiTrash className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            <CreateChatbotModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            />
        </div>
    );
}
