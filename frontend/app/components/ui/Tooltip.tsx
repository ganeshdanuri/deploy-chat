"use client";

import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import { cn } from "@/lib/utils";

interface TooltipProps {
    children: React.ReactNode;
    content: React.ReactNode;
    className?: string;
}

export const Tooltip = ({ children, content, className }: TooltipProps) => {
    return (
        <TooltipPrimitive.Provider delayDuration={200}>
            <TooltipPrimitive.Root>
                <TooltipPrimitive.Trigger asChild>
                    <div className="inline-block cursor-help">
                        {children}
                    </div>
                </TooltipPrimitive.Trigger>
                <TooltipPrimitive.Portal>
                    <TooltipPrimitive.Content
                        side="top"
                        align="center"
                        sideOffset={5}
                        className={cn(
                            "z-[9999] overflow-hidden rounded-md bg-secondary px-3 py-1.5 text-xs text-white shadow-xl animate-in fade-in zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
                            className
                        )}
                    >
                        {content}
                        <TooltipPrimitive.Arrow className="fill-secondary" />
                    </TooltipPrimitive.Content>
                </TooltipPrimitive.Portal>
            </TooltipPrimitive.Root>
        </TooltipPrimitive.Provider>
    );
};
