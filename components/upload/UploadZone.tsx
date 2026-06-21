"use client";

import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { motion, AnimatePresence } from "framer-motion";
import { UploadCloud, X, Loader2, CheckCircle2, Lock, Eye, EyeOff, ShieldAlert } from "lucide-react";

// ✅ HARDCODED PASSWORD - Change this to your desired password
const UPLOAD_PASSWORD = "hasan@123";

export default function UploadZone() {
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [success, setSuccess] = useState(false);

  // Password modal states
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [shake, setShake] = useState(false);

  const [formData, setFormData] = useState({
    description: "",
    category: "General",
    tags: "",
  });

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setFiles((prev) => [...prev, ...acceptedFiles]);
      const objectUrls = acceptedFiles.map(f => URL.createObjectURL(f));
      setPreviews((prev) => [...prev, ...objectUrls]);
    }
  }, []);

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
    setPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [] },
  });

  // Called when form is submitted → show password modal first
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (files.length === 0) return;
    setPasswordInput("");
    setPasswordError(false);
    setShowPasswordModal(true);
  };

  // Called after password is confirmed
  const handlePasswordConfirm = async () => {
    if (passwordInput !== UPLOAD_PASSWORD) {
      setPasswordError(true);
      setShake(true);
      setTimeout(() => setShake(false), 600);
      setPasswordInput("");
      return;
    }

    setShowPasswordModal(false);
    setPasswordInput("");
    setPasswordError(false);
    await doUpload();
  };

  const doUpload = async () => {
    setUploading(true);

    try {
      const tagsArray = formData.tags.split(",").map(t => t.trim()).filter(Boolean);

      await Promise.all(files.map(async (file) => {
        const authRes = await fetch("/api/imagekit/auth");
        const authData = await authRes.json();

        const formDataToSend = new FormData();
        formDataToSend.append("file", file);
        formDataToSend.append("publicKey", process.env.NEXT_PUBLIC_PUBLIC_KEY || "public_IV45jUAH3+Sean3qPo3IR5bxqH4=");
        formDataToSend.append("signature", authData.signature);
        formDataToSend.append("expire", authData.expire.toString());
        formDataToSend.append("token", authData.token);
        formDataToSend.append("fileName", file.name);
        formDataToSend.append("folder", "/digital-gallery");

        const uploadRes = await fetch("https://upload.imagekit.io/api/v1/files/upload", {
          method: "POST",
          body: formDataToSend,
        });

        if (!uploadRes.ok) {
          const errText = await uploadRes.text();
          throw new Error("ImageKit upload failed for " + file.name + ": " + errText);
        }
        const uploadData = await uploadRes.json();

        const dbRes = await fetch("/api/images", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: file.name.split(".")[0],
            description: formData.description,
            url: uploadData.url,
            fileId: uploadData.fileId,
            uploadDate: new Date().toISOString(),
            category: formData.category,
            tags: tagsArray,
          }),
        });

        if (!dbRes.ok) throw new Error("DB save failed for " + file.name);
      }));

      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        setFiles([]);
        setPreviews([]);
        setFormData({ description: "", category: "General", tags: "" });
      }, 3000);

    } catch (error) {
      console.error(error);
      alert("Upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="glass-card rounded-3xl p-8 relative">

      {/* ===== PASSWORD MODAL ===== */}
      <AnimatePresence>
        {showPasswordModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md px-4"
            onClick={(e) => { if (e.target === e.currentTarget) setShowPasswordModal(false); }}
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
                <h2 className="text-xl font-bold text-white">Enter Upload Password</h2>
                <p className="text-sm text-center text-muted">
                  {passwordError
                    ? "❌ Wrong password! Please try again."
                    : "This action is protected. Enter the password to proceed."}
                </p>
              </div>

              {/* Input */}
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={passwordInput}
                  onChange={(e) => { setPasswordInput(e.target.value); setPasswordError(false); }}
                  onKeyDown={(e) => { if (e.key === "Enter") handlePasswordConfirm(); }}
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
                  onClick={() => { setShowPasswordModal(false); setPasswordInput(""); setPasswordError(false); }}
                  className="flex-1 py-3 rounded-xl border border-white/10 text-muted hover:bg-white/5 hover:text-white transition-all font-medium"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handlePasswordConfirm}
                  className="flex-1 py-3 rounded-xl bg-gradient-to-r from-primary-600 to-secondary-600 hover:from-primary-500 hover:to-secondary-500 text-white font-semibold transition-all shadow-[0_0_15px_rgba(124,58,237,0.3)]"
                >
                  Confirm
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ===== MAIN UPLOAD FORM ===== */}
      {success ? (
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center justify-center py-20 text-center">
          <CheckCircle2 className="w-20 h-20 text-secondary-500 mb-6" />
          <h2 className="text-3xl font-bold mb-2">Upload Successful!</h2>
          <p className="text-muted">Your images have been added to the gallery.</p>
        </motion.div>
      ) : (
        <form onSubmit={handleFormSubmit} className="flex flex-col gap-8">
          {files.length === 0 ? (
            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-colors ${
                isDragActive ? "border-primary-500 bg-primary-500/10" : "border-white/20 hover:border-white/40 hover:bg-white/5"
              }`}
            >
              <input {...getInputProps()} />
              <UploadCloud className="w-12 h-12 text-primary-400 mx-auto mb-4" />
              <p className="text-lg font-medium mb-2">Drag &amp; drop your images here</p>
              <p className="text-sm text-muted">or click to browse files (Bulk Upload Supported)</p>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-colors ${
                  isDragActive ? "border-primary-500 bg-primary-500/10" : "border-white/20 hover:border-white/40 hover:bg-white/5"
                }`}
              >
                <input {...getInputProps()} />
                <p className="text-sm font-medium">Click or drag more images to add</p>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {previews.map((preview, i) => (
                  <div key={preview} className="relative rounded-2xl overflow-hidden glass aspect-square flex items-center justify-center bg-black/50 group">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={preview} alt={`Preview ${i}`} className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); removeFile(i); }}
                      className="absolute top-2 right-2 p-2 rounded-full bg-black/50 hover:bg-red-500/80 text-white transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <AnimatePresence>
            {files.length > 0 && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="flex flex-col gap-5 overflow-hidden"
              >
                <div className="p-4 rounded-xl bg-primary-500/10 border border-primary-500/20 text-sm text-primary-200">
                  <span className="font-semibold text-white">Bulk Edit Mode:</span> The properties below will be applied to all {files.length} uploaded images. The original filenames will be used as their individual titles.
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-primary-500 focus:outline-none transition-colors resize-none h-24"
                    placeholder="Enter a description for all images..."
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium mb-2">Category</label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-[#111827] border border-white/10 focus:border-primary-500 focus:outline-none transition-colors"
                    >
                      <option value="General">General</option>
                      <option value="Nature">Nature</option>
                      <option value="Architecture">Architecture</option>
                      <option value="People">People</option>
                      <option value="Tech">Tech</option>
                      <option value="Abstract">Abstract</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Tags (comma separated)</label>
                    <input
                      type="text"
                      value={formData.tags}
                      onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-primary-500 focus:outline-none transition-colors"
                      placeholder="e.g. 3d, neon, dark"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={uploading}
                  className="mt-4 w-full py-4 rounded-xl bg-gradient-to-r from-primary-600 to-secondary-600 font-semibold hover:from-primary-500 hover:to-secondary-500 transition-all disabled:opacity-50 flex justify-center items-center gap-2 shadow-[0_0_20px_rgba(124,58,237,0.3)]"
                >
                  {uploading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" /> Uploading {files.length} image{files.length > 1 ? "s" : ""}...
                    </>
                  ) : (
                    <>
                      <Lock className="w-4 h-4" />
                      <UploadCloud className="w-5 h-5" /> Confirm Upload ({files.length})
                    </>
                  )}
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </form>
      )}
    </div>
  );
}
