/* eslint-disable @typescript-eslint/no-explicit-any */
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
import UploadSourceFilesDrawer from "../../components/UploadSourceFilesDrawer";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { fetchDocuments, deleteDocument } from "@/lib/store/slices/documentsSlice";
import { fetchConnectors } from "@/lib/store/slices/connectorsSlice";
import { SiNotion } from "react-icons/si";
import showToast from "@/lib/toast";
import { Button } from "@/components/ui/button";
import { PageHeader, EmptyState, StyledTable, DateCell, TableSkeleton, Tooltip, DeleteConfirmationModal, User, Input } from "@/app/components/ui";
import type { TableColumnDef } from "@/app/components/ui";
import type { Document } from "@/lib/types";
import { theme } from "@/app/theme";

const COLUMNS: TableColumnDef[] = [
    { key: "name", label: "SOURCE FILE" },
    { key: "created_at", label: "UPLOAD DATE" },
    { key: "actions", label: "ACTIONS", align: "end" },
];

export default function DocumentsPage() {
    const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
    const [filterValue, setFilterValue] = useState("");
    const dispatch = useAppDispatch();
    const { items: documents, status } = useAppSelector((state) => state.documents);
    const { items: connectors, status: connStatus } = useAppSelector((state) => state.connectors);
    const isLoading = status === "loading";

    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [itemToDelete, setItemToDelete] = useState<{ id: string; name: string } | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        dispatch(fetchDocuments());
        if (connStatus === 'idle') dispatch(fetchConnectors());
    }, [dispatch, connStatus]);

    const handleRefresh = async () => {
        try {
            await dispatch(fetchDocuments()).unwrap();
            showToast.success("Source files refreshed");
        } catch {
            showToast.error("Failed to refresh source files");
        }
    };

    const handleDeleteClick = (id: string, name: string) => {
        setItemToDelete({ id, name });
        setDeleteModalOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (!itemToDelete) return;
        setIsDeleting(true);
        try {
            await dispatch(deleteDocument(itemToDelete.id)).unwrap();
            showToast.success(`Source file "${itemToDelete.name}" deleted successfully`);
            setDeleteModalOpen(false);
        } catch (error: any) {
            showToast.error(error?.message || "Failed to delete document");
        } finally {
            setIsDeleting(false);
            setItemToDelete(null);
        }
    };

    const filteredItems = documents.filter((doc: Document) =>
        doc.name.toLowerCase().includes(filterValue.toLowerCase())
    );

    const renderCell = (doc: Document, columnKey: React.Key) => {
        const connector = doc.connector_id ? connectors.find(c => c.id === doc.connector_id) : null;

        switch (columnKey) {
            case "name":
                const Icon = connector?.type === 'notion' ? SiNotion : HiDocumentText;
                const sourceLabel = connector ? `${connector.type}: ${connector.name}` : "Manual Upload";

                return (
                    <User
                        avatarProps={{
                            fallback: <Icon className={`w-4 h-4 ${connector ? 'text-[#201f32]' : 'text-[#262ef2]'}`} />,
                            className: `${connector ? 'bg-[#f3f3f9] border-[#e3e3e3]' : 'bg-[#262ef2]/5 border-[#262ef2]/10'} rounded-lg`,
                        }}
                        description={sourceLabel}
                        name={doc.name}
                        classNames={{
                            name: "font-medium text-sm text-[#201f32]",
                            description: "text-[10px] text-[#a1a1a1] font-bold uppercase tracking-wider",
                        }}
                    />
                );
            case "created_at":
                return <DateCell isoString={doc.created_at} />;
            case "actions":
                return (
                    <div className="relative flex items-center justify-end gap-2">
                        <Tooltip content="View Content">
                            <Button size="sm" variant="ghost" className="text-[#a1a1a1] hover:text-[#262ef2] px-0 h-8 w-8">
                                <HiExternalLink className="w-3.5 h-3.5" />
                            </Button>
                        </Tooltip>
                        <Tooltip content="Delete">
                            <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleDeleteClick(doc.id, doc.name)}
                                className="text-[#a1a1a1] hover:text-red-500 px-0 h-8 w-8"
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
        <div className="flex items-center w-full">
            <Input
                isClearable
                className="w-full sm:max-w-xs"
                placeholder="Search documents..."
                startContent={<HiSearch className="w-4 h-4 text-[#a1a1a1]" />}
                value={filterValue}
                onClear={() => setFilterValue("")}
                onValueChange={setFilterValue}
            />
        </div>
    );

    return (
        <div className="space-y-6 animate-fade-in-up">
            <PageHeader
                title="Source Files"
                description="View and manage knowledge sources for your AI."
                actions={
                    documents.length > 0 ? (
                        <>
                            <Button
                                onClick={handleRefresh}
                                variant="outline"
                                className="bg-white border-[#e3e3e3] text-[#4d5564] text-xs sm:text-sm font-medium rounded-lg transition-all hover:bg-[#f3f3f9] h-11 px-6 shadow-sm mr-2"
                                disabled={isLoading}
                            >
                                <HiRefresh className={`w-4 h-4 mr-2 text-[#a1a1a1] ${isLoading ? 'animate-spin' : ''}`} />
                                Refresh
                            </Button>
                            <Button
                                onClick={() => setIsUploadModalOpen(true)}
                                className="text-white text-xs sm:text-sm font-bold rounded-lg transition-all hover:-translate-y-0.5 shadow-lg shadow-[#262ef2]/20 h-11 px-6"
                                style={{ backgroundColor: "#262ef2" }}
                            >
                                <HiPlus className="w-4 h-4 mr-2" />
                                Upload File
                            </Button>
                        </>
                    ) : null
                }
            />

            {isLoading && documents.length === 0 ? (
                <TableSkeleton rows={5} columns={3} />
            ) : documents.length === 0 ? (
                <EmptyState
                    icon={HiUpload}
                    title="No source files yet"
                    description="The first step is to upload some files. We'll convert them to markdown automatically or sync from cloud sources."
                    actionLabel="Upload your first file"
                    onAction={() => setIsUploadModalOpen(true)}
                    accentColor="indigo"
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

            <UploadSourceFilesDrawer
                isOpen={isUploadModalOpen}
                onClose={() => setIsUploadModalOpen(false)}
                onUploadSuccess={() => dispatch(fetchDocuments())}
            />

            <DeleteConfirmationModal
                isOpen={deleteModalOpen}
                onClose={() => setDeleteModalOpen(false)}
                onConfirm={handleConfirmDelete}
                isLoading={isDeleting}
                title="Delete Source File"
                description="Are you sure you want to delete this source file?"
                itemName={itemToDelete?.name}
            />
        </div>
    );
}
