"use client";

import Link from "next/link";
import { SiX } from "react-icons/si";
import Logo from "./Logo";

const SOCIALS = [
  { label: "X", href: "https://x.com/deploychat", Icon: SiX },
];

const COLUMNS = [
  {
    title: "Product",
    links: [
      { label: "Features", href: "#features" },
      { label: "Integrations", href: "#integrations" },
      { label: "Changelog", href: "#" },
      { label: "Docs", href: "#" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Help Center", href: "#" },
      { label: "API Reference", href: "#" },
      { label: "Status", href: "#" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", href: "#" },
      { label: "Privacy", href: "#" },
      { label: "Terms", href: "#" },
      { label: "Contact", href: "mailto:sales@deploymind.com" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="container-page py-14">
        <div className="grid grid-cols-2 md:grid-cols-[1.5fr_1fr_1fr_1fr] gap-10">
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="inline-flex items-center gap-2.5 mb-4">
              <Logo className="h-7 w-auto" />
              <span className="text-[15px] font-medium tracking-tight">
                Deploy Chat
              </span>
            </Link>
            <p className="text-sm text-muted-foreground max-w-xs leading-relaxed">
              Enterprise-grade AI agents for modern teams. Automate support
              and delight customers in minutes.
            </p>
            <div className="flex items-center gap-2 mt-5">
              {SOCIALS.map(({ label, href, Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="w-9 h-9 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-[var(--border-medium)] transition-colors"
                >
                  <Icon size={15} />
                </a>
              ))}
            </div>
          </div>

          {COLUMNS.map((col) => (
            <div key={col.title}>
              <div className="text-[11px] font-medium uppercase tracking-[0.1em] text-muted-foreground mb-4">
                {col.title}
              </div>
              <ul className="flex flex-col gap-2.5">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
>
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-14 pt-6 border-t border-border flex flex-wrap justify-between items-center gap-3">
          <span className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} Deploy Chat Inc. All rights reserved.
          </span>
          <div className="flex gap-5 text-xs text-muted-foreground">
            <Link href="#" className="hover:text-foreground transition-colors">
              Security
            </Link>
            <Link href="#" className="hover:text-foreground transition-colors">
              GDPR
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
