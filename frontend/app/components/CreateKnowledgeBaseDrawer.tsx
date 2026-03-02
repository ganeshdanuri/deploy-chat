/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import { HiDatabase, HiDocumentText } from "react-icons/hi";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { fetchDocuments } from "@/lib/store/slices/documentsSlice";
import { fetchConnectors } from "@/lib/store/slices/connectorsSlice";
import { createDataset, fetchDatasets } from "@/lib/store/slices/datasetsSlice";
import Drawer from "./Drawer";
import { SiNotion } from "react-icons/si";
import showToast from "@/lib/toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/app/components/ui";
import { SelectableItemList, SelectableListSkeleton } from "./ui";
import type { SelectableItem } from "./ui";
import api from "@/lib/api";
import { ENDPOINTS } from "@/lib/endpoints";

interface CreateKnowledgeBaseDrawerProps {
    isOpen: boolean;
    onClose: () => void;
    editDataset?: any;
}

export default function CreateKnowledgeBaseDrawer({ isOpen, onClose, editDataset }: CreateKnowledgeBaseDrawerProps) {
    const [name, setName] = useState("");
    const [selectedDocs, setSelectedDocs] = useState<string[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const dispatch = useAppDispatch();
    const { items: documents, status: docStatus } = useAppSelector((state) => state.documents);
    const { items: connectors, status: connStatus } = useAppSelector((state) => state.connectors);

    useEffect(() => {
        if (isOpen) {
            if (docStatus === "idle") dispatch(fetchDocuments());
            if (connStatus === "idle") dispatch(fetchConnectors());
        }
    }, [isOpen, docStatus, connStatus, dispatch]);

    useEffect(() => {
        if (editDataset && isOpen) {
            setName(editDataset.name || "");
        } else if (!editDataset && isOpen) {
            setName("");
            setSelectedDocs([]);
        }
    }, [editDataset, isOpen]);

    const toggleDocument = (id: string) => {
        setSelectedDocs((prev) =>
            prev.includes(id) ? prev.filter((docId) => docId !== id) : [...prev, id]
        );
    };

    const handleSubmit = async () => {
        if (!name || (!editDataset && selectedDocs.length === 0)) return;

        setIsSubmitting(true);
        try {
            if (editDataset) {
                await api.patch(ENDPOINTS.DATASETS.BY_ID(editDataset.id), {
                    name,
                });
                showToast.success(`Knowledge base "${name}" updated successfully!`);
                dispatch(fetchDatasets());
            } else {
                await dispatch(createDataset({ name, document_ids: selectedDocs })).unwrap();
                showToast.success(`Knowledge base "${name}" created successfully!`);
            }
            onClose();
        } catch (error: any) {
            showToast.error(error?.message || `Failed to ${editDataset ? 'update' : 'create'} knowledge base.`);
        } finally {
            setIsSubmitting(false);
        }
    };

    const documentItems: SelectableItem[] = documents.map((doc) => {
        const connector = doc.connector_id ? connectors.find((c: any) => c.id === doc.connector_id) : null;
        return {
            id: doc.id,
            label: doc.name,
            sublabel: connector ? `${connector.type}: ${connector.name}` : "Manual Upload",
            icon: connector?.type === 'notion' ? SiNotion : HiDocumentText,
        };
    });

    const footer = (
        <>
            <Button
                variant="outline-secondary"
                onClick={onClose}
                className="font-medium h-10 px-6 whitespace-nowrap"
            >
                Cancel
            </Button>
            <Button
                variant="primary"
                onClick={handleSubmit}
                disabled={isSubmitting || !name || (!editDataset && selectedDocs.length === 0)}
                className="text-sm h-10 px-8 whitespace-nowrap"
            >
                {isSubmitting ? "Processing..." : editDataset ? "Save Changes" : "Create Knowledge Base"}
            </Button>
        </>
    );

    return (
        <Drawer
            isOpen={isOpen}
            onClose={onClose}
            title={editDataset ? "Edit Knowledge Base" : "New Knowledge Base"}
            subtitle={editDataset ? "Update your knowledge collection details." : "Connect and organize your knowledge sources."}
            icon={HiDatabase}
            iconBgColor="bg-emerald-50/50"
            iconColor="text-emerald-600"
            footer={footer}
            size="2xl"
        >
            <div className="space-y-8 animate-fade-in">
                <div className="space-y-3">
                    <label className="text-sm font-bold block text-secondary">Knowledge Base Name</label>
                    <p className="text-xs text-muted-foreground">Identify this collection for your AI assistants.</p>
                    <Input
                        variant="bordered"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g. Legal Documents 2024"
                        classNames={{
                            inputWrapper: "border border-border h-11 hover:border-emerald-400 bg-muted transition-all shadow-none",
                            input: "font-medium text-sm text-secondary",
                        }}
                    />
                </div>

                {!editDataset && (
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <label className="text-sm font-bold block text-secondary">Select Sources</label>
                            <span className="text-[10px] font-black text-muted-foreground uppercase bg-muted px-2 py-0.5 tracking-wider">
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
                                accentColor="slate"
                                emptyIcon={HiDocumentText}
                                emptyMessage={<>No sources available.</>}
                            />
                        )}
                    </div>
                )}
            </div>
        </Drawer>
    );
}
