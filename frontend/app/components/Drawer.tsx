"use client";

import {
    Drawer as HeroDrawer,
    DrawerContent,
    DrawerHeader,
    DrawerBody,
    DrawerFooter,
    Button
} from "@heroui/react";
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
    footer?: React.ReactNode;
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
    footer
}: DrawerProps) {
    return (
        <HeroDrawer
            isOpen={isOpen}
            onOpenChange={onClose}
            placement="right"
            size="md"
            backdrop="blur"
            classNames={{
                base: "bg-white border-l border-slate-100 h-full",
                closeButton: "hidden"
            }}
        >
            <DrawerContent>
                {(onCloseAction) => (
                    <>
                        <DrawerHeader className="px-8 py-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/30 shrink-0">
                            <div className="flex items-center gap-4">
                                {Icon && (
                                    <div className={`w-10 h-10 rounded-xl ${iconBgColor} ${iconColor} flex items-center justify-center shadow-sm`}>
                                        <Icon className="w-5 h-5" />
                                    </div>
                                )}
                                <div>
                                    <h2 className="text-xl font-semibold text-slate-800 leading-tight">{title}</h2>
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
                        </DrawerHeader>

                        <DrawerBody className="flex-1 overflow-y-auto p-8 custom-scrollbar">
                            {children}
                        </DrawerBody>

                        {footer && (
                            <DrawerFooter className="p-8 border-t border-slate-100 bg-slate-50/50">
                                {footer}
                            </DrawerFooter>
                        )}
                    </>
                )}
            </DrawerContent>
        </HeroDrawer>
    );
}
