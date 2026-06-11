import mongoose, { Schema, Document } from 'mongoose';

export interface IRole extends Document {
  name: string;
  permissions: mongoose.Types.ObjectId[];
}

const RoleSchema = new Schema<IRole>({
  name: { type: String, required: true, unique: true },
  permissions: [{ type: Schema.Types.ObjectId, ref: 'Permission' }]
}, { timestamps: true });

export const Role = mongoose.model<IRole>('Role', RoleSchema);
