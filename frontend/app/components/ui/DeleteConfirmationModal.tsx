"use client";

import { HiTrash, HiExclamation } from "react-icons/hi";
import Modal from "../Modal";
import { Button } from "@heroui/react";

interface DeleteConfirmationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    description: string;
    itemName?: string;
    isLoading?: boolean;
}

export default function DeleteConfirmationModal({
    isOpen,
    onClose,
    onConfirm,
    title,
    description,
    itemName,
    isLoading = false,
}: DeleteConfirmationModalProps) {
    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={title}
            icon={HiTrash}
            iconColor="text-red-600"
            iconBgColor="bg-red-50"
            maxWidth="md"
        >
            <div className="space-y-6">
                <div className="flex items-start gap-4 p-4 bg-amber-50 rounded-xl border border-amber-100/50">
                    <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm shrink-0">
                        <HiExclamation className="w-6 h-6 text-amber-500" />
                    </div>
                    <div className="space-y-1">
                        <p className="text-[13px] font-bold text-amber-900 uppercase tracking-tight">Attention Required</p>
                        <p className="text-[13px] text-amber-800/80 leading-relaxed">
                            {description} {itemName && <span className="font-bold text-amber-900">&quot;{itemName}&quot;</span>}
                        </p>
                    </div>
                </div>

                <p className="text-[13px] text-slate-600 px-1">
                    This action is permanent and cannot be undone. All associated data will be removed.
                </p>

                <div className="flex gap-3 pt-2">
                    <Button
                        onPress={onClose}
                        variant="bordered"
                        className="flex-1 border-slate-200 text-slate-600 text-xs sm:text-sm font-medium h-11 rounded-lg hover:bg-slate-50 transition-all"
                        disabled={isLoading}
                    >
                        Cancel
                    </Button>
                    <Button
                        onPress={onConfirm}
                        isLoading={isLoading}
                        className="flex-1 bg-red-600 text-white text-xs sm:text-sm font-medium h-11 rounded-lg shadow-lg shadow-red-500/10 hover:bg-red-700 hover:-translate-y-0.5 active:translate-y-0 transition-all font-semibold"
                    >
                        Delete Permanently
                    </Button>
                </div>
            </div>
        </Modal>
    );
}
