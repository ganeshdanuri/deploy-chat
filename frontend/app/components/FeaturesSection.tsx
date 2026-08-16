"use client";

import { useEffect, useState } from "react";
import {
  Check,
  Code2,
  Copy,
  Database,
  Palette,
  ShieldCheck,
  TrendingUp,
  type LucideIcon,
} from "lucide-react";
import { useReveal } from "@/lib/hooks/useReveal";
import { useInView } from "@/lib/hooks/useInView";
import { usePrefersReducedMotion } from "@/lib/hooks/usePrefersReducedMotion";
import WidgetControls from "./WidgetControls";

/** Row-two cards are already settled when they scroll in, so their delays only
 *  sweep the entrance left-to-right rather than firing as one block. */
const DELAY = { ingest: 300, embed: 150, measure: 300, brand: 200, secure: 380 };

function useCountUp(target: number, active: boolean, duration = 1200, delay = 0) {
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

  return (
    <section id="features" className="section-alt">
      <div className="container-page py-24 sm:py-32">
        <div ref={headerRef} className="reveal mb-14 flex flex-col items-center text-center">
          <span className="eyebrow-pill">The platform</span>
          <h2 className="h-section mt-6 mb-4 max-w-2xl">
            Everything between your docs and a working agent.
          </h2>
          <p className="text-base sm:text-[17px] text-muted-foreground leading-relaxed max-w-xl">
            Connect a source, add one line of code — then see exactly what
            people ask, and where the answers fall short.
          </p>
        </div>

        {/* 2·2·2 over 3·3 — an even top row reads calmer than the old 4+2. */}
        <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-6 gap-4 reveal-group">
          <IngestCard />
          <EmbedCard />
          <MeasureCard />
          <BrandCard />
          <SecureCard />
        </div>
      </div>
    </section>
  );
}

/* ── Cards ─────────────────────────────────────────────────────────────── */

function IngestCard() {
  const [ref, entered] = useInView<HTMLDivElement>({ delay: DELAY.ingest });
  const reduced = usePrefersReducedMotion();
  const gained = useCountUp(16, entered && !reduced, 1500, 250);
  const pct = 84 + gained;
  const done = reduced || pct >= 100;

  return (
    <Card ref={ref} span={2} Icon={Database} title="Connect any source"
      body="PDFs, sites, Notion, Drive, Postgres — kept up to date as they change.">
      <div data-in={entered || reduced ? "" : undefined} className="flex flex-col gap-1.5 mech-group">
        <Row label="Product spec" note="Notion" tone="green" status="Synced" />
        <Row label="api-reference.pdf" note="Upload" tone="green" status="Synced" />
        <Row label="acme.com" note="Crawl" tone={done ? "green" : "gold"} status={done ? "Synced" : `${pct}%`} />
      </div>
    </Card>
  );
}

const SNIPPET = `<script src="//cdn.deploychat.in/w.js"
  data-agent="acme" async></script>`;

function EmbedCard() {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(SNIPPET.replace(/\n\s+/g, " "));
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      /* clipboard blocked on insecure origins — text stays selectable */
    }
  };

  return (
    <Card span={2} Icon={Code2} title="One line, any site"
      body="React, Next, Vue, WordPress, Webflow, or raw HTML.">
      <div className="relative rounded-xl p-4 pr-11 font-mono text-[11px] leading-[1.8]" style={{ background: "#1D2020" }}>
        <button
          type="button"
          onClick={copy}
          aria-label="Copy embed snippet"
          className="absolute top-2.5 right-2.5 w-7 h-7 rounded-md flex items-center justify-center text-white/45 hover:text-white hover:bg-white/10 transition-colors"
        >
          {copied ? <Check className="w-3.5 h-3.5" strokeWidth={2.5} /> : <Copy className="w-3.5 h-3.5" strokeWidth={2} />}
        </button>
        <div className="text-white/45">&lt;script</div>
        <div style={{ color: "var(--blue-on-dark)" }}>&nbsp;&nbsp;src=&quot;//cdn.deploychat.in/w.js&quot;</div>
        <div className="text-white/45">&nbsp;&nbsp;async&gt;&lt;/script&gt;</div>
      </div>
    </Card>
  );
}

