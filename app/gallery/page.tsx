import GalleryGrid from "@/components/gallery/GalleryGrid";

export default function GalleryPage() {
  return (
    <div className="flex flex-col gap-8">
      <div className="text-center max-w-2xl mx-auto mb-8">
        <h1 className="text-4xl font-bold mb-4 text-gradient">Your Universe</h1>
        <p className="text-muted">Explore all your stored memories.</p>
      </div>
      <GalleryGrid />
    </div>
  );
}
