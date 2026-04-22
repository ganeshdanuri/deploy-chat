"use client";

import { ArrowRight, Check, Clock, RefreshCw, Search, Share2, Trash2 } from "lucide-react";
/* eslint-disable @typescript-eslint/no-explicit-any */

import { useEffect, useState, useMemo } from "react";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import {
    fetchConnectors,
    deleteConnector,
    syncConnector,
} from "@/lib/store/slices/connectorsSlice";

import {
    SiNotion,
    SiGoogledrive,
    SiSlack,
    SiGithub,
    SiIntercom,
    SiConfluence,
    SiSalesforce,
    SiHubspot,
    SiZendesk,
    SiPostgresql,
    SiMongodb,
    SiSnowflake,
    SiDropbox,
    SiShopify,
    SiWordpress,
    SiBitbucket,
    SiHelpscout,
} from "react-icons/si";
import { FaMicrosoft } from "react-icons/fa";
import { NotionConnectionDrawer } from "./components/NotionConnectionDrawer";
import showToast from "@/lib/toast";
import { DeleteConfirmationModal, PageHeader, Input } from "@/app/components/ui";
import { Button } from "@/components/ui/button";
import { IconType } from "react-icons";

type Status ="active" |"coming-soon";

interface Integration {
    id: string;
    name: string;
    description: string;
    icon: IconType;
    brandColor: string;
    status: Status;
    category: "docs" |"code" |"crm" |"data" |"support" |"files" |"storefront";
}

const INTEGRATIONS: Integration[] = [
    // Documents & wikis
    { id: "notion", name: "Notion", description: "Sync pages and databases", icon: SiNotion, brandColor: "#000000", status: "active", category: "docs" },
    { id: "confluence", name: "Confluence", description: "Enterprise wikis and spaces", icon: SiConfluence, brandColor: "#172B4D", status: "coming-soon", category: "docs" },
    { id: "google-drive", name: "Google Drive", description: "Docs, sheets and folders", icon: SiGoogledrive, brandColor: "#4285F4", status: "coming-soon", category: "docs" },
    { id: "dropbox", name: "Dropbox", description: "Files and shared folders", icon: SiDropbox, brandColor: "#0061FF", status: "coming-soon", category: "files" },
    { id: "sharepoint", name: "SharePoint", description: "Enterprise documents", icon: FaMicrosoft, brandColor: "#0078D4", status: "coming-soon", category: "docs" },
    { id: "wordpress", name: "WordPress", description: "Articles and blog posts", icon: SiWordpress, brandColor: "#21759B", status: "coming-soon", category: "docs" },

    // Code
    { id: "github", name: "GitHub", description: "Repos, issues and READMEs", icon: SiGithub, brandColor: "#181717", status: "coming-soon", category: "code" },
    { id: "bitbucket", name: "Bitbucket", description: "Repositories and PRs", icon: SiBitbucket, brandColor: "#0052CC", status: "coming-soon", category: "code" },

    // CRM
    { id: "salesforce", name: "Salesforce", description: "Cases, accounts, articles", icon: SiSalesforce, brandColor: "#00A1E0", status: "coming-soon", category: "crm" },
    { id: "hubspot", name: "HubSpot", description: "CRM data and interactions", icon: SiHubspot, brandColor: "#FF7A59", status: "coming-soon", category: "crm" },

    // Support
    { id: "zendesk", name: "Zendesk", description: "Help center and tickets", icon: SiZendesk, brandColor: "#03363D", status: "coming-soon", category: "support" },
    { id: "intercom", name: "Intercom", description: "Help docs and conversations", icon: SiIntercom, brandColor: "#1F8DED", status: "coming-soon", category: "support" },
    { id: "helpscout", name: "Help Scout", description: "Mailboxes and articles", icon: SiHelpscout, brandColor: "#1292EE", status: "coming-soon", category: "support" },

    // Messaging
    { id: "slack", name: "Slack", description: "Channel history and discussions", icon: SiSlack, brandColor: "#4A154B", status: "coming-soon", category: "support" },
    { id: "microsoft-teams", name: "MS Teams", description: "Team chats and documents", icon: FaMicrosoft, brandColor: "#5059C9", status: "coming-soon", category: "support" },

    // Data
    { id: "postgresql", name: "PostgreSQL", description: "SQL databases for RAG", icon: SiPostgresql, brandColor: "#4169E1", status: "coming-soon", category: "data" },
    { id: "mongodb", name: "MongoDB", description: "NoSQL collections", icon: SiMongodb, brandColor: "#47A248", status: "coming-soon", category: "data" },
    { id: "snowflake", name: "Snowflake", description: "Cloud data warehouse", icon: SiSnowflake, brandColor: "#29B5E8", status: "coming-soon", category: "data" },

    // Storefront
    { id: "shopify", name: "Shopify", description: "Products and customers", icon: SiShopify, brandColor: "#7AB55C", status: "coming-soon", category: "storefront" },
];

