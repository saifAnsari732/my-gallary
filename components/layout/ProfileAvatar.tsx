"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { Camera, Upload, Trash2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function ProfileAvatar() {
  const [profilePic, setProfilePic] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  

  useEffect(() => {
    setMounted(true);

    async function loadProfileAvatar() {
      try {
        const res = await fetch("/api/profile");
        const data = await res.json();
        if (data?.avatarUrl) {
          setProfilePic(data.avatarUrl);
        }
      } catch (error) {
        console.error("Failed to load profile avatar", error);
      }
    }

    loadProfileAvatar();
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setShowMenu(false);
      }
    };
    if (showMenu) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showMenu]);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log("ProfileAvatar: handleFileSelect fired", e?.target?.files?.[0]);
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please select an image file.");
      return;
    }

    setUploading(true);
    try {
      const authRes = await fetch("/api/imagekit/auth");
      const authData = await authRes.json();

      const formData = new FormData();
      formData.append("file", file);
      formData.append("publicKey", process.env.NEXT_PUBLIC_PUBLIC_KEY || "public_IV45jUAH3+Sean3qPo3IR5bxqH4=");
      formData.append("signature", authData.signature);
      formData.append("expire", authData.expire.toString());
      formData.append("token", authData.token);
      formData.append("fileName", "profile_" + Date.now());
      formData.append("folder", "/digital-gallery/profile");
      formData.append("useUniqueFileName", "true");

      const uploadRes = await fetch("https://upload.imagekit.io/api/v1/files/upload", {
        method: "POST",
        body: formData,
      });

      if (!uploadRes.ok) throw new Error("Upload failed");

      const uploadData = await uploadRes.json();
      setProfilePic(uploadData.url);
      await fetch("/api/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ avatarUrl: uploadData.url }),
      });
      setShowMenu(false);
    } catch (error) {
      console.error(error);
      alert("Failed to upload profile picture.");
    } finally {
      setUploading(false);
    }
  };

  const handleRemove = async () => {
    try {
      await fetch("/api/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ avatarUrl: null }),
      });
    } catch (error) {
      console.error("Failed to remove profile avatar", error);
    }
    setProfilePic(null);
    setShowMenu(false);
  };

  if (!mounted) {
    return (
      <div className="w-8 h-8 rounded-full bg-white/10" />
    );
  }

  return (
    <div className="relative" ref={menuRef}>
      <button
        type="button"
        onClick={(e) => { e.stopPropagation(); e.preventDefault(); setShowMenu(!showMenu); }}
        disabled={uploading}
        className="relative group shrink-0"
        title="Profile"
      >
        {profilePic ? (
          <Image
            src={profilePic}
            alt="Profile"
            width={36}
            height={36}
            className="w-12 h-12 rounded-full object-cover transform group-hover:scale-110 transition-transform ring-2 ring-white/10 group-hover:ring-primary-500/50"
          />
        ) : (
          <Image
            src="/logo.svg"
            alt="Hasan Pic Logo"
            width={36}
            height={36}
            className="w-12 h-12 rounded-full transform group-hover:scale-110 transition-transform"
          />
        )}
        <div className="absolute inset-0 rounded-full bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          {uploading ? (
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <Camera className="w-4 h-4 text-white" />
          )}
        </div>
      </button>

      <input
        id="profile-upload"
        type="file"
        accept="image/*"
        className="sr-only"
        onClick={() => console.log('ProfileAvatar: input clicked')}
        onChange={handleFileSelect}
      />

      <AnimatePresence>
          {showMenu && (
          <motion.div
            onClick={(e) => e.stopPropagation()}
            initial={{ opacity: 0, scale: 0.9, y: -5 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: -5 }}
            transition={{ duration: 0.15 }}
            className="absolute left-0 top-full mt-2 w-48 bg-[#0B1120] border border-white/10 rounded-2xl p-2 shadow-2xl shadow-black/60 z-[200]"
          >
            <label
                htmlFor="profile-upload"
                onClick={() => console.log('ProfileAvatar: label clicked')}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-muted hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
            >
              <Upload className="w-4 h-4" />
              Upload Photo
            </label>
            {profilePic && (
              <button
                onClick={handleRemove}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-muted hover:text-red-400 hover:bg-red-500/10 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                Remove Photo
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
