"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Lock, Image as ImageIcon, FileText } from "lucide-react";
import UploadZone from "@/components/upload/UploadZone";
import DocumentUploadZone from "@/components/upload/DocumentUploadZone";

export default function UploadPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState<"images" | "documents">("images");

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
    window.addEventListener("storage", checkLogin);
    return () => window.removeEventListener("storage", checkLogin);
  }, []);

  if (!mounted) return null;

  return (
    <div className="max-w-3xl mx-auto flex flex-col gap-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4 text-gradient">Upload</h1>
        <p className="text-muted">Add new content to your digital universe.</p>
      </div>

      {isLoggedIn ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex flex-col gap-8"
        >
          {/* Tab Switcher */}
          <div className="flex items-center justify-center gap-2 bg-white/5 rounded-2xl p-1.5 max-w-xs mx-auto w-full border border-white/10">
            <button
              onClick={() => setActiveTab("images")}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                activeTab === "images"
                  ? "bg-primary-600 text-white shadow-lg shadow-primary-600/30"
                  : "text-muted hover:text-white"
              }`}
            >
              <ImageIcon className="w-4 h-4" /> Images
            </button>
            <button
              onClick={() => setActiveTab("documents")}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                activeTab === "documents"
                  ? "bg-secondary-600 text-white shadow-lg shadow-secondary-600/30"
                  : "text-muted hover:text-white"
              }`}
            >
              <FileText className="w-4 h-4" /> Documents
            </button>
          </div>

          <AnimatePresence mode="wait">
            {activeTab === "images" ? (
              <motion.div
                key="images"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.25 }}
              >
                <UploadZone />
              </motion.div>
            ) : (
              <motion.div
                key="documents"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.25 }}
              >
                <DocumentUploadZone />
              </motion.div>
            )}
          </AnimatePresence>
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
                You must be logged in as an admin to upload. Please use the <strong>Login</strong> button in the top navigation bar.
              </p>
            </div>
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  );
}
