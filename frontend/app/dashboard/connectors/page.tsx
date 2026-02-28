"use client";

import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { fetchConnectors, deleteConnector, syncConnector } from "@/lib/store/slices/connectorsSlice";
import { HiPlus, HiRefresh, HiTrash, HiExternalLink, HiCheckCircle, HiExclamationCircle, HiClock, HiShare } from "react-icons/hi";
import { SiNotion, SiGoogledrive, SiSlack, SiGithub, SiIntercom } from "react-icons/si";
import { NotionConnectionDrawer } from "./components/NotionConnectionDrawer";
import showToast from "@/lib/toast";

import { PageHeader, EmptyState, DateCell, StatusChip, Tooltip, DeleteConfirmationDrawer } from "@/app/components/ui";

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
    const [isNotionDrawerOpen, setIsNotionDrawerOpen] = useState(false);
    const [isSyncing, setIsSyncing] = useState<string | null>(null);

    const [deleteDrawerOpen, setDeleteDrawerOpen] = useState(false);
    const [itemToDelete, setItemToDelete] = useState<{ id: string; name: string } | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        dispatch(fetchConnectors());
    }, [dispatch]);

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
        setDeleteDrawerOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (!itemToDelete) return;
        setIsDeleting(true);
        try {
            await dispatch(deleteConnector(itemToDelete.id)).unwrap();
            showToast.success("Integration deleted successfully");
            setDeleteDrawerOpen(false);
        } catch (err) {
            showToast.error("Delete failed");
        } finally {
            setIsDeleting(false);
            setItemToDelete(null);
        }
    };

    const handleOptionClick = (id: string) => {
        if (id === 'notion') {
            setIsNotionDrawerOpen(true);
        } else {
            showToast.info(`${id.replace('-', ' ')} connector is coming soon!`);
        }
    };

    return (
        <div className="animate-fade-in-up space-y-12">
            {/* Page Header */}
            <div>
                <h1 className="text-3xl font-black text-slate-900 tracking-tight">Integrations</h1>
                <p className="text-base text-slate-500 mt-2 font-medium max-w-2xl leading-relaxed">
                    Connect your workspace tools to automatically build and update your AI knowledge base.
                    Sync documents, pages, and conversations in real-time.
                </p>
            </div>

            {/* Available Options */}
            <div className="space-y-6">
                <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                        <HiPlus className="w-5 h-5" />
                    </span>
                    <h2 className="text-lg font-bold text-slate-800">Available Integrations</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                    {AVAILABLE_CONNECTORS.map((option) => (
                        <button
                            key={option.id}
                            disabled={option.status !== 'active'}
                            onClick={() => handleOptionClick(option.id)}
                            className={`
                                group relative flex flex-col items-center justify-center p-8 rounded-2xl border transition-all duration-300
                                ${option.status === 'active'
                                    ? "bg-white border-slate-100 hover:border-indigo-400 hover:shadow-2xl hover:shadow-indigo-500/10 cursor-pointer"
                                    : "bg-slate-50/50 border-slate-100 opacity-60 grayscale cursor-not-allowed"
                                }
                            `}
                        >
                            <div className={`
                                w-16 h-16 rounded-2xl flex items-center justify-center mb-4 transition-all duration-300
                                ${option.status === 'active' ? "bg-indigo-50 text-indigo-600 group-hover:scale-110 shadow-sm" : "bg-slate-100 text-slate-400"}
                            `}>
                                <option.icon className="w-6 h-6" />
                            </div>
                            <h3 className="font-bold text-slate-900 mb-1 text-sm">{option.name}</h3>
                            <p className="text-[10px] uppercase font-bold text-slate-400 tracking-tight leading-tight">{option.description}</p>

                            {option.status === 'coming-soon' && (
                                <div className="absolute top-3 right-3">
                                    <span className="text-[9px] font-black uppercase tracking-widest bg-slate-200 text-slate-500 px-2 py-0.5 rounded-full">
                                        Soon
                                    </span>
                                </div>
                            )}

                            {option.status === 'active' && (
                                <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <HiPlus className="w-4 h-4 text-indigo-600" />
                                </div>
                            )}
                        </button>
                    ))}
                </div>
            </div>

            {/* Active Connections */}
            <div className="space-y-6">
                <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                        <HiShare className="w-5 h-5" />
                    </span>
                    <h2 className="text-lg font-bold text-slate-800">Active Connections</h2>
                </div>

                {status === 'loading' && connectors.length === 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[1, 2].map(i => (
                            <div key={i} className="bg-white border border-slate-100 rounded-2xl h-48 animate-pulse shadow-sm" />
                        ))}
                    </div>
                ) : connectors.length === 0 ? (
                    <EmptyState
                        icon={HiShare}
                        title="No active integrations"
                        description="Connect your workspace tools to automatically sync your content and keep your AI knowledge updated."
                        actionLabel="Set up your first integration"
                        onAction={() => { }}
                        accentColor="indigo"
                    />
                ) : (
                    <div className="grid grid-cols-1 gap-4">
                        {connectors.map((connector) => (
                            <div key={connector.id} className="bg-white rounded-2xl border border-slate-100 overflow-hidden hover:shadow-xl transition-all flex items-center p-6 group">
                                <div className="flex items-center gap-4 flex-1">
                                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-lg ${connector.type === 'notion' ? 'bg-slate-900' : 'bg-blue-600'}`}>
                                        {connector.type === 'notion' ? 'N' : 'G'}
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-1">
                                            <h3 className="font-bold text-slate-900 text-lg">{connector.name}</h3>
                                            <span className={`text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest ${connector.status === 'active' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
                                                {connector.status}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-4 text-xs font-medium text-slate-400">
                                            <div className="flex items-center gap-1.5">
                                                <HiClock className="w-3.5 h-3.5" />
                                                <span>{connector.last_sync_at ? new Date(connector.last_sync_at).toLocaleString() : 'Never synced'}</span>
                                            </div>
                                            <div className="flex items-center gap-1.5">
                                                <HiExternalLink className="w-3.5 h-3.5" />
                                                <span>{connector.config.selected_pages?.length || 0} pages</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => handleSync(connector.id)}
                                        disabled={isSyncing === connector.id}
                                        className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-50 text-slate-700 text-xs font-bold hover:bg-indigo-50 hover:text-indigo-600 transition-all border border-transparent hover:border-indigo-100 disabled:opacity-50"
                                    >
                                        <HiRefresh className={`w-4 h-4 ${isSyncing === connector.id ? "animate-spin" : ""}`} />
                                        Sync Now
                                    </button>
                                    <button
                                        onClick={() => handleDeleteClick(connector.id, connector.name)}
                                        className="p-2.5 rounded-xl bg-slate-50 text-slate-400 hover:text-red-600 hover:bg-red-50 transition-all border border-transparent hover:border-red-100"
                                    >
                                        <HiTrash className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <NotionConnectionDrawer
                isOpen={isNotionDrawerOpen}
                onClose={() => setIsNotionDrawerOpen(false)}
                onConnected={() => dispatch(fetchConnectors())}
            />

            <DeleteConfirmationDrawer
                isOpen={deleteDrawerOpen}
                onClose={() => setDeleteDrawerOpen(false)}
                onConfirm={handleConfirmDelete}
                isLoading={isDeleting}
                title="Remove Integration"
                description="Are you sure you want to remove this integration? All synced documents will be detached from your knowledge base."
                itemName={itemToDelete?.name}
            />
        </div>
    );
}
