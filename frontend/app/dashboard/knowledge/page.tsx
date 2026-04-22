/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import {
  Code,
  FileText,
  Folder,
  Globe2,
  Pencil,
  Plus,
  RefreshCw,
  Search,
  Trash2,
  Upload,
  Database,
  Layers,
  ArrowRight,
} from "lucide-react";
import { SiNotion } from "react-icons/si";

import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { fetchDatasets, deleteDataset } from "@/lib/store/slices/datasetsSlice";
import { fetchDocuments, deleteDocument } from "@/lib/store/slices/documentsSlice";
import showToast from "@/lib/toast";
import { Button } from "@/components/ui/button";
import {
  DeleteConfirmationModal,
  Input,
  TableSkeleton,
  StyledTable,
} from "@/app/components/ui";
import type { TableColumnDef } from "@/app/components/ui";
import { getFileIcon } from "@/lib/file-utils";
import UploadSourceFilesDrawer from "@/app/components/UploadSourceFilesDrawer";
import CreateKnowledgeBaseDrawer from "@/app/components/CreateKnowledgeBaseDrawer";
import EditCollectionDrawer from "@/app/components/EditCollectionDrawer";
import type { Dataset, Document } from "@/lib/types";

// ─── Data ────────────────────────────────────────────────────────────────────

type TabId = "sources" | "files" | "collections";

const TABS: { id: TabId; label: string; icon: React.ElementType }[] = [
  { id: "sources",     label: "Sources",     icon: Layers },
  { id: "collections", label: "Collections", icon: Folder },
  { id: "files",       label: "Files",       icon: FileText },
];

const SOURCES = [
  {
    id: "upload",
    label: "Upload files",
    desc: "Drop PDF, DOCX, TXT, or Markdown",
    icon: Upload,
    color: "#1D2020",
    bg: "#F5F5F4",
    action: "upload",
  },
  {
    id: "crawl",
    label: "Crawl website",
    desc: "Sync any public URL",
    icon: Globe2,
    color: "#0D9488",
    bg: "#CCFBF1",
    action: "crawl",
  },
  {
    id: "notion",
    label: "Notion",
    desc: "Pages & databases",
    icon: SiNotion,
    color: "#000000",
    bg: "#F5F5F4",
    action: "notion",
  },
  {
    id: "api",
    label: "API endpoint",
    desc: "Push via webhook",
    icon: Code,
    color: "#2563EB",
    bg: "#EFF6FF",
    action: "api",
  },
];

// ─── Page ────────────────────────────────────────────────────────────────────

