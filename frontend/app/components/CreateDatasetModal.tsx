"use client";

import { useState, useEffect } from "react";
import { HiDatabase, HiDocumentText, HiCheck } from "react-icons/hi";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/lib/store/store";
import { fetchDocuments } from "@/lib/store/slices/documentsSlice";
import { createDataset } from "@/lib/store/slices/datasetsSlice";
import Modal from "./Modal";
import showToast from "@/lib/toast";

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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
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

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Setup Global Knowledge"
            subtitle="Connect your and organize your knowledge sources."
            icon={HiDatabase}
            iconBgColor="bg-emerald-50"
            iconColor="text-emerald-600"
        >
            <form onSubmit={handleSubmit} className="space-y-8">
                <div className="space-y-8">
                    {/* Dataset Name */}
                    <div className="space-y-3">
                        <label htmlFor="name" className="block text-sm font-bold text-slate-800">
                            Dataset Name
                        </label>
                        <p className="text-xs text-slate-500 font-medium">Identify this collection for your AI assistant.</p>
                        <input
                            type="text"
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="e.g. Legal Documents 2024"
                            className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all font-semibold text-sm"
                            required
                        />
                    </div>

                    {/* Document Selection */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <label className="block text-sm font-bold text-slate-800">
                                Select Sources
                            </label>
                            <span className="text-[11px] font-bold text-slate-400 uppercase bg-slate-100 px-2 py-0.5 rounded-full">
                                {selectedDocs.length} selected
                            </span>
                        </div>

                        <div className="max-h-[300px] overflow-y-auto pr-2 custom-scrollbar space-y-3">
                            {documents.length === 0 ? (
                                <div className="p-12 text-center bg-slate-50 rounded-[2rem] border border-dashed border-slate-200">
                                    <HiDocumentText className="w-10 h-10 text-slate-200 mx-auto mb-3" />
                                    <p className="text-sm text-slate-500 font-medium leading-relaxed">No sources available.<br />Upload documents first.</p>
                                </div>
                            ) : (
                                documents.map((doc) => (
                                    <div
                                        key={doc.id}
                                        onClick={() => toggleDocument(doc.id)}
                                        className={`
                                            group flex items-center justify-between p-4 cursor-pointer transition-all duration-300 rounded-2xl border
                                            ${selectedDocs.includes(doc.id)
                                                ? 'bg-emerald-50/70 border-emerald-200 shadow-sm'
                                                : 'bg-white border-slate-100 hover:border-emerald-100 hover:bg-emerald-50/20'}
                                        `}
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className={`
                                                w-10 h-10 rounded-xl flex items-center justify-center border transition-all duration-500
                                                ${selectedDocs.includes(doc.id)
                                                    ? 'bg-emerald-600 border-emerald-600 text-white shadow-md rotate-3'
                                                    : 'bg-slate-50 border-slate-200 text-slate-400 group-hover:rotate-2'}
                                            `}>
                                                {selectedDocs.includes(doc.id) ? <HiCheck className="w-6 h-6" /> : <HiDocumentText className="w-5 h-5" />}
                                            </div>
                                            <div>
                                                <p className={`text-sm font-bold transition-colors ${selectedDocs.includes(doc.id) ? 'text-emerald-900' : 'text-slate-700'}`}>
                                                    {doc.name}
                                                </p>
                                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">Source ID: {doc.id.slice(0, 8)}</p>
                                            </div>
                                        </div>
                                        <div className={`
                                            w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-500
                                            ${selectedDocs.includes(doc.id)
                                                ? 'bg-emerald-600 border-emerald-600'
                                                : 'bg-white border-slate-200 group-hover:border-emerald-400'}
                                        `}>
                                            {selectedDocs.includes(doc.id) && <HiCheck className="w-3.5 h-3.5 text-white" />}
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>

                {/* Footer Actions */}
                <div className="pt-6 border-t border-slate-100 flex gap-4">
                    <button
                        type="button"
                        onClick={onClose}
                        className="flex-1 px-6 py-3.5 border border-slate-200 text-slate-700 font-bold rounded-2xl hover:bg-slate-50 transition-all text-sm active:scale-95"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={isSubmitting || !name || selectedDocs.length === 0}
                        className="flex-[1.5] px-6 py-3.5 bg-slate-900 text-white font-bold rounded-2xl hover:bg-emerald-600 disabled:opacity-30 disabled:cursor-not-allowed shadow-xl shadow-slate-200 hover:shadow-emerald-200 transition-all text-sm active:scale-95 flex items-center justify-center gap-2"
                    >
                        {isSubmitting ? (
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        ) : null}
                        <span>{isSubmitting ? "Syncing..." : "Initialize Dataset"}</span>
                    </button>
                </div>
            </form>
        </Modal>
    );
}
