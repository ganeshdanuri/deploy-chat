"use client";

import { useState, useEffect, useRef } from "react";
import { PAGE_CONTENT, FAQS } from "../../lib/constants";

export default function FAQSection({ faqs = FAQS }) {
    const [openIndex, setOpenIndex] = useState<number | null>(0);

    return (
        <section
            id="faq"
            aria-labelledby="faq-heading"
            className="relative py-16 lg:py-24 bg-white overflow-hidden"
        >
            {/* Subtle radial glow */}
            <div className="radial-glow w-[400px] h-[400px] bottom-0 left-0 bg-primary/[0.03]" />

            <div className="mx-auto max-w-6xl px-6 lg:px-10">

                {/* ── Section Header ── */}
                <div className="mb-10 text-center">
                    {/* Section label badge */}
                    <div className="flex items-center justify-center mb-6">
                        <div className="inline-flex items-center rounded-full border border-border bg-muted/50 px-3 py-1 shadow-sm">
                            <span className="text-sm font-medium text-foreground">
                                {PAGE_CONTENT.faq.badge}
                            </span>
                        </div>
                    </div>
                    <h2
                        id="faq-heading"
                        className="text-3xl md:text-[3.25rem] leading-[1.15] text-foreground mb-6"
                    >
                        {PAGE_CONTENT.faq.headline}
                    </h2>
                    <p className="text-lg text-muted-foreground max-w-xl mx-auto leading-relaxed">
                        {PAGE_CONTENT.faq.subtitle}
                    </p>
                </div>

                {/* ── FAQ Accordion ── */}
                <div className="mx-auto max-w-3xl rounded-2xl border border-border bg-white overflow-hidden"
                    style={{ boxShadow: 'var(--shadow-md)' }}>
                    <dl>
                        {faqs.map((faq, i) => {
                            const isOpen = openIndex === i;
                            const isLast = i === faqs.length - 1;
                            return (
                                <div
                                    key={i}
                                    style={{
                                        borderBottom: isLast ? "none" : "1px solid var(--border)",
                                    }}
                                >
                                    <dt>
                                        <button
                                            type="button"
                                            onClick={() => setOpenIndex(isOpen ? null : i)}
                                            aria-expanded={isOpen}
                                            aria-controls={`faq-answer-${i}`}
                                            className="flex w-full items-center justify-between gap-4 text-left px-8 py-6 hover:bg-muted/50 transition-colors duration-150 rounded-none"
                                        >
                                            <span
                                                className={`text-[17px] font-medium leading-snug transition-colors duration-200 ${isOpen ? "text-primary" : "text-foreground"
                                                    }`}
                                            >
                                                {faq.question}
                                            </span>
                                            <span
                                                className={`flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center transition-all duration-200 ${isOpen
                                                    ? "bg-primary/10 text-primary rotate-0"
                                                    : "bg-muted text-muted-foreground rotate-0"
                                                    }`}
                                                aria-hidden="true"
                                            >
                                                {isOpen ? (
                                                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                                                        <path d="M2 7h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                                    </svg>
                                                ) : (
                                                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                                                        <path d="M7 2v10M2 7h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                                    </svg>
                                                )}
                                            </span>
                                        </button>
                                    </dt>
                                    <dd
                                        id={`faq-answer-${i}`}
                                        role="region"
                                        aria-hidden={!isOpen}
                                        className={`grid transition-all duration-300 ease-in-out ${isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                                            }`}
                                    >
                                        <div className="overflow-hidden">
                                            <p className="px-8 pb-6 pt-0 text-[15px] leading-relaxed text-muted-foreground">
                                                {faq.answer}
                                            </p>
                                        </div>
                                    </dd>
                                </div>
                            );
                        })}
                    </dl>
                </div>
            </div>
        </section>
    );
}