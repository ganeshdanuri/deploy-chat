"use client";

import { Button } from "@/components/ui/button";
import { useReveal } from "@/lib/hooks/useReveal";

export default function CTASection({
  onGetStarted,
}: {
  onGetStarted: () => void;
}) {
  const sectionRef = useReveal<HTMLDivElement>();
  return (
    <section className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:max-w-full lg:px-12 pb-20 sm:pb-28">
      <div
        ref={sectionRef}
        className="relative overflow-hidden rounded-3xl px-6 py-14 sm:py-20 text-center reveal"
        style={{ background: "#1D2020", color: "#FFFFFF" }}
      >
        {/* Soft lime spotlight from below */}
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 60% 80% at 50% 120%, rgba(212,251,95,0.28) 0%, rgba(212,251,95,0) 60%)",
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
              style={{ background: "#D4FB5F" }}
            />
            Try free for 30 days · No credit card
          </div>

          <h3 className="text-3xl sm:text-5xl lg:text-[56px] leading-[1.05] font-semibold tracking-[-0.03em] mb-4">
            Ready to ship?
          </h3>
          <p className="text-sm sm:text-base text-white/70 mb-8 max-w-md mx-auto leading-relaxed">
            Join 500+ teams running production agents on Deploy Chat.
          </p>
          <div className="inline-flex flex-wrap justify-center gap-2.5">
            <Button
              size="lg"
              onClick={onGetStarted}
              className="btn-pill bg-[#D4FB5F] text-[#1D2020] hover:bg-[#C4F252]"
            >
              Start free →
            </Button>
            <Button
              size="lg"
              variant="outline"
              asChild
              className="btn-pill bg-transparent border-white/20 text-white hover:bg-white/5 hover:text-white"
            >
              <a href="#">Read the docs</a>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
