/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { HiCloudUpload, HiCheckCircle, HiExclamationCircle, HiLightningBolt, HiX, HiDocumentText } from "react-icons/hi";
import api from "@/lib/api";
import Drawer from "./Drawer";
import showToast from "@/lib/toast";
import { Button, Card, CardBody } from "@heroui/react";
import { ENDPOINTS } from "@/lib/endpoints";
import { theme } from "../theme";

interface UploadSourceFilesDrawerProps {
    isOpen: boolean;
    onClose: () => void;
    onUploadSuccess: () => void;
}

const MAX_SIZE_MB = 10;
const IDEAL_SIZE_MB = 5;

export default function UploadSourceFilesDrawer({ isOpen, onClose, onUploadSuccess }: UploadSourceFilesDrawerProps) {
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

    const footer = (
        <div className="flex gap-4 w-full">
            <Button
                variant="bordered"
                onPress={handleClose}
                className="flex-1 font-medium text-slate-600 border border-slate-100 bg-white rounded-lg h-12 transition-all hover:bg-slate-50 shadow-sm"
            >
                Cancel
            </Button>
            <Button
                onPress={() => handleSubmit()}
                isDisabled={files.length === 0 || isUploading}
                isLoading={isUploading}
                className="flex-[1.5] text-white text-[13px] font-bold rounded-lg h-12 shadow-lg shadow-indigo-500/20 transition-all hover:-translate-y-0.5"
                style={{ backgroundColor: theme.colors.primary.main }}
            >
                {isUploading ? "Ingesting..." : `Import ${files.length > 1 ? `${files.length} Files` : "Source File"}`}
            </Button>
        </div>
    );

    return (
        <Drawer
            isOpen={isOpen}
            onClose={handleClose}
            title="Import Sources"
            subtitle="Securely upload and convert documents for your knowledge base."
            icon={HiCloudUpload}
            iconBgColor="bg-indigo-50"
            iconColor="text-indigo-600"
            footer={footer}
        >
            <div className="space-y-8 animate-fade-in">
                <div
                    className={`relative border-2 border-dashed rounded-xl p-8 transition-all duration-300 text-center flex flex-col items-center justify-center 
                        ${files.length > 0
                            ? 'border-indigo-400 bg-indigo-50/30'
                            : 'border-slate-100 hover:border-indigo-300 hover:bg-slate-50/50'
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
                    <div className="w-14 h-14 bg-white shadow-sm rounded-xl flex items-center justify-center mb-4 border border-slate-50 group-hover:scale-110 transition-transform">
                        <HiCloudUpload className="text-3xl text-indigo-600" />
                    </div>
                    <div className="space-y-1">
                        <p className="text-sm font-bold text-slate-800">
                            {files.length > 0 ? `${files.length} file(s) selected` : "Drop source files here"}
                        </p>
                        <p className="text-[11px] text-slate-500 font-medium">
                            Max {MAX_SIZE_MB}MB per file. Sub-second indexing.
                        </p>
                    </div>
                </div>

                {/* Selected Files List */}
                {files.length > 0 && (
                    <div className="space-y-2">
                        <div className="flex items-center justify-between mb-2">
                            <h4 className="text-[11px] font-black uppercase tracking-wider text-slate-400">Queue</h4>
                            <span className="text-[10px] font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-full">{files.length} files</span>
                        </div>
                        <div className="max-h-60 overflow-y-auto space-y-2 pr-2 custom-scrollbar">
                            {files.map((f, i) => (
                                <div key={i} className="flex items-center justify-between p-3 bg-white border border-slate-100 rounded-xl animate-scale-in">
                                    <div className="flex items-center gap-3 overflow-hidden">
                                        <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center shrink-0">
                                            <HiDocumentText className="text-slate-400 w-5 h-5 shrink-0" />
                                        </div>
                                        <div className="overflow-hidden">
                                            <p className="text-xs font-bold text-slate-700 truncate">{f.name}</p>
                                            <p className="text-[10px] text-slate-400 font-medium">{(f.size / (1024 * 1024)).toFixed(2)} MB</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => removeFile(i)}
                                        className="p-1.5 hover:bg-red-50 text-slate-400 hover:text-red-500 rounded-lg transition-colors"
                                    >
                                        <HiX className="w-4 h-4" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                <Card className="bg-slate-50/50 rounded-2xl shadow-none border border-slate-100 mt-auto">
                    <CardBody className="flex flex-row items-center gap-4 p-5">
                        <div className="w-10 h-10 rounded-xl bg-white border border-slate-100 flex items-center justify-center shrink-0 shadow-sm">
                            <HiLightningBolt className="w-5 h-5 text-amber-500" />
                        </div>
                        <div>
                            <h4 className="text-[13px] font-bold text-slate-700">Enterprise RAG Support</h4>
                            <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">System-wide knowledge sync with native markdown parsing.</p>
                        </div>
                    </CardBody>
                </Card>

                {error && (
                    <div className="flex items-center gap-3 p-4 rounded-xl bg-red-50 text-red-600 text-[11px] font-bold border border-red-100 animate-fade-in shadow-sm">
                        <HiExclamationCircle className="text-lg flex-shrink-0" />
                        <span>{error}</span>
                    </div>
                )}

                {uploadStatus === 'success' && (
                    <div className="flex items-center gap-3 p-4 rounded-xl bg-emerald-50 text-emerald-600 text-[11px] font-bold border border-emerald-100 animate-fade-in shadow-sm">
                        <HiCheckCircle className="text-lg flex-shrink-0" />
                        <span>Sources imported successfully!</span>
                    </div>
                )}
            </div>
        </Drawer>
    );
}
