"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Lock, Eye, EyeOff, ShieldAlert, ShieldCheck } from "lucide-react";
import UploadZone from "@/components/upload/UploadZone";

const UPLOAD_PASSWORD = "hasan@123";

export default function UploadPage() {
  const [unlocked, setUnlocked] = useState(false);
  const [input, setInput] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState(false);
  const [shake, setShake] = useState(false);

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (input === UPLOAD_PASSWORD) {
      setError(false);
      setUnlocked(true);
    } else {
      setError(true);
      setInput("");
      setShake(true);
      setTimeout(() => setShake(false), 600);
    }
  };

  return (
    <div className="max-w-3xl mx-auto flex flex-col gap-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4 text-gradient">Upload to Gallery</h1>
        <p className="text-muted">Add new memories to your digital universe.</p>
      </div>

      {unlocked ? (
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
            animate={
              shake
                ? {
                    opacity: 1,
                    scale: 1,
                    x: [0, -12, 12, -10, 10, -6, 6, 0],
                  }
                : { opacity: 1, scale: 1, x: 0 }
            }
            transition={{ duration: shake ? 0.5 : 0.4, type: "spring" }}
            className="glass-card rounded-3xl p-10 flex flex-col items-center gap-6 max-w-md mx-auto w-full"
          >
            {/* Icon */}
            <div
              className={`w-20 h-20 rounded-full flex items-center justify-center transition-colors ${
                error
                  ? "bg-red-500/20 border border-red-500/40"
                  : "bg-primary-500/20 border border-primary-500/40"
              }`}
            >
              {error ? (
                <ShieldAlert className="w-10 h-10 text-red-400" />
              ) : (
                <Lock className="w-10 h-10 text-primary-400" />
              )}
            </div>

            <div className="text-center">
              <h2 className="text-2xl font-bold mb-2">Protected Area</h2>
              <p className={`text-sm ${error ? "text-red-400" : "text-muted"}`}>
                {error
                  ? "❌ Wrong password! Please try again."
                  : "Enter the password to access the upload page."}
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4">
              <div className="relative">
                <input
                  type={showPw ? "text" : "password"}
                  value={input}
                  autoFocus
                  onChange={(e) => {
                    setInput(e.target.value);
                    setError(false);
                  }}
                  placeholder="Enter password..."
                  className={`w-full px-5 py-4 pr-14 rounded-xl bg-white/5 border text-white placeholder:text-muted focus:outline-none transition-all text-base ${
                    error
                      ? "border-red-500/60 focus:border-red-500"
                      : "border-white/10 focus:border-primary-500"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted hover:text-white transition-colors"
                >
                  {showPw ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>

              <button
                type="submit"
                className="w-full py-4 rounded-xl bg-gradient-to-r from-primary-600 to-secondary-600 hover:from-primary-500 hover:to-secondary-500 text-white font-semibold text-base transition-all shadow-[0_0_20px_rgba(124,58,237,0.3)] flex items-center justify-center gap-2"
              >
                <ShieldCheck className="w-5 h-5" />
                Unlock Upload
              </button>
            </form>
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  );
}
