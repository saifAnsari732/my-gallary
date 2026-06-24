import mongoose, { Schema, Document } from "mongoose";

export interface IProfile extends Document {
  key: string;
  avatarUrl?: string;
  updatedAt: Date;
}

const ProfileSchema = new Schema<IProfile>({
  key: { type: String, required: true, unique: true },
  avatarUrl: { type: String },
  updatedAt: { type: Date, default: Date.now },
});

export default mongoose.models.Profile || mongoose.model<IProfile>("Profile", ProfileSchema);
