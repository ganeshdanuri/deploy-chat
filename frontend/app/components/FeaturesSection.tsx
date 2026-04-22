"use client";

export default function FeaturesSection() {
  return (
    <section id="features" className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:max-w-full lg:px-12 py-20 sm:py-28">
      <div className="text-center mb-14">
        <span className="eyebrow-pill">The platform</span>
        <h2 className="mt-6 text-3xl sm:text-4xl lg:text-[48px] leading-[1.08] font-semibold tracking-[-0.03em] mb-4 max-w-2xl mx-auto">
          Everything you need to run a{" "}
          <span className="hl-marker">real AI agent</span>.
        </h2>
        <p className="text-base sm:text-[17px] text-muted-foreground max-w-xl mx-auto leading-relaxed">
          From ingestion to deployment — ship in minutes, debug in production,
          and scale without rewriting a line.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
        {/* Ingest — wide left card */}
        <div className="md:col-span-4 bg-background border border-border rounded-2xl p-7 flex flex-col gap-5 min-h-[320px]">
          <div>
            <StepLabel step="01" label="Ingest" />
            <h3 className="text-xl font-semibold mt-3 mb-2 tracking-[-0.01em]">Connect every knowledge source</h3>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-md">
              Upload PDFs, crawl sites, or sync from Notion and Drive. Your agent
              re-indexes automatically as docs change.
            </p>
          </div>
          <div className="mt-auto bg-muted rounded-xl p-3.5 flex flex-col gap-2">
            <FileRow
              icon="N"
              iconBg="#1D2020"
              iconColor="#D4FB5F"
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
              status="● Indexing 84%"
              statusColor="var(--accent-gold)"
            />
          </div>
        </div>

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
            <div style={{ color: "#888" }}>// paste in &lt;head&gt;</div>
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
        <div className="md:col-span-2 bg-background border border-border rounded-2xl p-7 flex flex-col min-h-[260px]">
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
              <span className="text-xl font-semibold tracking-[-0.01em]">87%</span>
            </div>
            <svg viewBox="0 0 200 50" width="100%" height="50">
              <polyline
                points="0,40 25,35 50,38 75,28 100,22 125,18 150,14 175,10 200,8 200,50 0,50"
                fill="rgba(29,32,32,0.06)"
                stroke="none"
              />
              <polyline
                points="0,40 25,35 50,38 75,28 100,22 125,18 150,14 175,10 200,8"
                fill="none"
                stroke="#1D2020"
                strokeWidth="2"
              />
            </svg>
          </div>
        </div>

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
          <div className="mt-auto flex items-center gap-2">
            {["#1D2020","#D4FB5F","#0D9488","#EA580C","#7C3AED"].map((c, i) => (
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
          <div className="mt-auto flex flex-col gap-1.5">
            <ComplianceRow label="GDPR" status="Compliant" />
            <ComplianceRow label="SOC 2 Type II" status="In progress" />
            <ComplianceRow label="SSO / SAML" status="Available" />
          </div>
        </div>
      </div>
    </section>
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
        className="text-[11px] font-medium shrink-0 ml-3"
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
