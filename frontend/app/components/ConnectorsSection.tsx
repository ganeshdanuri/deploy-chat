"use client";

import {
  SiNotion,
  SiGoogledrive,
  SiConfluence,
  SiGithub,
  SiDropbox,
  SiPostgresql,
  SiWordpress,
  SiGitlab,
  SiAirtable,
  SiGooglesheets,
} from "react-icons/si";
import { ArrowUpRight } from "lucide-react";
import type { ComponentType, CSSProperties } from "react";
import { useReveal } from "@/lib/hooks/useReveal";

type Integration = {
  name: string;
  Icon: ComponentType<{ size?: number; color?: string }>;
  color: string;
  col: number;
  offset: number;
  delay: string;
  framed: boolean;
};

const UNIQUE_INTEGRATIONS: Integration[] = [
  { name: "Notion",         Icon: SiNotion,       color: "#000000", col: 1, offset: 60,  delay: "0s",   framed: true  },
  { name: "Confluence",     Icon: SiConfluence,   color: "#172B4D", col: 1, offset: 220, delay: "0.6s", framed: false },
  { name: "Google Drive",   Icon: SiGoogledrive,  color: "#4285F4", col: 2, offset: 20,  delay: "0.3s", framed: true  },
  { name: "Dropbox",        Icon: SiDropbox,      color: "#0061FF", col: 2, offset: 190, delay: "0.8s", framed: true  },
  { name: "GitHub",         Icon: SiGithub,       color: "#181717", col: 3, offset: 10,  delay: "0.5s", framed: true  },
  { name: "GitLab",         Icon: SiGitlab,       color: "#FC6D26", col: 3, offset: 170, delay: "0.1s", framed: false },
  { name: "PostgreSQL",     Icon: SiPostgresql,   color: "#4169E1", col: 4, offset: 60,  delay: "0.2s", framed: true  },
  { name: "Google Sheets",  Icon: SiGooglesheets, color: "#34A853", col: 4, offset: 230, delay: "0.7s", framed: false },
  { name: "Airtable",       Icon: SiAirtable,     color: "#18BFFF", col: 5, offset: 20,  delay: "0.4s", framed: true  },
  { name: "WordPress",      Icon: SiWordpress,    color: "#21759B", col: 5, offset: 200, delay: "0.9s", framed: false },
];

export default function ConnectorsSection() {
  const sectionRef = useReveal<HTMLElement>();
  return (
    <section
      ref={sectionRef}
      id="integrations"
      className="relative max-w-[1200px] mx-auto px-4 sm:px-6 lg:max-w-full lg:px-12 py-20 sm:py-28 overflow-hidden reveal"
    >
      {/* Section eyebrow */}
      <div className="text-center">
        <span className="eyebrow-pill">Knowledge Sources</span>
      </div>

      {/* Headline */}
      <h2 className="text-center text-3xl sm:text-5xl lg:text-[56px] leading-[1.05] font-semibold tracking-[-0.03em] mt-6 mb-4 max-w-3xl mx-auto">
        Train on any
        <br className="hidden sm:block" />
        <span className="hl-marker">knowledge source</span>
      </h2>

      {/* ── Staggered logo constellation (desktop) ── */}
      <div className="relative mt-14 sm:mt-20 hidden md:block px-16 lg:px-24">
        <LogoConstellation />
      </div>

      {/* Mobile fallback */}
      <div className="md:hidden mt-12 grid grid-cols-4 gap-3 mx-auto max-w-sm">
        {UNIQUE_INTEGRATIONS.slice(0, 8).map(({ name, Icon, color }) => (
          <div
            key={name}
            className="integration-tile !w-full !h-16 !rounded-2xl"
            title={name}
            aria-label={name}
          >
            <Icon size={24} color={color} />
          </div>
        ))}
      </div>

      {/* Supporting copy */}
      <p className="mt-12 sm:mt-16 text-center text-base sm:text-[17px] text-muted-foreground max-w-xl mx-auto leading-relaxed">
        Upload PDFs, sync wikis, crawl websites, or connect databases —
        your agent re-indexes automatically as content changes.
      </p>

      {/* Explore link */}
      <div className="mt-6 text-center">
        <a
          href="#"
          className="inline-flex items-center gap-1.5 text-[15px] font-medium text-foreground hover:opacity-70 transition-opacity"
        >
          See all supported sources
          <ArrowUpRight className="w-4 h-4" strokeWidth={2} />
        </a>
      </div>
    </section>
  );
}

/* ──────────────────────────────────────────────────────────────────────── */

function LogoConstellation() {
  const COLS = 5;
  const CANVAS_H = 380;

  return (
    <div
      className="relative"
      style={{ height: CANVAS_H }}
      aria-label="Supported knowledge sources"
    >
      <div
        className="absolute inset-0 grid"
        style={{ gridTemplateColumns: `repeat(${COLS}, 1fr)` }}
      >
        {Array.from({ length: COLS }, (_, i) => {
          const colIdx = i + 1;
          const tiles = UNIQUE_INTEGRATIONS.filter((t) => t.col === colIdx);
          return (
            <div key={colIdx} className="relative">
              {tiles.map(({ name, Icon, color, offset, delay, framed }) => {
                const baseStyle: CSSProperties = {
                  top: offset,
                  left: "50%",
                  transform: "translateX(-50%)",
                  animationDelay: delay,
                };
                if (framed) {
                  return (
                    <div
                      key={name}
                      className="integration-tile absolute animate-float"
                      style={baseStyle}
                      title={name}
                      aria-label={name}
                    >
                      <Icon size={36} color={color} />
                    </div>
                  );
                }
                return (
                  <div
                    key={name}
                    className="absolute animate-float flex items-center justify-center"
                    style={{ ...baseStyle, width: 84, height: 84 }}
                    title={name}
                    aria-label={name}
                  >
                    <Icon size={44} color={color} />
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>

      {/* Soft radial spotlight */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 60% 55% at 50% 50%, rgba(212,251,95,0.10) 0%, rgba(255,255,255,0) 70%)",
        }}
      />
    </div>
  );
}
