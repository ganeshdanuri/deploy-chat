"use client";

import { HiSearch, HiBell, HiQuestionMarkCircle, HiMenuAlt2 } from "react-icons/hi";
import { useRouter } from "next/navigation";
import showToast from "@/lib/toast";
import { useAppSelector } from "@/lib/store/hooks";
import { theme } from "../../theme";

interface TopNavProps {
    onMenuClick?: () => void;
}

export function TopNav({ onMenuClick }: TopNavProps) {
    const router = useRouter();
    const { data: userData } = useAppSelector((state) => state.user);

    return (
        <header className="h-16 bg-white border-b border-[#e3e2e5]/60 flex items-center justify-between px-4 sm:px-6 sticky top-0 z-30">
            {/* Search / Command Palette Trigger */}
            <div className="flex-1 max-w-2xl flex items-center gap-2 sm:gap-4">
                <button
                    className="lg:hidden p-2 -ml-2 text-[#4d5564] hover:text-[#201f32] hover:bg-[#f3f3f9] rounded-lg transition-colors"
                    onClick={onMenuClick}
                >
                    <HiMenuAlt2 className="w-6 h-6" />
                </button>
                <div className="relative w-full max-w-md group hidden sm:block">
                    <HiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-[#a1a1a1] group-focus-within:text-[#262ef2] transition-colors w-4 h-4" />
                    <input
                        type="text"
                        placeholder="Search documents, chatbots, or commands... (Cmd+K)"
                        className="w-full pl-10 pr-4 py-2 bg-[#f3f3f9] border border-[#e3e2e5] rounded-xl text-sm text-[#4d5564] placeholder:text-[#a1a1a1] focus:outline-none focus:ring-4 focus:ring-[#262ef2]/10 focus:border-[#262ef2] transition-all font-medium"
                    />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 flex gap-1">
                        <span className="text-[10px] font-bold text-[#a1a1a1] bg-white border border-[#e3e2e5] rounded px-1.5 py-0.5 shadow-sm">⌘</span>
                        <span className="text-[10px] font-bold text-[#a1a1a1] bg-white border border-[#e3e2e5] rounded px-1.5 py-0.5 shadow-sm">K</span>
                    </div>
                </div>
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-1 sm:gap-2">
                {/* Beta Version Badge */}
                <div className="hidden lg:flex items-center px-3 py-1.5 rounded-full bg-[#262ef2]/5 border border-[#262ef2]/10 mr-2">
                    <span className="text-[11px] font-bold text-[#262ef2] uppercase tracking-tight flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#262ef2]"></span>
                        Beta Free Version • v1 will be released in 2 days
                    </span>
                </div>

                <div className="flex items-center gap-1 border-r border-[#e3e2e5] pr-2 sm:pr-3 mr-2 sm:mr-3">
                    <div className="hidden md:flex items-center px-2 py-1 rounded-md bg-[#f3f3f9] border border-[#e3e2e5] mr-2">
                        <span className="text-[10px] font-black text-[#a1a1a1] uppercase tracking-wider">
                            {userData?.billing?.current_plan || 'Free'}
                        </span>
                    </div>
                    <button
                        className="hidden sm:flex p-2 text-[#a1a1a1] hover:text-[#262ef2] hover:bg-[#262ef2]/5 rounded-lg transition-all relative"
                        onClick={() => router.push("/dashboard/help")}
                    >
                        <HiQuestionMarkCircle className="w-5 h-5" />
                    </button>
                    <button
                        className="p-2 text-[#a1a1a1] hover:text-[#262ef2] hover:bg-[#262ef2]/5 rounded-lg transition-all relative"
                        onClick={() => showToast.info("No new notifications")}
                    >
                        <HiBell className="w-5 h-5" />
                        <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                    </button>
                </div>

                <button
                    className="flex items-center gap-2 px-5 py-2 text-white text-sm font-medium rounded-xl transition-all opacity-50 cursor-not-allowed shadow-lg shadow-[#262ef2]/20"
                    style={{ backgroundColor: "#262ef2" }}
                    disabled
                >
                    <span className="hidden sm:inline">Upgrade Plan</span>
                    <span className="sm:hidden">Upgrade</span>
                </button>
            </div>
        </header>
    );
}
