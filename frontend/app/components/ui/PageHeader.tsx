"use client";

import React from "react";

interface PageHeaderProps {
    title: string;
    description?: string;
    actions?: React.ReactNode;
}

/**
 * Reusable header used at the top of every dashboard page.
 * Renders the title, optional description, and an optional action slot (buttons, etc.)
 */
export function PageHeader({ title, description, actions }: PageHeaderProps) {
    return (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
                <h1 className="text-2xl font-bold text-[#201f32] tracking-tight">{title}</h1>
                {description && (
                    <p className="text-sm text-[#5a5a6a] mt-1">{description}</p>
                )}
            </div>
            {actions && <div className="flex gap-2">{actions}</div>}
        </div>
    );
}
