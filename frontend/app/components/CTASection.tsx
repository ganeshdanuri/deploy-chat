"use client";

import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useReveal } from "@/lib/hooks/useReveal";
import { openRegister } from "@/lib/openRegister";

export default function CTASection() {
  const sectionRef = useReveal<HTMLDivElement>();
  return (
    <section className="container-page py-20 sm:py-28">
      <div
        ref={sectionRef}
        className="relative overflow-hidden rounded-3xl px-6 py-14 sm:py-20 text-center reveal"
        style={{ background: "#1D2020", color: "#FFFFFF" }}
      >
        {/* Soft accent spotlight from below — uses the lifted blue, since #0052FF
            is too dark to register against the #1D2020 panel. */}
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 60% 80% at 50% 120%, rgba(77,139,255,0.30) 0%, rgba(77,139,255,0) 60%)",
          }}
        />
        {/* Faint dot grid */}
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none opacity-40"
          style={{
            backgroundImage:
              "radial-gradient(circle, rgba(255,255,255,0.08) 1px, transparent 1px)",
            backgroundSize: "22px 22px",
            maskImage:
              "radial-gradient(ellipse 65% 80% at 50% 40%, black 30%, transparent 75%)",
            WebkitMaskImage:
              "radial-gradient(ellipse 65% 80% at 50% 40%, black 30%, transparent 75%)",
          }}
        />

        <div className="relative">
          <div
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[12px] font-medium mb-5 border border-white/10"
            style={{ background: "rgba(255,255,255,0.05)", color: "#E5E5E5" }}
          >
            <span
              className="w-1.5 h-1.5 rounded-full"
              style={{ background: "var(--blue-on-dark)" }}
            />
            Try free for 30 days · No credit card
          </div>

          <h3 className="h-section mb-4">
            Ready to ship?
          </h3>
          <p className="text-sm sm:text-base text-white/70 mb-8 max-w-md mx-auto leading-relaxed">
            Ship your first agent this afternoon — connect a source, embed one
            line, done.
          </p>
          <div className="inline-flex flex-wrap justify-center gap-2.5">
            <Button
              size="lg"
              onClick={openRegister}
              className="btn-pill btn-on-dark group bg-[var(--blue-on-dark)] text-[var(--blue-on-dark-ink)] hover:bg-[var(--blue-on-dark-hover)]"
            >
              Start free
              <ArrowRight className="transition-transform group-hover:translate-x-0.5" strokeWidth={2} />
            </Button>
            <Button
              size="lg"
              variant="outline"
              asChild
              className="btn-pill btn-on-dark bg-transparent border-white/20 text-white hover:bg-white/5 hover:text-white"
            >
              <a href="#">Read the docs</a>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
