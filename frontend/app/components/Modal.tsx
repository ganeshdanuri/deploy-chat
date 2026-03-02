"use client";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { HiX } from "react-icons/hi";
import { cn } from "@/lib/utils";

interface ModalProps {
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

export default function Modal({
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
}: ModalProps) {
    const sizeClasses = {
        xs: "max-w-xs",
        sm: "max-w-sm",
        md: "max-w-md",
        lg: "max-w-lg",
        xl: "max-w-xl",
        "2xl": "max-w-2xl",
        "3xl": "max-w-3xl",
        "4xl": "max-w-4xl",
        "5xl": "max-w-5xl",
        full: "max-w-full",
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className={cn("p-0 overflow-hidden bg-white border border-[#e3e2e5] shadow-2xl", sizeClasses[size])}>
                <DialogHeader className="px-8 py-6 border-b border-[#e3e2e5] flex flex-row items-center justify-between bg-[#f3f3f9]/30 shrink-0">
                    <div className="flex items-center gap-4">
                        {Icon && (
                            <div className={`w-10 h-10 ${iconBgColor} ${iconColor} flex items-center justify-center shadow-sm rounded-sm`}>
                                <Icon className="w-5 h-5" />
                            </div>
                        )}
                        <div>
                            <DialogTitle className="text-xl font-bold text-[#201f32] leading-tight">{title}</DialogTitle>
                            {subtitle && <p className="text-xs text-[#5a5a6a] mt-0.5 font-medium">{subtitle}</p>}
                        </div>
                    </div>
                </DialogHeader>

                <div className="p-8 overflow-y-auto max-h-[80vh]">
                    {children}
                </div>

                {footer && (
                    <DialogFooter className="p-8 border-t border-[#e3e2e5] bg-[#f3f3f9]/50 flex flex-row justify-end space-x-2">
                        {footer}
                    </DialogFooter>
                )}
            </DialogContent>
        </Dialog>
    );
}
