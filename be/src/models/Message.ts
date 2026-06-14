import mongoose, { Schema, Document } from 'mongoose';

export interface IMessage extends Document {
  senderId?: mongoose.Types.ObjectId; // null if anonymous user (maybe they use sessionId)
  sessionId: string; // for identifying users who are not logged in
  isAdmin: boolean; // true if message is from admin
  content: string;
  isRead: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const messageSchema: Schema = new Schema({
  senderId: { type: Schema.Types.ObjectId, ref: 'User', required: false },
  sessionId: { type: String, required: true },
  isAdmin: { type: Boolean, default: false },
  content: { type: String, required: true },
  isRead: { type: Boolean, default: false },
}, { timestamps: true });

// Index for fast querying by sessionId
messageSchema.index({ sessionId: 1, createdAt: 1 });

export const Message = mongoose.model<IMessage>('Message', messageSchema);
