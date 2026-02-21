"use client";

import { useState } from "react";
import { HiPlus, HiMinus, HiQuestionMarkCircle } from "react-icons/hi";
import { theme } from "../theme";
import { FAQS as faqs } from "../../lib/constants";

export default function FAQSection() {
    const [openIndex, setOpenIndex] = useState<number | null>(0);

    return (
        <section
            id="faq"
            aria-labelledby="faq-heading"
            className="relative overflow-hidden bg-white py-20 sm:py-24"
        >
            <div className="mx-auto max-w-3xl px-6 lg:px-8">

                {/* Header */}
                <div className="mb-14 text-center">
                    <div className="mb-4 inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-bold uppercase tracking-widest" style={{ borderColor: `${theme.colors.primary.main}20`, backgroundColor: `${theme.colors.primary.main}10`, color: theme.colors.primary.main }}>
                        <HiQuestionMarkCircle className="h-3.5 w-3.5" aria-hidden="true" />
                        FAQ
                    </div>
                    <h2
                        id="faq-heading"
                        className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl"
                    >
                        Frequently asked questions
                    </h2>
                    <p className="mt-4 text-lg text-slate-500">
                        Can't find the answer you're looking for?{" "}
                        <a
                            href="mailto:support@deploychat.io"
                            className="font-semibold underline-offset-2 hover:underline"
                            style={{ color: theme.colors.primary.main }}
                        >
                            Ask our team
                        </a>
                        .
                    </p>
                </div>

                {/* Accordion */}
                <dl className="divide-y divide-slate-100">
                    {faqs.map((faq, i) => {
                        const isOpen = openIndex === i;
                        return (
                            <div key={i} className="py-5">
                                <dt>
                                    <button
                                        type="button"
                                        onClick={() => setOpenIndex(isOpen ? null : i)}
                                        aria-expanded={isOpen}
                                        aria-controls={`faq-answer-${i}`}
                                        className="flex w-full items-start justify-between gap-6 text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 rounded"
                                    >
                                        <span
                                            className={`text-base font-semibold leading-snug transition-colors duration-200 ${isOpen ? "" : "text-slate-900"
                                                }`}
                                            style={isOpen ? { color: theme.colors.primary.main } : {}}
                                        >
                                            {faq.question}
                                        </span>
                                        <span
                                            className={`
                        mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full border transition-all duration-200
                        ${isOpen
                                                    ? ""
                                                    : "border-slate-200 bg-slate-50 text-slate-400"
                                                }
                      `}
                                            style={isOpen ? { borderColor: `${theme.colors.primary.main}30`, backgroundColor: `${theme.colors.primary.main}10`, color: theme.colors.primary.main } : {}}
                                            aria-hidden="true"
                                        >
                                            {isOpen
                                                ? <HiMinus className="h-3.5 w-3.5" />
                                                : <HiPlus className="h-3.5 w-3.5" />
                                            }
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
                                        <p className="pt-3 text-sm leading-relaxed text-slate-500">
                                            {faq.answer}
                                        </p>
                                    </div>
                                </dd>
                            </div>
                        );
                    })}
                </dl>

            </div >
        </section >
    );
}