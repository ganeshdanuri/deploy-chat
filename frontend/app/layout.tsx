import { Space_Grotesk, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "./context/AuthContext";
import ReduxProvider from "./components/ReduxProvider";
import ToastProvider from "./components/ToastProvider";
import GoogleOAuthWrapper from "./components/GoogleOAuthWrapper";
import { Analytics } from "@vercel/analytics/next"
import { TooltipProvider } from "@/components/ui/tooltip";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
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
    <html lang="en" className={`${spaceGrotesk.variable} ${ibmPlexMono.variable}`}>
      <head>
      </head>
      <body
        className="antialiased font-sans"
      >
        <div className="mesh-gradient" />
        <ReduxProvider>
          <TooltipProvider>
            <GoogleOAuthWrapper>
              <AuthProvider>
                <ToastProvider>
                  {children}
                  <Analytics />
                </ToastProvider>
              </AuthProvider>
            </GoogleOAuthWrapper>
          </TooltipProvider>
        </ReduxProvider>
      </body>
    </html>
  );
}
