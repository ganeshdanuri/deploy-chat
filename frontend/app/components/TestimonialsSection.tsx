/* eslint-disable @next/next/no-img-element, react/no-unescaped-entities */
"use client";

import { theme } from "../theme";
import { HiStar } from "react-icons/hi";

import { TESTIMONIALS as testimonials } from "../../lib/constants";

export default function TestimonialsSection() {
    return (
        <section id="testimonials" className="py-24 bg-transparent">
            <div className="max-w-7xl mx-auto px-6">
                <div className="text-center max-w-3xl mx-auto mb-20">
                    <p
                        className="text-sm font-bold tracking-widest uppercase mb-3"
                        style={{ color: theme.colors.primary.main }}
                    >
                        Social Proof
                    </p>
                    <h2
                        className="text-2xl font-semibold mb-6"
                        style={{ color: theme.colors.neutral[900] }}
                    >
                        Trusted by the world's <br />
                        most innovative teams
                    </h2>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    {testimonials.map((testimonial, i) => (
                        <div
                            key={i}
                            className="p-8 rounded-3xl border bg-slate-50/50 transition-all hover:bg-white hover:shadow-xl group"
                            style={{ borderColor: theme.colors.neutral[200] }}
                        >
                            <div className="flex gap-1 mb-6">
                                {[...Array(5)].map((_, i) => (
                                    <HiStar key={i} className="text-yellow-400 text-xl" />
                                ))}
                            </div>
                            <p
                                className="text-lg italic mb-8"
                                style={{ color: theme.colors.neutral[700] }}
                            >
                                "{testimonial.content}"
                            </p>
                            <div className="flex items-center gap-4">
                                <img
                                    src={testimonial.image}
                                    alt={testimonial.name}
                                    className="w-12 h-12 rounded-full grayscale group-hover:grayscale-0 transition-all"
                                />
                                <div>
                                    <h4 className="text-lg font-medium" style={{ color: theme.colors.neutral[900] }}>
                                        {testimonial.name}
                                    </h4>
                                    <p className="text-sm" style={{ color: theme.colors.neutral[500] }}>
                                        {testimonial.role}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
