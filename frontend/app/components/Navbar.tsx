"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowRight, Menu, X } from "lucide-react";
import Logo from "./Logo";
import { Button } from "@/components/ui/button";

const LINKS = [
  { href: "#features", label: "Features" },
  { href: "#integrations", label: "Integrations" },
  { href: "#faq", label: "FAQ" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    let lastY = window.scrollY;
    let queued = false;
    // Direction only flips after this much travel — without it, sub-pixel
    // scroll jitter (trackpads, momentum) makes the header flicker.
    const THRESHOLD = 6;

    const update = () => {
      queued = false;
      const y = window.scrollY;
      setScrolled(y > 8);
      if (y > 80) {
        if (Math.abs(y - lastY) > THRESHOLD) {
          setHidden(y > lastY);
          lastY = y;
        }
      } else {
        setHidden(false);
        lastY = y;
      }
    };

    const onScroll = () => {
      if (queued) return;
      queued = true;
      requestAnimationFrame(update);
    };

    // Via rAF so the initial sync (e.g. reload mid-page) isn't a setState
    // during mount.
    requestAnimationFrame(update);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!mobileOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [mobileOpen]);

  return (
    <header
      className={`sticky top-0 z-40 w-full border-b border-border transition-[transform,background-color,backdrop-filter] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${
        scrolled ? "bg-background/80 backdrop-blur-md" : "bg-background"
      } ${hidden ? "-translate-y-full" : "translate-y-0"}`}
>
      <div className="container-page h-16 flex items-center justify-between">
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
          <Button size="sm" variant="brand" className="btn-pill group" asChild>
            <a href="/login?register=true" target="_blank" rel="noopener noreferrer">
              Start free
              <ArrowRight className="transition-transform group-hover:translate-x-0.5" strokeWidth={2} />
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
            <Button size="sm" variant="brand" className="flex-1" asChild>
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
