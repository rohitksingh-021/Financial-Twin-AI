import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/layout/Sidebar";

const inter = Inter({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Financial Twin AI",
  description:
    "AI-Powered Financial Digital Twin — Personalized wealth advisory through an intelligent digital interface",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex">
        <div className="bg-orbs" />
        <Sidebar />
        <main className="flex-1 ml-[260px] relative z-10 min-h-screen">
          {children}
        </main>
      </body>
    </html>
  );
}
