"use client";

import { Tooltip as ShadcnTooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
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
                    "py-1.5 px-3 bg-secondary text-white border border-white/10 rounded-none",
                    className
                )}
            >
                {content}
            </TooltipContent>
        </ShadcnTooltip>
    );
};
