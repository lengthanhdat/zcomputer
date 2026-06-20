import mongoose, { Schema, Document, Model } from 'mongoose';

export interface INews extends Document {
  title: string;
  slug: string;
  summary: string;
  content: string;
  thumbnail?: string;
  category: string;
  tags: string[];
  views: number;
  isPublished: boolean;
  author?: mongoose.Types.ObjectId;
  authorName?: string;
  createdAt: Date;
  updatedAt: Date;
}

const NewsSchema = new Schema<INews>(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    summary: { type: String, required: true },
    content: { type: String, required: true },
    thumbnail: { type: String },
    category: { type: String, required: true, default: 'Tin công nghệ' },
    tags: { type: [String], default: [] },
    views: { type: Number, default: 0 },
    isPublished: { type: Boolean, default: true },
    author: { type: Schema.Types.ObjectId, ref: 'User' },
    authorName: { type: String, default: 'Admin ZComputer' },
  },
  { timestamps: true }
);

NewsSchema.index({ slug: 1 });
NewsSchema.index({ isPublished: 1 });
NewsSchema.index({ createdAt: -1 });
NewsSchema.index({ category: 1 });

export const News: Model<INews> = mongoose.models.News || mongoose.model<INews>('News', NewsSchema);
