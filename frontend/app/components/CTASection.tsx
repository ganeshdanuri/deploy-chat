"use client";

import { PAGE_CONTENT, BRAND } from "../../lib/constants";

export default function CTASection({ onGetStarted }: { onGetStarted: () => void }) {
    return (
        <section className="py-24 bg-white">
            <div className="max-w-[1400px] mx-auto px-10">
                <div
                    className="relative overflow-hidden text-center py-20 px-10 md:px-20 bg-secondary border border-[#2a2a3e]"
                >
                    {/* Subtle decorative elements */}
                    <div
                        className="absolute top-0 right-0 w-[400px] h-[400px] opacity-[0.07]"
                        style={{ background: "radial-gradient(circle, var(--primary) 0%, transparent 70%)" }}
                    />
                    <div
                        className="absolute bottom-0 left-0 w-[300px] h-[300px] opacity-[0.05]"
                        style={{ background: "radial-gradient(circle, var(--primary) 0%, transparent 70%)" }}
                    />

                    <div className="relative z-10 max-w-2xl mx-auto">
                        {/* Badge */}
                        <div className="flex items-center justify-center gap-3 mb-8">
                            <div className="w-8 h-[2px] bg-primary" />
                            <span className="text-xs font-semibold text-[#8a8a9a] tracking-wide uppercase">
                                {PAGE_CONTENT.cta.badge}
                            </span>
                            <div className="w-8 h-[2px] bg-primary" />
                        </div>

                        <h2 className="text-[44px] font-semibold text-white mb-6 leading-tight tracking-tight">
                            {PAGE_CONTENT.cta.headlineWait}{" "}
                            <span className="text-primary">{PAGE_CONTENT.cta.headlineHighlight}</span>
                        </h2>

                        <p className="text-lg text-[#8a8a9a] leading-relaxed mb-12 max-w-lg mx-auto">
                            {PAGE_CONTENT.cta.subtitleStart}{" "}
                            <span className="font-semibold text-white">{BRAND.first} <span className="text-primary">{BRAND.second}</span></span>.
                            {PAGE_CONTENT.cta.subtitleEnd}
                        </p>

                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <button
                                onClick={onGetStarted}
                                className="text-sm font-medium px-10 py-4 bg-white text-secondary hover:-translate-y-0.5 transition-all"
                            >
                                {PAGE_CONTENT.cta.primaryBtn}
                            </button>
                            <button
                                className="text-sm font-medium px-10 py-4 border border-[#3a3a4e] text-[#c8c8d4] hover:border-primary hover:text-white transition-all"
                            >
                                {PAGE_CONTENT.cta.secondaryBtn}
                            </button>
                        </div>

                        <p className="mt-10 text-xs text-muted-foreground font-normal tracking-widest uppercase">
                            {PAGE_CONTENT.cta.footerText}
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}
