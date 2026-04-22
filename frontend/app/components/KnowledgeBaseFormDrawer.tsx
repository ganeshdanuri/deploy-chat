"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

import { Database, FileText, Search, X, Plus, CheckCheck } from "lucide-react";
import { useState, useEffect } from "react";
import { SiNotion } from "react-icons/si";

import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { fetchDocuments } from "@/lib/store/slices/documentsSlice";
import { fetchConnectors } from "@/lib/store/slices/connectorsSlice";
import { createDataset, fetchDatasets } from "@/lib/store/slices/datasetsSlice";
import Drawer from "./Drawer";
import showToast from "@/lib/toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/app/components/ui";
import api from "@/lib/api";
import { ENDPOINTS } from "@/lib/endpoints";
import { getFileIcon } from "@/lib/file-utils";

type FilterTab = "all" | "selected" | "unselected";

interface KnowledgeBaseFormDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  /** Provide to enter edit mode (name-only); omit for create mode. */
  editDataset?: any;
}

export default function KnowledgeBaseFormDrawer({
  isOpen,
  onClose,
  editDataset,
}: KnowledgeBaseFormDrawerProps) {
  const [name, setName] = useState("");
  const [selectedDocs, setSelectedDocs] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const dispatch = useAppDispatch();
  const { items: documents, status: docStatus } = useAppSelector((state) => state.documents);
  const { items: connectors, status: connStatus } = useAppSelector((state) => state.connectors);

  useEffect(() => {
    if (isOpen) {
      if (docStatus === "idle") dispatch(fetchDocuments());
      if (connStatus === "idle") dispatch(fetchConnectors());
    }
  }, [isOpen, docStatus, connStatus, dispatch]);

  useEffect(() => {
    if (editDataset && isOpen) {
      setName(editDataset.name || "");
    } else if (!editDataset && isOpen) {
      setName("");
      setSelectedDocs([]);
    }
  }, [editDataset, isOpen]);

  const handleSubmit = async () => {
    if (!name || (!editDataset && selectedDocs.length === 0)) return;
    setIsSubmitting(true);
    try {
      if (editDataset) {
        await api.patch(ENDPOINTS.DATASETS.BY_ID(editDataset.id), { name });
        showToast.success(`Knowledge base "${name}" updated successfully!`);
        dispatch(fetchDatasets());
      } else {
        await dispatch(createDataset({ name, document_ids: selectedDocs })).unwrap();
        showToast.success(`Knowledge base "${name}" created successfully!`);
      }
      onClose();
    } catch (error: any) {
      showToast.error(
        error?.message || `Failed to ${editDataset ? "update" : "create"} knowledge base.`
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const footer = (
    <>
      <button
        onClick={onClose}
        className="text-[13px] font-medium text-muted-foreground hover:text-foreground transition-colors"
      >
        Cancel
      </button>
      <Button
        onClick={handleSubmit}
        disabled={isSubmitting || !name || (!editDataset && selectedDocs.length === 0)}
        className="rounded-xl"
      >
        {isSubmitting ? (
          <span className="flex items-center gap-2">
            <span className="w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin" />
            Processing…
          </span>
        ) : editDataset ? "Save changes" : "Create knowledge base"}
      </Button>
    </>
  );

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      title={editDataset ? "Edit Knowledge Base" : "New Knowledge Base"}
      subtitle={
        editDataset
          ? "Update your knowledge collection details."
          : "Connect and organize your knowledge sources."
      }
      icon={Database}
      iconBgColor="bg-emerald-50/50"
      iconColor="text-emerald-600"
      footer={footer}
      size="2xl"
    >
      <div className="space-y-6 animate-fade-in">
        {/* Name */}
        <div className="space-y-2">
          <label className="text-sm font-medium block text-foreground">Knowledge Base Name</label>
          <p className="text-xs text-muted-foreground">Identify this collection for your AI agents.</p>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Legal Documents 2024"
          />
        </div>

        {/* Document selector — create mode only */}
        {!editDataset && (
          <DocumentSelector
            documents={documents}
            connectors={connectors}
            status={docStatus}
            selectedIds={selectedDocs}
            onToggle={(id) =>
              setSelectedDocs((prev) =>
                prev.includes(id) ? prev.filter((d) => d !== id) : [...prev, id]
              )
            }
            onClearAll={() => setSelectedDocs([])}
            onSelectAll={(ids) =>
              setSelectedDocs((prev) => [...new Set([...prev, ...ids])])
            }
          />
        )}
      </div>
    </Drawer>
  );
}

// ─── Document selector sub-component ─────────────────────────────────────────

interface DocumentSelectorProps {
  documents: any[];
  connectors: any[];
  status: string;
  selectedIds: string[];
  onToggle: (id: string) => void;
  onClearAll: () => void;
  onSelectAll: (ids: string[]) => void;
}

function DocumentSelector({
  documents,
  connectors,
  status,
  selectedIds,
  onToggle,
  onClearAll,
  onSelectAll,
}: DocumentSelectorProps) {
  const [search, setSearch] = useState("");
  const [tab, setTab] = useState<FilterTab>("all");

  const q = search.toLowerCase();
  const searched = documents.filter((d) => d.name.toLowerCase().includes(q));
  const filtered =
    tab === "selected"
      ? searched.filter((d) => selectedIds.includes(d.id))
      : tab === "unselected"
      ? searched.filter((d) => !selectedIds.includes(d.id))
      : searched;

  const selectedDocObjects = documents.filter((d) => selectedIds.includes(d.id));
  const canSelectAll = search && filtered.some((d) => !selectedIds.includes(d.id));

  return (
    <div className="space-y-4">
      {/* Selected chips */}
      {selectedDocObjects.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-[12px] font-semibold text-muted-foreground">Selected files</label>
            <button
              onClick={onClearAll}
              className="text-[11px] text-muted-foreground hover:text-foreground transition-colors"
            >
              Clear all
            </button>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {selectedDocObjects.map((doc) => {
              const { Icon, color } = getFileIcon(doc.name);
              return (
                <span
                  key={doc.id}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-muted border border-border rounded-full text-[12px] font-medium text-foreground max-w-[180px]"
                >
                  <Icon size={11} strokeWidth={2} style={{ color, flexShrink: 0 }} />
                  <span className="truncate">{doc.name}</span>
                  <button
                    onClick={() => onToggle(doc.id)}
                    className="ml-0.5 text-muted-foreground hover:text-foreground shrink-0 transition-colors"
                  >
                    <X className="w-2.5 h-2.5" />
                  </button>
                </span>
              );
            })}
          </div>
        </div>
      )}

      <div className="h-px bg-border" />

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" strokeWidth={1.75} />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={`Search ${documents.length} files…`}
          className="w-full h-9 pl-9 pr-3 text-[13px] bg-muted rounded-xl border border-transparent focus:outline-none focus:bg-background focus:border-border transition-all"
        />
      </div>

      {/* Filter tabs + select all */}
      <div className="flex items-center justify-between">
        <div className="flex gap-1 p-1 bg-muted rounded-xl">
          {(["all", "selected", "unselected"] as FilterTab[]).map((t) => {
            const count =
              t === "all"
                ? documents.length
                : t === "selected"
                ? selectedIds.length
                : documents.length - selectedIds.length;
            return (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`px-3 py-1 rounded-lg text-[12px] font-medium transition-all ${
                  tab === t
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {t.charAt(0).toUpperCase() + t.slice(1)}{" "}
                <span className={tab === t ? "text-foreground" : "text-muted-foreground"}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {canSelectAll && (
          <button
            onClick={() => onSelectAll(filtered.map((d) => d.id))}
            className="flex items-center gap-1.5 text-[12px] font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            <CheckCheck className="w-3.5 h-3.5" />
            Select all {filtered.length}
          </button>
        )}
      </div>

      {/* File list */}
      {status === "loading" ? (
        <div className="space-y-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-[52px] bg-muted rounded-xl animate-pulse" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="py-10 text-center">
          <FileText className="w-8 h-8 text-muted-foreground/40 mx-auto mb-2" strokeWidth={1.5} />
          <p className="text-[13px] text-muted-foreground">
            {documents.length === 0
              ? "No files uploaded yet"
              : search
              ? `No files match "${search}"`
              : tab === "selected"
              ? "No files selected yet"
              : "All files are already selected"}
          </p>
        </div>
      ) : (
        <div className="space-y-1">
          {filtered.map((doc) => {
            const connector = doc.connector_id
              ? connectors.find((c: any) => c.id === doc.connector_id)
              : null;
            const { Icon: FileIcon, color, bg } = getFileIcon(doc.name);
            const ItemIcon = connector?.type === "notion" ? SiNotion : FileIcon;
            const isSelected = selectedIds.includes(doc.id);
            return (
              <button
                key={doc.id}
                onClick={() => onToggle(doc.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all ${
                  isSelected
                    ? "bg-foreground/5 border border-border"
                    : "hover:bg-muted border border-transparent"
                }`}
              >
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                  style={{ background: bg, color }}
                >
                  <ItemIcon size={14} strokeWidth={1.75} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-medium text-foreground truncate">{doc.name}</p>
                  <p className="text-[11px] text-muted-foreground">
                    {connector ? `${connector.type}: ${connector.name}` : "Manual upload"}
                  </p>
                </div>
                <div
                  className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 transition-all ${
                    isSelected
                      ? "bg-foreground text-background"
                      : "border border-border bg-muted text-muted-foreground"
                  }`}
                >
                  {isSelected ? <X className="w-3 h-3" /> : <Plus className="w-3 h-3" />}
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
