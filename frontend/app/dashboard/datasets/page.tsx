/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { HiDatabase, HiPlus, HiRefresh, HiCollection, HiTrash, HiSearch, HiPencil } from "react-icons/hi";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { fetchDatasets, deleteDataset } from "@/lib/store/slices/datasetsSlice";
import CreateKnowledgeBaseDrawer from "../../components/CreateKnowledgeBaseDrawer";
import showToast from "@/lib/toast";
import { Button } from "@/components/ui/button";
import { PageHeader, EmptyState, StyledTable, DateCell, StatusChip, TableSkeleton, DeleteConfirmationModal, User, Input, Tooltip } from "@/app/components/ui";
import type { TableColumnDef } from "@/app/components/ui";
import type { Dataset } from "@/lib/types";

const COLUMNS: TableColumnDef[] = [
    { key: "name", label: "NAME" },
    { key: "status", label: "STATUS" },
    { key: "created_at", label: "CREATED AT" },
    { key: "actions", label: "ACTIONS", align: "end" },
];

export default function DatasetsPage() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [filterValue, setFilterValue] = useState("");
    const [editDataset, setEditDataset] = useState<Dataset | null>(null);
    const dispatch = useAppDispatch();
    const { items: datasets, status } = useAppSelector((state) => state.datasets);
    const isLoading = status === "loading";

    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [itemToDelete, setItemToDelete] = useState<{ id: string; name: string } | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        dispatch(fetchDatasets());
    }, [dispatch]);

    const handleDeleteClick = (id: string, name: string) => {
        setItemToDelete({ id, name });
        setDeleteModalOpen(true);
    };

    const handleEditClick = (ds: Dataset) => {
        setEditDataset(ds);
        setIsModalOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (!itemToDelete) return;
        setIsDeleting(true);
        try {
            await dispatch(deleteDataset(itemToDelete.id)).unwrap();
            showToast.success(`Knowledge base "${itemToDelete.name}" deleted successfully`);
            setDeleteModalOpen(false);
        } catch (error: any) {
            showToast.error(error?.message || "Failed to delete dataset");
        } finally {
            setIsDeleting(false);
            setItemToDelete(null);
        }
    };

    const renderCell = (ds: Dataset, columnKey: React.Key) => {
        switch (columnKey) {
            case "name":
                return (
                    <User
                        avatarProps={{
                            fallback: <HiDatabase className="w-4 h-4 text-primary" />,
                            className: "bg-primary/5 border border-primary/10",
                        }}
                        description="Collection"
                        name={ds.name}
                        classNames={{
                            name: "font-medium text-sm text-secondary",
                            description: "text-xs text-muted-foreground",
                        }}
                    />
                );
            case "status":
                return <StatusChip />;
            case "created_at":
                return <DateCell isoString={ds.created_at} />;
            case "actions":
                return (
                    <div className="relative flex items-center justify-end gap-2">
                        <Tooltip content="Edit Knowledge">
                            <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleEditClick(ds)}
                                className="text-muted-foreground hover:text-primary px-0 h-8 w-8"
                            >
                                <HiPencil className="w-3.5 h-3.5" />
                            </Button>
                        </Tooltip>
                        <Tooltip content="Delete">
                            <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleDeleteClick(ds.id, ds.name)}
                                className="text-muted-foreground hover:text-red-500 px-0 h-8 w-8"
                            >
                                <HiTrash className="w-3.5 h-3.5" />
                            </Button>
                        </Tooltip>
                    </div>
                );
            default:
                return String((ds as any)[columnKey as string] ?? "");
        }
    };

    return (
        <div className="space-y-6 animate-fade-in-up">
            <PageHeader
                title="Knowledge Base"
                description="Manage your knowledge sources and integrations."
                actions={
                    datasets.length > 0 ? (
                        <>
                            <Button
                                onClick={() => dispatch(fetchDatasets())}
                                variant="outline-secondary"
                                className="text-xs sm:text-sm h-11 px-6 mr-2"
                                disabled={isLoading}
                            >
                                <HiRefresh className={`w-4 h-4 mr-2 text-muted-foreground ${isLoading ? 'animate-spin' : ''}`} />
                                Refresh
                            </Button>
                            <Button
                                variant="primary"
                                onClick={() => {
                                    setEditDataset(null);
                                    setIsModalOpen(true);
                                }}
                                className="text-xs sm:text-sm h-11 px-6"
                            >
                                <HiPlus className="w-4 h-4 mr-2" />
                                New Knowledge Base
                            </Button>
                        </>
                    ) : null
                }
            />

            {isLoading && datasets.length === 0 ? (
                <TableSkeleton rows={5} columns={4} />
            ) : datasets.length === 0 ? (
                <EmptyState
                    icon={HiCollection}
                    title="No knowledge bases found"
                    description="Knowledge bases group your source files together so you can easily assign them to different AI assistants."
                    actionLabel="Create your first knowledge base"
                    onAction={() => {
                        setEditDataset(null);
                        setIsModalOpen(true);
                    }}
                    accentColor="emerald"
                />
            ) : (
                <div className="space-y-6">
                    <StyledTable
                        aria-label="Datasets list"
                        columns={COLUMNS}
                        items={datasets.filter(ds => ds.name.toLowerCase().includes(filterValue.toLowerCase()))}
                        renderCell={renderCell}
                        topContent={
                            <div className="flex items-center w-full">
                                <Input
                                    isClearable
                                    className="w-full sm:max-w-xs"
                                    placeholder="Search knowledge..."
                                    startContent={<HiSearch className="w-4 h-4 text-muted-foreground" />}
                                    value={filterValue}
                                    onClear={() => setFilterValue("")}
                                    onValueChange={setFilterValue}
                                />
                            </div>
                        }
                    />

                    <div
                        onClick={() => {
                            setEditDataset(null);
                            setIsModalOpen(true);
                        }}
                        className="w-full bg-muted border border-dashed border-border hover:border-primary/50 hover:bg-primary/5 transition-all cursor-pointer dash-card rounded-2xl"
                    >
                        <div className="py-8 flex flex-col items-center justify-center">
                            <div className="w-12 h-12 bg-white border border-border flex items-center justify-center mb-3 shadow-sm rounded-xl">
                                <HiPlus className="w-6 h-6 text-muted-foreground" />
                            </div>
                            <h3 className="text-sm font-bold text-secondary">Add New Knowledge</h3>
                            <p className="text-[11px] text-muted-foreground mt-1">Connect more data sources</p>
                        </div>
                    </div>
                </div>
            )}

            <CreateKnowledgeBaseDrawer
                isOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false);
                    setEditDataset(null);
                }}
                editDataset={editDataset}
            />

            <DeleteConfirmationModal
                isOpen={deleteModalOpen}
                onClose={() => setDeleteModalOpen(false)}
                onConfirm={handleConfirmDelete}
                isLoading={isDeleting}
                title="Delete Knowledge Base"
                description="Are you sure you want to delete this knowledge base? All underlying source files will remain, but the collection grouping will be removed."
                itemName={itemToDelete?.name}
            />
        </div>
    );
}
