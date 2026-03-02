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
          backgroundColor: "rgba(255, 255, 255, 0.9)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          borderBottom: "1px solid rgba(0, 0, 0, 0.06)",
        }}
      >
        <div className="max-w-[1400px] mx-auto px-10">
          <div className="flex items-center justify-between h-[72px]">
            {/* Logo */}
            <div className="flex items-center gap-3 cursor-pointer" onClick={() => router.push("/")}>
              <Logo className="h-9 w-auto" />
              <span className="text-xl font-bold tracking-tight text-secondary">
                {BRAND.first} <span className="text-primary">{BRAND.second}</span>
              </span>
            </div>

            {/* Right Side — Nav Links + Login */}
            <div className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="relative text-[13px] font-medium px-5 py-2 text-foreground transition-colors hover:text-secondary after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:w-0 after:h-[2px] after:bg-primary after:transition-all after:duration-200 hover:after:w-5"
                >
                  {link.label}
                </a>
              ))}

              <div className="w-px h-5 bg-[#e0e0ea] mx-3" />

              <button
                onClick={handleMainButtonClick}
                className="text-[13px] font-medium px-6 py-2 text-secondary border border-[#d8d8e4] hover:border-primary hover:text-primary transition-all duration-200"
              >
                Login
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 text-secondary hover:text-primary transition-colors"
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
                  className="block py-3 px-4 text-sm font-medium text-foreground hover:text-primary transition-colors"
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
                  className="w-full py-2.5 text-secondary text-sm font-medium border border-[#d8d8e4]"
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
