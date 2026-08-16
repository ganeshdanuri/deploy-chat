"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight, Check } from "lucide-react";
import { openRegister } from "@/lib/openRegister";
import WidgetControls from "./WidgetControls";

const TRUST = ["No credit card", "GDPR compliant", "SOC 2 ready"];

/**
 * Full-height hero. The product demo is not a card beside the headline — it's
 * the real widget floating bottom-right (see ChatLauncher), so the page itself
 * is the demo. The bottom band carries a scroll rail on the left and an
 * annotated arrow on the right pointing at the live bubble, which is also what
 * fills the otherwise-empty strip beside it.
 */
export default function HeroSection() {
  return (
    <section className="relative overflow-hidden flex flex-col md:min-h-[calc(100svh_-_64px)]">
      {/* Dot grid, masked to a soft cloud behind the headline */}
      <div
        aria-hidden
        className="absolute inset-0 bg-dot-grid pointer-events-none opacity-70"
        style={{
          maskImage:
            "radial-gradient(ellipse 70% 80% at 50% 30%, black 40%, transparent 75%)",
          WebkitMaskImage:
            "radial-gradient(ellipse 70% 80% at 50% 30%, black 40%, transparent 75%)",
        }}
      />
      {/* Faint brand wash so the centre of the page isn't flat white */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 55% 45% at 50% 32%, rgba(0,82,255,0.07) 0%, rgba(0,82,255,0) 70%)",
        }}
      />

      <div className="relative flex-1 container-page flex flex-col">
        <div className="flex-1 flex flex-col items-center justify-center text-center py-16 sm:py-20">
          <div
            className="announce-pill mb-7 animate-fade-in-up"
            style={{ opacity: 0, animationDelay: "60ms" }}
          >
            <span className="tag">New</span>
            v2.0 · Notion and Drive
          </div>

          <h1
            className="text-4xl sm:text-5xl lg:text-[64px] leading-[1.05] font-semibold tracking-[-0.03em] mb-6 max-w-4xl animate-fade-in-up"
            style={{ opacity: 0, animationDelay: "160ms" }}
          >
            Turn Any Knowledge Base into a 24/7 AI Support{" "}
            <span className="hl-marker">Agent</span>
          </h1>

          <p
            className="text-base sm:text-lg text-muted-foreground max-w-[34rem] leading-relaxed mb-9 animate-fade-in-up"
            style={{ opacity: 0, animationDelay: "260ms" }}
          >
            Connect your docs, wikis, websites, and APIs in minutes. We learn
            your business context instantly and embed on your site with a single
            line of code.
          </p>

          <div
            className="flex flex-wrap justify-center gap-2.5 mb-8 animate-fade-in-up"
            style={{ opacity: 0, animationDelay: "340ms" }}
          >
            <Button
              size="lg"
              variant="brand"
              onClick={openRegister}
              className="btn-pill group"
            >
              Start building
              <ArrowRight
                className="transition-transform group-hover:translate-x-0.5"
                strokeWidth={2}
              />
            </Button>
            <Button size="lg" variant="outline" asChild className="btn-pill">
              <a href="mailto:sales@deploymind.com">Talk to sales</a>
            </Button>
          </div>

          <div
            className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-[13px] text-muted-foreground animate-fade-in-up"
            style={{ opacity: 0, animationDelay: "420ms" }}
          >
            {TRUST.map((t) => (
              <span key={t} className="inline-flex items-center gap-1.5">
                <Check
                  className="w-3.5 h-3.5 shrink-0"
                  style={{ color: "var(--blue)" }}
                  strokeWidth={2.5}
                  aria-hidden="true"
                />
                {t}
              </span>
            ))}
          </div>

          <div
            className="md:hidden mt-10 flex items-center justify-center gap-2.5 text-[13px] text-muted-foreground animate-fade-in-up"
            style={{ opacity: 0, animationDelay: "520ms" }}
          >
            <span
              className="w-2 h-2 rounded-full shrink-0"
              style={{ background: "var(--launcher-color, var(--blue))" }}
              aria-hidden="true"
            />
            <span>
              <span className="text-foreground font-medium">
                That&apos;s the widget you&apos;d embed.
              </span>{" "}
              Try it.
            </span>
          </div>
        </div>

        {/* Bottom band: scroll cue left, live-widget pointer right */}
        <div
          className="hidden md:flex items-end justify-between pb-28 animate-fade-in-up"
          style={{ opacity: 0, animationDelay: "620ms" }}
        >
          <div className="flex items-center gap-3 text-[12px] text-muted-foreground">
            <span className="hero-scroll-rail" aria-hidden="true" />
            Scroll to explore
          </div>

          <div className="flex items-end gap-1">
            <div className="flex flex-col items-end gap-0.5 pb-5 max-w-[18rem] text-right">
              <p className="text-[13px] leading-snug font-medium text-foreground">
                That&apos;s the widget you&apos;d embed.
              </p>
              <p className="text-[13px] leading-snug text-muted-foreground">
                Try it — ask it something.
              </p>
              <div className="mt-3">
                <WidgetControls size={20} />
              </div>
            </div>
            <HeroArrow />
          </div>
        </div>
      </div>
    </section>
  );
}

/** Hand-drawn curve sweeping down to the launcher in the corner. */
function HeroArrow() {
  return (
    <svg
      viewBox="0 0 176 72"
      width="132"
      height="54"
      fill="none"
      aria-hidden="true"
      className="text-muted-foreground/70 shrink-0"
    >
      <path
        d="M 4 12 C 70 2, 140 14, 166 60"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        className="hero-arrow-line"
      />
      <path
        d="M 154.6 51.9 L 166 60 L 164.9 46"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="hero-arrow-head"
      />
    </svg>
  );
}
