"use client";

import { HiCheck, HiOutlineInformationCircle, HiSparkles } from "react-icons/hi";

import { PRICING_PLANS as plans } from "../../lib/constants";

export default function PricingSection() {
    return (
        <section id="pricing" className="py-24 relative overflow-hidden bg-slate-50 sm:py-32">
            {/* Background glowing effects */}
            <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80" aria-hidden="true">
                <div
                    className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#6366f1] to-[#a855f7] opacity-20 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
                    style={{
                        clipPath: 'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)'
                    }}
                />
            </div>

            <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
                <div className="mx-auto max-w-4xl text-center mb-20">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-600 text-xs font-bold uppercase tracking-widest mb-6">
                        <HiSparkles className="w-4 h-4" />
                        Pricing Plans
                    </div>
                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight mb-8">
                        Scales with your <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">business</span>
                    </h2>
                    <p className="text-lg md:text-xl text-slate-600 leading-relaxed max-w-2xl mx-auto">
                        Simple, transparent pricing. Unbeatable value. Join hundreds of growing teams automating their customer support today.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {plans.map((plan) => (
                        <div
                            key={plan.name}
                            className={`relative flex flex-col p-8 rounded-[2rem] border transition-all duration-500 hover:-translate-y-2 ${plan.popular
                                ? 'bg-slate-900 border-slate-900 shadow-2xl scale-105 z-10 ring-4 ring-indigo-500/20 md:transform lg:scale-110'
                                : 'bg-white border-slate-200 shadow-xl shadow-slate-200/50 hover:shadow-2xl hover:border-indigo-200'
                                }`}
                        >
                            {plan.popular && (
                                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full text-xs font-bold text-white uppercase tracking-widest bg-gradient-to-r from-indigo-500 to-purple-500 shadow-lg">
                                    Most Popular
                                </div>
                            )}

                            <div className="mb-8 relative z-10 pt-4">
                                <h4 className={`text-lg font-semibold mb-4 ${plan.popular ? 'text-indigo-300' : 'text-indigo-600'}`}>
                                    {plan.name}
                                </h4>
                                <div className="flex items-baseline gap-1 mb-4">
                                    {plan.price === 'Custom' ? (
                                        <span className={`text-4xl font-black tracking-tight ${plan.popular ? 'text-white' : 'text-slate-900'}`}>
                                            Custom
                                        </span>
                                    ) : (
                                        <>
                                            <span className={`text-5xl font-black tracking-tight ${plan.popular ? 'text-white' : 'text-slate-900'}`}>
                                                ${plan.price}
                                            </span>
                                            <span className={`text-base font-medium ${plan.popular ? 'text-slate-400' : 'text-slate-500'}`}>
                                                /month
                                            </span>
                                        </>
                                    )}
                                </div>
                                <p className={`text-sm leading-relaxed ${plan.popular ? 'text-slate-300' : 'text-slate-600'}`}>
                                    {plan.description}
                                </p>
                            </div>

                            <div className="flex-1">
                                <ul className="space-y-4 mb-8">
                                    {plan.features.map((feature, idx) => (
                                        <li key={idx} className="flex items-start gap-3 text-sm">
                                            <div className={`mt-0.5 rounded-full p-1 ${plan.popular ? 'bg-indigo-500/20 text-indigo-400' : 'bg-indigo-50 text-indigo-600'}`}>
                                                <HiCheck className="w-4 h-4 flex-shrink-0" />
                                            </div>
                                            <span className={`font-medium ${plan.popular ? 'text-slate-300' : 'text-slate-700'}`}>
                                                {feature}
                                            </span>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <button
                                onClick={() => {
                                    if (plan.name === 'Free') {
                                        window.open(`/login?register=true&plan=free`, '_blank', 'noopener,noreferrer');
                                    } else {
                                        window.open(`/login?register=true&plan=${plan.name.toLowerCase()}`, '_blank', 'noopener,noreferrer');
                                    }
                                }}
                                className={`mt-auto w-full py-4 rounded-xl font-bold transition-all duration-300 active:scale-95 flex items-center justify-center gap-2 ${plan.popular
                                    ? 'bg-indigo-500 text-white hover:bg-indigo-400 shadow-[0_0_20px_rgba(99,102,241,0.4)] hover:shadow-[0_0_25px_rgba(99,102,241,0.6)]'
                                    : 'bg-slate-50 text-slate-900 border border-slate-200 hover:bg-slate-100 hover:border-slate-300'
                                    }`}
                            >
                                {plan.cta}
                            </button>
                        </div>
                    ))}
                </div>

                <div className="mt-16 text-center lg:mt-24">
                    <div className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-white border border-slate-200 shadow-sm text-slate-700 text-sm font-medium hover:shadow-md transition-all cursor-pointer group">
                        <HiOutlineInformationCircle className="text-xl text-indigo-500 group-hover:scale-110 transition-transform" />
                        <span>Have specific requirements?</span>
                        <a href="mailto:sales@deploymind.com" className="font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1">
                            Contact our sales team
                            <span className="group-hover:translate-x-1 transition-transform">→</span>
                        </a>
                    </div>
                </div>
            </div>
        </section>
    );
}
