"use client";

import { HiSearch, HiBell, HiQuestionMarkCircle, HiMenuAlt2 } from "react-icons/hi";
import { useRouter } from "next/navigation";
import showToast from "@/lib/toast";
import { useAppSelector } from "@/lib/store/hooks";

interface TopNavProps {
    onMenuClick?: () => void;
}

export function TopNav({ onMenuClick }: TopNavProps) {
    const router = useRouter();
    const { data: userData } = useAppSelector((state) => state.user);

    return (
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 sm:px-6 sticky top-0 z-30">
            {/* Search / Command Palette Trigger */}
            <div className="flex-1 max-w-2xl flex items-center gap-2 sm:gap-4">
                <button
                    className="lg:hidden p-2 -ml-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                    onClick={onMenuClick}
                >
                    <HiMenuAlt2 className="w-6 h-6" />
                </button>
                <div className="relative w-full max-w-md group hidden sm:block">
                    <HiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors w-4 h-4" />
                    <input
                        type="text"
                        placeholder="Search documents, chatbots, or commands... (Cmd+K)"
                        className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-600 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium"
                    />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 flex gap-1">
                        <span className="text-[10px] font-bold text-slate-400 bg-white border border-slate-200 rounded px-1.5 py-0.5 shadow-sm">⌘</span>
                        <span className="text-[10px] font-bold text-slate-400 bg-white border border-slate-200 rounded px-1.5 py-0.5 shadow-sm">K</span>
                    </div>
                </div>
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-1 sm:gap-2">
                <div className="flex items-center gap-1 border-r border-slate-200 pr-2 sm:pr-3 mr-2 sm:mr-3">
                    <div className="hidden md:flex items-center px-2 py-1 rounded-md bg-slate-100 border border-slate-200 mr-2">
                        <span className="text-[10px] font-black text-slate-500 uppercase tracking-wider">
                            {userData?.billing?.current_plan || 'Free'}
                        </span>
                    </div>
                    <button
                        className="hidden sm:flex p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all relative"
                        onClick={() => router.push("/dashboard/help")}
                    >
                        <HiQuestionMarkCircle className="w-5 h-5" />
                    </button>
                    <button
                        className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all relative"
                        onClick={() => showToast.info("No new notifications")}
                    >
                        <HiBell className="w-5 h-5" />
                        <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                    </button>
                </div>

                {(!userData?.billing?.current_plan || userData.billing.current_plan.toLowerCase() === 'free') && (
                    <button
                        className="flex items-center gap-2 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-semibold rounded-lg shadow-sm shadow-indigo-200 transition-all"
                        onClick={() => router.push("/dashboard/settings")}
                    >
                        <span className="hidden sm:inline">Upgrade Plan</span>
                        <span className="sm:hidden">Upgrade</span>
                    </button>
                )}
            </div>
        </header>
    );
}
