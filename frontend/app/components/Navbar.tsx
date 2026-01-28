"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { HiMenu, HiX } from "react-icons/hi";
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
    { label: "Meetings", href: "#meetings" },
    { label: "Conferences", href: "#conferences" },
    { label: "Integration", href: "#integration" },
  ];

  const handleMainButtonClick = () => {
    if (isAuthenticated) {
      // If logged in, navigate to dashboard
      router.push("/dashboard");
    } else {
      // If not logged in, show login modal
      setIsLoginModalOpen(true);
    }
  };

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50" style={{ boxShadow: theme.shadows.sm }}>
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Email */}
          <div className="flex items-center gap-2">
            <div 
              className="w-10 h-10 rounded-lg flex items-center justify-center font-bold text-2xl text-white"
              style={{ background: `${theme.colors.primary.main}` }}
            >
              D
            </div>
            <span className="text-sm font-medium" style={{ color: theme.colors.neutral[700] }}>
              / Sales@meetinghub.io
            </span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex gap-8 items-center">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-sm font-medium transition-colors hover:opacity-80"
                style={{ color: theme.colors.neutral[700] }}
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center gap-4">
            {isAuthenticated ? (
              <>
                <span className="hidden sm:inline text-sm font-medium" style={{ color: theme.colors.neutral[700] }}>
                  Welcome, <span className="font-semibold">{user?.username}</span>
                </span>
                <button
                  onClick={logout}
                  className="hidden sm:block text-sm font-medium transition-colors hover:opacity-80 px-4 py-2"
                  style={{ color: theme.colors.neutral[700] }}
                >
                  Logout
                </button>
                <button
                  onClick={handleMainButtonClick}
                  className="hidden sm:block text-white text-sm font-semibold px-7 py-3 rounded-full hover:-translate-y-0.5 transition-all whitespace-nowrap"
                  style={{ 
                    backgroundColor: theme.colors.primary.main,
                    boxShadow: theme.shadows.md 
                  }}
                >
                  Dashboard
                </button>
              </>
            ) : (
              <button
                onClick={handleMainButtonClick}
                className="hidden sm:block text-white text-sm font-semibold px-7 py-3 rounded-full hover:-translate-y-0.5 transition-all whitespace-nowrap"
                style={{ 
                  backgroundColor: theme.colors.primary.main,
                  boxShadow: theme.shadows.md 
                }}
              >
                Get Started — It's Free
              </button>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2"
              style={{ color: theme.colors.neutral[700] }}
            >
              {isMobileMenuOpen ? <HiX size={24} /> : <HiMenu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden pb-4">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="block py-3 text-sm font-medium transition-colors hover:opacity-80"
                style={{ 
                  color: theme.colors.neutral[700],
                  borderBottom: `1px solid ${theme.colors.neutral[200]}`
                }}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {link.label}
              </a>
            ))}
            <div className="flex flex-col gap-3 mt-4">
              {!isAuthenticated ? (
                <button
                  onClick={() => {
                    handleMainButtonClick();
                    setIsMobileMenuOpen(false);
                  }}
                  className="text-white text-sm font-semibold px-7 py-3 rounded-full"
                  style={{ 
                    backgroundColor: theme.colors.primary.main,
                    boxShadow: theme.shadows.md 
                  }}
                >
                  Get Started — It's Free
                </button>
              ) : (
                <>
                  <span className="text-sm font-medium px-4 py-2" style={{ color: theme.colors.neutral[700] }}>
                    Welcome, <span className="font-semibold">{user?.username}</span>
                  </span>
                  <button
                    onClick={() => {
                      logout();
                      setIsMobileMenuOpen(false);
                    }}
                    className="text-sm font-medium transition-colors hover:opacity-80 px-4 py-2 text-left"
                    style={{ color: theme.colors.neutral[700] }}
                  >
                    Logout
                  </button>
                  <button
                    onClick={() => {
                      handleMainButtonClick();
                      setIsMobileMenuOpen(false);
                    }}
                    className="text-white text-sm font-semibold px-7 py-3 rounded-full"
                    style={{ 
                      backgroundColor: theme.colors.primary.main,
                      boxShadow: theme.shadows.md 
                    }}
                  >
                    Dashboard
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
  );
}
