import mongoose from 'mongoose';

const bannerSchema = new mongoose.Schema({
  title: { type: String, required: false, default: "" },
  image: { type: String, required: true },
  link: { type: String },
  position: { type: String, enum: ['main', 'sub'], default: 'main' },
  isActive: { type: Boolean, default: true },
  order: { type: Number, default: 0 }
}, { timestamps: true });

export const Banner = mongoose.model('Banner', bannerSchema);
