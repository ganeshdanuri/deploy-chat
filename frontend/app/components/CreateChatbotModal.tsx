"use client";

import { useState, useEffect } from "react";
import { HiDatabase, HiCheck, HiSparkles } from "react-icons/hi";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/lib/store/store";
import { fetchDatasets } from "@/lib/store/slices/datasetsSlice";
import { createChatbot } from "@/lib/store/slices/chatbotsSlice";
import Drawer from "./Drawer";
import showToast from "@/lib/toast";
import { Button, Input, Checkbox, Card, CardBody } from "@heroui/react";

interface CreateChatbotModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function CreateChatbotModal({ isOpen, onClose }: CreateChatbotModalProps) {
    const [name, setName] = useState("");
    const [selectedDatasets, setSelectedDatasets] = useState<string[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const dispatch = useDispatch<AppDispatch>();
    const { items: datasets, status: dsStatus } = useSelector((state: RootState) => state.datasets);

    useEffect(() => {
        if (isOpen && dsStatus === 'idle') {
            dispatch(fetchDatasets());
        }
    }, [isOpen, dsStatus, dispatch]);

    const toggleDataset = (id: string) => {
        setSelectedDatasets(prev =>
            prev.includes(id)
                ? prev.filter(dsId => dsId !== id)
                : [...prev, id]
        );
    };

    const handleSubmit = async (e?: React.FormEvent) => {
        e?.preventDefault();
        if (!name || selectedDatasets.length === 0) return;

        setIsSubmitting(true);
        try {
            await dispatch(createChatbot({ name, dataset_ids: selectedDatasets })).unwrap();
            showToast.success(`Chatbot "${name}" created successfully!`);
            setName("");
            setSelectedDatasets([]);
            onClose();
        } catch (error: any) {
            showToast.error(error?.message || "Failed to create chatbot. Please try again.");
            console.error("Failed to create chatbot:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const footer = (
        <div className="flex gap-4 w-full">
            <Button
                variant="bordered"
                onPress={onClose}
                className="flex-1 font-medium rounded-2xl h-12"
            >
                Cancel
            </Button>
            <Button
                color="primary"
                onPress={() => handleSubmit()}
                isDisabled={isSubmitting || !name || selectedDatasets.length === 0}
                isLoading={isSubmitting}
                className="flex-[1.5] bg-slate-900 text-white font-semibold rounded-2xl h-12 shadow-xl"
            >
                {isSubmitting ? "Creating..." : "Launch Assistant"}
            </Button>
        </div>
    );

    return (
        <Drawer
            isOpen={isOpen}
            onClose={onClose}
            title="Deploy Assistant"
            subtitle="Build a new AI persona powered by your knowledge."
            icon={HiSparkles}
            iconBgColor="bg-indigo-50"
            iconColor="text-indigo-600"
            footer={footer}
        >
            <div className="space-y-8">
                {/* Chatbot Name */}
                <div className="space-y-3">
                    <label htmlFor="name" className="block text-sm font-medium text-slate-700">
                        Assistant Name
                    </label>
                    <p className="text-xs text-slate-400">Give your AI a name that reflects its purpose.</p>
                    <Input
                        type="text"
                        variant="bordered"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g. Customer Support Bot"
                        classNames={{
                            inputWrapper: "rounded-2xl border-slate-200 h-12",
                            input: "font-medium text-sm"
                        }}
                    />
                </div>

                {/* Dataset Selection */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <label className="block text-sm font-medium text-slate-700">
                            Attach Knowledge
                        </label>
                        <span className="text-[11px] font-medium text-slate-400 uppercase bg-slate-100 px-2 py-0.5 rounded-full">
                            {selectedDatasets.length} datasets
                        </span>
                    </div>

                    <div className="space-y-3">
                        {datasets.length === 0 ? (
                            <div className="p-12 text-center bg-slate-50 rounded-[2rem] border border-dashed border-slate-200">
                                <HiDatabase className="w-10 h-10 text-slate-200 mx-auto mb-3" />
                                <p className="text-sm text-slate-500 font-medium leading-relaxed">No datasets available.<br />Create a dataset first.</p>
                            </div>
                        ) : (
                            datasets.map((ds) => (
                                <Card
                                    key={ds.id}
                                    isPressable
                                    onPress={() => toggleDataset(ds.id)}
                                    className={`
                                        border-1 transition-all duration-300 rounded-2xl shadow-none
                                        ${selectedDatasets.includes(ds.id)
                                            ? 'bg-indigo-50/70 border-indigo-200'
                                            : 'bg-white border-slate-100 hover:border-indigo-100 hover:bg-indigo-50/20'}
                                    `}
                                >
                                    <CardBody className="flex flex-row items-center justify-between p-4">
                                        <div className="flex items-center gap-4">
                                            <div className={`
                                                w-10 h-10 rounded-xl flex items-center justify-center border transition-all duration-500
                                                ${selectedDatasets.includes(ds.id)
                                                    ? 'bg-indigo-600 border-indigo-600 text-white shadow-md'
                                                    : 'bg-slate-50 border-slate-200 text-slate-400'}
                                            `}>
                                                {selectedDatasets.includes(ds.id) ? <HiCheck className="w-6 h-6" /> : <HiDatabase className="w-5 h-5" />}
                                            </div>
                                            <div>
                                                <p className={`text-sm font-medium transition-colors ${selectedDatasets.includes(ds.id) ? 'text-indigo-900' : 'text-slate-600'}`}>
                                                    {ds.name}
                                                </p>
                                                <p className="text-[10px] text-slate-400 uppercase tracking-tight">Dataset Collection</p>
                                            </div>
                                        </div>
                                        <div className={`
                                            w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-500
                                            ${selectedDatasets.includes(ds.id)
                                                ? 'bg-indigo-600 border-indigo-600'
                                                : 'bg-white border-slate-200'}
                                        `}>
                                            {selectedDatasets.includes(ds.id) && <HiCheck className="w-3.5 h-3.5 text-white" />}
                                        </div>
                                    </CardBody>
                                </Card>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </Drawer>
    );
}
