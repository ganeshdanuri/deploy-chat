"use client";
import { ArrowRight, BookOpen, LifeBuoy, MessageSquare } from "lucide-react";


import Link from "next/link";

import { PageHeader } from "@/app/components/ui";
import { Button } from "@/components/ui/button";

const HELP_SECTIONS = [
    {
        title: "Documentation",
        description: "Guides and API references for building with Deploy Chat.",
        icon: BookOpen,
        href: "#",
        cta: "Read docs",
        color: "var(--brand)",
        bg: "var(--brand-bg)",
    },
    {
        title: "Support",
        description: "Open a ticket and our team will get back within 1 business day.",
        icon: LifeBuoy,
        href: "mailto:support@deploymind.com",
        cta: "Contact support",
        color: "var(--agent)",
        bg: "var(--agent-bg)",
    },
    {
        title: "Community",
        description: "Chat with other builders, share tips, and hear what's coming.",
        icon: MessageSquare,
        href: "https://x.com/deploychat",
        cta: "Join community",
        color: "var(--knowledge)",
        bg: "var(--knowledge-bg)",
    },
];

export default function HelpPage() {
    return (
        <div className="animate-fade-in-up space-y-6">
            <PageHeader
                title="Help & resources"
                description="Everything you need to build, deploy, and scale your agents."
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {HELP_SECTIONS.map((section) => {
                    const Icon = section.icon;
                    return (
                        <Link
                            key={section.title}
                            href={section.href}
                            className="bg-background border border-border rounded-xl p-5 hover:border-border-medium transition-colors group flex flex-col"
>
                            <div
                                className="w-10 h-10 rounded-md flex items-center justify-center mb-4"
                                style={{ background: section.bg, color: section.color }}
>
                                <Icon className="w-5 h-5" />
                            </div>
                            <h3 className="text-[15px] font-medium text-foreground mb-1.5">{section.title}</h3>
                            <p className="text-sm text-muted-foreground leading-relaxed mb-4 flex-1">
                                {section.description}
                            </p>
                            <span className="text-sm font-medium text-foreground flex items-center gap-1">
                                {section.cta}
                                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                            </span>
                        </Link>
                    );
                })}
            </div>

            {/* Enterprise CTA */}
            <div
                className="rounded-xl p-6 sm:p-8 relative overflow-hidden"
                style={{ background: "var(--foreground)" }}
>
                <div className="relative z-10 max-w-lg">
                    <div
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium mb-4"
                        style={{
                            background: "rgba(255,255,255,0.08)",
                            color: "rgba(255,255,255,0.85)",
                        }}
>
                        Enterprise
                    </div>
                    <h2 className="text-2xl font-medium tracking-tight text-background mb-3">
                        Need dedicated support?
                    </h2>
                    <p
                        className="text-sm leading-relaxed mb-5"
                        style={{ color: "rgba(255,255,255,0.65)" }}
>
                        Custom integrations, on-premise deployment, SSO, SLA guarantees —
                        our enterprise team is here to help.
                    </p>
                    <Button
                        asChild
                        className="bg-white text-foreground hover:bg-white/90"
>
                        <a href="mailto:sales@deploymind.com">Talk to sales →</a>
                    </Button>
                </div>
            </div>
        </div>
    );
}
