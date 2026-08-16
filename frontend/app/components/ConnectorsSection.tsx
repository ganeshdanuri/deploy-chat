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
};

/* The tile exposes its vendor colour as a custom property so CSS can hold the
   logo at muted weight and reveal the real colour on hover. */
type TileStyle = CSSProperties & { "--logo": string };

const UNIQUE_INTEGRATIONS: Integration[] = [
  { name: "Notion",         Icon: SiNotion,       color: "#000000", col: 1, offset: 60,  delay: "0s" },
  { name: "Confluence",     Icon: SiConfluence,   color: "#172B4D", col: 1, offset: 220, delay: "0.6s" },
  { name: "Google Drive",   Icon: SiGoogledrive,  color: "#4285F4", col: 2, offset: 20,  delay: "0.3s" },
  { name: "Dropbox",        Icon: SiDropbox,      color: "#0061FF", col: 2, offset: 190, delay: "0.8s" },
  { name: "GitHub",         Icon: SiGithub,       color: "#181717", col: 3, offset: 10,  delay: "0.5s" },
  { name: "GitLab",         Icon: SiGitlab,       color: "#FC6D26", col: 3, offset: 170, delay: "0.1s" },
  { name: "PostgreSQL",     Icon: SiPostgresql,   color: "#4169E1", col: 4, offset: 60,  delay: "0.2s" },
  { name: "Google Sheets",  Icon: SiGooglesheets, color: "#34A853", col: 4, offset: 230, delay: "0.7s" },
  { name: "Airtable",       Icon: SiAirtable,     color: "#18BFFF", col: 5, offset: 20,  delay: "0.4s" },
  { name: "WordPress",      Icon: SiWordpress,    color: "#21759B", col: 5, offset: 200, delay: "0.9s" },
];

export default function ConnectorsSection() {
  /* Parts reveal individually. Revealing the whole section as one slab left no
     room for the logos to stagger inside it. */
  const headerRef = useReveal<HTMLDivElement>();
  const mobileRef = useReveal<HTMLDivElement>();
  const outroRef = useReveal<HTMLDivElement>();

  return (
    <section id="integrations" className="relative overflow-hidden">
      <div className="container-page py-24 sm:py-32">
        <div ref={headerRef} className="reveal text-center">
          <span className="eyebrow-pill">Knowledge Sources</span>
          <h2 className="h-section mt-6 mb-4 max-w-3xl mx-auto">
            Train on any
            <br className="hidden sm:block" /> knowledge source
          </h2>
        </div>

        {/* ── Staggered logo constellation (desktop) ── */}
        <div className="relative mt-14 sm:mt-20 hidden md:block px-16 lg:px-24">
          <LogoConstellation />
        </div>

        {/* Mobile fallback */}
        <div
          ref={mobileRef}
          className="md:hidden mt-12 grid grid-cols-4 gap-3 mx-auto max-w-sm reveal-group"
        >
          {UNIQUE_INTEGRATIONS.slice(0, 8).map(({ name, Icon, color }) => (
            <div
              key={name}
              className="integration-tile !w-full !h-16 !rounded-2xl"
              style={{ "--logo": color } as TileStyle}
              title={name}
              aria-label={name}
            >
              <Icon size={24} />
            </div>
          ))}
        </div>

        <div ref={outroRef} className="reveal">
          <p className="mt-12 sm:mt-16 text-center text-base sm:text-[17px] text-muted-foreground max-w-xl mx-auto leading-relaxed">
            Upload PDFs, sync wikis, crawl websites, or connect databases —
            your agent re-indexes automatically as content changes.
          </p>

          <div className="mt-6 text-center">
            <a
              href="#"
              className="inline-flex items-center gap-1.5 text-[15px] font-medium text-foreground hover:opacity-70 transition-opacity"
            >
              See all supported sources
              <ArrowUpRight className="w-4 h-4" strokeWidth={2} />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ──────────────────────────────────────────────────────────────────────── */

function LogoConstellation() {
  const COLS = 5;
  const CANVAS_H = 380;
  /* Stagger sits on the column grid, not the tiles — the tiles carry an inline
     translateX(-50%) that a reveal transform would overwrite. */
  const gridRef = useReveal<HTMLDivElement>();

  return (
    <div
      className="relative"
      style={{ height: CANVAS_H }}
      aria-label="Supported knowledge sources"
    >
      <div
        ref={gridRef}
        className="absolute inset-0 grid reveal-group"
        style={{ gridTemplateColumns: `repeat(${COLS}, 1fr)` }}
      >
        {Array.from({ length: COLS }, (_, i) => {
          const colIdx = i + 1;
          const tiles = UNIQUE_INTEGRATIONS.filter((t) => t.col === colIdx);
          return (
            <div key={colIdx} className="relative">
              {tiles.map(({ name, Icon, color, offset, delay }) => (
                /* Outer element owns the position, inner owns the drift. A CSS
                   animation overrides inline styles, so a single element would
                   lose its translateX(-50%) the moment the float started. */
                <div
                  key={name}
                  className="absolute"
                  style={{
                    top: offset,
                    left: "50%",
                    transform: "translateX(-50%)",
                  }}
                >
                  <div
                    className="integration-tile animate-float"
                    style={{ animationDelay: delay, "--logo": color } as TileStyle}
                    title={name}
                    aria-label={name}
                  >
                    <Icon size={36} />
                  </div>
                </div>
              ))}
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
            "radial-gradient(ellipse 60% 55% at 50% 50%, rgba(0,82,255,0.06) 0%, rgba(255,255,255,0) 70%)",
        }}
      />
    </div>
  );
}
