"use client";

import { AVAILABLE_CONNECTORS as connectors, PAGE_CONTENT } from "../../lib/constants";

export default function ConnectorsSection() {
    return (
        <section id="connectors" className="relative py-16 lg:py-24 bg-slate-50/50 overflow-hidden border-t border-border/40">

            {/* Subtle background glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-primary/[0.02] blur-3xl pointer-events-none" />

            <div className="mx-auto max-w-6xl px-6 lg:px-10 relative z-10">

                {/* ── Section Header ── */}
                <div className="mb-14 text-center">
                    {/* Section label badge */}
                    <div className="flex items-center justify-center mb-6">
                        <div className="inline-flex items-center rounded-full border border-border bg-white px-3 py-1 shadow-sm">
                            <span className="text-sm font-medium text-foreground">
                                {PAGE_CONTENT.connectors.badge}
                            </span>
                        </div>
                    </div>

                    <h2 className="text-3xl md:text-[3.25rem] leading-[1.15] text-foreground mb-6">
                        {PAGE_CONTENT.connectors.headlineWait}{" "}
                        <span className="gradient-text">{PAGE_CONTENT.connectors.headlineHighlight}</span>
                    </h2>
                    <p className="text-lg text-muted-foreground max-w-xl mx-auto leading-relaxed">
                        {PAGE_CONTENT.connectors.subtitle}
                    </p>
                </div>

                {/* ── Connectors Grid ── */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                    {connectors.map((connector) => {
                        const isActive = connector.status === "active";
                        return (
                            <div
                                key={connector.id}
                                className="group relative bg-white rounded-2xl border border-border p-6 lg:p-8 transition-all duration-300 hover:-translate-y-1"
                                style={{ boxShadow: 'var(--shadow-sm)' }}
                                onMouseEnter={(e) => {
                                    (e.currentTarget as HTMLElement).style.boxShadow = 'var(--shadow-md)';
                                }}
                                onMouseLeave={(e) => {
                                    (e.currentTarget as HTMLElement).style.boxShadow = 'var(--shadow-sm)';
                                }}
                            >
                                <div className="flex items-start justify-between mb-8">
                                    {/* Icon */}
                                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-transform duration-200 group-hover:scale-110 ${isActive ? "bg-primary text-white shadow-md shadow-primary/20" : "bg-muted text-muted-foreground border border-border"}`}>
                                        <connector.icon className="w-6 h-6" />
                                    </div>

                                    {/* Status Badge */}
                                    {isActive ? (
                                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-100/50">
                                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                                            <span className="text-[10px] font-semibold tracking-wider uppercase text-emerald-600">Active</span>
                                        </div>
                                    ) : (
                                        <div className="inline-flex items-center px-2.5 py-1 rounded-full bg-muted border border-border">
                                            <span className="text-[10px] font-medium tracking-wider uppercase text-muted-foreground">Coming Soon</span>
                                        </div>
                                    )}
                                </div>

                                {/* Title & Description */}
                                <div>
                                    <h3 className="text-[17px] font-semibold tracking-tight text-foreground mb-1.5">
                                        {connector.name}
                                    </h3>
                                    <p className="text-sm text-muted-foreground leading-relaxed">
                                        {connector.description}
                                    </p>
                                </div>
                            </div>
                        );
                    })}
                </div>

            </div>
        </section>
    );
}
