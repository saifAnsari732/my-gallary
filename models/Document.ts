import mongoose, { Schema, Document as MongoDoc } from "mongoose";

export interface IDocument extends MongoDoc {
  title: string;
  description: string;
  url: string;
  fileId: string;
  fileType: string;
  fileSize: number;
  uploadDate: Date;
  createdAt: Date;
}

const DocumentSchema = new Schema<IDocument>({
  title: { type: String, required: true },
  description: { type: String },
  url: { type: String, required: true },
  fileId: { type: String, required: true },
  fileType: { type: String, required: true },
  fileSize: { type: Number },
  uploadDate: { type: Date, required: true },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.models.Document || mongoose.model<IDocument>("Document", DocumentSchema);
