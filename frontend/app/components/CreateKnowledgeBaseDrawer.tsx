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
import { Button, Input } from "@heroui/react";
import { SelectableItemList, SelectableListSkeleton } from "./ui";
import type { SelectableItem } from "./ui";
import { theme } from "../theme";
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
                variant="bordered"
                onPress={onClose}
                className="font-medium rounded-lg h-10 px-6 transition-all hover:bg-slate-50 border border-slate-100 text-slate-600 shadow-sm whitespace-nowrap"
            >
                Cancel
            </Button>
            <Button
                onPress={handleSubmit}
                isDisabled={isSubmitting || !name || (!editDataset && selectedDocs.length === 0)}
                isLoading={isSubmitting}
                className="text-white text-sm font-bold rounded-lg h-10 px-8 shadow-lg shadow-indigo-500/20 transition-all hover:-translate-y-0.5 whitespace-nowrap"
                style={{ backgroundColor: theme.colors.primary.main }}
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
            iconBgColor="bg-emerald-50"
            iconColor="text-emerald-600"
            footer={footer}
            size="2xl"
        >
            <div className="space-y-8 animate-fade-in">
                <div className="space-y-3">
                    <label className="text-sm font-bold block text-slate-700">Knowledge Base Name</label>
                    <p className="text-xs text-slate-400">Identify this collection for your AI assistants.</p>
                    <Input
                        variant="bordered"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g. Legal Documents 2024"
                        classNames={{
                            inputWrapper: "rounded-lg border border-slate-100 h-11 hover:border-emerald-400 bg-slate-50 transition-all shadow-none",
                            input: "font-medium text-sm text-slate-800",
                        }}
                    />
                </div>

                {!editDataset && (
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <label className="text-sm font-bold block text-slate-700">Select Sources</label>
                            <span className="text-[10px] font-black text-slate-400 uppercase bg-slate-100 px-2 py-0.5 rounded-full tracking-wider">
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
                                emptyMessage={<>No sources available.</>}
                            />
                        )}
                    </div>
                )}
            </div>
        </Drawer>
    );
}
