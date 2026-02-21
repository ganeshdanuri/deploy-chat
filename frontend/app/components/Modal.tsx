"use client";

import {
    Modal as HeroModal,
    ModalContent,
    ModalHeader,
    ModalBody,
    Button
} from "@heroui/react";
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
    maxWidth?: "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl" | "5xl" | "full";
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
    maxWidth = "lg"
}: ModalProps) {
    return (
        <HeroModal
            isOpen={isOpen}
            onOpenChange={onClose}
            size={maxWidth}
            backdrop="blur"
            scrollBehavior="inside"
            classNames={{
                base: "bg-white shadow-2xl rounded-2xl overflow-hidden",
                closeButton: "hidden"
            }}
        >
            <ModalContent>
                {(onCloseAction) => (
                    <>
                        <ModalHeader className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                            <div className="flex items-center gap-3">
                                {Icon && (
                                    <div className={`w-9 h-9 rounded-lg ${iconBgColor} ${iconColor} flex items-center justify-center shadow-sm shadow-black/5`}>
                                        <Icon className="w-5 h-5" />
                                    </div>
                                )}
                                <div>
                                    <h2 className="text-lg font-semibold text-slate-800 leading-tight">{title}</h2>
                                    {subtitle && <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>}
                                </div>
                            </div>
                            <Button
                                isIconOnly
                                variant="light"
                                onPress={onCloseAction}
                                className="text-slate-400 hover:text-slate-600 hover:bg-white rounded-full transition-all border border-transparent hover:border-slate-200"
                            >
                                <HiX className="w-5 h-5" />
                            </Button>
                        </ModalHeader>

                        <ModalBody className="p-6">
                            {children}
                        </ModalBody>
                    </>
                )}
            </ModalContent>
        </HeroModal>
    );
}
