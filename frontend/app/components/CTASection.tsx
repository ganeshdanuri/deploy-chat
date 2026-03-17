"use client";

import { useEffect, useRef } from "react";
import { HiArrowRight } from "react-icons/hi";
import { PAGE_CONTENT, BRAND } from "../../lib/constants";

export default function CTASection({ onGetStarted }: { onGetStarted: () => void }) {
    const sectionRef = useRef<HTMLDivElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        let ctx: { revert: () => void };
        (async () => {
            const { gsap } = await import("gsap");
            const { ScrollTrigger } = await import("gsap/ScrollTrigger");
            gsap.registerPlugin(ScrollTrigger);

            ctx = gsap.context(() => {
                gsap.from(contentRef.current, {
                    y: 40,
                    opacity: 0,
                    scale: 0.98,
                    duration: 0.8,
                    ease: "power3.out",
                    scrollTrigger: {
                        trigger: contentRef.current,
                        start: "top 85%",
                    }
                });
            });
        })();
        return () => ctx?.revert();
    }, []);

    return (
        <section className="py-16 lg:py-24 bg-white">
            <div className="max-w-6xl mx-auto px-6 lg:px-10">
                <div
                    ref={contentRef}
                    className="relative overflow-hidden text-center py-14 px-8 md:px-16 rounded-[2rem] bg-foreground"
                >
                    {/* Dot pattern texture */}
                    <div className="absolute inset-0 dot-pattern" />

                    {/* Radial glows */}
                    <div
                        className="absolute -top-[100px] -right-[100px] w-[500px] h-[500px] rounded-full opacity-[0.08]"
                        style={{ background: "radial-gradient(circle, var(--primary-light) 0%, transparent 70%)" }}
                    />
                    <div
                        className="absolute -bottom-[100px] -left-[100px] w-[400px] h-[400px] rounded-full opacity-[0.06]"
                        style={{ background: "radial-gradient(circle, var(--primary) 0%, transparent 70%)" }}
                    />

                    <div className="relative z-10 max-w-2xl mx-auto">
                        {/* Section label badge */}
                        <div className="flex items-center justify-center mb-6">
                            <div className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-3 py-1 shadow-sm">
                                <span className="text-sm font-medium text-background/80">
                                    {PAGE_CONTENT.cta.badge}
                                </span>
                            </div>
                        </div>

                        <h2 className="text-3xl md:text-[3.25rem] leading-[1.15] text-background mb-6">
                            {PAGE_CONTENT.cta.headlineWait}{" "}
                            <span className="gradient-text">{PAGE_CONTENT.cta.headlineHighlight}</span>
                        </h2>

                        <p className="text-lg text-background/60 leading-relaxed mb-8 max-w-lg mx-auto">
                            {PAGE_CONTENT.cta.subtitleStart}{" "}
                            <span className="font-semibold text-background">{BRAND.first} <span className="gradient-text">{BRAND.second}</span></span>.
                            {PAGE_CONTENT.cta.subtitleEnd}
                        </p>

                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <button
                                onClick={onGetStarted}
                                className="group text-sm font-medium px-10 py-3.5 rounded-lg gradient-bg text-white transition-all duration-200 hover:-translate-y-0.5 hover:brightness-110 active:scale-[0.98]"
                                style={{ boxShadow: 'var(--shadow-accent)' }}
                            >
                                <span className="flex items-center gap-2">
                                    {PAGE_CONTENT.cta.primaryBtn}
                                    <HiArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
                                </span>
                            </button>
                            <button
                                className="text-sm font-medium px-10 py-3.5 rounded-xl border border-background/15 text-background/70 hover:border-background/30 hover:text-background hover:bg-background/5 transition-all duration-200 hover:-translate-y-0.5 active:scale-[0.98]"
                            >
                                {PAGE_CONTENT.cta.secondaryBtn}
                            </button>
                        </div>

                        <p className="mt-8 text-xs text-background/30 font-medium tracking-widest uppercase font-mono">
                            {PAGE_CONTENT.cta.footerText}
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}
