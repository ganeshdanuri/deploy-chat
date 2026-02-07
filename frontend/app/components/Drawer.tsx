"use client";

import { useEffect, useRef } from "react";
import { HiX } from "react-icons/hi";

interface DrawerProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
    subtitle?: string;
    icon?: React.ElementType;
    iconColor?: string;
    iconBgColor?: string;
}

export default function Drawer({
    isOpen,
    onClose,
    title,
    children,
    subtitle,
    icon: Icon,
    iconColor = "text-indigo-600",
    iconBgColor = "bg-indigo-50"
}: DrawerProps) {
    const drawerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };

        if (isOpen) {
            document.body.style.overflow = "hidden";
            window.addEventListener("keydown", handleEscape);
        }

        return () => {
            document.body.style.overflow = "unset";
            window.removeEventListener("keydown", handleEscape);
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <div className="fixed top-16 right-0 bottom-0 z-[100] flex justify-end">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px] animate-fade-in"
                onClick={onClose}
            />

            {/* Drawer Panel */}
            <div
                ref={drawerRef}
                className="relative w-full max-w-lg h-full bg-white shadow-2xl flex flex-col animate-slide-in-right border-l border-slate-100"
            >
                {/* Header */}
                <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/30">
                    <div className="flex items-center gap-4">
                        {Icon && (
                            <div className={`w-10 h-10 rounded-xl ${iconBgColor} ${iconColor} flex items-center justify-center shadow-sm`}>
                                <Icon className="w-5 h-5" />
                            </div>
                        )}
                        <div>
                            <h2 className="text-xl font-bold text-slate-900 leading-tight">{title}</h2>
                            {subtitle && <p className="text-xs text-slate-500 mt-0.5 font-medium">{subtitle}</p>}
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 text-slate-400 hover:text-slate-600 hover:bg-white rounded-full transition-all border border-transparent hover:border-slate-200"
                    >
                        <HiX className="w-5 h-5" />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
                    {children}
                </div>
            </div>
        </div>
    );
}
