"use client";

import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { fetchConnectors, deleteConnector, syncConnector } from "@/lib/store/slices/connectorsSlice";
import { HiPlus, HiRefresh, HiTrash, HiExternalLink, HiCheckCircle, HiExclamationCircle, HiClock, HiShare } from "react-icons/hi";
import { SiNotion, SiGoogledrive, SiSlack, SiGithub, SiIntercom } from "react-icons/si";
import { NotionConnectionDrawer } from "./components/NotionConnectionDrawer";
import showToast from "@/lib/toast";

import { PageHeader, EmptyState, DateCell, StatusChip, Tooltip, DeleteConfirmationModal } from "@/app/components/ui";

const AVAILABLE_CONNECTORS = [
    {
        id: "notion",
        name: "Notion",
        description: "Sync pages and databases",
        icon: SiNotion,
        color: "text-slate-900",
        bgColor: "bg-slate-50",
        status: "active"
    },
    {
        id: "google-drive",
        name: "Google Drive",
        description: "Fetch docs and folders",
        icon: SiGoogledrive,
        color: "text-blue-600",
        bgColor: "bg-blue-50/50",
        status: "coming-soon"
    },
    {
        id: "slack",
        name: "Slack",
        description: "Index channel history",
        icon: SiSlack,
        color: "text-purple-600",
        bgColor: "bg-purple-50/50",
        status: "coming-soon"
    },
    {
        id: "github",
        name: "GitHub",
        description: "Sync repos and READMEs",
        icon: SiGithub,
        color: "text-slate-900",
        bgColor: "bg-slate-100",
        status: "coming-soon"
    },
    {
        id: "intercom",
        name: "Intercom",
        description: "Import help articles",
        icon: SiIntercom,
        color: "text-blue-500",
        bgColor: "bg-blue-50/30",
        status: "coming-soon"
    }
];

