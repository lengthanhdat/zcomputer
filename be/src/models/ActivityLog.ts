import mongoose, { Schema, Document } from 'mongoose';

export interface IActivityLog extends Document {
  userId: string;
  userName: string;
  userEmail: string;
  userRole: string;
  action: string; // CREATE, UPDATE, DELETE, LOGIN, etc.
  entity: string; // Product, Order, User, etc.
  entityId?: string;
  entityDetails?: any; // The whole object at the time
  details?: any; // Just what changed
  ipAddress?: string;
  userAgent?: string;
  createdAt: Date;
}

const ActivityLogSchema = new Schema<IActivityLog>(
  {
    userId: { type: String, required: true },
    userName: { type: String, required: true },
    userEmail: { type: String, required: true },
    userRole: { type: String, required: true },
    action: { type: String, required: true },
    entity: { type: String, required: true },
    entityId: { type: String },
    entityDetails: { type: Schema.Types.Mixed },
    details: { type: Schema.Types.Mixed },
    ipAddress: { type: String },
    userAgent: { type: String },
  },
  { timestamps: true }
);

export const ActivityLog = mongoose.models.ActivityLog || mongoose.model<IActivityLog>('ActivityLog', ActivityLogSchema);
