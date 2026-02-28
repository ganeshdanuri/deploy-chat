"use client";

import {
    Modal as HeroModal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
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
    iconColor = "text-indigo-600",
    iconBgColor = "bg-indigo-50",
    footer,
    size = "md"
}: ModalProps) {
    return (
        <HeroModal
            isOpen={isOpen}
            onOpenChange={onClose}
            size={size}
            backdrop="opaque"
            classNames={{
                base: "bg-white border border-slate-100 rounded-2xl shadow-2xl",
                closeButton: "hidden",
                backdrop: "bg-slate-900/40 backdrop-blur-md"
            }}
            motionProps={{
                variants: {
                    enter: {
                        y: 0,
                        opacity: 1,
                        transition: {
                            duration: 0.3,
                            ease: "easeOut",
                        },
                    },
                    exit: {
                        y: -20,
                        opacity: 0,
                        transition: {
                            duration: 0.2,
                            ease: "easeIn",
                        },
                    },
                }
            }}
        >
            <ModalContent>
                {(onCloseAction) => (
                    <>
                        <ModalHeader className="px-8 py-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/30 shrink-0">
                            <div className="flex items-center gap-4">
                                {Icon && (
                                    <div className={`w-10 h-10 rounded-xl ${iconBgColor} ${iconColor} flex items-center justify-center shadow-sm`}>
                                        <Icon className="w-5 h-5" />
                                    </div>
                                )}
                                <div>
                                    <h2 className="text-xl font-bold text-slate-800 leading-tight">{title}</h2>
                                    {subtitle && <p className="text-xs text-slate-500 mt-0.5 font-medium">{subtitle}</p>}
                                </div>
                            </div>
                            <Button
                                isIconOnly
                                variant="light"
                                onPress={onCloseAction}
                                className="text-slate-400 hover:text-slate-600 hover:bg-white rounded-lg transition-all border border-transparent hover:border-slate-200"
                            >
                                <HiX className="w-5 h-5" />
                            </Button>
                        </ModalHeader>

                        <ModalBody className="p-8 overflow-y-auto">
                            {children}
                        </ModalBody>

                        {footer && (
                            <ModalFooter className="p-8 border-t border-slate-100 bg-slate-50/50">
                                {footer}
                            </ModalFooter>
                        )}
                    </>
                )}
            </ModalContent>
        </HeroModal>
    );
}
