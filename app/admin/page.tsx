"use client";

import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import { Lock, Loader2, FileText, Trash2, Download, ExternalLink, Calendar, File, Camera, Image as ImageIcon } from "lucide-react";
import { format } from "date-fns";
import Image from "next/image";

interface DocumentRecord {
  _id: string;
  title: string;
  description: string;
  url: string;
  fileId: string;
  fileType: string;
  fileSize: number;
  uploadDate: string;
}

export default function AdminPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [documents, setDocuments] = useState<DocumentRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [profilePic, setProfilePic] = useState<string | null>(null);
  const [uploadingPic, setUploadingPic] = useState(false);
  const picInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setMounted(true);

    async function loadProfilePic() {
      try {
        const res = await fetch("/api/profile");
        const data = await res.json();
        if (data?.avatarUrl) {
          setProfilePic(data.avatarUrl);
        }
      } catch (error) {
        console.error("Failed to load profile pic", error);
      }
    }

    loadProfilePic();

    const loggedIn = localStorage.getItem("hasan_logged_in");
    if (loggedIn === "true") {
      setIsLoggedIn(true);
      fetchDocuments();
    } else {
      setLoading(false);
    }
  }, []);

  const handleProfilePicUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !file.type.startsWith("image/")) return;
    setUploadingPic(true);
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
      const uploadRes = await fetch("https://upload.imagekit.io/api/v1/files/upload", { method: "POST", body: formData });
      if (!uploadRes.ok) throw new Error("Upload failed");
      const uploadData = await uploadRes.json();
      await fetch("/api/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ avatarUrl: uploadData.url }),
      });
      setProfilePic(uploadData.url);
    } catch (error) {
      console.error(error);
      alert("Failed to upload profile picture.");
    } finally {
      setUploadingPic(false);
    }
  };

  const handleProfilePicDelete = async () => {
    if (!confirm("Are you sure you want to delete the profile picture?")) return;
    setUploadingPic(true);
    try {
      await fetch("/api/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ avatarUrl: null }),
      });
      setProfilePic(null);
    } catch (error) {
      console.error(error);
      alert("Failed to delete profile picture.");
    } finally {
      setUploadingPic(false);
    }
  };

  const fetchDocuments = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/documents");
      const data = await res.json();
      setDocuments(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Delete "${title}"? This cannot be undone.`)) return;
    try {
      const res = await fetch(`/api/documents/${id}`, { method: "DELETE" });
      if (res.ok) {
        setDocuments((prev) => prev.filter((d) => d._id !== id));
      }
    } catch (error) {
      console.error(error);
    }
  };

  const getFileIcon = (fileType: string) => {
    if (fileType === "application/pdf") return <FileText className="w-5 h-5 text-red-400" />;
    if (fileType.includes("word")) return <FileText className="w-5 h-5 text-blue-400" />;
    if (fileType.includes("spreadsheet") || fileType.includes("excel")) return <FileText className="w-5 h-5 text-green-400" />;
    if (fileType.includes("presentation") || fileType.includes("powerpoint")) return <FileText className="w-5 h-5 text-orange-400" />;
    return <File className="w-5 h-5 text-muted" />;
  };

  if (!mounted) return null;

  if (!isLoggedIn) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="w-20 h-20 rounded-full flex items-center justify-center bg-red-500/20 border border-red-500/40 mb-6">
          <Lock className="w-10 h-10 text-red-400" />
        </div>
        <h2 className="text-2xl font-bold mb-2">Access Denied</h2>
        <p className="text-muted max-w-md">
          This page is for admins only. Please log in using the <strong>Login</strong> button in the top navigation bar.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold mb-2 text-gradient">Admin Panel</h1>
          <p className="text-muted">Manage your uploaded documents.</p>
        </div>
        <div className="px-4 py-2 rounded-full bg-primary-600/20 border border-primary-500/30 text-primary-300 text-sm font-medium">
          {documents.length} document{documents.length !== 1 ? "s" : ""}
        </div>
      </div>

      {/* Profile Picture Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card rounded-3xl p-6 flex items-center gap-6"
      >
        <button
          onClick={() => picInputRef.current?.click()}
          disabled={uploadingPic}
          className="relative group shrink-0"
        >
          <div className="w-20 h-20 rounded-full overflow-hidden ring-2 ring-white/10 group-hover:ring-primary-500/50 transition-all">
            {profilePic ? (
              <Image src={profilePic} alt="Profile" width={80} height={80} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-white/10 flex items-center justify-center">
                <ImageIcon className="w-8 h-8 text-muted" />
              </div>
            )}
          </div>
          <div className="absolute inset-0 rounded-full bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            {uploadingPic ? (
              <Loader2 className="w-6 h-6 animate-spin text-white" />
            ) : (
              <Camera className="w-6 h-6 text-white" />
            )}
          </div>
        </button>
        <div className="flex-1">
          <h2 className="text-lg font-semibold">Profile Picture</h2>
          <p className="text-sm text-muted mt-1">Click the image to upload or change your profile picture.</p>
        </div>
        <div className="flex flex-col items-end gap-2">
          {profilePic && (
            <button
              onClick={handleProfilePicDelete}
              disabled={uploadingPic}
              className="inline-flex items-center gap-2 rounded-full border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs font-medium text-red-300 hover:bg-red-500/20 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              Delete
            </button>
          )}
          <input ref={picInputRef} type="file" accept="image/*" className="hidden" onChange={handleProfilePicUpload} />
        </div>
      </motion.div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-10 h-10 animate-spin text-primary-500" />
        </div>
      ) : documents.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-20 text-muted glass-card rounded-3xl"
        >
          <FileText className="w-16 h-16 mx-auto mb-4 opacity-50" />
          <p className="text-xl font-medium mb-2">No documents yet</p>
          <p>Upload documents from the Upload page.</p>
        </motion.div>
      ) : (
        <div className="flex flex-col gap-4">
          {documents.map((doc, i) => (
            <motion.div
              key={doc._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="glass-card rounded-2xl p-5 flex items-center gap-4 hover:bg-white/[0.04] transition-colors"
            >
              <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center shrink-0">
                {getFileIcon(doc.fileType)}
              </div>

              <div className="flex-1 min-w-0">
                <p className="font-semibold truncate">{doc.title}</p>
                <div className="flex items-center gap-3 text-xs text-muted mt-1">
                  <span className="uppercase">{doc.fileType.split("/").pop()}</span>
                  {doc.fileSize && <span>{(doc.fileSize / 1024 / 1024).toFixed(2)} MB</span>}
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {format(new Date(doc.uploadDate), "PPP")}
                  </span>
                </div>
                {doc.description && (
                  <p className="text-sm text-muted mt-1 line-clamp-1">{doc.description}</p>
                )}
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <a
                  href={doc.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 rounded-xl bg-white/5 hover:bg-primary-500/20 text-muted hover:text-primary-400 transition-colors"
                  title="Open"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
                <a
                  href={`${doc.url}?ik-attachment=true`}
                  download
                  className="p-2.5 rounded-xl bg-white/5 hover:bg-secondary-500/20 text-muted hover:text-secondary-400 transition-colors"
                  title="Download"
                >
                  <Download className="w-4 h-4" />
                </a>
                <button
                  onClick={() => handleDelete(doc._id, doc.title)}
                  className="p-2.5 rounded-xl bg-white/5 hover:bg-red-500/20 text-muted hover:text-red-400 transition-colors"
                  title="Delete"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
