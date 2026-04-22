"use client";

import { useState } from "react";
import { Plus, Minus } from "lucide-react";
import { FAQS } from "@/lib/constants";

export default function FAQSection() {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  return (
    <section className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:max-w-full lg:px-12 py-20 sm:py-28">
      <div className="grid lg:grid-cols-[1fr_1.5fr] gap-10 lg:gap-16">
        <div>
          <span className="eyebrow-pill">FAQ</span>
          <h2 className="mt-6 text-3xl sm:text-4xl lg:text-[48px] leading-[1.08] font-semibold tracking-[-0.03em] mb-4">
            Frequently asked<br className="hidden sm:block" />{" "}
            <span className="hl-marker">questions</span>.
          </h2>
          <p className="text-base text-muted-foreground leading-relaxed">
            Everything you need to know before getting started. Can&apos;t find
            what you&apos;re looking for?{" "}
            <a
              href="mailto:sales@deploymind.com"
              className="text-foreground underline underline-offset-4 font-medium"
>
              Get in touch
            </a>
            .
          </p>
        </div>

        <div className="flex flex-col divide-y divide-border border-t border-b border-border">
          {FAQS.map((faq, i) => {
            const isOpen = openIdx === i;
            return (
              <button
                key={i}
                onClick={() => setOpenIdx(isOpen ? null : i)}
                className="text-left py-5 flex flex-col gap-3 group"
>
                <div className="flex items-start justify-between gap-4">
                  <span className="text-[15px] font-medium text-foreground leading-snug">
                    {faq.question}
                  </span>
                  <span className="shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-muted-foreground group-hover:text-foreground transition-colors">
                    {isOpen ? (
                      <Minus className="w-4 h-4" strokeWidth={1.75} />
                    ) : (
                      <Plus className="w-4 h-4" strokeWidth={1.75} />
                    )}
                  </span>
                </div>
                {isOpen && (
                  <p className="text-sm text-muted-foreground leading-relaxed pr-10 animate-fade-in">
                    {faq.answer}
                  </p>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
