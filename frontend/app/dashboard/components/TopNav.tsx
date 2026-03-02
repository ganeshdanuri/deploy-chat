"use client";

import { HiSearch, HiBell, HiQuestionMarkCircle, HiMenuAlt2 } from "react-icons/hi";
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

    return (
        <header className="h-16 bg-white border-b border-border/60 flex items-center justify-between px-4 sm:px-6 sticky top-0 z-30">
            {/* Search / Command Palette Trigger */}
            <div className="flex-1 max-w-2xl flex items-center gap-2 sm:gap-4">
                <button
                    className="lg:hidden p-2 -ml-2 text-muted-foreground hover:text-secondary hover:bg-muted transition-colors"
                    onClick={onMenuClick}
                >
                    <HiMenuAlt2 className="w-6 h-6" />
                </button>
                <div className="relative w-full max-w-md group hidden sm:block">
                    <HiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors w-4 h-4" />
                    <input
                        type="text"
                        placeholder="Search documents, chatbots, or commands... (Cmd+K)"
                        className="w-full pl-10 pr-4 py-2 bg-muted border border-border text-sm text-secondary placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-all font-medium rounded-sm"
                    />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 flex gap-1">
                        <span className="text-[10px] font-bold text-muted-foreground bg-white border border-border px-1.5 py-0.5 shadow-sm rounded-sm">⌘</span>
                        <span className="text-[10px] font-bold text-muted-foreground bg-white border border-border px-1.5 py-0.5 shadow-sm rounded-sm">K</span>
                    </div>
                </div>
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-1 sm:gap-2">
                <div className="flex items-center gap-1 border-r border-border pr-2 sm:pr-3 mr-2 sm:mr-3">
                    <div className="hidden md:flex items-center px-2 py-1 bg-muted border border-border mr-2 rounded-sm">
                        <span className="text-[10px] font-black text-muted-foreground uppercase tracking-wider">
                            {userData?.billing?.current_plan || 'Free'}
                        </span>
                    </div>
                    <button
                        className="hidden sm:flex p-2 text-muted-foreground hover:text-primary hover:bg-primary/5 transition-all relative"
                        onClick={() => router.push("/dashboard/help")}
                    >
                        <HiQuestionMarkCircle className="w-5 h-5" />
                    </button>
                    <button
                        className="p-2 text-muted-foreground hover:text-primary hover:bg-primary/5 transition-all relative"
                        onClick={() => showToast.info("No new notifications")}
                    >
                        <HiBell className="w-5 h-5" />
                        <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 border-2 border-white"></span>
                    </button>
                </div>

                <Button
                    variant="primary"
                    className="h-10 px-5 opacity-50 cursor-not-allowed"
                    disabled
                >
                    <span className="hidden sm:inline">Upgrade Plan</span>
                    <span className="sm:hidden">Upgrade</span>
                </Button>
            </div>
        </header>
    );
}
