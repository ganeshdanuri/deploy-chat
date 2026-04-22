"use client";

import { useState } from "react";
import { RefreshCw, Trash2 } from "lucide-react";

import { useAppDispatch } from "@/lib/store/hooks";
import { deleteDocument } from "@/lib/store/slices/documentsSlice";
import showToast from "@/lib/toast";
import { Button } from "@/components/ui/button";
import {
  DeleteConfirmationModal,
  TableSkeleton,
  StyledTable,
} from "@/app/components/ui";
import type { TableColumnDef } from "@/app/components/ui";
import { getFileIcon } from "@/lib/file-utils";
import type { Document } from "@/lib/types";

const FILE_COLUMNS: TableColumnDef[] = [
  { key: "name",    label: "File" },
  { key: "source",  label: "Source" },
  { key: "date",    label: "Indexed on" },
  { key: "status",  label: "Status",  align: "center" },
  { key: "actions", label: "",        align: "end" },
];

interface FilesTabProps {
  isLoading: boolean;
  documents: Document[];
  filteredDocs: Document[];
  search: string;
  onRefresh: () => void;
  onDelete: (doc: Document) => void;
}

export function FilesTab({
  isLoading,
  documents,
  filteredDocs,
  search,
  onRefresh,
  onDelete,
}: FilesTabProps) {
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
            {new Date(doc.created_at).toLocaleDateString(undefined, {
              year: "numeric",
              month: "short",
              day: "numeric",
            })}
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
            onClick={(e) => {
              e.stopPropagation();
              setPendingDelete(doc);
            }}
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
