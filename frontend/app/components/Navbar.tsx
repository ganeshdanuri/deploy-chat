"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { HiMenu, HiX } from "react-icons/hi";
import { LogIn } from "lucide-react";
import { useAuth } from "../context/AuthContext";

import { theme } from "../theme";
import Logo from "./Logo";
import { NAV_LINKS as navLinks, SOCIAL_LINKS } from "../../lib/constants";

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
          backgroundColor: "rgba(255, 255, 255, 0.8)",
          backdropFilter: "blur(12px)",
        }}
      >
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <div className="flex items-center gap-3 cursor-pointer" onClick={() => router.push("/")}>
              <Logo className="h-10 w-auto" />
              <div className="flex items-center">
                <span className="text-2xl font-bold tracking-tight block leading-none text-[#201f32]">
                  DEPLOY <span style={{ color: "#262ef2" }}>CHAT</span>
                </span>
              </div>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex gap-1 items-center p-1 rounded-lg">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="text-sm font-normal px-5 py-2 rounded-md transition-all hover:bg-[#f3f3f9] hover:text-[#262ef2]"
                  style={{ color: "#201f32" }}
                >
                  {link.label}
                </a>
              ))}
            </div>

            {/* Right Side Actions */}
            <div className="flex items-center gap-4">
              <button
                onClick={handleMainButtonClick}
                className="text-sm font-medium hidden sm:flex items-center gap-2 text-[#201f32] px-6 py-2.5 rounded-lg hover:bg-[#f3f3f9] transition-all"
              >
                <LogIn size={18} strokeWidth={2} className="opacity-60" />
                Login
              </button>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden p-2 text-[#201f32] hover:bg-[#f3f3f9] rounded-lg transition-colors"
              >
                {isMobileMenuOpen ? <HiX size={24} /> : <HiMenu size={24} />}
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {isMobileMenuOpen && (
            <div className="md:hidden py-4 bg-white/50 backdrop-blur-xl animate-fade-in-down">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="block py-3 px-4 text-sm font-normal text-[#201f32] hover:bg-[#f3f3f9] hover:text-[#262ef2] rounded-lg transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.label}
                </a>
              ))}
              <div className="flex flex-col gap-3 mt-4 px-4 pt-4">
                <button
                  onClick={() => {
                    handleMainButtonClick();
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full py-2.5 text-[#201f32] text-sm font-medium rounded-lg bg-[#f3f3f9]"
                >
                  Get Started
                </button>
              </div>
            </div>
          )}
        </div>


      </nav>
    </>
  );
}
