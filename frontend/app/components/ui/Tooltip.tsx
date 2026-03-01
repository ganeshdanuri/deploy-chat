"use client";

import { Tooltip as ShadcnTooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { TOOLTIP_STYLE_CLASSES } from "@/lib/constants";
import { cn } from "@/lib/utils";

interface TooltipProps {
    children: React.ReactNode;
    content: React.ReactNode;
    className?: string;
}

export const Tooltip = ({ children, content, className }: TooltipProps) => {
    return (
        <ShadcnTooltip>
            <TooltipTrigger asChild>
                {children}
            </TooltipTrigger>
            <TooltipContent
                className={cn(
                    TOOLTIP_STYLE_CLASSES,
                    "py-1.5 px-3 bg-slate-900 text-white border-none",
                    className
                )}
            >
                {content}
            </TooltipContent>
        </ShadcnTooltip>
    );
};
