"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, Calendar, Tag, Download, Share2 } from "lucide-react";
import { format } from "date-fns";

interface ImageDetailProps {
  image: {
    _id: string;
    title: string;
    description: string;
    url: string;
    uploadDate: string;
    category: string;
    tags: string[];
  };
}

export default function ImageDetail({ image }: ImageDetailProps) {
  const handleShare = async () => {
    try {
      await navigator.share({
        title: image.title,
        text: image.description,
        url: window.location.href,
      });
    } catch (err) {
      console.log("Share failed", err);
    }
  };

  return (
    <div className="max-w-6xl mx-auto flex flex-col gap-8">
      <Link href="/gallery" className="inline-flex items-center gap-2 text-muted hover:text-foreground transition-colors w-fit">
        <ArrowLeft className="w-4 h-4" /> Back to Gallery
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="lg:col-span-2 rounded-3xl overflow-hidden glass-card p-2"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img 
            src={image.url} 
            alt={image.title} 
            className="w-full h-auto rounded-2xl object-contain bg-black/50" 
          />
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex flex-col gap-8"
        >
          <div className="overflow-hidden">
            <p className="text-lg text-muted leading-relaxed break-words">
              {image.description || "No description provided."}
            </p>
          </div>

          <div className="flex flex-col gap-4 p-6 rounded-2xl glass bg-white/5">
            <div className="flex items-center justify-between">
              <span className="text-muted text-sm uppercase tracking-wider">Category</span>
              <span className="font-medium text-secondary-400">{image.category}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted text-sm uppercase tracking-wider">Date</span>
              <span className="font-medium flex items-center gap-2">
                <Calendar className="w-4 h-4 text-primary-400" />
                {format(new Date(image.uploadDate), "PPP")}
              </span>
            </div>
          </div>

          {image.tags.length > 0 && (
            <div>
              <h3 className="text-sm font-medium text-muted uppercase tracking-wider mb-3">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {image.tags.map(tag => (
                  <span key={tag} className="px-3 py-1 rounded-full glass text-sm flex items-center gap-1">
                    <Tag className="w-3 h-3 text-primary-400" /> {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="flex gap-4 mt-auto">
            <a 
              href={`${image.url}?ik-attachment=true`} 
              download
              className="flex-1 py-4 rounded-xl bg-primary-600 hover:bg-primary-500 font-semibold transition-colors flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(124,58,237,0.3)]"
            >
              <Download className="w-5 h-5" /> Download
            </a>
            <button 
              onClick={handleShare}
              className="px-6 py-4 rounded-xl glass hover:bg-white/10 font-semibold transition-colors flex items-center justify-center gap-2"
            >
              <Share2 className="w-5 h-5" />
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
