import { Sora, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "./context/AuthContext";
import ReduxProvider from "./components/ReduxProvider";
import ToastProvider from "./components/ToastProvider";
import HeroUIProviderWrapper from "./components/HeroUIProvider";
import GoogleOAuthWrapper from "./components/GoogleOAuthWrapper";
import { Analytics } from "@vercel/analytics/next"

const sora = Sora({
  variable: "--font-sora",
  subsets: ["latin"],
  display: "swap",
});

const ibmPlexMono = IBM_Plex_Mono({
  variable: "--font-ibm-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Deploy Chat - Open Source Chatbot",
  description: "An open-source chatbot platform built for developers.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${sora.variable} ${ibmPlexMono.variable}`}>
      <head>
      </head>
      <body
        className="antialiased font-sans"
      >
        <div className="mesh-gradient" />
        <ReduxProvider>
          <HeroUIProviderWrapper>
            <GoogleOAuthWrapper>
              <AuthProvider>
                <ToastProvider>
                  {children}
                  <Analytics />
                </ToastProvider>
              </AuthProvider>
            </GoogleOAuthWrapper>
          </HeroUIProviderWrapper>
        </ReduxProvider>
      </body>
    </html>
  );
}
