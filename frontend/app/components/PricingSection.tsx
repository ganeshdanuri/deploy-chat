"use client";

import { theme } from "../theme";
import { HiCheck, HiOutlineInformationCircle } from "react-icons/hi";

const plans = [
    {
        name: "Trial",
        price: "0",
        description: "Test the power of Deploy Mind with no configuration required.",
        features: [
            "Unlimited AI Chatbots",
            "50 Messages (Platform Key)",
            "Basic Analytics Dashboard",
            "3 Documents Included",
            "Community support",
        ],
        cta: "Start Free Trial",
        popular: false,
        color: theme.colors.neutral[600],
    },
    {
        name: "Professional",
        price: "19",
        description: "Perfect for scaling startups with heavy usage needs.",
        features: [
            "Unlimited AI Chatbots",
            "5,000 Managed Messages",
            "Advanced Analytics & Trends",
            "AI-Powered Conversation Insights",
            "Priority support",
        ],
        cta: "Get Started",
        popular: true,
        color: theme.colors.primary.main,
    },
    {
        name: "Enterprise",
        price: "Custom",
        description: "Full control and white-labeled infrastructure.",
        features: [
            "Unlimited everything",
            "Custom Insights & Reporting",
            "Dedicated Infrastructure",
            "SLA Support",
            "Custom Security Audits",
        ],
        cta: "Talk to Sales",
        popular: false,
        color: theme.colors.accent.purple,
    },
];

export default function PricingSection() {
    return (
        <section id="pricing" className="py-24 bg-transparent">
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
                                onClick={() => {
                                    if (plan.name === 'Trial') {
                                        window.open(`/login?register=true&plan=trial`, '_blank', 'noopener,noreferrer');
                                    } else {
                                        // Handle other plans or just default to register
                                        window.open(`/login?register=true&plan=${plan.name.toLowerCase()}`, '_blank', 'noopener,noreferrer');
                                    }
                                }}
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
