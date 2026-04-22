"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "../../context/AuthContext";
import { LogOut, X, ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import Logo from "../../components/Logo";
import { useAppSelector } from "@/lib/store/hooks";
import {
    SIDEBAR_MAIN_NAV as mainNavItems,
    SIDEBAR_SECONDARY_NAV as secondaryNavItems,
    SIDEBAR_SETTINGS_NAV as settingsNavItems,
} from "@/lib/constants";

interface SidebarProps {
    isOpen?: boolean;
    onClose?: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
    const pathname = usePathname();
    const router = useRouter();
    const searchParams = useSearchParams();
    const currentTab = searchParams.get("tab") ||"general";
    const { logout } = useAuth();
    const [isCollapsed, setIsCollapsed] = useState(false);
    const { data: userData } = useAppSelector((state) => state.user);

    const plan = userData?.billing?.current_plan ||"Free";
    const isFreePlan = plan.toLowerCase() === "free" || plan.toLowerCase() === "trial";

    return (
        <aside
            className={`
                fixed lg:static inset-y-0 left-0 z-50 bg-background border-r border-border
                flex flex-col transition-all duration-200
                ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
                ${isCollapsed ? "lg:w-[68px]" : "lg:w-60"}
                w-60
            `}
>
            {/* Brand */}
            <div className="h-14 flex items-center px-3 border-b border-border justify-between shrink-0">
                <div
                    className={`flex items-center gap-2.5 p-1.5 hover:bg-muted rounded-md cursor-pointer transition-colors ${
                        isCollapsed ? "justify-center w-full" : "flex-1 min-w-0"
                    }`}
                    onClick={() => !isCollapsed && router.push("/dashboard")}
>
                    <Logo className="h-7 w-auto shrink-0" />
                    {!isCollapsed && (
                        <div className="flex-1 min-w-0">
                            <h2 className="text-[13px] font-medium tracking-tight truncate">
                                Deploy Chat
                            </h2>
                        </div>
                    )}
                </div>

                {/* Mobile close */}
                <button
                    className="lg:hidden p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted rounded-md"
                    onClick={onClose}
>
                    <X className="w-5 h-5" strokeWidth={1.75} />
                </button>

                {/* Desktop collapse toggle — lives inside the header */}
                <button
                    className="hidden lg:flex p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted rounded-md transition-colors shrink-0"
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
>
                    {isCollapsed
                        ? <ChevronRight className="w-4 h-4" strokeWidth={1.75} />
                        : <ChevronLeft className="w-4 h-4" strokeWidth={1.75} />
                    }
                </button>
            </div>

            {/* Main nav */}
            <div className="flex-1 overflow-y-auto py-4 px-2 space-y-5">
                <nav className="space-y-0.5">
                    {mainNavItems.map((item) => {
                        const Icon = item.icon;
                        const isActive =
                            item.path === "/dashboard"
                                ? pathname === "/dashboard"
                                : pathname === item.path || pathname.startsWith(item.path +"/");
                        const isDisabled = item.id === "analytics" && isFreePlan;

                        return (
                            <Link
                                key={item.id}
                                href={isDisabled ? "#" : item.path}
                                onClick={isDisabled ? (e) => e.preventDefault() : undefined}
                                title={isCollapsed ? (isDisabled ? `${item.label} (Pro)` : item.label) : undefined}
                                className={`
                                    group flex items-center gap-2.5 px-2.5 py-2 rounded-md text-[13px] font-medium transition-colors relative
                                    ${isCollapsed ? "justify-center" : ""}
                                    ${isDisabled
                                        ? "opacity-50 cursor-not-allowed text-muted-foreground"
                                        : isActive
                                            ? "bg-muted text-foreground"
                                            : "text-muted-foreground hover:text-foreground hover:bg-muted"
                                    }
                                `}
                                style={
                                    isActive && !isDisabled
                                        ? {
                                              color: "var(--brand)",
                                              background: "var(--brand-bg)",
                                          }
                                        : undefined
                                }
>
                                <Icon
                                    className="w-4 h-4 shrink-0"
                                    strokeWidth={1.75}
                                    style={
                                        isActive && !isDisabled
                                            ? { color: "var(--brand)" }
                                            : undefined
                                    }
                                />
                                {!isCollapsed && (
                                    <div className="flex flex-1 items-center justify-between">
                                        <span>{item.label}</span>
                                        {isDisabled && (
                                            <span className="text-[9px] font-medium text-muted-foreground border border-border px-1.5 py-0.5 rounded uppercase tracking-wider">
                                                Pro
                                            </span>
                                        )}
                                    </div>
                                )}
                            </Link>
                        );
                    })}
                </nav>

                {/* Settings */}
                <div>
                    {!isCollapsed && (
                        <div className="text-[10px] font-medium text-muted-foreground mb-2 px-2.5">
                            Settings
                        </div>
                    )}
                    <nav className="space-y-0.5">
                        {settingsNavItems.map((item) => {
                            const Icon = item.icon;
                            const isSettingsPath = pathname === "/dashboard/settings";
                            const isActive = isSettingsPath ? currentTab === item.id : pathname === item.path;

                            return (
                                <Link
                                    key={item.id}
                                    href={item.path ||"#"}
                                    className={`
                                        group flex items-center gap-2.5 px-2.5 py-2 rounded-md text-[13px] font-medium transition-colors
                                        ${isCollapsed ? "justify-center" : ""}
                                        ${isActive
                                            ? "bg-muted text-foreground"
                                            : "text-muted-foreground hover:text-foreground hover:bg-muted"
                                        }
                                    `}
                                    title={isCollapsed ? item.label : undefined}
>
                                    <Icon className="w-4 h-4 shrink-0" strokeWidth={1.75} />
                                    {!isCollapsed && <span>{item.label}</span>}
                                </Link>
                            );
                        })}
                    </nav>
                </div>
            </div>

            {/* Footer */}
            <div className="p-2 border-t border-border shrink-0 space-y-0.5">
                {secondaryNavItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.path;
                    return (
                        <Link
                            key={item.id}
                            href={item.path}
                            title={isCollapsed ? item.label : undefined}
                            className={`
                                group flex items-center gap-2.5 px-2.5 py-2 rounded-md text-[13px] font-medium transition-colors
                                ${isCollapsed ? "justify-center" : ""}
                                ${isActive
                                    ? "bg-muted text-foreground"
                                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                                }
                            `}
>
                            <Icon className="w-4 h-4 shrink-0" strokeWidth={1.75} />
                            {!isCollapsed && <span>{item.label}</span>}
                        </Link>
                    );
                })}

                {/* User */}
                <div className="mt-2 pt-2 border-t border-border">
                    <div
                        className={`flex items-center gap-2.5 px-1.5 py-1.5 rounded-md hover:bg-muted cursor-pointer transition-colors ${
                            isCollapsed ? "justify-center" : ""
                        }`}
                        onClick={() => router.push("/dashboard/settings")}
>
                        <div className="relative shrink-0">
                            <div className="w-8 h-8 bg-foreground text-background flex items-center justify-center text-[11px] font-medium rounded-md">
                                {userData?.profile?.username?.substring(0, 2).toUpperCase() || "??"}
                            </div>
                            <div className="absolute -bottom-0.5 -right-0.5 w-2 h-2 bg-green-500 rounded-full ring-2 ring-background" />
                        </div>
                        {!isCollapsed && (
                            <>
                                <div className="flex-1 min-w-0">
                                    <div className="text-[13px] font-medium text-foreground truncate">
                                        {userData?.profile?.username ||"User"}
                                    </div>
                                    <div className="text-[11px] text-muted-foreground truncate capitalize">
                                        {plan} Plan
                                    </div>
                                </div>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        logout();
                                    }}
                                    className="p-1 hover:bg-background rounded-md text-muted-foreground hover:text-destructive transition-colors shrink-0"
                                    title="Logout"
>
                                    <LogOut className="w-4 h-4" strokeWidth={1.75} />
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </div>

        </aside>
    );
}
