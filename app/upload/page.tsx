"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Lock, ShieldAlert } from "lucide-react";
import UploadZone from "@/components/upload/UploadZone";

export default function UploadPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const checkLogin = () => {
      const loggedIn = localStorage.getItem("hasan_logged_in");
      if (loggedIn === "true") {
        setIsLoggedIn(true);
      } else {
        setIsLoggedIn(false);
      }
    };
    
    checkLogin();
    // Re-check periodically in case they log out in another tab
    window.addEventListener("storage", checkLogin);
    return () => window.removeEventListener("storage", checkLogin);
  }, []);

  if (!mounted) return null; // Avoid hydration mismatch

  return (
    <div className="max-w-3xl mx-auto flex flex-col gap-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4 text-gradient">Upload to Gallery</h1>
        <p className="text-muted">Add new memories to your digital universe.</p>
      </div>

      {isLoggedIn ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <UploadZone />
        </motion.div>
      ) : (
        <AnimatePresence>
          <motion.div
            key="password-gate"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-card rounded-3xl p-10 flex flex-col items-center gap-6 max-w-md mx-auto w-full text-center"
          >
            <div className="w-20 h-20 rounded-full flex items-center justify-center bg-red-500/20 border border-red-500/40">
              <Lock className="w-10 h-10 text-red-400" />
            </div>

            <div>
              <h2 className="text-2xl font-bold mb-2">Access Denied</h2>
              <p className="text-muted">
                You must be logged in as an admin to upload images. Please use the <strong>Login</strong> button in the top navigation bar.
              </p>
            </div>
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  );
}
