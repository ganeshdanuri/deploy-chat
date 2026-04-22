"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

import { Database, Search, Sparkles, Trash2, X, Plus, CheckCheck } from "lucide-react";
import { useState, useEffect } from "react";

import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { fetchDatasets } from "@/lib/store/slices/datasetsSlice";
import { createChatbot, fetchChatbots } from "@/lib/store/slices/chatbotsSlice";
import Drawer from "./Drawer";
import showToast from "@/lib/toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/app/components/ui";
import api from "@/lib/api";
import { ENDPOINTS } from "@/lib/endpoints";

interface AgentFormDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  /** Provide to enter edit mode; omit or pass null/undefined for create mode. */
  editBot?: any;
}

export default function AgentFormDrawer({ isOpen, onClose, editBot }: AgentFormDrawerProps) {
  const [name, setName] = useState("");
  const [welcomeMessage, setWelcomeMessage] = useState("");
  const [allowedDomains, setAllowedDomains] = useState<string[]>([""]);
  const [selectedDatasets, setSelectedDatasets] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const dispatch = useAppDispatch();
  const { items: datasets, status: dsStatus } = useAppSelector((state) => state.datasets);

  // Fetch datasets on open
  useEffect(() => {
    if (isOpen && dsStatus === "idle") dispatch(fetchDatasets());
  }, [isOpen, dsStatus, dispatch]);

  // Populate form in edit mode; reset in create mode
  useEffect(() => {
    if (editBot && isOpen) {
      setName(editBot.name || "");
      setWelcomeMessage(editBot.welcome_message || "");
      setAllowedDomains(editBot.allowed_domains ? editBot.allowed_domains.split(",") : [""]);
    } else if (!editBot && isOpen) {
      setName("");
      setWelcomeMessage("");
      setAllowedDomains([""]);
      setSelectedDatasets([]);
    }
  }, [editBot, isOpen]);

  // Auto-generate welcome message from name in create mode
  useEffect(() => {
    if (!editBot && name && (!welcomeMessage || welcomeMessage.startsWith("Hi! I am"))) {
      setWelcomeMessage(`Hi! I am ${name}. How can I help you today?`);
    }
  }, [name, welcomeMessage, editBot]);

  const validateDomain = (domain: string) => {
    const re = /^(?:https?:\/\/)?(?:(?:[A-Z0-9](?:[A-Z0-9-]{0,61}[A-Z0-9])?\.)+[A-Z]{2,63}|localhost|\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})(?::\d+)?(?:\/?)$/i;
    return re.test(domain) && domain !== "*";
  };

  const handleSubmit = async () => {
    const validDomains = allowedDomains.filter((d) => d.trim() !== "");
    if (!name || (!editBot && selectedDatasets.length === 0) || !welcomeMessage || validDomains.length === 0) {
      showToast.error("All fields are required. Please fill out every section.");
      return;
    }
    const invalid = validDomains.filter((d) => !validateDomain(d));
    if (invalid.length > 0) {
      showToast.error(`Invalid domain format(s): ${invalid.join(", ")}`);
      return;
    }
    setIsSubmitting(true);
    try {
      if (editBot) {
        await api.patch(ENDPOINTS.CHATBOTS.BY_ID(editBot.id), {
          name,
          welcome_message: welcomeMessage,
          allowed_domains: validDomains.join(","),
        });
        showToast.success(`"${name}" updated successfully!`);
        dispatch(fetchChatbots());
      } else {
        await dispatch(
          createChatbot({
            name,
            dataset_ids: selectedDatasets,
            welcome_message: welcomeMessage,
            allowed_domains: validDomains.join(","),
          })
        ).unwrap();
        showToast.success(`"${name}" deployed successfully!`);
      }
      onClose();
    } catch (error: any) {
      showToast.error(error?.message || `Failed to ${editBot ? "update" : "create"} agent.`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const footer = (
    <>
      <button
        onClick={onClose}
        className="text-[13px] font-medium text-muted-foreground hover:text-foreground transition-colors"
      >
        Cancel
      </button>
      <Button
        onClick={handleSubmit}
        disabled={isSubmitting || !name || (!editBot && selectedDatasets.length === 0)}
        className="rounded-xl"
      >
        {isSubmitting ? (
          <span className="flex items-center gap-2">
            <span className="w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin" />
            Processing…
          </span>
        ) : editBot ? "Save changes" : "Deploy agent"}
      </Button>
    </>
  );

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      title={editBot ? "Edit AI Agent" : "New AI Agent"}
      subtitle={
        editBot
          ? "Update your agent's configuration."
          : "Build an AI agent powered by your knowledge base."
      }
      icon={Sparkles}
      iconBgColor="bg-violet-50/60"
      iconColor="text-violet-600"
      footer={footer}
      size="2xl"
    >
      <div className="space-y-6 animate-fade-in">
        {/* Agent name */}
        <div className="space-y-2">
          <label className="text-sm font-medium block text-foreground">Agent Name</label>
          <p className="text-xs text-muted-foreground">Give your agent a name that reflects its purpose.</p>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Customer Support Bot"
          />
        </div>

        {/* Dataset selector — create mode only */}
        {!editBot && (
          <DatasetSelector
            datasets={datasets}
            status={dsStatus}
            selectedIds={selectedDatasets}
            onToggle={(id) =>
              setSelectedDatasets((prev) =>
                prev.includes(id) ? prev.filter((d) => d !== id) : [...prev, id]
              )
            }
            onClearAll={() => setSelectedDatasets([])}
            onSelectAll={(ids) =>
              setSelectedDatasets((prev) => [...new Set([...prev, ...ids])])
            }
          />
        )}

        <div className="h-px bg-border" />

        {/* Welcome message */}
        <div className="space-y-2">
          <label className="text-sm font-medium block text-foreground">Welcome Message</label>
          <p className="text-xs text-muted-foreground">The first message users see when the chat opens.</p>
          <Input
            value={welcomeMessage}
            onChange={(e) => setWelcomeMessage(e.target.value)}
            placeholder="Hi! How can I help you?"
          />
        </div>

        {/* Allowed domains */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium block text-foreground">Allowed Domains</label>
              <p className="text-xs text-muted-foreground mt-0.5">Domains where this agent can be embedded.</p>
            </div>
            <button
              onClick={() => setAllowedDomains([...allowedDomains, ""])}
              className="flex items-center gap-1 text-[12px] font-semibold text-muted-foreground hover:text-foreground transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              Add domain
            </button>
          </div>
          <div className="space-y-2">
            {allowedDomains.map((domain, index) => (
              <div key={index} className="flex items-center gap-2">
                <Input
                  value={domain}
                  onChange={(e) => {
                    const next = [...allowedDomains];
                    next[index] = e.target.value;
                    setAllowedDomains(next);
                  }}
                  placeholder="e.g., example.com"
                />
                <button
                  onClick={() => {
                    const next = allowedDomains.filter((_, i) => i !== index);
                    setAllowedDomains(next.length === 0 ? [""] : next);
                  }}
                  className="shrink-0 p-1.5 text-muted-foreground hover:text-destructive transition-colors"
                  aria-label="Remove domain"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Drawer>
  );
}

// ─── Dataset selector sub-component ──────────────────────────────────────────

interface DatasetSelectorProps {
  datasets: any[];
  status: string;
  selectedIds: string[];
  onToggle: (id: string) => void;
  onClearAll: () => void;
  onSelectAll: (ids: string[]) => void;
}

function DatasetSelector({
  datasets,
  status,
  selectedIds,
  onToggle,
  onClearAll,
  onSelectAll,
}: DatasetSelectorProps) {
  const [search, setSearch] = useState("");

  const q = search.toLowerCase();
  const filtered = datasets.filter((d) => d.name.toLowerCase().includes(q));
  const selectedObjects = datasets.filter((d) => selectedIds.includes(d.id));
  const canSelectAll = search && filtered.some((d) => !selectedIds.includes(d.id));

  return (
    <div className="space-y-4">
      {selectedObjects.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[12px] font-semibold text-muted-foreground">Selected</span>
            <button
              onClick={onClearAll}
              className="text-[11px] text-muted-foreground hover:text-foreground transition-colors"
            >
              Clear all
            </button>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {selectedObjects.map((ds) => (
              <span
                key={ds.id}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-muted border border-border rounded-full text-[12px] font-medium text-foreground max-w-[200px]"
              >
                <Database size={11} strokeWidth={2} className="text-violet-500 shrink-0" />
                <span className="truncate">{ds.name}</span>
                <button onClick={() => onToggle(ds.id)} className="ml-0.5 text-muted-foreground hover:text-foreground shrink-0">
                  <X className="w-2.5 h-2.5" />
                </button>
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="h-px bg-border" />

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" strokeWidth={1.75} />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={`Search ${datasets.length} knowledge base${datasets.length !== 1 ? "s" : ""}…`}
          className="w-full h-9 pl-9 pr-3 text-[13px] bg-muted rounded-xl border border-transparent focus:outline-none focus:bg-background focus:border-border transition-all"
        />
      </div>

      {canSelectAll && (
        <div className="flex justify-end">
          <button
            onClick={() => onSelectAll(filtered.map((d) => d.id))}
            className="flex items-center gap-1.5 text-[12px] font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            <CheckCheck className="w-3.5 h-3.5" />
            Select all {filtered.length}
          </button>
        </div>
      )}

      {status === "loading" ? (
        <div className="space-y-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-[52px] bg-muted rounded-xl animate-pulse" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="py-10 text-center">
          <Database className="w-8 h-8 text-muted-foreground/40 mx-auto mb-2" strokeWidth={1.5} />
          <p className="text-[13px] text-muted-foreground">
            {datasets.length === 0
              ? "No knowledge bases yet — create one first"
              : `No results for "${search}"`}
          </p>
        </div>
      ) : (
        <div className="space-y-1">
          {filtered.map((ds) => {
            const isSelected = selectedIds.includes(ds.id);
            return (
              <button
                key={ds.id}
                onClick={() => onToggle(ds.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all ${
                  isSelected ? "bg-foreground/5 border border-border" : "hover:bg-muted border border-transparent"
                }`}
              >
                <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 bg-violet-50 text-violet-600">
                  <Database size={14} strokeWidth={1.75} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-medium text-foreground truncate">{ds.name}</p>
                  <p className="text-[11px] text-muted-foreground uppercase tracking-wide">Knowledge base collection</p>
                </div>
                <div
                  className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 transition-all ${
                    isSelected ? "bg-foreground text-background" : "border border-border bg-muted"
                  }`}
                >
                  {isSelected ? <X className="w-3 h-3" /> : <Plus className="w-3 h-3" />}
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
