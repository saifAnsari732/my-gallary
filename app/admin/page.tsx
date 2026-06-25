"use client";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Lock, Loader2, FileText, Trash2, Download, ExternalLink, Calendar, File, Camera, Image as ImageIcon, Tag } from "lucide-react";
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

interface ImageRecord {
  _id: string;
  title: string;
  description: string;
  url: string;
  fileId: string;
  uploadDate: string;
  category: string;
  tags: string[];
}

export default function AdminPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [documents, setDocuments] = useState<DocumentRecord[]>([]);
  const [images, setImages] = useState<ImageRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingImages, setLoadingImages] = useState(true);
  const [deletingImageId, setDeletingImageId] = useState<string | null>(null);
  const [profilePic, setProfilePic] = useState<string | null>(null);
  const [uploadingPic, setUploadingPic] = useState(false);
  const [activeTab, setActiveTab] = useState<"images" | "documents">("images");
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
      fetchImages();
    } else {
      setLoading(false);
      setLoadingImages(false);
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
      if (res.ok && Array.isArray(data)) {
        setDocuments(data);
      } else {
        console.error("Failed to load documents: Data is not an array or response is not OK", data);
        setDocuments([]);
      }
    } catch (error) {
      console.error(error);
      setDocuments([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchImages = async () => {
    setLoadingImages(true);
    try {
      const res = await fetch("/api/images");
      const data = await res.json();
      if (res.ok && Array.isArray(data)) {
        setImages(data);
      } else {
        console.error("Failed to load images: Data is not an array or response is not OK", data);
        setImages([]);
      }
    } catch (error) {
      console.error(error);
      setImages([]);
    } finally {
      setLoadingImages(false);
    }
  };

  const handleDeleteDoc = async (id: string, title: string) => {
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

  const handleDeleteImage = async (id: string, title: string) => {
    if (!confirm(`Delete image "${title}"? This will permanently remove it from the gallery and cloud storage.`)) return;
    setDeletingImageId(id);
    try {
      const res = await fetch(`/api/images/${id}`, { method: "DELETE" });
      if (res.ok) {
        setImages((prev) => prev.filter((img) => img._id !== id));
      } else {
        const errorData = await res.json();
        alert(`Failed to delete: ${errorData.error || "Unknown error"}`);
      }
    } catch (error) {
      console.error(error);
      alert("Failed to delete image.");
    } finally {
      setDeletingImageId(null);
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
          {/* <p className="text-muted">Manage your uploaded images & documents.</p> */}
        </div>
        <div className="flex items-center gap-3">
          <div className="px-4 py-2 rounded-full bg-primary-600/20 border border-primary-500/30 text-primary-300 text-sm font-medium">
            {images.length} image{images.length !== 1 ? "s" : ""}
          </div>
          <div className="px-4 py-2 rounded-full bg-secondary-600/20 border border-secondary-500/30 text-secondary-300 text-sm font-medium">
            {documents.length} document{documents.length !== 1 ? "s" : ""}
          </div>
        </div>
      </div>

    

      {/* Tab Switcher */}
      <div className="flex items-center gap-2 bg-white/5 rounded-2xl p-1.5 max-w-xs w-full border border-white/10">
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
          <FileText className="w-4 h-4" /> Docs
        </button>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === "images" ? (
          <motion.div
            key="images-tab"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.25 }}
          >
            {/* Images Section */}
            {loadingImages ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="w-10 h-10 animate-spin text-primary-500" />
              </div>
            ) : images.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-20 text-muted glass-card rounded-3xl"
              >
                <ImageIcon className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p className="text-xl font-medium mb-2">No images yet</p>
                <p>Upload images from the Upload page.</p>
              </motion.div>
            ) : (
              <div className="flex flex-col gap-4">
                {images.map((img, i) => (
                  <motion.div
                    key={img._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="glass-card rounded-2xl p-4 flex items-center gap-4 hover:bg-white/[0.04] transition-colors"
                  >
                    {/* Small Image Thumbnail */}
                    <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0 relative bg-white/5">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={img.url}
                        alt={img.title}
                        loading="lazy"
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className="font-semibold truncate text-sm sm:text-base">{img.title}</p>
                      <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs text-muted mt-1">
                        <span className="px-2 py-0.5 rounded-full bg-primary-500/15 text-primary-300 text-[10px] font-medium">
                          {img.category}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {format(new Date(img.uploadDate), "PP")}
                        </span>
                      </div>
                      {img.tags && img.tags.length > 0 && (
                        <div className="flex items-center gap-1 mt-1.5 flex-wrap">
                          <Tag className="w-3 h-3 text-muted shrink-0" />
                          {img.tags.slice(0, 3).map((tag) => (
                            <span key={tag} className="text-[10px] px-1.5 py-0.5 rounded bg-white/5 text-muted">
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <a
                        href={img.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2.5 rounded-xl bg-white/5 hover:bg-primary-500/20 text-muted hover:text-primary-400 transition-colors"
                        title="Open"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                      <button
                        onClick={() => handleDeleteImage(img._id, img.title)}
                        disabled={deletingImageId === img._id}
                        className="p-2.5 rounded-xl bg-white/5 hover:bg-red-500/20 text-muted hover:text-red-400 transition-colors"
                        title="Delete image"
                      >
                        {deletingImageId === img._id ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Trash2 className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        ) : (
          <motion.div
            key="documents-tab"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.25 }}
          >
            {/* Documents Section */}
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
                        onClick={() => handleDeleteDoc(doc._id, doc.title)}
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
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
