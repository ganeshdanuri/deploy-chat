"use client";

import { HiTrendingUp, HiLockClosed } from "react-icons/hi";
import { useAppSelector } from "@/lib/store/hooks";
import Link from "next/link";
import { TOOLTIP_STYLE_CLASSES, TOOLTIP_ARROW_CLASSES, PLANS } from "@/lib/constants";
import { AnalyticsSkeleton } from "@/app/components/ui";
import { useEffect, useState } from "react";

export default function AnalyticsPage() {
    const [loading, setLoading] = useState(true);
    const { data: userData } = useAppSelector((state) => state.user);

    useEffect(() => {
        const timer = setTimeout(() => setLoading(false), 800);
        return () => clearTimeout(timer);
    }, []);

    const isFreePlan = !userData?.billing?.current_plan ||
        userData?.billing?.current_plan.toLowerCase() === PLANS.FREE ||
        userData?.billing?.current_plan.toLowerCase() === PLANS.TRIAL;

    if (loading) {
        return <AnalyticsSkeleton />;
    }

    if (isFreePlan) {
        return (
            <div className="flex flex-col items-center justify-center h-[calc(100vh-12rem)] text-center animate-fade-in-up">
                <div className="w-16 h-16 bg-[#262ef2]/5 rounded-2xl flex items-center justify-center mb-6 shadow-sm border border-[#262ef2]/10">
                    <HiLockClosed className="w-8 h-8 text-[#262ef2]" />
                </div>
                <h1 className="text-2xl font-bold text-[#201f32] mb-2">Analytics Pro</h1>
                <p className="text-[#4d5564] mb-6 max-w-sm">
                    Detailed analytics and usage metrics are only available on higher plans.
                </p>
                <button
                    disabled
                    className="px-6 py-1.5 bg-[#f3f3f9] border border-[#e3e3e3] text-[#a1a1a1] text-sm font-medium rounded-lg shadow-sm cursor-not-allowed opacity-60"
                >
                    Upgrade Plan
                </button>
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-fade-in-up">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-[#201f32] tracking-tight">Analytics</h1>
                    <p className="text-sm text-[#4d5564] mt-1">Usage trends and performance metrics.</p>
                </div>
                <div className="flex bg-white rounded-lg p-1 border border-[#e3e3e3] shadow-sm">
                    <button className="px-3 py-1.5 bg-[#f3f3f9] text-[#201f32] text-xs font-semibold rounded shadow-sm">7 Days</button>
                    <button className="px-3 py-1.5 text-[#a1a1a1] hover:bg-[#f3f3f9] text-xs font-semibold rounded">30 Days</button>
                    <button className="px-3 py-1.5 text-[#a1a1a1] hover:bg-[#f3f3f9] text-xs font-semibold rounded">90 Days</button>
                </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {/* Card 1 */}
                <div className="bg-white p-4 rounded-xl border border-[#e3e3e3] shadow-sm">
                    <div className="text-sm font-medium text-[#a1a1a1] mb-1">Total Conversations</div>
                    <div className="text-2xl font-bold text-[#201f32]">12,405</div>
                    <div className="flex items-center gap-1 text-[#10b981] text-xs font-bold mt-2">
                        <HiTrendingUp className="w-3 h-3" />
                        12.5%
                    </div>
                </div>
                {/* Card 2 */}
                <div className="bg-white p-4 rounded-xl border border-[#e3e3e3] shadow-sm">
                    <div className="text-sm font-medium text-[#a1a1a1] mb-1">Avg. Response Time</div>
                    <div className="text-2xl font-bold text-[#201f32]">1.2s</div>
                    <div className="flex items-center gap-1 text-[#10b981] text-xs font-bold mt-2">
                        <HiTrendingUp className="w-3 h-3 rotate-180" />
                        -0.3s
                    </div>
                </div>
                {/* Card 3 */}
                <div className="bg-white p-4 rounded-xl border border-[#e3e3e3] shadow-sm">
                    <div className="text-sm font-medium text-[#a1a1a1] mb-1">User Satisfaction</div>
                    <div className="text-2xl font-bold text-[#201f32]">4.8/5</div>
                    <div className="flex items-center gap-1 text-[#10b981] text-xs font-bold mt-2">
                        <HiTrendingUp className="w-3 h-3" />
                        +0.2
                    </div>
                </div>
                {/* Card 4 */}
                <div className="bg-white p-4 rounded-xl border border-[#e3e3e3] shadow-sm">
                    <div className="text-sm font-medium text-[#a1a1a1] mb-1">Tokens Consumed</div>
                    <div className="text-2xl font-bold text-[#201f32]">8.4M</div>
                    <div className="flex items-center gap-1 text-[#f59e0b] text-xs font-bold mt-2">
                        <HiTrendingUp className="w-3 h-3" />
                        High Usage
                    </div>
                </div>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Usage Chart */}
                <div className="bg-white p-6 rounded-xl border border-[#e3e3e3] shadow-sm h-80 flex flex-col">
                    <h3 className="text-sm font-bold text-[#201f32] mb-6">Daily Conversations</h3>
                    <div className="flex-1 flex items-end justify-between gap-2 px-2">
                        {[40, 65, 45, 80, 55, 90, 70, 85, 60, 75, 50, 95].map((h, i) => (
                            <div key={i} className="w-full bg-[#262ef2]/5 rounded-t-sm relative group">
                                <div
                                    className="absolute bottom-0 left-0 w-full bg-[#262ef2] rounded-t-sm transition-all duration-500 hover:bg-[#201f32]"
                                    style={{ height: `${h}%` }}
                                ></div>
                                {/* Tooltip */}
                                <div className={`absolute -top-9 left-1/2 -translate-x-1/2 px-2 py-1 opacity-0 group-hover:opacity-100 ${TOOLTIP_STYLE_CLASSES} translate-y-1 group-hover:translate-y-0 text-[9px]`}>
                                    {h * 12} chats
                                    <div className={`absolute bottom-[-4px] left-1/2 -translate-x-1/2 w-2 h-2 border-r border-b ${TOOLTIP_ARROW_CLASSES}`} />
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="flex justify-between mt-2 pt-2 border-t border-[#e3e3e3] text-xs text-[#a1a1a1]">
                        <span>Mon</span>
                        <span>Tue</span>
                        <span>Wed</span>
                        <span>Thu</span>
                        <span>Fri</span>
                        <span>Sat</span>
                        <span>Sun</span>
                    </div>
                </div>

                {/* Token Usage Chart */}
                <div className="bg-white p-6 rounded-xl border border-[#e3e3e3] shadow-sm h-80 flex flex-col">
                    <h3 className="text-sm font-bold text-[#201f32] mb-6">Cost Estimation ($)</h3>
                    <div className="flex-1 flex items-end justify-between gap-4 px-4 border-l border-[#e3e3e3] relative">
                        {/* Grid Lines */}
                        <div className="absolute w-full h-full top-0 left-0 flex flex-col justify-between pointer-events-none">
                            <div className="border-t border-[#f3f3f9] w-full"></div>
                            <div className="border-t border-[#f3f3f9] w-full"></div>
                            <div className="border-t border-[#f3f3f9] w-full"></div>
                            <div className="border-t border-[#f3f3f9] w-full"></div>
                        </div>

                        {[30, 45, 35, 60, 80].map((h, i) => (
                            <div key={i} className="flex-1 flex flex-col justify-end group">
                                <div
                                    className="w-full bg-gradient-to-t from-[#10b981] to-[#10b981]/50 rounded-t-md hover:opacity-90 transition-all shadow-md shadow-[#10b981]/10"
                                    style={{ height: `${h}%` }}
                                ></div>
                            </div>
                        ))}
                    </div>
                    <div className="flex justify-between mt-2 pt-2 border-t border-[#e3e3e3] text-xs text-[#a1a1a1] px-4">
                        <span>Week 1</span>
                        <span>Week 2</span>
                        <span>Week 3</span>
                        <span>Week 4</span>
                        <span>Current</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
