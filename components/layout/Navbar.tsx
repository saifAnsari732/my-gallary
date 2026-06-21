"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Upload, Image as ImageIcon, Home } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { path: "/", label: "Home", icon: Home },
  { path: "/gallery", label: "Gallery", icon: ImageIcon },
  { path: "/upload", label: "Upload", icon: Upload },
  { path: "/upload?bulk=true", label: "Bulk Upload", icon: Upload },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <>
      {/* Top Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#050816]/80 backdrop-blur-lg border-b border-white/10 shadow-lg shadow-black/50">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-4 flex items-center justify-between gap-6">
          <Link href="/" className="flex items-center gap-3 shrink-0 group">
            <Image 
              src="/logo.svg" 
              alt="Hasan Pic Logo" 
              width={32} 
              height={32} 
              className="w-8 h-8 rounded-full transform group-hover:scale-110 transition-transform" 
            />
            <span className="font-bold text-lg tracking-wide text-foreground">
              Hasan Pic
            </span>
          </Link>
          
          {/* Navigation Items */}
          <div className="flex items-center gap-4 md:gap-6">
            {navItems.filter(item => item.path !== "/").map((item) => {
              // Exact match for active state
              const isActive = pathname === item.path.split('?')[0];
              return (
                <Link key={item.path} href={item.path} className="relative group flex items-center gap-2 whitespace-nowrap">
                  <span className={cn(
                    "text-xs md:text-sm font-medium transition-colors hover:text-foreground",
                    isActive ? "text-foreground" : "text-muted"
                  )}>
                    {item.label}
                  </span>
                  {isActive && (
                    <motion.div
                      layoutId="navbar-indicator-desktop"
                      className="absolute -bottom-2 left-0 right-0 h-0.5 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full"
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                </Link>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Mobile Bottom Navbar */}
      <nav className="md:hidden fixed bottom-6 left-4 right-4 z-50 pointer-events-none">
        <div className="bg-[#050816] rounded-full px-4 py-3 flex items-center justify-between pointer-events-auto max-w-sm mx-auto shadow-2xl shadow-black/80 border border-white/10">
          {navItems.map((item) => {
            const isActive = pathname === item.path.split('?')[0];
            const Icon = item.icon;
            return (
              <Link key={item.path} href={item.path} className="relative flex flex-col items-center gap-1 w-16 group">
                <Icon className={cn("w-5 h-5 transition-colors duration-300", isActive ? "text-primary-400" : "text-muted group-hover:text-foreground")} />
                <span className={cn(
                  "text-[10px] font-medium transition-colors duration-300 whitespace-nowrap",
                  isActive ? "text-foreground" : "text-muted group-hover:text-foreground"
                )}>
                  {item.label}
                </span>
                {isActive && (
                  <motion.div
                    layoutId="navbar-indicator-mobile"
                    className="absolute -bottom-2 left-1/4 right-1/4 h-0.5 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
