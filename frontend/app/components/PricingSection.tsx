"use client";

import { HiCheck, HiSparkles, HiArrowRight, HiLightningBolt } from "react-icons/hi";
import { theme } from "../theme";
import { PRICING_PLANS as PLANS, PricingPlan as Plan } from "../../lib/constants";

// ─── Helpers ─────────────────────────────────────────────────────────────────

function getPlanHref(plan: Plan): string {
    if (plan.name === "Enterprise") return "mailto:sales@deploymind.com";
    return `/login?register=true&plan=${plan.name.toLowerCase()}`;
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function PlanPrice({ price, popular }: { price: string; popular?: boolean }) {
    if (price === "Custom") {
        return (
            <p className={`text-3xl font-bold tracking-tight ${popular ? "text-white" : "text-slate-900"}`}>
                Custom
            </p>
        );
    }
    return (
        <div className="flex items-baseline gap-1">
            <span className={`text-4xl font-bold tabular-nums tracking-tight ${popular ? "text-white" : "text-slate-900"}`}>
                ${price}
            </span>
            <span className={`text-sm font-medium ${popular ? "" : "text-slate-500"}`} style={popular ? { color: theme.colors.primary.light } : {}}>/mo</span>
        </div>
    );
}

function FeatureItem({ feature, popular }: { feature: string; popular?: boolean }) {
    return (
        <li className="flex items-start gap-3">
            <span
                aria-hidden="true"
                className={`mt-0.5 flex-shrink-0 rounded-full p-0.5 ${popular ? "text-white" : ""
                    }`}
                style={popular ? { backgroundColor: theme.colors.primary.main } : { backgroundColor: `${theme.colors.primary.main}18`, color: theme.colors.primary.main }}
            >
                <HiCheck className="h-3.5 w-3.5" />
            </span>
            <span className={`text-sm leading-relaxed ${popular ? "" : "text-slate-600"}`} style={popular ? { color: `${theme.colors.primary.lightest}` } : {}}>
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
                "relative flex flex-col rounded-3xl border p-8 transition-shadow duration-200",
                plan.popular
                    ? "shadow-2xl"
                    : "border-slate-200 bg-white shadow-sm hover:shadow-md",
            ].join(" ")}
            style={plan.popular ? { borderColor: theme.colors.primary.main, backgroundColor: theme.colors.primary.main, boxShadow: `0 25px 50px -12px ${theme.colors.primary.main}4d` } : {}}
        >
            {/* Popular badge */}
            {plan.popular && (
                <div className="mb-6 -mt-2 flex items-center gap-1.5 self-start rounded-full bg-amber-400 px-3 py-1">
                    <HiLightningBolt className="h-3.5 w-3.5 text-amber-900" aria-hidden="true" />
                    <span className="text-xs font-semibold uppercase tracking-widest text-amber-900">
                        Most popular
                    </span>
                </div>
            )}

            {/* Plan name */}
            <h3
                className="mb-1 text-xs font-semibold uppercase tracking-widest"
                style={{ color: plan.popular ? theme.colors.primary.light : theme.colors.primary.main }}
            >
                {plan.name}
            </h3>

            {/* Price */}
            <div className="mb-3">
                <PlanPrice price={plan.price} popular={plan.popular} />
            </div>

            {/* Description */}
            <p className={`mb-8 text-sm leading-relaxed ${plan.popular ? "" : "text-slate-500"}`} style={plan.popular ? { color: theme.colors.primary.lighter } : {}}>
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
                    "mt-auto flex items-center justify-center gap-2 rounded-xl px-6 py-3.5 text-sm font-semibold",
                    "transition-all duration-150 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2",
                    plan.popular
                        ? "bg-white focus-visible:outline-white"
                        : "border border-slate-200 bg-slate-50 text-slate-800 hover:bg-white focus-visible:outline-indigo-600",
                ].join(" ")}
                style={plan.popular ? { color: theme.colors.primary.main } : {}}
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
            className="bg-slate-50 py-20 sm:py-24"
        >
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
                {/* Header */}
                <div className="mx-auto mb-16 max-w-2xl text-center">
                    <div className="mb-4 inline-flex items-center gap-2 rounded-full border bg-white px-3 py-1 text-xs font-semibold uppercase tracking-widest shadow-sm" style={{ borderColor: `${theme.colors.primary.main}20`, color: theme.colors.primary.main }}>
                        <HiSparkles className="h-3.5 w-3.5" aria-hidden="true" />
                        Pricing
                    </div>

                    <h2
                        id="pricing-heading"
                        className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl"
                    >
                        Simple pricing that scales with you
                    </h2>

                    <p className="mt-4 text-lg text-slate-600">
                        No hidden fees. No surprise overages. Cancel any time.
                    </p>
                </div>

                {/* Grid */}
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4 lg:gap-8">
                    {PLANS.map((plan) => (
                        <PlanCard key={plan.name} plan={plan} />
                    ))}
                </div>

                {/* Enterprise footnote */}
                <p className="mt-12 text-center text-sm text-slate-500">
                    Need a custom volume deal or dedicated infrastructure?{" "}
                    <a
                        href="mailto:sales@deploymind.com"
                        className="font-semibold underline-offset-2 hover:underline"
                        style={{ color: theme.colors.primary.main }}
                    >
                        Talk to our sales team
                    </a>
                    .
                </p>
            </div>
        </section>
    );
}