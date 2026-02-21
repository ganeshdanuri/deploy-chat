"use client";

import { theme } from "../theme";

export default function CTASection({ onGetStarted }: { onGetStarted: () => void }) {
    return (
        <section className="py-24 px-6">
            <div
                className="max-w-7xl mx-auto rounded-[3rem] p-12 md:p-24 text-center relative overflow-hidden shadow-2xl"
                style={{ background: theme.colors.neutral[900] }}
            >
                {/* Decorative Gradients */}
                <div
                    className="absolute top-0 right-0 w-96 h-96 opacity-20 blur-3xl rounded-full"
                    style={{ background: theme.colors.primary.main }}
                />
                <div
                    className="absolute bottom-0 left-0 w-96 h-96 opacity-10 blur-3xl rounded-full"
                    style={{ background: theme.colors.accent.purple }}
                />

                <div className="relative z-10 max-w-3xl mx-auto">
                    <h2 className="text-2xl font-semibold text-white mb-8 leading-tight">
                        Ready to Build Your <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">
                            Intelligent Future?
                        </span>
                    </h2>
                    <p className="text-xl text-slate-400 mb-12">
                        Join 500+ developers and businesses who are scaling their
                        support with <span className="font-black tracking-tight text-white">D<span style={{ color: "#4667ff" }}>E</span>PLOY C<span style={{ color: "#4667ff" }}>H</span>AT</span>. Start your 14-day free trial today.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                        <button
                            onClick={onGetStarted}
                            className="text-sm font-medium px-10 py-5 rounded-2xl bg-white text-slate-900 hover:-translate-y-1 transition-all shadow-xl shadow-white/10"
                        >
                            Get Started for Free
                        </button>
                        <button
                            className="text-sm font-medium px-10 py-5 rounded-2xl border border-slate-700 text-white hover:bg-slate-800 transition-all"
                        >
                            Talk to Sales
                        </button>
                    </div>

                    <p className="mt-8 text-sm text-slate-500 font-medium tracking-wide">
                        NO CREDIT CARD REQUIRED • INSTANT SETUP • GPT-4o ACCESS
                    </p>
                </div>
            </div>
        </section>
    );
}
