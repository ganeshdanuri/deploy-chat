import { ArrowRight } from "lucide-react";
import { Globe2, Upload, Code } from "lucide-react";
import { SiNotion } from "react-icons/si";
import type { ComponentType } from "react";

interface Source {
  id: string;
  label: string;
  desc: string;
  icon: ComponentType<{ size?: number; strokeWidth?: number }>;
  color: string;
  bg: string;
  action: string;
}

const SOURCES: Source[] = [
  {
    id: "upload",
    label: "Upload files",
    desc: "Drop PDF, DOCX, TXT, or Markdown",
    icon: Upload,
    color: "#1D2020",
    bg: "#F5F5F4",
    action: "upload",
  },
  {
    id: "crawl",
    label: "Crawl website",
    desc: "Sync any public URL",
    icon: Globe2,
    color: "#0D9488",
    bg: "#CCFBF1",
    action: "crawl",
  },
  {
    id: "notion",
    label: "Notion",
    desc: "Pages & databases",
    icon: SiNotion as ComponentType<{ size?: number; strokeWidth?: number }>,
    color: "#000000",
    bg: "#F5F5F4",
    action: "notion",
  },
  {
    id: "api",
    label: "API endpoint",
    desc: "Push via webhook",
    icon: Code,
    color: "#2563EB",
    bg: "#EFF6FF",
    action: "api",
  },
];

interface SourcesTabProps {
  onSourceClick: (action: string) => void;
}

export function SourcesTab({ onSourceClick }: SourcesTabProps) {
  return (
    <section className="space-y-6">
      <div>
        <h2>Connect a new source</h2>
        <p className="text-[13px] text-muted-foreground mt-1">
          Pick where your content lives. New files sync automatically.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {SOURCES.map(({ id, label, desc, icon: Icon, color, bg, action }) => (
          <button
            key={id}
            onClick={() => onSourceClick(action)}
            className="dash-card group bg-background border border-border p-5 flex flex-col items-start gap-4 text-left hover:border-border-medium hover:shadow-md transition-all"
          >
            <div
              className="w-11 h-11 rounded-xl flex items-center justify-center"
              style={{ background: bg, color }}
            >
              <Icon size={20} strokeWidth={1.75} />
            </div>
            <div className="min-w-0 w-full">
              <div className="text-[14px] font-semibold text-foreground tracking-[-0.005em]">
                {label}
              </div>
              <div className="text-[12px] text-muted-foreground mt-0.5 leading-relaxed">{desc}</div>
            </div>
            <div className="mt-auto pt-1 text-[12px] font-medium text-muted-foreground inline-flex items-center gap-1 group-hover:text-foreground transition-colors">
              Connect
              <ArrowRight
                className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform"
                strokeWidth={2}
              />
            </div>
          </button>
        ))}
      </div>
    </section>
  );
}
