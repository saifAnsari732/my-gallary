"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { Loader2, Download, Eye, Calendar, Tag } from "lucide-react";

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

export default function GalleryGrid() {
  const router = useRouter();
  const [images, setImages] = useState<ImageRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState("All");

  const categories = ["All", "General", "Nature", "Architecture", "People", "Tech", "Abstract"];

  useEffect(() => {
    const fetchImages = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/images?category=${category}`);
        const data = await res.json();
        setImages(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchImages();
  }, [category]);

  return (
    <div className="flex flex-col gap-8">
      {/* Filters */}
      <div className="flex flex-wrap items-center justify-center gap-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
              category === cat
                ? "bg-primary-600 text-white shadow-[0_0_15px_rgba(124,58,237,0.5)]"
                : "glass hover:bg-white/10 text-muted"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-10 h-10 animate-spin text-primary-500" />
        </div>
      ) : images.length === 0 ? (
        <div className="text-center py-20 text-muted">
          No images found in this category.
        </div>
      ) : (
        <motion.div 
          layout
          className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-6 space-y-6"
        >
          <AnimatePresence>
            {images.map((img) => (
              <motion.div
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                key={img._id}
                onClick={() => router.push(`/gallery/${img._id}`)}
                className="relative group rounded-2xl overflow-hidden glass-card break-inside-avoid cursor-pointer"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img 
                  src={img.url} 
                  alt={img.title} 
                  loading="lazy"
                  className="w-full h-auto object-cover transform transition-transform duration-700 group-hover:scale-110" 
                />
                
                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                  <div className="flex items-center gap-2 text-xs text-muted mb-4 translate-y-4 group-hover:translate-y-0 transition-transform duration-300 delay-75">
                    <Calendar className="w-3 h-3" />
                    <span>{format(new Date(img.uploadDate), "PPP")}</span>
                    {img.tags.length > 0 && (
                      <>
                        <span className="mx-1">•</span>
                        <Tag className="w-3 h-3" />
                        <span>{img.tags[0]}</span>
                      </>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-3 translate-y-4 group-hover:translate-y-0 transition-transform duration-300 delay-150">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        router.push(`/gallery/${img._id}`);
                      }}
                      className="p-3 rounded-full bg-white/20 hover:bg-primary-500 backdrop-blur-md transition-colors"
                    >
                      <Eye className="w-4 h-4 text-white" />
                    </button>
                    <a
                      href={`${img.url}?ik-attachment=true`}
                      download
                      onClick={(e) => e.stopPropagation()}
                      className="p-3 rounded-full bg-white/20 hover:bg-secondary-500 backdrop-blur-md transition-colors"
                    >
                      <Download className="w-4 h-4 text-white" />
                    </a>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  );
}
