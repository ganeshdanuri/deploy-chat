"use client";

import { useState } from "react";
import { theme } from "../theme";
import { HiPlus, HiMinus } from "react-icons/hi";

const faqs = [
    {
        question: "How does the AI training work?",
        answer: "We use a technique called Retrieval-Augmented Generation (RAG). You provide documents or website URLs, and we convert them into high-dimensional vectors. When a user asks a question, our AI searches for the most relevant context in your data to generate a precise, factual answer.",
    },
    {
        question: "Is my data secure?",
        answer: "Absolutely. We use enterprise-grade encryption for all data at rest and in transit. Your training data is never used to train our base AI models, ensuring your intellectual property remains private and proprietary.",
    },
    {
        question: "Do I need coding skills to integrate it?",
        answer: "No. You can deploy our chatbot by simply copying and pasting a single line of script into your website. For developers, we also offer a comprehensive API and React components for more custom implementations.",
    },
    {
        question: "Can I customize the chatbot's personality?",
        answer: "Yes. In the dashboard, you can define 'System Prompts' to give your chatbot a specific tone, set boundaries on what it should discuss, and even give it a name and custom avatar.",
    },
];

export default function FAQSection() {
    const [openIndex, setOpenIndex] = useState<number | null>(0);

    return (
        <section className="py-24 bg-transparent">
            <div className="max-w-4xl mx-auto px-6">
                <div className="text-center mb-16">
                    <h2
                        className="text-sm font-bold tracking-widest uppercase mb-3"
                        style={{ color: theme.colors.primary.main }}
                    >
                        Support
                    </h2>
                    <h3
                        className="text-4xl font-bold mb-6"
                        style={{ color: theme.colors.neutral[900] }}
                    >
                        Frequently Asked Questions
                    </h3>
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
