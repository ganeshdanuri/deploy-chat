"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { HiX } from "react-icons/hi";

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
    subtitle?: string;
    icon?: React.ElementType;
    iconColor?: string;
    iconBgColor?: string;
    maxWidth?: string;
}

export default function Modal({
    isOpen,
    onClose,
    title,
    children,
    subtitle,
    icon: Icon,
    iconColor = "text-indigo-600",
    iconBgColor = "bg-indigo-50",
    maxWidth = "max-w-lg"
}: ModalProps) {
    const modalRef = useRef<HTMLDivElement>(null);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        return () => setMounted(false);
    }, []);

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

    if (!isOpen || !mounted) return null;

    return createPortal(
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-fade-in"
                onClick={onClose}
            />

            {/* Modal Panel */}
            <div
                ref={modalRef}
                className={`relative w-full ${maxWidth} bg-white shadow-2xl rounded-2xl flex flex-col animate-scale-in overflow-hidden`}
            >
                {/* Header */}
                <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                    <div className="flex items-center gap-3">
                        {Icon && (
                            <div className={`w-9 h-9 rounded-lg ${iconBgColor} ${iconColor} flex items-center justify-center shadow-sm shadow-black/5`}>
                                <Icon className="w-5 h-5" />
                            </div>
                        )}
                        <div>
                            <h2 className="text-lg font-bold text-slate-900 leading-tight">{title}</h2>
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
                <div className="flex-1 overflow-y-auto p-6 custom-scrollbar max-h-[calc(100vh-12rem)]">
                    {children}
                </div>
            </div>
        </div>,
        document.body
    );
}
