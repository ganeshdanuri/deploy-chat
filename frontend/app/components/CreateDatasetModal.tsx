/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import { HiDatabase, HiDocumentText } from "react-icons/hi";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { fetchDocuments } from "@/lib/store/slices/documentsSlice";
import { createDataset } from "@/lib/store/slices/datasetsSlice";
import Drawer from "./Drawer";
import showToast from "@/lib/toast";
import { Button, Input } from "@heroui/react";
import { SelectableItemList, SelectableListSkeleton } from "./ui";
import type { SelectableItem } from "./ui";

interface CreateDatasetModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function CreateDatasetModal({ isOpen, onClose }: CreateDatasetModalProps) {
    const [name, setName] = useState("");
    const [selectedDocs, setSelectedDocs] = useState<string[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const dispatch = useAppDispatch();
    const { items: documents, status: docStatus } = useAppSelector((state) => state.documents);

    useEffect(() => {
        if (isOpen && docStatus === "idle") {
            dispatch(fetchDocuments());
        }
    }, [isOpen, docStatus, dispatch]);

    const toggleDocument = (id: string) => {
        setSelectedDocs((prev) =>
            prev.includes(id) ? prev.filter((docId) => docId !== id) : [...prev, id]
        );
    };

    const handleSubmit = async () => {
        if (!name || selectedDocs.length === 0) return;

        setIsSubmitting(true);
        try {
            await dispatch(createDataset({ name, document_ids: selectedDocs })).unwrap();
            showToast.success(`Dataset "${name}" created successfully!`);
            setName("");
            setSelectedDocs([]);
            onClose();
        } catch (error: any) {
            showToast.error(error?.message || "Failed to create dataset. Please try again.");
            console.error("Failed to create dataset:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const documentItems: SelectableItem[] = documents.map((doc) => ({
        id: doc.id,
        label: doc.name,
        sublabel: `Source ID: ${doc.id.slice(0, 8)}`,
    }));

    const footer = (
        <div className="flex gap-4 w-full">
            <Button
                variant="bordered"
                onPress={onClose}
                className="flex-1 font-medium rounded-2xl h-12"
            >
                Cancel
            </Button>
            <Button
                color="success"
                onPress={handleSubmit}
                isDisabled={isSubmitting || !name || selectedDocs.length === 0}
                isLoading={isSubmitting}
                className="flex-[1.5] bg-emerald-600 text-white text-sm font-medium rounded-2xl h-12"
            >
                {isSubmitting ? "Syncing..." : "Initialize Dataset"}
            </Button>
        </div>
    );

    return (
        <Drawer
            isOpen={isOpen}
            onClose={onClose}
            title="Setup Global Knowledge"
            subtitle="Connect and organize your knowledge sources."
            icon={HiDatabase}
            iconBgColor="bg-emerald-50"
            iconColor="text-emerald-600"
            footer={footer}
        >
            <div className="space-y-8">
                {/* Dataset Name */}
                <div className="space-y-3">
                    <label htmlFor="dataset-name" className="text-sm font-medium block text-slate-700">
                        Dataset Name
                    </label>
                    <p className="text-xs text-slate-400">Identify this collection for your AI assistant.</p>
                    <Input
                        id="dataset-name"
                        type="text"
                        variant="bordered"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g. Legal Documents 2024"
                        classNames={{
                            inputWrapper: "rounded-2xl border-2 border-slate-300 h-12 hover:border-slate-400 data-[focus=true]:border-emerald-500 shadow-none bg-white",
                            input: "font-medium text-sm text-slate-800 placeholder:text-slate-400",
                        }}
                    />
                </div>

                {/* Document Selection */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <label className="text-sm font-medium block text-slate-700">
                            Select Sources
                        </label>
                        <span className="text-[11px] font-medium text-slate-400 uppercase bg-slate-100 px-2 py-0.5 rounded-full">
                            {selectedDocs.length} selected
                        </span>
                    </div>
                    {docStatus === "loading" ? (
                        <SelectableListSkeleton rows={3} />
                    ) : (
                        <SelectableItemList
                            items={documentItems}
                            selectedIds={selectedDocs}
                            onToggle={toggleDocument}
                            defaultIcon={HiDocumentText}
                            accentColor="emerald"
                            emptyIcon={HiDocumentText}
                            emptyMessage={
                                <>No sources available.<br />Upload documents first.</>
                            }
                        />
                    )}
                </div>
            </div>
        </Drawer>
    );
}
