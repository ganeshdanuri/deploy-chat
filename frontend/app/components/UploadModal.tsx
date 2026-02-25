/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { HiCloudUpload, HiCheckCircle, HiExclamationCircle, HiLightningBolt, HiX, HiDocumentText } from "react-icons/hi";
import api from "@/lib/api";
import Modal from "./Modal";
import showToast from "@/lib/toast";
import { Button, Card, CardBody } from "@heroui/react";
import { ENDPOINTS } from "@/lib/endpoints";
import { theme } from "../theme";

interface UploadModalProps {
    isOpen: boolean;
    onClose: () => void;
    onUploadSuccess: () => void;
}

const MAX_SIZE_MB = 10;
const IDEAL_SIZE_MB = 5;

export default function UploadModal({ isOpen, onClose, onUploadSuccess }: UploadModalProps) {
    const [files, setFiles] = useState<File[]>([]);
    const [isUploading, setIsUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [uploadStatus, setUploadStatus] = useState<'idle' | 'success' | 'error'>('idle');

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const newFiles = Array.from(e.target.files);
            validateAndAddFiles(newFiles);
        }
    };

    const validateAndAddFiles = (newFiles: File[]) => {
        const validFiles: File[] = [];

        newFiles.forEach(file => {
            if (file.size > MAX_SIZE_MB * 1024 * 1024) {
                showToast.error(`File "${file.name}" exceeds ${MAX_SIZE_MB}MB limit`);
            } else {
                validFiles.push(file);
            }
        });

        if (validFiles.length > 0) {
            setFiles(prev => [...prev, ...validFiles]);
            setError(null);
            setUploadStatus('idle');
        }
    };

    const removeFile = (index: number) => {
        setFiles(prev => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e?: React.FormEvent) => {
        e?.preventDefault();
        if (files.length === 0) {
            showToast.error("Please select at least one file");
            return;
        }

        setIsUploading(true);
        setError(null);
        setUploadStatus('idle');

        const formData = new FormData();
        files.forEach(file => {
            formData.append("files", file);
        });

        try {
            await api.post(ENDPOINTS.DOCUMENTS.BASE, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            setUploadStatus('success');
            showToast.success(`${files.length} file(s) uploaded successfully!`);
            setTimeout(() => {
                onUploadSuccess();
                handleClose();
            }, 1000);
        } catch (err: any) {
            console.error("Upload failed.");
            const errorMessage = err.response?.data?.detail || "Failed to upload and convert documents";
            setError(errorMessage);
            setUploadStatus('error');
            showToast.error(errorMessage);
        } finally {
            setIsUploading(false);
        }
    };

    const handleClose = () => {
        setFiles([]);
        setError(null);
        setUploadStatus('idle');
        setIsUploading(false);
        onClose();
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={handleClose}
            title="Knowledge Ingestion"
            subtitle="Securely upload and convert documents for your AI."
            icon={HiCloudUpload}
            iconBgColor="bg-indigo-50"
            iconColor="text-indigo-600"
            maxWidth="lg"
        >
            <div className="space-y-6">
                <div
                    className={`relative border-2 border-dashed rounded-xl p-8 transition-all duration-500 text-center flex flex-col items-center justify-center 
                        ${files.length > 0
                            ? 'border-indigo-400 bg-indigo-50/30'
                            : 'border-slate-200 hover:border-indigo-300 hover:bg-slate-50/50 hover:scale-[1.01]'
                        }`}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => {
                        e.preventDefault();
                        if (e.dataTransfer.files) {
                            validateAndAddFiles(Array.from(e.dataTransfer.files));
                        }
                    }}
                >
                    <input
                        type="file"
                        multiple
                        onChange={handleFileChange}
                        className="text-sm absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        accept=".pdf,.docx,.doc,.txt,.pptx,.ppt,.xlsx,.xls,.csv,.md"
                    />
                    <div className="w-12 h-12 bg-white shadow-lg rounded-lg flex items-center justify-center mb-4 border border-slate-50">
                        <HiCloudUpload className="text-2xl text-indigo-600" />
                    </div>
                    <div className="space-y-1">
                        <p className="text-sm font-semibold text-slate-800">
                            {files.length > 0 ? `${files.length} file(s) selected` : "Drop documents here"}
                        </p>
                        <p className="text-[12px] text-slate-500 font-medium">
                            Max {MAX_SIZE_MB}MB per file. Ideal size: {IDEAL_SIZE_MB}MB.
                        </p>
                    </div>
                </div>

                {/* Selected Files List */}
                {files.length > 0 && (
                    <div className="max-h-40 overflow-y-auto space-y-2 pr-2">
                        {files.map((f, i) => (
                            <div key={i} className="flex items-center justify-between p-3 bg-white border border-slate-200 rounded-xl animate-scale-in">
                                <div className="flex items-center gap-3 overflow-hidden">
                                    <HiDocumentText className="text-indigo-500 w-5 h-5 shrink-0" />
                                    <div className="overflow-hidden">
                                        <p className="text-xs font-bold text-slate-700 truncate">{f.name}</p>
                                        <p className="text-[10px] text-slate-400">{(f.size / (1024 * 1024)).toFixed(2)} MB</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => removeFile(i)}
                                    className="p-1 hover:bg-red-50 text-slate-400 hover:text-red-500 rounded-lg transition-colors"
                                >
                                    <HiX className="w-4 h-4" />
                                </button>
                            </div>
                        ))}
                    </div>
                )}

                <Card className="bg-slate-50 rounded-xl shadow-none border border-slate-100">
                    <CardBody className="flex flex-row items-start gap-4 p-4">
                        <div className="w-9 h-9 rounded-lg bg-white border border-slate-200 flex items-center justify-center shrink-0 shadow-sm">
                            <HiLightningBolt className="w-4 h-4 text-amber-500" />
                        </div>
                        <div>
                            <h4 className="text-sm font-bold text-slate-700">Auto-Markdown Conversion</h4>
                            <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">System-wide RAG support with native markdown conversion.</p>
                        </div>
                    </CardBody>
                </Card>

                {error && (
                    <div className="flex items-center gap-3 p-3 rounded-xl bg-red-50 text-red-600 text-[11px] font-medium border border-red-100 animate-fade-in">
                        <HiExclamationCircle className="text-base flex-shrink-0" />
                        <span>{error}</span>
                    </div>
                )}

                {uploadStatus === 'success' && (
                    <div className="flex items-center gap-3 p-3 rounded-xl bg-emerald-50 text-emerald-600 text-[11px] font-medium border border-emerald-100 animate-fade-in">
                        <HiCheckCircle className="text-base flex-shrink-0" />
                        <span>Documents ingested successfully!</span>
                    </div>
                )}

                <div className="pt-2 flex gap-4">
                    <Button
                        variant="bordered"
                        onPress={handleClose}
                        className="flex-1 font-medium text-slate-600 border border-slate-200 bg-white rounded-lg h-11 transition-all hover:bg-slate-50 shadow-sm"
                    >
                        Cancel
                    </Button>
                    <Button
                        onPress={() => handleSubmit()}
                        isDisabled={files.length === 0 || isUploading}
                        isLoading={isUploading}
                        className="flex-[1.5] text-white text-[13px] font-medium rounded-lg h-11 shadow-lg shadow-indigo-500/20 transition-all hover:-translate-y-0.5"
                        style={{ backgroundColor: theme.colors.primary.main }}
                    >
                        {isUploading ? "Ingesting..." : `Import ${files.length > 1 ? `${files.length} Files` : "Document"}`}
                    </Button>
                </div>
            </div>
        </Modal>
    );
}
