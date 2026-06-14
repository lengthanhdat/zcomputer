import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IVideoReview extends Document {
  title?: string;
  channel?: string;
  videoThumbnail?: string;
  youtubeLink?: string;
  tiktokLink?: string;
  videoFileUrl?: string;
  redirectLink?: string;
  product_id?: mongoose.Types.ObjectId;
}

const VideoReviewSchema = new Schema<IVideoReview>(
  {
    title: { type: String },
    channel: { type: String },
    videoThumbnail: { type: String },
    youtubeLink: { type: String },
    tiktokLink: { type: String },
    videoFileUrl: { type: String },
    redirectLink: { type: String },
    product_id: { type: Schema.Types.ObjectId, ref: 'Product', required: false },
  },
  { timestamps: true }
);

export const VideoReview: Model<IVideoReview> = mongoose.models.VideoReview || mongoose.model<IVideoReview>('VideoReview', VideoReviewSchema);
