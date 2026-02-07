"use client";

import { HiChatAlt2, HiPlus, HiSearch, HiDotsVertical, HiFilter, HiCog } from "react-icons/hi";

export default function ChatbotsPage() {
    const chatbots = [
        { id: "1", name: "Customer Support Bot", status: "active", model: "GPT-4", usage: "12.5k tokens", lastActive: "2 mins ago" },
        { id: "2", name: "Internal HR Helper", status: "active", model: "Claude 3 Sonnet", usage: "8.2k tokens", lastActive: "1 hour ago" },
        { id: "3", name: "Sales Assistant", status: "inactive", model: "GPT-3.5 Turbo", usage: "0 tokens", lastActive: "3 days ago" },
        { id: "4", name: "Doc Analysis Bot", status: "training", model: "GPT-4", usage: "0 tokens", lastActive: "Just now" },
    ];

    return (
        <div className="space-y-6 animate-fade-in-up">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Chatbots</h1>
                    <p className="text-sm text-slate-500 mt-1">Manage, train and deploy your AI assistants.</p>
                </div>
                <div className="flex gap-2">
                    <button className="px-3 py-2 bg-white border border-slate-200 text-slate-700 text-sm font-semibold rounded-lg shadow-sm hover:bg-slate-50 transition-all flex items-center gap-2">
                        <HiFilter className="w-4 h-4 text-slate-400" />
                        Filter
                    </button>
                    <button className="px-4 py-2 bg-indigo-600 text-white text-sm font-semibold rounded-lg shadow-sm shadow-indigo-200 hover:bg-indigo-700 hover:shadow-md transition-all flex items-center gap-2">
                        <HiPlus className="w-4 h-4" />
                        New Chatbot
                    </button>
                </div>
            </div>

            {/* Main Content Card */}
            <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden flex flex-col">
                {/* Simple Toolbar */}
                <div className="p-4 border-b border-slate-200 flex items-center gap-4 bg-slate-50/50">
                    <div className="relative flex-1 max-w-md">
                        <HiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                        <input
                            type="text"
                            placeholder="Search chatbots..."
                            className="w-full pl-9 pr-4 py-1.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                        />
                    </div>
                    <div className="flex items-center gap-2 ml-auto">
                        <span className="text-xs font-medium text-slate-500">Sort by:</span>
                        <select className="text-xs font-semibold text-slate-700 bg-transparent border-none focus:ring-0 cursor-pointer">
                            <option>Last Active</option>
                            <option>Name</option>
                            <option>Usage</option>
                        </select>
                    </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 border-b border-slate-200 text-xs uppercase text-slate-500 font-semibold tracking-wider">
                                <th className="px-6 py-3">Name</th>
                                <th className="px-6 py-3">Status</th>
                                <th className="px-6 py-3">Model</th>
                                <th className="px-6 py-3">Usage</th>
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
                                                <div className="text-xs text-slate-500">Last active {bot.lastActive}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        {bot.status === 'active' && (
                                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-100">
                                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                                                Active
                                            </span>
                                        )}
                                        {bot.status === 'inactive' && (
                                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-600 border border-slate-200">
                                                <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
                                                Inactive
                                            </span>
                                        )}
                                        {bot.status === 'training' && (
                                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-50 text-amber-700 border border-amber-100">
                                                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-bounce"></span>
                                                Training
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 font-medium text-slate-700">
                                        {bot.model}
                                    </td>
                                    <td className="px-6 py-4 font-mono text-xs text-slate-500">
                                        {bot.usage}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-white border border-transparent hover:border-slate-200 rounded-lg shadow-sm transition-all" title="Settings">
                                                <HiCog className="w-4 h-4" />
                                            </button>
                                            <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-white border border-transparent hover:border-slate-200 rounded-lg shadow-sm transition-all">
                                                <HiDotsVertical className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {/* Footer Pagination (Visual only) */}
                <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
                    <span className="text-xs text-slate-500">Showing <span className="font-medium text-slate-900">1-4</span> of <span className="font-medium text-slate-900">12</span> chatbots</span>
                    <div className="flex gap-2">
                        <button className="px-3 py-1 bg-white border border-slate-200 rounded text-xs font-medium text-slate-600 disabled:opacity-50" disabled>Previous</button>
                        <button className="px-3 py-1 bg-white border border-slate-200 rounded text-xs font-medium text-slate-600 hover:bg-slate-50">Next</button>
                    </div>
                </div>
            </div>
        </div>
    );
}
