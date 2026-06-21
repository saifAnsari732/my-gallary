import UploadZone from "@/components/upload/UploadZone";

export default function UploadPage() {
  return (
    <div className="max-w-3xl mx-auto flex flex-col gap-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4 text-gradient">Upload to Gallery</h1>
        <p className="text-muted">Add new memories to your digital universe.</p>
      </div>
      <UploadZone />
    </div>
  );
}
