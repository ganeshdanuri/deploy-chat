"use client";

import { useState } from "react";
import { Plus, Minus } from "lucide-react";
import { FAQS } from "@/lib/constants";
import { useReveal } from "@/lib/hooks/useReveal";

export default function FAQSection() {
  const [openIdx, setOpenIdx] = useState<number | null>(0);
  const sectionRef = useReveal<HTMLDivElement>();

  return (
    <section id="faq" className="section-alt">
      <div className="container-page py-20 sm:py-28">
        <div ref={sectionRef} className="grid lg:grid-cols-[1fr_1.5fr] gap-10 lg:gap-16 reveal">
          <div>
            <span className="eyebrow-pill">FAQ</span>
            <h2 className="h-section mt-6 mb-4">
              Frequently asked<br className="hidden sm:block" /> questions.
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
              const triggerId = `faq-trigger-${i}`;
              const panelId = `faq-panel-${i}`;
              return (
                <div key={i}>
                  {/* Only the question is the control. Wrapping the answer in the
                      button too made clicking it collapse the panel and turned
                      selecting the text into a fight. */}
                  <button
                    id={triggerId}
                    onClick={() => setOpenIdx(isOpen ? null : i)}
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    className="w-full text-left py-5 flex items-start justify-between gap-4 group rounded-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--blue)]"
                  >
                    <span className="text-[15px] font-medium text-foreground leading-snug">
                      {faq.question}
                    </span>
                    <span aria-hidden="true" className="shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-muted-foreground group-hover:text-foreground transition-colors">
                      {isOpen ? (
                        <Minus className="w-4 h-4" strokeWidth={1.75} />
                      ) : (
                        <Plus className="w-4 h-4" strokeWidth={1.75} />
                      )}
                    </span>
                  </button>
                  <div
                    id={panelId}
                    role="region"
                    aria-labelledby={triggerId}
                    className="faq-panel"
                    data-open={isOpen ? "" : undefined}
                  >
                    <div>
                      <p className="text-sm text-muted-foreground leading-relaxed pr-10 pb-5">
                        {faq.answer}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
