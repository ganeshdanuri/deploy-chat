"use client";

import { useState, useEffect } from "react";
import { HiDatabase, HiPlus, HiRefresh, HiCheck, HiExclamation, HiCollection, HiTrash } from "react-icons/hi";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/lib/store/store";
import { fetchDatasets, deleteDataset } from "@/lib/store/slices/datasetsSlice";
import CreateDatasetModal from "@/app/components/CreateDatasetModal";

export default function DatasetsPage() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const dispatch = useDispatch<AppDispatch>();
    const { items: datasets, status, error } = useSelector((state: RootState) => state.datasets);
    const isLoading = status === 'loading';

    useEffect(() => {
        dispatch(fetchDatasets());
    }, [dispatch]);

    const handleDelete = async (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        if (confirm("Are you sure you want to delete this dataset?")) {
            await dispatch(deleteDataset(id));
        }
    };

    return (
        <div className="space-y-6 animate-fade-in-up">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Datasets</h1>
                    <p className="text-sm text-slate-500 mt-1">Manage your knowledge sources and integrations.</p>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={() => dispatch(fetchDatasets())}
                        className="px-3 py-2 bg-white border border-slate-200 text-slate-700 text-sm font-semibold rounded-lg shadow-sm hover:bg-slate-50 transition-all flex items-center gap-2"
                    >
                        <HiRefresh className="w-4 h-4 text-slate-400" />
                        Refresh
                    </button>
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="px-4 py-2 bg-emerald-600 text-white text-sm font-semibold rounded-lg shadow-sm shadow-emerald-200 hover:bg-emerald-700 hover:shadow-md transition-all flex items-center gap-2"
                    >
                        <HiPlus className="w-4 h-4" />
                        New Dataset
                    </button>
                </div>
            </div>

            {isLoading && datasets.length === 0 ? (
                <div className="flex items-center justify-center py-20">
                    <div className="w-10 h-10 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
                </div>
            ) : datasets.length === 0 ? (
                /* Empty State */
                <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border-2 border-dashed border-slate-200">
                    <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 mb-4">
                        <HiCollection className="w-8 h-8" />
                    </div>
                    <h2 className="text-xl font-bold text-slate-900 mb-2">No datasets found</h2>
                    <p className="text-slate-500 max-w-sm text-center mb-8">
                        Datasets group your documents together so you can easily assign them to different chatbots.
                    </p>
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="px-6 py-3 bg-emerald-600 text-white text-sm font-bold rounded-xl shadow-lg shadow-emerald-200 hover:bg-emerald-700 hover:-translate-y-0.5 transition-all flex items-center gap-2"
                    >
                        <HiPlus className="w-5 h-5" />
                        Create your first dataset
                    </button>
                </div>
            ) : (
                /* Grid View */
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {datasets.map((ds) => (
                        <div key={ds.id} className="group bg-white rounded-xl border border-slate-200 p-5 hover:border-emerald-500 hover:shadow-lg hover:shadow-emerald-500/10 transition-all cursor-pointer relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button
                                    onClick={(e) => handleDelete(ds.id, e)}
                                    className="p-1.5 text-slate-400 hover:text-red-500 rounded bg-white shadow-sm ring-1 ring-slate-100"
                                >
                                    <span className="sr-only">Delete</span>
                                    <HiTrash className="w-4 h-4" />
                                </button>
                            </div>

                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-lg flex items-center justify-center shadow-sm bg-emerald-50 text-emerald-600">
                                        <HiDatabase className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-slate-900 leading-tight">{ds.name}</h3>
                                        <p className="text-xs text-slate-500 mt-0.5">Collection</p>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <div className="flex items-center justify-between text-xs font-medium">
                                    <span className="text-slate-500">Status</span>
                                    <span className="flex items-center gap-1.5 text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                                        <HiCheck className="w-3.5 h-3.5" /> Active
                                    </span>
                                </div>
                            </div>
                            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                                <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Created At</span>
                                <span className="text-xs font-medium text-slate-600 font-mono">{new Date(ds.created_at).toLocaleDateString()}</span>
                            </div>
                        </div>
                    ))}

                    {/* Add New Card (Floating) */}
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="group relative bg-slate-50 rounded-xl border-2 border-dashed border-slate-300 p-5 hover:border-emerald-500 hover:bg-emerald-50/10 transition-all flex flex-col items-center justify-center min-h-[160px] text-center"
                    >
                        <div className="w-12 h-12 rounded-full bg-white border border-slate-200 flex items-center justify-center mb-3 group-hover:scale-110 group-hover:bg-emerald-500 group-hover:border-emerald-600 group-hover:text-white transition-all shadow-sm">
                            <HiPlus className="w-6 h-6 text-slate-400 group-hover:text-white" />
                        </div>
                        <h3 className="font-semibold text-slate-900 group-hover:text-emerald-700">Add New Dataset</h3>
                        <p className="text-xs text-slate-500 mt-1 max-w-[200px]">Connect a new data source to expand your AI's knowledge.</p>
                    </button>
                </div>
            )}

            <CreateDatasetModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            />
        </div>
    );
}
