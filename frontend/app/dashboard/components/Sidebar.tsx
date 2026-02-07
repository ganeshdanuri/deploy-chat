"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "../../context/AuthContext";
import {
    HiHome,
    HiDatabase,
    HiChatAlt2,
    HiDocumentText,
    HiSparkles,
    HiChartBar,
    HiCog,
    HiChevronDown,
    HiPlus,
    HiSearch,
    HiLightningBolt,
    HiLogout,
    HiQuestionMarkCircle
} from "react-icons/hi";
import { theme } from "../../theme";
import { useState } from "react";

const mainNavItems = [
    { id: "home", label: "Overview", path: "/dashboard", icon: HiHome },
    { id: "chatbots", label: "Chatbots", path: "/dashboard/chatbots", icon: HiChatAlt2 },
    { id: "datasets", label: "Datasets", path: "/dashboard/datasets", icon: HiDatabase },
    { id: "documents", label: "Documents", path: "/dashboard/documents", icon: HiDocumentText },
    { id: "playground", label: "Playground", path: "/dashboard/playground", icon: HiSparkles },
    { id: "analytics", label: "Analytics", path: "/dashboard/analytics", icon: HiChartBar },
];

const secondaryNavItems = [
    { id: "settings", label: "Settings", path: "/dashboard/settings", icon: HiCog },
    { id: "help", label: "Help & Support", path: "/dashboard/help", icon: HiQuestionMarkCircle },
];

export function Sidebar() {
    const pathname = usePathname();
    const { logout } = useAuth();
    const [isCollapsed, setIsCollapsed] = useState(false);

    return (
        <aside
            className={`h-screen border-r border-slate-200 bg-slate-50/50 flex flex-col transition-all duration-300 ${isCollapsed ? "w-20" : "w-64"}`}
        >
            {/* Workspace Selector / Brand */}
            <div className="h-16 flex items-center px-4 border-b border-slate-200">
                <div className="flex items-center gap-3 w-full p-2 hover:bg-slate-100 rounded-lg cursor-pointer transition-colors group">
                    <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center shrink-0 shadow-sm shadow-indigo-200">
                        <HiLightningBolt className="w-5 h-5 text-white" />
                    </div>
                    {!isCollapsed && (
                        <div className="flex-1 min-w-0">
                            <h2 className="text-sm font-semibold text-slate-900 truncate">Docking AI</h2>
                            <p className="text-xs text-slate-500 truncate">Enterprise Plan</p>
                        </div>
                    )}
                    {!isCollapsed && (
                        <HiChevronDown className="w-4 h-4 text-slate-400 group-hover:text-slate-600" />
                    )}
                </div>
            </div>

            {/* Main Navigation */}
            <div className="flex-1 overflow-y-auto py-6 px-3 space-y-6">
                {/* Primary Links */}
                <nav className="space-y-1">
                    {mainNavItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = pathname === item.path;

                        return (
                            <Link
                                key={item.id}
                                href={item.path}
                                className={`
                  relative group flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all
                  ${isActive
                                        ? "bg-white text-indigo-600 shadow-sm ring-1 ring-slate-200"
                                        : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                                    }
                `}
                            >
                                <Icon className={`w-5 h-5 shrink-0 transition-colors ${isActive ? "text-indigo-600" : "text-slate-400 group-hover:text-slate-600"}`} />
                                {!isCollapsed && <span>{item.label}</span>}
                                {isActive && !isCollapsed && (
                                    <div className="absolute right-2 w-1.5 h-1.5 rounded-full bg-indigo-600"></div>
                                )}
                            </Link>
                        );
                    })}
                </nav>

                {/* Separator / Categories */}
                {!isCollapsed && (
                    <div className="px-3">
                        <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">Workspace</div>
                        <div className="space-y-1">
                            <button className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg group">
                                <div className="w-5 h-5 rounded-md border border-slate-200 bg-white flex items-center justify-center text-[10px] font-bold text-slate-500 group-hover:border-indigo-300">P</div>
                                <span>Product Launch</span>
                            </button>
                            <button className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg group">
                                <div className="w-5 h-5 rounded-md border border-slate-200 bg-white flex items-center justify-center text-[10px] font-bold text-slate-500 group-hover:border-indigo-300">M</div>
                                <span>Marketing Q1</span>
                            </button>
                            <button className="w-full flex items-center gap-3 px-3 py-2 text-xs font-medium text-indigo-600 hover:text-indigo-700 mt-2">
                                <HiPlus className="w-3.5 h-3.5 mr-1.5" />
                                New Project
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Footer Navigation */}
            <div className="p-3 border-t border-slate-200 space-y-1">
                {secondaryNavItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.path;
                    return (
                        <Link
                            key={item.id}
                            href={item.path}
                            className={`
                  flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all
                  ${isActive
                                    ? "bg-white text-indigo-600 shadow-sm ring-1 ring-slate-200"
                                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                                }
                `}
                        >
                            <Icon className={`w-5 h-5 shrink-0 ${isActive ? "text-indigo-600" : "text-slate-400"}`} />
                            {!isCollapsed && <span>{item.label}</span>}
                        </Link>
                    );
                })}

                {/* User Profile Mini */}
                <div className="mt-4 pt-4 border-t border-slate-200">
                    <div className={`flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-slate-100 cursor-pointer transition-colors ${isCollapsed ? "justify-center" : ""}`}>
                        <div className="relative">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-xs font-bold text-white shadow-sm ring-2 ring-white">
                                CH
                            </div>
                            <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-green-500 border-2 border-white rounded-full"></div>
                        </div>
                        {!isCollapsed && (
                            <div className="flex-1 min-w-0">
                                <div className="text-sm font-medium text-slate-900 truncate">Courtney Henry</div>
                                <div className="text-xs text-slate-500 truncate">courtney@docking.ai</div>
                            </div>
                        )}
                        {!isCollapsed && (
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    logout();
                                }}
                                className="p-1 hover:bg-slate-200 rounded transition-colors text-slate-400 hover:text-red-500"
                                title="Logout"
                            >
                                <HiLogout className="w-4 h-4" />
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </aside>
    );
}
