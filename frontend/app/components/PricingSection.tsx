"use client";

import { Button } from "@/components/ui/button";
import { useReveal } from "@/lib/hooks/useReveal";

type Tier = {
  name: string;
  price: string;
  priceSuffix?: string;
  tagline: string;
  cta: string;
  ctaVariant: "default" |"outline";
  href: string;
  highlight?: boolean;
  featuresLabel: string;
  features: string[];
};

const TIERS: Tier[] = [
  {
    name: "Free",
    price: "$0",
    priceSuffix: "/mo",
    tagline: "Kick the tires.",
    cta: "Start free",
    ctaVariant: "outline",
    href: "/login?register=true&plan=free",
    featuresLabel: "INCLUDES",
    features: ["1 agent","10 messages total","Basic analytics","Community support"],
  },
  {
    name: "Starter",
    price: "$19",
    priceSuffix: "/mo",
    tagline: "Side projects and small sites.",
    cta: "Get started",
    ctaVariant: "outline",
    href: "/login?register=true&plan=starter",
    featuresLabel: "EVERYTHING IN FREE, PLUS",
    features: ["1,000 messages / mo","Standard analytics","Email support"],
  },
  {
    name: "Professional",
    price: "$49",
    priceSuffix: "/mo",
    tagline: "Scaling startups with real volume.",
    cta: "Start Professional →",
    ctaVariant: "default",
    href: "/login?register=true&plan=professional",
    highlight: true,
    featuresLabel: "EVERYTHING IN STARTER, PLUS",
    features: [
"5 agents",
"10,000 messages / mo",
"Advanced analytics",
"Priority support",
"Remove branding",
    ],
  },
  {
    name: "Enterprise",
    price: "Custom",
    tagline: "White-labeled infrastructure.",
    cta: "Talk to sales",
    ctaVariant: "outline",
    href: "mailto:sales@deploymind.com",
    featuresLabel: "EVERYTHING IN PRO, PLUS",
    features: [
"Unlimited agents",
"Dedicated infra",
"SLA support",
"SSO / SAML",
"Security audits",
    ],
  },
];

export default function PricingSection() {
  const headerRef = useReveal<HTMLDivElement>();
  const gridRef = useReveal<HTMLDivElement>();
  return (
    <section
      id="pricing"
      className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:max-w-full lg:px-12 py-20 sm:py-28"
>
      <div ref={headerRef} className="text-center mb-14 reveal">
        <span className="eyebrow-pill">Pricing</span>
        <h2 className="mt-6 text-3xl sm:text-4xl lg:text-[48px] leading-[1.08] font-semibold tracking-[-0.03em] mb-4">
          Predictable pricing.{" "}
          <span className="hl-marker">No surprises</span>.
        </h2>
        <p className="text-base sm:text-[17px] text-muted-foreground max-w-lg mx-auto leading-relaxed">
          Start free, upgrade when you&apos;re ready. Cancel any time.
        </p>
      </div>

      <div ref={gridRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 reveal">
        {TIERS.map((tier) => (
          <div
            key={tier.name}
            className="relative bg-background rounded-2xl p-7 flex flex-col"
            style={{
              border: tier.highlight
                ? "2px solid #1D2020"
                : "1px solid var(--border)",
              boxShadow: tier.highlight
                ? "0 8px 24px rgba(29,32,32,0.08)"
                : "none",
            }}
>
            {tier.highlight && (
              <div
                className="absolute -top-3 left-6 text-[11px] font-semibold px-2.5 py-1 rounded-full"
                style={{ background: "var(--lime)", color: "var(--lime-ink)" }}
>
                Most popular
              </div>
            )}

            <h3 className="text-[15px] font-semibold mb-1.5">{tier.name}</h3>
            <p className="text-xs text-muted-foreground leading-relaxed mb-5 min-h-[34px]">
              {tier.tagline}
            </p>

            <div className="flex items-baseline gap-1 mb-5">
              <span className="text-4xl font-semibold tracking-[-0.03em]">
                {tier.price}
              </span>
              {tier.priceSuffix && (
                <span className="text-sm text-muted-foreground">
                  {tier.priceSuffix}
                </span>
              )}
            </div>

            <Button
              asChild
              variant={tier.ctaVariant}
              className="w-full mb-6 btn-pill"
>
              <a href={tier.href}>{tier.cta}</a>
            </Button>

            <div className="text-[11px] font-semibold text-muted-foreground mb-2.5 tracking-[0.08em] uppercase">
              {tier.featuresLabel}
            </div>
            <ul className="flex flex-col gap-2 text-[13px]">
              {tier.features.map((f) => (
                <li key={f} className="flex gap-2">
                  <span className="inline-flex items-center justify-center shrink-0 w-4 h-4 mt-0.5 rounded-full bg-muted text-muted-foreground text-[9px] font-bold">
                    ✓
                  </span>
                  <span>{f}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
