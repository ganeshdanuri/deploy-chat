"use client";

import { HiTrendingUp, HiLockClosed } from "react-icons/hi";
import { useAppSelector } from "@/lib/store/hooks";
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
                <div className="w-16 h-16 bg-primary/5 flex items-center justify-center mb-6 shadow-sm border border-primary/10">
                    <HiLockClosed className="w-8 h-8 text-primary" />
                </div>
                <h1 className="text-2xl font-bold text-secondary mb-2">Analytics Pro</h1>
                <p className="text-foreground mb-6 max-w-sm">
                    Detailed analytics and usage metrics are only available on higher plans.
                </p>
                <button
                    disabled
                    className="px-6 py-1.5 bg-muted border border-border text-muted-foreground text-sm font-medium shadow-sm cursor-not-allowed opacity-60"
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
                    <h1 className="text-2xl font-bold text-secondary tracking-tight">Analytics</h1>
                    <p className="text-sm text-foreground mt-1">Usage trends and performance metrics.</p>
                </div>
                <div className="flex bg-white p-1 border border-border shadow-sm">
                    <button className="px-3 py-1.5 bg-muted text-secondary text-xs font-semibold shadow-sm">7 Days</button>
                    <button className="px-3 py-1.5 text-muted-foreground hover:bg-muted text-xs font-semibold">30 Days</button>
                    <button className="px-3 py-1.5 text-muted-foreground hover:bg-muted text-xs font-semibold">90 Days</button>
                </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {/* Card 1 */}
                <div className="dash-card bg-white p-4 border border-border shadow-sm">
                    <div className="text-sm font-medium text-muted-foreground mb-1">Total Conversations</div>
                    <div className="text-2xl font-bold text-secondary">12,405</div>
                    <div className="flex items-center gap-1 text-emerald-500 text-xs font-bold mt-2">
                        <HiTrendingUp className="w-3 h-3" />
                        12.5%
                    </div>
                </div>
                {/* Card 2 */}
                <div className="dash-card bg-white p-4 border border-border shadow-sm">
                    <div className="text-sm font-medium text-muted-foreground mb-1">Avg. Response Time</div>
                    <div className="text-2xl font-bold text-secondary">1.2s</div>
                    <div className="flex items-center gap-1 text-emerald-500 text-xs font-bold mt-2">
                        <HiTrendingUp className="w-3 h-3 rotate-180" />
                        -0.3s
                    </div>
                </div>
                {/* Card 3 */}
                <div className="dash-card bg-white p-4 border border-border shadow-sm">
                    <div className="text-sm font-medium text-muted-foreground mb-1">User Satisfaction</div>
                    <div className="text-2xl font-bold text-secondary">4.8/5</div>
                    <div className="flex items-center gap-1 text-emerald-500 text-xs font-bold mt-2">
                        <HiTrendingUp className="w-3 h-3" />
                        +0.2
                    </div>
                </div>
                {/* Card 4 */}
                <div className="dash-card bg-white p-4 border border-border shadow-sm">
                    <div className="text-sm font-medium text-muted-foreground mb-1">Tokens Consumed</div>
                    <div className="text-2xl font-bold text-secondary">8.4M</div>
                    <div className="flex items-center gap-1 text-amber-500 text-xs font-bold mt-2">
                        <HiTrendingUp className="w-3 h-3" />
                        High Usage
                    </div>
                </div>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Usage Chart */}
                <div className="dash-card bg-white p-6 border border-border shadow-sm h-80 flex flex-col">
                    <h3 className="text-sm font-bold text-secondary mb-6">Daily Conversations</h3>
                    <div className="flex-1 flex items-end justify-between gap-2 px-2">
                        {[40, 65, 45, 80, 55, 90, 70, 85, 60, 75, 50, 95].map((h, i) => (
                            <div key={i} className="w-full bg-primary/5 rounded-t-sm relative group">
                                <div
                                    className="absolute bottom-0 left-0 w-full bg-primary rounded-t-sm transition-all duration-500 hover:bg-secondary"
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
                    <div className="flex justify-between mt-2 pt-2 border-t border-border text-xs text-muted-foreground">
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
                <div className="dash-card bg-white p-6 border border-border shadow-sm h-80 flex flex-col">
                    <h3 className="text-sm font-bold text-secondary mb-6">Cost Estimation ($)</h3>
                    <div className="flex-1 flex items-end justify-between gap-4 px-4 border-l border-border relative">
                        {/* Grid Lines */}
                        <div className="absolute w-full h-full top-0 left-0 flex flex-col justify-between pointer-events-none">
                            <div className="border-t border-muted w-full"></div>
                            <div className="border-t border-muted w-full"></div>
                            <div className="border-t border-muted w-full"></div>
                            <div className="border-t border-muted w-full"></div>
                        </div>

                        {[30, 45, 35, 60, 80].map((h, i) => (
                            <div key={i} className="flex-1 flex flex-col justify-end group">
                                <div
                                    className="w-full bg-gradient-to-t from-emerald-500 to-emerald-500/50 rounded-t-md hover:opacity-90 transition-all shadow-md shadow-emerald-500/10"
                                    style={{ height: `${h}%` }}
                                ></div>
                            </div>
                        ))}
                    </div>
                    <div className="flex justify-between mt-2 pt-2 border-t border-border text-xs text-muted-foreground px-4">
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
