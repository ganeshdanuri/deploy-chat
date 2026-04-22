"use client";

import { useEffect, useState } from "react";
import { X, Search, FileText, Plus, Save, CheckCheck } from "lucide-react";

import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { updateDataset } from "@/lib/store/slices/datasetsSlice";
import showToast from "@/lib/toast";
import { Button } from "@/components/ui/button";
import { getFileIcon } from "@/lib/file-utils";
import Drawer from "./Drawer";
import type { Dataset, Document } from "@/lib/types";

type FilterTab = "all" | "selected" | "unselected";

interface EditKnowledgeBaseDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  dataset: Dataset | null;
}

export default function EditKnowledgeBaseDrawer({
  isOpen,
  onClose,
  dataset,
}: EditKnowledgeBaseDrawerProps) {
  const dispatch = useAppDispatch();
  const { items: allDocuments } = useAppSelector((s) => s.documents);

  const [name, setName] = useState("");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [search, setSearch] = useState("");
  const [tab, setTab] = useState<FilterTab>("all");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (dataset) {
      setName(dataset.name);
      setSelectedIds(new Set(dataset.document_ids ?? []));
      setSearch("");
      setTab("all");
    }
  }, [dataset]);

  const handleSave = async () => {
    if (!dataset) return;
    setIsSaving(true);
    try {
      await dispatch(
        updateDataset({
          id: dataset.id,
          name: name.trim() || dataset.name,
          document_ids: [...selectedIds],
        })
      ).unwrap();
      showToast.success("Collection updated");
      onClose();
    } catch {
      showToast.error("Failed to update collection");
    } finally {
      setIsSaving(false);
    }
  };

  const toggle = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const q = search.toLowerCase();
  const searched = allDocuments.filter((d) => d.name.toLowerCase().includes(q));
  const filtered =
    tab === "selected"
      ? searched.filter((d) => selectedIds.has(d.id))
      : tab === "unselected"
      ? searched.filter((d) => !selectedIds.has(d.id))
      : searched;

  const canSelectAll = search && filtered.some((d) => !selectedIds.has(d.id));
  const handleSelectAll = () => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      filtered.forEach((d) => next.add(d.id));
      return next;
    });
  };

  const selectedDocs = allDocuments.filter((d) => selectedIds.has(d.id));

  const footer = (
    <>
      <button
        onClick={onClose}
        className="text-[13px] font-medium text-muted-foreground hover:text-foreground transition-colors"
      >
        Cancel
      </button>
      <Button onClick={handleSave} disabled={isSaving} className="rounded-xl">
        {isSaving ? (
          <span className="flex items-center gap-2">
            <span className="w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin" />
            Saving…
          </span>
        ) : (
          <span className="flex items-center gap-2">
            <Save className="w-3.5 h-3.5" />
            Save changes
          </span>
        )}
      </Button>
    </>
  );

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      title="Edit collection"
      subtitle={`${selectedIds.size} of ${allDocuments.length} ${allDocuments.length === 1 ? "file" : "files"} selected`}
      footer={footer}
    >
      <div className="space-y-4">
        {/* Collection name */}
        <div className="space-y-1.5">
          <label className="text-[12px] font-semibold text-muted-foreground">Collection name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full h-9 px-3 text-[13px] font-medium text-foreground bg-muted rounded-xl border border-transparent focus:outline-none focus:bg-background focus:border-border transition-all"
            placeholder="e.g. Product docs"
          />
        </div>

        {/* Selected chips */}
        {selectedDocs.length > 0 && (
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-[12px] font-semibold text-muted-foreground">Selected files</label>
              <button
                onClick={() => setSelectedIds(new Set())}
                className="text-[11px] text-muted-foreground hover:text-foreground transition-colors"
              >
                Clear all
              </button>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {selectedDocs.map((doc) => {
                const { Icon, color } = getFileIcon(doc.name);
                return (
                  <span
                    key={doc.id}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-muted border border-border rounded-full text-[12px] font-medium text-foreground max-w-[180px]"
                  >
                    <Icon size={11} strokeWidth={2} style={{ color, flexShrink: 0 }} />
                    <span className="truncate">{doc.name}</span>
                    <button
                      onClick={() => toggle(doc.id)}
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
            placeholder={`Search ${allDocuments.length} files…`}
            className="w-full h-9 pl-9 pr-3 text-[13px] bg-muted rounded-xl border border-transparent focus:outline-none focus:bg-background focus:border-border transition-all"
          />
        </div>

        {/* Filter tabs + select-all */}
        <div className="flex items-center justify-between">
          <div className="flex gap-1 p-1 bg-muted rounded-xl">
            {(["all", "selected", "unselected"] as FilterTab[]).map((t) => {
              const count =
                t === "all"
                  ? allDocuments.length
                  : t === "selected"
                  ? selectedIds.size
                  : allDocuments.length - selectedIds.size;
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
              onClick={handleSelectAll}
              className="flex items-center gap-1.5 text-[12px] font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              <CheckCheck className="w-3.5 h-3.5" />
              Select all {filtered.length}
            </button>
          )}
        </div>

        {/* File list */}
        <div className="space-y-1">
          {filtered.length === 0 ? (
            <div className="py-10 text-center">
              <FileText className="w-8 h-8 text-muted-foreground/40 mx-auto mb-2" strokeWidth={1.5} />
              <p className="text-[13px] text-muted-foreground">
                {allDocuments.length === 0
                  ? "No files uploaded yet"
                  : search
                  ? `No files match "${search}"`
                  : tab === "selected"
                  ? "No files selected yet"
                  : "All files are already selected"}
              </p>
            </div>
          ) : (
            filtered.map((doc) => (
              <FileRow
                key={doc.id}
                doc={doc}
                selected={selectedIds.has(doc.id)}
                onToggle={() => toggle(doc.id)}
              />
            ))
          )}
        </div>
      </div>
    </Drawer>
  );
}

// ─── File row ─────────────────────────────────────────────────────────────────

function FileRow({
  doc,
  selected,
  onToggle,
}: {
  doc: Document;
  selected: boolean;
  onToggle: () => void;
}) {
  const { Icon, color, bg } = getFileIcon(doc.name);
  return (
    <button
      onClick={onToggle}
      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all ${
        selected ? "bg-foreground/5 border border-border" : "hover:bg-muted border border-transparent"
      }`}
    >
      <div
        className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
        style={{ background: bg, color }}
      >
        <Icon size={14} strokeWidth={1.75} />
      </div>
      <span className="flex-1 text-[13px] font-medium text-foreground truncate">{doc.name}</span>
      <div
        className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 transition-all ${
          selected ? "bg-foreground text-background" : "border border-border bg-muted text-muted-foreground"
        }`}
      >
        {selected ? <X className="w-3 h-3" /> : <Plus className="w-3 h-3" />}
      </div>
    </button>
  );
}
