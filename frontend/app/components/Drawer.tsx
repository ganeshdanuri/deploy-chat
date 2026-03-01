"use client";

import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetFooter,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { HiX } from "react-icons/hi";
import { cn } from "@/lib/utils";

interface DrawerProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
    subtitle?: string;
    icon?: React.ElementType;
    iconColor?: string;
    iconBgColor?: string;
    footer?: React.ReactNode;
    size?: "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl" | "5xl" | "full";
}

export default function Drawer({
    isOpen,
    onClose,
    title,
    children,
    subtitle,
    icon: Icon,
    iconColor = "text-indigo-600",
    iconBgColor = "bg-indigo-50",
    footer,
    size = "md"
}: DrawerProps) {
    const sizeClasses = {
        xs: "sm:max-w-xs",
        sm: "sm:max-w-sm",
        md: "sm:max-w-md",
        lg: "sm:max-w-lg",
        xl: "sm:max-w-xl",
        "2xl": "sm:max-w-2xl",
        "3xl": "sm:max-w-3xl",
        "4xl": "sm:max-w-4xl",
        "5xl": "sm:max-w-5xl",
        full: "sm:max-w-full",
    };

    return (
        <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <SheetContent className={cn("p-0 flex flex-col bg-white border-l border-slate-100 shadow-2xl outline-none", sizeClasses[size])}>
                <SheetHeader className="px-8 py-6 border-b border-slate-100 flex flex-row items-center justify-between bg-slate-50/30 shrink-0">
                    <div className="flex items-center gap-4">
                        {Icon && (
                            <div className={`w-10 h-10 rounded-xl ${iconBgColor} ${iconColor} flex items-center justify-center shadow-sm`}>
                                <Icon className="w-5 h-5" />
                            </div>
                        )}
                        <div>
                            <SheetTitle className="text-xl font-bold text-slate-800 leading-tight">{title}</SheetTitle>
                            {subtitle && <p className="text-xs text-slate-500 mt-0.5 font-medium">{subtitle}</p>}
                        </div>
                    </div>
                </SheetHeader>

                <div className="flex-1 overflow-y-auto p-8">
                    {children}
                </div>

                {footer && (
                    <SheetFooter className="px-8 py-6 border-t border-slate-100 bg-slate-50/50 flex flex-row justify-end items-center gap-3 shrink-0">
                        {footer}
                    </SheetFooter>
                )}
            </SheetContent>
        </Sheet>
    );
}
