"use client";

import { theme } from "../theme";
import { HiCheck, HiOutlineInformationCircle } from "react-icons/hi";

const plans = [
    {
        name: "Starter",
        price: "0",
        description: "Perfect for personal projects and small blogs.",
        features: [
            "1 AI Chatbot",
            "50 Messages / month",
            "10 Documents or 50k words",
            "Standard AI model",
            "Community support",
        ],
        cta: "Start for Free",
        popular: false,
        color: theme.colors.neutral[600],
    },
    {
        name: "Professional",
        price: "29",
        description: "Ideal for growing businesses and startups.",
        features: [
            "5 AI Chatbots",
            "2,000 Messages / month",
            "Unlimited Documents",
            "GPT-4o Advanced model",
            "Custom branding",
            "Priority email support",
        ],
        cta: "Start Free Trial",
        popular: true,
        color: theme.colors.primary.main,
    },
    {
        name: "Enterprise",
        price: "99",
        description: "For high-volume sites and complex teams.",
        features: [
            "Unlimited Chatbots",
            "10,000 Messages / month",
            "API Access",
            "White-label options",
            "Custom integrations",
            "Dedicated account manager",
        ],
        cta: "Contact Sales",
        popular: false,
        color: theme.colors.accent.purple,
    },
];

export default function PricingSection() {
    return (
        <section id="pricing" className="py-24 bg-slate-50">
            <div className="max-w-7xl mx-auto px-6">
                <div className="text-center max-w-3xl mx-auto mb-20">
                    <h2
                        className="text-sm font-bold tracking-widest uppercase mb-3"
                        style={{ color: theme.colors.primary.main }}
                    >
                        Pricing Plans
                    </h2>
                    <h3
                        className="text-4xl md:text-5xl font-bold mb-6"
                        style={{ color: theme.colors.neutral[900] }}
                    >
                        Scales with your business
                    </h3>
                    <p
                        className="text-lg"
                        style={{ color: theme.colors.neutral[600] }}
                    >
                        Simple, transparent pricing. Unbeatable value. <br />
                        Join 500+ teams automating their support today.
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    {plans.map((plan) => (
                        <div
                            key={plan.name}
                            className={`relative flex flex-col p-8 rounded-3xl border transition-all hover:shadow-2xl ${plan.popular ? 'bg-white shadow-xl scale-105 z-10' : 'bg-transparent'
                                }`}
                            style={{
                                borderColor: plan.popular ? theme.colors.primary.main : theme.colors.neutral[200],
                            }}
                        >
                            {plan.popular && (
                                <div
                                    className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 px-4 py-1 rounded-full text-xs font-bold text-white uppercase tracking-wider"
                                    style={{ background: theme.colors.primary.main }}
                                >
                                    Most Popular
                                </div>
                            )}

                            <div className="mb-8">
                                <h4 className="text-xl font-bold mb-2" style={{ color: theme.colors.neutral[900] }}>
                                    {plan.name}
                                </h4>
                                <div className="flex items-baseline gap-1 mb-4">
                                    <span className="text-4xl font-bold" style={{ color: theme.colors.neutral[900] }}>
                                        ${plan.price}
                                    </span>
                                    <span className="text-slate-500 font-medium">/month</span>
                                </div>
                                <p className="text-sm leading-relaxed" style={{ color: theme.colors.neutral[600] }}>
                                    {plan.description}
                                </p>
                            </div>

                            <ul className="space-y-4 mb-8 flex-1">
                                {plan.features.map((feature) => (
                                    <li key={feature} className="flex items-start gap-3 text-sm">
                                        <HiCheck className="text-lg flex-shrink-0 mt-0.5" style={{ color: theme.colors.accent.green }} />
                                        <span style={{ color: theme.colors.neutral[700] }}>{feature}</span>
                                    </li>
                                ))}
                            </ul>

                            <button
                                className={`w-full py-4 rounded-xl font-bold transition-all ${plan.popular ? 'text-white' : 'border'
                                    }`}
                                style={{
                                    backgroundColor: plan.popular ? theme.colors.primary.main : 'transparent',
                                    borderColor: plan.popular ? 'transparent' : theme.colors.neutral[300],
                                    color: plan.popular ? 'white' : theme.colors.neutral[700],
                                    boxShadow: plan.popular ? `0 10px 15px -3px ${theme.colors.primary.main}30` : 'none',
                                }}
                            >
                                {plan.cta}
                            </button>
                        </div>
                    ))}
                </div>

                <div className="mt-16 text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-sm font-medium">
                        <HiOutlineInformationCircle className="text-lg" />
                        Looking for something else? <button className="font-bold underline decoration-2 underline-offset-4 ml-1">Custom Quote</button>
                    </div>
                </div>
            </div>
        </section>
    );
}
