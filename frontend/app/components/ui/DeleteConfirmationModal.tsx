"use client";
import { AlertTriangle } from "lucide-react";


import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog";
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
    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <div
                        className="w-10 h-10 rounded-md flex items-center justify-center mb-3"
                        style={{
                            background: "rgba(220, 38, 38, 0.08)",
                            color: "var(--destructive)",
                        }}
                    >
                        <AlertTriangle className="w-5 h-5" />
                    </div>
                    <DialogTitle className="text-[17px] font-medium tracking-tight">
                        {title}
                    </DialogTitle>
                    <DialogDescription className="text-sm text-muted-foreground leading-relaxed">
                        {description}
                    </DialogDescription>
                </DialogHeader>

                {itemName && (
                    <div className="my-1 p-3 bg-muted/60 border border-border rounded-md text-sm font-medium text-foreground truncate">
                        {itemName}
                    </div>
                )}

                <p className="text-xs text-muted-foreground">
                    This action is permanent and cannot be undone.
                </p>

                <DialogFooter className="mt-4 gap-2 sm:gap-2">
                    <Button
                        onClick={onClose}
                        variant="outline"
                        disabled={isLoading}
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={onConfirm}
                        disabled={isLoading}
                        style={{
                            background: "var(--destructive)",
                            color: "var(--background)",
                        }}
                        className="hover:opacity-90"
                    >
                        {isLoading ? "Deleting..." : "Delete"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
