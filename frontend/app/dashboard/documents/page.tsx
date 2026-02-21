"use client";

import { useEffect, useState } from "react";
import {
    HiDocumentText,
    HiPlus,
    HiExternalLink,
    HiTrash,
    HiUpload,
    HiRefresh,
    HiSearch,
} from "react-icons/hi";
import UploadModal from "@/app/components/UploadModal";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { fetchDocuments, deleteDocument } from "@/lib/store/slices/documentsSlice";
import showToast from "@/lib/toast";
import { User, Tooltip, Button, Input } from "@heroui/react";
import { PageHeader, EmptyState, StyledTable, DateCell, TableSkeleton } from "@/app/components/ui";
import type { TableColumnDef } from "@/app/components/ui";
import type { Document } from "@/lib/types";

const COLUMNS: TableColumnDef[] = [
    { key: "name", label: "DOCUMENT" },
    { key: "created_at", label: "UPLOAD DATE" },
    { key: "actions", label: "ACTIONS", align: "end" },
];

export default function DocumentsPage() {
    const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
    const [filterValue, setFilterValue] = useState("");
    const dispatch = useAppDispatch();
    const { items: documents, status } = useAppSelector((state) => state.documents);
    const isLoading = status === "loading";

    useEffect(() => {
        dispatch(fetchDocuments());
    }, [dispatch]);

    const handleRefresh = async () => {
        try {
            await dispatch(fetchDocuments()).unwrap();
            showToast.success("Documents list refreshed");
        } catch {
            showToast.error("Failed to refresh documents");
        }
    };

    const handleDelete = async (id: string, name: string) => {
        if (!confirm(`Are you sure you want to delete "${name}"?`)) return;
        try {
            await dispatch(deleteDocument(id)).unwrap();
            showToast.success(`Document "${name}" deleted successfully`);
        } catch (error: any) {
            showToast.error(error?.message || "Failed to delete document");
        }
    };

    const filteredItems = documents.filter((doc) =>
        doc.name.toLowerCase().includes(filterValue.toLowerCase())
    );

    const renderCell = (doc: Document, columnKey: React.Key) => {
        switch (columnKey) {
            case "name":
                return (
                    <User
                        avatarProps={{
                            radius: "lg",
                            fallback: <HiDocumentText className="w-4 h-4 text-indigo-600" />,
                            className: "bg-indigo-50 border border-indigo-100",
                            size: "sm",
                        }}
                        description={`ID: ${doc.id.slice(0, 8)}`}
                        name={doc.name}
                        classNames={{
                            name: "font-medium text-sm text-slate-800",
                            description: "text-xs text-slate-400 font-mono",
                        }}
                    />
                );
            case "created_at":
                return <DateCell isoString={doc.created_at} />;
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
                return String((doc as any)[columnKey as string] ?? "");
        }
    };

    const tableTopContent = (
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
                classNames={{ inputWrapper: "rounded-xl border-slate-200 bg-white" }}
            />
        </div>
    );

    return (
        <div className="space-y-6 animate-fade-in-up">
            <PageHeader
                title="Documents"
                description="View and manage chunked documents for RAG."
                actions={
                    <>
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
                    </>
                }
            />

            {isLoading && documents.length === 0 ? (
                <TableSkeleton rows={5} columns={3} />
            ) : documents.length === 0 ? (
                <EmptyState
                    icon={HiUpload}
                    title="No documents yet"
                    description="The first step is to upload some documents. We'll convert them to markdown automatically."
                    actionLabel="Upload your first document"
                    onAction={() => setIsUploadModalOpen(true)}
                    accentColor="slate"
                />
            ) : (
                <StyledTable
                    aria-label="Documents management"
                    columns={COLUMNS}
                    items={filteredItems}
                    renderCell={renderCell}
                    topContent={tableTopContent}
                    emptyContent="No documents found matching your search."
                />
            )}

            <UploadModal
                isOpen={isUploadModalOpen}
                onClose={() => setIsUploadModalOpen(false)}
                onUploadSuccess={() => dispatch(fetchDocuments())}
            />
        </div>
    );
}
