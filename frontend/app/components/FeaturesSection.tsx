"use client";

import { useEffect, useState } from "react";
import { useReveal } from "@/lib/hooks/useReveal";
import { useInView } from "@/lib/hooks/useInView";
import { usePrefersReducedMotion } from "@/lib/hooks/usePrefersReducedMotion";

/**
 * When each card's interior motion starts, measured from its own in-view trigger.
 *
 * Ingest sits at the top of the grid, so its observer fires at roughly the same
 * moment .reveal-group starts fading the cards up — it has to wait out its own
 * entrance or the rows ladder in while the card is still translucent. Row two
 * is fully settled by the time it scrolls into view, so those three only need
 * enough offset to sweep left-to-right instead of firing as one block.
 */
const INTERIOR_DELAY = {
  ingest: 350,
  measure: 150,
  brand: 330,
  secure: 510,
};

/** Eases a number from 0 to `target` once `active` goes true. */
function useCountUp(target: number, active: boolean, duration = 1100, delay = 0) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!active) return;
    let raf = 0;
    let start: number | null = null;

    const tick = (ts: number) => {
      start ??= ts;
      const elapsed = ts - start - delay;
      if (elapsed < 0) {
        raf = requestAnimationFrame(tick);
        return;
      }
      const p = Math.min(1, elapsed / duration);
      setValue(Math.round(target * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [active, target, duration, delay]);

  return value;
}

export default function FeaturesSection() {
  const headerRef = useReveal<HTMLDivElement>();
  const gridRef = useReveal<HTMLDivElement>();
  const [swatchRef, swatchIn] = useInView<HTMLDivElement>({
    delay: INTERIOR_DELAY.brand,
  });
  const [complianceRef, complianceIn] = useInView<HTMLDivElement>({
    delay: INTERIOR_DELAY.secure,
  });

  return (
    <section id="features" className="section-alt">
      <div className="container-page py-20 sm:py-28">
        {/* Left-aligned split. Connectors keeps the centred treatment, so the
            page alternates asymmetric / centred / asymmetric / centred instead
            of running the same header shape four times. */}
        <div
          ref={headerRef}
          className="reveal mb-14 grid gap-6 lg:grid-cols-[1.15fr_1fr] lg:items-end"
        >
          <div>
            <span className="eyebrow-pill">The platform</span>
            <h2 className="h-section mt-6 max-w-xl">
              Everything you need to run a real AI agent.
            </h2>
          </div>
          <p className="text-base sm:text-[17px] text-muted-foreground leading-relaxed max-w-lg lg:pb-1">
            From ingestion to deployment — ship in minutes, debug in production,
            and scale without rewriting a line.
          </p>
        </div>

        <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-6 gap-4 reveal-group">
          {/* Ingest — wide left card */}
          <IngestCard />

          {/* Embed — narrow right */}
          <div className="md:col-span-2 bg-background border border-border rounded-2xl p-7 flex flex-col min-h-[320px]">
            <div>
              <StepLabel step="02" label="Embed" />
              <h3 className="text-xl font-semibold mt-3 mb-2 tracking-[-0.01em]">One line. Any site.</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Works with React, Next, Vue, WordPress, Webflow, Shopify, or any
                raw HTML.
              </p>
            </div>
            <div
              className="mt-auto rounded-xl p-3.5 font-mono text-[11px] leading-[1.6] overflow-x-auto"
              style={{ background: "#1D2020", color: "#E5E5E5" }}
  >
              <div style={{ color: "#888" }}>{"// paste in <head>"}</div>
              <div>
                <span style={{ color: "#F07178" }}>&lt;script</span>{""}
                <span style={{ color: "#C3E88D" }}>src</span>=
                <span style={{ color: "#FFCB6B" }}>&quot;//cdn.deploychat</span>
              </div>
              <div style={{ color: "#FFCB6B" }}>&nbsp;&nbsp;.in/agent/acme.js&quot;</div>
              <div>
                <span style={{ color: "#C3E88D" }}>async</span>
                <span style={{ color: "#F07178" }}>&gt;&lt;/script&gt;</span>
              </div>
            </div>
          </div>

          {/* Analytics */}
          <MeasureCard />

          {/* Branding */}
          <div className="md:col-span-2 bg-background border border-border rounded-2xl p-7 flex flex-col min-h-[260px]">
            <div>
              <StepLabel step="04" label="Brand" />
              <h3 className="text-xl font-semibold mt-3 mb-2 tracking-[-0.01em]">Make it feel native</h3>
              <p className="text-sm text-muted-foreground leading-relaxed mb-5">
                Custom colors, avatar, persona, and tone. No watermarks on any
                paid plan.
              </p>
            </div>
            <div
              ref={swatchRef}
              data-in={swatchIn ? "" : undefined}
              className="mt-auto flex items-center gap-2 mech-group is-pop"
            >
              {["#1D2020","#0052FF","#0D9488","#EA580C","#7C3AED"].map((c, i) => (
                <div
                  key={i}
                  className="w-8 h-8 rounded-full border-2 border-background"
                  style={{ background: c, boxShadow: "0 0 0 1px var(--border)" }}
                />
              ))}
              <div
                className="w-8 h-8 rounded-full border-2 border-background flex items-center justify-center text-sm"
                style={{
                  background: "var(--muted)",
                  color: "var(--muted-foreground)",
                  boxShadow: "0 0 0 1px var(--border)",
                }}
  >
                +
              </div>
            </div>
          </div>

          {/* Security */}
          <div className="md:col-span-2 bg-background border border-border rounded-2xl p-7 flex flex-col min-h-[260px]">
            <div>
              <StepLabel step="05" label="Secure" />
              <h3 className="text-xl font-semibold mt-3 mb-2 tracking-[-0.01em]">Enterprise-ready</h3>
              <p className="text-sm text-muted-foreground leading-relaxed mb-5">
                Your data never trains our models. Encryption at rest and in
                transit.
              </p>
            </div>
            <div
              ref={complianceRef}
              data-in={complianceIn ? "" : undefined}
              className="mt-auto flex flex-col gap-1.5 mech-group"
            >
              <ComplianceRow label="GDPR" status="Compliant" />
              <ComplianceRow label="SOC 2 Type II" status="In progress" />
              <ComplianceRow label="SSO / SAML" status="Available" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function IngestCard() {
  const [ref, entered] = useInView<HTMLDivElement>({
    delay: INTERIOR_DELAY.ingest,
  });
  const reduced = usePrefersReducedMotion();

  // 84 → 100. The count is offset so it begins after the rows have landed.
  const gained = useCountUp(16, entered && !reduced, 1600, 400);
  const percent = 84 + gained;
  const synced = reduced || percent >= 100;

  return (
    <div
      ref={ref}
      className="md:col-span-4 bg-background border border-border rounded-2xl p-7 flex flex-col gap-5 min-h-[320px]"
    >
      <div>
        <StepLabel step="01" label="Ingest" />
        <h3 className="text-xl font-semibold mt-3 mb-2 tracking-[-0.01em]">Connect every knowledge source</h3>
        <p className="text-sm text-muted-foreground leading-relaxed max-w-md">
          Upload PDFs, crawl sites, or sync from Notion and Drive. Your agent
          re-indexes automatically as docs change.
        </p>
      </div>
      <div
        data-in={entered || reduced ? "" : undefined}
        className="mt-auto bg-muted rounded-xl p-3.5 flex flex-col gap-2 mech-group"
      >
        <FileRow
          icon="N"
          iconBg="var(--blue)"
          iconColor="var(--blue-ink)"
          name="Product spec — Engineering wiki"
          status="● Synced · 2m ago"
          statusColor="var(--accent-green)"
        />
        <FileRow
          icon="P"
          iconBg="#FEE2E2"
          iconColor="#B91C1C"
          name="api-reference.pdf"
          status="● Synced"
          statusColor="var(--accent-green)"
        />
        <FileRow
          icon="W"
          iconBg="#DCFCE7"
          iconColor="#166534"
          name="acme.com · crawled 412 pages"
          status={synced ? "● Synced" : `● Indexing ${percent}%`}
          statusColor={synced ? "var(--accent-green)" : "var(--accent-gold)"}
        />
      </div>
    </div>
  );
}

const SPARK = "0,40 25,35 50,38 75,28 100,22 125,18 150,14 175,10 200,8";

function MeasureCard() {
  const [ref, entered] = useInView<HTMLDivElement>({
    delay: INTERIOR_DELAY.measure,
  });
  const reduced = usePrefersReducedMotion();
  const counted = useCountUp(87, entered && !reduced);
  const shown = reduced ? 87 : counted;
  const drawn = entered || reduced;

  return (
    <div
      ref={ref}
      className="md:col-span-2 bg-background border border-border rounded-2xl p-7 flex flex-col min-h-[260px]"
    >
      <div>
        <StepLabel step="03" label="Measure" />
        <h3 className="text-xl font-semibold mt-3 mb-2 tracking-[-0.01em]">Analytics that matter</h3>
        <p className="text-sm text-muted-foreground leading-relaxed mb-5">
          See what users ask, where answers fall short, and which docs to fix.
        </p>
      </div>
      <div className="mt-auto">
        <div className="flex justify-between items-baseline mb-1.5">
          <span className="text-xs text-muted-foreground">Resolution rate</span>
          <span
            className="text-xl font-semibold tracking-[-0.01em] tabular-nums"
            style={{ color: "var(--blue)" }}
          >
            {shown}%
          </span>
        </div>
        <svg viewBox="0 0 200 50" width="100%" height="50" aria-hidden="true">
          <polyline
            points={`${SPARK} 200,50 0,50`}
            fill="var(--blue-soft)"
            stroke="none"
            className="spark-fill"
            data-drawn={drawn ? "" : undefined}
          />
          <polyline
            points={SPARK}
            fill="none"
            stroke="var(--blue)"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="spark-line"
            data-drawn={drawn ? "" : undefined}
          />
        </svg>
      </div>
    </div>
  );
}

function StepLabel({ step, label }: { step: string; label: string }) {
  return (
    <div className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.1em] text-muted-foreground">
      <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-muted text-muted-foreground text-[10px] font-bold border border-border">
        {step}
      </span>
      {label}
    </div>
  );
}

function FileRow({
  icon,
  iconBg,
  iconColor,
  name,
  status,
  statusColor,
}: {
  icon: string;
  iconBg: string;
  iconColor: string;
  name: string;
  status: string;
  statusColor: string;
}) {
  return (
    <div className="flex items-center justify-between px-3 py-2 bg-background rounded-md text-[12px]">
      <div className="flex items-center gap-2.5 min-w-0">
        <div
          className="w-5 h-5 rounded-sm flex items-center justify-center text-[10px] font-medium shrink-0"
          style={{ background: iconBg, color: iconColor }}
>
          {icon}
        </div>
        <span className="truncate">{name}</span>
      </div>
      <span
        className="text-[11px] font-medium shrink-0 ml-3 tabular-nums"
        style={{ color: statusColor }}
>
        {status}
      </span>
    </div>
  );
}

function ComplianceRow({ label, status }: { label: string; status: string }) {
  return (
    <div className="flex items-center justify-between text-xs px-3 py-1.5 bg-muted rounded-lg">
      <span>{label}</span>
      <span className="font-medium" style={{ color: "var(--accent-green)" }}>
        ✓ {status}
      </span>
    </div>
  );
}
