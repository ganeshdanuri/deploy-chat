"use client";

// No GSAP needed — pure CSS marquee is smoother, lighter, and pause-on-hover works natively.

import { BANNER_KEYWORDS as KEYWORDS } from "../../lib/constants";

// Triple for a seamless loop at any viewport width
const ITEMS = [...KEYWORDS, ...KEYWORDS, ...KEYWORDS];

export default function Banner() {
  return (
    <div className="relative w-full overflow-hidden border-y border-slate-100 bg-white py-5">
      {/* Edge fade masks */}
      <div
        className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24"
        style={{ background: "linear-gradient(to right, white, transparent)" }}
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24"
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
            {item.icon && <item.icon className="h-4 w-4 text-indigo-400" />}
            {/* Keyword */}
            <span className="whitespace-nowrap text-sm font-semibold tracking-wide text-slate-500">
              {item.label}
            </span>
          </div>
        ))}
      </div>

      {/* Keyframe injected via style tag — avoids needing tailwind.config changes */}
      <style>{`
        @keyframes marquee {
          from { transform: translateX(0); }
          to   { transform: translateX(-33.333%); }
        }
        .animate-marquee {
          animation: marquee 40s linear infinite;
        }
      `}</style>
    </div>
  );
}