const CATEGORY_LABELS: Record<string, string> = {
    docs: "Docs & wikis",
    code: "Code",
    crm: "CRM",
    support: "Support & messaging",
    data: "Databases",
    files: "Files",
    storefront: "Storefront",
};

export default function IntegrationsPage() {
    const dispatch = useAppDispatch();
    const { items: connectors, status } = useAppSelector((state) => state.connectors);

    const [tab, setTab] = useState<"active" |"catalog">("active");
    const [search, setSearch] = useState("");
    const [isNotionModalOpen, setIsNotionModalOpen] = useState(false);
    const [isSyncing, setIsSyncing] = useState<string | null>(null);
    const [deleteState, setDeleteState] = useState<{ id: string; name: string } | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        dispatch(fetchConnectors());
    }, [dispatch]);

    // Auto-switch to catalog if user has no active connections
    useEffect(() => {
        if (status === "succeeded" && connectors.length === 0) setTab("catalog");
    }, [status, connectors.length]);

    const filtered = useMemo(() => {
        const q = search.toLowerCase();
        return INTEGRATIONS.filter((i) => i.name.toLowerCase().includes(q));
    }, [search]);

    const grouped = useMemo(() => {
        const g: Record<string, Integration[]> = {};
        filtered.forEach((i) => {
            if (!g[i.category]) g[i.category] = [];
            g[i.category].push(i);
        });
        return g;
    }, [filtered]);

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

    const handleConfirmDelete = async () => {
        if (!deleteState) return;
        setIsDeleting(true);
        try {
            await dispatch(deleteConnector(deleteState.id)).unwrap();
            showToast.success("Integration removed");
            setDeleteState(null);
        } catch {
            showToast.error("Failed to remove");
        } finally {
            setIsDeleting(false);
        }
    };

    const handleConnect = (integration: Integration) => {
        if (integration.id === "notion") {
            setIsNotionModalOpen(true);
        } else {
            showToast.info(`${integration.name} is coming soon — we'll email you when it's ready.`);
        }
    };

    const getIntegrationIcon = (type: string) => {
        const found = INTEGRATIONS.find((i) => i.id === type.toLowerCase());
        return found ? { Icon: found.icon, color: found.brandColor } : { Icon: Share2, color: "#737373" };
    };

    const activeCount = connectors.length;
    const availableCount = INTEGRATIONS.filter((i) => i.status === "active").length;

    return (
        <div className="animate-fade-in-up space-y-6">
            <PageHeader
                title="Integrations"
                description="Connect your tools to sync content into your knowledge base automatically."
            />

            {/* Tab bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex bg-muted p-0.5 rounded-md text-xs font-medium w-fit shrink-0">
                    <button
                        onClick={() => setTab("active")}
                        className={`px-3 py-1.5 rounded transition-colors flex items-center gap-2 ${
                            tab === "active"
                                ? "bg-background text-foreground"
                                : "text-muted-foreground hover:text-foreground"
                        }`}
>
                        My connections
                        <span
                            className="px-1.5 py-0.5 rounded text-[10px] tabular-nums"
                            style={{
                                background: activeCount > 0 ? "var(--agent-bg)" : "var(--border-light)",
                                color: activeCount > 0 ? "var(--agent)" : "var(--muted-foreground)",
                            }}
>
                            {status === "loading" ? "…" : activeCount}
                        </span>
                    </button>
                    <button
                        onClick={() => setTab("catalog")}
                        className={`px-3 py-1.5 rounded transition-colors flex items-center gap-2 ${
                            tab === "catalog"
                                ? "bg-background text-foreground"
                                : "text-muted-foreground hover:text-foreground"
                        }`}
>
                        Catalog
                        <span className="px-1.5 py-0.5 rounded text-[10px] tabular-nums bg-border-light text-muted-foreground">
                            {INTEGRATIONS.length}
                        </span>
                    </button>
                </div>

                {/* Always reserve space for the search input to prevent layout shift */}
                <div className={`sm:max-w-xs w-full transition-all ${tab === "catalog" ? "visible" : "invisible pointer-events-none"}`}>
                    <Input
                        isClearable
                        placeholder="Search integrations..."
                        startContent={<Search className="w-4 h-4 text-muted-foreground" />}
                        value={search}
                        onClear={() => setSearch("")}
                        onValueChange={setSearch}
                    />
                </div>
            </div>

            {tab === "active" ? (
                <ActiveConnections
                    connectors={connectors}
                    status={status}
                    isSyncing={isSyncing}
                    onSync={handleSync}
                    onDelete={(id, name) => setDeleteState({ id, name })}
                    getIntegrationIcon={getIntegrationIcon}
                    onBrowse={() => setTab("catalog")}
                    availableCount={availableCount}
                />
            ) : (
                <Catalog
                    grouped={grouped}
                    hasResults={filtered.length> 0}
                    search={search}
                    onConnect={handleConnect}
                    connectors={connectors}
                />
            )}

            <NotionConnectionDrawer
                isOpen={isNotionModalOpen}
                onClose={() => setIsNotionModalOpen(false)}
                onConnected={() => {
                    dispatch(fetchConnectors());
                    setIsNotionModalOpen(false);
                    setTab("active");
                }}
            />

            <DeleteConfirmationModal
                isOpen={!!deleteState}
                onClose={() => setDeleteState(null)}
                onConfirm={handleConfirmDelete}
                isLoading={isDeleting}
                title="Remove integration? "
                description="All synced documents will be detached from your knowledge base."
                itemName={deleteState?.name}
            />
        </div>
    );
}

