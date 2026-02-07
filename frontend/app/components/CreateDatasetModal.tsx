"use client";

import { useState, useEffect } from "react";
import { HiX, HiDatabase, HiDocumentText, HiCheck } from "react-icons/hi";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/lib/store/store";
import { fetchDocuments } from "@/lib/store/slices/documentsSlice";
import { createDataset } from "@/lib/store/slices/datasetsSlice";

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
            setName("");
            setSelectedDocs([]);
            onClose();
        } catch (error) {
            console.error("Failed to create dataset:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fade-in">
            <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden animate-scale-in">
                <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600">
                            <HiDatabase className="w-5 h-5" />
                        </div>
                        <h2 className="text-lg font-bold text-slate-900">Create New Dataset</h2>
                    </div>
                    <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-600 transition-colors">
                        <HiX className="w-5 h-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    <div>
                        <label htmlFor="name" className="block text-sm font-semibold text-slate-700 mb-2">
                            Dataset Name
                        </label>
                        <input
                            type="text"
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="e.g. Customer Support Docs"
                            className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all font-medium"
                            required
                        />
                    </div>

                    <div>
                        <div className="flex items-center justify-between mb-2">
                            <label className="block text-sm font-semibold text-slate-700">
                                Select Documents ({selectedDocs.length})
                            </label>
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                                {documents.length} Available
                            </span>
                        </div>

                        <div className="max-h-[240px] overflow-y-auto border border-slate-100 rounded-xl divide-y divide-slate-50 bg-slate-50/30">
                            {documents.length === 0 ? (
                                <div className="p-8 text-center">
                                    <HiDocumentText className="w-8 h-8 text-slate-200 mx-auto mb-2" />
                                    <p className="text-sm text-slate-500">No documents found. Upload some documents first.</p>
                                </div>
                            ) : (
                                documents.map((doc) => (
                                    <div
                                        key={doc.id}
                                        onClick={() => toggleDocument(doc.id)}
                                        className={`
                                            flex items-center justify-between p-3 cursor-pointer transition-all
                                            ${selectedDocs.includes(doc.id) ? 'bg-emerald-50/50' : 'hover:bg-white'}
                                        `}
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className={`
                                                w-8 h-8 rounded-lg flex items-center justify-center border transition-all
                                                ${selectedDocs.includes(doc.id)
                                                    ? 'bg-emerald-600 border-emerald-600 text-white'
                                                    : 'bg-white border-slate-200 text-slate-400'}
                                            `}>
                                                {selectedDocs.includes(doc.id) ? <HiCheck className="w-5 h-5" /> : <HiDocumentText className="w-4 h-4" />}
                                            </div>
                                            <div>
                                                <p className={`text-sm font-semibold transition-colors ${selectedDocs.includes(doc.id) ? 'text-emerald-700' : 'text-slate-700'}`}>
                                                    {doc.name}
                                                </p>
                                                <p className="text-[10px] text-slate-400 font-medium">Added on {new Date(doc.created_at).toLocaleDateString()}</p>
                                            </div>
                                        </div>
                                        <div className={`
                                            w-5 h-5 rounded-full border flex items-center justify-center transition-all
                                            ${selectedDocs.includes(doc.id)
                                                ? 'bg-emerald-600 border-emerald-600 text-white'
                                                : 'bg-white border-slate-200'}
                                        `}>
                                            {selectedDocs.includes(doc.id) && <HiCheck className="w-3 h-3" />}
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    <div className="flex gap-3 pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-4 py-2.5 border border-slate-200 text-slate-700 font-bold rounded-xl hover:bg-slate-50 transition-all text-sm"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting || !name || selectedDocs.length === 0}
                            className="flex-1 px-4 py-2.5 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-emerald-200 transition-all text-sm"
                        >
                            {isSubmitting ? "Creating..." : "Create Dataset"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
