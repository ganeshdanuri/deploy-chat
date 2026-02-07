"use client";

import { HiDatabase, HiPlus, HiSearch, HiRefresh, HiCheck, HiExclamation } from "react-icons/hi";

export default function DatasetsPage() {
    const datasets = [
        { id: "1", name: "Website Documentation", type: "Web Scrape", chunks: 1420, lastSynced: "2 hours ago", status: "synced" },
        { id: "2", name: "Product FAQs", type: "PDF Upload", chunks: 340, lastSynced: "1 day ago", status: "synced" },
        { id: "3", name: "Internal Wiki", type: "Notion Integration", chunks: 8500, lastSynced: "10 mins ago", status: "syncing" },
        { id: "4", name: "Q3 Sales Reports", type: "CSV Upload", chunks: 120, lastSynced: "Failed", status: "error" },
    ];

    return (
        <div className="space-y-6 animate-fade-in-up">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Datasets</h1>
                    <p className="text-sm text-slate-500 mt-1">Manage your knowledge sources and integrations.</p>
                </div>
                <div className="flex gap-2">
                    <button className="px-3 py-2 bg-white border border-slate-200 text-slate-700 text-sm font-semibold rounded-lg shadow-sm hover:bg-slate-50 transition-all flex items-center gap-2">
                        <HiRefresh className="w-4 h-4 text-slate-400" />
                        Sync All
                    </button>
                    <button className="px-4 py-2 bg-emerald-600 text-white text-sm font-semibold rounded-lg shadow-sm shadow-emerald-200 hover:bg-emerald-700 hover:shadow-md transition-all flex items-center gap-2">
                        <HiPlus className="w-4 h-4" />
                        New Dataset
                    </button>
                </div>
            </div>

            {/* Grid View */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {datasets.map((ds) => (
                    <div key={ds.id} className="group bg-white rounded-xl border border-slate-200 p-5 hover:border-emerald-500 hover:shadow-lg hover:shadow-emerald-500/10 transition-all cursor-pointer relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button className="p-1.5 text-slate-400 hover:text-red-500 rounded bg-white shadow-sm ring-1 ring-slate-100">
                                <span className="sr-only">Delete</span>
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                        </div>

                        <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center gap-3">
                                <div className={`
                                w-10 h-10 rounded-lg flex items-center justify-center shadow-sm
                                ${ds.status === 'error' ? 'bg-red-50 text-red-500' : 'bg-emerald-50 text-emerald-600'}
                            `}>
                                    <HiDatabase className="w-5 h-5" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-slate-900 leading-tight">{ds.name}</h3>
                                    <p className="text-xs text-slate-500 mt-0.5">{ds.type}</p>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <div className="flex items-center justify-between text-xs font-medium">
                                <span className="text-slate-500">Total Chunks</span>
                                <span className="text-slate-900 font-mono bg-slate-100 px-2 py-0.5 rounded-full">{ds.chunks.toLocaleString()}</span>
                            </div>
                            <div className="flex items-center justify-between text-xs font-medium">
                                <span className="text-slate-500">Status</span>
                                {ds.status === 'synced' && (
                                    <span className="flex items-center gap-1.5 text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                                        <HiCheck className="w-3.5 h-3.5" /> Synced
                                    </span>
                                )}
                                {ds.status === 'syncing' && (
                                    <span className="flex items-center gap-1.5 text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-100">
                                        <HiRefresh className="w-3.5 h-3.5 animate-spin" /> Syncing...
                                    </span>
                                )}
                                {ds.status === 'error' && (
                                    <span className="flex items-center gap-1.5 text-red-600 bg-red-50 px-2 py-0.5 rounded-full border border-red-100">
                                        <HiExclamation className="w-3.5 h-3.5" /> Failed
                                    </span>
                                )}
                            </div>
                        </div>
                        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                            <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Last Sync</span>
                            <span className="text-xs font-medium text-slate-600 font-mono">{ds.lastSynced}</span>
                        </div>
                    </div>
                ))}

                {/* Add New Card (Empty State) */}
                <button className="group relative bg-slate-50 rounded-xl border-2 border-dashed border-slate-300 p-5 hover:border-emerald-500 hover:bg-emerald-50/10 transition-all flex flex-col items-center justify-center min-h-[200px] text-center">
                    <div className="w-12 h-12 rounded-full bg-white border border-slate-200 flex items-center justify-center mb-3 group-hover:scale-110 group-hover:bg-emerald-500 group-hover:border-emerald-600 group-hover:text-white transition-all shadow-sm">
                        <HiPlus className="w-6 h-6 text-slate-400 group-hover:text-white" />
                    </div>
                    <h3 className="font-semibold text-slate-900 group-hover:text-emerald-700">Add New Dataset</h3>
                    <p className="text-xs text-slate-500 mt-1 max-w-[200px]">Connect a new data source to expand your AI's knowledge.</p>
                </button>
            </div>
        </div>
    );
}
