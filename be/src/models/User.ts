import mongoose, { Schema, Document, Model } from 'mongoose';

export const ROLES = {
  ADMIN: 'admin',
  STAFF: 'staff',
  CUSTOMER: 'customer'
};

export interface IUser extends Document {
  name: string;
  email: string;
  password?: string;
  role: string;
  address?: string;
  phone?: string;
  permissions?: string[];
  resetPasswordOtp?: string;
  resetPasswordExpires?: Date;
}

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String }, // Optional for OAuth
    role: { type: String, enum: Object.values(ROLES), default: ROLES.CUSTOMER },
    address: { type: String },
    phone: { type: String },
    permissions: { type: [String], default: [] },
    resetPasswordOtp: { type: String },
    resetPasswordExpires: { type: Date }
  },
  { timestamps: true }
);

export const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
