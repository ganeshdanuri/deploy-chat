"use client";

import { useState, useEffect } from "react";
import { HiDatabase, HiPlus, HiRefresh, HiCheck, HiCollection, HiTrash } from "react-icons/hi";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/lib/store/store";
import { fetchDatasets, deleteDataset } from "@/lib/store/slices/datasetsSlice";
import CreateDatasetModal from "@/app/components/CreateDatasetModal";
import UploadModal from "@/app/components/UploadModal";
import { fetchDocuments } from "@/lib/store/slices/documentsSlice";
import showToast from "@/lib/toast";
import {
    Table,
    TableHeader,
    TableColumn,
    TableBody,
    TableRow,
    TableCell,
    User,
    Chip,
    Tooltip,
    Button,
    Spinner,
    Card,
    CardBody
} from "@heroui/react";

export default function DatasetsPage() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
    const dispatch = useDispatch<AppDispatch>();
    const { items: datasets, status, error } = useSelector((state: RootState) => state.datasets);
    const isLoading = status === 'loading';

    useEffect(() => {
        dispatch(fetchDatasets());
    }, [dispatch]);


    const handleDelete = async (id: string, name: string) => {
        if (confirm("Are you sure you want to delete this dataset?")) {
            try {
                await dispatch(deleteDataset(id)).unwrap();
                showToast.success(`Dataset "${name}" deleted successfully`);
            } catch (error: any) {
                showToast.error(error?.message || "Failed to delete dataset");
            }
        }
    };

    const renderCell = (ds: any, columnKey: React.Key) => {
        switch (columnKey) {
            case "name":
                return (
                    <User
                        avatarProps={{
                            radius: "lg",
                            fallback: <HiDatabase className="w-4 h-4 text-emerald-600" />,
                            className: "bg-emerald-50 border border-emerald-100",
                            size: "sm"
                        }}
                        description="Collection"
                        name={ds.name}
                        classNames={{
                            name: "font-medium text-sm text-slate-800",
                            description: "text-xs text-slate-400"
                        }}
                    >
                        {ds.name}
                    </User>
                );
            case "status":
                return (
                    <Chip
                        className="capitalize border-none gap-1 text-emerald-700 bg-emerald-50"
                        color="success"
                        size="sm"
                        variant="dot"
                    >
                        Active
                    </Chip>
                );
            case "created_at":
                return (
                    <div className="flex flex-col">
                        <p className="text-xs text-slate-600">{new Date(ds.created_at).toLocaleDateString()}</p>
                        <p className="text-xs text-slate-400 font-mono">
                            {new Date(ds.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                    </div>
                );
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
                return (ds as any)[columnKey as any];
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
                    <Button
                        onPress={() => dispatch(fetchDatasets())}
                        variant="bordered"
                        startContent={<HiRefresh className="w-4 h-4 text-slate-400" />}
                        className="bg-white border-slate-200 text-slate-700 font-semibold rounded-lg"
                    >
                        Refresh
                    </Button>
                    <Button
                        onPress={() => setIsModalOpen(true)}
                        color="success"
                        startContent={<HiPlus className="w-4 h-4" />}
                        className="bg-emerald-600 text-white font-semibold rounded-lg shadow-emerald-200"
                    >
                        New Dataset
                    </Button>
                </div>
            </div>

            {isLoading && datasets.length === 0 ? (
                <div className="flex items-center justify-center py-20">
                    <Spinner color="success" size="lg" />
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
                    <Button
                        onPress={() => setIsModalOpen(true)}
                        color="success"
                        startContent={<HiPlus className="w-5 h-5" />}
                        className="bg-emerald-600 px-6 h-12 text-white font-bold rounded-xl shadow-lg shadow-emerald-200"
                    >
                        Create your first dataset
                    </Button>
                </div>
            ) : (
                <div className="space-y-6">
                    <Table
                        aria-label="Datasets list"
                        classNames={{
                            base: "bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden",
                            thead: "bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold",
                            wrapper: "shadow-none p-0",
                            th: "bg-slate-50/50 text-slate-500"
                        }}
                    >
                        <TableHeader>
                            <TableColumn key="name">NAME</TableColumn>
                            <TableColumn key="status">STATUS</TableColumn>
                            <TableColumn key="created_at">CREATED AT</TableColumn>
                            <TableColumn key="actions" align="end">ACTIONS</TableColumn>
                        </TableHeader>
                        <TableBody items={datasets}>
                            {(item) => (
                                <TableRow key={item.id} className="cursor-pointer hover:bg-slate-50/80 transition-colors">
                                    {(columnKey) => <TableCell>{renderCell(item, columnKey)}</TableCell>}
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>

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
            <UploadModal
                isOpen={isUploadModalOpen}
                onClose={() => setIsUploadModalOpen(false)}
                onUploadSuccess={() => dispatch(fetchDocuments())}
            />
        </div>
    );
}
