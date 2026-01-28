"use client";

import { useState } from "react";
import Link from "next/link";
import { Phone, Menu, X } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import LoginModal from "./LoginModal";

export default function Navbar() {
  const { isAuthenticated, user, logout } = useAuth();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: "Video Call", href: "#video-call" },
    { label: "Meetings", href: "#meetings" },
    { label: "Conferences", href: "#conferences" },
    { label: "Integration", href: "#integration" },
  ];

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-20">
          {/* Logo and Email */}
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center font-bold text-2xl text-white">
              D
            </div>
            <span className="text-sm text-slate-700 font-medium">
              / Sales@meetinghub.io
            </span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex gap-8 items-center">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-slate-700 text-sm font-medium hover:text-indigo-500 transition-colors"
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center gap-4">
            {isAuthenticated ? (
              <>
                <span className="hidden sm:inline text-sm text-slate-700 font-medium">
                  Welcome, <span className="font-semibold">{user?.username}</span>
                </span>
                <button
                  onClick={logout}
                  className="text-slate-700 text-sm font-medium hover:text-indigo-500 transition-colors px-4 py-2"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => setIsLoginModalOpen(true)}
                  className="hidden sm:block text-slate-700 text-sm font-medium hover:text-indigo-500 transition-colors px-4 py-2"
                >
                  Login
                </button>

                <button className="w-12 h-12 rounded-full bg-emerald-500 flex items-center justify-center shadow-md hover:scale-105 hover:shadow-lg transition-all">
                  <Phone size={20} className="text-white" />
                </button>

                <button
                  onClick={() => setIsLoginModalOpen(true)}
                  className="hidden sm:block bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-sm font-semibold px-7 py-3 rounded-full shadow-md hover:-translate-y-0.5 hover:shadow-lg transition-all whitespace-nowrap"
                >
                  Get Started — It's Free
                </button>
              </>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 text-slate-700"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
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
                className="block py-3 text-slate-700 text-sm font-medium border-b border-slate-200 hover:text-indigo-500 transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {link.label}
              </a>
            ))}
            <div className="flex flex-col gap-3 mt-4">
              {!isAuthenticated ? (
                <>
                  <button
                    onClick={() => {
                      setIsLoginModalOpen(true);
                      setIsMobileMenuOpen(false);
                    }}
                    className="text-slate-700 text-sm font-medium hover:text-indigo-500 transition-colors px-4 py-2 text-left"
                  >
                    Login
                  </button>
                  <button
                    onClick={() => {
                      setIsLoginModalOpen(true);
                      setIsMobileMenuOpen(false);
                    }}
                    className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-sm font-semibold px-7 py-3 rounded-full shadow-md"
                  >
                    Get Started — It's Free
                  </button>
                </>
              ) : (
                <>
                  <span className="text-sm text-slate-700 font-medium px-4 py-2">
                    Welcome, <span className="font-semibold">{user?.username}</span>
                  </span>
                  <button
                    onClick={() => {
                      logout();
                      setIsMobileMenuOpen(false);
                    }}
                    className="text-slate-700 text-sm font-medium hover:text-indigo-500 transition-colors px-4 py-2 text-left"
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
  );
}
