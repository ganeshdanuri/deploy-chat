import type { Metadata } from "next";
import { Onest } from "next/font/google";
import { GeistMono } from "geist/font/mono";
import "./globals.css";
import { AuthProvider } from "./context/AuthContext";
import ReduxProvider from "./components/ReduxProvider";
import ToastProvider from "./components/ToastProvider";
import GoogleOAuthWrapper from "./components/GoogleOAuthWrapper";
import { Analytics } from "@vercel/analytics/next";

const onest = Onest({
  variable: "--font-onest",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Deploy Chat — Open source chatbot platform",
  description: "Ship an AI agent trained on your data in minutes.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${onest.variable} ${GeistMono.variable}`}
>
      <head />
      <body className="antialiased font-sans">
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