export default function KnowledgePage() {
  const dispatch = useAppDispatch();
  const { items: datasets, status: dsStatus } = useAppSelector((s) => s.datasets);
  const { items: documents, status: docStatus } = useAppSelector((s) => s.documents);

  const [tab, setTab] = useState<TabId>("sources");
  const [search, setSearch] = useState("");
  const [uploadOpen, setUploadOpen] = useState(false);
  const [createKbOpen, setCreateKbOpen] = useState(false);
  const [editDataset, setEditDataset] = useState<Dataset | null>(null);
  const [deleteState, setDeleteState] = useState<{
    type: "dataset" | "document";
    id: string;
    name: string;
  } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const isLoading = dsStatus === "loading" || docStatus === "loading";

  useEffect(() => {
    dispatch(fetchDatasets());
    dispatch(fetchDocuments());
  }, [dispatch]);

  const handleSourceClick = (action: string) => {
    if (action === "upload") setUploadOpen(true);
    else if (action === "notion") window.location.href = "/dashboard/connectors?type=notion";
    else if (action === "crawl") window.location.href = "/dashboard/connectors?type=website";
    else if (action === "api") showToast.info("API ingest is coming soon.");
  };

  const handleDelete = async () => {
    if (!deleteState) return;
    setIsDeleting(true);
    try {
      if (deleteState.type === "dataset") {
        await dispatch(deleteDataset(deleteState.id)).unwrap();
      } else {
        await dispatch(deleteDocument(deleteState.id)).unwrap();
      }
      showToast.success(`"${deleteState.name}" deleted`);
      setDeleteState(null);
    } catch (err: any) {
      showToast.error(err?.message || "Failed to delete");
    } finally {
      setIsDeleting(false);
    }
  };

  const q = search.toLowerCase();
  const filteredDocs = documents.filter((d) => d.name.toLowerCase().includes(q));
  const filteredDatasets = datasets.filter((d) => d.name.toLowerCase().includes(q));

  return (
    <>
      <div className="w-full space-y-6 animate-fade-in-up">
        {/* ── Page header ── */}
        <section>
          <span className="dash-eyebrow">Knowledge</span>
          <div className="mt-2 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <h1>Your knowledge base</h1>
              <p className="text-[14px] text-muted-foreground mt-1.5 max-w-xl leading-relaxed">
                Connect sources, index files, and group them into collections
                your agents can train on.
              </p>
            </div>
            {/* Always reserve space to prevent layout shift when switching tabs */}
            <div className={`sm:max-w-xs w-full transition-all ${tab !== "sources" ? "visible" : "invisible pointer-events-none"}`}>
              <Input
                isClearable
                placeholder={tab === "files" ? "Search files..." : "Search collections..."}
                startContent={<Search className="w-4 h-4 text-muted-foreground" strokeWidth={1.75} />}
                value={search}
                onClear={() => setSearch("")}
                onValueChange={setSearch}
              />
            </div>
          </div>
        </section>

        {/* ── Tabs ── */}
        <div className="flex items-center gap-1 border-b border-border -mx-1 overflow-x-auto">
          {TABS.map(({ id, label, icon: Icon }) => {
            const isActive = tab === id;
            return (
              <button
                key={id}
                onClick={() => {
                  setTab(id);
                  setSearch("");
                }}
                className={`relative inline-flex items-center gap-2 px-4 py-2.5 text-[13px] font-medium transition-colors whitespace-nowrap
                  ${isActive
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground"}`}
                aria-pressed={isActive}
              >
                <Icon className="w-4 h-4" strokeWidth={1.75} />
                {label}
                {isActive && (
                  <span className="absolute -bottom-px left-1 right-1 h-0.5 bg-foreground rounded-full" />
                )}
              </button>
            );
          })}
        </div>

        {/* ── Tab content ── */}
        {tab === "sources" && (
          <SourcesTab onSourceClick={handleSourceClick} />
        )}

        {tab === "files" && (
          <FilesTab
            isLoading={isLoading}
            documents={documents}
            filteredDocs={filteredDocs}
            search={search}
            onRefresh={() => dispatch(fetchDocuments())}
            onDelete={() => {}}
          />
        )}

        {tab === "collections" && (
          <CollectionsTab
            datasets={datasets}
            filteredDatasets={filteredDatasets}
            search={search}
            onCreate={() => setCreateKbOpen(true)}
            onEdit={(ds) => setEditDataset(ds)}
            onDelete={(ds) =>
              setDeleteState({ type: "dataset", id: ds.id, name: ds.name })
            }
          />
        )}
      </div>

      <UploadSourceFilesDrawer
        isOpen={uploadOpen}
        onClose={() => setUploadOpen(false)}
        onUploadSuccess={() => dispatch(fetchDocuments())}
      />
      <CreateKnowledgeBaseDrawer
        isOpen={createKbOpen}
        onClose={() => setCreateKbOpen(false)}
        editDataset={null}
      />
      <EditCollectionDrawer
        isOpen={editDataset !== null}
        onClose={() => setEditDataset(null)}
        dataset={editDataset}
      />
      <DeleteConfirmationModal
        isOpen={!!deleteState}
        onClose={() => setDeleteState(null)}
        onConfirm={handleDelete}
        isLoading={isDeleting}
        title={`Delete ${deleteState?.type === "dataset" ? "collection" : "file"}?`}
        description="This cannot be undone. Any agents using this content will lose access."
        itemName={deleteState?.name}
      />
    </>
  );
}

// ─── Sources tab ─────────────────────────────────────────────────────────────

function SourcesTab({ onSourceClick }: { onSourceClick: (a: string) => void }) {
  return (
    <section className="space-y-6">
      <div>
        <h2>Connect a new source</h2>
        <p className="text-[13px] text-muted-foreground mt-1">
          Pick where your content lives. New files sync automatically.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {SOURCES.map(({ id, label, desc, icon: Icon, color, bg, action }) => (
          <button
            key={id}
            onClick={() => onSourceClick(action)}
            className="dash-card group bg-background border border-border p-5 flex flex-col items-start gap-4 text-left hover:border-border-medium hover:shadow-md transition-all"
          >
            <div
              className="w-11 h-11 rounded-xl flex items-center justify-center"
              style={{ background: bg, color }}
            >
              <Icon size={20} strokeWidth={1.75} />
            </div>
            <div className="min-w-0 w-full">
              <div className="text-[14px] font-semibold text-foreground tracking-[-0.005em]">
                {label}
              </div>
              <div className="text-[12px] text-muted-foreground mt-0.5 leading-relaxed">
                {desc}
              </div>
            </div>
            <div className="mt-auto pt-1 text-[12px] font-medium text-muted-foreground inline-flex items-center gap-1 group-hover:text-foreground transition-colors">
              Connect
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" strokeWidth={2} />
            </div>
          </button>
        ))}
      </div>
    </section>
  );
}

