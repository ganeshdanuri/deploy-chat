"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

import { ArrowRight, Check, Database, FlaskConical, Globe, Search, Sparkles, Trash2, Upload, X, Plus, CheckCheck } from "lucide-react";
import { useState, useEffect, useRef } from "react";

import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { fetchDatasets } from "@/lib/store/slices/datasetsSlice";
import { fetchDocuments } from "@/lib/store/slices/documentsSlice";
import { createChatbot, fetchChatbots } from "@/lib/store/slices/chatbotsSlice";
import Drawer from "./Drawer";
import showToast from "@/lib/toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/app/components/ui";
import api from "@/lib/api";
import { ENDPOINTS } from "@/lib/endpoints";
import { getFileIcon } from "@/lib/file-utils";

interface AgentFormDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  /** Provide to enter edit mode; omit or pass null/undefined for create mode. */
  editBot?: any;
}

// ─── Wizard steps (create mode only) ─────────────────────────────────────────
// Edit mode stays a single screen — the user already knows what they're changing.

type Step = 1 | 2 | 3;

const STEPS: { n: Step; label: string }[] = [
  { n: 1, label: "Name it" },
  { n: 2, label: "Add knowledge" },
  { n: 3, label: "Where it runs" },
];

export default function AgentFormDrawer({ isOpen, onClose, editBot }: AgentFormDrawerProps) {
  const [name, setName] = useState("");
  const [welcomeMessage, setWelcomeMessage] = useState("");
  const [allowedDomains, setAllowedDomains] = useState<string[]>([""]);
  const [selectedDatasets, setSelectedDatasets] = useState<string[]>([]);
  const [selectedDocs, setSelectedDocs] = useState<string[]>([]);
  // Escape hatch: power users who already have collections can pick one
  // instead of building a fresh one from loose files.
  const [reuseCollection, setReuseCollection] = useState(false);
  // "testing" ships the agent locked to localhost so nobody has to invent a
  // production domain just to try the thing. Widening it later is a one-field edit.
  const [domainMode, setDomainMode] = useState<"testing" | "live">("testing");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [step, setStep] = useState<Step>(1);

  const dispatch = useAppDispatch();
  const { items: datasets, status: dsStatus } = useAppSelector((state) => state.datasets);
  const { items: documents, status: docStatus } = useAppSelector((state) => state.documents);

  // Fetch pickable content on open
  useEffect(() => {
    if (!isOpen) return;
    if (dsStatus === "idle") dispatch(fetchDatasets());
    if (docStatus === "idle") dispatch(fetchDocuments());
  }, [isOpen, dsStatus, docStatus, dispatch]);

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
      setSelectedDocs([]);
      setReuseCollection(false);
      setDomainMode("testing");
      setStep(1);
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

  const hasKnowledge = reuseCollection
    ? selectedDatasets.length > 0
    : selectedDocs.length > 0;

  /** Testing agents are scoped to localhost; the widget strips ports when matching. */
  const resolveDomains = () =>
    !editBot && domainMode === "testing"
      ? ["localhost"]
      : allowedDomains.filter((d) => d.trim() !== "");

  const handleSubmit = async () => {
    const validDomains = resolveDomains();
    if (!name || (!editBot && !hasKnowledge) || !welcomeMessage || validDomains.length === 0) {
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
        // Loose files go over as document_ids — the API wraps them in a
        // collection inside the same transaction, so a failure here can't
        // strand an orphan collection behind it.
        await dispatch(
          createChatbot({
            name,
            ...(reuseCollection
              ? { dataset_ids: selectedDatasets }
              : { document_ids: selectedDocs }),
            welcome_message: welcomeMessage,
            allowed_domains: validDomains.join(","),
          })
        ).unwrap();
        // Pick up the collection the API just created on our behalf.
        if (!reuseCollection) dispatch(fetchDatasets());
        showToast.success(`"${name}" is training — it'll be live in a moment.`);
      }
      onClose();
    } catch (error: any) {
      showToast.error(error?.message || `Failed to ${editBot ? "update" : "create"} agent.`);
    } finally {
      setIsSubmitting(false);
    }
  };

  /** Can the user leave the step they're on? Gates Next, never hides it. */
  const canAdvance = (from: Step) => {
    if (from === 1) return name.trim().length > 0;
    if (from === 2) return hasKnowledge;
    return domainMode === "testing" || allowedDomains.some((d) => d.trim() !== "");
  };

  const spinner = (
    <span className="flex items-center gap-2">
      <span className="w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin" />
      Processing…
    </span>
  );

  const footer = editBot ? (
    <>
      <button onClick={onClose} className="text-[13px] font-medium text-muted-foreground hover:text-foreground transition-colors">
        Cancel
      </button>
      <Button onClick={handleSubmit} disabled={isSubmitting || !name} className="rounded-xl">
        {isSubmitting ? spinner : "Save changes"}
      </Button>
    </>
  ) : (
    <>
      <button
        onClick={() => (step === 1 ? onClose() : setStep((s) => (s - 1) as Step))}
        className="text-[13px] font-medium text-muted-foreground hover:text-foreground transition-colors"
      >
        {step === 1 ? "Cancel" : "Back"}
      </button>
      {step < 3 ? (
        <Button
          onClick={() => setStep((s) => (s + 1) as Step)}
          disabled={!canAdvance(step)}
          className="rounded-xl"
        >
          Continue
          <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
        </Button>
      ) : (
        <Button onClick={handleSubmit} disabled={isSubmitting || !canAdvance(3)} className="rounded-xl">
          {isSubmitting ? spinner : "Deploy agent"}
        </Button>
      )}
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
          : "Build an AI agent trained on your own content."
      }
      icon={Sparkles}
      iconBgColor="bg-violet-50/60"
      iconColor="text-violet-600"
      footer={footer}
      size="2xl"
    >
      <div className="space-y-6 animate-fade-in">
        {!editBot && <StepProgress current={step} />}

        {/* Agent name */}
        <div className={editBot || step === 1 ? "space-y-2" : "hidden"}>
          <label className="text-sm font-medium block text-foreground">Agent Name</label>
          <p className="text-xs text-muted-foreground">Give your agent a name that reflects its purpose.</p>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Customer Support Bot"
          />
        </div>

        {/* Knowledge picker — create mode only */}
        <div className={!editBot && step === 2 ? "space-y-4" : "hidden"}>
          <div>
            <label className="text-sm font-medium block text-foreground">
              What should this agent know?
            </label>
            <p className="text-xs text-muted-foreground mt-0.5">
              {datasets.length > 0
                ? "Pick individual files, or reuse a collection you've already grouped."
                : "Upload documents or pick from files you've already added."}
            </p>
          </div>

          {/* Only offered once collections exist — no reason to explain the
              concept to someone who has never made one. */}
          {datasets.length > 0 && (
            <div className="flex gap-1 p-1 bg-muted rounded-xl w-fit">
              {[
                { id: "files", label: "Files", count: documents.length },
                { id: "collections", label: "Collections", count: datasets.length },
              ].map((t) => {
                const active = (t.id === "collections") === reuseCollection;
                return (
                  <button
                    key={t.id}
                    onClick={() => {
                      setReuseCollection(t.id === "collections");
                      setSelectedDocs([]);
                      setSelectedDatasets([]);
                    }}
                    className={`px-3 py-1.5 rounded-lg text-[12px] font-medium transition-all ${
                      active
                        ? "bg-background text-foreground shadow-sm"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {t.label}{" "}
                    <span className="tabular-nums opacity-60">{t.count}</span>
                  </button>
                );
              })}
            </div>
          )}

          {reuseCollection ? (
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
          ) : (
            <FilePicker
              documents={documents}
              status={docStatus}
              selectedIds={selectedDocs}
              onToggle={(id) =>
                setSelectedDocs((prev) =>
                  prev.includes(id) ? prev.filter((d) => d !== id) : [...prev, id]
                )
              }
              onUploaded={(ids) => setSelectedDocs((prev) => [...new Set([...prev, ...ids])])}
            />
          )}
        </div>

        {editBot && <div className="h-px bg-border" />}

        {/* Welcome message */}
        <div className={editBot || step === 1 ? "space-y-2" : "hidden"}>
          <label className="text-sm font-medium block text-foreground">Welcome Message</label>
          <p className="text-xs text-muted-foreground">The first message users see when the chat opens.</p>
          <Input
            value={welcomeMessage}
            onChange={(e) => setWelcomeMessage(e.target.value)}
            placeholder="Hi! How can I help you?"
          />
        </div>

        {/* Where it runs */}
        <div className={!editBot && step === 3 ? "space-y-3" : "hidden"}>
          <div>
            <label className="text-sm font-medium block text-foreground">Where will this run?</label>
            <p className="text-xs text-muted-foreground mt-0.5">
              You can change this any time from the agent&apos;s settings.
            </p>
          </div>
          <ModeCard
            selected={domainMode === "testing"}
            onSelect={() => setDomainMode("testing")}
            icon={FlaskConical}
            title="Just testing"
            desc="Works in the playground and on localhost. Add your domain when you're ready to go live."
          />
          <ModeCard
            selected={domainMode === "live"}
            onSelect={() => setDomainMode("live")}
            icon={Globe}
            title="On my website"
            desc="Lock the agent to specific domains so nobody else can embed it."
          />
        </div>

        {/* Allowed domains */}
        <div
          className={
            editBot || (step === 3 && domainMode === "live") ? "space-y-3" : "hidden"
          }
        >
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

// ─── File picker (step 2 default) ────────────────────────────────────────────

const MAX_SIZE_MB = 10;

interface FilePickerProps {
  documents: any[];
  status: string;
  selectedIds: string[];
  onToggle: (id: string) => void;
  onUploaded: (ids: string[]) => void;
}

function FilePicker({
  documents,
  status,
  selectedIds,
  onToggle,
  onUploaded,
}: FilePickerProps) {
  const dispatch = useAppDispatch();
  const inputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [search, setSearch] = useState("");

  const upload = async (incoming: File[]) => {
    const valid = incoming.filter((f) => {
      if (f.size > MAX_SIZE_MB * 1024 * 1024) {
        showToast.error(`"${f.name}" is over the ${MAX_SIZE_MB}MB limit`);
        return false;
      }
      return true;
    });
    if (valid.length === 0) return;

    setIsUploading(true);
    const formData = new FormData();
    valid.forEach((f) => formData.append("files", f));
    try {
      const res = await api.post(ENDPOINTS.DOCUMENTS.BASE, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      const ids: string[] = (res.data?.documents || []).map((d: any) => String(d.id));
      await dispatch(fetchDocuments());
      onUploaded(ids); // newly uploaded files are selected by default
      showToast.success(`${ids.length} file${ids.length !== 1 ? "s" : ""} added`);
    } catch (err: any) {
      showToast.error(err?.response?.data?.detail || "Upload failed. Please try again.");
    } finally {
      setIsUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  const q = search.toLowerCase();
  const filtered = documents.filter((d) => d.name.toLowerCase().includes(q));

  return (
    <div className="space-y-4">
      {/* Drop zone */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setIsDragging(false);
          upload(Array.from(e.dataTransfer.files));
        }}
        onClick={() => !isUploading && inputRef.current?.click()}
        className={`border border-dashed rounded-xl px-4 py-6 flex flex-col items-center gap-2 cursor-pointer transition-colors ${
          isDragging
            ? "border-foreground bg-muted"
            : "border-border hover:border-border-medium hover:bg-muted/50"
        } ${isUploading ? "opacity-60 pointer-events-none" : ""}`}
      >
        <input
          ref={inputRef}
          type="file"
          multiple
          accept=".pdf,.doc,.docx,.txt,.md"
          className="hidden"
          onChange={(e) => e.target.files && upload(Array.from(e.target.files))}
        />
        {isUploading ? (
          <>
            <span className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin text-muted-foreground" />
            <span className="text-[13px] font-medium text-muted-foreground">Uploading…</span>
          </>
        ) : (
          <>
            <div className="w-9 h-9 rounded-xl bg-muted flex items-center justify-center">
              <Upload className="w-4 h-4 text-muted-foreground" strokeWidth={1.75} />
            </div>
            <span className="text-[13px] font-medium text-foreground">
              Drop files or click to upload
            </span>
            <span className="text-[11px] text-muted-foreground">
              PDF, DOCX, TXT, MD · up to {MAX_SIZE_MB}MB each
            </span>
          </>
        )}
      </div>

      {/* Existing files */}
      {documents.length > 0 && (
        <>
          {documents.length > 5 && (
            <div className="relative">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground"
                strokeWidth={1.75}
              />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={`Search ${documents.length} files…`}
                className="w-full h-9 pl-9 pr-3 text-[13px] bg-muted rounded-xl border border-transparent focus:outline-none focus:bg-background focus:border-border transition-all"
              />
            </div>
          )}

          <div className="space-y-1 max-h-[280px] overflow-y-auto">
            {filtered.map((doc) => {
              const isSelected = selectedIds.includes(doc.id);
              const { Icon, color, bg } = getFileIcon(doc.name);
              return (
                <button
                  key={doc.id}
                  onClick={() => onToggle(doc.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all ${
                    isSelected
                      ? "bg-foreground/5 border border-border"
                      : "hover:bg-muted border border-transparent"
                  }`}
                >
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                    style={{ background: bg, color }}
                  >
                    <Icon size={14} strokeWidth={1.75} />
                  </div>
                  <p className="flex-1 min-w-0 text-[13px] font-medium text-foreground truncate">
                    {doc.name}
                  </p>
                  <div
                    className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 transition-all ${
                      isSelected
                        ? "bg-foreground text-background"
                        : "border border-border bg-muted text-muted-foreground"
                    }`}
                  >
                    {isSelected ? <Check className="w-3 h-3" strokeWidth={3} /> : <Plus className="w-3 h-3" />}
                  </div>
                </button>
              );
            })}
            {filtered.length === 0 && (
              <p className="py-6 text-center text-[13px] text-muted-foreground">
                No files match &quot;{search}&quot;
              </p>
            )}
          </div>
        </>
      )}

      {status === "loading" && documents.length === 0 && (
        <div className="space-y-2">
          {[1, 2].map((i) => (
            <div key={i} className="h-[52px] bg-muted rounded-xl animate-pulse" />
          ))}
        </div>
      )}

      <p className="text-[12px] text-muted-foreground pt-1">
        {selectedIds.length > 0
          ? `${selectedIds.length} file${selectedIds.length !== 1 ? "s" : ""} selected`
          : "Select at least one file"}
      </p>
    </div>
  );
}

// ─── Mode card (step 3) ──────────────────────────────────────────────────────

function ModeCard({
  selected,
  onSelect,
  icon: Icon,
  title,
  desc,
}: {
  selected: boolean;
  onSelect: () => void;
  icon: React.ElementType;
  title: string;
  desc: string;
}) {
  return (
    <button
      onClick={onSelect}
      className={`w-full flex items-start gap-3 p-4 rounded-xl border text-left transition-all ${
        selected
          ? "border-foreground bg-foreground/5"
          : "border-border hover:border-border-medium hover:bg-muted/50"
      }`}
    >
      <div
        className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
          selected ? "bg-foreground text-background" : "bg-muted text-muted-foreground"
        }`}
      >
        <Icon className="w-4 h-4" strokeWidth={1.75} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[13px] font-semibold text-foreground">{title}</p>
        <p className="text-[12px] text-muted-foreground mt-0.5 leading-relaxed">{desc}</p>
      </div>
      <div
        className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 mt-0.5 ${
          selected ? "border-foreground bg-foreground" : "border-border"
        }`}
      >
        {selected && <Check className="w-2.5 h-2.5 text-background" strokeWidth={4} />}
      </div>
    </button>
  );
}

// ─── Step progress ───────────────────────────────────────────────────────────

function StepProgress({ current }: { current: Step }) {
  return (
    <div className="flex items-center gap-2">
      {STEPS.map(({ n, label }, i) => {
        const isDone = n < current;
        const isActive = n === current;
        return (
          <div key={n} className="flex items-center gap-2 min-w-0">
            <div
              className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 transition-colors ${
                isDone
                  ? "bg-foreground text-background"
                  : isActive
                  ? "bg-foreground text-background"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              {isDone ? <Check className="w-3 h-3" strokeWidth={3} /> : n}
            </div>
            <span
              className={`text-[12px] font-medium whitespace-nowrap ${
                isActive ? "text-foreground" : "text-muted-foreground"
              }`}
            >
              {label}
            </span>
            {i < STEPS.length - 1 && <div className="w-4 h-px bg-border shrink-0 ml-1" />}
          </div>
        );
      })}
    </div>
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
          placeholder={`Search ${datasets.length} collection${datasets.length !== 1 ? "s" : ""}…`}
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
              ? "No collections yet"
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
                  <p className="text-[11px] text-muted-foreground uppercase tracking-wide">Collection</p>
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
