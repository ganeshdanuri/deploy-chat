"use client";

import { useEffect, useRef } from "react";
import { FaTwitter, FaGithub, FaLinkedin } from "react-icons/fa";
import Logo from "./Logo";
import { FOOTER_LINKS as footerLinks, SOCIAL_LINKS, BRAND } from "../../lib/constants";

export default function Footer() {
    const footerRef = useRef<HTMLElement>(null);

    useEffect(() => {
        let ctx: { revert: () => void };
        (async () => {
            const { gsap } = await import("gsap");
            const { ScrollTrigger } = await import("gsap/ScrollTrigger");
            gsap.registerPlugin(ScrollTrigger);

            ctx = gsap.context(() => {
                gsap.from(footerRef.current, {
                    opacity: 0,
                    y: 20,
                    duration: 0.8,
                    ease: "power3.out",
                    scrollTrigger: {
                        trigger: footerRef.current,
                        start: "top 95%",
                    }
                });
            });
        })();
        return () => ctx?.revert();
    }, []);

    return (
        <footer ref={footerRef} className="bg-white border-t border-border">
            <div className="max-w-6xl mx-auto px-6 lg:px-10 py-10 lg:py-14">
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-12 lg:gap-8">
                    {/* Logo and Tagline */}
                    <div className="col-span-2 space-y-6">
                        <div className="flex items-center gap-2">
                            <Logo className="h-9 w-auto" />
                            <span className="text-xl font-bold tracking-tight text-foreground">
                                {BRAND.first} <span className="gradient-text">{BRAND.second}</span>
                            </span>
                        </div>
                        <p className="max-w-xs text-sm leading-relaxed text-muted-foreground">
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
                                    className="w-9 h-9 bg-muted rounded-xl flex items-center justify-center transition-all duration-200 hover:bg-primary/10 text-muted-foreground hover:text-primary hover:-translate-y-0.5"
                                >
                                    <social.Icon className="text-base" />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Links */}
                    {footerLinks.map((column) => (
                        <div key={column.title} className="col-span-1 space-y-5">
                            <h4 className="text-xs font-semibold uppercase tracking-widest text-foreground">
                                {column.title}
                            </h4>
                            <ul className="space-y-3">
                                {column.links.map((link) => (
                                    <li key={link.name}>
                                        <a
                                            href={link.href}
                                            className="text-sm transition-colors duration-200 hover:text-primary text-muted-foreground"
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
                        <h4 className="text-xs font-semibold uppercase tracking-widest text-foreground">
                            Stay Updated
                        </h4>
                        <p className="text-sm text-muted-foreground">
                            Get the latest product updates and AI tips.
                        </p>
                        <div className="flex gap-2">
                            <input
                                type="email"
                                placeholder="Email address"
                                className="text-sm flex-1 px-4 py-2.5 bg-muted rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:ring-offset-2 text-foreground placeholder-muted-foreground border border-border"
                            />
                            <button
                                className="text-sm font-medium px-6 py-2.5 text-white rounded-xl gradient-bg transition-all duration-200 hover:brightness-110 hover:-translate-y-0.5 active:scale-[0.98]"
                            >
                                Join
                            </button>
                        </div>
                    </div>
                </div>

                <div className="mt-10 pt-6 border-t border-border flex flex-col md:flex-row justify-between items-center gap-6">
                    <p className="text-xs text-muted-foreground">
                        © {new Date().getFullYear()} Deploy Chat Inc. All rights reserved.
                    </p>
                    <div className="flex gap-8">
                        <a href="#" className="text-xs transition-colors hover:text-primary text-muted-foreground">Status</a>
                        <a href="#" className="text-xs transition-colors hover:text-primary text-muted-foreground">Security</a>
                        <a href="#" className="text-xs transition-colors hover:text-primary text-muted-foreground">GDPR</a>
                    </div>
                </div>
            </div>
        </footer>
    );
}
