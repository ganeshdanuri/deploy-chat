/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { HiDatabase, HiPlus, HiRefresh, HiCollection, HiTrash } from "react-icons/hi";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { fetchDatasets, deleteDataset } from "@/lib/store/slices/datasetsSlice";
import CreateDatasetModal from "@/app/components/CreateDatasetModal";
import showToast from "@/lib/toast";
import { User, Tooltip, Button, Card, CardBody } from "@heroui/react";
import { PageHeader, EmptyState, StyledTable, DateCell, StatusChip, TableSkeleton } from "@/app/components/ui";
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
    const dispatch = useAppDispatch();
    const { items: datasets, status } = useAppSelector((state) => state.datasets);
    const isLoading = status === "loading";

    useEffect(() => {
        dispatch(fetchDatasets());
    }, [dispatch]);

    const handleDelete = async (id: string, name: string) => {
        if (!confirm("Are you sure you want to delete this dataset?")) return;
        try {
            await dispatch(deleteDataset(id)).unwrap();
            showToast.success(`Dataset "${name}" deleted successfully`);
        } catch (error: any) {
            showToast.error(error?.message || "Failed to delete dataset");
        }
    };

    const renderCell = (ds: Dataset, columnKey: React.Key) => {
        switch (columnKey) {
            case "name":
                return (
                    <User
                        avatarProps={{
                            radius: "lg",
                            fallback: <HiDatabase className="w-4 h-4 text-emerald-600" />,
                            className: "bg-emerald-50 border border-emerald-100",
                            size: "sm",
                        }}
                        description="Collection"
                        name={ds.name}
                        classNames={{
                            name: "font-medium text-sm text-slate-800",
                            description: "text-xs text-slate-400",
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
                            <Button isIconOnly size="sm" variant="light" className="text-slate-400 hover:text-emerald-600">
                                <HiCollection className="w-3.5 h-3.5" />
                            </Button>
                        </Tooltip>
                        <Tooltip color="danger" content="Delete">
                            <Button
                                isIconOnly
                                size="sm"
                                variant="light"
                                onPress={() => handleDelete(ds.id, ds.name)}
                                className="text-slate-400 hover:text-red-500"
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
                title="Datasets"
                description="Manage your knowledge sources and integrations."
                actions={
                    (datasets.length > 0 || isLoading) ? (
                        <>
                            <Button
                                onPress={() => dispatch(fetchDatasets())}
                                variant="bordered"
                                startContent={<HiRefresh className="w-4 h-4 text-slate-400" />}
                                className="bg-white border-slate-200 text-slate-700 text-xs sm:text-sm font-medium rounded-lg"
                            >
                                Refresh
                            </Button>
                            <Button
                                onPress={() => setIsModalOpen(true)}
                                color="success"
                                startContent={<HiPlus className="w-4 h-4" />}
                                className="bg-emerald-600 text-white text-xs sm:text-sm font-medium rounded-lg shadow-emerald-200"
                            >
                                New Dataset
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
                    title="No datasets found"
                    description="Datasets group your documents together so you can easily assign them to different chatbots."
                    actionLabel="Create your first dataset"
                    onAction={() => setIsModalOpen(true)}
                    accentColor="emerald"
                />
            ) : (
                <div className="space-y-6">
                    <StyledTable
                        aria-label="Datasets list"
                        columns={COLUMNS}
                        items={datasets}
                        renderCell={renderCell}
                    />

                    {/* Quick Add Card */}
                    <Card
                        isPressable
                        onPress={() => setIsModalOpen(true)}
                        className="w-full bg-slate-50 border-2 border-dashed border-slate-200 shadow-none hover:border-emerald-500 hover:bg-emerald-50/10 transition-all rounded-xl"
                    >
                        <CardBody className="py-8 flex flex-col items-center justify-center">
                            <div className="w-12 h-12 rounded-full bg-white border border-slate-200 flex items-center justify-center mb-3 shadow-sm">
                                <HiPlus className="w-6 h-6 text-slate-400" />
                            </div>
                            <h3 className="text-sm font-semibold text-slate-900">Add New Dataset</h3>
                            <p className="text-xs text-slate-500 mt-1">Connect more data sources</p>
                        </CardBody>
                    </Card>
                </div>
            )}

            <CreateDatasetModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            />
        </div>
    );
}
