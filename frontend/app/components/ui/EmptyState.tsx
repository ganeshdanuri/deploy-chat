"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { HiPlus } from "react-icons/hi";

interface EmptyStateProps {
    icon: React.ElementType;
    title: string;
    description: string;
    actionLabel?: string;
    onAction?: () => void;
    accentColor?: "indigo" | "emerald" | "amber" | "slate";
}

const colorMap = {
    indigo: {
        bg: "bg-[#262ef2]/5",
        text: "text-[#262ef2]",
        btn: "bg-[#262ef2] shadow-lg shadow-[#262ef2]/20",
    },
    emerald: {
        bg: "bg-[#10b981]/5",
        text: "text-[#10b981]",
        btn: "bg-[#262ef2] shadow-lg shadow-[#262ef2]/20",
    },
    amber: {
        bg: "bg-[#f59e0b]/5",
        text: "text-[#f59e0b]",
        btn: "bg-[#262ef2] shadow-lg shadow-[#262ef2]/20",
    },
    slate: {
        bg: "bg-[#f3f3f9]",
        text: "text-[#a1a1a1]",
        btn: "bg-[#262ef2] shadow-lg shadow-[#262ef2]/20",
    },
};

/**
 * Reusable empty-state card used when a list has no items.
 * Accepts an icon, title, description, and an optional primary CTA.
 */
export function EmptyState({
    icon: Icon,
    title,
    description,
    actionLabel,
    onAction,
    accentColor = "indigo",
}: EmptyStateProps) {
    const colors = colorMap[accentColor];

    return (
        <div className="flex flex-col items-center justify-center py-20 bg-white border border-dashed border-[#e3e2e5]">
            <div className={`w-16 h-16 ${colors.bg} ${colors.text} flex items-center justify-center mb-4`}>
                <Icon className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-semibold text-[#201f32] mb-2">{title}</h2>
            <p className="text-[#5a5a6a] max-w-sm text-center mb-8 text-sm">{description}</p>
            {actionLabel && onAction && (
                <Button
                    onClick={onAction}
                    className={`${colors.btn} px-6 h-12 text-white font-medium shadow-lg transition-all hover:-translate-y-0.5 pointer-events-auto`}
                >
                    <HiPlus className="w-5 h-5 mr-2" />
                    {actionLabel}
                </Button>
            )}
        </div>
    );
}
