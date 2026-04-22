import { Database, FileText, Folder, Pencil, Plus, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import type { Dataset } from "@/lib/types";
import { EmptyCard } from "./EmptyCard";

interface CollectionsTabProps {
  datasets: Dataset[];
  filteredDatasets: Dataset[];
  search: string;
  onCreate: () => void;
  onEdit: (ds: Dataset) => void;
  onDelete: (ds: Dataset) => void;
}

export function CollectionsTab({
  datasets,
  filteredDatasets,
  search,
  onCreate,
  onEdit,
  onDelete,
}: CollectionsTabProps) {
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
            <CollectionCard
              key={ds.id}
              dataset={ds}
              onEdit={onEdit}
              onDelete={onDelete}
            />
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

// ─── Collection card ──────────────────────────────────────────────────────────

interface CollectionCardProps {
  dataset: Dataset;
  onEdit: (ds: Dataset) => void;
  onDelete: (ds: Dataset) => void;
}

function CollectionCard({ dataset, onEdit, onDelete }: CollectionCardProps) {
  return (
    <div className="dash-card bg-background border border-border p-5 hover:border-border-medium hover:shadow-md transition-all group relative flex flex-col gap-3">
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
            onClick={() => onEdit(dataset)}
            className="text-muted-foreground hover:text-foreground"
            title="Edit collection"
          >
            <Pencil className="w-3.5 h-3.5" strokeWidth={1.75} />
          </Button>
          <Button
            size="icon-sm"
            variant="ghost"
            onClick={() => onDelete(dataset)}
            className="text-muted-foreground hover:text-destructive"
            title="Delete collection"
          >
            <Trash2 className="w-3.5 h-3.5" strokeWidth={1.75} />
          </Button>
        </div>
      </div>

      {/* Name */}
      <div className="text-[15px] font-semibold text-foreground truncate tracking-[-0.01em]">
        {dataset.name}
      </div>

      {/* File count + date */}
      <div className="flex items-center justify-between mt-auto pt-1 border-t border-border">
        <span className="flex items-center gap-1.5 text-[12px] text-muted-foreground">
          <FileText className="w-3.5 h-3.5" strokeWidth={1.75} />
          {dataset.document_count ?? 0}{" "}
          {(dataset.document_count ?? 0) === 1 ? "file" : "files"}
        </span>
        <span className="text-[11px] text-muted-foreground">
          {new Date(dataset.created_at).toLocaleDateString(undefined, {
            month: "short",
            day: "numeric",
          })}
        </span>
      </div>
    </div>
  );
}