// ─── ACTIVE CONNECTIONS ─────────────────────────────────────────────────────

function ActiveConnections({
    connectors,
    status,
    isSyncing,
    onSync,
    onDelete,
    getIntegrationIcon,
    onBrowse,
    availableCount,
}: {
    connectors: any[];
    status: string;
    isSyncing: string | null;
    onSync: (id: string) => void;
    onDelete: (id: string, name: string) => void;
    getIntegrationIcon: (type: string) => { Icon: IconType; color: string };
    onBrowse: () => void;
    availableCount: number;
}) {
    if (status === "loading" && connectors.length === 0) {
        return (
            <div className="space-y-3">
                {[1, 2].map((i) => (
                    <div key={i} className="bg-muted h-20 animate-pulse rounded-xl" />
                ))}
            </div>
        );
    }

    if (connectors.length === 0) {
        return (
            <div className="bg-background border border-dashed border-border rounded-xl py-14 flex flex-col items-center text-center px-6">
                <div
                    className="w-14 h-14 rounded-full flex items-center justify-center mb-5"
                    style={{ background: "var(--agent-bg)", color: "var(--agent)" }}
>
                    <Share2 className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-medium text-foreground mb-2">
                    No active integrations yet
                </h3>
                <p className="text-sm text-muted-foreground mb-6 max-w-sm leading-relaxed">
                    Browse the catalog to connect your first tool. We have{""}
                    <span className="text-foreground font-medium">{availableCount} live</span>{""}
                    and more coming soon.
                </p>
                <Button onClick={onBrowse}>
                    Browse catalog
                    <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                </Button>
            </div>
        );
    }

    return (
        <div className="bg-background border border-border rounded-xl overflow-hidden divide-y divide-border">
            {connectors.map((connector) => {
                const { Icon, color } = getIntegrationIcon(connector.type);
                const syncedItems =
                    ((connector.config as { selected_pages?: string[] })?.selected_pages)?.length || 0;
                return (
                    <div
                        key={connector.id}
                        className="group flex items-center px-5 py-4 gap-4 hover:bg-muted/40 transition-colors"
>
                        <div
                            className="w-10 h-10 rounded-md flex items-center justify-center shrink-0"
                            style={{ background: `${color}12` }}
>
                            <Icon className="w-5 h-5" style={{ color }} />
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                                <h3 className="font-medium text-foreground text-sm truncate max-w-[240px]">
                                    {connector.name}
                                </h3>
                                <span
                                    className="text-[10px] font-medium px-1.5 py-0.5 rounded uppercase tracking-wider"
                                    style={{
                                        background:
                                            connector.status === "active"
                                                ? "rgba(22, 163, 74, 0.1)"
                                                : "rgba(220, 38, 38, 0.1)",
                                        color:
                                            connector.status === "active"
                                                ? "var(--accent-green)"
                                                : "var(--destructive)",
                                    }}
>
                                    {connector.status}
                                </span>
                            </div>
                            <div className="flex flex-col sm:flex-row sm:items-center gap-2 text-xs text-muted-foreground mt-1">
                                <div className="flex items-center gap-1">
                                    <Clock className="w-3 h-3" />
                                    <span>
                                        Last synced{""}
                                        {connector.last_sync_at
                                            ? new Date(connector.last_sync_at).toLocaleString()
                                            : "never"}
                                    </span>
                                </div>
                                <div className="hidden sm:block w-1 h-1 rounded-full bg-border" />
                                <span className="tabular-nums">
                                    {syncedItems} items imported
                                </span>
                            </div>
                        </div>
                        <div className="flex items-center gap-1 shrink-0">
                            <button
                                onClick={() => onSync(connector.id)}
                                disabled={isSyncing === connector.id}
                                className="p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors disabled:opacity-50"
                                title="Sync now"
>
                                <RefreshCw
                                    className={`w-4 h-4 ${isSyncing === connector.id ? "animate-spin" : ""}`}
                                />
                            </button>
                            <button
                                onClick={() => onDelete(connector.id, connector.name)}
                                className="p-2 rounded-md text-muted-foreground hover:text-destructive hover:bg-destructive/5 transition-colors"
                                title="Remove"
>
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}

// ─── CATALOG ────────────────────────────────────────────────────────────────

function Catalog({
    grouped,
    hasResults,
    search,
    onConnect,
    connectors,
}: {
    grouped: Record<string, Integration[]>;
    hasResults: boolean;
    search: string;
    onConnect: (i: Integration) => void;
    connectors: any[];
}) {
    if (!hasResults) {
        return (
            <div className="py-14 text-center text-sm text-muted-foreground border border-dashed border-border rounded-xl">
                No integrations match &quot;{search}&quot;
            </div>
        );
    }

    const connectedIds = new Set(connectors.map((c) => c.type?.toLowerCase()));
    const order = ["docs","code","crm","support","data","files","storefront"];

    return (
        <div className="space-y-8">
            {order
                .filter((cat) => grouped[cat]?.length)
                .map((cat) => (
                    <section key={cat}>
                        <div className="flex items-center gap-2 mb-3">
                            <h2 className="text-[11px] font-medium uppercase tracking-[0.1em] text-muted-foreground">
                                {CATEGORY_LABELS[cat]}
                            </h2>
                            <div className="flex-1 h-px bg-border" />
                            <span className="text-xs text-muted-foreground tabular-nums">
                                {grouped[cat].length}
                            </span>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                            {grouped[cat].map((integration) => {
                                const isConnected = connectedIds.has(integration.id);
                                return (
                                    <IntegrationCard
                                        key={integration.id}
                                        integration={integration}
                                        isConnected={isConnected}
                                        onConnect={() => onConnect(integration)}
                                    />
                                );
                            })}
                        </div>
                    </section>
                ))}
        </div>
    );
}

function IntegrationCard({
    integration,
    isConnected,
    onConnect,
}: {
    integration: Integration;
    isConnected: boolean;
    onConnect: () => void;
}) {
    const { icon: Icon, brandColor } = integration;
    const isActive = integration.status === "active";

    return (
        <button
            onClick={onConnect}
            disabled={!isActive || isConnected}
            className={`w-full bg-background border rounded-xl p-4 flex items-center gap-3 text-left transition-colors group ${
                !isActive ? "cursor-not-allowed" : "hover:border-border-medium cursor-pointer"
            }`}
            style={{
                borderColor: isConnected ? "var(--agent-border)" : "var(--border)",
                opacity: !isActive && !isConnected ? 0.75 : 1,
            }}
>
            <div
                className="w-10 h-10 rounded-md flex items-center justify-center shrink-0"
                style={{ background: `${brandColor}12` }}
>
                <Icon className="w-5 h-5" style={{ color: brandColor }} />
            </div>
            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                    <h3 className="text-[14px] font-medium text-foreground truncate">
                        {integration.name}
                    </h3>
                    {isConnected ? (
                        <span
                            className="text-[10px] font-medium px-1.5 py-0.5 rounded inline-flex items-center gap-1"
                            style={{ background: "var(--agent-bg)", color: "var(--agent)" }}
>
                            <Check className="w-2.5 h-2.5" /> Connected
                        </span>
                    ) : !isActive ? (
                        <span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-muted text-muted-foreground uppercase tracking-wider">
                            Soon
                        </span>
                    ) : null}
                </div>
                <p className="text-xs text-muted-foreground mt-0.5 truncate">
                    {integration.description}
                </p>
            </div>
            {isActive && !isConnected && (
                <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors shrink-0" />
            )}
        </button>
    );
}
