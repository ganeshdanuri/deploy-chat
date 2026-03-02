"use client";

import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetFooter,
} from "@/components/ui/sheet";
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
    iconColor = "text-[#262ef2]",
    iconBgColor = "bg-[#262ef2]/5",
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
            <SheetContent className={cn("p-0 flex flex-col bg-white border-l border-[#e3e2e5] shadow-2xl outline-none", sizeClasses[size])}>
                <SheetHeader className="px-5 sm:px-8 py-5 sm:py-6 border-b border-[#e3e2e5] flex flex-row items-center justify-between bg-[#f9f9fc] shrink-0">
                    <div className="flex items-center gap-4">
                        {Icon && (
                            <div className={`w-10 h-10 ${iconBgColor} ${iconColor} flex items-center justify-center shadow-sm rounded-sm`}>
                                <Icon className="w-5 h-5" />
                            </div>
                        )}
                        <div>
                            <SheetTitle className="text-xl font-bold text-[#201f32] leading-tight">{title}</SheetTitle>
                            {subtitle && <p className="text-xs text-[#5a5a6a] mt-0.5 font-medium">{subtitle}</p>}
                        </div>
                    </div>
                </SheetHeader>

                <div className="flex-1 overflow-y-auto p-5 sm:p-8">
                    {children}
                </div>

                {footer && (
                    <SheetFooter className="px-5 sm:px-8 py-5 sm:py-6 border-t border-[#e3e2e5] bg-[#f9f9fc] flex flex-row justify-end items-center gap-3 shrink-0">
                        {footer}
                    </SheetFooter>
                )}
            </SheetContent>
        </Sheet>
    );
}
