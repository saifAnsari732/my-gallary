import { notFound } from "next/navigation";
import dbConnect from "@/lib/db";
import ImageModel from "@/models/Image";
import ImageDetail from "@/components/gallery/ImageDetail";

export default async function ImageDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  await dbConnect();
  const imageDoc = await ImageModel.findById(id).lean();
  
  if (!imageDoc) {
    notFound();
  }

  // Serialize Mongoose doc
  const image = {
    _id: imageDoc._id.toString(),
    title: imageDoc.title,
    description: imageDoc.description,
    url: imageDoc.url,
    fileId: imageDoc.fileId,
    uploadDate: imageDoc.uploadDate.toISOString(),
    category: imageDoc.category,
    tags: imageDoc.tags || [],
    createdAt: imageDoc.createdAt.toISOString(),
  };

  return <ImageDetail image={image} />;
}
