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
                    <div className="mb-4 inline-flex items-center gap-2 rounded-lg bg-[#262ef2]/10 text-[#262ef2] px-3 py-1 text-xs font-semibold uppercase tracking-widest">
                        <HiQuestionMarkCircle className="h-3.5 w-3.5" aria-hidden="true" />
                        FAQ
                    </div>
                    <h2
                        id="faq-heading"
                        className="text-[44px] font-semibold tracking-tight text-[#201f32] leading-tight"
                    >
                        Frequently asked questions
                    </h2>
                    <p className="mt-4 text-lg text-[#a1a1a1]">
                        Can&apos;t find the answer you&apos;re looking for?{" "}
                        <a
                            href="mailto:support@deploychat.io"
                            className="font-medium underline-offset-2 hover:underline text-[#262ef2]"
                        >
                            Ask our team
                        </a>
                        .
                    </p>
                </div>

                {/* Accordion */}
                <dl className="space-y-2">
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
                                            className={`text-lg font-medium leading-snug transition-colors duration-200 ${isOpen ? "text-[#262ef2]" : "text-[#201f32]"
                                                }`}
                                        >
                                            {faq.question}
                                        </span>
                                        <span
                                            className={`
                        mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full transition-all duration-200
                        ${isOpen
                                                    ? "bg-[#262ef2]/10 text-[#262ef2]"
                                                    : "bg-[#f3f3f9] text-[#a1a1a1]"
                                                }
                      `}
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
                                        <p className="pt-3 text-base leading-relaxed text-[#4d5564]">
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