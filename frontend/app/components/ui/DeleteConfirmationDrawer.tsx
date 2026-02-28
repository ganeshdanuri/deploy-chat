/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { HiTrash, HiExclamation, HiX } from "react-icons/hi";
import Drawer from "../Drawer";
import { Button } from "@heroui/react";

interface DeleteConfirmationDrawerProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    description: string;
    itemName?: string;
    isLoading?: boolean;
}

export default function DeleteConfirmationDrawer({
    isOpen,
    onClose,
    onConfirm,
    title,
    description,
    itemName,
    isLoading = false,
}: DeleteConfirmationDrawerProps) {
    const footer = (
        <div className="flex gap-3 w-full">
            <Button
                onPress={onClose}
                variant="bordered"
                className="flex-1 border-slate-100 text-slate-600 text-xs sm:text-sm font-bold h-12 rounded-lg hover:bg-slate-50 transition-all shadow-sm"
                disabled={isLoading}
            >
                Cancel
            </Button>
            <Button
                onPress={onConfirm}
                isLoading={isLoading}
                className="flex-[1.5] bg-red-600 text-white text-xs sm:text-sm font-bold h-12 rounded-lg shadow-lg shadow-red-500/10 hover:bg-red-700 hover:-translate-y-0.5 active:translate-y-0 transition-all"
            >
                Confirm Removal
            </Button>
        </div>
    );

    return (
        <Drawer
            isOpen={isOpen}
            onClose={onClose}
            title={title}
            subtitle="Please review the implications of this action."
            icon={HiTrash}
            iconColor="text-red-600"
            iconBgColor="bg-red-50"
            footer={footer}
        >
            <div className="space-y-6 animate-fade-in">
                <div className="flex flex-col gap-4 p-6 bg-red-50/50 rounded-2xl border border-red-100">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-sm shrink-0">
                            <HiExclamation className="w-6 h-6 text-red-500" />
                        </div>
                        <h4 className="text-sm font-black text-red-900 uppercase tracking-wider">Critical Warning</h4>
                    </div>
                    <div className="space-y-2">
                        <p className="text-sm text-red-800 leading-relaxed font-medium">
                            {description}
                        </p>
                        {itemName && (
                            <div className="inline-block px-3 py-1.5 bg-white border border-red-100 rounded-lg text-sm font-bold text-red-900 shadow-sm">
                                &quot;{itemName}&quot;
                            </div>
                        )}
                    </div>
                </div>

                <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                    <ul className="space-y-2">
                        <li className="flex items-start gap-2 text-xs text-slate-500 font-medium italic">
                            <span className="shrink-0 mt-0.5">•</span>
                            <span>This action is permanent and irreversible.</span>
                        </li>
                        <li className="flex items-start gap-2 text-xs text-slate-500 font-medium italic">
                            <span className="shrink-0 mt-0.5">•</span>
                            <span>All associated analytics and logs will be purged.</span>
                        </li>
                    </ul>
                </div>

                <p className="text-xs text-slate-400 text-center px-4 font-medium italic">
                    Type confirmed in your mind before clicking the red button.
                </p>
            </div>
        </Drawer>
    );
}
