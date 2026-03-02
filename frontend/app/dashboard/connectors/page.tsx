"use client";

import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { fetchConnectors, deleteConnector, syncConnector } from "@/lib/store/slices/connectorsSlice";
import { HiPlus, HiRefresh, HiTrash, HiExternalLink, HiClock, HiShare } from "react-icons/hi";
import { SiNotion, SiGoogledrive, SiSlack, SiGithub, SiIntercom } from "react-icons/si";
import { NotionConnectionDrawer } from "./components/NotionConnectionDrawer";
import showToast from "@/lib/toast";

import { DeleteConfirmationModal } from "@/app/components/ui";

import { AVAILABLE_CONNECTORS } from "@/lib/constants";

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
            case 'notion': return 'bg-secondary';
            case 'google-drive': return 'bg-primary';
            case 'slack': return 'bg-primary';
            case 'github': return 'bg-secondary';
            case 'intercom': return 'bg-primary';
            default: return 'bg-primary';
        }
    };

    const handleSync = async (id: string) => {
        setIsSyncing(id);
        try {
            await dispatch(syncConnector(id)).unwrap();
            showToast.success("Sync completed");
            dispatch(fetchConnectors());
        } catch {
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
        } catch {
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
                    <h1 className="text-3xl font-black text-secondary tracking-tight">Integrations</h1>
                    <p className="text-base text-foreground mt-2 font-medium leading-relaxed">
                        Connect your tools to automatically build your AI knowledge base.
                        Sync documents and conversations in real-time.
                    </p>
                </div>
            </div>

            {/* Tabbed Navigation */}
            <div className="flex items-center gap-1 p-1 bg-muted/80 w-fit">
                <button
                    onClick={() => setActiveTab('active')}
                    className={`
                        px-6 py-2.5 text-sm font-bold transition-all
                        ${activeTab === 'active'
                            ? "bg-white text-primary shadow-sm"
                            : "text-foreground hover:text-secondary hover:bg-white/50"}
                    `}
                >
                    My Connections
                    <span className="ml-2 px-1.5 py-0.5 bg-muted text-[10px] text-muted-foreground">
                        {status === 'loading' ? '...' : connectors.length}
                    </span>
                </button>
                <button
                    onClick={() => setActiveTab('catalog')}
                    className={`
                        px-6 py-2.5 text-sm font-bold transition-all
                        ${activeTab === 'catalog'
                            ? "bg-white text-primary shadow-sm"
                            : "text-foreground hover:text-secondary hover:bg-white/50"}
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
                                    <div key={i} className="bg-white border border-border h-48 animate-pulse shadow-sm" />
                                ))}
                            </div>
                        ) : connectors.length === 0 ? (
                            <div className="py-12 flex flex-col items-center text-center max-w-sm mx-auto">
                                <div className="w-16 h-16 bg-muted flex items-center justify-center text-muted-foreground mb-6">
                                    <HiShare className="w-8 h-8" />
                                </div>
                                <h3 className="text-xl font-bold text-secondary mb-2">No active integrations</h3>
                                <p className="text-sm text-foreground mb-8 font-medium">Connect your workspace tools to automatically sync your content and keep your AI knowledge updated.</p>
                                <button
                                    onClick={() => setActiveTab('catalog')}
                                    className="px-6 py-3 bg-primary text-white text-sm font-bold shadow-lg shadow-primary/10 hover:bg-primary/90 transition-all font-mono tracking-tight"
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
                                        <div key={connector.id} className="group dash-card bg-white border border-border overflow-hidden flex items-center p-6">
                                            <div className="flex items-center gap-5 flex-1 min-w-0">
                                                <div className={`w-14 h-14 flex items-center justify-center text-white shadow-lg ${brandColor} transition-transform group-hover:scale-105`}>
                                                    <Icon className="w-7 h-7" />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center gap-3 mb-1.5 flex-wrap">
                                                        <h3 className="font-bold text-secondary text-lg truncate max-w-[200px]">{connector.name}</h3>
                                                        <span className={`text-[10px] font-black px-2 py-0.5 uppercase tracking-widest ${connector.status === 'active' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500'}`}>
                                                            {connector.status}
                                                        </span>
                                                    </div>
                                                    <div className="flex flex-col sm:flex-row sm:items-center gap-3 text-[11px] font-bold text-muted-foreground uppercase tracking-tight">
                                                        <div className="flex items-center gap-1.5">
                                                            <HiClock className="w-3.5 h-3.5" />
                                                            <span>Last synced: {connector.last_sync_at ? new Date(connector.last_sync_at).toLocaleString() : 'Never'}</span>
                                                        </div>
                                                        <div className="hidden sm:block w-1 h-1 rounded-full bg-border"></div>
                                                        <div className="flex items-center gap-1.5">
                                                            <HiExternalLink className="w-3.5 h-3.5" />
                                                            <span>{((connector.config as { selected_pages?: string[] }).selected_pages)?.length || 0} items imported</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-2 ml-4">
                                                <button
                                                    onClick={() => handleSync(connector.id)}
                                                    disabled={isSyncing === connector.id}
                                                    className="p-2.5 bg-muted text-secondary hover:bg-border transition-all border border-border/50 disabled:opacity-50"
                                                    title="Sync Now"
                                                >
                                                    <HiRefresh className={`w-4 h-4 ${isSyncing === connector.id ? "animate-spin" : ""}`} />
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteClick(connector.id, connector.name)}
                                                    className="p-2.5 bg-muted text-muted-foreground hover:text-red-500 hover:bg-red-500/5 transition-all border border-border/50 hover:border-red-500/20"
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
                                    group relative flex flex-col items-center text-center p-8 border transition-all duration-300
                                    ${option.status === 'active'
                                        ? "bg-white border-border hover:border-primary/40 hover:shadow-2xl hover:shadow-primary/10 cursor-pointer"
                                        : "bg-muted/50 border-border opacity-60 grayscale cursor-not-allowed"
                                    }
                                `}
                            >
                                <div className={`
                                    w-16 h-16 flex items-center justify-center mb-5 transition-all duration-500 shadow-sm
                                    ${option.status === 'active'
                                        ? "bg-secondary text-white group-hover:bg-primary group-hover:scale-110 group-hover:-translate-y-1"
                                        : "bg-muted text-muted-foreground"
                                    }
                                `}>
                                    <option.icon className="w-7 h-7" />
                                </div>
                                <h3 className="font-bold text-secondary mb-1 text-base">{option.name}</h3>
                                <p className="text-xs font-semibold text-muted-foreground leading-tight px-2">{option.description}</p>

                                {option.status === 'coming-soon' && (
                                    <div className="mt-4">
                                        <span className="text-[10px] font-black uppercase tracking-widest bg-border text-foreground px-3 py-1">
                                            Beta Soon
                                        </span>
                                    </div>
                                )}

                                {option.status === 'active' && (
                                    <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <div className="p-1.5 rounded-lg bg-primary/5 text-primary">
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
                onConnected={() => {
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
