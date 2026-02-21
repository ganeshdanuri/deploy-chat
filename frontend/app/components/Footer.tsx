"use client";

import { theme } from "../theme";
import { FaRobot, FaTwitter, FaGithub, FaLinkedin } from "react-icons/fa";
import Logo from "./Logo";

const footerLinks = [
    {
        title: "Product",
        links: [
            { name: "Features", href: "#features" },
            { name: "Integrations", href: "#integration" },
            { name: "Pricing", href: "#pricing" },
            { name: "Changelog", href: "#" },
        ],
    },
    {
        title: "Resources",
        links: [
            { name: "Documentation", href: "#" },
            { name: "Help Center", href: "#" },
            { name: "API Reference", href: "#" },
            { name: "Community", href: "#" },
        ],
    },
    {
        title: "Company",
        links: [
            { name: "About Us", href: "#" },
            { name: "Privacy Policy", href: "#" },
            { name: "Terms of Service", href: "#" },
            { name: "Contact", href: "#" },
        ],
    },
];

export default function Footer() {
    return (
        <footer className="bg-white border-t" style={{ borderColor: theme.colors.neutral[200] }}>
            <div className="max-w-7xl mx-auto px-6 py-12 lg:py-20">
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-12 lg:gap-8">
                    {/* Logo and Tagline */}
                    <div className="col-span-2 space-y-6">
                        <div className="flex items-center gap-2">
                            <Logo className="h-10 w-auto" />
                            <span className="text-2xl font-black tracking-tight text-slate-900">
                                D<span style={{ color: "#4667ff" }}>E</span>PLOY C<span style={{ color: "#4667ff" }}>H</span>AT
                            </span>
                        </div>
                        <p className="max-w-xs text-sm leading-relaxed" style={{ color: theme.colors.neutral[600] }}>
                            Enterprise-grade AI chatbots for modern teams.
                            Automate your support and delight your customers in minutes.
                        </p>
                        <div className="flex gap-4">
                            {[FaTwitter, FaGithub, FaLinkedin].map((Icon, i) => (
                                <a
                                    key={i}
                                    href="#"
                                    className="w-10 h-10 rounded-full border flex items-center justify-center transition-colors hover:bg-slate-50"
                                    style={{ borderColor: theme.colors.neutral[200], color: theme.colors.neutral[500] }}
                                >
                                    <Icon className="text-lg" />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Links */}
                    {footerLinks.map((column) => (
                        <div key={column.title} className="col-span-1 space-y-6">
                            <h4 className="text-sm font-bold uppercase tracking-wider" style={{ color: theme.colors.neutral[900] }}>
                                {column.title}
                            </h4>
                            <ul className="space-y-4">
                                {column.links.map((link) => (
                                    <li key={link.name}>
                                        <a
                                            href={link.href}
                                            className="text-sm transition-colors hover:text-blue-600"
                                            style={{ color: theme.colors.neutral[600] }}
                                        >
                                            {link.name}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}

                    {/* Newsletter */}
                    <div className="col-span-2 lg:col-span-2 space-y-6">
                        <h4 className="text-sm font-bold uppercase tracking-wider" style={{ color: theme.colors.neutral[900] }}>
                            Stay Updated
                        </h4>
                        <p className="text-sm" style={{ color: theme.colors.neutral[600] }}>
                            Get the latest product updates and AI tips.
                        </p>
                        <div className="flex gap-2">
                            <input
                                type="email"
                                placeholder="Email address"
                                className="flex-1 px-4 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                                style={{ borderColor: theme.colors.neutral[300], backgroundColor: theme.colors.neutral[50] }}
                            />
                            <button
                                className="px-6 py-2.5 rounded-xl text-white text-sm font-bold transition-all hover:-translate-y-0.5"
                                style={{ backgroundColor: theme.colors.primary.main }}
                            >
                                Join
                            </button>
                        </div>
                    </div>
                </div>

                <div className="mt-20 pt-8 border-t flex flex-col md:flex-row justify-between items-center gap-6" style={{ borderColor: theme.colors.neutral[100] }}>
                    <p className="text-xs" style={{ color: theme.colors.neutral[500] }}>
                        © {new Date().getFullYear()} Deploy Chat Inc. All rights reserved.
                    </p>
                    <div className="flex gap-8">
                        <a href="#" className="text-xs transition-colors hover:text-blue-600" style={{ color: theme.colors.neutral[500] }}>Status</a>
                        <a href="#" className="text-xs transition-colors hover:text-blue-600" style={{ color: theme.colors.neutral[500] }}>Security</a>
                        <a href="#" className="text-xs transition-colors hover:text-blue-600" style={{ color: theme.colors.neutral[500] }}>GDPR</a>
                    </div>
                </div>
            </div>
        </footer>
    );
}
