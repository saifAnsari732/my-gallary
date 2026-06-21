import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Hasan Pic - Premium Image Showcase",
  description: "Store your memories in a beautiful digital universe.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} antialiased min-h-screen flex flex-col relative`}>
        <div className="aurora-bg" />
        <Navbar />
        <main className="flex-1 pt-24 pb-12 w-full max-w-7xl mx-auto px-6">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
