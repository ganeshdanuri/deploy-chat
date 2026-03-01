"use client";

import { theme } from "../theme";

export default function CTASection({ onGetStarted }: { onGetStarted: () => void }) {
    return (
        <section className="py-20 px-6">
            <div
                className="max-w-7xl mx-auto rounded-xl p-12 md:p-20 text-center relative overflow-hidden shadow-2xl bg-[#201F3B]"
            >
                {/* Decorative Gradients */}
                <div
                    className="absolute top-0 right-0 w-96 h-96 opacity-20 blur-3xl rounded-full bg-[#262ef2]"
                />
                <div
                    className="absolute bottom-0 left-0 w-96 h-96 opacity-10 blur-3xl rounded-full bg-[#262ef2]"
                />

                <div className="relative z-10 max-w-3xl mx-auto">
                    <h2 className="text-[44px] font-semibold text-white mb-8 leading-tight">
                        Ready to Build Your <br />
                        <span className="text-[#262ef2]">
                            Intelligent Future?
                        </span>
                    </h2>
                    <p className="text-lg text-[#a1a1a1] mb-12">
                        Join 500+ developers and businesses who are scaling their
                        support with <span className="font-bold tracking-tight text-white">DEPLOY <span className="text-[#262ef2]">CHAT</span></span>. Start your 14-day free trial today.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                        <button
                            onClick={onGetStarted}
                            className="text-sm font-medium px-10 py-5 rounded-lg bg-white text-[#201F3B] hover:-translate-y-1 transition-all shadow-xl shadow-white/10"
                        >
                            Get Started for Free
                        </button>
                        <button
                            className="text-sm font-medium px-10 py-5 rounded-lg bg-white/10 text-white hover:bg-white/15 transition-all"
                        >
                            Talk to Sales
                        </button>
                    </div>

                    <p className="mt-8 text-sm text-[#a1a1a1]/50 font-normal tracking-wide">
                        NO CREDIT CARD REQUIRED • INSTANT SETUP • GPT-4o ACCESS
                    </p>
                </div>
            </div>
        </section>
    );
}
