"use client";

import { useEffect, useRef } from "react";
import { BANNER_KEYWORDS as KEYWORDS } from "../../lib/constants";

// Triple for a seamless loop at any viewport width
const ITEMS = [...KEYWORDS, ...KEYWORDS, ...KEYWORDS];

export default function Banner() {
  const bannerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let ctx: { revert: () => void };
    (async () => {
      const { gsap } = await import("gsap");
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      gsap.registerPlugin(ScrollTrigger);

      ctx = gsap.context(() => {
        gsap.from(bannerRef.current, {
          opacity: 0,
          y: 20,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: bannerRef.current,
            start: "top 95%",
          }
        });
      });
    })();
    return () => ctx?.revert();
  }, []);

  return (
    <div ref={bannerRef} className="relative w-full overflow-hidden bg-white/80 backdrop-blur-sm py-6 border-y border-border/50">
      {/* Edge fade masks */}
      <div
        className="pointer-events-none absolute inset-y-0 left-0 z-10 w-32"
        style={{ background: "linear-gradient(to right, white, transparent)" }}
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute inset-y-0 right-0 z-10 w-32"
        style={{ background: "linear-gradient(to left, white, transparent)" }}
        aria-hidden="true"
      />

      {/* Marquee track */}
      <div
        className="flex w-max animate-marquee items-center gap-0 hover:[animation-play-state:paused]"
        aria-label="Feature highlights"
        role="marquee"
      >
        {ITEMS.map((item, idx) => (
          <div key={idx} className="flex items-center gap-3 px-10">
            {/* Icon */}
            {item.icon && <item.icon className="h-4 w-4 text-muted-foreground/60" />}
            {/* Keyword */}
            <span className="whitespace-nowrap text-sm font-medium tracking-wide text-muted-foreground">
              {item.label}
            </span>
          </div>
        ))}
      </div>

      {/* Keyframe */}
      <style>{`
        @keyframes marquee {
          from { transform: translateX(0); }
          to   { transform: translateX(-33.333%); }
        }
        .animate-marquee {
          animation: marquee 40s linear infinite;
        }
      `}
      </style>
    </div>
  );
}