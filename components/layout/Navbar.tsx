"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, Image as ImageIcon, Home, Lock, ShieldAlert, Eye, EyeOff, LogIn, Shield } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import ProfileAvatar from "./ProfileAvatar";

const navItems = [
  { path: "/", label: "Home", icon: Home },
  { path: "/gallery", label: "Gallery", icon: ImageIcon },
  { path: "/upload", label: "Upload", icon: Upload },
  { path: "/upload?bulk=true", label: "Bulk Upload", icon: Upload },
  { path: "/admin", label: "Admin", icon: Shield },
];

const ADMIN_PASSWORD = "hasan@123";

export default function Navbar() {
  const pathname = usePathname();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [shake, setShake] = useState(false);

  useEffect(() => {
    const loggedIn = localStorage.getItem("hasan_logged_in");
    if (loggedIn === "true") {
      setIsLoggedIn(true);
    }
  }, []);

  const handleLogin = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (passwordInput === ADMIN_PASSWORD) {
      localStorage.setItem("hasan_logged_in", "true");
      document.cookie = "hasan_logged_in=true; path=/";
      window.dispatchEvent(new Event("hasan-login"));
      setIsLoggedIn(true);
      setShowLoginModal(false);
      setPasswordInput("");
      setPasswordError(false);
    } else {
      setPasswordError(true);
      setShake(true);
      setTimeout(() => setShake(false), 500);
      setPasswordInput("");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("hasan_logged_in");
    document.cookie = "hasan_logged_in=; path=/; max-age=0";
    window.dispatchEvent(new Event("hasan-logout"));
    setIsLoggedIn(false);
  };

  const visibleNavItems = navItems.filter(item => {
    if (!isLoggedIn && (item.path.includes("/upload") || item.path === "/admin")) return false;
    return true;
  });

  const topNavItems = visibleNavItems.filter(item => item.path !== "/");

  return (
    <>
      {/* Top Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#050816]/80 backdrop-blur-lg border-b border-white/10 shadow-lg shadow-black/50">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-4 flex items-center justify-between gap-6">
          <div className="flex items-center gap-3 shrink-0 group">
            <ProfileAvatar />
            <Link href="/" className="font-bold text-lg tracking-wide text-foreground">
              Hasan Pic
            </Link>
          </div>
          
          {/* Navigation Items */}
          <div className="flex items-center gap-4 md:gap-6">
            {topNavItems.map((item) => {
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
            
            {!isLoggedIn ? (
              <button 
                onClick={() => setShowLoginModal(true)}
                className="flex items-center gap-2 text-xs md:text-sm font-medium text-white bg-primary-600 hover:bg-primary-500 px-4 py-2 rounded-full transition-colors"
              >
                <LogIn className="w-4 h-4" />
                Login
              </button>
            ) : (
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 text-xs md:text-sm font-medium text-white bg-red-500/90 hover:bg-red-500 px-4 py-2 rounded-full transition-colors"
              >
                Logout
              </button>
            )}
            
          </div>
        </div>
      </nav>

      {/* Mobile Bottom Navbar */}
      <nav className="md:hidden fixed bottom-6 left-4 right-4 z-50 pointer-events-none">
        <div className="bg-[#050816] rounded-full px-4 py-3 flex items-center justify-center gap-6 pointer-events-auto max-w-sm mx-auto shadow-2xl shadow-black/80 border border-white/10">
          {visibleNavItems.map((item) => {
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

      {/* Login Modal */}
      <AnimatePresence>
        {showLoginModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-md px-4"
            onClick={(e) => { if (e.target === e.currentTarget) setShowLoginModal(false); }}
          >
            <motion.div
              initial={{ scale: 0.85, opacity: 0, y: 30 }}
              animate={shake ? { scale: 1, opacity: 1, y: 0, x: [0, -10, 10, -8, 8, -5, 5, 0] } : { scale: 1, opacity: 1, y: 0, x: 0 }}
              exit={{ scale: 0.85, opacity: 0, y: 30 }}
              transition={{ duration: shake ? 0.5 : 0.3, type: "spring" }}
              className="bg-[#0B1120] border border-white/10 rounded-3xl p-8 w-full max-w-sm shadow-2xl shadow-black/60 flex flex-col gap-6"
            >
              {/* Icon */}
              <div className="flex flex-col items-center gap-3">
                <div className={`w-16 h-16 rounded-full flex items-center justify-center ${passwordError ? "bg-red-500/20 border border-red-500/40" : "bg-primary-500/20 border border-primary-500/40"}`}>
                  {passwordError
                    ? <ShieldAlert className="w-8 h-8 text-red-400" />
                    : <Lock className="w-8 h-8 text-primary-400" />
                  }
                </div>
                <h2 className="text-xl font-bold text-white">Admin Login</h2>
                <p className="text-sm text-center text-muted">
                  {passwordError
                    ? "❌ Wrong password! Please try again."
                    : "Enter the admin password to manage uploads."}
                </p>
              </div>

              {/* Input Form */}
              <form onSubmit={handleLogin} className="flex flex-col gap-4">
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={passwordInput}
                    onChange={(e) => { setPasswordInput(e.target.value); setPasswordError(false); }}
                    autoFocus
                    placeholder="Enter password..."
                    className={`w-full px-4 py-3 pr-12 rounded-xl bg-white/5 border transition-colors focus:outline-none ${
                      passwordError
                        ? "border-red-500/60 focus:border-red-500"
                        : "border-white/10 focus:border-primary-500"
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-white transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>

                {/* Buttons */}
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => { setShowLoginModal(false); setPasswordInput(""); setPasswordError(false); }}
                    className="flex-1 py-3 rounded-xl border border-white/10 text-muted hover:bg-white/5 hover:text-white transition-all font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-3 rounded-xl bg-gradient-to-r from-primary-600 to-secondary-600 hover:from-primary-500 hover:to-secondary-500 text-white font-semibold transition-all shadow-[0_0_15px_rgba(124,58,237,0.3)]"
                  >
                    Login
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
