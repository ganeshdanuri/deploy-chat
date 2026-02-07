"use client";

import { useState } from "react";
import { HiX, HiCloudUpload, HiCheckCircle, HiExclamationCircle } from "react-icons/hi";
import { theme } from "../theme";
import api from "@/lib/api";

interface UploadModalProps {
    isOpen: boolean;
    onClose: () => void;
    onUploadSuccess: () => void;
}

export default function UploadModal({ isOpen, onClose, onUploadSuccess }: UploadModalProps) {
    const [file, setFile] = useState<File | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [uploadStatus, setUploadStatus] = useState<'idle' | 'success' | 'error'>('idle');

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
            setError(null);
            setUploadStatus('idle');
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!file) {
            setError("Please select a file first");
            return;
        }

        setIsUploading(true);
        setError(null);
        setUploadStatus('idle');

        const formData = new FormData();
        formData.append("file", file);

        try {
            await api.post("/api/documents/", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            setUploadStatus('success');
            setTimeout(() => {
                onUploadSuccess();
                handleClose();
            }, 1500);
        } catch (err: any) {
            console.error("Upload failed:", err);
            setError(err.response?.data?.detail || "Failed to upload and convert document");
            setUploadStatus('error');
        } finally {
            setIsUploading(false);
        }
    };

    const handleClose = () => {
        setFile(null);
        setError(null);
        setUploadStatus('idle');
        setIsUploading(false);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 backdrop-blur-md"
            style={{ backgroundColor: "rgba(15, 23, 42, 0.6)" }}
            onClick={handleClose}
        >
            <div
                className="w-full max-w-md rounded-2xl bg-white p-8 relative"
                style={{ boxShadow: theme.shadows.xl }}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Close Button */}
                <button
                    onClick={handleClose}
                    className="absolute top-4 right-4 p-1 transition-colors hover:bg-gray-100 rounded-full"
                    style={{ color: theme.colors.neutral[400] }}
                >
                    <HiX className="text-2xl" />
                </button>

                <div className="mb-6 text-center">
                    <h2 className="text-xl font-semibold" style={{ color: theme.colors.neutral[900] }}>
                        Upload Document
                    </h2>
                    <p className="mt-1 text-sm text-gray-500">
                        Convert PDF, Word, PPT or Excel to Markdown
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div
                        className={`relative border-2 border-dashed rounded-xl p-8 transition-colors text-center ${file ? 'border-primary-main bg-primary-lightest' : 'border-gray-200 hover:border-gray-300'
                            }`}
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={(e) => {
                            e.preventDefault();
                            if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                                setFile(e.dataTransfer.files[0]);
                            }
                        }}
                    >
                        <input
                            type="file"
                            onChange={handleFileChange}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            accept=".pdf,.docx,.doc,.txt,.pptx,.ppt,.xlsx,.xls"
                        />
                        <div className="flex flex-col items-center">
                            <HiCloudUpload className="text-4xl mb-2" style={{ color: theme.colors.primary.main }} />
                            <p className="text-sm font-medium" style={{ color: theme.colors.neutral[700] }}>
                                {file ? file.name : "Click or drag to upload"}
                            </p>
                            <p className="text-xs text-gray-400 mt-1">
                                MAX 10MB (PDF, DOCX, PPTX, XLSX, TXT)
                            </p>
                        </div>
                    </div>

                    {error && (
                        <div className="flex items-center gap-2 p-3 rounded-lg bg-red-50 text-red-600 text-sm">
                            <HiExclamationCircle className="text-lg flex-shrink-0" />
                            <span>{error}</span>
                        </div>
                    )}

                    {uploadStatus === 'success' && (
                        <div className="flex items-center gap-2 p-3 rounded-lg bg-green-50 text-green-600 text-sm">
                            <HiCheckCircle className="text-lg flex-shrink-0" />
                            <span>Uploaded and converted successfully!</span>
                        </div>
                    )}

                    <div className="flex gap-3">
                        <button
                            type="button"
                            onClick={handleClose}
                            className="flex-1 px-4 py-2 text-sm font-medium border rounded-lg transition-colors hover:bg-gray-50"
                            style={{ borderColor: theme.colors.neutral[200], color: theme.colors.neutral[700] }}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={!file || isUploading}
                            className="flex-1 px-4 py-2 text-sm font-medium text-white rounded-lg transition-all hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            style={{ background: theme.gradients.primaryButton }}
                        >
                            {isUploading ? (
                                <>
                                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                    Converting...
                                </>
                            ) : (
                                "Upload & Convert"
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
