"use client";

import React from "react";
import { Button } from "@heroui/react";
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
        bg: "bg-indigo-50",
        text: "text-indigo-600",
        btn: "bg-indigo-600 shadow-indigo-200",
    },
    emerald: {
        bg: "bg-emerald-50",
        text: "text-emerald-600",
        btn: "bg-emerald-600 shadow-emerald-200",
    },
    amber: {
        bg: "bg-amber-50",
        text: "text-amber-600",
        btn: "bg-amber-600 shadow-amber-200",
    },
    slate: {
        bg: "bg-slate-50",
        text: "text-slate-400",
        btn: "bg-slate-700 shadow-slate-200",
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
        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border-2 border-dashed border-slate-200">
            <div className={`w-16 h-16 ${colors.bg} ${colors.text} rounded-2xl flex items-center justify-center mb-4`}>
                <Icon className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-semibold text-slate-900 mb-2">{title}</h2>
            <p className="text-slate-500 max-w-sm text-center mb-8 text-sm">{description}</p>
            {actionLabel && onAction && (
                <Button
                    onPress={onAction}
                    startContent={<HiPlus className="w-5 h-5" />}
                    className={`${colors.btn} px-6 h-12 text-white font-medium rounded-xl shadow-lg`}
                >
                    {actionLabel}
                </Button>
            )}
        </div>
    );
}
