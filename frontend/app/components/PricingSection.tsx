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
            <p className={`text-4xl font-semibold tracking-tight ${popular ? "text-white" : "text-secondary"}`}>
                Custom
            </p>
        );
    }
    return (
        <div className="flex items-baseline gap-1">
            <span className={`text-4xl font-semibold tabular-nums tracking-tight ${popular ? "text-white" : "text-secondary"}`}>
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
                className={`mt-0.5 flex-shrink-0 rounded-full p-0.5 ${popular ? "text-primary bg-white" : "text-white bg-primary"
                    }`}
            >
                <HiCheck className="h-3.5 w-3.5" />
            </span>
            <span className={`text-base leading-relaxed ${popular ? "text-white/90" : "text-foreground"}`}>
                {feature}
            </span>
        </li>
    );
}

function PlanCard({ plan }: { plan: Plan }) {
    const href = getPlanHref(plan);
    const isExternal = href.startsWith("mailto:");

    return (
        <div
            className={[
                "relative flex flex-col p-8 transition-all duration-200",
                plan.popular
                    ? "shadow-2xl shadow-primary/30 bg-primary"
                    : "bg-white shadow-sm hover:shadow-md",
            ].join(" ")}
        >
            {/* Popular badge */}
            {plan.popular && (
                <div className="mb-6 -mt-2 flex items-center gap-1.5 self-start bg-white/20 px-3 py-1">
                    <HiLightningBolt className="h-3.5 w-3.5 text-white" aria-hidden="true" />
                    <span className="text-xs font-medium uppercase tracking-widest text-white">
                        Most popular
                    </span>
                </div>
            )}

            {/* Plan name */}
            <h3
                className={`mb-1 text-sm font-medium uppercase tracking-widest ${plan.popular ? "text-white/80" : "text-primary"}`}
            >
                {plan.name}
            </h3>

            {/* Price */}
            <div className="mb-3">
                <PlanPrice price={plan.price} popular={plan.popular} />
            </div>

            {/* Description */}
            <p className={`mb-8 text-base leading-relaxed ${plan.popular ? "text-white/80" : "text-muted-foreground"}`}>
                {plan.description}
            </p>

            {/* Features */}
            <ul className="mb-10 flex flex-col gap-3" role="list">
                {plan.features.map((feature) => (
                    <FeatureItem key={feature} feature={feature} popular={plan.popular} />
                ))}
            </ul>

            {/* CTA */}
            <a
                href={href}
                target={isExternal ? "_blank" : undefined}
                rel={isExternal ? "noopener noreferrer" : undefined}
                className={[
                    "mt-auto flex items-center justify-center gap-2 px-6 py-3.5 text-sm font-medium",
                    "transition-all duration-150 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2",
                    plan.popular
                        ? "bg-white text-primary hover:bg-white/90 focus-visible:outline-white"
                        : "bg-muted text-secondary hover:bg-border focus-visible:outline-indigo-600",
                ].join(" ")}
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
            className="bg-muted py-20 sm:py-24"
        >
            <div className="mx-auto max-w-[1400px] px-10">
                {/* Header */}
                <div className="mb-14 text-center">
                    <div className="flex items-center justify-center gap-3 mb-6">
                        <div className="w-8 h-[2px] bg-primary" />
                        <span className="text-xs font-semibold text-foreground tracking-wide uppercase">
                            {PAGE_CONTENT.pricing.badge}
                        </span>
                        <div className="w-8 h-[2px] bg-primary" />
                    </div>

                    <h2
                        id="pricing-heading"
                        className="text-[40px] md:text-[44px] font-semibold text-secondary mb-6 leading-tight tracking-tight"
                    >
                        {PAGE_CONTENT.pricing.headline}
                    </h2>

                    <p className="text-lg text-muted-foreground max-w-xl mx-auto leading-relaxed">
                        {PAGE_CONTENT.pricing.subtitle}
                    </p>
                </div>

                {/* Grid */}
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4 lg:gap-8">
                    {PLANS.map((plan) => (
                        <PlanCard key={plan.name} plan={plan} />
                    ))}
                </div>

                {/* Enterprise footnote */}
                <p className="mt-12 text-center text-sm text-muted-foreground">
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