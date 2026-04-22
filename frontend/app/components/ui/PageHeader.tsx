"use client";

import React from "react";

interface PageHeaderProps {
    title: string;
    description?: string;
    actions?: React.ReactNode;
}

export function PageHeader({ title, description, actions }: PageHeaderProps) {
    return (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-border">
            <div>
                <h1 className="text-[22px] sm:text-2xl font-semibold tracking-[-0.025em] text-foreground">{title}</h1>
                {description && (
                    <p className="text-sm text-muted-foreground mt-1 leading-relaxed">{description}</p>
                )}
            </div>
            {actions && <div className="flex gap-2 flex-wrap">{actions}</div>}
        </div>
    );
}
