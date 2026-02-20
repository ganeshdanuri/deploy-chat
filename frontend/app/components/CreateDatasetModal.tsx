"use client";

import { useState, useEffect } from "react";
import { HiDatabase, HiDocumentText, HiCheck } from "react-icons/hi";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/lib/store/store";
import { fetchDocuments } from "@/lib/store/slices/documentsSlice";
import { createDataset } from "@/lib/store/slices/datasetsSlice";
import Drawer from "./Drawer";
import showToast from "@/lib/toast";
import { Button, Input, Card, CardBody } from "@heroui/react";

interface CreateDatasetModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function CreateDatasetModal({ isOpen, onClose }: CreateDatasetModalProps) {
    const [name, setName] = useState("");
    const [selectedDocs, setSelectedDocs] = useState<string[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const dispatch = useDispatch<AppDispatch>();
    const { items: documents, status: docStatus } = useSelector((state: RootState) => state.documents);

    useEffect(() => {
        if (isOpen && docStatus === 'idle') {
            dispatch(fetchDocuments());
        }
    }, [isOpen, docStatus, dispatch]);

    const toggleDocument = (id: string) => {
        setSelectedDocs(prev =>
            prev.includes(id)
                ? prev.filter(docId => docId !== id)
                : [...prev, id]
        );
    };

    const handleSubmit = async (e?: React.FormEvent) => {
        e?.preventDefault();
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
                onPress={() => handleSubmit()}
                isDisabled={isSubmitting || !name || selectedDocs.length === 0}
                isLoading={isSubmitting}
                className="flex-[1.5] bg-emerald-600 text-white font-semibold rounded-2xl h-12 shadow-xl shadow-emerald-200"
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
            subtitle="Connect your and organize your knowledge sources."
            icon={HiDatabase}
            iconBgColor="bg-emerald-50"
            iconColor="text-emerald-600"
            footer={footer}
        >
            <div className="space-y-8">
                {/* Dataset Name */}
                <div className="space-y-3">
                    <label htmlFor="name" className="block text-sm font-medium text-slate-700">
                        Dataset Name
                    </label>
                    <p className="text-xs text-slate-400">Identify this collection for your AI assistant.</p>
                    <Input
                        type="text"
                        variant="bordered"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g. Legal Documents 2024"
                        classNames={{
                            inputWrapper: "rounded-2xl border-slate-200 h-12",
                            input: "font-medium text-sm"
                        }}
                    />
                </div>

                {/* Document Selection */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <label className="block text-sm font-medium text-slate-700">
                            Select Sources
                        </label>
                        <span className="text-[11px] font-medium text-slate-400 uppercase bg-slate-100 px-2 py-0.5 rounded-full">
                            {selectedDocs.length} selected
                        </span>
                    </div>

                    <div className="space-y-3">
                        {documents.length === 0 ? (
                            <div className="p-12 text-center bg-slate-50 rounded-[2rem] border border-dashed border-slate-200">
                                <HiDocumentText className="w-10 h-10 text-slate-200 mx-auto mb-3" />
                                <p className="text-sm text-slate-500 font-medium leading-relaxed">No sources available.<br />Upload documents first.</p>
                            </div>
                        ) : (
                            documents.map((doc) => (
                                <Card
                                    key={doc.id}
                                    isPressable
                                    onPress={() => toggleDocument(doc.id)}
                                    className={`
                                        border-1 transition-all duration-300 rounded-2xl shadow-none
                                        ${selectedDocs.includes(doc.id)
                                            ? 'bg-emerald-50/70 border-emerald-200 shadow-sm'
                                            : 'bg-white border-slate-100 hover:border-emerald-100 hover:bg-emerald-50/20'}
                                    `}
                                >
                                    <CardBody className="flex flex-row items-center justify-between p-4">
                                        <div className="flex items-center gap-4">
                                            <div className={`
                                                w-10 h-10 rounded-xl flex items-center justify-center border transition-all duration-500
                                                ${selectedDocs.includes(doc.id)
                                                    ? 'bg-emerald-600 border-emerald-600 text-white shadow-md'
                                                    : 'bg-slate-50 border-slate-200 text-slate-400'}
                                            `}>
                                                {selectedDocs.includes(doc.id) ? <HiCheck className="w-6 h-6" /> : <HiDocumentText className="w-5 h-5" />}
                                            </div>
                                            <div>
                                                <p className={`text-sm font-medium transition-colors ${selectedDocs.includes(doc.id) ? 'text-emerald-900' : 'text-slate-600'}`}>
                                                    {doc.name}
                                                </p>
                                                <p className="text-[10px] text-slate-400 uppercase tracking-tight">Source ID: {doc.id.slice(0, 8)}</p>
                                            </div>
                                        </div>
                                        <div className={`
                                            w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-500
                                            ${selectedDocs.includes(doc.id)
                                                ? 'bg-emerald-600 border-emerald-600'
                                                : 'bg-white border-slate-200'}
                                        `}>
                                            {selectedDocs.includes(doc.id) && <HiCheck className="w-3.5 h-3.5 text-white" />}
                                        </div>
                                    </CardBody>
                                </Card>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </Drawer>
    );
}
