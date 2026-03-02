"use client";

import { FaTwitter, FaGithub, FaLinkedin } from "react-icons/fa";
import Logo from "./Logo";
import { FOOTER_LINKS as footerLinks, SOCIAL_LINKS, BRAND } from "../../lib/constants";

export default function Footer() {
    return (
        <footer className="bg-white border-t border-[#e8e8f0]">
            <div className="max-w-[1400px] mx-auto px-10 py-16 lg:py-20">
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-12 lg:gap-8">
                    {/* Logo and Tagline */}
                    <div className="col-span-2 space-y-6">
                        <div className="flex items-center gap-2">
                            <Logo className="h-9 w-auto" />
                            <span className="text-xl font-bold tracking-tight text-[#201f32]">
                                {BRAND.first} <span className="text-[#262ef2]">{BRAND.second}</span>
                            </span>
                        </div>
                        <p className="max-w-xs text-sm leading-relaxed text-[#5a5a6a]">
                            Enterprise-grade AI chatbots for modern teams.
                            Automate your support and delight your customers in minutes.
                        </p>
                        <div className="flex gap-3">
                            {[
                                { Icon: FaTwitter, href: SOCIAL_LINKS.twitter },
                                { Icon: FaGithub, href: SOCIAL_LINKS.github },
                                { Icon: FaLinkedin, href: SOCIAL_LINKS.linkedin }
                            ].map((social, i) => (
                                <a
                                    key={i}
                                    href={social.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-9 h-9 bg-[#f3f3f9] flex items-center justify-center transition-colors hover:bg-[#e3e2e5] text-[#8a8a9a] hover:text-[#201f32]"
                                >
                                    <social.Icon className="text-base" />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Links */}
                    {footerLinks.map((column) => (
                        <div key={column.title} className="col-span-1 space-y-5">
                            <h4 className="text-xs font-semibold uppercase tracking-widest text-[#201f32]">
                                {column.title}
                            </h4>
                            <ul className="space-y-3">
                                {column.links.map((link) => (
                                    <li key={link.name}>
                                        <a
                                            href={link.href}
                                            className="text-sm transition-colors hover:text-[#262ef2] text-[#5a5a6a]"
                                        >
                                            {link.name}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}

                    {/* Newsletter */}
                    <div className="col-span-2 lg:col-span-2 space-y-5">
                        <h4 className="text-xs font-semibold uppercase tracking-widest text-[#201f32]">
                            Stay Updated
                        </h4>
                        <p className="text-sm text-[#5a5a6a]">
                            Get the latest product updates and AI tips.
                        </p>
                        <div className="flex gap-2">
                            <input
                                type="email"
                                placeholder="Email address"
                                className="text-sm flex-1 px-4 py-2.5 bg-[#f3f3f9] focus:outline-none focus:ring-2 focus:ring-[#262ef2]/20 text-[#201f32] placeholder-[#a1a1a1]"
                            />
                            <button
                                className="text-sm font-medium px-6 py-2.5 text-white transition-all hover:opacity-90 bg-[#262ef2]"
                            >
                                Join
                            </button>
                        </div>
                    </div>
                </div>

                <div className="mt-14 pt-8 border-t border-[#e8e8f0] flex flex-col md:flex-row justify-between items-center gap-6">
                    <p className="text-xs text-[#a1a1a1]">
                        © {new Date().getFullYear()} Deploy Chat Inc. All rights reserved.
                    </p>
                    <div className="flex gap-8">
                        <a href="#" className="text-xs transition-colors hover:text-[#262ef2] text-[#a1a1a1]">Status</a>
                        <a href="#" className="text-xs transition-colors hover:text-[#262ef2] text-[#a1a1a1]">Security</a>
                        <a href="#" className="text-xs transition-colors hover:text-[#262ef2] text-[#a1a1a1]">GDPR</a>
                    </div>
                </div>
            </div>
        </footer>
    );
}
