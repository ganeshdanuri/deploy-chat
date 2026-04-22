"use client";

import { Search, Bell, HelpCircle, Menu, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";
import showToast from "@/lib/toast";
import { useAppSelector } from "@/lib/store/hooks";
import { Button } from "@/components/ui/button";

interface TopNavProps {
    onMenuClick?: () => void;
}

export function TopNav({ onMenuClick }: TopNavProps) {
    const router = useRouter();
    const { data: userData } = useAppSelector((state) => state.user);
    const plan = userData?.billing?.current_plan || "Free";

    return (
        <header className="h-14 bg-background border-b border-border flex items-center justify-between px-4 sm:px-6 sticky top-0 z-30">
            <div className="flex-1 max-w-xl flex items-center gap-2 sm:gap-3">
                <button
                    className="lg:hidden p-2 -ml-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors"
                    onClick={onMenuClick}
                    aria-label="Menu"
                >
                    <Menu className="w-5 h-5" strokeWidth={1.75} />
                </button>
                <div className="relative w-full max-w-md hidden sm:block">
                    <Search
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4"
                        strokeWidth={1.75}
                    />
                    <input
                        type="text"
                        placeholder="Search"
                        className="w-full pl-9 pr-16 py-1.5 bg-muted border border-transparent text-[13px] text-foreground placeholder:text-muted-foreground focus:outline-none focus:bg-background focus:border-border rounded-lg transition-colors"
                    />
                    <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-1">
                        <span className="text-[10px] font-medium text-muted-foreground bg-background border border-border px-1.5 py-0.5 rounded">
                            ⌘K
                        </span>
                    </div>
                </div>
            </div>

            <div className="flex items-center gap-1">
                <div className="hidden md:flex items-center px-2.5 py-1 bg-muted rounded-full mr-2">
                    <span className="text-[10px] font-semibold text-muted-foreground">
                        {plan}
                    </span>
                </div>
                <button
                    className="hidden sm:flex p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors"
                    onClick={() => router.push("/dashboard/help")}
                    title="Help"
                    aria-label="Help"
                >
                    <HelpCircle className="w-[18px] h-[18px]" strokeWidth={1.75} />
                </button>
                <button
                    className="relative p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors"
                    onClick={() => showToast.info("No new notifications")}
                    title="Notifications"
                    aria-label="Notifications"
                >
                    <Bell className="w-[18px] h-[18px]" strokeWidth={1.75} />
                    <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-destructive rounded-full" />
                </button>
                <Button
                    size="sm"
                    className="ml-2 gap-1.5 rounded-full px-3.5 opacity-50 cursor-not-allowed"
                    disabled
                >
                    <Sparkles className="w-3.5 h-3.5" strokeWidth={2} />
                    <span className="hidden sm:inline">Upgrade</span>
                </Button>
            </div>
        </header>
    );
}
