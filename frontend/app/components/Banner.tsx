"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { theme } from "../theme";
interface Stat {
  id: number;
  value: string;
  label: string;
  color: string;
  bgColor: string;
}

export default function Banner() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const marqueeRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const marquee = marqueeRef.current;
      if (!marquee) return;

      // Clone content to ensure seamless loop if needed, 
      // but for simplicity with GSAP, we can just animate xPercent
      // A simple infinite loop:

      gsap.to(marquee, {
        x: "-50%", // Move half the width (since we double the content)
        ease: "none",
        duration: 60, // Adjust speed here
        repeat: -1,
      });
    }, wrapperRef);

    return () => ctx.revert();
  }, []);

  const keywords = [
    "Open Source",
    "RAG Ready",
    "Type-Safe",
    "Self-Hosted",
    "Privacy First",
    "Custom Models",
    "React Components",
    "Python Backend",
    "Vector Database"
  ];

  // Quadruple the keywords for seamless loop
  const seamlessKeywords = [...keywords, ...keywords, ...keywords, ...keywords];

  return (
    <div
      ref={wrapperRef}
      className="w-full border-y py-8 overflow-hidden bg-transparent"
      style={{ borderColor: theme.colors.neutral[200] }}
    >
      <div className="relative w-full overflow-hidden">
        <div
          // Add gradient masks for fade effect on edges
          className="absolute inset-0 z-10 pointer-events-none"
          style={{
            background: `linear-gradient(90deg, rgba(255,255,255,0) 0%, transparent 15%, transparent 85%, rgba(255,255,255,0) 100%)`
          }}
        />

        <div
          ref={marqueeRef}
          className="flex items-center w-max gap-16 px-4"
        >
          {seamlessKeywords.map((word, idx) => (
            <div
              key={idx}
              className="flex items-center gap-3"
            >
              <div
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: theme.colors.primary.main }}
              />
              <span className="text-gray-500 text-lg font-bold uppercase tracking-wider whitespace-nowrap">
                {word}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
