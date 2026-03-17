"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { HiMenu, HiX } from "react-icons/hi";
import { useAuth } from "../context/AuthContext";

import Logo from "./Logo";
import { NAV_LINKS as navLinks, BRAND } from "../../lib/constants";

export default function Navbar() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleMainButtonClick = () => {
    if (isAuthenticated) {
      router.push("/dashboard");
    } else {
      window.open("/login", "_blank", "noopener,noreferrer");
    }
  };

  return (
    <>
      <nav
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
        style={{
          backgroundColor: "var(--white-80)",
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
          borderBottom: "1px solid var(--foreground-ghost)",
        }}
      >
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <div className="flex items-center justify-between h-[72px]">
            {/* Logo */}
            <div className="flex items-center gap-3 cursor-pointer" onClick={() => router.push("/")}>
              <Logo className="h-9 w-auto" />
              <span className="text-2xl font-extrabold tracking-tight text-foreground">
                {BRAND.first} <span className="gradient-text">{BRAND.second}</span>
              </span>
            </div>

            {/* Right Side — Nav Links + Login */}
            <div className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="relative text-[14px] font-medium px-5 py-2 text-muted-foreground transition-colors duration-200 hover:text-foreground after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:w-0 after:h-[2px] after:rounded-full after:bg-primary after:transition-all after:duration-200 hover:after:w-5"
                >
                  {link.label}
                </a>
              ))}

              <div className="w-px h-5 bg-border mx-3" />

              <button
                onClick={handleMainButtonClick}
                className="text-[14px] font-medium px-5 py-2.5 rounded-lg gradient-bg text-white transition-all duration-200 hover:brightness-110 active:scale-[0.98]"
                style={{ boxShadow: 'var(--shadow-accent)' }}
              >
                Login
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-foreground hover:text-primary hover:bg-primary/5 transition-colors"
            >
              {isMobileMenuOpen ? <HiX size={24} /> : <HiMenu size={24} />}
            </button>
          </div>

          {/* Mobile Navigation */}
          {isMobileMenuOpen && (
            <div className="md:hidden py-4 border-t border-border">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="block py-3 px-4 text-sm font-medium text-muted-foreground hover:text-primary transition-colors rounded-lg"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.label}
                </a>
              ))}
              <div className="mt-4 px-4 pt-4 border-t border-border">
                <button
                  onClick={() => {
                    handleMainButtonClick();
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full py-3 text-sm font-medium rounded-xl gradient-bg text-white hover:brightness-110 transition-all"
                >
                  Login
                </button>
              </div>
            </div>
          )}
        </div>
      </nav>
    </>
  );
}
