import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "./context/AuthContext";
import ReduxProvider from "./components/ReduxProvider";
import ToastProvider from "./components/ToastProvider";
import GoogleOAuthWrapper from "./components/GoogleOAuthWrapper";
import { Analytics } from "@vercel/analytics/next"


const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});



const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
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
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <head>
      </head>
      <body
        className="antialiased font-sans"
      >
        <div className="mesh-gradient" />
        <ReduxProvider>
          <GoogleOAuthWrapper>
            <AuthProvider>
              <ToastProvider>
                {children}
                <Analytics />
              </ToastProvider>
            </AuthProvider>
          </GoogleOAuthWrapper>
        </ReduxProvider>
      </body>
    </html>
  );
}
