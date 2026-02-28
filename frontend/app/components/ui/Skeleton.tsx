"use client";

import React from "react";
import { cn } from "@/lib/utils";

// ─── Base Skeleton Block ──────────────────────────────────────────────────────

interface SkeletonProps {
    className?: string;
    style?: React.CSSProperties;
}

/**
 * A single animated shimmer block. Compose these to build any skeleton screen.
 */
export function Skeleton({ className, style }: SkeletonProps) {
    return (
        <div
            className={cn(
                "relative overflow-hidden rounded-lg bg-slate-200/60",
                "before:absolute before:inset-0 before:-translate-x-full",
                "before:bg-gradient-to-r before:from-transparent before:via-white/80 before:to-transparent",
                "before:animate-shimmer",
                className
            )}
            style={style}
        />
    );
}

// ─── Table Skeleton ───────────────────────────────────────────────────────────

interface TableSkeletonProps {
    /** How many fake rows to show */
    rows?: number;
    /** How many columns to show */
    columns?: number;
}

/**
 * Skeleton placeholder for the StyledTable used on chatbots / datasets / documents pages.
 */
export function TableSkeleton({ rows = 5, columns = 4 }: TableSkeletonProps) {
    return (
        <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
            {/* Fake table header */}
            <div className="flex gap-6 px-4 py-3 bg-slate-50 border-b border-slate-200">
                {Array.from({ length: columns }).map((_, i) => (
                    <Skeleton
                        key={i}
                        className={`h-3 rounded-full ${i === 0 ? "w-28" : i === columns - 1 ? "w-16 ml-auto" : "w-20"}`}
                    />
                ))}
            </div>

            {/* Fake rows */}
            <div className="divide-y divide-slate-100">
                {Array.from({ length: rows }).map((_, rowIdx) => (
                    <div key={rowIdx} className="flex items-center gap-6 px-4 py-4">
                        {/* Avatar + text cell */}
                        <div className="flex items-center gap-3 flex-1">
                            <Skeleton className="w-8 h-8 rounded-xl shrink-0" />
                            <div className="space-y-1.5 flex-1">
                                <Skeleton className="h-3 w-32 rounded-full" />
                                <Skeleton className="h-2.5 w-20 rounded-full" />
                            </div>
                        </div>

                        {/* Status cell */}
                        <Skeleton className="h-5 w-16 rounded-full" />

                        {/* Date cell */}
                        <div className="space-y-1.5 w-20">
                            <Skeleton className="h-2.5 w-full rounded-full" />
                            <Skeleton className="h-2.5 w-12 rounded-full" />
                        </div>

                        {/* Actions cell */}
                        <div className="flex gap-2 ml-auto">
                            <Skeleton className="h-7 w-12 rounded-lg" />
                            <Skeleton className="h-7 w-7 rounded-lg" />
                            <Skeleton className="h-7 w-7 rounded-lg" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

// ─── Metric Card Skeleton ─────────────────────────────────────────────────────

/**
 * Skeleton for a single dashboard metric card.
 */
export function MetricCardSkeleton() {
    return (
        <div className="p-6 bg-white rounded-xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center gap-3">
                <Skeleton className="w-10 h-10 rounded-lg" />
                <Skeleton className="h-3 w-28 rounded-full" />
            </div>
            <Skeleton className="h-8 w-20 rounded-lg" />
            <Skeleton className="h-5 w-32 rounded-full" />
        </div>
    );
}

// ─── Dashboard Overview Skeleton ──────────────────────────────────────────────

/**
 * Full dashboard overview skeleton shown while initial data loads.
 */
export function DashboardSkeleton() {
    return (
        <div className="w-full max-w-7xl space-y-8 animate-pulse-subtle">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-200 pb-6">
                <div className="space-y-2">
                    <Skeleton className="h-7 w-52 rounded-lg" />
                    <Skeleton className="h-3 w-80 rounded-full" />
                </div>
                <div className="flex gap-2">
                    <Skeleton className="h-9 w-28 rounded-lg" />
                    <Skeleton className="h-9 w-28 rounded-lg" />
                </div>
            </div>

            {/* Metric Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <MetricCardSkeleton />
                <MetricCardSkeleton />
                <MetricCardSkeleton />
            </div>

            {/* Lower Panels */}
            <div className="flex flex-col lg:grid lg:grid-cols-3 gap-6">
                {/* Quick Actions */}
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-4">
                    <Skeleton className="h-4 w-28 rounded-full" />
                    {Array.from({ length: 3 }).map((_, i) => (
                        <div key={i} className="flex items-center gap-3 p-3 rounded-xl border border-slate-100">
                            <Skeleton className="w-10 h-10 rounded-lg shrink-0" />
                            <div className="space-y-1.5 flex-1">
                                <Skeleton className="h-3 w-24 rounded-full" />
                                <Skeleton className="h-2.5 w-36 rounded-full" />
                            </div>
                        </div>
                    ))}
                </div>

                {/* Recent Activity */}
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-4 lg:col-span-2">
                    <Skeleton className="h-4 w-32 rounded-full" />
                    {Array.from({ length: 3 }).map((_, i) => (
                        <div key={i} className="flex gap-4 py-3 border-b border-slate-100 last:border-0">
                            <Skeleton className="w-9 h-9 rounded-full shrink-0 mt-1" />
                            <div className="flex-1 space-y-2">
                                <div className="flex justify-between">
                                    <Skeleton className="h-3 w-40 rounded-full" />
                                    <Skeleton className="h-3 w-16 rounded-full" />
                                </div>
                                <Skeleton className="h-2.5 w-full rounded-full" />
                                <Skeleton className="h-2.5 w-3/4 rounded-full" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

// ─── Playground Config Skeleton ───────────────────────────────────────────────

/**
 * Skeleton for the playground's left-side configuration panel.
 */
export function PlaygroundConfigSkeleton() {
    return (
        <div className="w-80 bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col h-full overflow-y-auto space-y-8">
            {/* Header */}
            <div className="flex items-center gap-2">
                <Skeleton className="w-8 h-8 rounded-lg" />
                <Skeleton className="h-4 w-28 rounded-full" />
            </div>

            {/* Selector */}
            <div className="space-y-3">
                <Skeleton className="h-3 w-24 rounded-full" />
                <Skeleton className="h-12 w-full rounded-xl" />
            </div>

            {/* Temperature */}
            <div className="space-y-4 pt-8 border-t border-slate-100">
                <div className="flex justify-between">
                    <Skeleton className="h-3 w-28 rounded-full" />
                    <Skeleton className="h-5 w-10 rounded-lg" />
                </div>
                <Skeleton className="h-2 w-full rounded-full" />
            </div>
        </div>
    );
}

// ─── Modal Item List Skeleton ────────────────────────────────────────

/**
 * Skeleton shown inside CreateAIAssistantModal / CreateKnowledgeBaseModal while the list loads.
 */
export function SelectableListSkeleton({ rows = 3 }: { rows?: number }) {
    return (
        <div className="space-y-3">
            {Array.from({ length: rows }).map((_, i) => (
                <div key={i} className="flex items-center justify-between p-4 rounded-2xl border border-slate-100 bg-white">
                    <div className="flex items-center gap-4">
                        <Skeleton className="w-10 h-10 rounded-xl" />
                        <div className="space-y-1.5">
                            <Skeleton className="h-3 w-32 rounded-full" />
                            <Skeleton className="h-2.5 w-20 rounded-full" />
                        </div>
                    </div>
                    <Skeleton className="w-5 h-5 rounded-full" />
                </div>
            ))}
        </div>
    );
}

// ─── Settings Skeleton ────────────────────────────────────────────────────────

/**
 * Skeleton shown in SettingsPage while user data loads.
 */
export function SettingsSkeleton() {
    return (
        <div className="space-y-6 animate-pulse-subtle">
            {/* Form Card */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-slate-200 space-y-2">
                    <Skeleton className="h-5 w-40 rounded-full" />
                    <Skeleton className="h-3 w-64 rounded-full" />
                </div>
                <div className="p-6 space-y-8">
                    <div className="grid grid-cols-2 gap-6">
                        <div className="col-span-2 space-y-3">
                            <Skeleton className="h-4 w-24 rounded-full" />
                            <Skeleton className="h-10 w-full rounded-xl" />
                        </div>
                        <div className="col-span-2 space-y-3">
                            <Skeleton className="h-4 w-32 rounded-full" />
                            <Skeleton className="h-10 w-full rounded-xl" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Billing Card Skeleton */}
            <div className="p-6 bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-6">
                <div className="flex-1 space-y-4">
                    <div className="flex items-center gap-3">
                        <Skeleton className="w-10 h-10 rounded-full" />
                        <div className="space-y-2">
                            <Skeleton className="h-5 w-32 rounded-full" />
                            <Skeleton className="h-3 w-48 rounded-full" />
                        </div>
                    </div>
                    <div className="space-y-2 pt-2">
                        <div className="flex justify-between">
                            <Skeleton className="h-3 w-24 rounded-full" />
                            <Skeleton className="h-3 w-16 rounded-full" />
                        </div>
                        <Skeleton className="h-2 w-full rounded-full" />
                    </div>
                </div>
                <Skeleton className="h-10 w-32 rounded-xl" />
            </div>
        </div>
    );
}
// ─── Analytics Page Skeleton ──────────────────────────────────────────────────

/**
 * Skeleton shown in AnalyticsPage while it loads.
 */
export function AnalyticsSkeleton() {
    return (
        <div className="space-y-6 animate-pulse-subtle">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="space-y-2">
                    <Skeleton className="h-7 w-40 rounded-lg" />
                    <Skeleton className="h-3 w-64 rounded-full" />
                </div>
                <Skeleton className="h-10 w-48 rounded-lg" />
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-3">
                        <Skeleton className="h-3 w-32 rounded-full" />
                        <Skeleton className="h-7 w-20 rounded-lg" />
                        <Skeleton className="h-3 w-16 rounded-full" />
                    </div>
                ))}
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {Array.from({ length: 2 }).map((_, i) => (
                    <div key={i} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm h-80 space-y-6">
                        <Skeleton className="h-4 w-40 rounded-full" />
                        <div className="flex-1 flex items-end justify-between gap-2 h-48">
                            {Array.from({ length: 12 }).map((_, j) => (
                                <Skeleton
                                    key={j}
                                    className="w-full bg-slate-100/50 rounded-t-sm"
                                    style={{ height: `${Math.random() * 60 + 20}%` }}
                                />
                            ))}
                        </div>
                        <div className="flex justify-between border-t border-slate-100 pt-3">
                            {Array.from({ length: 6 }).map((_, k) => (
                                <Skeleton key={k} className="h-2.5 w-8 rounded-full" />
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
// ─── Chatbot Card Skeleton ────────────────────────────────────────────────────

/**
 * Skeleton for a single chatbot card in the grid view.
 */
export function ChatbotCardSkeleton() {
    return (
        <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-4 animate-pulse-subtle">
            <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                    <Skeleton className="w-10 h-10 rounded-lg" />
                    <div className="space-y-2">
                        <Skeleton className="h-4 w-24 rounded-full" />
                        <Skeleton className="h-3 w-16 rounded-full" />
                    </div>
                </div>
                <div className="flex gap-1">
                    <Skeleton className="w-8 h-8 rounded-md" />
                    <Skeleton className="w-8 h-8 rounded-md" />
                </div>
            </div>
            <div className="space-y-3">
                <div className="bg-slate-50 rounded-lg p-3 space-y-2">
                    <Skeleton className="h-2 w-20 rounded-full opacity-50" />
                    <Skeleton className="h-3 w-full rounded-full" />
                </div>
                <div className="flex justify-between items-center">
                    <Skeleton className="h-2 w-12 rounded-full" />
                    <Skeleton className="h-2 w-20 rounded-full" />
                </div>
            </div>
            <div className="grid grid-cols-2 gap-2 pt-2">
                <Skeleton className="h-10 rounded-lg" />
                <Skeleton className="h-10 rounded-lg" />
            </div>
        </div>
    );
}