// ─── Files tab ───────────────────────────────────────────────────────────────

const FILE_COLUMNS: TableColumnDef[] = [
  { key: "name",    label: "File" },
  { key: "source",  label: "Source" },
  { key: "date",    label: "Indexed on" },
  { key: "status",  label: "Status",  align: "center" },
  { key: "actions", label: "",        align: "end" },
];

function FilesTab({
  isLoading,
  documents,
  filteredDocs,
  search,
  onRefresh,
  onDelete,
}: {
  isLoading: boolean;
  documents: Document[];
  filteredDocs: Document[];
  search: string;
  onRefresh: () => void;
  onDelete: (doc: Document) => void;
}) {
  const [pendingDelete, setPendingDelete] = useState<Document | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const dispatch = useAppDispatch();

  const handleConfirmDelete = async () => {
    if (!pendingDelete) return;
    setIsDeleting(true);
    try {
      await dispatch(deleteDocument(pendingDelete.id)).unwrap();
      showToast.success(`"${pendingDelete.name}" deleted`);
      setPendingDelete(null);
    } catch {
      showToast.error("Failed to delete file");
    } finally {
      setIsDeleting(false);
    }
  };

  const renderCell = (doc: Document, key: React.Key) => {
    switch (key) {
      case "name": {
        const { Icon, color, bg } = getFileIcon(doc.name);
        return (
          <div className="flex items-center gap-3 min-w-0">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
              style={{ background: bg, color }}
            >
              <Icon size={14} strokeWidth={1.75} />
            </div>
            <span className="text-[13px] font-medium text-foreground truncate max-w-[260px]">
              {doc.name}
            </span>
          </div>
        );
      }
      case "source":
        return (
          <span className="text-[12px] text-muted-foreground">
            {doc.connector_id ? "Synced" : "Uploaded"}
          </span>
        );
      case "date":
        return (
          <span className="text-[12px] text-muted-foreground tabular-nums">
            {new Date(doc.created_at).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" })}
          </span>
        );
      case "status":
        return (
          <span className="dash-pill inline-flex bg-green-50 text-green-700">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
            Indexed
          </span>
        );
      case "actions":
        return (
          <Button
            size="icon-sm"
            variant="ghost"
            onClick={(e) => { e.stopPropagation(); setPendingDelete(doc); }}
            className="text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
            title="Delete file"
          >
            <Trash2 className="w-3.5 h-3.5" strokeWidth={1.75} />
          </Button>
        );
      default:
        return null;
    }
  };

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2>Indexed files</h2>
          <p className="text-[13px] text-muted-foreground mt-1">
            Raw content ingested from your sources, broken into searchable chunks.
          </p>
        </div>
        <Button
          size="sm"
          variant="outline"
          onClick={onRefresh}
          disabled={isLoading}
          className="rounded-full"
        >
          <RefreshCw
            className={`w-3.5 h-3.5 ${isLoading ? "animate-spin" : ""}`}
            strokeWidth={1.75}
          />
          Refresh
        </Button>
      </div>

      {isLoading && documents.length === 0 ? (
        <TableSkeleton rows={5} columns={5} />
      ) : (
        <StyledTable
          aria-label="Indexed files"
          columns={FILE_COLUMNS}
          items={filteredDocs}
          renderCell={renderCell}
          rowsPerPage={5}
          emptyContent={
            documents.length === 0
              ? "No files yet — add a source to start indexing content."
              : `Nothing matches "${search}".`
          }
        />
      )}

      <DeleteConfirmationModal
        isOpen={!!pendingDelete}
        onClose={() => setPendingDelete(null)}
        onConfirm={handleConfirmDelete}
        isLoading={isDeleting}
        title="Delete file?"
        description="This will permanently remove the file and its indexed chunks from your knowledge base."
        itemName={pendingDelete?.name}
      />
    </section>
  );
}

