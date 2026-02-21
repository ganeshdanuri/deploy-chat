"use client";

import { HiQuestionMarkCircle, HiBookOpen, HiSupport, HiChatAlt } from "react-icons/hi";

export default function HelpPage() {
    const helpSections = [
        {
            title: "Documentation",
            description: "Detailed guides and API references to help you build faster.",
            icon: HiBookOpen,
            color: "text-blue-600",
            bgColor: "bg-blue-50"
        },
        {
            title: "Support Tickets",
            description: "Need technical help? Open a ticket and our team will assist you.",
            icon: HiSupport,
            color: "text-purple-600",
            bgColor: "bg-purple-50"
        },
        {
            title: "Community Discord",
            description: "Join our community to share ideas and get help from other builders.",
            icon: HiChatAlt,
            color: "text-indigo-600",
            bgColor: "bg-indigo-50"
        }
    ];

    return (
        <div className="animate-fade-in-up">
            <div className="flex items-center gap-3 mb-8">
                <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl ring-1 ring-indigo-100">
                    <HiQuestionMarkCircle className="w-8 h-8" />
                </div>
                <div>
                    <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Help Center</h1>
                    <p className="text-slate-500 font-medium">How can we help you today?</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {helpSections.map((section, idx) => {
                    const Icon = section.icon;
                    return (
                        <div key={idx} className="p-8 bg-white rounded-[2rem] border border-slate-200 shadow-sm hover:shadow-xl transition-all group cursor-pointer">
                            <div className={`w-14 h-14 ${section.bgColor} ${section.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                                <Icon className="w-7 h-7" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-3">{section.title}</h3>
                            <p className="text-slate-500 leading-relaxed text-sm">
                                {section.description}
                            </p>
                            <button className="mt-8 text-sm font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-2">
                                Get Started
                                <span className="group-hover:translate-x-1 transition-transform">→</span>
                            </button>
                        </div>
                    );
                })}
            </div>

            <div className="mt-12 p-8 bg-slate-900 rounded-[2.5rem] text-white overflow-hidden relative">
                <div className="relative z-10">
                    <h2 className="text-2xl font-bold mb-4">Enterprise Support</h2>
                    <p className="text-slate-400 max-w-xl mb-8 leading-relaxed">
                        Looking for dedicated support, custom integrations, or on-premise deployment? Our enterprise team is here to help.
                    </p>
                    <button className="px-6 py-1.5 bg-white text-slate-900 font-bold rounded-xl hover:bg-slate-100 transition-colors shadow-lg">
                        Contact Sales
                    </button>
                </div>
                <HiSupport className="absolute -right-12 -bottom-12 w-64 h-64 text-white/5 rotate-12" />
            </div>
        </div>
    );
}
