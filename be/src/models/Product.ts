import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IProduct extends Document {
  name: string;
  slug: string;
  description: string;
  price: number;
  discountPrice?: number;
  category_id: mongoose.Types.ObjectId;
  brand: string;
  images: string[];
  specs: Map<string, string>;
  gifts: string[];
  stock: number;
  status: 'active' | 'inactive' | 'out_of_stock';
  condition: string;
  isHotSale?: boolean;
  flashSalePrice?: number;
}

const ProductSchema = new Schema<IProduct>(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    discountPrice: { type: Number },
    category_id: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
    brand: { type: String, required: true },
    images: { type: [String], default: [] },
    specs: { type: Map, of: String, default: {} },
    gifts: { type: [String], default: [] },
    stock: { type: Number, required: true, default: 0 },
    status: { type: String, enum: ['active', 'inactive', 'out_of_stock'], default: 'active' },
    condition: { type: String, default: 'Đã qua sử dụng (Đẹp 99%)' },
    isHotSale: { type: Boolean, default: false },
    flashSalePrice: { type: Number },
  },
  { timestamps: true }
);

// Indexes for faster queries
ProductSchema.index({ status: 1 });
ProductSchema.index({ category_id: 1, status: 1 });
ProductSchema.index({ createdAt: -1 });

export const Product: Model<IProduct> = mongoose.models.Product || mongoose.model<IProduct>('Product', ProductSchema);
