"use client";

import { useState } from "react";
import { theme } from "../theme";
import { HiPlus, HiMinus } from "react-icons/hi";

import { FAQS as faqs } from "../../lib/constants";

export default function FAQSection() {
    const [openIndex, setOpenIndex] = useState<number | null>(0);

    return (
        <section className="py-24 bg-transparent">
            <div className="max-w-4xl mx-auto px-6">
                <div className="text-center mb-16">
                    <p
                        className="text-sm font-bold tracking-widest uppercase mb-3"
                        style={{ color: theme.colors.primary.main }}
                    >
                        Support
                    </p>
                    <h2
                        className="text-2xl font-semibold mb-6"
                        style={{ color: theme.colors.neutral[900] }}
                    >
                        Frequently Asked Questions
                    </h2>
                </div>

                <div className="space-y-4">
                    {faqs.map((faq, i) => (
                        <div
                            key={i}
                            className="rounded-2xl border transition-all"
                            style={{
                                borderColor: openIndex === i ? theme.colors.primary.main : theme.colors.neutral[200],
                                backgroundColor: openIndex === i ? theme.colors.primary.lightest + '20' : 'transparent'
                            }}
                        >
                            <button
                                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                                className="w-full flex items-center justify-between p-6 text-left"
                            >
                                <span className="font-bold text-lg" style={{ color: theme.colors.neutral[900] }}>
                                    {faq.question}
                                </span>
                                {openIndex === i ? (
                                    <HiMinus className="text-xl" style={{ color: theme.colors.primary.main }} />
                                ) : (
                                    <HiPlus className="text-xl text-slate-400" />
                                )}
                            </button>

                            {openIndex === i && (
                                <div className="px-6 pb-6 animate-fade-in-up">
                                    <p className="leading-relaxed" style={{ color: theme.colors.neutral[600] }}>
                                        {faq.answer}
                                    </p>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
