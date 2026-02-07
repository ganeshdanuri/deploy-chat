"use client";

import { useState, useEffect } from "react";
import { HiX, HiChip, HiDatabase, HiCheck } from "react-icons/hi";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/lib/store/store";
import { fetchDatasets } from "@/lib/store/slices/datasetsSlice";
import { createChatbot } from "@/lib/store/slices/chatbotsSlice";

interface CreateChatbotModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function CreateChatbotModal({ isOpen, onClose }: CreateChatbotModalProps) {
    const [name, setName] = useState("");
    const [selectedDatasets, setSelectedDatasets] = useState<string[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const dispatch = useDispatch<AppDispatch>();
    const { items: datasets, status: dsStatus } = useSelector((state: RootState) => state.datasets);

    useEffect(() => {
        if (isOpen && dsStatus === 'idle') {
            dispatch(fetchDatasets());
        }
    }, [isOpen, dsStatus, dispatch]);

    const toggleDataset = (id: string) => {
        setSelectedDatasets(prev =>
            prev.includes(id)
                ? prev.filter(dsId => dsId !== id)
                : [...prev, id]
        );
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name || selectedDatasets.length === 0) return;

        setIsSubmitting(true);
        try {
            await dispatch(createChatbot({ name, dataset_ids: selectedDatasets })).unwrap();
            setName("");
            setSelectedDatasets([]);
            onClose();
        } catch (error) {
            console.error("Failed to create chatbot:", error);
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
                        <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600">
                            <HiChip className="w-5 h-5" />
                        </div>
                        <h2 className="text-lg font-bold text-slate-900">Create New Chatbot</h2>
                    </div>
                    <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-600 transition-colors">
                        <HiX className="w-5 h-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    <div>
                        <label htmlFor="name" className="block text-sm font-semibold text-slate-700 mb-2">
                            Chatbot Name
                        </label>
                        <input
                            type="text"
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="e.g. Sales Assistant"
                            className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium"
                            required
                        />
                    </div>

                    <div>
                        <div className="flex items-center justify-between mb-2">
                            <label className="block text-sm font-semibold text-slate-700">
                                Select Datasets ({selectedDatasets.length})
                            </label>
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                                {datasets.length} Available
                            </span>
                        </div>

                        <div className="max-h-[240px] overflow-y-auto border border-slate-100 rounded-xl divide-y divide-slate-50 bg-slate-50/30">
                            {datasets.length === 0 ? (
                                <div className="p-8 text-center">
                                    <HiDatabase className="w-8 h-8 text-slate-200 mx-auto mb-2" />
                                    <p className="text-sm text-slate-500">No datasets found. Create some datasets first.</p>
                                </div>
                            ) : (
                                datasets.map((ds) => (
                                    <div
                                        key={ds.id}
                                        onClick={() => toggleDataset(ds.id)}
                                        className={`
                                            flex items-center justify-between p-3 cursor-pointer transition-all
                                            ${selectedDatasets.includes(ds.id) ? 'bg-indigo-50/50' : 'hover:bg-white'}
                                        `}
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className={`
                                                w-8 h-8 rounded-lg flex items-center justify-center border transition-all
                                                ${selectedDatasets.includes(ds.id)
                                                    ? 'bg-indigo-600 border-indigo-600 text-white'
                                                    : 'bg-white border-slate-200 text-slate-400'}
                                            `}>
                                                {selectedDatasets.includes(ds.id) ? <HiCheck className="w-5 h-5" /> : <HiDatabase className="w-4 h-4" />}
                                            </div>
                                            <div>
                                                <p className={`text-sm font-semibold transition-colors ${selectedDatasets.includes(ds.id) ? 'text-indigo-700' : 'text-slate-700'}`}>
                                                    {ds.name}
                                                </p>
                                                <p className="text-[10px] text-slate-400 font-medium">Collection</p>
                                            </div>
                                        </div>
                                        <div className={`
                                            w-5 h-5 rounded-full border flex items-center justify-center transition-all
                                            ${selectedDatasets.includes(ds.id)
                                                ? 'bg-indigo-600 border-indigo-600 text-white'
                                                : 'bg-white border-slate-200'}
                                        `}>
                                            {selectedDatasets.includes(ds.id) && <HiCheck className="w-3 h-3" />}
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
                            disabled={isSubmitting || !name || selectedDatasets.length === 0}
                            className="flex-1 px-4 py-2.5 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-indigo-200 transition-all text-sm"
                        >
                            {isSubmitting ? "Creating..." : "Create Chatbot"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
