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
import UploadSourceFilesDrawer from "@/app/components/UploadSourceFilesDrawer";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { fetchDocuments, deleteDocument } from "@/lib/store/slices/documentsSlice";
import { fetchConnectors } from "@/lib/store/slices/connectorsSlice";
import { SiNotion } from "react-icons/si";
import showToast from "@/lib/toast";
import { User, Button, Input } from "@heroui/react";
import { PageHeader, EmptyState, StyledTable, DateCell, TableSkeleton, Tooltip, DeleteConfirmationDrawer } from "@/app/components/ui";
import type { TableColumnDef } from "@/app/components/ui";
import type { Document } from "@/lib/types";
import { theme } from "@/app/theme";

const COLUMNS: TableColumnDef[] = [
    { key: "name", label: "SOURCE FILE" },
    { key: "created_at", label: "UPLOAD DATE" },
    { key: "actions", label: "ACTIONS", align: "end" },
];

export default function DocumentsPage() {
    const [isUploadDrawerOpen, setIsUploadDrawerOpen] = useState(false);
    const [filterValue, setFilterValue] = useState("");
    const dispatch = useAppDispatch();
    const { items: documents, status } = useAppSelector((state) => state.documents);
    const { items: connectors, status: connStatus } = useAppSelector((state) => state.connectors);
    const isLoading = status === "loading";

    const [deleteDrawerOpen, setDeleteDrawerOpen] = useState(false);
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
        setDeleteDrawerOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (!itemToDelete) return;
        setIsDeleting(true);
        try {
            await dispatch(deleteDocument(itemToDelete.id)).unwrap();
            showToast.success(`Source file "${itemToDelete.name}" deleted successfully`);
            setDeleteDrawerOpen(false);
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
                            radius: "lg",
                            fallback: <Icon className={`w-4 h-4 ${connector ? 'text-slate-900' : 'text-indigo-600'}`} />,
                            className: `${connector ? 'bg-slate-50 border-slate-200' : 'bg-indigo-50 border-indigo-100'} rounded-lg`,
                            size: "sm",
                        }}
                        description={sourceLabel}
                        name={doc.name}
                        classNames={{
                            name: "font-medium text-sm text-slate-800",
                            description: "text-[10px] text-slate-400 font-bold uppercase tracking-wider",
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
                        <Tooltip content="Delete">
                            <Button
                                isIconOnly
                                size="sm"
                                variant="light"
                                onPress={() => handleDeleteClick(doc.id, doc.name)}
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
        <div className="flex justify-between gap-3 items-end mb-4">
            <Input
                isClearable
                className="w-full sm:max-w-[44%]"
                placeholder="Search by name..."
                startContent={<HiSearch className="text-slate-400 ml-1" />}
                value={filterValue}
                variant="bordered"
                onClear={() => setFilterValue("")}
                onValueChange={setFilterValue}
                classNames={{
                    inputWrapper: "rounded-lg border border-slate-100 h-11 px-4 hover:border-indigo-400 data-[focus=true]:border-indigo-500 shadow-none bg-white transition-all",
                    input: "font-medium text-sm text-slate-800 placeholder:text-slate-400 ml-2"
                }}
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
                                onPress={handleRefresh}
                                variant="bordered"
                                isLoading={isLoading}
                                startContent={<HiRefresh className={`w-4 h-4 text-slate-400 ${isLoading ? 'animate-spin' : ''}`} />}
                                className="bg-white border-slate-100 text-slate-700 text-xs sm:text-sm font-medium rounded-lg transition-all hover:bg-slate-50 h-11 px-6 shadow-sm mr-2"
                            >
                                Refresh
                            </Button>
                            <Button
                                onPress={() => setIsUploadDrawerOpen(true)}
                                startContent={<HiPlus className="w-4 h-4" />}
                                className="text-white text-xs sm:text-sm font-bold rounded-lg transition-all hover:-translate-y-0.5 shadow-lg shadow-indigo-500/20 h-11 px-6"
                                style={{ backgroundColor: theme.colors.primary.main }}
                            >
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
                    onAction={() => setIsUploadDrawerOpen(true)}
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
                isOpen={isUploadDrawerOpen}
                onClose={() => setIsUploadDrawerOpen(false)}
                onUploadSuccess={() => dispatch(fetchDocuments())}
            />

            <DeleteConfirmationDrawer
                isOpen={deleteDrawerOpen}
                onClose={() => setDeleteDrawerOpen(false)}
                onConfirm={handleConfirmDelete}
                isLoading={isDeleting}
                title="Delete Source File"
                description="Are you sure you want to delete this source file?"
                itemName={itemToDelete?.name}
            />
        </div>
    );
}
