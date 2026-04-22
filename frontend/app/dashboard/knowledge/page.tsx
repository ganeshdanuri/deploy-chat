/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState, useRef } from "react";
import { FileText, Folder, Layers, Search } from "lucide-react";

import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { fetchDatasets, deleteDataset } from "@/lib/store/slices/datasetsSlice";
import { fetchDocuments, deleteDocument } from "@/lib/store/slices/documentsSlice";
import showToast from "@/lib/toast";
import { toast } from "sonner";
import { Input } from "@/app/components/ui";
import UploadFilesDrawer from "@/app/components/UploadFilesDrawer";
import KnowledgeBaseFormDrawer from "@/app/components/KnowledgeBaseFormDrawer";
import EditKnowledgeBaseDrawer from "@/app/components/EditKnowledgeBaseDrawer";
import { SourcesTab } from "./components/SourcesTab";
import { FilesTab } from "./components/FilesTab";
import { CollectionsTab } from "./components/CollectionsTab";
import type { Dataset, Document } from "@/lib/types";

// ─── Tabs config ──────────────────────────────────────────────────────────────

type TabId = "sources" | "files" | "collections";

const TABS: { id: TabId; label: string; icon: React.ElementType }[] = [
  { id: "sources",     label: "Sources",     icon: Layers },
  { id: "collections", label: "Collections", icon: Folder },
  { id: "files",       label: "Files",       icon: FileText },
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
  // pendingDeletes: items hidden in UI but not yet deleted in backend (undo window)
  const [pendingDeletes, setPendingDeletes] = useState<Set<string>>(new Set());
  const deleteTimers = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map());

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

  const handleDelete = (type: "dataset" | "document", id: string, name: string) => {
    // Immediately hide from UI
    setPendingDeletes((prev) => new Set(prev).add(id));

    // Schedule actual delete after 5s
    const timer = setTimeout(async () => {
      try {
        if (type === "dataset") await dispatch(deleteDataset(id)).unwrap();
        else await dispatch(deleteDocument(id)).unwrap();
      } catch {
        showToast.error(`Failed to delete "${name}"`);
      }
      deleteTimers.current.delete(id);
      setPendingDeletes((prev) => { const s = new Set(prev); s.delete(id); return s; });
    }, 5000);

    deleteTimers.current.set(id, timer);

    // Toast with undo action
    toast(`"${name}" deleted`, {
      action: {
        label: "Undo",
        onClick: () => {
          clearTimeout(deleteTimers.current.get(id));
          deleteTimers.current.delete(id);
          setPendingDeletes((prev) => { const s = new Set(prev); s.delete(id); return s; });
          showToast.success(`"${name}" restored`);
        },
      },
      duration: 5000,
    });
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
            documents={documents.filter((d) => !pendingDeletes.has(d.id))}
            filteredDocs={filteredDocs.filter((d) => !pendingDeletes.has(d.id))}
            search={search}
            onRefresh={() => dispatch(fetchDocuments())}
            onDelete={(doc) => handleDelete("document", doc.id, doc.name)}
          />
        )}

        {tab === "collections" && (
          <CollectionsTab
            datasets={filteredDatasets.filter((d) => !pendingDeletes.has(d.id))}
            filteredDatasets={filteredDatasets.filter((d) => !pendingDeletes.has(d.id))}
            search={search}
            onCreate={() => setCreateKbOpen(true)}
            onEdit={(ds) => setEditDataset(ds)}
            onDelete={(ds) => handleDelete("dataset", ds.id, ds.name)}
          />
        )}
      </div>

      <UploadFilesDrawer
        isOpen={uploadOpen}
        onClose={() => setUploadOpen(false)}
        onUploadSuccess={() => dispatch(fetchDocuments())}
      />
      <KnowledgeBaseFormDrawer
        isOpen={createKbOpen}
        onClose={() => setCreateKbOpen(false)}
        editDataset={null}
      />
      <EditKnowledgeBaseDrawer
        isOpen={editDataset !== null}
        onClose={() => setEditDataset(null)}
        dataset={editDataset}
      />
    </>
  );
}
