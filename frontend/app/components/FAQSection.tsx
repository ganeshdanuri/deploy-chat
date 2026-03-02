"use client";

import { useState } from "react";
import { PAGE_CONTENT, FAQS } from "../../lib/constants";

export default function FAQSection({ faqs = FAQS }) {
    const [openIndex, setOpenIndex] = useState<number | null>(0);

    return (
        <section
            id="faq"
            aria-labelledby="faq-heading"
            className="relative py-24 bg-white overflow-hidden"
        >
            <div className="mx-auto max-w-[1400px] px-10">

                {/* ── Section Header ── */}
                <div className="mb-14 text-center">
                    <div className="flex items-center justify-center gap-3 mb-6">
                        <div className="w-8 h-[2px] bg-primary" />
                        <span className="text-xs font-semibold text-foreground tracking-wide uppercase">
                            {PAGE_CONTENT.faq.badge}
                        </span>
                        <div className="w-8 h-[2px] bg-primary" />
                    </div>
                    <h2
                        id="faq-heading"
                        className="text-[40px] md:text-[44px] font-semibold text-secondary mb-6 leading-tight tracking-tight"
                    >
                        {PAGE_CONTENT.faq.headline}
                    </h2>
                    <p className="text-lg text-muted-foreground max-w-xl mx-auto leading-relaxed">
                        {PAGE_CONTENT.faq.subtitle}
                    </p>
                </div>

                {/* ── FAQ Accordion ── */}
                <div className="mx-auto max-w-4xl border border-border bg-muted">
                    <dl>
                        {faqs.map((faq, i) => {
                            const isOpen = openIndex === i;
                            const isLast = i === faqs.length - 1;
                            return (
                                <div
                                    key={i}
                                    style={{
                                        borderBottom: isLast ? "none" : "1px solid #e8e8f0",
                                    }}
                                >
                                    <dt>
                                        <button
                                            type="button"
                                            onClick={() => setOpenIndex(isOpen ? null : i)}
                                            aria-expanded={isOpen}
                                            aria-controls={`faq-answer-${i}`}
                                            className="flex w-full items-center justify-between gap-4 text-left px-8 py-6 hover:bg-white transition-colors duration-150"
                                        >
                                            <span
                                                className={`text-[17px] font-medium leading-snug transition-colors duration-200 ${isOpen ? "text-primary" : "text-secondary"
                                                    }`}
                                            >
                                                {faq.question}
                                            </span>
                                            <span
                                                className="flex-shrink-0 w-5 h-5 flex items-center justify-center text-[#8a8a9a]"
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
                                        className={`grid transition-all duration-300 ease-in-out ${isOpen ? "grid-rows-[1fr] opacity-100 bg-white" : "grid-rows-[0fr] opacity-0"
                                            }`}
                                    >
                                        <div className="overflow-hidden">
                                            <p className="px-8 pb-6 pt-2 text-[15px] leading-relaxed text-muted-foreground">
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