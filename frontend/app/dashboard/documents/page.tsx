"use client";

import { HiDocumentText, HiPlus, HiSearch, HiCheck, HiExternalLink, HiTrash } from "react-icons/hi";

export default function DocumentsPage() {
    const documents = [
        { id: "1", name: "Getting Started Guide.pdf", type: "PDF", size: "2.4 MB", chunks: 48, dataset: "Website Documentation", uploaded: "2024-01-15" },
        { id: "2", name: "API Reference.md", type: "Markdown", size: "890 KB", chunks: 156, dataset: "Website Documentation", uploaded: "2024-01-16" },
        { id: "3", name: "FAQ Collection", type: "Text", size: "340 KB", chunks: 34, dataset: "Product FAQs", uploaded: "2024-01-18" },
        { id: "4", name: "Product Catalog", type: "CSV", size: "1.2 MB", chunks: 87, dataset: "Knowledge Base", uploaded: "2024-01-20" },
    ];

    return (
        <div className="space-y-6 animate-fade-in-up">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Documents</h1>
                    <p className="text-sm text-slate-500 mt-1">View and manage chunked documents for RAG.</p>
                </div>
                <div className="flex gap-2">
                    <button className="px-4 py-2 bg-indigo-600 text-white text-sm font-semibold rounded-lg shadow-sm shadow-indigo-200 hover:bg-indigo-700 hover:shadow-md transition-all flex items-center gap-2">
                        <HiPlus className="w-4 h-4" />
                        Upload Document
                    </button>
                </div>
            </div>

            {/* Documents List */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
                {/* Toolbar */}
                <div className="px-6 py-4 border-b border-slate-200 flex justify-between items-center bg-slate-50/50">
                    <div className="relative flex-1 max-w-sm">
                        <HiSearch className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search documents..."
                            className="pl-9 pr-4 py-1.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 bg-white w-full"
                        />
                    </div>

                    <div className="flex gap-2">
                        <button className="text-xs font-medium text-slate-500 hover:text-indigo-600 px-2 py-1 bg-white border border-slate-200 rounded shadow-sm">
                            Columns
                        </button>
                        <button className="text-xs font-medium text-slate-500 hover:text-indigo-600 px-2 py-1 bg-white border border-slate-200 rounded shadow-sm">
                            Filter
                        </button>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-slate-600">
                        <thead className="bg-slate-50 border-b border-slate-200">
                            <tr>
                                <th className="px-6 py-3 font-semibold text-xs text-slate-500 uppercase tracking-wider">Name</th>
                                <th className="px-6 py-3 font-semibold text-xs text-slate-500 uppercase tracking-wider">Metadata</th>
                                <th className="px-6 py-3 font-semibold text-xs text-slate-500 uppercase tracking-wider">Dataset</th>
                                <th className="px-6 py-3 font-semibold text-xs text-slate-500 uppercase tracking-wider">Stats</th>
                                <th className="px-6 py-3 text-right font-semibold text-xs text-slate-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200">
                            {documents.map((doc) => (
                                <tr key={doc.id} className="group hover:bg-slate-50 transition-colors cursor-pointer">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600 border border-indigo-100">
                                                <HiDocumentText className="w-4 h-4" />
                                            </div>
                                            <span className="font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors">{doc.name}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <span className="px-2 py-0.5 bg-slate-100 rounded text-[10px] font-bold text-slate-500 border border-slate-200 uppercase tracking-wide">{doc.type}</span>
                                            <span className="text-xs text-slate-500">{doc.size}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-1.5 text-slate-600 font-medium">
                                            <span className="w-1.5 h-1.5 rounded-full bg-slate-300"></span>
                                            <span>{doc.dataset}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-1.5 text-emerald-600 bg-emerald-50 px-2 py-1 rounded w-fit text-xs font-semibold">
                                            <HiCheck className="w-3.5 h-3.5" />
                                            <span>{doc.chunks} chunks</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button className="p-1.5 hover:bg-white hover:shadow-sm rounded text-slate-400 hover:text-indigo-600 border border-transparent hover:border-slate-200 transition-all" title="View">
                                                <HiExternalLink className="w-4 h-4" />
                                            </button>
                                            <button className="p-1.5 hover:bg-white hover:shadow-sm rounded text-slate-400 hover:text-red-600 border border-transparent hover:border-slate-200 transition-all" title="Delete">
                                                <HiTrash className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Footer Pagination (Visual only) */}
                <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
                    <span className="text-xs text-slate-500">Showing <span className="font-medium text-slate-900">1-4</span> of <span className="font-medium text-slate-900">4</span> documents</span>
                </div>
            </div>
        </div>
    );
}
