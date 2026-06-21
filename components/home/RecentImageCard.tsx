"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

interface ImageRecord {
  _id: string;
  title: string;
  url: string;
  category: string;
}

export default function RecentImageCard({ img, index }: { img: ImageRecord; index: number }) {
  const router = useRouter();

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.08, duration: 0.4 }}
      whileHover={{ y: -8, scale: 1.02 }}
      onClick={() => router.push(`/gallery/${img._id}`)}
      className="relative group rounded-2xl overflow-hidden cursor-pointer aspect-square glass-card"
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={img.url}
        alt={img.title}
        loading="lazy"
        className="w-full h-full object-cover transform transition-transform duration-700 group-hover:scale-110"
      />

      {/* Hover Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
        <span className="px-3 py-1 rounded-full text-xs font-medium bg-primary-500/30 backdrop-blur-md border border-primary-500/20 text-white">
          {img.category}
        </span>
      </div>

      {/* Glow effect on hover */}
      <div className="absolute inset-0 rounded-2xl ring-1 ring-white/5 group-hover:ring-primary-500/30 transition-all duration-300" />
    </motion.div>
  );
}
