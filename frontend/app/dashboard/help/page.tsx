"use client";

import { HiQuestionMarkCircle, HiBookOpen, HiSupport, HiChatAlt } from "react-icons/hi";

export default function HelpPage() {
    const helpSections = [
        {
            title: "Documentation",
            description: "Detailed guides and API references to help you build faster.",
            icon: HiBookOpen,
            color: "text-primary",
            bgColor: "bg-primary/5"
        },
        {
            title: "Support Tickets",
            description: "Need technical help? Open a ticket and our team will assist you.",
            icon: HiSupport,
            color: "text-primary",
            bgColor: "bg-primary/5"
        },
        {
            title: "Community Discord",
            description: "Join our community to share ideas and get help from other builders.",
            icon: HiChatAlt,
            color: "text-primary",
            bgColor: "bg-primary/5"
        }
    ];

    return (
        <div className="animate-fade-in-up">
            <div className="flex items-center gap-3 mb-8">
                <div className="p-3 bg-primary/5 text-primary ring-1 ring-primary/10">
                    <HiQuestionMarkCircle className="w-8 h-8" />
                </div>
                <div>
                    <h1 className="text-3xl font-extrabold text-secondary tracking-tight">Help Center</h1>
                    <p className="text-foreground font-medium">How can we help you today?</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {helpSections.map((section, idx) => {
                    const Icon = section.icon;
                    return (
                        <div key={idx} className="dash-card p-8 bg-white border border-border shadow-sm group cursor-pointer">
                            <div className={`w-14 h-14 ${section.bgColor} ${section.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                                <Icon className="w-7 h-7" />
                            </div>
                            <h3 className="text-xl font-bold text-secondary mb-3">{section.title}</h3>
                            <p className="text-foreground leading-relaxed text-sm">
                                {section.description}
                            </p>
                            <button className="mt-8 text-sm font-bold text-primary hover:underline flex items-center gap-2">
                                Get Started
                                <span className="group-hover:translate-x-1 transition-transform">→</span>
                            </button>
                        </div>
                    );
                })}
            </div>

            <div className="mt-12 p-8 bg-secondary text-white overflow-hidden relative">
                <div className="relative z-10">
                    <h2 className="text-2xl font-bold mb-4">Enterprise Support</h2>
                    <p className="text-muted-foreground max-w-xl mb-8 leading-relaxed">
                        Looking for dedicated support, custom integrations, or on-premise deployment? Our enterprise team is here to help.
                    </p>
                    <button className="px-6 py-1.5 bg-white text-secondary font-bold hover:bg-muted transition-colors shadow-lg">
                        Contact Sales
                    </button>
                </div>
                <HiSupport className="absolute -right-12 -bottom-12 w-64 h-64 text-white/5 rotate-12" />
            </div>
        </div>
    );
}
