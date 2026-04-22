"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import Logo from "./Logo";
import { Button } from "@/components/ui/button";

const LINKS = [
  { href: "#features", label: "Features" },
  { href: "#pricing", label: "Pricing" },
  { href: "#faq", label: "FAQ" },
  { href: "#", label: "Docs" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY> 8);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-40 w-full transition-colors border-b border-border ${
        scrolled
          ? "bg-background/80 backdrop-blur-md"
          : "bg-background"
      }`}
>
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:max-w-full lg:px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5">
          <Logo className="h-7 w-auto" />
          <span className="text-[15px] font-medium tracking-tight">
            Deploy Chat
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          {LINKS.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
>
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-2">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/login">Sign in</Link>
          </Button>
          <Button size="sm" className="btn-pill" asChild>
            <a href="/login?register=true" target="_blank" rel="noopener noreferrer">
              Start free →
            </a>
          </Button>
        </div>

        <button
          className="md:hidden p-2 -mr-2 text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileOpen}
>
          {mobileOpen ? <X className="w-5 h-5" strokeWidth={1.75} /> : <Menu className="w-5 h-5" strokeWidth={1.75} />}
        </button>
      </div>

      {mobileOpen && (
        <div className="md:hidden border-t border-border bg-background px-5 py-4 space-y-3">
          {LINKS.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="block text-sm text-muted-foreground hover:text-foreground py-1"
              onClick={() => setMobileOpen(false)}
>
              {link.label}
            </Link>
          ))}
          <div className="pt-3 border-t border-border flex gap-2">
            <Button variant="outline" size="sm" className="flex-1" asChild>
              <Link href="/login" onClick={() => setMobileOpen(false)}>Sign in</Link>
            </Button>
            <Button size="sm" className="flex-1" asChild>
              <a
                href="/login?register=true"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setMobileOpen(false)}
              >
                Start free
              </a>
            </Button>
          </div>
        </div>
      )}
    </header>
  );
}
