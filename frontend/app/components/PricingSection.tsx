"use client";

import { HiCheck, HiArrowRight, HiLightningBolt } from "react-icons/hi";
import { PRICING_PLANS as PLANS, PricingPlan as Plan, PAGE_CONTENT } from "../../lib/constants";

// ─── Helpers ─────────────────────────────────────────────────────────────────

function getPlanHref(plan: Plan): string {
    if (plan.name === "Enterprise") return "mailto:sales@deploymind.com";
    return `/login?register=true&plan=${plan.name.toLowerCase()}`;
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function PlanPrice({ price, popular }: { price: string; popular?: boolean }) {
    if (price === "Custom") {
        return (
            <p className={`text-4xl font-semibold tracking-tight ${popular ? "text-white" : "text-foreground"}`}>
                Custom
            </p>
        );
    }
    return (
        <div className="flex items-baseline gap-1">
            <span className={`text-4xl font-semibold tabular-nums tracking-tight ${popular ? "text-white" : "text-foreground"}`}>
                ${price}
            </span>
            <span className={`text-sm font-normal ${popular ? "text-white/70" : "text-muted-foreground"}`}>/mo</span>
        </div>
    );
}

function FeatureItem({ feature, popular }: { feature: string; popular?: boolean }) {
    return (
        <li className="flex items-start gap-3">
            <span
                aria-hidden="true"
                className={`mt-0.5 flex-shrink-0 rounded-full p-0.5 ${popular ? "text-primary bg-white" : "text-white gradient-bg"
                    }`}
            >
                <HiCheck className="h-3.5 w-3.5" />
            </span>
            <span className={`text-[15px] leading-relaxed ${popular ? "text-white/90" : "text-muted-foreground"}`}>
                {feature}
            </span>
        </li>
    );
}

function PlanCard({ plan }: { plan: Plan }) {
    const href = getPlanHref(plan);
    const isExternal = href.startsWith("mailto:");

    // For popular plan — gradient border wrapper
    if (plan.popular) {
        return (
            <div className="relative rounded-2xl gradient-bg p-[2px] h-full"
                style={{ boxShadow: 'var(--shadow-accent-lg)' }}>
                <div className="h-full w-full rounded-[calc(1rem-2px)] bg-primary flex flex-col p-8">
                    {/* Popular badge */}
                    <div className="mb-6 -mt-2 flex items-center gap-2 self-start bg-white/15 backdrop-blur-sm rounded-full px-4 py-1.5">
                        <HiLightningBolt className="h-3.5 w-3.5 text-white" aria-hidden="true" />
                        <span className="font-mono text-[10px] font-medium uppercase tracking-[0.1em] text-white">
                            Most popular
                        </span>
                    </div>

                    {/* Plan name */}
                    <h3 className="mb-1 text-sm font-medium uppercase tracking-widest text-white/70">
                        {plan.name}
                    </h3>

                    {/* Price */}
                    <div className="mb-3">
                        <PlanPrice price={plan.price} popular />
                    </div>

                    {/* Description */}
                    <p className="mb-8 text-[15px] leading-relaxed text-white/70">
                        {plan.description}
                    </p>

                    {/* Features */}
                    <ul className="mb-10 flex flex-col gap-3" role="list">
                        {plan.features.map((feature) => (
                            <FeatureItem key={feature} feature={feature} popular />
                        ))}
                    </ul>

                    {/* CTA */}
                    <a
                        href={href}
                        target={isExternal ? "_blank" : undefined}
                        rel={isExternal ? "noopener noreferrer" : undefined}
                        className="mt-auto flex items-center justify-center gap-2 px-6 py-3.5 rounded-lg text-sm font-medium bg-white text-primary hover:bg-white/90 transition-all duration-200 active:scale-[0.98] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                    >
                        {plan.cta}
                        <HiArrowRight className="h-4 w-4" aria-hidden="true" />
                    </a>
                </div>
            </div>
        );
    }

    return (
        <div
            className="relative flex flex-col h-full rounded-2xl border border-border bg-white p-8 transition-all duration-300"
            style={{ boxShadow: 'var(--shadow-md)' }}
        >
            {/* Plan name */}
            <h3 className="mb-1 text-sm font-medium uppercase tracking-widest text-primary">
                {plan.name}
            </h3>

            {/* Price */}
            <div className="mb-3">
                <PlanPrice price={plan.price} />
            </div>

            {/* Description */}
            <p className="mb-8 text-[15px] leading-relaxed text-muted-foreground">
                {plan.description}
            </p>

            {/* Features */}
            <ul className="mb-10 flex flex-col gap-3" role="list">
                {plan.features.map((feature) => (
                    <FeatureItem key={feature} feature={feature} />
                ))}
            </ul>

            {/* CTA */}
            <a
                href={href}
                target={isExternal ? "_blank" : undefined}
                rel={isExternal ? "noopener noreferrer" : undefined}
                className="mt-auto flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl text-sm font-medium bg-muted text-foreground hover:bg-primary/5 hover:text-primary border border-border hover:border-primary/20 transition-all duration-200 active:scale-[0.98] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            >
                {plan.cta}
                <HiArrowRight className="h-4 w-4" aria-hidden="true" />
            </a>
        </div>
    );
}

// ─── Main export ─────────────────────────────────────────────────────────────

export default function PricingSection() {
    return (
        <section
            id="pricing"
            aria-labelledby="pricing-heading"
            className="relative py-16 lg:py-24 overflow-hidden bg-slate-50/50"
        >
            {/* Radial glow */}
            <div className="radial-glow w-[500px] h-[500px] top-0 right-0 bg-primary/[0.04]" />

            <div className="mx-auto max-w-7xl px-4 lg:px-8">
                {/* Header */}
                <div className="mb-10 text-center">
                    {/* Section label badge */}
                    <div className="flex items-center justify-center mb-6">
                        <div className="inline-flex items-center rounded-full border border-border bg-muted/50 px-3 py-1 shadow-sm">
                            <span className="text-sm font-medium text-foreground">
                                {PAGE_CONTENT.pricing.badge}
                            </span>
                        </div>
                    </div>

                    <h2
                        id="pricing-heading"
                        className="text-3xl md:text-[3.25rem] leading-[1.15] text-foreground mb-6"
                    >
                        {PAGE_CONTENT.pricing.headline}
                    </h2>

                    <p className="text-lg text-muted-foreground max-w-xl mx-auto leading-relaxed">
                        {PAGE_CONTENT.pricing.subtitle}
                    </p>
                </div>

                {/* Grid */}
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4 lg:gap-6 items-stretch">
                    {PLANS.map((plan) => (
                        <PlanCard key={plan.name} plan={plan} />
                    ))}
                </div>

                {/* Enterprise footnote */}
                <p className="mt-10 text-center text-sm text-muted-foreground">
                    Need a custom volume deal or dedicated infrastructure?{" "}
                    <a
                        href="mailto:sales@deploymind.com"
                        className="font-medium underline-offset-2 hover:underline text-primary"
                    >
                        Talk to our sales team
                    </a>
                    .
                </p>
            </div>
        </section>
    );
}