// ─── Collections tab ─────────────────────────────────────────────────────────

function CollectionsTab({
  datasets,
  filteredDatasets,
  search,
  onCreate,
  onEdit,
  onDelete,
}: {
  datasets: Dataset[];
  filteredDatasets: Dataset[];
  search: string;
  onCreate: () => void;
  onEdit: (ds: Dataset) => void;
  onDelete: (ds: Dataset) => void;
}) {
  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2>Collections</h2>
          <p className="text-[13px] text-muted-foreground mt-1">
            Group related files so agents can train on specific subsets.
          </p>
        </div>
        <Button size="sm" onClick={onCreate} className="rounded-full">
          <Plus className="w-3.5 h-3.5" strokeWidth={2} />
          New collection
        </Button>
      </div>

      {filteredDatasets.length === 0 ? (
        <EmptyCard
          icon={Database}
          title={datasets.length === 0 ? "No collections yet" : "No matches"}
          message={
            datasets.length === 0
              ? "Group files to train your agents on specific topics."
              : `Nothing matches "${search}".`
          }
          action={
            datasets.length === 0 ? (
              <Button size="sm" onClick={onCreate} className="rounded-full">
                <Plus className="w-3.5 h-3.5" strokeWidth={2} />
                Create first collection
              </Button>
            ) : undefined
          }
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {filteredDatasets.map((ds) => (
            <div
              key={ds.id}
              className="dash-card bg-background border border-border p-5 hover:border-border-medium hover:shadow-md transition-all group relative flex flex-col gap-3"
            >
              {/* Top row: icon + actions */}
              <div className="flex items-start justify-between">
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center"
                  style={{ background: "#FFFBEB", color: "#D97706" }}
                >
                  <Folder size={20} strokeWidth={1.75} />
                </div>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    size="icon-sm"
                    variant="ghost"
                    onClick={() => onEdit(ds)}
                    className="text-muted-foreground hover:text-foreground"
                    title="Edit collection"
                  >
                    <Pencil className="w-3.5 h-3.5" strokeWidth={1.75} />
                  </Button>
                  <Button
                    size="icon-sm"
                    variant="ghost"
                    onClick={() => onDelete(ds)}
                    className="text-muted-foreground hover:text-destructive"
                    title="Delete collection"
                  >
                    <Trash2 className="w-3.5 h-3.5" strokeWidth={1.75} />
                  </Button>
                </div>
              </div>

              {/* Name */}
              <div className="text-[15px] font-semibold text-foreground truncate tracking-[-0.01em]">
                {ds.name}
              </div>

              {/* File count + date */}
              <div className="flex items-center justify-between mt-auto pt-1 border-t border-border">
                <span className="flex items-center gap-1.5 text-[12px] text-muted-foreground">
                  <FileText className="w-3.5 h-3.5" strokeWidth={1.75} />
                  {ds.document_count ?? 0} {(ds.document_count ?? 0) === 1 ? "file" : "files"}
                </span>
                <span className="text-[11px] text-muted-foreground">
                  {new Date(ds.created_at).toLocaleDateString(undefined, { month: "short", day: "numeric" })}
                </span>
              </div>
            </div>
          ))}
          <button
            onClick={onCreate}
            className="border border-dashed border-border rounded-xl p-5 flex flex-col items-center justify-center gap-2 min-h-[150px] text-muted-foreground hover:border-border-medium hover:bg-muted/50 hover:text-foreground transition-colors"
          >
            <div className="w-11 h-11 rounded-xl bg-muted flex items-center justify-center">
              <Plus className="w-5 h-5" strokeWidth={1.75} />
            </div>
            <span className="text-[13px] font-medium">New collection</span>
          </button>
        </div>
      )}
    </section>
  );
}

// ─── Empty state card ────────────────────────────────────────────────────────

function EmptyCard({
  icon: Icon,
  title,
  message,
  action,
}: {
  icon: React.ElementType;
  title: string;
  message: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="dash-card bg-background border border-dashed border-border py-14 flex flex-col items-center text-center px-6">
      <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center text-muted-foreground mb-4">
        <Icon size={20} strokeWidth={1.75} />
      </div>
      <div className="text-[15px] font-semibold text-foreground">{title}</div>
      <div className="text-[13px] text-muted-foreground mt-1 max-w-xs">
        {message}
      </div>
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
