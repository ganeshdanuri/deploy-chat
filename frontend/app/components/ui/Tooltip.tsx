"use client";

import { Tooltip as HeroTooltip, TooltipProps } from "@heroui/react";
import { TOOLTIP_STYLE_CLASSES } from "@/lib/constants";

export const Tooltip = ({ children, classNames, ...props }: TooltipProps) => {
    return (
        <HeroTooltip
            showArrow
            classNames={{
                ...classNames,
                content: [
                    TOOLTIP_STYLE_CLASSES,
                    "py-1.5 px-3",
                    classNames?.content,
                ].filter(Boolean).join(" "),
                arrow: "bg-slate-900",
            }}
            {...props}
        >
            {children}
        </HeroTooltip>
    );
};
