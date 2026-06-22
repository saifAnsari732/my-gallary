"use client";

import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { motion, AnimatePresence } from "framer-motion";
import { UploadCloud, X, Loader2, CheckCircle2, FileText, File } from "lucide-react";

export default function DocumentUploadZone() {
  const [files, setFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    description: "",
  });

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setFiles((prev) => [...prev, ...acceptedFiles]);
    }
  }, []);

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/pdf": [".pdf"],
      "application/msword": [".doc"],
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"],
      "text/plain": [".txt"],
      "application/vnd.ms-excel": [".xls"],
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [".xlsx"],
      "application/vnd.ms-powerpoint": [".ppt"],
      "application/vnd.openxmlformats-officedocument.presentationml.presentation": [".pptx"],
    },
  });

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (files.length === 0) return;
    await doUpload();
  };

  const doUpload = async () => {
    setUploading(true);

    try {
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
        formDataToSend.append("folder", "/digital-gallery/documents");
        formDataToSend.append("useUniqueFileName", "true");

        const uploadRes = await fetch("https://upload.imagekit.io/api/v1/files/upload", {
          method: "POST",
          body: formDataToSend,
        });

        if (!uploadRes.ok) {
          const errText = await uploadRes.text();
          throw new Error("ImageKit upload failed for " + file.name + ": " + errText);
        }
        const uploadData = await uploadRes.json();

        const dbRes = await fetch("/api/documents", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: file.name.split(".")[0],
            description: formData.description,
            url: uploadData.url,
            fileId: uploadData.fileId,
            fileType: file.type,
            fileSize: file.size,
            uploadDate: new Date().toISOString(),
          }),
        });

        if (!dbRes.ok) throw new Error("DB save failed for " + file.name);
      }));

      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        setFiles([]);
        setFormData({ description: "" });
      }, 3000);

    } catch (error) {
      console.error(error);
      alert("Upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const getFileIcon = (file: File) => {
    if (file.type === "application/pdf") return <FileText className="w-8 h-8 text-red-400" />;
    if (file.type.includes("word")) return <FileText className="w-8 h-8 text-blue-400" />;
    if (file.type.includes("spreadsheet") || file.type.includes("excel")) return <FileText className="w-8 h-8 text-green-400" />;
    if (file.type.includes("presentation") || file.type.includes("powerpoint")) return <FileText className="w-8 h-8 text-orange-400" />;
    return <File className="w-8 h-8 text-muted" />;
  };

  return (
    <div className="glass-card rounded-3xl p-8 relative">
      {success ? (
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center justify-center py-20 text-center">
          <CheckCircle2 className="w-20 h-20 text-secondary-500 mb-6" />
          <h2 className="text-3xl font-bold mb-2">Upload Successful!</h2>
          <p className="text-muted">Your documents have been saved.</p>
        </motion.div>
      ) : (
        <form onSubmit={handleFormSubmit} className="flex flex-col gap-8">
          {files.length === 0 ? (
            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-colors ${
                isDragActive ? "border-secondary-500 bg-secondary-500/10" : "border-white/20 hover:border-white/40 hover:bg-white/5"
              }`}
            >
              <input {...getInputProps()} />
              <UploadCloud className="w-12 h-12 text-secondary-400 mx-auto mb-4" />
              <p className="text-lg font-medium mb-2">Drag &amp; drop your documents here</p>
              <p className="text-sm text-muted">PDF, DOC, DOCX, TXT, XLS, XLSX, PPT, PPTX</p>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-colors ${
                  isDragActive ? "border-secondary-500 bg-secondary-500/10" : "border-white/20 hover:border-white/40 hover:bg-white/5"
                }`}
              >
                <input {...getInputProps()} />
                <p className="text-sm font-medium">Click or drag more documents to add</p>
              </div>
              <div className="flex flex-col gap-3">
                {files.map((file, i) => (
                  <div key={i} className="flex items-center gap-4 p-4 rounded-2xl glass bg-black/30">
                    {getFileIcon(file)}
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{file.name}</p>
                      <p className="text-xs text-muted">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeFile(i)}
                      className="p-2 rounded-full hover:bg-red-500/20 text-muted hover:text-red-400 transition-colors"
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
                <div className="p-4 rounded-xl bg-secondary-500/10 border border-secondary-500/20 text-sm text-secondary-200">
                  <span className="font-semibold text-white">Note:</span> The description below will be applied to all {files.length} uploaded documents.
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-secondary-500 focus:outline-none transition-colors resize-none h-24"
                    placeholder="Enter a description for all documents..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={uploading}
                  className="mt-4 w-full py-4 rounded-xl bg-gradient-to-r from-secondary-600 to-cyan-600 font-semibold hover:from-secondary-500 hover:to-cyan-500 transition-all disabled:opacity-50 flex justify-center items-center gap-2 shadow-[0_0_20px_rgba(6,182,212,0.3)]"
                >
                  {uploading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" /> Uploading {files.length} document{files.length > 1 ? "s" : ""}...
                    </>
                  ) : (
                    <>
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
