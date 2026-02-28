"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "../../context/AuthContext";
import {
    HiLogout,
    HiX,
    HiChevronLeft,
    HiChevronRight,
} from "react-icons/hi";
import { useState } from "react";
import Logo from "../../components/Logo";
import { useAppSelector } from "@/lib/store/hooks";
import { theme } from "../../theme";
import {
    SIDEBAR_MAIN_NAV as mainNavItems,
    SIDEBAR_SECONDARY_NAV as secondaryNavItems,
    SIDEBAR_SETTINGS_NAV as settingsNavItems,
    TOOLTIP_STYLE_CLASSES,
    TOOLTIP_ARROW_CLASSES
} from "@/lib/constants";


interface SidebarProps {
    isOpen?: boolean;
    onClose?: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
    const pathname = usePathname();
    const router = useRouter();
    const searchParams = useSearchParams();
    const currentTab = searchParams.get("tab") || "general";
    const { logout } = useAuth();
    const [isCollapsed, setIsCollapsed] = useState(false);
    const { data: userData } = useAppSelector((state) => state.user);

    return (
        <aside
            className={`
                fixed lg:static inset-y-0 left-0 z-50 bg-slate-50 border-r border-slate-100 flex flex-col transition-all duration-300 transform
                ${isOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full lg:translate-x-0"}
                ${isCollapsed ? "lg:w-[72px]" : "lg:w-64"}
                w-64
            `}
        >
            {/* Workspace Selector / Brand */}
            <div className="h-16 flex items-center px-3 border-b border-slate-100 justify-between shrink-0">
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
                                D<span style={{ color: "#4667ff" }}>E</span>PLOY C<span style={{ color: "#4667ff" }}>H</span>AT
                            </h2>
                            <p className="text-[10px] font-bold uppercase tracking-tighter" style={{ color: theme.colors.primary.main }}>
                                {userData?.billing?.current_plan || "Free"}
                            </p>
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
                        const isFreePlan = !userData?.billing?.current_plan || userData?.billing?.current_plan.toLowerCase() === "free" || userData?.billing?.current_plan.toLowerCase() === "trial";
                        const isDisabled = item.id === "analytics" && isFreePlan;

                        return (
                            <Link
                                key={item.id}
                                href={isDisabled ? "#" : item.path}
                                onClick={isDisabled ? (e) => e.preventDefault() : undefined}
                                title={isCollapsed ? (isDisabled ? `${item.label} (Pro)` : item.label) : undefined}
                                className={`
                                        relative group flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all
                                        ${isCollapsed ? "justify-center" : ""}
                                        ${isDisabled
                                        ? "opacity-50 cursor-not-allowed text-slate-400"
                                        : isActive
                                            ? "bg-white shadow-sm ring-1 ring-slate-100"
                                            : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                                    }
                                    `}
                                style={isActive && !isDisabled ? { color: theme.colors.primary.main } : {}}
                            >
                                <Icon
                                    className={`w-5 h-5 shrink-0 transition-colors ${isActive && !isDisabled ? "" : "text-slate-400 group-hover:text-slate-600"}`}
                                    style={isActive && !isDisabled ? { color: theme.colors.primary.main } : {}}
                                />
                                {!isCollapsed && (
                                    <div className="flex flex-1 items-center justify-between">
                                        <span>{item.label}</span>
                                        {isDisabled && (
                                            <span className="text-[9px] font-bold bg-slate-200 text-slate-500 px-1.5 py-0.5 rounded uppercase tracking-wider">Pro</span>
                                        )}
                                    </div>
                                )}
                                {isActive && !isCollapsed && !isDisabled && (
                                    <div className="absolute right-2 w-1.5 h-1.5 rounded-full" style={{ backgroundColor: theme.colors.primary.main }}></div>
                                )}

                                {/* Tooltip for collapsed state */}
                                {isCollapsed && (
                                    <div className={`absolute left-full ml-3 px-3 py-1.5 opacity-0 group-hover:opacity-100 transition-all ${TOOLTIP_STYLE_CLASSES} translate-x-1 group-hover:translate-x-0`}>
                                        {isDisabled ? `${item.label} (Pro)` : item.label}
                                        <div className={`absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1 w-2 h-2 border-l border-b ${TOOLTIP_ARROW_CLASSES}`} />
                                    </div>
                                )}
                            </Link>
                        );
                    })}
                </nav>

                {/* Settings Section */}
                <div className={`${isCollapsed ? "px-2" : "px-3"}`}>
                    {!isCollapsed && <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">Settings</div>}
                    <nav className="space-y-0.5">
                        {settingsNavItems.map((item) => {
                            const Icon = item.icon;
                            const isSettingsPath = pathname === "/dashboard/settings";
                            const isActive = isSettingsPath ? currentTab === item.id : pathname === item.path;

                            return (
                                <Link
                                    key={item.id}
                                    href={item.path || "#"}
                                    className={`
                                        relative group flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all
                                        ${isCollapsed ? "justify-center" : ""}
                                        ${isActive
                                            ? "bg-white shadow-sm ring-1 ring-slate-100"
                                            : "text-slate-500 hover:text-slate-900 hover:bg-slate-100"
                                        }
                                    `}
                                    style={isActive ? { color: theme.colors.primary.main } : {}}
                                >
                                    <Icon
                                        className={`w-4 h-4 shrink-0 transition-colors ${isActive ? "" : "text-slate-400 group-hover:text-slate-500"}`}
                                        style={isActive ? { color: theme.colors.primary.main } : {}}
                                    />
                                    {!isCollapsed && <span className="text-[13px]">{item.label}</span>}

                                    {/* Tooltip for collapsed state */}
                                    {isCollapsed && (
                                        <div className={`absolute left-full ml-3 px-3 py-1.5 opacity-0 group-hover:opacity-100 transition-all ${TOOLTIP_STYLE_CLASSES} translate-x-1 group-hover:translate-x-0`}>
                                            {item.label}
                                            <div className={`absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1 w-2 h-2 border-l border-b ${TOOLTIP_ARROW_CLASSES}`} />
                                        </div>
                                    )}
                                </Link>
                            );
                        })}
                    </nav>
                </div>
            </div>

            {/* Footer Navigation */}
            <div className="p-2 border-t border-slate-100 space-y-0.5 shrink-0">
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
                                    ? "bg-white shadow-sm ring-1 ring-slate-100"
                                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                                }
                                `}
                            style={isActive ? { color: theme.colors.primary.main } : {}}
                        >
                            <Icon
                                className={`w-5 h-5 shrink-0 ${isActive ? "" : "text-slate-400"}`}
                                style={isActive ? { color: theme.colors.primary.main } : {}}
                            />
                            {!isCollapsed && <span>{item.label}</span>}

                            {/* Tooltip for collapsed state */}
                            {isCollapsed && (
                                <div className={`absolute left-full ml-3 px-3 py-1.5 opacity-0 group-hover:opacity-100 transition-all ${TOOLTIP_STYLE_CLASSES} translate-x-1 group-hover:translate-x-0`}>
                                    {item.label}
                                    <div className={`absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1 w-2 h-2 border-l border-b ${TOOLTIP_ARROW_CLASSES}`} />
                                </div>
                            )}
                        </Link>
                    );
                })}

                {/* User Profile Mini */}
                <div className="mt-2 pt-2 border-t border-slate-100">
                    <div
                        className={`flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-slate-100 cursor-pointer transition-colors ${isCollapsed ? "justify-center" : ""}`}
                        onClick={() => router.push("/dashboard/settings")}
                    >
                        <div className="relative shrink-0">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-xs font-bold text-white shadow-sm ring-2 ring-white">
                                {userData?.profile?.username?.substring(0, 2).toUpperCase() || "??"}
                            </div>
                            <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-green-500 border-2 border-white rounded-full"></div>
                        </div>
                        {!isCollapsed && (
                            <div className="flex-1 min-w-0">
                                <div className="text-sm font-medium text-slate-900 truncate">
                                    {userData?.profile?.username || "User"}
                                </div>
                                <div className="text-xs text-slate-500 truncate capitalize">
                                    {userData?.billing?.current_plan || "free"} Plan
                                </div>
                            </div>
                        )}
                        {!isCollapsed && (
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    logout();
                                }}
                                className="relative group p-1 hover:bg-slate-200 rounded transition-colors text-slate-400 hover:text-red-500 shrink-0"
                            >
                                <HiLogout className="w-4 h-4" />
                                <div className={`absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1 opacity-0 group-hover:opacity-100 transition-all ${TOOLTIP_STYLE_CLASSES} translate-y-1 group-hover:translate-y-0`}>
                                    Logout
                                    <div className={`absolute top-full left-1/2 -translate-x-1/2 -translate-y-1 w-2 h-2 border-r border-b ${TOOLTIP_ARROW_CLASSES}`} />
                                </div>
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Desktop Collapse Toggle — fixed arrow tab on the right edge */}
            <button
                className="hidden lg:flex absolute -right-3.5 top-1/2 -translate-y-1/2 w-7 h-7 items-center justify-center bg-white border border-slate-100 rounded-full shadow-md text-slate-500 hover:text-indigo-600 hover:border-indigo-300 hover:shadow-indigo-100 transition-all z-10"
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
