/* eslint-disable @typescript-eslint/no-explicit-any, react/no-unescaped-entities */
"use client";

import { useState } from "react";
import { HiCloudUpload, HiCheckCircle, HiExclamationCircle, HiLightningBolt } from "react-icons/hi";
import api from "@/lib/api";
import Modal from "./Modal";
import showToast from "@/lib/toast";
import { Button, Card, CardBody } from "@heroui/react";
import { ENDPOINTS } from "@/lib/endpoints";

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

    const handleSubmit = async (e?: React.FormEvent) => {
        e?.preventDefault();
        if (!file) {
            showToast.error("Please select a file first");
            return;
        }

        setIsUploading(true);
        setError(null);
        setUploadStatus('idle');

        const formData = new FormData();
        formData.append("file", file);

        try {
            await api.post(ENDPOINTS.DOCUMENTS.BASE, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            setUploadStatus('success');
            showToast.success(`Document "${file.name}" uploaded successfully!`);
            setTimeout(() => {
                onUploadSuccess();
                handleClose();
            }, 1000);
        } catch (err: any) {
            console.error("Upload failed:", err);
            const errorMessage = err.response?.data?.detail || "Failed to upload and convert document";
            setError(errorMessage);
            setUploadStatus('error');
            showToast.error(errorMessage);
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
            <div className="space-y-8">
                <div
                    className={`relative border-2 border-dashed rounded-[2.5rem] p-10 transition-all duration-500 text-center flex flex-col items-center justify-center 
                        ${file
                            ? 'border-indigo-400 bg-indigo-50/30'
                            : 'border-slate-200 hover:border-indigo-300 hover:bg-slate-50/50 hover:scale-[1.01]'
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
                        className="text-sm absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        accept=".pdf,.docx,.doc,.txt,.pptx,.ppt,.xlsx,.xls,.csv,.md"
                    />
                    <div className="w-16 h-16 bg-white shadow-xl rounded-2xl flex items-center justify-center mb-6 border border-slate-50">
                        <HiCloudUpload className="text-3xl text-indigo-600" />
                    </div>
                    <div className="space-y-2">
                        <p className="text-sm font-medium text-slate-800">
                            {file ? file.name : "Drop document here"}
                        </p>
                        <p className="text-[13px] text-slate-500 font-medium">
                            or click to browse files
                        </p>
                    </div>
                </div>

                <Card className="bg-slate-50 rounded-3xl shadow-none border border-slate-100">
                    <CardBody className="flex flex-row items-start gap-4 p-5">
                        <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center shrink-0 shadow-sm">
                            <HiLightningBolt className="w-5 h-5 text-amber-500" />
                        </div>
                        <div>
                            <h4 className="text-lg font-medium text-slate-700">Auto-Markdown Conversion</h4>
                            <p className="text-xs text-slate-500 mt-1 leading-relaxed">We'll automatically extract text and structure from your document to make it queryable.</p>
                        </div>
                    </CardBody>
                </Card>

                {error && (
                    <div className="flex items-center gap-3 p-4 rounded-2xl bg-red-50 text-red-600 text-xs font-medium border border-red-100 animate-fade-in">
                        <HiExclamationCircle className="text-lg flex-shrink-0" />
                        <span>{error}</span>
                    </div>
                )}

                {uploadStatus === 'success' && (
                    <div className="flex items-center gap-3 p-4 rounded-2xl bg-emerald-50 text-emerald-600 text-xs font-medium border border-emerald-100 animate-fade-in">
                        <HiCheckCircle className="text-lg flex-shrink-0" />
                        <span>Document ingested successfully!</span>
                    </div>
                )}

                <div className="pt-4 flex gap-4">
                    <Button
                        variant="bordered"
                        onPress={handleClose}
                        className="flex-1 font-medium rounded-2xl h-12"
                    >
                        Cancel
                    </Button>
                    <Button
                        color="primary"
                        onPress={() => handleSubmit()}
                        isDisabled={!file || isUploading}
                        isLoading={isUploading}
                        className="flex-[1.5] bg-indigo-600 text-white text-sm font-medium rounded-2xl h-12 shadow-xl shadow-indigo-200"
                    >
                        {isUploading ? "Converting..." : "Import Document"}
                    </Button>
                </div>
            </div>
        </Modal>
    );
}
