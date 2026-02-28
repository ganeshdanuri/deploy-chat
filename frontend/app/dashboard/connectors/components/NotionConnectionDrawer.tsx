"use client";

import { useState } from "react";
import { HiCheckCircle, HiInformationCircle } from "react-icons/hi";
import api from "@/lib/api";
import { ENDPOINTS } from "@/lib/endpoints";
import showToast from "@/lib/toast";
import Drawer from "@/app/components/Drawer";
import { Button } from "@heroui/react";

interface NotionConnectionDrawerProps {
    isOpen: boolean;
    onClose: () => void;
    onConnected: (connector: any) => void;
}

export function NotionConnectionDrawer({ isOpen, onClose, onConnected }: NotionConnectionDrawerProps) {
    const [step, setStep] = useState(1);
    const [token, setToken] = useState("");
    const [pages, setPages] = useState<any[]>([]);
    const [selectedPages, setSelectedPages] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [name, setName] = useState("My Notion Workspace");

    const handleFetchPages = async () => {
        if (!token) {
            showToast.error("Please enter an integration token");
            return;
        }
        setIsLoading(true);
        try {
            const res = await api.get(`${ENDPOINTS.CONNECTORS.NOTION_PAGES}?token=${token}`);
            setPages(res.data);
            setStep(2);
        } catch (err) {
            showToast.error("Failed to fetch pages. Verify your token.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleConnect = async () => {
        if (selectedPages.length === 0) {
            showToast.error("Please select at least one page");
            return;
        }
        setIsLoading(true);
        try {
            const res = await api.post(ENDPOINTS.CONNECTORS.BASE, {
                name,
                type: 'notion',
                config: {
                    token,
                    selected_pages: selectedPages
                }
            });
            onConnected(res.data);
            showToast.success("Notion connected successfully");
            onClose();
        } catch (err) {
            showToast.error("Failed to connect Notion");
        } finally {
            setIsLoading(false);
        }
    };

    const togglePage = (id: string) => {
        setSelectedPages(prev =>
            prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]
        );
    };

    const content = (
        <div className="flex flex-col gap-6 animate-fade-in">
            {step === 1 ? (
                <div className="space-y-6">
                    <div className="bg-indigo-50/50 border border-indigo-100 p-5 rounded-2xl flex gap-4">
                        <HiInformationCircle className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
                        <div className="text-sm text-indigo-800 leading-relaxed">
                            Create an <strong>Internal Integration Token</strong> in Notion and share pages with it.
                        </div>
                    </div>

                    <div className="space-y-5">
                        <div className="space-y-2">
                            <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Connection Name</label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="e.g. Marketing Docs"
                                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Integration Token</label>
                            <input
                                type="password"
                                value={token}
                                onChange={(e) => setToken(e.target.value)}
                                placeholder="secret_..."
                                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-mono outline-none"
                            />
                        </div>
                    </div>

                </div>
            ) : (
                <div className="space-y-6">
                    <div className="flex items-center justify-between">
                        <h4 className="text-sm font-bold text-slate-900">Select Pages ({selectedPages.length})</h4>
                        <button onClick={() => setStep(1)} className="text-xs text-indigo-600 font-bold">Change Token</button>
                    </div>

                    <div className="space-y-2 max-h-[50vh] overflow-y-auto pr-3">
                        {pages.length === 0 ? (
                            <div className="py-12 text-center text-slate-500 text-sm italic">No pages found.</div>
                        ) : (
                            pages.map(page => (
                                <div
                                    key={page.id}
                                    onClick={() => togglePage(page.id)}
                                    className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${selectedPages.includes(page.id) ? "border-indigo-500 bg-indigo-50/50 ring-1 ring-indigo-500 shadow-sm" : "border-slate-200 hover:bg-slate-50"}`}
                                >
                                    <div className="flex-1 min-w-0 mr-4">
                                        <div className="text-sm font-bold text-slate-900 truncate">{page.title}</div>
                                        <div className="text-[10px] text-slate-400 truncate font-mono mt-0.5">{page.url}</div>
                                    </div>
                                    {selectedPages.includes(page.id) && <HiCheckCircle className="w-6 h-6 text-indigo-600 shrink-0" />}
                                </div>
                            ))
                        )}
                    </div>

                </div>
            )}
        </div>
    );

    const footer = (
        <div className="flex gap-3">
            <Button
                variant="bordered"
                onPress={onClose}
                className="font-medium bg-white rounded-lg h-10 px-6 border border-slate-100 text-slate-600 shadow-sm transition-all hover:bg-slate-50"
            >
                Cancel
            </Button>
            {step === 1 ? (
                <Button
                    onClick={handleFetchPages}
                    disabled={isLoading || !token}
                    isLoading={isLoading}
                    className="py-4 bg-slate-900 text-white rounded-lg h-10 px-8 text-sm font-bold hover:bg-slate-800 disabled:opacity-50 transition-all shadow-xl"
                >
                    {isLoading ? "Fetching..." : "Continue"}
                </Button>
            ) : (
                <Button
                    onClick={handleConnect}
                    disabled={isLoading || selectedPages.length === 0}
                    isLoading={isLoading}
                    className="py-4 bg-indigo-600 text-white rounded-lg h-10 px-8 text-sm font-bold hover:bg-indigo-700 disabled:opacity-50 transition-all shadow-xl shadow-indigo-100"
                >
                    {isLoading ? "Connecting..." : "Connect Pages"}
                </Button>
            )}
        </div>
    );

    return (
        <Drawer
            isOpen={isOpen}
            onClose={onClose}
            title="Connect Notion"
            subtitle="Sync your workspace documentation automatically"
            icon={() => <div className="font-bold">N</div>}
            footer={footer}
            size="2xl"
        >
            {content}
        </Drawer>
    );
}
