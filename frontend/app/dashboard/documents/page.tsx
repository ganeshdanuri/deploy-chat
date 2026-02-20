"use client";

import { useEffect, useState } from "react";
import { HiDocumentText, HiPlus, HiExternalLink, HiTrash, HiUpload, HiRefresh, HiSearch } from "react-icons/hi";
import UploadModal from "@/app/components/UploadModal";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/lib/store/store";
import { fetchDocuments, deleteDocument } from "@/lib/store/slices/documentsSlice";
import showToast from "@/lib/toast";
import {
    Table,
    TableHeader,
    TableColumn,
    TableBody,
    TableRow,
    TableCell,
    User,
    Tooltip,
    Button,
    Spinner,
    Input
} from "@heroui/react";

export default function DocumentsPage() {
    const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
    const [filterValue, setFilterValue] = useState("");
    const dispatch = useDispatch<AppDispatch>();
    const { items: documents, status } = useSelector((state: RootState) => state.documents);
    const isLoading = status === 'loading';

    useEffect(() => {
        dispatch(fetchDocuments());
    }, [dispatch]);

    const handleRefresh = async () => {
        try {
            await dispatch(fetchDocuments()).unwrap();
            showToast.success("Documents list refreshed");
        } catch (error) {
            showToast.error("Failed to refresh documents");
        }
    };

    const handleDelete = async (id: string, name: string) => {
        if (confirm(`Are you sure you want to delete "${name}"?`)) {
            try {
                await dispatch(deleteDocument(id)).unwrap();
                showToast.success(`Document "${name}" deleted successfully`);
            } catch (error: any) {
                showToast.error(error?.message || "Failed to delete document");
            }
        }
    };

    const filteredItems = documents.filter((doc) =>
        doc.name.toLowerCase().includes(filterValue.toLowerCase())
    );

    const renderCell = (doc: any, columnKey: React.Key) => {
        switch (columnKey) {
            case "name":
                return (
                    <User
                        avatarProps={{
                            radius: "lg",
                            fallback: <HiDocumentText className="w-4 h-4 text-indigo-600" />,
                            className: "bg-indigo-50 border border-indigo-100",
                            size: "sm"
                        }}
                        description={`ID: ${doc.id.slice(0, 8)}`}
                        name={doc.name}
                        classNames={{
                            name: "font-medium text-sm text-slate-800",
                            description: "text-xs text-slate-400 font-mono"
                        }}
                    >
                        {doc.name}
                    </User>
                );
            case "created_at":
                return (
                    <div className="flex flex-col">
                        <p className="text-xs text-slate-600">{new Date(doc.created_at).toLocaleDateString()}</p>
                        <p className="text-xs text-slate-400 font-mono">
                            {new Date(doc.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                    </div>
                );
            case "actions":
                return (
                    <div className="relative flex items-center justify-end gap-2">
                        <Tooltip content="View Content">
                            <Button isIconOnly size="sm" variant="light" className="text-slate-400 hover:text-indigo-600">
                                <HiExternalLink className="w-3.5 h-3.5" />
                            </Button>
                        </Tooltip>
                        <Tooltip color="danger" content="Delete">
                            <Button
                                isIconOnly
                                size="sm"
                                variant="light"
                                onPress={() => handleDelete(doc.id, doc.name)}
                                className="text-slate-400 hover:text-red-500"
                            >
                                <HiTrash className="w-3.5 h-3.5" />
                            </Button>
                        </Tooltip>
                    </div>
                );
            default:
                return (doc as any)[columnKey as any];
        }
    };

    return (
        <div className="space-y-6 animate-fade-in-up">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Documents</h1>
                    <p className="text-sm text-slate-500 mt-1">View and manage chunked documents for RAG.</p>
                </div>
                <div className="flex gap-2">
                    <Button
                        onPress={handleRefresh}
                        variant="bordered"
                        startContent={<HiRefresh className="w-4 h-4 text-slate-400" />}
                        className="bg-white border-slate-200 text-slate-700 font-semibold rounded-lg"
                    >
                        Refresh
                    </Button>
                    <Button
                        onPress={() => setIsUploadModalOpen(true)}
                        color="primary"
                        startContent={<HiPlus className="w-4 h-4" />}
                        className="bg-indigo-600 text-white font-semibold rounded-lg shadow-indigo-200"
                    >
                        Upload Document
                    </Button>
                </div>
            </div>

            {isLoading && documents.length === 0 ? (
                <div className="flex items-center justify-center py-20">
                    <Spinner color="primary" size="lg" />
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
                    <Button
                        onPress={() => setIsUploadModalOpen(true)}
                        color="primary"
                        startContent={<HiPlus className="w-5 h-5" />}
                        className="bg-indigo-600 px-6 h-12 text-white font-bold rounded-xl shadow-lg shadow-indigo-200"
                    >
                        Upload your first document
                    </Button>
                </div>
            ) : (
                <Table
                    aria-label="Documents management"
                    topContent={
                        <div className="flex justify-between gap-3 items-end mb-2">
                            <Input
                                isClearable
                                className="w-full sm:max-w-[44%]"
                                placeholder="Search by name..."
                                startContent={<HiSearch className="text-slate-400" />}
                                value={filterValue}
                                variant="bordered"
                                onClear={() => setFilterValue("")}
                                onValueChange={setFilterValue}
                                classNames={{
                                    inputWrapper: "rounded-xl border-slate-200 bg-white"
                                }}
                            />
                        </div>
                    }
                    classNames={{
                        base: "bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden",
                        thead: "bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold",
                        wrapper: "shadow-none p-0",
                        th: "bg-slate-50/50 text-slate-500"
                    }}
                >
                    <TableHeader>
                        <TableColumn key="name">DOCUMENT</TableColumn>
                        <TableColumn key="created_at">UPLOAD DATE</TableColumn>
                        <TableColumn key="actions" align="end">ACTIONS</TableColumn>
                    </TableHeader>
                    <TableBody items={filteredItems} emptyContent="No documents found matching your search.">
                        {(item) => (
                            <TableRow key={item.id} className="cursor-pointer hover:bg-slate-50/80 transition-colors">
                                {(columnKey) => <TableCell>{renderCell(item, columnKey)}</TableCell>}
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            )}

            <UploadModal
                isOpen={isUploadModalOpen}
                onClose={() => setIsUploadModalOpen(false)}
                onUploadSuccess={() => dispatch(fetchDocuments())}
            />
        </div>
    );
}
