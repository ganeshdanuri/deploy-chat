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
import { MessageSquare } from "lucide-react";
import type { ComponentType, CSSProperties } from "react";
import { useReveal } from "@/lib/hooks/useReveal";
import { useInView } from "@/lib/hooks/useInView";

type Source = {
  name: string;
  Icon: ComponentType<{ size?: number }>;
  color: string;
  y: number;
};

type PillStyle = CSSProperties & { "--logo": string };

/* Diagram coordinate space. Tiles are positioned as percentages of the same
   box the SVG uses, so lines and pills stay aligned at any width. */
const VB = { w: 1000, h: 420 };
const NODE = { x: 500, y: 210 };
const COL = { left: 120, right: 880 };
const ROWS = [40, 125, 210, 295, 380];

const LEFT: Source[] = [
  { name: "Notion", Icon: SiNotion, color: "#000000", y: ROWS[0] },
  { name: "Google Drive", Icon: SiGoogledrive, color: "#4285F4", y: ROWS[1] },
  { name: "Confluence", Icon: SiConfluence, color: "#172B4D", y: ROWS[2] },
  { name: "Dropbox", Icon: SiDropbox, color: "#0061FF", y: ROWS[3] },
  { name: "WordPress", Icon: SiWordpress, color: "#21759B", y: ROWS[4] },
];

const RIGHT: Source[] = [
  { name: "GitHub", Icon: SiGithub, color: "#181717", y: ROWS[0] },
  { name: "GitLab", Icon: SiGitlab, color: "#FC6D26", y: ROWS[1] },
  { name: "PostgreSQL", Icon: SiPostgresql, color: "#4169E1", y: ROWS[2] },
  { name: "Google Sheets", Icon: SiGooglesheets, color: "#34A853", y: ROWS[3] },
  { name: "Airtable", Icon: SiAirtable, color: "#18BFFF", y: ROWS[4] },
];

/** Both ends sit under an opaque pill, so the join is hidden at every scale. */
function pathFor(fromX: number, fromY: number) {
  const c1 = fromX + (NODE.x - fromX) * 0.42;
  const c2 = fromX + (NODE.x - fromX) * 0.62;
  return `M ${fromX} ${fromY} C ${c1} ${fromY}, ${c2} ${NODE.y}, ${NODE.x} ${NODE.y}`;
}

export default function ConnectorsSection() {
  const headerRef = useReveal<HTMLDivElement>();
  const outroRef = useReveal<HTMLDivElement>();
  const [gridRef, gridIn] = useInView<HTMLDivElement>({ threshold: 0.3 });
  const [mobileRef, mobileIn] = useInView<HTMLDivElement>();

  const all = [...LEFT, ...RIGHT];

  return (
    <section id="integrations" className="relative overflow-hidden">
      <div className="container-page py-24 sm:py-32">
        <div ref={headerRef} className="reveal text-center">
          <span className="eyebrow-pill">Knowledge sources</span>
          <h2 className="h-section mt-6 mb-4 max-w-3xl mx-auto">
            Connect everything.
            <br className="hidden sm:block" /> Answer from all of it.
          </h2>
        </div>

        {/* ── Convergence diagram (desktop) ── */}
        <div
          ref={gridRef}
          data-flowing={gridIn ? "" : undefined}
          className="relative mx-auto mt-16 hidden lg:block w-full max-w-[1000px]"
          style={{ aspectRatio: `${VB.w} / ${VB.h}` }}
        >
          <svg
            viewBox={`0 0 ${VB.w} ${VB.h}`}
            className="absolute inset-0 w-full h-full"
            aria-hidden="true"
          >
            {all.map((s, i) => {
              const x = i < LEFT.length ? COL.left : COL.right;
              const d = pathFor(x, s.y);
              return (
                <g key={s.name}>
                  <path
                    d={d}
                    className="flow-base"
                    style={{ animationDelay: `${i * 70}ms` }}
                  />
                  <path
                    d={d}
                    className="flow-line"
                    style={{ transitionDelay: `${600 + i * 70}ms` }}
                  />
                </g>
              );
            })}
          </svg>

          {all.map((s, i) => {
            const x = i < LEFT.length ? COL.left : COL.right;
            return (
              <SourcePill
                key={s.name}
                source={s}
                left={`${(x / VB.w) * 100}%`}
                top={`${(s.y / VB.h) * 100}%`}
                delay={i * 70}
                shown={gridIn}
              />
            );
          })}

          <div
            className="absolute z-10"
            style={{
              left: `${(NODE.x / VB.w) * 100}%`,
              top: `${(NODE.y / VB.h) * 100}%`,
              transform: "translate(-50%, -50%)",
            }}
          >
            <div className="agent-node">
              <span
                className="w-10 h-10 rounded-xl flex items-center justify-center mx-auto mb-2.5"
                style={{ background: "var(--blue)", color: "var(--blue-ink)" }}
              >
                <MessageSquare className="w-5 h-5" strokeWidth={1.9} />
              </span>
              <div className="text-[13px] font-semibold leading-tight">
                Your agent
              </div>
              <div className="text-[11px] text-muted-foreground mt-1 leading-snug">
                It knows all of them
              </div>
            </div>
          </div>
        </div>

        {/* ── Stacked fallback ── */}
        <div
          ref={mobileRef}
          data-in={mobileIn ? "" : undefined}
          className="lg:hidden mt-12 grid grid-cols-2 sm:grid-cols-3 gap-2.5 mech-group"
        >
          {all.map((s) => (
            <div
              key={s.name}
              className="source-pill !w-full"
              style={{ "--logo": s.color } as PillStyle}
            >
              <s.Icon size={15} />
              <span className="truncate">{s.name}</span>
            </div>
          ))}
        </div>

        <div ref={outroRef} className="reveal">
          <p className="mt-14 sm:mt-16 text-center text-base sm:text-[17px] text-muted-foreground max-w-xl mx-auto leading-relaxed">
            Upload PDFs, sync wikis, crawl websites, or connect databases —
            your agent picks up changes on its own, so answers never go stale.
          </p>

        </div>
      </div>
    </section>
  );
}

function SourcePill({
  source,
  left,
  top,
  delay,
  shown,
}: {
  source: Source;
  left: string;
  top: string;
  delay: number;
  shown: boolean;
}) {
  const { name, Icon, color } = source;
  return (
    <div
      className="absolute z-10"
      style={{ left, top, transform: "translate(-50%, -50%)" }}
    >
      <div
        className="source-pill"
        data-in={shown ? "" : undefined}
        style={
          {
            "--logo": color,
            transitionDelay: `${delay}ms`,
          } as PillStyle
        }
      >
        <Icon size={15} />
        <span>{name}</span>
      </div>
    </div>
  );
}
