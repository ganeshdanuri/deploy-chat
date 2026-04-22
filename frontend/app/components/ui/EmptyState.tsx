"use client";
import { Plus } from "lucide-react";


import React from "react";
import { Button } from "@/components/ui/button";


interface EmptyStateProps {
    icon: React.ElementType;
    title: string;
    description: string;
    actionLabel?: string;
    onAction?: () => void;
    accentColor?: "indigo" |"emerald" |"amber" |"slate";
}

export function EmptyState({
    icon: Icon,
    title,
    description,
    actionLabel,
    onAction,
}: EmptyStateProps) {
    return (
        <div className="flex flex-col items-center justify-center py-20 bg-background border border-border rounded-xl">
            <div className="w-14 h-14 bg-muted text-muted-foreground rounded-full flex items-center justify-center mb-5">
                <Icon className="w-7 h-7" />
            </div>
            <h2 className="text-lg font-medium text-foreground mb-1.5">{title}</h2>
            <p className="text-muted-foreground max-w-sm text-center mb-6 text-sm leading-relaxed">{description}</p>
            {actionLabel && onAction && (
                <Button onClick={onAction}>
                    <Plus className="w-4 h-4 mr-1.5" />
                    {actionLabel}
                </Button>
            )}
        </div>
    );
}
