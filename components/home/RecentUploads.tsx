import Link from "next/link";
import { ArrowRight } from "lucide-react";
import dbConnect from "@/lib/db";
import ImageModel from "@/models/Image";
import RecentImageCard from "./RecentImageCard";

export default async function RecentUploads() {
  await dbConnect();
  const images = await ImageModel.find({}).sort({ uploadDate: -1 }).limit(8).lean();

  if (!images || images.length === 0) return null;

  // Serialize MongoDB documents to plain objects
  const serialized = images.map((img) => ({
    _id: (img._id as object).toString(),
    title: img.title,
    url: img.url,
    category: img.category,
  }));

  return (
    <section className="flex flex-col gap-12">
      <div className="text-center">
        <h2 className="text-3xl md:text-5xl font-bold mb-4">
          Recent <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-secondary-400">Uploads</span>
        </h2>
        <p className="text-muted max-w-2xl mx-auto">Your latest memories, beautifully displayed.</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
        {serialized.map((img, i) => (
          <RecentImageCard key={img._id} img={img} index={i} />
        ))}
      </div>

      {/* View All Button */}
      <div className="flex justify-center">
        <Link
          href="/gallery"
          className="px-8 py-3 rounded-full glass hover:bg-white/10 text-white font-medium transition-all hover:scale-105 flex items-center gap-2 border border-white/10"
        >
          View All Images <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </section>
  );
}
