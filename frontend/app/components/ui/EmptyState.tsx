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
        bg: "bg-primary/5",
        text: "text-primary",
    },
    emerald: {
        bg: "bg-emerald-500/5",
        text: "text-emerald-500",
    },
    amber: {
        bg: "bg-amber-500/5",
        text: "text-amber-500",
    },
    slate: {
        bg: "bg-muted",
        text: "text-muted-foreground",
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
        <div className="flex flex-col items-center justify-center py-20 bg-white border border-dashed border-border">
            <div className={`w-16 h-16 ${colors.bg} ${colors.text} flex items-center justify-center mb-4`}>
                <Icon className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-semibold text-secondary mb-2">{title}</h2>
            <p className="text-muted-foreground max-w-sm text-center mb-8 text-sm">{description}</p>
            {actionLabel && onAction && (
                <Button
                    variant="primary"
                    onClick={onAction}
                    className="px-6 h-12 pointer-events-auto"
                >
                    <HiPlus className="w-5 h-5 mr-2" />
                    {actionLabel}
                </Button>
            )}
        </div>
    );
}
