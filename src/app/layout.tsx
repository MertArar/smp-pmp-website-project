import type { Metadata } from "next";
import localFont from "next/font/local";

import Header from "@/components/layout/Header/Header";
import Footer from "@/components/layout/Footer/Footer";
import SmoothScrollProvider from "@/components/providers/SmoothScrollProvider";
import StartupScreen from "@/components/layout/StartupScreen";

import "./globals.css";
import "lenis/dist/lenis.css";

const sfPro = localFont({
  src: "../assets/fonts/SF-Pro.ttf",

  variable: "--font-sf-pro",

  weight: "1 1000",

  style: "normal",

  display: "swap",

  fallback: [
    "-apple-system",
    "BlinkMacSystemFont",
    "Segoe UI",
    "Arial",
    "sans-serif",
  ],
});

export const metadata: Metadata = {
  title: "Sempa",
  description: "Pump Technologies",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={sfPro.variable}>
        <StartupScreen />
        <SmoothScrollProvider>
          <Header />
          {children}
          <Footer />
        </SmoothScrollProvider>
      </body>
    </html>
  );
}
