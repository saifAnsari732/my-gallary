import mongoose, { Schema, Document } from "mongoose";

export interface IImage extends Document {
  title: string;
  description: string;
  url: string;
  fileId: string;
  uploadDate: Date;
  category: string;
  tags: string[];
  createdAt: Date;
}

const ImageSchema = new Schema<IImage>({
  title: { type: String, required: true },
  description: { type: String },
  url: { type: String, required: true },
  fileId: { type: String, required: true },
  uploadDate: { type: Date, required: true },
  category: { type: String, default: 'General' },
  tags: [{ type: String }],
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.models.Image || mongoose.model<IImage>("Image", ImageSchema);
