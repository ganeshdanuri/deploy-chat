import type { Metadata } from "next";
import { Sora, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "./context/AuthContext";
import ReduxProvider from "./components/ReduxProvider";
import ToastProvider from "./components/ToastProvider";
import HeroUIProviderWrapper from "./components/HeroUIProvider";
import GoogleOAuthWrapper from "./components/GoogleOAuthWrapper";

const sora = Sora({
  variable: "--font-sora",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  display: "swap",
});

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
    <html lang="en" className={`${sora.variable} ${jetbrainsMono.variable}`}>
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
                </ToastProvider>
              </AuthProvider>
            </GoogleOAuthWrapper>
          </HeroUIProviderWrapper>
        </ReduxProvider>
      </body>
    </html>
  );
}
