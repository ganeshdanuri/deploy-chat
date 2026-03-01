"use client";

import { theme } from "../theme";
import { FaTwitter, FaGithub, FaLinkedin } from "react-icons/fa";
import Logo from "./Logo";
import { FOOTER_LINKS as footerLinks, SOCIAL_LINKS } from "../../lib/constants";

export default function Footer() {
    return (
        <footer className="bg-white">
            <div className="max-w-7xl mx-auto px-6 py-12 lg:py-20">
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-12 lg:gap-8">
                    {/* Logo and Tagline */}
                    <div className="col-span-2 space-y-6">
                        <div className="flex items-center gap-2">
                            <Logo className="h-10 w-auto" />
                            <span className="text-2xl font-bold tracking-tight text-[#201f32]">
                                DEPLOY <span className="text-[#262ef2]">CHAT</span>
                            </span>
                        </div>
                        <p className="max-w-xs text-sm leading-relaxed text-[#4d5564]">
                            Enterprise-grade AI chatbots for modern teams.
                            Automate your support and delight your customers in minutes.
                        </p>
                        <div className="flex gap-4">
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
                                    className="w-10 h-10 rounded-full bg-[#f3f3f9] flex items-center justify-center transition-colors hover:bg-[#e3e3e3] text-[#a1a1a1]"
                                >
                                    <social.Icon className="text-lg" />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Links */}
                    {footerLinks.map((column) => (
                        <div key={column.title} className="col-span-1 space-y-6">
                            <h4 className="text-sm font-semibold uppercase tracking-widest text-[#201f32]">
                                {column.title}
                            </h4>
                            <ul className="space-y-4">
                                {column.links.map((link) => (
                                    <li key={link.name}>
                                        <a
                                            href={link.href}
                                            className="text-sm transition-colors hover:text-[#262ef2] text-[#4d5564]"
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
                        <h4 className="text-sm font-semibold uppercase tracking-widest text-[#201f32]">
                            Stay Updated
                        </h4>
                        <p className="text-sm text-[#4d5564]">
                            Get the latest product updates and AI tips.
                        </p>
                        <div className="flex gap-2">
                            <input
                                type="email"
                                placeholder="Email address"
                                className="text-sm flex-1 px-4 py-2.5 rounded-xl bg-[#f3f3f9] focus:outline-none focus:ring-2 focus:ring-[#262ef2]/20 text-[#201f32] placeholder-[#a1a1a1]"
                            />
                            <button
                                className="text-sm font-medium px-6 py-2.5 rounded-xl text-white transition-all hover:-translate-y-0.5 bg-[#262ef2]"
                            >
                                Join
                            </button>
                        </div>
                    </div>
                </div>

                <div className="mt-14 pt-8 flex flex-col md:flex-row justify-between items-center gap-6">
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
