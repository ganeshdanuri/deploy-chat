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
            <p className={`text-4xl font-semibold tracking-tight ${popular ? "text-white" : "text-[#000000]"}`}>
                Custom
            </p>
        );
    }
    return (
        <div className="flex items-baseline gap-1">
            <span className={`text-4xl font-semibold tabular-nums tracking-tight ${popular ? "text-white" : "text-[#000000]"}`}>
                ${price}
            </span>
            <span className={`text-sm font-normal ${popular ? "text-white/70" : "text-[#a1a1a1]"}`}>/mo</span>
        </div>
    );
}

function FeatureItem({ feature, popular }: { feature: string; popular?: boolean }) {
    return (
        <li className="flex items-start gap-3">
            <span
                aria-hidden="true"
                className={`mt-0.5 flex-shrink-0 rounded-full p-0.5 ${popular ? "text-[#262ef2] bg-white" : "text-white bg-[#262ef2]"
                    }`}
            >
                <HiCheck className="h-3.5 w-3.5" />
            </span>
            <span className={`text-base leading-relaxed ${popular ? "text-white/90" : "text-[#4d5564]"}`}>
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
                "relative flex flex-col rounded-xl p-8 transition-shadow duration-200",
                plan.popular
                    ? "shadow-2xl bg-[#262ef2]"
                    : "bg-white shadow-sm hover:shadow-md",
            ].join(" ")}
            style={plan.popular ? { boxShadow: `0 25px 50px -12px #262ef24d` } : {}}
        >
            {/* Popular badge */}
            {plan.popular && (
                <div className="mb-6 -mt-2 flex items-center gap-1.5 self-start rounded-lg bg-white/20 px-3 py-1">
                    <HiLightningBolt className="h-3.5 w-3.5 text-white" aria-hidden="true" />
                    <span className="text-xs font-medium uppercase tracking-widest text-white">
                        Most popular
                    </span>
                </div>
            )}

            {/* Plan name */}
            <h3
                className={`mb-1 text-sm font-medium uppercase tracking-widest ${plan.popular ? "text-white/80" : "text-[#262ef2]"}`}
            >
                {plan.name}
            </h3>

            {/* Price */}
            <div className="mb-3">
                <PlanPrice price={plan.price} popular={plan.popular} />
            </div>

            {/* Description */}
            <p className={`mb-8 text-base leading-relaxed ${plan.popular ? "text-white/80" : "text-[#a1a1a1]"}`}>
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
                    "mt-auto flex items-center justify-center gap-2 rounded-lg px-6 py-3.5 text-sm font-medium",
                    "transition-all duration-150 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2",
                    plan.popular
                        ? "bg-white text-[#262ef2] hover:bg-white/90 focus-visible:outline-white"
                        : "bg-[#f3f3f9] text-[#201F3B] hover:bg-[#e3e3e3] focus-visible:outline-indigo-600",
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
            className="bg-[#f3f3f9] py-20 sm:py-24"
        >
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
                {/* Header */}
                <div className="mx-auto mb-16 max-w-2xl text-center">
                    <div className="mb-4 inline-flex items-center gap-2 rounded-lg bg-white px-3 py-1 text-xs font-medium uppercase tracking-widest shadow-sm text-[#262ef2]">
                        <HiSparkles className="h-3.5 w-3.5" aria-hidden="true" />
                        Pricing
                    </div>

                    <h2
                        id="pricing-heading"
                        className="text-[44px] font-semibold tracking-tight text-[#000000] leading-tight"
                    >
                        Simple pricing that scales with you
                    </h2>

                    <p className="mt-4 text-lg text-[#4d5564]">
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
                <p className="mt-12 text-center text-sm text-[#a1a1a1]">
                    Need a custom volume deal or dedicated infrastructure?{" "}
                    <a
                        href="mailto:sales@deploymind.com"
                        className="font-medium underline-offset-2 hover:underline text-[#262ef2]"
                    >
                        Talk to our sales team
                    </a>
                    .
                </p>
            </div>
        </section>
    );
}