"use client";

import { AlertCircle, CheckCircle2, FileText, Upload, X } from "lucide-react";
/* eslint-disable @typescript-eslint/no-explicit-any */

import { useState } from "react";

import api from "@/lib/api";
import Drawer from "./Drawer";
import showToast from "@/lib/toast";
import { Button } from "@/components/ui/button";
import { ENDPOINTS } from "@/lib/endpoints";

interface UploadFilesDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onUploadSuccess: () => void;
}

const MAX_SIZE_MB = 10;

export default function UploadFilesDrawer({
  isOpen,
  onClose,
  onUploadSuccess,
}: UploadFilesDrawerProps) {
  const [files, setFiles] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadStatus, setUploadStatus] = useState<"idle" | "success" | "error">("idle");

  const validateAndAddFiles = (incoming: File[]) => {
    const valid: File[] = [];
    incoming.forEach((file) => {
      if (file.size > MAX_SIZE_MB * 1024 * 1024) {
        showToast.error(`File "${file.name}" exceeds ${MAX_SIZE_MB}MB limit`);
      } else {
        valid.push(file);
      }
    });
    if (valid.length > 0) {
      setFiles((prev) => [...prev, ...valid]);
      setError(null);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) validateAndAddFiles(Array.from(e.target.files));
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (files.length === 0) return;
    setIsUploading(true);
    setError(null);
    const formData = new FormData();
    files.forEach((file) => formData.append("files", file));
    try {
      await api.post(ENDPOINTS.DOCUMENTS.BASE, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setUploadStatus("success");
      showToast.success(`${files.length} file(s) imported!`);
      setTimeout(() => {
        onUploadSuccess();
        handleClose();
      }, 1000);
    } catch (err: any) {
      const msg = err.response?.data?.detail || "Import failed";
      setError(msg);
      setUploadStatus("error");
    } finally {
      setIsUploading(false);
    }
  };

  const handleClose = () => {
    setFiles([]);
    setError(null);
    setUploadStatus("idle");
    onClose();
  };

  const footer = (
    <>
      <button
        onClick={handleClose}
        className="text-[13px] font-medium text-muted-foreground hover:text-foreground transition-colors"
      >
        Cancel
      </button>
      <Button
        onClick={handleSubmit}
        disabled={files.length === 0 || isUploading}
        className="rounded-xl"
      >
        {isUploading ? (
          <span className="flex items-center gap-2">
            <span className="w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin" />
            Importing…
          </span>
        ) : (
          `Import ${files.length} file${files.length !== 1 ? "s" : ""}`
        )}
      </Button>
    </>
  );

  return (
    <Drawer
      isOpen={isOpen}
      onClose={handleClose}
      title="Import Sources"
      subtitle="Securely upload documents for your knowledge base."
      icon={Upload}
      footer={footer}
      size="2xl"
    >
      <div className="space-y-8 animate-fade-in">
        {/* Drop zone */}
        <div
          className={`relative border-2 border-dashed rounded-xl p-8 text-center flex flex-col items-center justify-center transition-all ${
            files.length > 0
              ? "border-primary/30 bg-muted/60"
              : "border-border hover:border-border-medium hover:bg-muted/40"
          }`}
        >
          <input
            type="file"
            multiple
            onChange={handleFileChange}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
          <div className="w-14 h-14 bg-muted rounded-xl flex items-center justify-center mb-4">
            <Upload className="w-6 h-6 text-muted-foreground" />
          </div>
          <p className="text-sm font-medium text-foreground">Drop source files here</p>
          <p className="text-[11px] text-muted-foreground mt-1">Max {MAX_SIZE_MB}MB per file.</p>
        </div>

        {/* File queue */}
        {files.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="text-[11px] font-medium uppercase text-muted-foreground">Queue</h4>
              <span className="text-[10px] font-medium text-muted-foreground bg-muted rounded px-2 py-0.5">
                {files.length}
              </span>
            </div>
            <div className="max-h-60 overflow-y-auto space-y-2 pr-2">
              {files.map((f, i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <div className="flex items-center gap-3 overflow-hidden">
                    <FileText className="text-muted-foreground w-5 h-5 shrink-0" />
                    <p className="text-xs font-medium text-foreground truncate">{f.name}</p>
                  </div>
                  <button
                    onClick={() => removeFile(i)}
                    className="text-muted-foreground hover:text-destructive transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Status messages */}
        {error && (
          <div className="p-4 bg-destructive/5 text-destructive text-[11px] font-medium border border-destructive/15 rounded-lg flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            {error}
          </div>
        )}
        {uploadStatus === "success" && (
          <div className="p-4 bg-emerald-50 text-emerald-700 text-[11px] font-medium border border-emerald-100 rounded-lg flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            Imported successfully!
          </div>
        )}
      </div>
    </Drawer>
  );
}
