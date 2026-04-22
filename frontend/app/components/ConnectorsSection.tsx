"use client";

import {
  SiNotion,
  SiSlack,
  SiDropbox,
  SiZendesk,
  SiIntercom,
  SiGithub,
  SiHubspot,
  SiSalesforce,
  SiConfluence,
  SiGoogledrive,
  SiWordpress,
  SiPostgresql,
  SiShopify,
} from "react-icons/si";
import { FaMicrosoft } from "react-icons/fa";
import { ArrowUpRight } from "lucide-react";
import type { ComponentType, CSSProperties } from "react";

type Integration = {
  name: string;
  Icon: ComponentType<{ size?: number; color?: string }>;
  color: string;
  /** column (1–7) */
  col: number;
  /** vertical offset in px — creates the staggered constellation feel */
  offset: number;
  /** animation delay for the gentle float */
  delay: string;
  /** if true, render the soft tile frame; else render the bare icon */
  framed: boolean;
};

/** Hand-tuned layout to match the screenshot's asymmetric constellation.
 *  Columns 1–7 left→right; offset nudges each tile up or down. */
const INTEGRATIONS: Integration[] = [
  // col 1
  { name: "Zendesk",      Icon: SiZendesk,     color: "#03363D", col: 1, offset: 90,  delay: "0s",   framed: false },
  // col 2
  { name: "Google Drive", Icon: SiGoogledrive, color: "#4285F4", col: 2, offset: 20,  delay: "0.4s", framed: true  },
  { name: "Dropbox",      Icon: SiDropbox,     color: "#0061FF", col: 2, offset: 160, delay: "0.9s", framed: true  },
  // col 3
  { name: "Notion",       Icon: SiNotion,      color: "#000000", col: 3, offset: 0,   delay: "0.2s", framed: true  },
  { name: "Confluence",   Icon: SiConfluence,  color: "#172B4D", col: 3, offset: 120, delay: "0.7s", framed: false },
  { name: "GitHub",       Icon: SiGithub,      color: "#181717", col: 3, offset: 240, delay: "0.3s", framed: false },
  // col 4
  { name: "Slack",        Icon: SiSlack,       color: "#4A154B", col: 4, offset: 60,  delay: "0.5s", framed: true  },
  { name: "Salesforce",   Icon: SiSalesforce,  color: "#00A1E0", col: 4, offset: 200, delay: "0.1s", framed: false },
  // col 5
  { name: "HubSpot",      Icon: SiHubspot,     color: "#48B57B", col: 5, offset: 0,   delay: "0.6s", framed: true  },
  { name: "Shopify",      Icon: SiShopify,     color: "#7AB55C", col: 5, offset: 140, delay: "0.8s", framed: false },
  // col 6
  { name: "Intercom",     Icon: SiIntercom,    color: "#1F8DED", col: 6, offset: 40,  delay: "0.3s", framed: true  },
  { name: "WordPress",    Icon: SiWordpress,   color: "#21759B", col: 6, offset: 180, delay: "0.5s", framed: false },
  // col 7
  { name: "PostgreSQL",   Icon: SiPostgresql,  color: "#4169E1", col: 7, offset: 80,  delay: "0.2s", framed: true  },
  { name: "SharePoint",   Icon: FaMicrosoft,   color: "#0078D4", col: 7, offset: 220, delay: "0.7s", framed: false },
];

export default function ConnectorsSection() {
  return (
    <section
      id="integrations"
      className="relative max-w-[1200px] mx-auto px-4 sm:px-6 lg:max-w-full lg:px-12 py-20 sm:py-28 overflow-hidden"
    >
      {/* Section eyebrow */}
      <div className="text-center">
        <span className="eyebrow-pill">Apps &amp; Integrations</span>
      </div>

      {/* Headline */}
      <h2 className="text-center text-3xl sm:text-5xl lg:text-[56px] leading-[1.05] font-semibold tracking-[-0.03em] mt-6 mb-4 max-w-3xl mx-auto">
        Seamless integrations,
        <br className="hidden sm:block" />
        <span className="hl-marker">better workflows</span>
      </h2>

      {/* ── Staggered logo constellation (desktop) ── */}
      <div className="relative mt-14 sm:mt-20 mx-auto max-w-[1080px] hidden md:block">
        <LogoConstellation />
      </div>

      {/* Mobile fallback: simple 4-col grid so it still looks intentional */}
      <div className="md:hidden mt-12 grid grid-cols-4 gap-3 mx-auto max-w-sm">
        {INTEGRATIONS.slice(0, 12).map(({ name, Icon, color }) => (
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
        Connect your knowledge sources in one click — docs, wikis, CRMs,
        databases, and more — and let your AI stay always up to date.
      </p>

      {/* Explore link */}
      <div className="mt-6 text-center">
        <a
          href="#"
          className="inline-flex items-center gap-1.5 text-[15px] font-medium text-foreground hover:opacity-70 transition-opacity"
        >
          Explore all integrations
          <ArrowUpRight className="w-4 h-4" strokeWidth={2} />
        </a>
      </div>
    </section>
  );
}

/* ──────────────────────────────────────────────────────────────────────── */

function LogoConstellation() {
  const COLS = 7;
  const CANVAS_H = 360;

  return (
    <div
      className="relative mx-auto"
      style={{ height: CANVAS_H }}
      aria-label="Integration partners"
    >
      <div
        className="absolute inset-0 grid"
        style={{ gridTemplateColumns: `repeat(${COLS}, 1fr)` }}
      >
        {Array.from({ length: COLS }, (_, i) => {
          const colIdx = i + 1;
          const tiles = INTEGRATIONS.filter((t) => t.col === colIdx);
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
                // Bare icon (no tile frame) — matches the screenshot's
                // organic mix of framed + free-floating icons.
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

      {/* Soft radial spotlight behind the grid for depth */}
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
