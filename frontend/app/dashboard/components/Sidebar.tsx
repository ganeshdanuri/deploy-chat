"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "../../context/AuthContext";
import {
    HiHome,
    HiDatabase,
    HiChatAlt2,
    HiDocumentText,
    HiSparkles,
    HiChartBar,
    HiCog,
    HiPlus,
    HiLogout,
    HiQuestionMarkCircle,
    HiX,
    HiChevronLeft,
    HiChevronRight,
} from "react-icons/hi";
import { theme } from "../../theme";
import { useState } from "react";
import Logo from "../../components/Logo";

const mainNavItems = [
    { id: "home", label: "Overview", path: "/dashboard", icon: HiHome },
    { id: "documents", label: "Documents", path: "/dashboard/documents", icon: HiDocumentText },
    { id: "datasets", label: "Datasets", path: "/dashboard/datasets", icon: HiDatabase },
    { id: "chatbots", label: "Chatbots", path: "/dashboard/chatbots", icon: HiChatAlt2 },
    { id: "playground", label: "Playground", path: "/dashboard/playground", icon: HiSparkles },
    { id: "analytics", label: "Analytics", path: "/dashboard/analytics", icon: HiChartBar },
];

const secondaryNavItems = [
    { id: "settings", label: "Settings", path: "/dashboard/settings", icon: HiCog },
    { id: "help", label: "Help & Support", path: "/dashboard/help", icon: HiQuestionMarkCircle },
];

interface SidebarProps {
    isOpen?: boolean;
    onClose?: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
    const pathname = usePathname();
    const router = useRouter();
    const { logout } = useAuth();
    const [isCollapsed, setIsCollapsed] = useState(false);

    return (
        <aside
            className={`
                relative fixed inset-y-0 left-0 z-50 bg-slate-50 border-r border-slate-200 flex flex-col transition-all duration-300 transform
                lg:static lg:translate-x-0 lg:z-auto
                    ${isOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full"}
                    ${isCollapsed ? "lg:w-[72px]" : "lg:w-64"}
                w-64
            `}
        >
            {/* Workspace Selector / Brand */}
            <div className="h-16 flex items-center px-3 border-b border-slate-200 justify-between shrink-0">
                <div
                    className={`flex items-center gap-3 p-1.5 hover:bg-slate-100 rounded-lg cursor-pointer transition-colors group ${isCollapsed ? "justify-center w-full" : "flex-1 min-w-0"}`}
                    onClick={() => !isCollapsed && router.push("/dashboard")}
                >
                    <div className="shrink-0">
                        <Logo className="h-8 w-auto" />
                    </div>
                    {!isCollapsed && (
                        <div className="flex-1 min-w-0">
                            <h2 className="text-sm font-black tracking-tight truncate text-slate-900">
                                D<span style={{ color: "#4667ff" }}>E</span>PLOY M<span style={{ color: "#4667ff" }}>I</span>ND
                            </h2>
                            <p className="text-[10px] font-bold text-indigo-500 uppercase tracking-tighter">Enterprise</p>
                        </div>
                    )}
                </div>

                {/* Mobile Close Button */}
                <button
                    className="lg:hidden p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg shrink-0"
                    onClick={onClose}
                >
                    <HiX className="w-5 h-5" />
                </button>
            </div>

            {/* Main Navigation */}
            <div className="flex-1 overflow-y-auto py-4 px-2 space-y-6">
                {/* Primary Links */}
                <nav className="space-y-0.5">
                    {mainNavItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = pathname === item.path;

                        return (
                            <Link
                                key={item.id}
                                href={item.path}
                                title={isCollapsed ? item.label : undefined}
                                className={`
                                        relative group flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all
                                        ${isCollapsed ? "justify-center" : ""}
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

                                {/* Tooltip for collapsed state */}
                                {isCollapsed && (
                                    <div className="absolute left-full ml-3 px-2.5 py-1.5 bg-slate-800 text-white text-xs font-medium rounded-md opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50 shadow-lg">
                                        {item.label}
                                        <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1 w-2 h-2 bg-slate-800 rotate-45" />
                                    </div>
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
            <div className="p-2 border-t border-slate-200 space-y-0.5 shrink-0">
                {secondaryNavItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.path;
                    return (
                        <Link
                            key={item.id}
                            href={item.path}
                            title={isCollapsed ? item.label : undefined}
                            className={`
                                    relative group flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all
                                    ${isCollapsed ? "justify-center" : ""}
                                    ${isActive
                                    ? "bg-white text-indigo-600 shadow-sm ring-1 ring-slate-200"
                                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                                }
                                `}
                        >
                            <Icon className={`w-5 h-5 shrink-0 ${isActive ? "text-indigo-600" : "text-slate-400"}`} />
                            {!isCollapsed && <span>{item.label}</span>}

                            {/* Tooltip for collapsed state */}
                            {isCollapsed && (
                                <div className="absolute left-full ml-3 px-2.5 py-1.5 bg-slate-800 text-white text-xs font-medium rounded-md opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50 shadow-lg">
                                    {item.label}
                                    <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1 w-2 h-2 bg-slate-800 rotate-45" />
                                </div>
                            )}
                        </Link>
                    );
                })}

                {/* User Profile Mini */}
                <div className="mt-2 pt-2 border-t border-slate-200">
                    <div className={`flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-slate-100 cursor-pointer transition-colors ${isCollapsed ? "justify-center" : ""}`}>
                        <div className="relative shrink-0">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-xs font-bold text-white shadow-sm ring-2 ring-white">
                                CH
                            </div>
                            <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-green-500 border-2 border-white rounded-full"></div>
                        </div>
                        {!isCollapsed && (
                            <div className="flex-1 min-w-0">
                                <div className="text-sm font-medium text-slate-900 truncate">Courtney Henry</div>
                                <div className="text-xs text-slate-500 truncate">courtney@deploymind.ai</div>
                            </div>
                        )}
                        {!isCollapsed && (
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    logout();
                                }}
                                className="p-1 hover:bg-slate-200 rounded transition-colors text-slate-400 hover:text-red-500 shrink-0"
                                title="Logout"
                            >
                                <HiLogout className="w-4 h-4" />
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Desktop Collapse Toggle — fixed arrow tab on the right edge */}
            <button
                className="hidden lg:flex absolute -right-3.5 top-1/2 -translate-y-1/2 w-7 h-7 items-center justify-center bg-white border border-slate-200 rounded-full shadow-md text-slate-500 hover:text-indigo-600 hover:border-indigo-300 hover:shadow-indigo-100 transition-all z-10"
                onClick={() => setIsCollapsed(!isCollapsed)}
                title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
                {isCollapsed ? (
                    <HiChevronRight className="w-4 h-4" />
                ) : (
                    <HiChevronLeft className="w-4 h-4" />
                )}
            </button>
        </aside>
    );
}
