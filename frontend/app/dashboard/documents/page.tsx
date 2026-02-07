"use client";

import { useEffect } from "react";
import { HiDocumentText, HiPlus, HiSearch, HiExternalLink, HiTrash, HiUpload } from "react-icons/hi";
import UploadModal from "@/app/components/UploadModal";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/lib/store/store";
import { fetchDocuments } from "@/lib/store/slices/documentsSlice";
import { useState } from "react";

export default function DocumentsPage() {
    const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
    const dispatch = useDispatch<AppDispatch>();
    const { items: documents, status, error } = useSelector((state: RootState) => state.documents);
    const isLoading = status === 'loading';

    useEffect(() => {
        dispatch(fetchDocuments());
    }, [dispatch]);

    return (
        <div className="space-y-6 animate-fade-in-up">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Documents</h1>
                    <p className="text-sm text-slate-500 mt-1">View and manage chunked documents for RAG.</p>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={() => setIsUploadModalOpen(true)}
                        className="px-4 py-2 bg-indigo-600 text-white text-sm font-semibold rounded-lg shadow-sm shadow-indigo-200 hover:bg-indigo-700 hover:shadow-md transition-all flex items-center gap-2"
                    >
                        <HiPlus className="w-4 h-4" />
                        Upload Document
                    </button>
                </div>
            </div>

            {isLoading ? (
                <div className="flex items-center justify-center py-20">
                    <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                </div>
            ) : documents.length === 0 ? (
                /* Empty State */
                <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border-2 border-dashed border-slate-200">
                    <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 mb-4">
                        <HiUpload className="w-8 h-8" />
                    </div>
                    <h2 className="text-xl font-bold text-slate-900 mb-2">No documents yet</h2>
                    <p className="text-slate-500 max-w-sm text-center mb-8">
                        The first step is to upload some documents. We'll convert them to markdown automatically.
                    </p>
                    <button
                        onClick={() => setIsUploadModalOpen(true)}
                        className="px-6 py-3 bg-indigo-600 text-white text-sm font-bold rounded-xl shadow-lg shadow-indigo-200 hover:bg-indigo-700 hover:-translate-y-0.5 transition-all flex items-center gap-2"
                    >
                        <HiPlus className="w-5 h-5" />
                        Upload your first document
                    </button>
                </div>
            ) : (
                /* Documents List */
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
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm text-slate-600">
                            <thead className="bg-slate-50 border-b border-slate-200">
                                <tr>
                                    <th className="px-6 py-3 font-semibold text-xs text-slate-500 uppercase tracking-wider">Name</th>
                                    <th className="px-6 py-3 font-semibold text-xs text-slate-500 uppercase tracking-wider">Date</th>
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
                                        <td className="px-6 py-4 text-xs text-slate-500">
                                            {new Date(doc.created_at).toLocaleDateString()}
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

                    <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
                        <span className="text-xs text-slate-500">Showing <span className="font-medium text-slate-900">1-{documents.length}</span> of <span className="font-medium text-slate-900">{documents.length}</span> documents</span>
                    </div>
                </div>
            )}

            <UploadModal
                isOpen={isUploadModalOpen}
                onClose={() => setIsUploadModalOpen(false)}
                onUploadSuccess={() => dispatch(fetchDocuments())}
            />
        </div>
    );
}
