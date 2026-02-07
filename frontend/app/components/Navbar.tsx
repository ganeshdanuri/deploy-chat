"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { HiMenu, HiX, HiLightningBolt } from "react-icons/hi";
import { useAuth } from "../context/AuthContext";
import LoginModal from "./LoginModal";
import { theme } from "../theme";


export default function Navbar() {
  const { isAuthenticated, user, logout } = useAuth();
  const router = useRouter();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);



  const navLinks = [
    { label: "Features", href: "#features" },
    { label: "Integration", href: "#integration" },
    { label: "Testimonials", href: "#testimonials" },
    { label: "Pricing", href: "#pricing" },
  ];

  const handleMainButtonClick = () => {
    if (isAuthenticated) {
      router.push("/dashboard");
    } else {
      setIsLoginModalOpen(true);
    }
  };

  return (
    <>
      <nav

        className="fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b border-transparent"
        style={{
          backgroundColor: "rgba(255, 255, 255, 0.8)",
          backdropFilter: "blur(12px)",
          borderBottomColor: "rgba(226, 232, 240, 0.6)"
        }}
      >
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <div className="flex items-center gap-3 cursor-pointer" onClick={() => router.push("/")}>
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20"
                style={{
                  background: `linear-gradient(135deg, ${theme.colors.primary.main}, ${theme.colors.accent.purple})`
                }}
              >
                <HiLightningBolt className="text-white text-xl" />
              </div>
              <div>
                <span className="text-lg font-bold text-slate-900 tracking-tight block leading-none">Docking</span>
                <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest leading-none">AI Platform</span>
              </div>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex gap-1 items-center bg-slate-50/50 p-1 rounded-full border border-slate-200/50">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="text-sm font-medium px-5 py-2 rounded-full transition-all hover:bg-white hover:text-indigo-600 hover:shadow-sm"
                  style={{ color: theme.colors.neutral[600] }}
                >
                  {link.label}
                </a>
              ))}
            </div>

            {/* Right Side Actions */}
            <div className="flex items-center gap-4">
              {isAuthenticated ? (
                <>
                  <span className="hidden lg:inline text-sm font-medium text-slate-600">
                    Hi, {user?.username}
                  </span>
                  <div className="hidden sm:flex items-center gap-3">
                    <button
                      onClick={logout}
                      className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
                    >
                      Logout
                    </button>
                    <button
                      onClick={handleMainButtonClick}
                      className="text-white text-sm font-semibold px-6 py-2.5 rounded-xl hover:-translate-y-0.5 transition-all shadow-lg shadow-indigo-500/20"
                      style={{ background: theme.gradients.primaryButton }}
                    >
                      Dashboard
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <button
                    onClick={handleMainButtonClick}
                    className="hidden sm:block text-white text-sm font-semibold px-6 py-2.5 rounded-xl hover:-translate-y-0.5 transition-all shadow-lg shadow-indigo-500/20"
                    style={{ background: theme.gradients.primaryButton }}
                  >
                    Get Started
                  </button>
                  <button
                    onClick={() => setIsLoginModalOpen(true)}
                    className="hidden sm:block text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors"
                  >
                    Sign In
                  </button>
                </>
              )}

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
              >
                {isMobileMenuOpen ? <HiX size={24} /> : <HiMenu size={24} />}
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {isMobileMenuOpen && (
            <div className="md:hidden py-4 border-t border-slate-100 bg-white/50 backdrop-blur-xl animate-fade-in-down">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="block py-3 px-4 text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-indigo-600 rounded-lg transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.label}
                </a>
              ))}
              <div className="flex flex-col gap-3 mt-4 px-4 pt-4 border-t border-slate-100">
                {!isAuthenticated ? (
                  <>
                    <button
                      onClick={() => setIsLoginModalOpen(true)}
                      className="w-full text-center py-2.5 text-sm font-semibold text-slate-600 border border-slate-200 rounded-xl"
                    >
                      Sign In
                    </button>
                    <button
                      onClick={() => {
                        handleMainButtonClick();
                        setIsMobileMenuOpen(false);
                      }}
                      className="w-full py-2.5 text-white text-sm font-semibold rounded-xl shadow-lg shadow-indigo-500/20"
                      style={{ background: theme.gradients.primaryButton }}
                    >
                      Get Started
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => {
                        handleMainButtonClick();
                        setIsMobileMenuOpen(false);
                      }}
                      className="w-full py-2.5 text-white text-sm font-semibold rounded-xl"
                      style={{ background: theme.gradients.primaryButton }}
                    >
                      Dashboard
                    </button>
                    <button
                      onClick={() => {
                        logout();
                        setIsMobileMenuOpen(false);
                      }}
                      className="w-full text-center py-2.5 text-sm font-semibold text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                    >
                      Logout
                    </button>
                  </>
                )}
              </div>
            </div>
          )}
        </div>

        <LoginModal
          isOpen={isLoginModalOpen}
          onClose={() => setIsLoginModalOpen(false)}
        />
      </nav>
    </>
  );
}
