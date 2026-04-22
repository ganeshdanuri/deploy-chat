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
                "relative overflow-hidden bg-muted rounded",
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
        <div className="bg-background border border-border rounded-xl overflow-hidden">
            {/* Fake table header */}
            <div className="flex gap-6 px-4 py-3 bg-muted border-b border-border">
                {Array.from({ length: columns }).map((_, i) => (
                    <Skeleton
                        key={i}
                        className={`h-3 ${i === 0 ? "w-28" : i === columns - 1 ? "w-16 ml-auto" : "w-20"}`}
                    />
                ))}
            </div>

            {/* Fake rows */}
            <div className="divide-y divide-muted">
                {Array.from({ length: rows }).map((_, rowIdx) => (
                    <div key={rowIdx} className="flex items-center gap-6 px-4 py-4">
                        {/* Avatar + text cell */}
                        <div className="flex items-center gap-3 flex-1">
                            <Skeleton className="w-8 h-8 rounded-lg shrink-0" />
                            <div className="space-y-1.5 flex-1">
                                <Skeleton className="h-3 w-32" />
                                <Skeleton className="h-2.5 w-20" />
                            </div>
                        </div>

                        {/* Status cell */}
                        <Skeleton className="h-5 w-16 rounded-full" />

                        {/* Date cell */}
                        <div className="space-y-1.5 w-20">
                            <Skeleton className="h-2.5 w-full" />
                            <Skeleton className="h-2.5 w-12" />
                        </div>

                        {/* Actions cell */}
                        <div className="flex gap-2 ml-auto">
                            <Skeleton className="h-7 w-12 rounded-md" />
                            <Skeleton className="h-7 w-7 rounded-md" />
                            <Skeleton className="h-7 w-7 rounded-md" />
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
        <div className="p-6 bg-background border border-border rounded-xl space-y-4">
            <div className="flex items-center gap-3">
                <Skeleton className="w-10 h-10 rounded-lg" />
                <Skeleton className="h-3 w-28" />
            </div>
            <Skeleton className="h-8 w-20" />
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
        <div className="w-full max-w-[1400px] space-y-8 animate-pulse-subtle">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-border pb-6">
                <div className="space-y-2">
                    <Skeleton className="h-7 w-52" />
                    <Skeleton className="h-3 w-80" />
                </div>
                <div className="flex gap-2">
                    <Skeleton className="h-9 w-28" />
                    <Skeleton className="h-9 w-28" />
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
                <div className="bg-background border border-border rounded-xl p-6 space-y-4">
                    <Skeleton className="h-4 w-28" />
                    {Array.from({ length: 3 }).map((_, i) => (
                        <div key={i} className="flex items-center gap-3 p-3 border border-muted rounded-lg">
                            <Skeleton className="w-10 h-10 rounded-lg shrink-0" />
                            <div className="space-y-1.5 flex-1">
                                <Skeleton className="h-3 w-24" />
                                <Skeleton className="h-2.5 w-36" />
                            </div>
                        </div>
                    ))}
                </div>

                {/* Recent Activity */}
                <div className="bg-background border border-border rounded-xl p-6 space-y-4 lg:col-span-2">
                    <Skeleton className="h-4 w-32" />
                    {Array.from({ length: 3 }).map((_, i) => (
                        <div key={i} className="flex gap-4 py-3 border-b border-muted last:border-0">
                            <Skeleton className="w-9 h-9 rounded-lg shrink-0 mt-1" />
                            <div className="flex-1 space-y-2">
                                <div className="flex justify-between">
                                    <Skeleton className="h-3 w-40" />
                                    <Skeleton className="h-3 w-16" />
                                </div>
                                <Skeleton className="h-2.5 w-full" />
                                <Skeleton className="h-2.5 w-3/4" />
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
        <div className="w-80 bg-background border border-border rounded-xl p-6 flex flex-col h-full overflow-y-auto space-y-8">
            {/* Header */}
            <div className="flex items-center gap-2">
                <Skeleton className="w-8 h-8 rounded-lg" />
                <Skeleton className="h-4 w-28" />
            </div>

            {/* Selector */}
            <div className="space-y-3">
                <Skeleton className="h-3 w-24" />
                <Skeleton className="h-12 w-full rounded-lg" />
            </div>

            {/* Temperature */}
            <div className="space-y-4 pt-8 border-t border-muted">
                <div className="flex justify-between">
                    <Skeleton className="h-3 w-28" />
                    <Skeleton className="h-5 w-10 rounded-full" />
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
                <div key={i} className="flex items-center justify-between p-4 border border-muted bg-background rounded-xl">
                    <div className="flex items-center gap-4">
                        <Skeleton className="w-10 h-10 rounded-lg" />
                        <div className="space-y-1.5">
                            <Skeleton className="h-3 w-32" />
                            <Skeleton className="h-2.5 w-20" />
                        </div>
                    </div>
                    <Skeleton className="w-5 h-5 rounded-md" />
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
            <div className="bg-background border border-border rounded-xl overflow-hidden">
                <div className="p-6 border-b border-border space-y-2">
                    <Skeleton className="h-5 w-40" />
                    <Skeleton className="h-3 w-64" />
                </div>
                <div className="p-6 space-y-8">
                    <div className="grid grid-cols-2 gap-6">
                        <div className="col-span-2 space-y-3">
                            <Skeleton className="h-4 w-24" />
                            <Skeleton className="h-10 w-full rounded-lg" />
                        </div>
                        <div className="col-span-2 space-y-3">
                            <Skeleton className="h-4 w-32" />
                            <Skeleton className="h-10 w-full rounded-lg" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Billing Card Skeleton */}
            <div className="p-6 bg-background border border-border rounded-xl flex flex-col md:flex-row gap-6">
                <div className="flex-1 space-y-4">
                    <div className="flex items-center gap-3">
                        <Skeleton className="w-10 h-10 rounded-lg" />
                        <div className="space-y-2">
                            <Skeleton className="h-5 w-32" />
                            <Skeleton className="h-3 w-48" />
                        </div>
                    </div>
                    <div className="space-y-2 pt-2">
                        <div className="flex justify-between">
                            <Skeleton className="h-3 w-24" />
                            <Skeleton className="h-3 w-16" />
                        </div>
                        <Skeleton className="h-2 w-full rounded-full" />
                    </div>
                </div>
                <Skeleton className="h-10 w-32 rounded-lg" />
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
                    <Skeleton className="h-7 w-40" />
                    <Skeleton className="h-3 w-64" />
                </div>
                <Skeleton className="h-10 w-48" />
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="bg-background p-4 border border-border rounded-xl space-y-3">
                        <Skeleton className="h-3 w-32" />
                        <Skeleton className="h-7 w-20" />
                        <Skeleton className="h-3 w-16" />
                    </div>
                ))}
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {Array.from({ length: 2 }).map((_, i) => (
                    <div key={i} className="bg-background p-6 border border-border rounded-xl h-80 space-y-6">
                        <Skeleton className="h-4 w-40" />
                        <div className="flex-1 flex items-end justify-between gap-2 h-48">
                            {Array.from({ length: 12 }).map((_, j) => (
                                <Skeleton
                                    key={j}
                                    className="w-full rounded-t-md bg-muted/50"
                                    style={{ height: `${Math.random() * 60 + 20}%` }}
                                />
                            ))}
                        </div>
                        <div className="flex justify-between border-t border-muted pt-3">
                            {Array.from({ length: 6 }).map((_, k) => (
                                <Skeleton key={k} className="h-2.5 w-8" />
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
        <div className="bg-background border border-border rounded-xl p-5 space-y-4 animate-pulse-subtle">
            <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                    <Skeleton className="w-10 h-10 rounded-lg" />
                    <div className="space-y-2">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-3 w-16" />
                    </div>
                </div>
                <div className="flex gap-1">
                    <Skeleton className="w-8 h-8 rounded-md" />
                    <Skeleton className="w-8 h-8 rounded-md" />
                </div>
            </div>
            <div className="space-y-3">
                <div className="bg-muted rounded-lg p-3 space-y-2">
                    <Skeleton className="h-2 w-20 opacity-50" />
                    <Skeleton className="h-3 w-full" />
                </div>
                <div className="flex justify-between items-center">
                    <Skeleton className="h-2 w-12" />
                    <Skeleton className="h-2 w-20" />
                </div>
            </div>
            <div className="grid grid-cols-2 gap-2 pt-2">
                <Skeleton className="h-10 rounded-lg" />
                <Skeleton className="h-10 rounded-lg" />
            </div>
        </div>
    );
}