const SPARK = "0,40 25,35 50,38 75,28 100,22 125,18 150,14 175,10 200,8";

function MeasureCard() {
  const [ref, entered] = useInView<HTMLDivElement>({ delay: DELAY.measure });
  const reduced = usePrefersReducedMotion();
  const counted = useCountUp(87, entered && !reduced);
  const value = reduced ? 87 : counted;
  const drawn = entered || reduced;

  return (
    <Card ref={ref} span={2} Icon={TrendingUp} title="See what's working"
      body="Which questions land, and which docs need fixing.">
      <div>
        <div className="text-[44px] leading-none font-semibold tracking-[-0.03em] tabular-nums" style={{ color: "var(--blue)" }}>
          {value}%
        </div>
        <div className="text-[12px] text-muted-foreground mt-1.5 mb-3">Resolution rate</div>
        <svg viewBox="0 0 200 50" width="100%" height="52" aria-hidden="true">
          <polyline points={`${SPARK} 200,50 0,50`} fill="var(--blue-soft)" stroke="none" className="spark-fill" data-drawn={drawn ? "" : undefined} />
          <polyline points={SPARK} fill="none" stroke="var(--blue)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="spark-line" data-drawn={drawn ? "" : undefined} />
        </svg>
      </div>
    </Card>
  );
}

function BrandCard() {
  const [ref, entered] = useInView<HTMLDivElement>({ delay: DELAY.brand });
  return (
    <Card ref={ref} span={3} Icon={Palette} title="Match your brand"
      body="Colour, shape, avatar and tone. These controls change the live bubble in the corner — and stay in step with the ones in the hero.">
      <div data-in={entered ? "" : undefined} className="mech-group">
        <WidgetControls size={30} />
      </div>
    </Card>
  );
}

function SecureCard() {
  const [ref, entered] = useInView<HTMLDivElement>({ delay: DELAY.secure });
  return (
    <Card ref={ref} span={3} Icon={ShieldCheck} title="Enterprise-ready"
      body="Your content is never used to train base models.">
      <div data-in={entered ? "" : undefined} className="grid sm:grid-cols-2 gap-1.5 mech-group">
        <Row label="GDPR" tone="green" status="Compliant" />
        <Row label="SOC 2 Type II" tone="gold" status="In progress" />
        <Row label="SSO / SAML" tone="green" status="Available" />
        <Row label="Encryption" tone="green" status="AES-256" />
      </div>
    </Card>
  );
}

/* ── Shared ────────────────────────────────────────────────────────────── */

/** One row treatment across every card, so the panels read as one system. */
function Row({ label, note, status, tone }: {
  label: string; note?: string; status: string; tone: "green" | "gold";
}) {
  const color = tone === "green" ? "var(--accent-green)" : "var(--accent-gold)";
  return (
    <div className="flex items-center justify-between gap-3 bg-muted rounded-lg px-3 py-2.5">
      <span className="text-[12.5px] truncate">
        {label}
        {note && <span className="text-muted-foreground"> · {note}</span>}
      </span>
      <span className="flex items-center gap-1.5 shrink-0 text-[11px] font-medium tabular-nums" style={{ color }}>
        <span className="w-1.5 h-1.5 rounded-full" style={{ background: color }} />
        {status}
      </span>
    </div>
  );
}

function Card({ ref, span, Icon, title, body, children }: {
  ref?: React.Ref<HTMLDivElement>;
  span: 2 | 3;
  Icon: LucideIcon;
  title: string;
  body: string;
  children: React.ReactNode;
}) {
  return (
    <div
      ref={ref}
      className={`feature-card bg-background border border-border rounded-2xl p-8 flex flex-col ${
        span === 2 ? "md:col-span-2" : "md:col-span-3"
      }`}
    >
      <Icon className="w-5 h-5 mb-5" strokeWidth={1.75} style={{ color: "var(--blue)" }} />
      <h3 className="text-[17px] font-semibold tracking-[-0.01em] mb-2">{title}</h3>
      <p className="text-[13.5px] text-muted-foreground leading-relaxed mb-7 max-w-sm">{body}</p>
      <div className="mt-auto">{children}</div>
    </div>
  );
}
