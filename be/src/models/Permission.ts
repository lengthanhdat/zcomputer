import mongoose, { Schema, Document } from 'mongoose';

export interface IPermission extends Document {
  name: string;
  code: string;
}

const PermissionSchema = new Schema<IPermission>({
  name: { type: String, required: true },
  code: { type: String, required: true, unique: true },
}, { timestamps: true });

export const Permission = mongoose.model<IPermission>('Permission', PermissionSchema);
