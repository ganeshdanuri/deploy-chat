/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { HiCloudUpload, HiCheckCircle, HiExclamationCircle,  HiX, HiDocumentText } from "react-icons/hi";
import api from "@/lib/api";
import Drawer from "./Drawer";
import showToast from "@/lib/toast";
import { Button } from "@/components/ui/button";
import { ENDPOINTS } from "@/lib/endpoints";

interface UploadSourceFilesDrawerProps {
    isOpen: boolean;
    onClose: () => void;
    onUploadSuccess: () => void;
}

const MAX_SIZE_MB = 10;

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
        }
    };

    const removeFile = (index: number) => {
        setFiles(prev => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = async () => {
        if (files.length === 0) return;
        setIsUploading(true);
        setError(null);
        const formData = new FormData();
        files.forEach(file => formData.append("files", file));
        try {
            await api.post(ENDPOINTS.DOCUMENTS.BASE, formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            setUploadStatus('success');
            showToast.success(`${files.length} file(s) imported!`);
            setTimeout(() => {
                onUploadSuccess();
                handleClose();
            }, 1000);
        } catch (err: any) {
            const msg = err.response?.data?.detail || "Import failed";
            setError(msg);
            setUploadStatus('error');
        } finally {
            setIsUploading(false);
        }
    };

    const handleClose = () => {
        setFiles([]);
        setError(null);
        setUploadStatus('idle');
        onClose();
    };

    const footer = (
        <>
            <Button variant="outline" onClick={handleClose} className="font-medium bg-white h-10 px-6 border border-[#e3e2e5] text-[#5a5a6a] shadow-sm transition-all hover:bg-[#f3f3f9]">
                Cancel
            </Button>
            <Button
                onClick={handleSubmit}
                disabled={files.length === 0 || isUploading}
                className="text-white font-bold h-10 px-8 shadow-lg shadow-[#262ef2]/10 transition-all"
                style={{ backgroundColor: "#262ef2" }}
            >
                {isUploading ? "Importing..." : `Import ${files.length} Files`}
            </Button>
        </>
    );

    return (
        <Drawer
            isOpen={isOpen}
            onClose={handleClose}
            title="Import Sources"
            subtitle="Securely upload documents for your knowledge base."
            icon={HiCloudUpload}
            footer={footer}
            size="2xl"
        >
            <div className="space-y-8 animate-fade-in">
                <div className={`relative border-2 border-dashed p-8 text-center flex flex-col items-center justify-center transition-all ${files.length > 0 ? 'border-[#262ef2]/50 bg-[#262ef2]/5' : 'border-[#e3e2e5] hover:border-[#262ef2]/30'}`}>
                    <input type="file" multiple onChange={handleFileChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                    <div className="w-14 h-14 bg-white flex items-center justify-center mb-4 border border-[#e3e2e5] shadow-sm"><HiCloudUpload className="text-3xl text-[#262ef2]" /></div>
                    <p className="text-sm font-bold text-[#201f32]">Drop source files here</p>
                    <p className="text-[11px] text-[#5a5a6a] mt-1">Max {MAX_SIZE_MB}MB per file.</p>
                </div>

                {files.length > 0 && (
                    <div className="space-y-2">
                        <div className="flex items-center justify-between"><h4 className="text-[11px] font-black uppercase text-[#a1a1a1]">Queue</h4><span className="text-[10px] font-bold text-[#5a5a6a] bg-[#f3f3f9] px-2 py-0.5">{files.length}</span></div>
                        <div className="max-h-60 overflow-y-auto space-y-2 pr-2">
                            {files.map((f, i) => (
                                <div key={i} className="flex items-center justify-between p-3 bg-white border border-[#e3e2e5]">
                                    <div className="flex items-center gap-3 overflow-hidden">
                                        <HiDocumentText className="text-[#a1a1a1] w-5 h-5 shrink-0" />
                                        <div className="overflow-hidden"><p className="text-xs font-bold text-[#5a5a6a] truncate">{f.name}</p></div>
                                    </div>
                                    <button onClick={() => removeFile(i)} className="text-[#a1a1a1] hover:text-red-500"><HiX className="w-4 h-4" /></button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {error && <div className="p-4 bg-red-50/50 text-red-600 text-[11px] font-bold border border-red-100"><HiExclamationCircle className="inline mr-2" />{error}</div>}
                {uploadStatus === 'success' && <div className="p-4 bg-emerald-50/50 text-emerald-600 text-[11px] font-bold border border-emerald-100"><HiCheckCircle className="inline mr-2" />Imported!</div>}
            </div>
        </Drawer>
    );
}
