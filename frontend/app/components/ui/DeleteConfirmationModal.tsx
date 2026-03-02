"use client";

import { HiTrash, HiExclamation } from "react-icons/hi";
import Modal from "../Modal";
import { Button } from "@/components/ui/button";

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
    const footer = (
        <div className="flex gap-3 justify-end w-full">
            <Button
                onClick={onClose}
                variant="outline"
                className="border-[#e3e2e5] text-[#5a5a6a] text-xs sm:text-sm font-bold h-10 px-6 hover:bg-[#f3f3f9] transition-all shadow-sm"
                disabled={isLoading}
            >
                Cancel
            </Button>
            <Button
                onClick={onConfirm}
                className="bg-red-600 text-white text-xs sm:text-sm font-bold h-10 px-8 shadow-lg shadow-red-500/10 hover:bg-red-700 transition-all"
                disabled={isLoading}
            >
                {isLoading ? "Deleting..." : "Confirm Removal"}
            </Button>
        </div>
    );

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={title}
            subtitle="Please review the implications of this action."
            icon={HiTrash}
            iconColor="text-red-600"
            iconBgColor="bg-red-50"
            footer={footer}
            size="md"
        >
            <div className="space-y-6 animate-fade-in">
                <div className="flex flex-col gap-4 p-6 bg-red-50/50 border border-red-100">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-white flex items-center justify-center shadow-sm shrink-0">
                            <HiExclamation className="w-6 h-6 text-red-500" />
                        </div>
                        <h4 className="text-sm font-black text-red-900 uppercase tracking-wider">Critical Warning</h4>
                    </div>
                    <div className="space-y-2">
                        <p className="text-sm text-red-800 leading-relaxed font-medium">
                            {description}
                        </p>
                        {itemName && (
                            <div className="inline-block px-3 py-1.5 bg-white border border-red-100 text-sm font-bold text-red-900 shadow-sm">
                                &quot;{itemName}&quot;
                            </div>
                        )}
                    </div>
                </div>

                <div className="p-4 bg-[#f3f3f9] border border-[#e3e2e5]">
                    <ul className="space-y-2">
                        <li className="flex items-start gap-2 text-xs text-[#5a5a6a] font-medium italic">
                            <span className="shrink-0 mt-0.5">•</span>
                            <span>This action is permanent and irreversible.</span>
                        </li>
                        <li className="flex items-start gap-2 text-xs text-[#5a5a6a] font-medium italic">
                            <span className="shrink-0 mt-0.5">•</span>
                            <span>All associated analytics and logs will be purged.</span>
                        </li>
                    </ul>
                </div>

                <p className="text-xs text-[#a1a1a1] text-center px-4 font-medium italic">
                    Type confirmed in your mind before clicking the red button.
                </p>
            </div>
        </Modal>
    );
}