export default function ConnectorsPage() {
    const dispatch = useAppDispatch();
    const { items: connectors, status } = useAppSelector((state) => state.connectors);
    const [activeTab, setActiveTab] = useState<'active' | 'catalog'>('active');

    const [isNotionModalOpen, setIsNotionModalOpen] = useState(false);
    const [isSyncing, setIsSyncing] = useState<string | null>(null);

    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [itemToDelete, setItemToDelete] = useState<{ id: string; name: string } | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        dispatch(fetchConnectors());
    }, [dispatch]);

    const getConnectorIcon = (type: string) => {
        switch (type.toLowerCase()) {
            case 'notion': return SiNotion;
            case 'google-drive': return SiGoogledrive;
            case 'slack': return SiSlack;
            case 'github': return SiGithub;
            case 'intercom': return SiIntercom;
            default: return HiShare;
        }
    };

    const getConnectorColor = (type: string) => {
        switch (type.toLowerCase()) {
            case 'notion': return 'bg-slate-900';
            case 'google-drive': return 'bg-blue-600';
            case 'slack': return 'bg-purple-600';
            case 'github': return 'bg-slate-800';
            case 'intercom': return 'bg-blue-500';
            default: return 'bg-indigo-600';
        }
    };

    const handleSync = async (id: string) => {
        setIsSyncing(id);
        try {
            await dispatch(syncConnector(id)).unwrap();
            showToast.success("Sync completed");
            dispatch(fetchConnectors());
        } catch (err) {
            showToast.error("Sync failed");
        } finally {
            setIsSyncing(null);
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
            await dispatch(deleteConnector(itemToDelete.id)).unwrap();
            showToast.success("Integration deleted successfully");
            setDeleteModalOpen(false);
        } catch (err) {
            showToast.error("Delete failed");
        } finally {
            setIsDeleting(false);
            setItemToDelete(null);
        }
    };

    const handleOptionClick = (id: string) => {
        if (id === 'notion') {
            setIsNotionModalOpen(true);
        } else {
            showToast.info(`${id.replace('-', ' ')} connector is coming soon!`);
        }
    };

    return (
        <div className="animate-fade-in-up space-y-8">
            {/* Page Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div className="max-w-xl">
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">Integrations</h1>
                    <p className="text-base text-slate-500 mt-2 font-medium leading-relaxed">
                        Connect your tools to automatically build your AI knowledge base.
                        Sync documents and conversations in real-time.
                    </p>
                </div>
            </div>

            {/* Tabbed Navigation */}
            <div className="flex items-center gap-1 p-1 bg-slate-100/80 rounded-2xl w-fit">
                <button
                    onClick={() => setActiveTab('active')}
                    className={`
                        px-6 py-2.5 rounded-xl text-sm font-bold transition-all
                        ${activeTab === 'active'
                            ? "bg-white text-indigo-600 shadow-sm"
                            : "text-slate-500 hover:text-slate-700 hover:bg-white/50"}
                    `}
                >
                    My Connections
                    <span className="ml-2 px-1.5 py-0.5 rounded-md bg-slate-100 text-[10px] text-slate-500">
                        {status === 'loading' ? '...' : connectors.length}
                    </span>
                </button>
                <button
                    onClick={() => setActiveTab('catalog')}
                    className={`
                        px-6 py-2.5 rounded-xl text-sm font-bold transition-all
                        ${activeTab === 'catalog'
                            ? "bg-white text-indigo-600 shadow-sm"
                            : "text-slate-500 hover:text-slate-700 hover:bg-white/50"}
                    `}
                >
                    Browse Catalog
                </button>
            </div>

            {/* Main Content Area */}
            <div className="min-h-[400px]">
                {activeTab === 'active' ? (
                    <div className="space-y-6">
                        {status === 'loading' && connectors.length === 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {[1, 2].map(i => (
                                    <div key={i} className="bg-white border border-slate-100 rounded-2xl h-48 animate-pulse shadow-sm" />
                                ))}
                            </div>
                        ) : connectors.length === 0 ? (
                            <div className="py-12 flex flex-col items-center text-center max-w-sm mx-auto">
                                <div className="w-16 h-16 rounded-3xl bg-slate-50 flex items-center justify-center text-slate-400 mb-6">
                                    <HiShare className="w-8 h-8" />
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 mb-2">No active integrations</h3>
                                <p className="text-sm text-slate-500 mb-8 font-medium">Connect your workspace tools to automatically sync your content and keep your AI knowledge updated.</p>
                                <button
                                    onClick={() => setActiveTab('catalog')}
                                    className="px-6 py-3 bg-indigo-600 text-white rounded-xl text-sm font-bold shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all"
                                >
                                    Browse Integration Library
                                </button>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 gap-4">
                                {connectors.map((connector) => {
                                    const Icon = getConnectorIcon(connector.type);
                                    const brandColor = getConnectorColor(connector.type);

                                    return (
                                        <div key={connector.id} className="group bg-white rounded-2xl border border-slate-100 overflow-hidden hover:shadow-xl hover:border-indigo-100 transition-all flex items-center p-6">
                                            <div className="flex items-center gap-5 flex-1 min-w-0">
                                                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-lg ${brandColor} transition-transform group-hover:scale-105`}>
                                                    <Icon className="w-7 h-7" />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center gap-3 mb-1.5 flex-wrap">
                                                        <h3 className="font-bold text-slate-900 text-lg truncate max-w-[200px]">{connector.name}</h3>
                                                        <span className={`text-[10px] font-black px-2 py-0.5 rounded-lg uppercase tracking-widest ${connector.status === 'active' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
                                                            {connector.status}
                                                        </span>
                                                    </div>
                                                    <div className="flex flex-col sm:flex-row sm:items-center gap-3 text-[11px] font-bold text-slate-400 uppercase tracking-tight">
                                                        <div className="flex items-center gap-1.5">
                                                            <HiClock className="w-3.5 h-3.5" />
                                                            <span>Last synced: {connector.last_sync_at ? new Date(connector.last_sync_at).toLocaleString() : 'Never'}</span>
                                                        </div>
                                                        <div className="hidden sm:block w-1 h-1 rounded-full bg-slate-200"></div>
                                                        <div className="flex items-center gap-1.5">
                                                            <HiExternalLink className="w-3.5 h-3.5" />
                                                            <span>{connector.config.selected_pages?.length || 0} items imported</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-2 ml-4">
                                                <button
                                                    onClick={() => handleSync(connector.id)}
                                                    disabled={isSyncing === connector.id}
                                                    className="p-2.5 rounded-xl bg-slate-50 text-slate-700 hover:bg-slate-100 transition-all border border-slate-200/50 disabled:opacity-50"
                                                    title="Sync Now"
                                                >
                                                    <HiRefresh className={`w-4 h-4 ${isSyncing === connector.id ? "animate-spin" : ""}`} />
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteClick(connector.id, connector.name)}
                                                    className="p-2.5 rounded-xl bg-slate-50 text-slate-400 hover:text-red-600 hover:bg-red-50 transition-all border border-slate-200/50 hover:border-red-100"
                                                    title="Delete Integration"
                                                >
                                                    <HiTrash className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-fade-in">
                        {AVAILABLE_CONNECTORS.map((option) => (
                            <button
                                key={option.id}
                                disabled={option.status !== 'active'}
                                onClick={() => handleOptionClick(option.id)}
                                className={`
                                    group relative flex flex-col items-center text-center p-8 rounded-3xl border transition-all duration-300
                                    ${option.status === 'active'
                                        ? "bg-white border-slate-100 hover:border-indigo-400 hover:shadow-2xl hover:shadow-indigo-500/10 cursor-pointer"
                                        : "bg-slate-50/50 border-slate-100 opacity-60 grayscale cursor-not-allowed"
                                    }
                                `}
                            >
                                <div className={`
                                    w-16 h-16 rounded-2xl flex items-center justify-center mb-5 transition-all duration-500 shadow-sm
                                    ${option.status === 'active'
                                        ? "bg-slate-900 text-white group-hover:bg-indigo-600 group-hover:scale-110 group-hover:-translate-y-1"
                                        : "bg-slate-100 text-slate-400"
                                    }
                                `}>
                                    <option.icon className="w-7 h-7" />
                                </div>
                                <h3 className="font-bold text-slate-900 mb-1 text-base">{option.name}</h3>
                                <p className="text-xs font-semibold text-slate-400 leading-tight px-2">{option.description}</p>

                                {option.status === 'coming-soon' && (
                                    <div className="mt-4">
                                        <span className="text-[10px] font-black uppercase tracking-widest bg-slate-200 text-slate-500 px-3 py-1 rounded-full">
                                            Beta Soon
                                        </span>
                                    </div>
                                )}

                                {option.status === 'active' && (
                                    <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <div className="p-1.5 rounded-lg bg-indigo-50 text-indigo-600">
                                            <HiPlus className="w-4 h-4" />
                                        </div>
                                    </div>
                                )}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            <NotionConnectionDrawer
                isOpen={isNotionModalOpen}
                onClose={() => setIsNotionModalOpen(false)}
                onConnected={(newConn) => {
                    dispatch(fetchConnectors());
                    setIsNotionModalOpen(false);
                }}
            />

            <DeleteConfirmationModal
                isOpen={deleteModalOpen}
                onClose={() => setDeleteModalOpen(false)}
                onConfirm={handleConfirmDelete}
                isLoading={isDeleting}
                title="Remove Integration"
                description="Are you sure you want to remove this integration? All synced documents will be detached from your knowledge base."
                itemName={itemToDelete?.name}
            />
        </div>
    );
}
