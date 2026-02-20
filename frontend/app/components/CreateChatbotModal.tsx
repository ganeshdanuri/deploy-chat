"use client";

import { useState, useEffect } from "react";
import { HiDatabase, HiCheck, HiSparkles } from "react-icons/hi";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/lib/store/store";
import { fetchDatasets } from "@/lib/store/slices/datasetsSlice";
import { createChatbot } from "@/lib/store/slices/chatbotsSlice";
import Modal from "./Modal";
import showToast from "@/lib/toast";

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
            showToast.success(`Chatbot "${name}" created successfully!`);
            setName("");
            setSelectedDatasets([]);
            onClose();
        } catch (error: any) {
            showToast.error(error?.message || "Failed to create chatbot. Please try again.");
            console.error("Failed to create chatbot:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Deploy Assistant"
            subtitle="Build a new AI persona powered by your knowledge."
            icon={HiSparkles}
            iconBgColor="bg-indigo-50"
            iconColor="text-indigo-600"
        >
            <form onSubmit={handleSubmit} className="space-y-8">
                <div className="space-y-8">
                    {/* Chatbot Name */}
                    <div className="space-y-3">
                        <label htmlFor="name" className="block text-sm font-bold text-slate-800">
                            Assistant Name
                        </label>
                        <p className="text-xs text-slate-500 font-medium">Give your AI a name that reflects its purpose.</p>
                        <input
                            type="text"
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="e.g. Customer Support Bot"
                            className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-semibold text-sm"
                            required
                        />
                    </div>

                    {/* Dataset Selection */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <label className="block text-sm font-bold text-slate-800">
                                Attach Knowledge
                            </label>
                            <span className="text-[11px] font-bold text-slate-400 uppercase bg-slate-100 px-2 py-0.5 rounded-full">
                                {selectedDatasets.length} datasets
                            </span>
                        </div>

                        <div className="max-h-[300px] overflow-y-auto pr-2 custom-scrollbar space-y-3">
                            {datasets.length === 0 ? (
                                <div className="p-12 text-center bg-slate-50 rounded-[2rem] border border-dashed border-slate-200">
                                    <HiDatabase className="w-10 h-10 text-slate-200 mx-auto mb-3" />
                                    <p className="text-sm text-slate-500 font-medium leading-relaxed">No datasets available.<br />Create a dataset first.</p>
                                </div>
                            ) : (
                                datasets.map((ds) => (
                                    <div
                                        key={ds.id}
                                        onClick={() => toggleDataset(ds.id)}
                                        className={`
                                            group flex items-center justify-between p-4 cursor-pointer transition-all duration-300 rounded-2xl border
                                            ${selectedDatasets.includes(ds.id)
                                                ? 'bg-indigo-50/70 border-indigo-200 shadow-sm'
                                                : 'bg-white border-slate-100 hover:border-indigo-100 hover:bg-indigo-50/20'}
                                        `}
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className={`
                                                w-10 h-10 rounded-xl flex items-center justify-center border transition-all duration-500
                                                ${selectedDatasets.includes(ds.id)
                                                    ? 'bg-indigo-600 border-indigo-600 text-white shadow-md rotate-3'
                                                    : 'bg-slate-50 border-slate-200 text-slate-400 group-hover:rotate-2'}
                                            `}>
                                                {selectedDatasets.includes(ds.id) ? <HiCheck className="w-6 h-6" /> : <HiDatabase className="w-5 h-5" />}
                                            </div>
                                            <div>
                                                <p className={`text-sm font-bold transition-colors ${selectedDatasets.includes(ds.id) ? 'text-indigo-900' : 'text-slate-700'}`}>
                                                    {ds.name}
                                                </p>
                                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">Dataset Collection</p>
                                            </div>
                                        </div>
                                        <div className={`
                                            w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-500
                                            ${selectedDatasets.includes(ds.id)
                                                ? 'bg-indigo-600 border-indigo-600'
                                                : 'bg-white border-slate-200 group-hover:border-indigo-400'}
                                        `}>
                                            {selectedDatasets.includes(ds.id) && <HiCheck className="w-3.5 h-3.5 text-white" />}
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
                        disabled={isSubmitting || !name || selectedDatasets.length === 0}
                        className="flex-[1.5] px-6 py-3.5 bg-slate-900 text-white font-bold rounded-2xl hover:bg-indigo-600 disabled:opacity-30 disabled:cursor-not-allowed shadow-xl shadow-slate-200 hover:shadow-indigo-200 transition-all text-sm active:scale-95 flex items-center justify-center gap-2"
                    >
                        {isSubmitting ? (
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        ) : null}
                        <span>{isSubmitting ? "Creating..." : "Launch Assistant"}</span>
                    </button>
                </div>
            </form>
        </Modal>
    );
}
